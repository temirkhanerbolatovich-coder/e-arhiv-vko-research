/**
 * Собирает data/seed.json из исходных материалов репозитория (не меняя их):
 *  - филиалы: таблица заказчика (10.11.2026) + контакты главного архива + геокодирование OSM;
 *  - фонды: каталог фондов 2018 года (история названий), газеты 1935–2017;
 *  - документы: архивные шифры «Основание: Ф…, оп…, д…» из публикаций старого сайта;
 *  - фото: подписи фотогалереи (без тестовых альбомов);
 *  - страницы и новости: выгрузка сайта (повторяющиеся меню вырезаются по частоте строк);
 *  - события: календари памятных дат 2022–2026.
 * Неизвестные поля остаются null. Демонстрационные записи помечаются is_demo.
 */
import { createHash } from 'node:crypto';
import { createReadStream, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import xlsx from 'xlsx';
import { normalizeFundNumber } from '../src/domain/shelfmark.ts';
import type { SeedBranch, SeedData, SeedResource } from '../src/db/seed-types.ts';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const at = (...parts: string[]) => path.join(root, ...parts);
const customer = at('docs/data/customer/2026-11-10');

const id = (...parts: (string | number)[]) => createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 16);
const clean = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim();
const nullable = (value: unknown) => clean(value) || null;

// ---------- CSV ----------
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const readCsv = (file: string) => parseCsv(readFileSync(file, 'utf8').replace(/^﻿/, ''));

function yearsFrom(text: string): [number | null, number | null] {
  const years = [...text.matchAll(/(1[6-9]\d{2}|20[0-2]\d)/g)].map((m) => Number(m[1]));
  if (!years.length) return [null, null];
  return [Math.min(...years), Math.max(...years)];
}

// ---------- Филиалы ----------
function buildBranches(): SeedBranch[] {
  const geo = JSON.parse(readFileSync(at('backend/data/branch-geocode.raw.json'), 'utf8')) as Record<string, { lat: number; lng: number; type: string } | null>;
  const precision = (key: string): SeedBranch['coords_precision'] => {
    const type = geo[key]?.type;
    if (key === 'zaysan') return 'town';
    return type === 'yes' || type === 'government' ? 'building' : 'street';
  };
  // Зайсан: OSM нашёл только населённый пункт (адрес улицы не найден).
  const zaysanTown = { lat: 47.4672312, lng: 84.8718159, type: 'town' };
  const coords = (key: string) => (key === 'zaysan' ? zaysanTown : geo[key]);

  const keyByName: Array<[RegExp, string, string, string]> = [
    [/Алтай/, 'altay', 'Алтай ауданының филиалы', 'Altay district branch'],
    [/Глубоков/, 'glubokoe', 'Глубокое аудандық филиалы', 'Glubokoe district branch'],
    [/Зайсан/, 'zaysan', 'Зайсан аудандық филиалы', 'Zaysan district branch'],
    [/Катон/, 'katon', 'Катонқарағай аудандық филиалы', 'Katon-Karagay district branch'],
    [/Курчум|Күршім/, 'kurchum', 'Күршім аудандық филиалы', 'Kurchum district branch'],
    [/Марқакөл|Маркакол/, 'markakol', 'Марқакөл ауданының филиалы', 'Markakol district branch'],
    [/Риддер/, 'ridder', 'Риддер қалалық филиалы', 'Ridder city branch'],
    [/Самар/, 'samar', 'Самар ауданының филиалы', 'Samar district branch'],
    [/Тарбагатай/, 'tarbagatay', 'Тарбағатай аудандық филиалы', 'Tarbagatay district branch'],
    [/Улан/, 'ulan', 'Ұлан аудандық филиалы', 'Ulan district branch'],
    [/Үлкен|Улкен/, 'ulken', 'Үлкен Нарын ауданының филиалы', 'Ulken Naryn district branch'],
    [/личному составу/, 'personnel', 'Өскемен қалалық жеке құрам бойынша филиалы', 'Ust-Kamenogorsk city branch for personnel records'],
    [/Шемонаих/, 'shemonaiha', 'Шемонаиха аудандық филиалы', 'Shemonaikha district branch'],
  ];
  const workbook = xlsx.readFile(path.join(customer, 'originals/Адреса и контакты филиалов.xls'));
  const sheet = workbook.Sheets['Книга'];
  if (!sheet) throw new Error('Лист «Книга» не найден');
  const rows = xlsx.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });
  const branches: SeedBranch[] = [];
  for (const row of rows) {
    const name = clean(row[1]);
    const match = keyByName.find(([pattern]) => pattern.test(name));
    if (!match || !/филиал/i.test(name)) continue;
    const [, key, kk, en] = match;
    const email = clean(row[5]);
    // Две почты в таблице заказчика выглядят как опечатки домена — не публикуем до сверки.
    const suspicious = /alimvko\.gov\.kz|\.qov\.kz/.test(email);
    const address = clean(row[3]);
    const c = coords(key);
    branches.push({
      id: key, kind: 'branch',
      name_ru: name.split(/\s{2,}|КГУ/)[0]!.trim(), name_kk: kk, name_en: en,
      address, locality: address.split(',').slice(0, 3).join(',').replace(/^ВКО,\s*/, '') || null,
      phone: nullable(row[4]), email: suspicious ? null : nullable(email),
      hours: 'Пн–Пт 9:00–18:00 (уточняется)',
      lat: c?.lat ?? null, lng: c?.lng ?? null, coords_precision: c ? precision(key) : null,
      coords_source: c ? 'OpenStreetMap Nominatim, автоматическое геокодирование адреса 11.11.2026 — требует проверки' : null,
      show_on_map: Boolean(c),
    });
  }
  const main = geo['main'];
  branches.unshift({
    id: 'main', kind: 'main',
    name_ru: 'Государственный архив Восточно-Казахстанской области', name_kk: 'Шығыс Қазақстан облысының мемлекеттік архиві',
    name_en: 'State Archive of East Kazakhstan Region',
    address: 'г. Усть-Каменогорск, ул. Бейбітшілік, 26/1 (Головкова, 26/1)', locality: 'Усть-Каменогорск',
    phone: '8 (7232) 25-59-76', email: 'arhiv-ukg@yandex.kz',
    hours: 'Пн–Пт 8:00–17:00; читальный зал Пн–Пт 9:00–16:00',
    lat: main?.lat ?? null, lng: main?.lng ?? null, coords_precision: main ? 'building' : null,
    coords_source: main ? 'OpenStreetMap Nominatim, автоматическое геокодирование адреса 11.11.2026 — требует проверки' : null,
    show_on_map: Boolean(main),
  });
  return branches;
}

// ---------- Фонды 2018 ----------
function buildFunds(resources: SeedResource[], fundNames: SeedData['fund_names']): Map<string, string> {
  const rows = readCsv(at('datasets/structured_data/funds_2018.csv')).slice(1);
  const byNumber = new Map<string, { names: Array<[string, string | null]>; category: string; ownership: string; units: string; from: number | null; to: number | null }>();
  let current: string | null = null;
  for (const row of rows) {
    const number = clean(row[2]);
    const name = clean(row[6]);
    if (number) current = normalizeFundNumber(number);
    if (!current || !name) continue;
    const entry = byNumber.get(current) ?? { names: [], category: '', ownership: '', units: '', from: null, to: null };
    entry.names.push([name, nullable(row[5])]);
    entry.category ||= clean(row[3]).replace(/\.0$/, '');
    entry.ownership ||= clean(row[4]);
    entry.units ||= clean(row[8]);
    const from = Number.parseInt(clean(row[10]), 10);
    const to = Number.parseInt(clean(row[11]), 10);
    if (Number.isFinite(from)) entry.from = entry.from === null ? from : Math.min(entry.from, from);
    if (Number.isFinite(to)) entry.to = entry.to === null ? to : Math.max(entry.to, to);
    byNumber.set(current, entry);
  }
  const fundIds = new Map<string, string>();
  for (const [number, entry] of byNumber) {
    const resourceId = 'fund-' + id(number);
    fundIds.set(number.toLocaleLowerCase('ru'), resourceId);
    const latest = entry.names[entry.names.length - 1]![0];
    const [periodFrom, periodTo] = yearsFrom(entry.names.map(([, p]) => p ?? '').join(' '));
    const from = entry.from ?? periodFrom;
    const to = entry.to ?? periodTo;
    const isPersonal = /семейный фонд|личный фонд|^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+вич|вна\b/.test(latest);
    resources.push({
      id: resourceId, kind: 'fund', parent_id: null, branch_id: 'main',
      title: latest, reference: `Ф. ${number}`, fund_no: number,
      year_from: from, year_to: to && from && to < from ? from : to,
      period_label: from || to ? `${from ?? '…'}–${to ?? '…'}` : null,
      doc_type: isPersonal ? 'Документы личного происхождения' : 'Документы организаций',
      description: [
        entry.units && `Единиц хранения: ${entry.units.replace(/\.0$/, '')}.`,
        entry.names.length > 1 && `Названий фондообразователя: ${entry.names.length}.`,
        entry.ownership && `Форма собственности: ${entry.ownership}.`,
      ].filter(Boolean).join(' ') || null,
      topics: isPersonal ? ['личные фонды'] : [], language: null, place: /Усть-Каменогорск/i.test(latest) ? 'Усть-Каменогорск' : null,
      author_org: isPersonal ? null : latest,
      access: 'metadata_only', copy_status: 'unknown',
      source_label: 'Каталог фондов госархива ВКО на 2018 г. (сайт архива)',
      source_url: 'http://e-arhiv.vko.gov.kz/akimsemey/other/Фонды госархива ВКО на 2018г..xlsb',
    });
    entry.names.forEach(([name, period], ord) => fundNames.push({ fund_id: resourceId, ord, name, period_label: period }));
  }
  return fundIds;
}

// ---------- Газеты ----------
function buildNewspapers(resources: SeedResource[]): void {
  const rows = readCsv(at('datasets/structured_data/newspapers_1935_2017.csv')).slice(1);
  let lastOrgan = '';
  for (const row of rows) {
    const title = clean(row[1]).replace(/^«|»$/g, '');
    if (!title || /^наименование/i.test(title)) continue;
    const organ = clean(row[2]) === '-/-' ? lastOrgan : clean(row[2]);
    lastOrgan = organ || lastOrgan;
    const [from, to] = yearsFrom(clean(row[4]));
    resources.push({
      id: 'paper-' + id(title, row[4] ?? '', organ), kind: 'newspaper', parent_id: null, branch_id: 'main',
      title: `Газета «${title}»`, year_from: from, year_to: to, period_label: nullable(row[4]),
      doc_type: 'Периодическая печать', author_org: nullable(organ), place: null,
      description: [organ && `Место и орган издания: ${organ}.`, clean(row[3]) && `Томов: ${clean(row[3])}.`, clean(row[5]) && `Примечание: ${clean(row[5])}.`].filter(Boolean).join(' ') || null,
      topics: ['газеты'], access: 'metadata_only', copy_status: 'unknown',
      source_label: 'Перечень газет 1935–2017 гг. (сайт архива)', source_url: null,
    });
  }
}

// ---------- Фото ----------
const UK_ALBUMS = new Set(['36', '37', '44', '49']);
function buildPhotos(resources: SeedResource[], downloaded: Set<string>): void {
  const rows = readCsv(at('datasets/gallery/photos.csv'));
  const header = rows[0]!;
  const col = (name: string) => header.indexOf(name);
  for (const row of rows.slice(1)) {
    const album = row[col('album_id')] ?? '';
    const albumTitle = clean(row[col('album_title')]);
    if (!album || /album$/i.test(albumTitle)) continue; // тестовые альбомы «Test/JSON/PUT/CSRF Album»
    const caption = clean(row[col('caption')]);
    if (!caption) continue;
    const photoId = clean(row[col('photo_id')]);
    const [from, to] = yearsFrom(caption);
    const firstSentence = caption.split(/(?<=[.!?])\s/)[0]!.slice(0, 160);
    resources.push({
      id: 'photo-' + photoId, kind: 'photo', parent_id: null, branch_id: 'main',
      title: firstSentence, description: caption === firstSentence ? null : caption,
      year_from: from, year_to: to, period_label: from ? (from === to ? String(from) : `${from}–${to}`) : null,
      doc_type: 'Фотодокумент', place: UK_ALBUMS.has(album) || /Усть-Каменогорск|УК /.test(caption) ? 'Усть-Каменогорск' : /Зыряновск/.test(caption + albumTitle) ? 'Зыряновск' : null,
      topics: [albumTitle], access: 'open', copy_status: downloaded.has(photoId) ? 'available' : 'unknown',
      image_url: downloaded.has(photoId) ? `assets/photos/${photoId}.jpg` : null,
      source_label: `Фотогалерея сайта архива, альбом «${albumTitle}»`,
      source_url: `http://e-arhiv.vko.gov.kz/ru/SiteGallery/Album?albumId=${album}`,
    });
  }
}

// ---------- Страницы, новости, шифры из публикаций ----------
const SHELFMARK = /(?:Ф(?:онд)?\.?\s*№?\s*(Р?-?\s?\d+[а-я]?))\s*[,.]?\s*(?:оп(?:ись)?\.?\s*№?\s*(\d+[а-я]?))\s*[,.]?\s*(?:д(?:ело)?\.?\s*№?\s*(\d+[а-я]?))(?:\s*[,.]?\s*(?:л(?:л|ист)?\.?\s*([\d\s,–-]*\d)))?/giu;
interface Page { url: string; lang: string; title: string; lines: string[] }

async function readPages(): Promise<Page[]> {
  const pages: Page[] = [];
  const input = createInterface({ input: createReadStream(at('datasets/developer/pages.jsonl'), 'utf8'), crlfDelay: Infinity });
  for await (const line of input) {
    const page = JSON.parse(line) as { url: string; status: string; language: string; title: string; text: string };
    if (page.status !== 'ok' || !/\/(ru|kk)\/Page\/Index\/\d+/.test(page.url)) continue;
    pages.push({ url: page.url, lang: page.language, title: clean(page.title), lines: (page.text || '').split('\n').map(clean).filter(Boolean) });
  }
  return pages;
}

function stripBoilerplate(pages: Page[]): Page[] {
  const frequency = new Map<string, number>();
  for (const page of pages) for (const line of new Set(page.lines)) frequency.set(line, (frequency.get(line) ?? 0) + 1);
  const limit = Math.max(8, pages.length * 0.03);
  return pages.map((page) => ({ ...page, lines: page.lines.filter((line) => (frequency.get(line) ?? 0) <= limit && !/^Поделиться$|^Бөлісу$/.test(line)) }));
}

function buildPagesAndDocuments(pages: Page[], resources: SeedResource[], fundIds: Map<string, string>): void {
  const seen = new Set<string>();
  const units = new Map<string, string>(); // fund|inv|case → id
  for (const page of stripBoilerplate(pages)) {
    const body = page.lines.join('\n');
    if (body.length < 160) continue;
    const signature = id(page.lang, page.title, body.slice(0, 400));
    if (seen.has(signature)) continue;
    seen.add(signature);
    const date = /(\d{2})\.(\d{2})\.(\d{4})/.exec(page.lines.slice(0, 4).join(' '));
    const isNews = Boolean(date) && body.length < 6000;
    const pageId = (isNews ? 'news-' : 'page-') + id(page.url);
    const [from, to] = yearsFrom(page.title);
    resources.push({
      id: pageId, kind: isNews ? 'news' : 'page', parent_id: null, branch_id: null,
      title: page.title || page.lines[0]!.slice(0, 120), language: page.lang,
      description: body.slice(0, 12000), year_from: isNews ? Number(date![3]) : from, year_to: isNews ? Number(date![3]) : to,
      period_label: isNews ? `${date![1]}.${date![2]}.${date![3]}` : null,
      doc_type: isNews ? 'Новость' : 'Публикация сайта', topics: [], access: 'open', copy_status: 'none',
      source_label: 'Страница действующего сайта архива', source_url: page.url,
      published_at: isNews ? `${date![3]}-${date![2]}-${date![1]}` : null,
    });
    if (page.lang !== 'ru') continue;
    for (const match of body.matchAll(SHELFMARK)) {
      const fund = normalizeFundNumber(match[1]!);
      const inventory = match[2]!;
      const archiveCase = match[3]!;
      const sheets = match[4] ? clean(match[4]) : null;
      const fundId = fundIds.get(fund.toLocaleLowerCase('ru')) ?? null;
      const invKey = `${fund}|${inventory}`;
      const caseKey = `${invKey}|${archiveCase}`;
      if (!units.has(invKey)) {
        const invId = 'inv-' + id(invKey);
        units.set(invKey, invId);
        resources.push({ id: invId, kind: 'inventory', parent_id: fundId, branch_id: 'main', title: `Опись ${inventory} фонда ${fund}`, reference: `Ф. ${fund}, оп. ${inventory}`, fund_no: fund, inventory_no: inventory, doc_type: 'Опись', access: 'metadata_only', copy_status: 'unknown', topics: [], source_label: 'Шифр приведён в публикации архива', source_url: page.url });
      }
      if (!units.has(caseKey)) {
        const caseId = 'case-' + id(caseKey);
        units.set(caseKey, caseId);
        resources.push({ id: caseId, kind: 'case', parent_id: units.get(invKey)!, branch_id: 'main', title: `Дело ${archiveCase} описи ${inventory} фонда ${fund}`, reference: `Ф. ${fund}, оп. ${inventory}, д. ${archiveCase}`, fund_no: fund, inventory_no: inventory, case_no: archiveCase, doc_type: 'Архивное дело', access: 'metadata_only', copy_status: 'unknown', topics: [], source_label: 'Шифр приведён в публикации архива', source_url: page.url });
      }
      const docId = 'doc-' + id(caseKey, sheets ?? '', page.url);
      if (resources.some((r) => r.id === docId)) continue;
      const context = body.slice(Math.max(0, (match.index ?? 0) - 600), (match.index ?? 0)).split('\n').slice(-3).join(' ');
      resources.push({
        id: docId, kind: 'document', parent_id: units.get(caseKey)!, branch_id: 'main',
        title: page.title, reference: `Ф. ${fund}, оп. ${inventory}, д. ${archiveCase}${sheets ? `, л. ${sheets}` : ''}`,
        fund_no: fund, inventory_no: inventory, case_no: archiveCase, sheets: null,
        year_from: from, year_to: to, period_label: from ? `${from}${to && to !== from ? '–' + to : ''}` : null,
        doc_type: 'Документ из архивной публикации', language: 'ru',
        description: context.slice(-700) || null, history_note: `Документ процитирован в публикации «${page.title}» на сайте архива.`,
        topics: [], access: 'metadata_only', copy_status: 'unknown',
        source_label: 'Публикация на сайте архива («Основание»)', source_url: page.url,
      });
    }
  }
}

// ---------- Календарь памятных дат ----------
function buildCalendar(resources: SeedResource[]): void {
  const dir = path.join(customer, 'extracted-text');
  const months = 'января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря|январь|февраль|март|апрель|май|июнь|июль|август|сентябрь|октябрь|ноябрь|декабрь';
  const dateLine = new RegExp(`^(\\d{1,2}\\s+)?(${months})$`, 'i');
  for (const file of readdirSync(dir).filter((name) => name.startsWith('Календарь'))) {
    const calendarYear = Number(/(\d{4})/.exec(file)?.[1]);
    const lines = readFileSync(path.join(dir, file), 'utf8').split('\n').map(clean).filter(Boolean);
    let date: string | null = null;
    for (const line of lines) {
      if (dateLine.test(line)) { date = line; continue; }
      if (!date || !/^\d+\s+(лет|год)/.test(line)) continue;
      const base = /\((\d{4})/.exec(line)?.[1];
      resources.push({
        id: 'event-' + id(calendarYear, date, line), kind: 'event', parent_id: null, branch_id: null,
        title: line.slice(0, 300), language: 'ru', year_from: base ? Number(base) : null, year_to: base ? Number(base) : null,
        period_label: `${date} ${calendarYear}`, doc_type: 'Памятная дата', topics: ['календарь памятных дат'],
        description: `Календарь юбилейных и памятных дат ВКО на ${calendarYear} год: ${date}.`,
        access: 'open', copy_status: 'none', source_label: `Календарь памятных дат ${calendarYear} (материалы архива)`, source_url: null,
      });
    }
  }
}

// ---------- Демонстрационные записи (явно помечены) ----------
function buildDemo(resources: SeedResource[], fundIds: Map<string, string>): void {
  const fund = fundIds.get('р-1 ч.с.') ?? fundIds.get('р-1') ?? null;
  resources.push(
    { id: 'demo-inv-r1', kind: 'inventory', parent_id: fund, branch_id: 'main', title: 'Опись 1 (демонстрационная)', reference: 'Ф. Р-1, оп. 1', fund_no: 'Р-1 ч.с.', inventory_no: '1', doc_type: 'Опись', is_demo: true, access: 'metadata_only', copy_status: 'unknown', topics: [], source_label: 'Демонстрационная запись для показа иерархии', source_url: null },
    { id: 'demo-case-r1', kind: 'case', parent_id: 'demo-inv-r1', branch_id: 'main', title: 'Дело 15 (демонстрационное)', reference: 'Ф. Р-1, оп. 1, д. 15', fund_no: 'Р-1 ч.с.', inventory_no: '1', case_no: '15', doc_type: 'Архивное дело', is_demo: true, access: 'metadata_only', copy_status: 'unknown', topics: [], source_label: 'Демонстрационная запись для показа иерархии', source_url: null },
    { id: 'demo-doc-flood', kind: 'document', parent_id: 'demo-case-r1', branch_id: 'main', title: 'Центр города. Наводнение 10 марта 1929 года', reference: 'Ф. Р-1, оп. 1, д. 15, л. 1', fund_no: 'Р-1 ч.с.', inventory_no: '1', case_no: '15', year_from: 1929, year_to: 1929, period_label: '10.03.1929', doc_type: 'Фотодокумент', language: 'ru', sheets: 1, place: 'Усть-Каменогорск', description: 'Весеннее наводнение в центральной части Усть-Каменогорска: затопленные улицы и дома.', history_note: 'Фото из фотогалереи сайта архива. Шифр демонстрационный.', is_demo: true, access: 'open', copy_status: 'available', image_url: 'assets/history-flood.jpg', file_key: 'image:history-flood', topics: ['История городов'], source_label: 'Фотогалерея сайта архива', source_url: 'http://e-arhiv.vko.gov.kz/ru/SiteGallery/Album?albumId=36' },
    { id: 'demo-doc-restricted', kind: 'document', parent_id: 'demo-case-r1', branch_id: 'main', title: 'Документ с ограниченным доступом (демонстрационный)', reference: 'Ф. Р-1, оп. 1, д. 15, л. 7', fund_no: 'Р-1 ч.с.', inventory_no: '1', case_no: '15', year_from: 1952, year_to: 1952, doc_type: 'Документ', language: 'ru', description: 'Показывает, как выглядит карточка документа, копия которого закрыта: описание доступно, файл не выдаётся.', history_note: 'Ограничение доступа к документам о частной жизни действует 75 лет (Закон РК «О Национальном архивном фонде и архивах», ст. 16).', is_demo: true, access: 'restricted', copy_status: 'restricted', file_key: 'image:restricted-demo', topics: [], source_label: 'Демонстрационная запись', source_url: null },
  );
}

async function main(): Promise<void> {
  const photosDir = at('frontend/assets/photos');
  const downloaded = new Set(existsSync(photosDir) ? readdirSync(photosDir).map((name) => name.replace(/\.jpg$/, '')) : []);
  const resources: SeedResource[] = [];
  const fundNames: SeedData['fund_names'] = [];
  const branches = buildBranches();
  const fundIds = buildFunds(resources, fundNames);
  buildNewspapers(resources);
  buildPhotos(resources, downloaded);
  buildPagesAndDocuments(await readPages(), resources, fundIds);
  buildCalendar(resources);
  buildDemo(resources, fundIds);
  const seed: SeedData = { generated_at: new Date().toISOString(), branches, resources, fund_names: fundNames };
  writeFileSync(at('backend/data/seed.json'), JSON.stringify(seed));
  const counts = resources.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.kind]: (acc[r.kind] ?? 0) + 1 }), {});
  console.log('branches', branches.length, 'fund names', fundNames.length, counts);
}

await main();
