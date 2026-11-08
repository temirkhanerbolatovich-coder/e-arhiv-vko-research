"""Extract guestbook posts from the HTML already saved by the crawler."""
import csv
import hashlib
import json
from pathlib import Path
import sqlite3
from urllib.parse import parse_qs, urlsplit

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
DEST = ROOT / 'datasets' / 'comments'
DEST.mkdir(parents=True, exist_ok=True)
db = sqlite3.connect(f'file:{(ROOT / "metadata/crawl_state.sqlite3").as_posix()}?mode=ro', uri=True)
rows = db.execute("SELECT url,local FROM queue WHERE status='ok' AND lower(url) LIKE '%/guestbook%' ORDER BY rowid").fetchall()
db.close()
unique = {}
problems = []
occurrence_count = 0
with (DEST / 'occurrences.jsonl').open('w', encoding='utf-8') as stream:
    for url, local in rows:
        try:
            page = json.loads((ROOT / local).read_text(encoding='utf-8'))
            html_path = page['html']
            soup = BeautifulSoup((ROOT / html_path).read_bytes(), 'html.parser')
            listing = soup.select_one('#guest-list')
            if listing is None:
                raise ValueError('guest-list not found')
            parsed = urlsplit(url)
            query = parse_qs(parsed.query, keep_blank_values=True)
            for position, block in enumerate(listing.find_all('div', recursive=False), 1):
                guest = block.select_one('.guest')
                message = block.select_one('.msg')
                if guest is None or message is None:
                    raise ValueError(f'Guest or message missing at position {position}')
                author = guest.find('a')
                post = {
                    'date_and_author_as_displayed': guest.get_text(' ', strip=True),
                    'author': author.get_text(' ', strip=True) if author else '',
                    'contact_link': author.get('href', '') if author else '',
                    'text': message.get_text('\n', strip=True),
                    'message_html': message.decode_contents(),
                }
                identity = hashlib.sha256(json.dumps(post, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()
                origin = {'url': url, 'html': html_path, 'page_json': local, 'position': position,
                          'language': parsed.path.split('/')[1], 'group': query.get('group', [''])[0],
                          'page': query.get('Page', ['1'])[0].strip()}
                stream.write(json.dumps({'identity': identity, **post, 'source': origin}, ensure_ascii=False) + '\n')
                unique.setdefault(identity, {'identity': identity, **post, 'sources': []})['sources'].append(origin)
                occurrence_count += 1
        except (OSError, ValueError, KeyError) as exc:
            problems.append({'url': url, 'error': str(exc)})

records = list(unique.values())
(DEST / 'comments_unique.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
with (DEST / 'comments_unique.csv').open('w', encoding='utf-8-sig', newline='') as out:
    fields = ['identity', 'date_and_author_as_displayed', 'author', 'contact_link', 'text', 'first_source_url', 'occurrences']
    writer = csv.DictWriter(out, fieldnames=fields, extrasaction='ignore')
    writer.writeheader()
    for record in records:
        writer.writerow({**record, 'first_source_url': record['sources'][0]['url'], 'occurrences': len(record['sources'])})
summary = {'guestbook_page_urls': len(rows), 'post_occurrences': occurrence_count,
           'identical_content_groups': len(records), 'page_errors': problems,
           'deduplication': 'Exact displayed date/author, contact link, text and message HTML; all occurrences remain in JSONL. Identical postings may be separate submissions.',
           'scope': 'Only saved public guestbook pages. Does not establish coverage of undiscovered comments or dynamic interfaces.',
           'privacy': 'Posts may contain personal information and contact details.'}
(DEST / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
