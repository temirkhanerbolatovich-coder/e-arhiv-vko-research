/**
 * Сборка для Vercel в формате Build Output API v3 (.vercel/output в корне репозитория):
 *   static/            — frontend/ как есть;
 *   functions/api.func — бандл API + PGlite + снимок базы.
 * Бандл кладётся в backend/src/db/ внутри функции, чтобы относительные пути из src/db/client.ts
 * (schema.sql, ../../data/snapshot) работали без изменений; node_modules/@electric-sql лежит в корне функции,
 * потому что PGlite загружает свои .wasm/.data/.tar.gz рядом с модулем и не переживает бандлинг.
 */
import { build } from 'esbuild';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SECURITY_HEADERS } from '../src/http/security.ts';

const backend = fileURLToPath(new URL('../', import.meta.url));
const repo = fileURLToPath(new URL('../../', import.meta.url));
const output = `${repo}.vercel/output`;
const func = `${output}/functions/api.func`;

rmSync(output, { recursive: true, force: true });
cpSync(`${repo}frontend`, `${output}/static`, { recursive: true, filter: (src) => !src.endsWith('.md') });

await build({
  entryPoints: [`${backend}src/vercel.ts`],
  outfile: `${func}/backend/src/db/index.mjs`,
  bundle: true, platform: 'node', format: 'esm', target: 'node22',
  external: ['@electric-sql/*', 'pg-native'],
  // Бандл ESM: часть зависимостей (pg) использует require.
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
});
for (const file of ['schema.sql', 'indexes.sql']) cpSync(`${backend}src/db/${file}`, `${func}/backend/src/db/${file}`);
cpSync(`${backend}data/snapshot`, `${func}/backend/data/snapshot`, { recursive: true });
mkdirSync(`${func}/node_modules`, { recursive: true });
cpSync(`${backend}node_modules/@electric-sql`, `${func}/node_modules/@electric-sql`, { recursive: true, dereference: true });
writeFileSync(`${func}/package.json`, JSON.stringify({ type: 'module' }));
writeFileSync(`${func}/.vc-config.json`, JSON.stringify({
  runtime: 'nodejs22.x', handler: 'backend/src/db/index.mjs', launcherType: 'Nodejs',
  shouldAddHelpers: false, supportsResponseStreaming: true, maxDuration: 60, memory: 2048,
}, null, 2));
writeFileSync(`${output}/config.json`, JSON.stringify({
  version: 3,
  routes: [
    { src: '/(.*)', headers: SECURITY_HEADERS, continue: true },
    { src: '^/api/(.*)$', dest: '/api' },
    { handle: 'filesystem' },
  ],
}, null, 2));
console.log('built', output);
