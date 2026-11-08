"""Inventory albums and captions from observed public gallery pages.

Use --fetch only when no other crawler is sending requests to the site. The
script reads the list of album IDs from archived gallery HTML and fetches only
those visible album pages; it never requests photos or photo-detail endpoints.
"""
import csv
import datetime
import hashlib
import json
import sqlite3
import sys
import time
from pathlib import Path
from urllib.parse import urlencode

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
DATA = ROOT / 'datasets' / 'gallery'
HTML = ROOT / 'pages' / 'html' / 'gallery'
DATA.mkdir(parents=True, exist_ok=True)
HTML.mkdir(parents=True, exist_ok=True)
FETCH = '--fetch' in sys.argv
BASE = 'http://e-arhiv.vko.gov.kz'
GALLERY_URL = BASE + '/ru/SiteGallery'
now = lambda: datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=5))).isoformat(timespec='seconds')
db = sqlite3.connect(f'file:{(ROOT / "metadata/crawl_state.sqlite3").as_posix()}?mode=ro', uri=True)
db.row_factory = sqlite3.Row
source = db.execute("SELECT * FROM queue WHERE url=? AND status='ok'", (GALLERY_URL,)).fetchone()
if source is None:
    raise SystemExit('Saved gallery listing is unavailable')
saved_json = json.loads((ROOT / source['local']).read_text(encoding='utf-8'))
listing_html = saved_json['html']
soup = BeautifulSoup((ROOT / listing_html).read_bytes(), 'html.parser')
albums = []
seen = set()
for item in soup.select('.list-item[data-id]'):
    album_id = item.get('data-id', '')
    if not album_id.isdecimal() or album_id in seen:
        continue
    seen.add(album_id)
    title_node = item.select_one('.item-title')
    albums.append({'album_id': album_id, 'title': title_node.get_text(' ', strip=True) if title_node else '',
                   'album_url': BASE + '/ru/SiteGallery/Album?' + urlencode({'albumId': album_id}),
                   'listing_url': GALLERY_URL, 'listing_html': listing_html})

session = requests.Session()
session.trust_env = False
session.headers['User-Agent'] = 'Mozilla/5.0 (compatible; PublicArchiveResearch/1.0; respectful rate)'
photos = []
for album in albums:
    url = album['album_url']
    record = db.execute("SELECT * FROM queue WHERE url=? AND status='ok'", (url,)).fetchone()
    file_path = HTML / ('album_' + album['album_id'] + '.html')
    if record:
        page = json.loads((ROOT / record['local']).read_text(encoding='utf-8'))
        file_path = ROOT / page['html']
        album.update(status='saved_from_main_crawl', visited_at=record['visited'])
    elif file_path.is_file():
        album.update(status='saved_from_gallery_crawl', visited_at='see fetch log')
    elif FETCH:
        last_error = ''
        for attempt in range(2):
            time.sleep(1.5 if attempt == 0 else 10)
            try:
                response = session.get(url, timeout=(10, 25), allow_redirects=False)
                if response.status_code != 200:
                    last_error = f'HTTP {response.status_code}'
                    if response.status_code in (429, 500, 502, 503, 504):
                        continue
                    break
                if 'text/html' not in response.headers.get('Content-Type', '').lower() or not response.content:
                    last_error = 'Unexpected content type or empty response'
                    break
                file_path.write_bytes(response.content)
                album.update(status='ok', visited_at=now())
                break
            except requests.RequestException as exc:
                last_error = f'{type(exc).__name__}: {exc}'
        if not file_path.is_file():
            album.update(status='failed', error=last_error, visited_at=now())
    else:
        album['status'] = 'not_fetched'

    if file_path.is_file():
        raw = file_path.read_bytes()
        album['html_local'] = file_path.relative_to(ROOT).as_posix()
        album['html_sha256'] = hashlib.sha256(raw).hexdigest()
        page = BeautifulSoup(raw, 'html.parser')
        template = page.select_one('script#gallery-photos-src')
        if template is None:
            album.update(status='parse_failed', error='gallery-photos-src template missing')
        else:
            fragment = BeautifulSoup(template.string or template.decode_contents(), 'html.parser')
            items = fragment.select('span[data-id]')
            album['photo_count'] = len(items)
            for index, item in enumerate(items, 1):
                photo_id = item.get('data-id', '')
                if not photo_id.isdecimal():
                    album.update(status='parse_failed', error=f'Invalid photo ID at position {index}')
                    continue
                photos.append({'album_id': album['album_id'], 'album_title': album['title'],
                               'photo_id': photo_id, 'position': index, 'caption': item.get_text(' ', strip=True),
                               'group': item.get('data-group', ''), 'group_name': item.get('data-group-name', ''),
                               'thumbnail_url_as_listed': item.get('data-thumb', ''),
                               'album_url': url, 'source_html': album['html_local']})

db.close()
(DATA / 'albums.json').write_text(json.dumps(albums, ensure_ascii=False, indent=2), encoding='utf-8')
(DATA / 'photos.json').write_text(json.dumps(photos, ensure_ascii=False, indent=2), encoding='utf-8')
def write_csv(name, rows, columns):
    with (DATA / name).open('w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)
write_csv('albums.csv', albums, ['album_id', 'title', 'album_url', 'status', 'visited_at', 'html_local', 'html_sha256', 'photo_count', 'error', 'listing_url', 'listing_html'])
write_csv('photos.csv', photos, ['album_id', 'album_title', 'photo_id', 'position', 'caption', 'group', 'group_name', 'thumbnail_url_as_listed', 'album_url', 'source_html'])
summary = {'generated_at': now(), 'listing_url': GALLERY_URL, 'listing_html': listing_html,
           'albums_discovered': len(albums), 'albums_processed': sum(a['status'] in ('ok', 'saved_from_main_crawl', 'saved_from_gallery_crawl') for a in albums),
           'photo_entries': len(photos), 'album_statuses': {s: sum(a['status'] == s for a in albums) for s in sorted({a['status'] for a in albums})},
           'limitations': 'Only album pages linked by IDs in the saved Russian gallery listing. Image and photo-detail endpoints were not requested; template captions may be incomplete. No coverage of unlisted albums is implied.'}
(DATA / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
