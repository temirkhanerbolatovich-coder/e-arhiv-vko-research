"""Read-only validation of the planning package; not an application test."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET
import hashlib
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs'
errors = []
checks = 0


def check(condition, message):
    global checks
    checks += 1
    if not condition:
        errors.append(message)


def main():
    model = json.loads((DOCS / 'database/schema.json').read_text(encoding='utf-8'))
    for name, table in model.items():
        fields = {x['name']: x for x in table['fields']}
        check(len(fields) == len(table['fields']), f'{name}: duplicate field')
        check('id' in fields and fields['id']['required'], f'{name}: missing PK')
        for cols in table['unique']:
            check(all(c in fields for c in cols), f'{name}: invalid unique {cols}')
        for field in fields.values():
            if not field['ref']:
                continue
            target, column = field['ref'].split('.')
            target_fields = {x['name']: x for x in model.get(target, {}).get('fields', [])}
            check(column in target_fields, f'{name}.{field["name"]}: broken FK')
            if column in target_fields:
                check(field['type'] == target_fields[column]['type'], f'{name}: FK type mismatch')
    seen = set()
    for diagram in sorted((DOCS / 'database/diagrams').glob('*.mmd')):
        text = diagram.read_text(encoding='utf-8')
        entities = re.findall(r'^    ([A-Z_]+) \{', text, re.M)
        for entity in entities:
            check(entity.lower() in model, f'{diagram.name}: unknown table {entity}')
            seen.add(entity.lower())
        for extension in ['svg', 'png']:
            image = diagram.with_suffix('.' + extension)
            check(image.exists() and image.stat().st_size > 100, f'Missing/empty {image.name}')
            if image.exists() and extension == 'svg':
                ET.fromstring(image.read_bytes())
            if image.exists() and extension == 'png':
                check(image.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'), f'Invalid PNG {image.name}')
    check(seen == set(model), 'Tables absent from diagrams: ' + ', '.join(sorted(set(model)-seen)))
    sources = DOCS / 'requirements/source'
    meta = json.loads((sources / 'manifest.json').read_text(encoding='utf-8'))
    original = sources / meta['original_filename']
    check(hashlib.sha256(original.read_bytes()).hexdigest() == meta['sha256'], 'DOCX hash mismatch')
    with zipfile.ZipFile(original) as archive:
        xml = ET.fromstring(archive.read('word/document.xml'))
    ns = {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = [''.join(t.text or '' for t in p.findall('.//w:t',ns)) for p in xml.findall('.//w:body//w:p',ns)]
    paragraphs = [p for p in paragraphs if p.strip()]
    extracted = (sources/'tz-full-text.md').read_text(encoding='utf-8')
    actual = [x.strip('\n') for x in re.split(r'<a id="p\d{3}"></a>\n\n', extracted)[1:]]
    check(actual == paragraphs, 'Extracted text differs from DOCX paragraphs')
    check(len(actual) == meta['nonempty_paragraphs'] == 674, 'Unexpected source paragraph count')
    files = list(DOCS.rglob('*.md')) + [ROOT/'AGENTS.md', ROOT/'CHANGELOG.md']
    for markdown in files:
        text = markdown.read_text(encoding='utf-8')
        for raw in re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', text):
            dest = raw.strip('<>')
            split = urlsplit(dest)
            if split.scheme or dest.startswith('#'):
                continue
            path = (markdown.parent/unquote(split.path)).resolve()
            check(path.exists(), f'{markdown.relative_to(ROOT)}: broken link {dest}')
            if path.exists() and split.fragment and path.suffix == '.md':
                # This package uses explicit paragraph anchors for traceability.
                if re.fullmatch(r'p\d{3}',split.fragment):
                    check(f'id="{split.fragment}"' in path.read_text(encoding='utf-8'), f'Broken anchor {dest}')
    forbidden = re.compile(r'(exec-[0-9a-f-]+\.(?:png|jpg)|mockup|wireframe)', re.I)
    check(not any(forbidden.search(str(p)) for p in DOCS.rglob('*')), 'Unapproved design asset found')
    if errors:
        print('\n'.join(errors))
        raise SystemExit(1)
    print(f'PASS: {checks} documentation/model checks; {len(model)} tables; {len(seen)} covered by diagrams; 674 source paragraphs')


if __name__ == '__main__':
    main()
