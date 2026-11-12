/**
 * Инструменты сотрудников: черновик карточки с проверкой обязательных полей (ТЗ 6.3),
 * импорт CSV через staging-отчёт (ТЗ 6.3, 11), ИИ-распознавание скана в черновик карточки (ТЗ 5.8 Г)
 * и ИИ-рекомендации по обезличенной аналитике (ТЗ 5.8 Д). Всё, что предложил ИИ, сохраняется
 * только как черновик и публикуется после проверки сотрудником.
 */
import { randomUUID } from 'node:crypto';
import type { Db } from '../db/client.ts';
import type { SessionUser } from '../auth/roles.ts';
import { normalizeFundNumber } from '../domain/shelfmark.ts';
import { completeJson, completeJsonFromImage } from '../ai/llm.ts';
import { audit } from './audit.ts';

export interface DraftInput {
  kind: string; title: string; fundNo?: string; inventoryNo?: string; caseNo?: string; sheets?: string;
  yearFrom?: number | null; yearTo?: number | null; docType?: string; place?: string; topics?: string[];
  description?: string; language?: string; sourceLabel?: string; branchId?: string; access?: string; copyStatus?: string;
}

const KINDS = ['fund', 'inventory', 'case', 'document', 'photo', 'newspaper', 'news', 'page'];
const ACCESS = ['open', 'restricted', 'metadata_only'];
const COPY = ['available', 'none', 'unknown', 'restricted'];

/** Обязательные поля зависят от уровня описания: у документа должны быть фонд, опись и дело. */
export function validateDraft(input: DraftInput): string[] {
  const errors: string[] = [];
  if (!KINDS.includes(input.kind)) errors.push('Неизвестный тип записи');
  if (!input.title?.trim() || input.title.trim().length < 3) errors.push('Заголовок обязателен (не короче 3 символов)');
  if (['fund', 'inventory', 'case', 'document'].includes(input.kind) && !input.fundNo?.trim()) errors.push('Номер фонда обязателен');
  if (['inventory', 'case', 'document'].includes(input.kind) && !input.inventoryNo?.trim()) errors.push('Номер описи обязателен');
  if (['case', 'document'].includes(input.kind) && !input.caseNo?.trim()) errors.push('Номер дела обязателен');
  if (input.yearFrom && input.yearTo && input.yearFrom > input.yearTo) errors.push('Начальный год больше конечного');
  if (input.access && !ACCESS.includes(input.access)) errors.push('Неизвестный статус доступа');
  if (input.copyStatus && !COPY.includes(input.copyStatus)) errors.push('Неизвестный статус копии');
  return errors;
}

export async function createDraft(db: Db, user: SessionUser, input: DraftInput): Promise<string> {
  const fund = input.fundNo ? normalizeFundNumber(input.fundNo) : null;
  const reference = [fund && `Ф. ${fund}`, input.inventoryNo && `оп. ${input.inventoryNo}`, input.caseNo && `д. ${input.caseNo}`, input.sheets && `л. ${input.sheets}`].filter(Boolean).join(', ') || null;
  const id = `draft-${randomUUID().slice(0, 12)}`;
  const branchId = user.role === 'branch_admin' ? user.branchId : (input.branchId || 'main');
  await db.query(
    `INSERT INTO resources (id, kind, branch_id, title, reference, fund_no, inventory_no, case_no, year_from, year_to, period_label, doc_type, language, description, place, topics, access, copy_status, source_label, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'draft',$20)`,
    [id, input.kind, branchId, input.title.trim(), reference, fund, input.inventoryNo || null, input.caseNo || null, input.yearFrom || null, input.yearTo || null,
      input.yearFrom ? `${input.yearFrom}${input.yearTo && input.yearTo !== input.yearFrom ? '–' + input.yearTo : ''}` : null,
      input.docType || null, input.language || null, input.description || null, input.place || null, input.topics ?? [],
      input.access || 'metadata_only', input.copyStatus || 'unknown', input.sourceLabel || 'Карточка создана сотрудником архива', user.id]);
  await audit(db, user, 'resource.create', 'resource', id, { kind: input.kind, title: input.title.slice(0, 120) });
  return id;
}

// ---------- Импорт CSV ----------
const IMPORT_COLUMNS = ['kind', 'title', 'fund', 'inventory', 'case', 'year_from', 'year_to', 'doc_type', 'place', 'description'] as const;

export function parseCsvText(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') quoted = false; else cell += ch; }
    else if (ch === '"') quoted = true;
    else if (ch === ',' || ch === ';') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

export interface ImportReport { batchId: string; accepted: number; rejected: number; rows: Array<{ line: number; status: 'accepted' | 'rejected' | 'duplicate'; id?: string; errors?: string[] }> }

/** Импорт: каждая строка проверяется отдельно; ошибочные не прерывают остальные; повтор строки не создаёт дубль. */
export async function importCsv(db: Db, user: SessionUser, fileName: string, text: string): Promise<ImportReport> {
  const [header, ...rows] = parseCsvText(text.replace(/^﻿/, ''));
  if (!header) throw new Error('Пустой файл');
  const index = Object.fromEntries(IMPORT_COLUMNS.map((name) => [name, header.findIndex((h) => h.trim().toLowerCase() === name)]));
  if (index.title === -1 || index.kind === -1) throw new Error(`Нет обязательных колонок kind и title. Ожидаются: ${IMPORT_COLUMNS.join(', ')}`);
  const report: ImportReport = { batchId: `imp-${randomUUID().slice(0, 8)}`, accepted: 0, rejected: 0, rows: [] };
  for (const [offset, row] of rows.slice(0, 2000).entries()) {
    const get = (name: (typeof IMPORT_COLUMNS)[number]) => (index[name]! >= 0 ? (row[index[name]!] ?? '').trim() : '');
    const input: DraftInput = {
      kind: get('kind'), title: get('title'), fundNo: get('fund'), inventoryNo: get('inventory'), caseNo: get('case'),
      yearFrom: Number(get('year_from')) || null, yearTo: Number(get('year_to')) || null, docType: get('doc_type'), place: get('place'), description: get('description'),
      sourceLabel: `Импорт ${fileName}`,
    };
    const errors = validateDraft(input);
    const line = offset + 2;
    if (errors.length) { report.rejected++; report.rows.push({ line, status: 'rejected', errors }); continue; }
    const fund = input.fundNo ? normalizeFundNumber(input.fundNo) : null;
    const [existing] = await db.query<{ id: string }>(
      `SELECT id FROM resources WHERE kind = $1 AND lower(title) = lower($2) AND COALESCE(fund_no,'') = COALESCE($3,'') AND COALESCE(inventory_no,'') = COALESCE($4,'') AND COALESCE(case_no,'') = COALESCE($5,'') LIMIT 1`,
      [input.kind, input.title, fund, input.inventoryNo || null, input.caseNo || null]);
    if (existing) { report.rows.push({ line, status: 'duplicate', id: existing.id }); continue; }
    const id = await createDraft(db, user, input);
    report.accepted++;
    report.rows.push({ line, status: 'accepted', id });
  }
  await db.query('INSERT INTO import_batches (id, user_id, file_name, accepted, rejected, report) VALUES ($1,$2,$3,$4,$5,$6)',
    [report.batchId, user.id, fileName.slice(0, 200), report.accepted, report.rejected, JSON.stringify(report.rows.slice(0, 500))]);
  await audit(db, user, 'catalog.import', 'import_batch', report.batchId, { accepted: report.accepted, rejected: report.rejected, file: fileName });
  return report;
}

export function exportCsv(rows: Array<Record<string, unknown>>): string {
  const columns = ['id', 'kind', 'reference', 'title', 'year_from', 'year_to', 'doc_type', 'place', 'access', 'copy_status', 'status'];
  const escape = (value: unknown) => {
    const text = String(value ?? '');
    // Защита от формул в табличных программах.
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
    return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return [columns.join(','), ...rows.map((row) => columns.map((c) => escape(row[c])).join(','))].join('\n');
}

// ---------- ИИ: скан → черновик карточки ----------
export interface ExtractedCard {
  title: string; date: string; year_from: number; year_to: number; doc_type: string; places: string[]; persons: string[];
  organizations: string[]; keywords: string[]; description: string; language: string; transcript: string; confidence: number;
}

const EXTRACT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'date', 'year_from', 'year_to', 'doc_type', 'places', 'persons', 'organizations', 'keywords', 'description', 'language', 'transcript', 'confidence'],
  properties: {
    title: { type: 'string' }, date: { type: 'string' }, year_from: { type: 'integer' }, year_to: { type: 'integer' },
    doc_type: { type: 'string' }, places: { type: 'array', items: { type: 'string' } }, persons: { type: 'array', items: { type: 'string' } },
    organizations: { type: 'array', items: { type: 'string' } }, keywords: { type: 'array', items: { type: 'string' } },
    description: { type: 'string' }, language: { type: 'string' }, transcript: { type: 'string' }, confidence: { type: 'number' },
  },
} as const;

export async function extractFromScan(db: Db, user: SessionUser, imageDataUrl: string): Promise<{ card: ExtractedCard; duplicates: Array<{ id: string; title: string; reference: string | null }> }> {
  const card = await completeJsonFromImage<ExtractedCard>(
    `Ты помогаешь архивисту Государственного архива ВКО описать скан документа или фотографию для электронного каталога.
Распознай печатный (и, если читается, рукописный) текст в transcript. Заполни поля на русском: заголовок по смыслу, дата как в документе, годы (0 если неизвестно),
тип документа, места, люди, организации, 3–8 ключевых слов, краткое нейтральное описание 1–3 предложения, язык оригинала.
Не выдумывай: если поле не видно — пустая строка или пустой список. confidence — твоя уверенность 0..1. Это черновик: сотрудник проверит каждое поле.`,
    imageDataUrl, 'catalog_card', EXTRACT_SCHEMA as unknown as Record<string, unknown>);
  const duplicates = card.title
    ? await db.query<{ id: string; title: string; reference: string | null }>(
      `SELECT id, title, reference FROM resources WHERE similarity(lower(title), lower($1)) > 0.45 ORDER BY similarity(lower(title), lower($1)) DESC LIMIT 3`, [card.title])
    : [];
  await audit(db, user, 'ai.extract', 'scan', null, { title: card.title.slice(0, 120), confidence: card.confidence });
  return { card, duplicates };
}

// ---------- Аналитика и ИИ-рекомендации ----------
export interface Analytics {
  totals: { questions: number; answered: number; noResults: number; helpful: number; rated: number; catalogSearches: number };
  zeroResultQueries: Array<{ query: string; count: number }>;
  topQueries: Array<{ query: string; count: number }>;
  stalePages: Array<{ id: string; title: string; year: number | null }>;
  feedbackNew: number;
}

/** Запросы показываются, только если их задали не менее чем в MIN_SESSIONS разных сессиях (обезличивание). */
const MIN_SESSIONS = 2;

export async function analytics(db: Db): Promise<Analytics> {
  const [totals] = await db.query<Analytics['totals']>(
    `SELECT count(*) FILTER (WHERE channel = 'chat')::int AS questions,
            count(*) FILTER (WHERE channel = 'chat' AND status = 'answered')::int AS answered,
            count(*) FILTER (WHERE status = 'no_results' OR results = 0)::int AS "noResults",
            count(*) FILTER (WHERE rating = 1)::int AS helpful, count(rating)::int AS rated,
            count(*) FILTER (WHERE channel = 'catalog')::int AS "catalogSearches"
     FROM search_events WHERE at > now() - interval '30 days'`);
  const grouped = (condition: string) => db.query<{ query: string; count: number }>(
    `SELECT lower(query) AS query, count(*)::int AS count FROM search_events
     WHERE at > now() - interval '30 days' AND query IS NOT NULL AND query <> '' ${condition}
     GROUP BY lower(query) HAVING count(DISTINCT COALESCE(session_hash, id::text)) >= ${MIN_SESSIONS} ORDER BY count DESC LIMIT 10`);
  const stalePages = await db.query<{ id: string; title: string; year: number | null }>(
    `SELECT id, title, year_from AS year FROM resources WHERE kind = 'page' AND status = 'published' AND language = 'ru'
     AND (description ILIKE '%2019%' OR description ILIKE '%2020%' OR description ILIKE '%2021%') AND description NOT ILIKE '%2026%' ORDER BY title LIMIT 8`);
  const [{ count }] = (await db.query<{ count: number }>(`SELECT count(*)::int AS count FROM feedback WHERE status = 'new'`)) as [{ count: number }];
  return { totals: totals!, zeroResultQueries: await grouped(`AND (status = 'no_results' OR results = 0)`), topQueries: await grouped(''), stalePages, feedbackNew: count };
}

export async function recommendations(data: Analytics): Promise<Array<{ title: string; reason: string; action: string }>> {
  const result = await completeJson<{ items: Array<{ title: string; reason: string; action: string }> }>(
    `Ты аналитик качества сайта Государственного архива ВКО. По обезличенной статистике предложи до 4 конкретных улучшений сайта:
какие разделы дополнить, какие материалы чаще ищут, какие запросы остаются без ответа, какие страницы обновить.
Пиши по-русски кратко. action — что сделать сотруднику. Решение принимает сотрудник, ты только предлагаешь. Не придумывай цифры.`,
    JSON.stringify({ totals: data.totals, zeroResultQueries: data.zeroResultQueries, topQueries: data.topQueries, stalePages: data.stalePages.map((p) => p.title) }),
    'recommendations',
    { type: 'object', additionalProperties: false, required: ['items'], properties: { items: { type: 'array', maxItems: 4, items: { type: 'object', additionalProperties: false, required: ['title', 'reason', 'action'], properties: { title: { type: 'string' }, reason: { type: 'string' }, action: { type: 'string' } } } } } },
    700);
  return result.items;
}
