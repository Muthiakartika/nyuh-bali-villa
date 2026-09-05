"""Compare rendered routes with the live site; cache evidence in .next/content-audit."""
import concurrent.futures
import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse, parse_qs, unquote
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.next/content-audit'
CACHE.mkdir(parents=True, exist_ok=True)
LIVE = 'https://nyuhbalivillas.com'

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=70) as r:
        return r.read().decode('utf-8', errors='replace')

def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()

def image_key(url):
    if '/_next/image?' in url:
        url = parse_qs(urlparse(url).query).get('url', [url])[0]
    url = unquote(url).split('?')[0]
    return re.sub(r'-\d+x\d+(?=\.)', '', url.split('/uploads/')[-1]).removesuffix('.webp')

def inspect(html, base, live=False):
    soup = BeautifulSoup(html, 'html.parser')
    css = '\n'.join(x.get_text() for x in soup.find_all('style'))
    if live:
        for link in soup.select('link[rel="stylesheet"]'):
            url = urljoin(base, link.get('href', ''))
            if url.startswith(LIVE + '/wp-content/'):
                try:
                    name = CACHE / ('css-' + re.sub(r'\W+', '_', url) + '.txt')
                    if not name.exists(): name.write_text(fetch(url), encoding='utf-8')
                    css += name.read_text(encoding='utf-8')
                except Exception: pass
    images = set()
    for tag in soup.select('img'):
        for key in ['src', 'data-src', 'data-lazy-src']:
            if tag.get(key) and '/uploads/' in tag[key]: images.add(image_key(tag[key]))
        if tag.get('src', '').startswith('/_next/image'): images.add(image_key(tag['src']))
    css += '\n' + '\n'.join(t.get('style', '') for t in soup.select('[style]'))
    for url in re.findall(r'url\([\s\"\']*([^\)\"\']+)', css):
        if '/uploads/' in url and re.search(r'\.(jpg|jpeg|png|webp|gif|svg)(\?|$)', url, re.I): images.add(image_key(url))
    for tag in soup.select('script,style,noscript,svg'): tag.decompose()
    scope = soup.find('main') or soup
    text = norm(soup.get_text(' ', strip=True))
    chunks = []
    for t in scope.select('p,li,h1,h2,h3,h4,td,figcaption'):
        s = t.get_text(' ', strip=True)
        if len(s) > 45 and not t.select('p,li'): chunks.append(s)
    return {'text': text, 'chunks': chunks, 'images': sorted(images)}

def audit(path):
    key = path.strip('/').replace('/', '__') or 'home'
    try:
        livefile = CACHE / (key + '.live.html')
        if not livefile.exists(): livefile.write_text(fetch(LIVE + path + ('/' if path != '/' else '')), encoding='utf-8')
        local = fetch('http://localhost:3001' + path)
        (CACHE / (key + '.local.html')).write_text(local, encoding='utf-8')
        a = inspect(livefile.read_text(encoding='utf-8'), LIVE + path, True)
        b = inspect(local, 'http://localhost:3001' + path)
        return {'path': path, 'unmatched_text': [s for s in b['chunks'] if norm(s) not in a['text']], 'local_only_images': sorted(set(b['images']) - set(a['images'])), 'live_only_images': sorted(set(a['images']) - set(b['images'])), 'live_images': a['images']}
    except Exception as e:
        return {'path': path, 'error': str(e)}

if __name__ == '__main__':
    routes = re.findall(r'^  "(/[^\"]*)":', (ROOT / 'src/data/seo.ts').read_text(encoding='utf-8'), re.M)
    if '--retry-images' not in sys.argv:
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            results = list(pool.map(audit, routes))
        (CACHE / 'results.json').write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding='utf-8')
        for r in results:
            print(r['path'], r.get('error', ''), 'text:', len(r.get('unmatched_text', [])), 'images:', len(r.get('local_only_images', [])))
        print('Audited', len(results), 'routes. Evidence:', CACHE)
    if '--check-images' in sys.argv or '--retry-images' in sys.argv:
        urls = set()
        for file in CACHE.glob('*.local.html'):
            soup = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
            for tag in soup.select('img'):
                url = tag.get('src', '')
                if '/_next/image?' in url: url = parse_qs(urlparse(url).query).get('url', [''])[0]
                if url.startswith(LIVE + '/wp-content/uploads/'): urls.add(url)
        def check(url):
            try:
                with urllib.request.urlopen(urllib.request.Request(url, method='HEAD'), timeout=30) as response:
                    return {'url': url, 'status': response.status, 'type': response.headers.get('Content-Type')}
            except Exception as e: return {'url': url, 'error': str(e)}
        previous = {}
        if '--retry-images' in sys.argv and (CACHE/'image-status.json').exists():
            previous = {x['url']: x for x in json.loads((CACHE/'image-status.json').read_text(encoding='utf-8')) if not x.get('error')}
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            refreshed = list(pool.map(check, sorted(urls - previous.keys())))
        checked = [previous[url] for url in sorted(urls & previous.keys())] + refreshed
        (CACHE/'image-status.json').write_text(json.dumps(checked, indent=2), encoding='utf-8')
        print('Checked',len(checked),'images; failures:',[x for x in checked if x.get('error')])
