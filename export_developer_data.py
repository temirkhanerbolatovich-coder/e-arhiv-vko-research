"""Export a reproducible, source-linked developer snapshot of the archive.

Run after ``extract_guestbook.py`` and after the crawler has stopped. SQLite is
read in one transaction; this script never downloads or changes original files.
"""
import csv
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile

ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / 'metadata' / 'crawl_state.sqlite3'
DESTINATION = ROOT / 'datasets' / 'developer'
DESTINATION.mkdir(parents=True, exist_ok=True)


def save_jsonl(stream, record):
    stream.write(json.dumps(record, ensure_ascii=False, separators=(',', ':')) + '\n')


def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def archive_path(relative):
    path = (ROOT / relative).resolve()
    if not path.is_relative_to(ROOT.resolve()):
        raise ValueError('path escapes archive root')
    return path


def export():
    generated = datetime.now(timezone.utc).isoformat(timespec='seconds')
    errors = []
    counts = {'pages': 0, 'files': 0, 'links': 0, 'comment_occurrences': 0}
    with tempfile.TemporaryDirectory(prefix='.developer-export-', dir=DESTINATION) as temporary:
        stage = Path(temporary)
        connection = sqlite3.connect(f'{DATABASE.resolve().as_uri()}?mode=ro', uri=True)
        connection.row_factory = sqlite3.Row
        connection.execute('BEGIN')
        with (stage / 'pages.jsonl').open('w', encoding='utf-8', newline='\n') as pages, \
             (stage / 'files.jsonl').open('w', encoding='utf-8', newline='\n') as files, \
             (stage / 'items.csv').open('w', encoding='utf-8-sig', newline='') as index:
            columns = ['kind', 'url', 'status', 'http', 'title', 'lang', 'parent', 'visited', 'local', 'bytes', 'sha256', 'type', 'error', 'duplicate_of']
            writer = csv.DictWriter(index, fieldnames=columns, extrasaction='ignore')
            writer.writeheader()
            for row in connection.execute('SELECT * FROM queue ORDER BY rowid'):
                item = dict(row)
                writer.writerow(item)
                if item['kind'] == 'page':
                    record = {'url': item['url'], 'status': item['status'], 'http_status': item['http'],
                              'error': item['error'], 'visited_at': item['visited'], 'title': item['title'],
                              'language': item['lang'], 'discovered_from': item['parent'],
                              'page_json': item['local'] or None, 'html': None, 'markdown': None,
                              'text': None, 'headings': [], 'tables': []}
                    if item['status'] == 'ok':
                        try:
                            page = json.loads(archive_path(item['local']).read_text(encoding='utf-8'))
                            if page.get('source_url') != item['url']:
                                raise ValueError('source URL mismatch')
                            for field in ('html', 'markdown', 'text', 'headings', 'tables'):
                                record[field] = page.get(field)
                            for field in ('html', 'markdown'):
                                if not record[field] or not archive_path(record[field]).is_file():
                                    raise ValueError(f'missing {field} file')
                        except (ValueError, KeyError, OSError, TypeError) as exc:
                            record['export_error'] = str(exc)
                            errors.append({'url': item['url'], 'error': str(exc)})
                    save_jsonl(pages, record)
                    counts['pages'] += 1
                elif item['kind'] == 'file':
                    record = {'url': item['url'], 'status': item['status'], 'http_status': item['http'],
                              'error': item['error'], 'visited_at': item['visited'], 'name': item['title'],
                              'discovered_from': item['parent'], 'local_path': item['local'] or None,
                              'byte_size': item['bytes'], 'sha256': item['sha256'] or None,
                              'mime_type': item['type'] or None, 'duplicate_of': item['duplicate_of'] or None}
                    if item['status'] == 'ok' and (not item['local'] or not archive_path(item['local']).is_file()):
                        errors.append({'url': item['url'], 'error': 'missing file'})
                        record['export_error'] = 'missing file'
                    save_jsonl(files, record)
                    counts['files'] += 1
                else:
                    errors.append({'url': item['url'], 'error': 'unknown kind: ' + str(item['kind'])})
        with (stage / 'links.jsonl').open('w', encoding='utf-8', newline='\n') as links:
            for row in connection.execute('''SELECT l.source, l.target, l.text, l.status AS link_status,
                                             q.status AS target_status, q.kind AS target_kind
                                             FROM links AS l LEFT JOIN queue AS q ON q.url=l.target ORDER BY l.rowid'''):
                save_jsonl(links, dict(row))
                counts['links'] += 1
        connection.close()

        comments = ROOT / 'datasets' / 'comments' / 'occurrences.jsonl'
        comment_summary = ROOT / 'datasets' / 'comments' / 'summary.json'
        if comments.is_file() and comment_summary.is_file():
            with comments.open('r', encoding='utf-8') as source, \
                 (stage / 'comment_occurrences.jsonl').open('w', encoding='utf-8', newline='\n') as output:
                for line in source:
                    entry = json.loads(line)
                    if not isinstance(entry.get('source'), dict) or not entry['source'].get('url'):
                        raise ValueError('comment without source URL')
                    save_jsonl(output, entry)
                    counts['comment_occurrences'] += 1
            summary = json.loads(comment_summary.read_text(encoding='utf-8'))
            if summary['post_occurrences'] != counts['comment_occurrences']:
                raise ValueError('comment summary does not match occurrences')
            if summary.get('page_errors'):
                errors.append({'source': 'guestbook', 'error': 'guestbook extraction has page errors'})
            comment_source = {'path': str(comments.relative_to(ROOT).as_posix()), 'sha256': sha256(comments),
                              'last_modified_utc': datetime.fromtimestamp(comments.stat().st_mtime, timezone.utc).isoformat(timespec='seconds')}
        else:
            comment_source = None
            errors.append({'source': 'guestbook', 'error': 'comments export not found; run extract_guestbook.py'})

        output_files = sorted(p for p in stage.iterdir() if p.is_file())
        manifest = {'schema_version': '1.0', 'generated_at_utc': generated, 'counts': counts,
                    'source': 'metadata/crawl_state.sqlite3 (single SQLite read transaction)',
                    'comment_source': comment_source, 'errors': errors,
                    'files': {p.name: {'sha256': sha256(p), 'bytes': p.stat().st_size} for p in output_files},
                    'limitations': ['Public-site crawl is incomplete where items are pending or failed.',
                                    'Page text may include navigation and other boilerplate.',
                                    'Comments may contain personal data and repeated appearances.',
                                    'SHA-256 from the index is not independently recalculated by this exporter.']}
        (stage / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        for path in stage.iterdir():
            path.replace(DESTINATION / path.name)
    print(json.dumps({'counts': counts, 'errors': len(errors)}, ensure_ascii=False))
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(export())
