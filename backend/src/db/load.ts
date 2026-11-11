/** Загрузка seed.json в БД и построение поискового индекса. Используется сборкой и seed для PostgreSQL. */
import type { Db } from './client.ts';
import type { SeedData, SeedResource } from './seed-types.ts';
import { PLACE_ALIASES } from '../domain/places.ts';
import { stemKazakhWord } from '../domain/text.ts';
import { hashPassword } from '../auth/password.ts';
import { DEMO_USERS } from '../auth/roles.ts';
import { config } from '../config.ts';

const RESOURCE_COLUMNS = [
  'id', 'kind', 'parent_id', 'branch_id', 'title', 'reference', 'fund_no', 'inventory_no', 'case_no', 'year_from', 'year_to',
  'period_label', 'doc_type', 'language', 'sheets', 'description', 'history_note', 'place', 'author_org', 'topics', 'access',
  'copy_status', 'file_key', 'image_url', 'source_label', 'source_url', 'is_demo', 'status', 'published_at',
] as const;

async function insertMany(db: Db, table: string, columns: readonly string[], rows: unknown[][], batch = 200): Promise<void> {
  for (let start = 0; start < rows.length; start += batch) {
    const slice = rows.slice(start, start + batch);
    const values: unknown[] = [];
    const tuples = slice.map((row) => `(${row.map((value) => { values.push(value); return `$${values.length}`; }).join(',')})`);
    await db.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES ${tuples.join(',')} ON CONFLICT DO NOTHING`, values);
  }
}

/** Текст, по которому ищется ресурс: заголовок, шифр, период, место, описание. */
export function chunkTexts(resource: Pick<SeedResource, 'title' | 'reference' | 'period_label' | 'place' | 'doc_type' | 'description' | 'author_org' | 'topics'>, names: string[] = []): string[] {
  const head = [resource.title, resource.reference, resource.period_label, resource.place, resource.doc_type, resource.topics.join(', ')]
    .filter(Boolean).join(' · ');
  const extra = names.length > 1 ? `Прежние названия: ${names.join('; ')}` : '';
  const body = [extra, resource.description ?? ''].filter(Boolean).join('\n');
  if (body.length <= 1400) return [[head, body].filter(Boolean).join('\n')];
  const parts: string[] = [];
  for (let start = 0; start < body.length && parts.length < 6; start += 1200) parts.push(`${head}\n${body.slice(start, start + 1400)}`);
  return parts;
}

const kazakhStem = (text: string) => text.toLocaleLowerCase('ru').split(/[^\p{L}\p{N}]+/u).map(stemKazakhWord).join(' ');

/** Пересобирает индекс для указанных ресурсов (или всех опубликованных). Векторы берутся из кэша, если есть. */
export async function reindex(db: Db, embeddings?: Map<string, number[]>, resourceIds?: string[]): Promise<number> {
  const rows = await db.query<SeedResource & { id: string }>(
    `SELECT * FROM resources WHERE status = 'published' ${resourceIds ? 'AND id = ANY($1)' : ''}`,
    resourceIds ? [resourceIds] : [],
  );
  const names = await db.query<{ fund_id: string; name: string }>('SELECT fund_id, name FROM fund_names ORDER BY fund_id, ord');
  const namesByFund = new Map<string, string[]>();
  for (const row of names) namesByFund.set(row.fund_id, [...(namesByFund.get(row.fund_id) ?? []), row.name]);
  if (resourceIds) await db.query('DELETE FROM search_chunks WHERE resource_id = ANY($1)', [resourceIds]);
  let count = 0;
  const pending: unknown[][] = [];
  for (const resource of rows) {
    chunkTexts(resource, namesByFund.get(resource.id)).forEach((text, index) => {
      const vector = embeddings?.get(text);
      pending.push([`${resource.id}#${index}`, resource.id, text, vector ? `[${vector.join(',')}]` : null, kazakhStem(text)]);
      count++;
    });
  }
  for (let start = 0; start < pending.length; start += 200) {
    const slice = pending.slice(start, start + 200);
    const values: unknown[] = [];
    const tuples = slice.map((row) => {
      values.push(...row);
      const n = values.length;
      return `($${n - 4}, $${n - 3}, $${n - 2}, to_tsvector('russian', $${n - 2}) || to_tsvector('simple', $${n}), $${n - 1}::vector)`;
    });
    await db.query(`INSERT INTO search_chunks (id, resource_id, text, tsv, embedding) VALUES ${tuples.join(',')} ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, tsv = EXCLUDED.tsv, embedding = COALESCE(EXCLUDED.embedding, search_chunks.embedding)`, values);
  }
  return count;
}

export async function loadSeed(db: Db, seed: SeedData, embeddings?: Map<string, number[]>): Promise<void> {
  await insertMany(db, 'branches',
    ['id', 'kind', 'name_ru', 'name_kk', 'name_en', 'address', 'locality', 'phone', 'email', 'hours', 'lat', 'lng', 'coords_precision', 'coords_source', 'show_on_map'],
    seed.branches.map((b) => [b.id, b.kind, b.name_ru, b.name_kk, b.name_en, b.address, b.locality, b.phone, b.email, b.hours, b.lat, b.lng, b.coords_precision, b.coords_source, b.show_on_map]));
  // Родители раньше детей: внешний ключ parent_id.
  const order: Record<SeedResource['kind'], number> = { fund: 0, inventory: 1, case: 2, document: 3, photo: 4, newspaper: 4, page: 4, news: 4, event: 4, person: 4 };
  const resources = [...seed.resources].sort((a, b) => order[a.kind] - order[b.kind]);
  await insertMany(db, 'resources', RESOURCE_COLUMNS, resources.map((r) => RESOURCE_COLUMNS.map((column) => {
    if (column === 'status') return 'published';
    if (column === 'is_demo') return r.is_demo ?? false;
    if (column === 'published_at') return r.published_at ?? null;
    return (r as unknown as Record<string, unknown>)[column] ?? null;
  })));
  await insertMany(db, 'fund_names', ['fund_id', 'ord', 'name', 'period_label'], seed.fund_names.map((n) => [n.fund_id, n.ord, n.name, n.period_label]));
  await insertMany(db, 'place_aliases', ['alias', 'canonical', 'note'], PLACE_ALIASES.map((p) => [p.alias, p.canonical, p.note]));
  const passwordHash = await hashPassword(config.demoPassword);
  await insertMany(db, 'users', ['id', 'email', 'name', 'role', 'branch_id', 'password_hash'],
    DEMO_USERS.map((u) => [u.id, u.email, u.name, u.role, u.branchId, passwordHash]));
  await reindex(db, embeddings);
}
