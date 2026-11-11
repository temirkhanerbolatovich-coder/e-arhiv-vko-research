/**
 * Доступ к PostgreSQL. Два режима с одним SQL:
 *  - DATABASE_URL задан → обычный PostgreSQL (pgvector + pg_trgm должны быть установлены);
 *  - не задан → встроенный PGlite (Postgres в WASM): локальный запуск и демо без внешней БД.
 *    В демо на serverless данные живут в памяти экземпляра и сбрасываются при холодном старте.
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { config } from '../config.ts';

export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  exec(sql: string): Promise<void>;
  transaction<T>(work: (tx: Db) => Promise<T>): Promise<T>;
  /** Только для PGlite: исходный объект (снимок данных для сборки). */
  raw?: unknown;
}

/** Порядок важен: родительские таблицы раньше дочерних (внешние ключи). */
export const SNAPSHOT_TABLES = ['branches', 'resources', 'fund_names', 'search_chunks', 'place_aliases', 'users'] as const;
const snapshotDir = fileURLToPath(new URL('../../data/snapshot/', import.meta.url));

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));

async function createPglite(useSnapshot: boolean): Promise<Db> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { pg_trgm } = await import('@electric-sql/pglite/contrib/pg_trgm');
  const { vector } = await import('@electric-sql/pglite-pgvector');
  const pg = new PGlite({ dataDir: config.pgliteDir ?? undefined, extensions: { vector, pg_trgm } });
  const wrap = (runner: { query: typeof pg.query; exec: typeof pg.exec }): Db => ({
    async query<T>(sql: string, params: unknown[] = []) {
      return (await runner.query<T>(sql, params)).rows;
    },
    async exec(sql: string) {
      await runner.exec(sql);
    },
    transaction: (work) => pg.transaction((tx) => work(wrap(tx as unknown as typeof pg))),
  });
  const db: Db = { ...wrap(pg), raw: pg };
  await db.exec(await readFile(schemaPath, 'utf8'));
  if (useSnapshot && existsSync(snapshotDir)) {
    const [existing] = await db.query<{ count: number }>('SELECT count(*)::int AS count FROM resources');
    if (!existing?.count) {
      // Быстрая загрузка снимка: COPY вместо тысяч INSERT (холодный старт в serverless).
      const { gunzipSync } = await import('node:zlib');
      for (const table of SNAPSHOT_TABLES) {
        const file = `${snapshotDir}${table}.copy.gz`;
        if (!existsSync(file)) continue;
        const started = Date.now();
        await pg.query(`COPY ${table} FROM '/dev/blob' WITH (FORMAT binary)`, [], { blob: new Blob([gunzipSync(await readFile(file))]) });
        if (process.env.DEBUG_DB) console.log(table, Date.now() - started, "ms");
      }
    }
  }
  return db;
}

async function createPostgres(url: string): Promise<Db> {
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({ connectionString: url, max: 5 });
  const wrap = (client: { query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }> }): Omit<Db, 'transaction'> => ({
    async query<T>(sql: string, params: unknown[] = []) {
      return (await client.query(sql, params)).rows as T[];
    },
    async exec(sql: string) {
      await client.query(sql);
    },
  });
  return {
    ...wrap(pool),
    async transaction(work) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const tx: Db = { ...wrap(client), transaction: (inner) => inner(tx) };
        const result = await work(tx);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

/** Открывает БД. useSnapshot=false — пустая база (сборка снимка, тесты). */
export async function openDb(options: { useSnapshot?: boolean } = {}): Promise<Db> {
  if (!config.databaseUrl) return createPglite(options.useSnapshot ?? true);
  const db = await createPostgres(config.databaseUrl);
  await db.exec(await readFile(schemaPath, 'utf8'));
  await db.exec(await readFile(fileURLToPath(new URL('./indexes.sql', import.meta.url)), 'utf8'));
  return db;
}
