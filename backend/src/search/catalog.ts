/**
 * Поиск по электронному каталогу (ТЗ 5.3) и по опубликованным материалам сайта (ТЗ 5.8 Б).
 * Ранжирование гибридное: точный шифр > полнотекстовый (русский словарь + казахский стеммер)
 * > смысловой (эмбеддинги) > похожее написание названия. Фильтры проверяются здесь, SQL строится
 * только из разрешённых значений; текст запроса передаётся параметрами.
 */
import type { Db } from '../db/client.ts';
import { placeVariants } from '../domain/places.ts';
import { normalizeFundNumber, parseShelfmark } from '../domain/shelfmark.ts';
import { queryTerms, toPrefixTsQuery } from '../domain/text.ts';

export const CATALOG_KINDS = ['fund', 'inventory', 'case', 'document', 'photo', 'newspaper'] as const;
export const ALL_KINDS = [...CATALOG_KINDS, 'page', 'news', 'event', 'person'] as const;
export type ResourceKind = (typeof ALL_KINDS)[number];

const PERIODS: Record<string, [number | null, number | null]> = {
  before1926: [null, 1925], '1926-1950': [1926, 1950], '1951-2000': [1951, 2000], after2000: [2001, null],
};
const SORTS = ['relevance', 'title-asc', 'title-desc', 'year-asc', 'year-desc'] as const;
type Sort = (typeof SORTS)[number];

export interface CatalogQuery {
  q: string;
  kinds: ResourceKind[];
  yearFrom: number | null;
  yearTo: number | null;
  fund: string | null;
  inventory: string | null;
  case: string | null;
  author: string | null;
  topic: string | null;
  place: string | null;
  branch: string | null;
  sort: Sort;
  page: number;
  size: number;
}

export class ValidationError extends Error {}

const text = (value: string | null | undefined, max: number) => (value ?? '').trim().slice(0, max) || null;
const year = (value: string | null | undefined) => {
  if (!value) return null;
  if (!/^\d{1,4}$/.test(value)) throw new ValidationError('Год должен быть числом от 1 до 9999');
  return Number(value);
};

/** Разбор и проверка параметров из URL (имена совпадают с фронтендом: q, type, period, fund…). */
export function parseCatalogQuery(params: URLSearchParams, scope: 'catalog' | 'all' = 'catalog'): CatalogQuery {
  const type = params.get('type');
  const allowed: readonly string[] = scope === 'catalog' ? CATALOG_KINDS : ALL_KINDS;
  let kinds: ResourceKind[];
  if (!type || type === 'all') kinds = [...(scope === 'catalog' ? CATALOG_KINDS : ALL_KINDS)];
  else if (type === 'document') kinds = ['document', 'case', 'inventory'];
  else if (allowed.includes(type)) kinds = [type as ResourceKind];
  else throw new ValidationError(`Неизвестный тип материала: ${type}`);

  let yearFrom = year(params.get('year-from'));
  let yearTo = year(params.get('year-to'));
  const period = params.get('period');
  if (period && period !== 'all') {
    const range = PERIODS[period];
    if (!range) throw new ValidationError(`Неизвестный период: ${period}`);
    yearFrom ??= range[0];
    yearTo ??= range[1];
  }
  if (yearFrom !== null && yearTo !== null && yearFrom > yearTo) throw new ValidationError('Начальный год больше конечного');
  const q = text(params.get('q'), 300) ?? '';
  const sortParam = params.get('sort');
  const sort: Sort = SORTS.includes(sortParam as Sort) ? (sortParam as Sort) : q ? 'relevance' : 'title-asc';
  const size = Math.min(Math.max(Number(params.get('size')) || 10, 1), 50);
  const page = Math.min(Math.max(Number(params.get('page')) || 1, 1), 1000);
  const fund = text(params.get('fund'), 50);
  return {
    q, kinds, yearFrom, yearTo, sort, page, size,
    fund: fund ? normalizeFundNumber(fund) : null,
    inventory: text(params.get('inventory'), 20), case: text(params.get('case'), 20),
    author: text(params.get('author'), 100), topic: text(params.get('topic'), 100),
    place: text(params.get('place'), 100), branch: text(params.get('branch'), 100),
  };
}

export interface CatalogItem {
  id: string;
  kind: ResourceKind;
  title: string;
  reference: string | null;
  period: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  docType: string | null;
  place: string | null;
  branchId: string | null;
  branchName: string | null;
  access: string;
  copyStatus: string;
  imageUrl: string | null;
  snippet: string | null;
  isDemo: boolean;
  score: number;
}

export interface CatalogResult { items: CatalogItem[]; total: number; page: number; size: number; query: CatalogQuery }

const ORDER: Record<Sort, string> = {
  relevance: 'score DESC, r.title ASC',
  'title-asc': 'r.title ASC',
  'title-desc': 'r.title DESC',
  'year-asc': 'r.year_from ASC NULLS LAST, r.title ASC',
  'year-desc': 'r.year_to DESC NULLS LAST, r.title ASC',
};

/**
 * @param queryVector эмбеддинг запроса (если модель доступна); без него поиск остаётся текстовым.
 */
export async function searchCatalog(db: Db, query: CatalogQuery, queryVector?: number[] | null): Promise<CatalogResult> {
  const params: unknown[] = [];
  const p = (value: unknown) => { params.push(value); return `$${params.length}`; };
  const kindsParam = p(query.kinds);
  const where: string[] = [`r.status = 'published'`, `r.kind = ANY(${kindsParam})`];

  if (query.yearFrom !== null) where.push(`COALESCE(r.year_to, r.year_from) >= ${p(query.yearFrom)}`);
  if (query.yearTo !== null) where.push(`COALESCE(r.year_from, r.year_to) <= ${p(query.yearTo)}`);
  if (query.fund) where.push(`(lower(r.fund_no) = lower(${p(query.fund)}) OR lower(r.fund_no) LIKE lower(${p(query.fund + ' %')}))`);
  if (query.inventory) where.push(`r.inventory_no = ${p(query.inventory)}`);
  if (query.case) where.push(`r.case_no = ${p(query.case)}`);
  if (query.author) where.push(`(r.author_org ILIKE ${p('%' + query.author + '%')} OR EXISTS (SELECT 1 FROM fund_names n WHERE n.fund_id = r.id AND n.name ILIKE ${p('%' + query.author + '%')}))`);
  if (query.topic) where.push(`(${p(query.topic)} ILIKE ANY(SELECT '%' || t || '%' FROM unnest(r.topics) t) OR r.description ILIKE ${p('%' + query.topic + '%')} OR r.title ILIKE ${p('%' + query.topic + '%')})`);
  if (query.place) {
    const variants = placeVariants(query.place).map((v) => `%${v}%`);
    where.push(`(lower(COALESCE(r.place, '') || ' ' || r.title || ' ' || COALESCE(r.description, '')) LIKE ANY(${p(variants)}))`);
  }
  if (query.branch) where.push(`(r.branch_id = ${p(query.branch)} OR r.branch_id IN (SELECT id FROM branches WHERE name_ru ILIKE ${p('%' + query.branch + '%')}))`);

  let scoreSql = '0';
  let textCondition = '';
  if (query.q) {
    const shelfmark = parseShelfmark(query.q);
    const terms = queryTerms(query.q).flatMap((term) => placeVariants(term));
    const tsQuery = toPrefixTsQuery(terms);
    const parts: string[] = [];
    const conditions: string[] = [];
    if (shelfmark?.fund) {
      const exact = [`lower(r.fund_no) = lower(${p(shelfmark.fund)})`];
      if (shelfmark.inventory) exact.push(`r.inventory_no = ${p(shelfmark.inventory)}`);
      if (shelfmark.case) exact.push(`r.case_no = ${p(shelfmark.case)}`);
      parts.push(`CASE WHEN ${exact.join(' AND ')} THEN 10 ELSE 0 END`);
      conditions.push(`(${exact.join(' AND ')})`);
    }
    if (tsQuery) {
      const tsq = p(tsQuery);
      parts.push(`COALESCE((SELECT max(ts_rank(c.tsv, to_tsquery('russian', ${tsq})) + ts_rank(c.tsv, to_tsquery('simple', ${tsq}))) FROM search_chunks c WHERE c.resource_id = r.id AND (c.tsv @@ to_tsquery('russian', ${tsq}) OR c.tsv @@ to_tsquery('simple', ${tsq}))), 0) * 4`);
      conditions.push(`EXISTS (SELECT 1 FROM search_chunks c WHERE c.resource_id = r.id AND (c.tsv @@ to_tsquery('russian', ${tsq}) OR c.tsv @@ to_tsquery('simple', ${tsq})))`);
    }
    if (queryVector) {
      const vec = p(`[${queryVector.join(',')}]`);
      // Кандидаты по смыслу: ближайшие фрагменты среди разрешённых типов, порог отсекает случайные совпадения.
      params.push(0.42);
      const threshold = `$${params.length}`;
      parts.push(`COALESCE((SELECT max(1 - (c.embedding <=> ${vec}::vector)) FROM search_chunks c WHERE c.resource_id = r.id), 0) * 3`);
      conditions.push(`r.id IN (SELECT c.resource_id FROM search_chunks c JOIN resources rr ON rr.id = c.resource_id WHERE rr.kind = ANY(${kindsParam}) AND rr.status = 'published' AND 1 - (c.embedding <=> ${vec}::vector) > ${threshold} ORDER BY c.embedding <=> ${vec}::vector LIMIT 300)`);
    }
    const qn = p(query.q.toLocaleLowerCase('ru'));
    parts.push(`similarity(lower(r.title), ${qn})`);
    conditions.push(`similarity(lower(r.title), ${qn}) > 0.35`);
    scoreSql = parts.join(' + ');
    textCondition = `AND (${conditions.join(' OR ')})`;
  }

  const base = `FROM resources r LEFT JOIN branches b ON b.id = r.branch_id WHERE ${where.join(' AND ')} ${textCondition}`;
  const [{ total }] = (await db.query<{ total: number }>(`SELECT count(*)::int AS total ${base}`, params)) as [{ total: number }];
  const offset = (query.page - 1) * query.size;
  const rows = await db.query<Record<string, unknown>>(
    `SELECT r.id, r.kind, r.title, r.reference, r.period_label, r.year_from, r.year_to, r.doc_type, r.place, r.branch_id,
            b.name_ru AS branch_name, r.access, r.copy_status, r.image_url, r.is_demo, left(r.description, 260) AS snippet, (${scoreSql})::float AS score
     ${base} ORDER BY ${ORDER[query.sort]} LIMIT ${query.size} OFFSET ${offset}`,
    params,
  );
  return {
    total, page: query.page, size: query.size, query,
    items: rows.map((row) => ({
      id: row.id as string, kind: row.kind as ResourceKind, title: row.title as string, reference: row.reference as string | null,
      period: (row.period_label as string | null) ?? null, yearFrom: row.year_from as number | null, yearTo: row.year_to as number | null,
      docType: row.doc_type as string | null, place: row.place as string | null, branchId: row.branch_id as string | null,
      branchName: row.branch_name as string | null, access: row.access as string, copyStatus: row.copy_status as string,
      imageUrl: row.image_url as string | null, snippet: row.snippet as string | null, isDemo: Boolean(row.is_demo), score: Number(row.score),
    })),
  };
}
