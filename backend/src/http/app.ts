/**
 * HTTP API /api/v1 (контракты — frontend/BACKEND_INTEGRATION.md). Один Hono-app для Node-сервера и Vercel.
 * Ошибки отдаются без внутренних подробностей; ввод проверяется на сервере.
 */
import { randomBytes, randomUUID } from 'node:crypto';
import { Hono, type Context } from 'hono';
import { getCookie } from 'hono/cookie';
import type { Db } from '../db/client.ts';
import { askAssistant, logEvent, type Locale } from '../ai/assistant.ts';
import { embed, llmConfigured, LlmUnavailableError } from '../ai/llm.ts';
import { parseCatalogQuery, searchCatalog, ValidationError } from '../search/catalog.ts';
import { getResource, relatedResources } from '../search/resources.ts';
import { redactPersonalData } from '../privacy/redact.ts';
import { verifyPassword } from '../auth/password.ts';
import { can, canEditBranch, ROLE_LABELS, ROLE_PERMISSIONS, ROLES, type Permission, type SessionUser } from '../auth/roles.ts';
import { clearCookieHeader, cookieHeader, issueToken, loginAllowed, readToken, recordLoginFailure, SESSION_COOKIE } from '../auth/session.ts';
import { allowedTransitions, STATUSES, transition, TransitionError, type Status } from '../admin/moderation.ts';
import { audit } from '../admin/audit.ts';
import { analytics, createDraft, exportCsv, extractFromScan, importCsv, recommendations, validateDraft, type DraftInput } from '../admin/catalog-admin.ts';

type Env = { Variables: { user: SessionUser & { csrf: string } } };

const locales = new Set(['ru', 'kk', 'en']);
const localeOf = (value: unknown): Locale => (typeof value === 'string' && locales.has(value) ? (value as Locale) : 'ru');

/** Простое ограничение частоты по адресу (в памяти экземпляра): защита модели и БД от перебора. */
function rateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string): boolean => {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) hits.clear();
    return recent.length <= limit;
  };
}
const chatLimit = rateLimiter(20, 60_000);
const searchLimit = rateLimiter(90, 60_000);

const clientKey = (c: Context) => c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'local';
const isSecure = (c: Context) => c.req.header('x-forwarded-proto') === 'https' || new URL(c.req.url).protocol === 'https:';

export function createApp(dbPromise: Promise<Db>): Hono<Env> {
  const app = new Hono<Env>().basePath('/api/v1');
  const db = () => dbPromise;

  app.use('*', async (c, next) => {
    await next();
    c.header('Cache-Control', c.res.headers.get('Cache-Control') ?? 'no-store');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('X-Robots-Tag', 'noindex');
  });

  app.onError((error, c) => {
    if (error instanceof ValidationError || error instanceof TransitionError) return c.json({ error: 'validation', message: error.message }, 400);
    if (error instanceof LlmUnavailableError) return c.json({ error: 'ai_unavailable', message: 'ИИ-сервис временно недоступен' }, 503);
    console.error(JSON.stringify({ level: 'error', path: c.req.path, message: (error as Error).message }));
    return c.json({ error: 'internal', message: 'Внутренняя ошибка. Попробуйте позже.' }, 500);
  });

  // ---------- Публичная часть ----------
  app.get('/health', async (c) => {
    const [row] = await (await db()).query<{ resources: number }>(`SELECT count(*)::int AS resources FROM resources WHERE status = 'published'`);
    return c.json({ ok: true, resources: row?.resources ?? 0, ai: llmConfigured() });
  });

  app.get('/catalog', async (c) => {
    if (!searchLimit(clientKey(c))) return c.json({ error: 'rate_limited' }, 429);
    const started = Date.now();
    const params = new URL(c.req.url).searchParams;
    const query = parseCatalogQuery(params, params.get('scope') === 'all' ? 'all' : 'catalog');
    let vector: number[] | null = null;
    if (query.q && llmConfigured() && !/^[\dрp\s.,ч-]+$/i.test(query.q)) {
      vector = await embed([query.q]).then((v) => v[0] ?? null).catch(() => null);
    }
    const result = await searchCatalog(await db(), query, vector);
    if (query.q) await logEvent(await db(), { channel: 'catalog', sessionId: getCookie(c, 'archive_visitor') ?? null, locale: localeOf(params.get('locale')), query: query.q, status: result.total ? 'answered' : 'no_results', results: result.total, latencyMs: Date.now() - started });
    return c.json({ items: result.items, total: result.total, page: result.page, size: result.size, semantic: Boolean(vector) });
  });

  app.get('/resources/:id', async (c) => {
    const resource = await getResource(await db(), c.req.param('id'));
    if (!resource) return c.json({ error: 'not_found' }, 404);
    const related = await relatedResources(await db(), resource.id);
    return c.json({ resource, related });
  });

  /** Выдача копии: только открытые материалы с подтверждённой копией. Закрытый файл не отдаётся даже по прямому ID. */
  app.get('/resources/:id/file', async (c) => {
    const [row] = await (await db()).query<{ access: string; copy_status: string; image_url: string | null }>(
      `SELECT access, copy_status, image_url FROM resources WHERE id = $1 AND status = 'published'`, [c.req.param('id')]);
    if (!row) return c.json({ error: 'not_found' }, 404);
    if (row.access !== 'open' || row.copy_status !== 'available' || !row.image_url) return c.json({ error: 'forbidden', message: 'Копия этого материала недоступна для просмотра' }, 403);
    return c.redirect(`/${row.image_url}`, 302);
  });

  app.get('/branches', async (c) => {
    const rows = await (await db()).query(`SELECT id, kind, name_ru, name_kk, name_en, address, locality, phone, email, hours,
      CASE WHEN show_on_map THEN lat END AS lat, CASE WHEN show_on_map THEN lng END AS lng, coords_precision, coords_source
      FROM branches ORDER BY kind DESC, name_ru`);
    return c.json({ items: rows });
  });

  app.get('/sections/news', async (c) => {
    const page = Math.min(Math.max(Number(c.req.query('page')) || 1, 1), 200);
    const q = (c.req.query('q') ?? '').slice(0, 100);
    const rows = await (await db()).query(`SELECT id, title, period_label AS date, left(description, 300) AS lead, source_url FROM resources
      WHERE kind = 'news' AND status = 'published' AND language = $1 AND ($2 = '' OR title ILIKE '%' || $2 || '%')
      ORDER BY published_at DESC NULLS LAST LIMIT 12 OFFSET $3`, [c.req.query('locale') === 'kk' ? 'kk' : 'ru', q, (page - 1) * 12]);
    return c.json({ items: rows, page });
  });

  app.get('/calendar', async (c) => {
    const rows = await (await db()).query(`SELECT id, title, period_label AS date, year_from AS year FROM resources
      WHERE kind = 'event' AND status = 'published' ORDER BY id LIMIT 300`);
    return c.json({ items: rows });
  });

  app.post('/chat/messages', async (c) => {
    if (!chatLimit(clientKey(c))) return c.json({ error: 'rate_limited', message: 'Слишком много вопросов подряд. Подождите минуту.' }, 429);
    const body = await c.req.json().catch(() => ({})) as { question?: unknown; locale?: unknown };
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question || question.length > 500) return c.json({ error: 'validation', message: 'Вопрос должен содержать от 1 до 500 символов' }, 400);
    let visitor = getCookie(c, 'archive_visitor');
    if (!visitor || !/^[\w-]{16,64}$/.test(visitor)) {
      visitor = randomBytes(16).toString('base64url');
      c.header('Set-Cookie', `archive_visitor=${visitor}; Path=/api/v1; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure(c) ? '; Secure' : ''}`);
    }
    return c.json(await askAssistant(await db(), { question, locale: localeOf(body.locale), sessionId: visitor }));
  });

  app.put('/chat/messages/:id/rating', async (c) => {
    const body = await c.req.json().catch(() => ({})) as { rating?: unknown };
    if (body.rating !== 1 && body.rating !== -1) return c.json({ error: 'validation', message: 'Оценка: 1 или -1' }, 400);
    await (await db()).query('UPDATE search_events SET rating = $2 WHERE message_id = $1', [c.req.param('id'), body.rating]);
    return c.json({ ok: true });
  });

  app.post('/feedback', async (c) => {
    if (!chatLimit(clientKey(c))) return c.json({ error: 'rate_limited' }, 429);
    const body = await c.req.json().catch(() => ({})) as { kind?: unknown; message?: unknown };
    const kinds = ['review', 'suggestion', 'error', 'wish'];
    const kind = typeof body.kind === 'string' && kinds.includes(body.kind) ? body.kind : null;
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!kind || message.length < 5 || message.length > 2000) return c.json({ error: 'validation', message: 'Выберите тип и напишите сообщение от 5 до 2000 символов' }, 400);
    // Личные данные в отзыве скрываются до сохранения: отзывы не публикуются как обращения.
    await (await db()).query('INSERT INTO feedback (id, kind, message) VALUES ($1, $2, $3)', [randomUUID(), kind, redactPersonalData(message).text]);
    return c.json({ ok: true }, 201);
  });

  // ---------- Панель сотрудника ----------
  const admin = new Hono<Env>();

  admin.post('/login', async (c) => {
    const body = await c.req.json().catch(() => ({})) as { email?: unknown; password?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : '';
    const password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';
    const key = `${clientKey(c)}|${email}`;
    if (!loginAllowed(key)) return c.json({ error: 'locked', message: 'Слишком много попыток. Повторите через 15 минут.' }, 429);
    const [row] = await (await db()).query<{ id: string; name: string; role: SessionUser['role']; branch_id: string | null; password_hash: string; is_active: boolean }>(
      'SELECT id, name, role, branch_id, password_hash, is_active FROM users WHERE email = $1', [email]);
    if (!row || !row.is_active || !(await verifyPassword(password, row.password_hash))) {
      recordLoginFailure(key);
      await audit(await db(), null, 'auth.login_failed', 'user', null, { email });
      return c.json({ error: 'invalid_credentials', message: 'Неверная почта или пароль' }, 401);
    }
    const user: SessionUser = { id: row.id, name: row.name, role: row.role, branchId: row.branch_id };
    const { token, csrf } = issueToken(user);
    c.header('Set-Cookie', cookieHeader(token, isSecure(c)));
    await audit(await db(), user, 'auth.login', 'user', user.id);
    return c.json({ user: { ...user, roleLabel: ROLE_LABELS[user.role], permissions: ROLE_PERMISSIONS[user.role] }, csrf });
  });

  admin.use('*', async (c, next) => {
    if (c.req.path.endsWith('/login')) return next();
    const user = readToken(getCookie(c, SESSION_COOKIE));
    if (!user) return c.json({ error: 'unauthorized', message: 'Сессия завершена. Войдите снова.' }, 401);
    if (c.req.method !== 'GET' && c.req.header('x-csrf-token') !== user.csrf) return c.json({ error: 'csrf', message: 'Неверный токен формы' }, 403);
    c.set('user', user);
    // Скользящее продление сессии: автовыход только после простоя.
    c.header('Set-Cookie', cookieHeader(issueToken(user, user.csrf).token, isSecure(c)));
    await next();
  });

  const requirePermission = (c: Context<Env>, permission: Permission) => {
    if (!can(c.get('user'), permission)) throw new HttpForbidden();
  };
  admin.onError((error, c) => {
    if (error instanceof HttpForbidden) return c.json({ error: 'forbidden', message: 'Недостаточно прав для этого действия' }, 403);
    throw error;
  });

  admin.get('/session', (c) => {
    const user = c.get('user');
    return c.json({ user: { id: user.id, name: user.name, role: user.role, roleLabel: ROLE_LABELS[user.role], branchId: user.branchId, permissions: ROLE_PERMISSIONS[user.role] }, csrf: user.csrf });
  });

  admin.post('/logout', async (c) => {
    await audit(await db(), c.get('user'), 'auth.logout', 'user', c.get('user').id);
    c.header('Set-Cookie', clearCookieHeader());
    return c.json({ ok: true });
  });

  admin.get('/moderation', async (c) => {
    const user = c.get('user');
    const status = c.req.query('status');
    const filter = STATUSES.includes(status as Status) ? status : null;
    const params: unknown[] = [filter, user.role === 'branch_admin' ? user.branchId : null];
    const rows = await (await db()).query<{ id: string; title: string; kind: string; status: Status; branch_id: string | null; updated_at: string; created_by: string | null; author: string | null }>(
      `SELECT r.id, r.title, r.kind, r.status, r.branch_id, r.updated_at, r.created_by, u.name AS author FROM resources r LEFT JOIN users u ON u.id = r.created_by
       WHERE (CASE WHEN $1::text IS NULL THEN (r.status <> 'published' OR r.created_by IS NOT NULL) ELSE r.status = $1::text END)
         AND ($2::text IS NULL OR r.branch_id = $2::text)
       ORDER BY r.updated_at DESC LIMIT 50`, params);
    const counts = await (await db()).query<{ status: string; count: number }>(`SELECT status, count(*)::int AS count FROM resources WHERE status <> 'published' OR created_by IS NOT NULL GROUP BY status`);
    return c.json({ items: rows.map((row) => ({ ...row, transitions: allowedTransitions(user, row.status) })), counts: Object.fromEntries(counts.map((r) => [r.status, r.count])) });
  });

  admin.get('/moderation/:id/history', async (c) => {
    const rows = await (await db()).query(`SELECT m.from_status, m.to_status, m.note, m.at, u.name AS user_name FROM moderation_events m LEFT JOIN users u ON u.id = m.user_id WHERE resource_id = $1 ORDER BY at`, [c.req.param('id')]);
    return c.json({ items: rows });
  });

  admin.post('/moderation/:id', async (c) => {
    const body = await c.req.json().catch(() => ({})) as { to?: unknown; note?: unknown };
    if (!STATUSES.includes(body.to as Status)) return c.json({ error: 'validation', message: 'Неизвестный статус' }, 400);
    await transition(await db(), c.get('user'), c.req.param('id'), body.to as Status, typeof body.note === 'string' ? body.note.slice(0, 500) : null);
    return c.json({ ok: true });
  });

  admin.post('/resources', async (c) => {
    const user = c.get('user');
    if (!can(user, 'catalog.edit') && !can(user, 'content.create')) throw new HttpForbidden();
    const input = await c.req.json().catch(() => ({})) as DraftInput;
    const errors = validateDraft(input);
    if (errors.length) return c.json({ error: 'validation', message: errors.join('. '), errors }, 400);
    if (input.branchId && !canEditBranch(user, input.branchId) && user.role === 'branch_admin') throw new HttpForbidden();
    return c.json({ id: await createDraft(await db(), user, input) }, 201);
  });

  admin.post('/extract', async (c) => {
    requirePermission(c, 'ai.extract');
    const body = await c.req.json().catch(() => ({})) as { image?: unknown };
    const image = typeof body.image === 'string' ? body.image : '';
    if (!/^data:image\/(png|jpe?g|webp);base64,/.test(image) || image.length > 7_000_000) return c.json({ error: 'validation', message: 'Нужно изображение PNG, JPEG или WebP до 5 МБ' }, 400);
    return c.json(await extractFromScan(await db(), c.get('user'), image));
  });

  admin.post('/import', async (c) => {
    requirePermission(c, 'catalog.import');
    const body = await c.req.json().catch(() => ({})) as { fileName?: unknown; text?: unknown };
    const text = typeof body.text === 'string' ? body.text : '';
    if (!text || text.length > 2_000_000) return c.json({ error: 'validation', message: 'Файл CSV пустой или больше 2 МБ' }, 400);
    try {
      return c.json(await importCsv(await db(), c.get('user'), typeof body.fileName === 'string' ? body.fileName : 'import.csv', text));
    } catch (error) {
      return c.json({ error: 'validation', message: (error as Error).message }, 400);
    }
  });

  admin.get('/export', async (c) => {
    requirePermission(c, 'catalog.edit');
    const kind = c.req.query('kind') ?? 'fund';
    const rows = await (await db()).query<Record<string, unknown>>(`SELECT id, kind, reference, title, year_from, year_to, doc_type, place, access, copy_status, status FROM resources WHERE kind = $1 ORDER BY reference LIMIT 20000`, [kind]);
    await audit(await db(), c.get('user'), 'catalog.export', 'resource', null, { kind, rows: rows.length });
    c.header('Content-Type', 'text/csv; charset=utf-8');
    c.header('Content-Disposition', `attachment; filename="catalog-${kind}.csv"`);
    return c.body('﻿' + exportCsv(rows));
  });

  admin.get('/feedback', async (c) => {
    requirePermission(c, 'feedback.moderate');
    return c.json({ items: await (await db()).query('SELECT id, kind, message, status, moderator_note, created_at FROM feedback ORDER BY created_at DESC LIMIT 100') });
  });

  admin.post('/feedback/:id', async (c) => {
    requirePermission(c, 'feedback.moderate');
    const body = await c.req.json().catch(() => ({})) as { status?: unknown; note?: unknown };
    if (body.status !== 'approved' && body.status !== 'rejected') return c.json({ error: 'validation', message: 'Статус: approved или rejected' }, 400);
    await (await db()).query('UPDATE feedback SET status = $2, moderator_note = $3 WHERE id = $1', [c.req.param('id'), body.status, typeof body.note === 'string' ? body.note.slice(0, 500) : null]);
    await audit(await db(), c.get('user'), `feedback.${body.status}`, 'feedback', c.req.param('id'));
    return c.json({ ok: true });
  });

  admin.get('/audit', async (c) => {
    requirePermission(c, 'audit.read');
    return c.json({ items: await (await db()).query(`SELECT a.id, a.at, a.action, a.entity, a.entity_id, a.details, u.name AS user_name FROM audit_log a LEFT JOIN users u ON u.id = a.user_id ORDER BY a.at DESC LIMIT 200`) });
  });

  admin.get('/analytics', async (c) => {
    requirePermission(c, 'analytics.read');
    return c.json(await analytics(await db()));
  });

  admin.post('/analytics/recommendations', async (c) => {
    requirePermission(c, 'analytics.read');
    return c.json({ items: await recommendations(await analytics(await db())) });
  });

  admin.get('/roles', (c) => c.json({ items: ROLES.map((role) => ({ role, label: ROLE_LABELS[role], permissions: ROLE_PERMISSIONS[role] })) }));

  admin.get('/users', async (c) => {
    requirePermission(c, 'users.manage');
    return c.json({ items: await (await db()).query('SELECT id, email, name, role, branch_id, is_active FROM users ORDER BY role') });
  });

  admin.post('/branches/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    if (!can(user, 'branches.edit') || !canEditBranch(user, id)) throw new HttpForbidden();
    const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
    const fields = ['phone', 'email', 'hours', 'address'].filter((f) => typeof body[f] === 'string');
    if (!fields.length && typeof body.show_on_map !== 'boolean') return c.json({ error: 'validation', message: 'Нет изменяемых полей' }, 400);
    const sets = fields.map((f, i) => `${f} = $${i + 2}`);
    const values = fields.map((f) => String(body[f]).slice(0, 300));
    if (typeof body.show_on_map === 'boolean') { sets.push(`show_on_map = $${values.length + 2}`); values.push(String(body.show_on_map)); }
    await (await db()).query(`UPDATE branches SET ${sets.join(', ')}, updated_at = now() WHERE id = $1`, [id, ...values]);
    await audit(await db(), user, 'branch.update', 'branch', id, { fields });
    return c.json({ ok: true });
  });

  app.route('/admin', admin);
  return app;
}

class HttpForbidden extends Error {}
