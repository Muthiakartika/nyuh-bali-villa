"""Resolve live CSS background images to their owning content sections."""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup
p = Path(__file__).resolve().parents[1] / '.next/content-audit'
out = {}
for f in p.glob('*.live.html'):
    name = f.name.removesuffix('.live.html')
    s = BeautifulSoup(f.read_text(encoding='utf-8'), 'html.parser')
    out[name] = []
    for link in s.select('link[rel=stylesheet]'):
        css = p / ('css-' + re.sub(r'\W+', '_', link['href']) + '.txt')
        if not css.exists(): continue
        for selector, body in re.findall(r'([^{}]+)\{([^{}]+)\}', css.read_text(encoding='utf-8')):
            if 'background-image:' not in body: continue
            try: el = s.select_one(selector)
            except Exception: continue
            if el is None: continue
            urls = re.findall(r'https://[^)]+', body)
            if not urls: continue
            parent = el
            for i in range(4):
                if parent.find(['h1','h2','h3']): break
                parent = parent.parent or parent
            out[name].append([selector, urls, parent.get_text(' ', strip=True)[:100]])
(p / 'backgrounds.json').write_text(json.dumps(out, indent=2), encoding='utf-8')
print('Backgrounds:', len(out))
