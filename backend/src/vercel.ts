/**
 * Точка входа функции Vercel: только API /api/v1, статику frontend/ раздаёт CDN Vercel.
 * Заголовки безопасности добавляет config.json (routes). База открывается один раз на экземпляр функции и переиспользуется между запросами.
 */
import { getRequestListener } from '@hono/node-server';
import { assertProductionConfig } from './config.ts';
import { openDb } from './db/client.ts';
import { createApp } from './http/app.ts';
import { setGatewayToken } from './ai/llm.ts';

assertProductionConfig();
const app = createApp(openDb());

const listener = getRequestListener(app.fetch);

export default function handler(...args: Parameters<typeof listener>) {
  const header = args[0].headers['x-vercel-oidc-token'];
  setGatewayToken(Array.isArray(header) ? header[0] : header);
  return listener(...args);
}
