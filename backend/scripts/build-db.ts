/**
 * Собирает готовую базу PGlite из data/seed.json, считает эмбеддинги (кэш в data/embeddings.cache.json.gz)
 * и сохраняет снимок data/archive-db.tar.gz. Его загружает сервер без DATABASE_URL — старт за секунды.
 * Запуск: LLM_API_KEY=... npx tsx scripts/build-db.ts
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync, gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { openDb, SNAPSHOT_TABLES } from '../src/db/client.ts';
import { loadSeed, reindex } from '../src/db/load.ts';
import { embed, llmConfigured } from '../src/ai/llm.ts';
import type { SeedData } from '../src/db/seed-types.ts';

const dataPath = (name: string) => fileURLToPath(new URL(`../data/${name}`, import.meta.url));
const hash = (text: string) => createHash('sha1').update(text).digest('hex');

/** Лимит провайдера по токенам в минуту: при 429 ждём и повторяем. */
async function embedWithRetry(texts: string[]): Promise<number[][]> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await embed(texts);
    } catch (error) {
      if (attempt >= 8 || !String((error as Error).message).includes('429')) throw error;
      await new Promise((resolve) => setTimeout(resolve, 8000 * attempt));
    }
  }
}

const cachePath = dataPath('embeddings.cache.json.gz');
const cache: Record<string, number[]> = existsSync(cachePath) ? JSON.parse(gunzipSync(readFileSync(cachePath)).toString()) : {};

const seed = JSON.parse(readFileSync(dataPath('seed.json'), 'utf8')) as SeedData;
const db = await openDb({ useSnapshot: false });
await loadSeed(db, seed);
const chunks = await db.query<{ id: string; text: string }>('SELECT id, text FROM search_chunks');
const missing = chunks.filter((chunk) => !cache[hash(chunk.text)]);
console.log(`chunks ${chunks.length}, need embeddings ${missing.length}`);
if (missing.length && llmConfigured()) {
  for (let start = 0; start < missing.length; start += 200) {
    const batch = missing.slice(start, start + 200);
    const vectors = await embedWithRetry(batch.map((chunk) => chunk.text.slice(0, 4000)));
    // Округление до 4 знаков: точность поиска не меняется, снимок БД заметно меньше.
    batch.forEach((chunk, index) => { cache[hash(chunk.text)] = vectors[index]!.map((v) => Math.round(v * 1e4) / 1e4); });
    process.stdout.write(`\rembedded ${Math.min(start + 200, missing.length)}/${missing.length}`);
    if ((start / 200) % 5 === 4) writeFileSync(cachePath, gzipSync(JSON.stringify(cache)));
  }
  console.log();
  writeFileSync(cachePath, gzipSync(JSON.stringify(cache)));
}
const vectors = new Map(chunks.flatMap((chunk) => (cache[hash(chunk.text)] ? [[chunk.text, cache[hash(chunk.text)]!] as const] : [])));
await reindex(db, vectors);
const [stats] = await db.query<{ total: number; with_vector: number }>('SELECT count(*)::int AS total, count(embedding)::int AS with_vector FROM search_chunks');
console.log('index', stats);
// Снимок таблиц для быстрой загрузки (см. src/db/client.ts).
const pg = db.raw as { query(sql: string): Promise<{ blob?: Blob }> };
mkdirSync(dataPath('snapshot'), { recursive: true });
for (const table of SNAPSHOT_TABLES) {
  const result = await pg.query(`COPY ${table} TO '/dev/blob' WITH (FORMAT binary)`);
  writeFileSync(dataPath(`snapshot/${table}.copy.gz`), gzipSync(Buffer.from(await result.blob!.arrayBuffer()), { level: 9 }));
}
console.log('saved data/snapshot/*.copy.gz');
