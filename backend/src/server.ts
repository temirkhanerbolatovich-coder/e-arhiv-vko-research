/** Локальный и on-prem запуск: статика frontend/ и API /api/v1 с одного адреса. */
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertProductionConfig, config } from './config.ts';
import { openDb } from './db/client.ts';
import { createApp } from './http/app.ts';
import { securityHeaders } from './http/security.ts';

assertProductionConfig();
const frontendRoot = path.relative(process.cwd(), fileURLToPath(new URL('../../frontend', import.meta.url))) || '.';
const dbPromise = openDb();
const server = new Hono();
server.use('*', securityHeaders);
server.route('/', createApp(dbPromise));
server.use('/*', serveStatic({ root: frontendRoot }));

dbPromise.then(() => {
  serve({ fetch: server.fetch, port: config.port, hostname: process.env.HOST || '127.0.0.1' }, (info) => {
    console.log(`Архив ВКО: http://${info.address}:${info.port}  (ИИ: ${config.llm.apiKey ? config.llm.chatModel : 'выключен, работает обычный поиск'})`);
  });
});
