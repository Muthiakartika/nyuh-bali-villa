"""Print live content and the CSS image context for manual reconciliation."""
import importlib.util
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.next/content-audit'
def norm(s): return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()
results = []
for f in CACHE.glob('*.live.html'):
    local = f.with_name(f.name.replace('.live.', '.local.'))
    if not local.exists(): continue
    s = BeautifulSoup(f.read_text(encoding='utf-8'), 'html.parser')
    b = BeautifulSoup(local.read_text(encoding='utf-8'), 'html.parser')
    for t in b.select('script,style'): t.decompose()
    text = norm(b.get_text(' ', strip=True))
    scope = s.select_one('.ct-inner-content') or s
    missing = []
    for t in scope.select('.ct-text-block,h1,h2,h3,h4,li,p'):
        if t.select('p,li,.ct-text-block'): continue
        value = t.get_text(' ', strip=True)
        if len(value) > 55 and norm(value) not in text: missing.append(value)
    if missing: results.append({'page': f.stem.replace('.live',''), 'missing': missing})
(CACHE / 'missing-text.json').write_text(json.dumps(results, indent=2,ensure_ascii=False),encoding='utf-8')
for r in results:
    print(r['page'], len(r['missing']))
