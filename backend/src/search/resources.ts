/** Карточка ресурса (ТЗ 5.3): опубликованные поля, цепочка родителей, дети, история названий, доступ к копии. */
import type { Db } from '../db/client.ts';

export interface ResourceCard {
  id: string;
  kind: string;
  title: string;
  reference: string | null;
  fundNo: string | null;
  inventoryNo: string | null;
  caseNo: string | null;
  period: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  docType: string | null;
  language: string | null;
  sheets: number | null;
  description: string | null;
  historyNote: string | null;
  place: string | null;
  authorOrg: string | null;
  topics: string[];
  access: string;
  copyStatus: string;
  /** Адрес копии отдаётся только если доступ открыт и копия есть. */
  imageUrl: string | null;
  storage: { branchId: string | null; name: string | null; address: string | null };
  source: { label: string | null; url: string | null };
  isDemo: boolean;
  parents: Array<{ id: string; kind: string; title: string; reference: string | null }>;
  children: Array<{ id: string; kind: string; title: string; reference: string | null }>;
  childrenTotal: number;
  names: Array<{ name: string; period: string | null }>;
  updatedAt: string;
}

export async function getResource(db: Db, id: string): Promise<ResourceCard | null> {
  const [row] = await db.query<Record<string, unknown>>(
    `SELECT r.*, b.name_ru AS branch_name, b.address AS branch_address FROM resources r LEFT JOIN branches b ON b.id = r.branch_id
     WHERE r.id = $1 AND r.status = 'published'`, [id]);
  if (!row) return null;
  const parents: ResourceCard['parents'] = [];
  let parentId = row.parent_id as string | null;
  for (let depth = 0; parentId && depth < 5; depth++) {
    const [parent] = await db.query<{ id: string; kind: string; title: string; reference: string | null; parent_id: string | null }>(
      `SELECT id, kind, title, reference, parent_id FROM resources WHERE id = $1 AND status = 'published'`, [parentId]);
    if (!parent) break;
    parents.unshift({ id: parent.id, kind: parent.kind, title: parent.title, reference: parent.reference });
    parentId = parent.parent_id;
  }
  const children = await db.query<ResourceCard['children'][number]>(
    `SELECT id, kind, title, reference FROM resources WHERE parent_id = $1 AND status = 'published' ORDER BY reference, title LIMIT 50`, [id]);
  const [{ count }] = (await db.query<{ count: number }>(`SELECT count(*)::int AS count FROM resources WHERE parent_id = $1 AND status = 'published'`, [id])) as [{ count: number }];
  const names = await db.query<{ name: string; period: string | null }>(
    `SELECT name, period_label AS period FROM fund_names WHERE fund_id = $1 ORDER BY ord`, [id]);
  const open = row.access === 'open' && row.copy_status === 'available';
  return {
    id: row.id as string, kind: row.kind as string, title: row.title as string, reference: row.reference as string | null,
    fundNo: row.fund_no as string | null, inventoryNo: row.inventory_no as string | null, caseNo: row.case_no as string | null,
    period: row.period_label as string | null, yearFrom: row.year_from as number | null, yearTo: row.year_to as number | null,
    docType: row.doc_type as string | null, language: row.language as string | null, sheets: row.sheets as number | null,
    description: row.description as string | null, historyNote: row.history_note as string | null, place: row.place as string | null,
    authorOrg: row.author_org as string | null, topics: (row.topics as string[]) ?? [], access: row.access as string,
    copyStatus: row.copy_status as string, imageUrl: open ? (row.image_url as string | null) : null,
    storage: { branchId: row.branch_id as string | null, name: row.branch_name as string | null, address: row.branch_address as string | null },
    source: { label: row.source_label as string | null, url: row.source_url as string | null },
    isDemo: Boolean(row.is_demo), parents, children, childrenTotal: count, names,
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}

/** Связанные материалы (ТЗ 8.4): ближайшие по смыслу опубликованные ресурсы. */
export async function relatedResources(db: Db, id: string, limit = 6): Promise<Array<{ id: string; kind: string; title: string; reference: string | null; period: string | null; imageUrl: string | null }>> {
  return db.query(
    `WITH me AS (SELECT embedding FROM search_chunks WHERE resource_id = $1 AND embedding IS NOT NULL LIMIT 1)
     SELECT r.id, r.kind, r.title, r.reference, r.period_label AS period,
            CASE WHEN r.access = 'open' AND r.copy_status = 'available' THEN r.image_url END AS "imageUrl"
     FROM (SELECT c.resource_id, min(c.embedding <=> (SELECT embedding FROM me)) AS d FROM search_chunks c
           WHERE c.resource_id <> $1 AND (SELECT embedding FROM me) IS NOT NULL GROUP BY c.resource_id ORDER BY d LIMIT 40) n
     JOIN resources r ON r.id = n.resource_id AND r.status = 'published' AND r.kind IN ('fund','document','photo','case','newspaper','event','news')
     ORDER BY n.d LIMIT $2`, [id, limit]);
}
