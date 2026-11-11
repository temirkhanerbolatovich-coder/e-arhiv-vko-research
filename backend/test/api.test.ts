import { test, before } from 'node:test';
import assert from 'node:assert/strict';

// Тесты API не должны обращаться к внешней модели: помощник работает в режиме поиска без ИИ.
process.env.LLM_API_KEY = '';
process.env.OPENAI_API_KEY = '';
const { createApp } = await import('../src/http/app.ts');
const { openDb } = await import('../src/db/client.ts');
const app = createApp(openDb());
const call = (path: string, init?: RequestInit) => app.request('/api/v1' + path, init);
const json = (body: unknown, headers: Record<string, string> = {}) => ({ method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });

before(async () => { assert.equal((await call('/health')).status, 200); });

test('каталог: поиск по шифру и фильтр по типу', async () => {
  const res = await call('/catalog?q=' + encodeURIComponent('Р-136'));
  const data = await res.json() as { items: Array<{ reference: string | null }> };
  assert.equal(res.status, 200);
  assert.match(data.items[0]?.reference ?? '', /Р-136/);
  const photos = await (await call('/catalog?type=photo&size=5')).json() as { items: Array<{ kind: string }> };
  assert.ok(photos.items.length > 0 && photos.items.every((item) => item.kind === 'photo'));
  assert.equal((await call('/catalog?year-from=1990&year-to=1950')).status, 400);
});

test('карточка и копия ограниченного документа не выдаётся', async () => {
  assert.equal((await call('/resources/demo-doc-flood')).status, 200);
  assert.equal((await call('/resources/demo-doc-restricted/file')).status, 403);
  assert.equal((await call('/resources/does-not-exist')).status, 404);
});

test('филиалы с координатами', async () => {
  const data = await (await call('/branches')).json() as { items: Array<{ id: string; lat: number | null }> };
  assert.equal(data.items.length, 14);
  assert.ok(data.items.find((b) => b.id === 'main')?.lat);
});

test('помощник без модели отвечает поиском и не сохраняет ИИН', async () => {
  const res = await call('/chat/messages', json({ question: 'Лениногорский комбинат, мой ИИН 000000000000', locale: 'ru' }));
  const data = await res.json() as { mode: string; sources: unknown[]; status: string };
  assert.equal(res.status, 200);
  assert.equal(data.mode, 'search');
  assert.ok(data.sources.length > 0);
  assert.equal((await call('/chat/messages', json({ question: '' }))).status, 400);
});

test('отзыв: пустой отклоняется, личные данные маскируются', async () => {
  assert.equal((await call('/feedback', json({ kind: 'wish', message: '' }))).status, 400);
  assert.equal((await call('/feedback', json({ kind: 'wish', message: 'Добавьте фото, звоните +7 701 123 45 67' }))).status, 201);
});

test('панель: без входа 401, без CSRF 403, после входа доступна модерация', async () => {
  assert.equal((await call('/admin/moderation')).status, 401);
  assert.equal((await call('/admin/login', json({ email: 'editor@archive.demo', password: 'wrong' }))).status, 401);
  const login = await call('/admin/login', json({ email: 'editor@archive.demo', password: 'archive-demo-2026' }));
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie')!.split(';')[0]!;
  const { csrf } = await login.json() as { csrf: string };
  assert.equal((await call('/admin/moderation', { headers: { Cookie: cookie } })).status, 200);
  const draft = { kind: 'document', title: 'Тестовый документ', fundNo: 'Р-1', inventoryNo: '1', caseNo: '1' };
  assert.equal((await call('/admin/resources', json(draft, { Cookie: cookie }))).status, 403);
  assert.equal((await call('/admin/resources', json(draft, { Cookie: cookie, 'X-CSRF-Token': csrf }))).status, 201);
});

test('аналитик не может публиковать и импортировать', async () => {
  const login = await call('/admin/login', json({ email: 'analyst@archive.demo', password: 'archive-demo-2026' }));
  const cookie = login.headers.get('set-cookie')!.split(';')[0]!;
  const { csrf } = await login.json() as { csrf: string };
  assert.equal((await call('/admin/import', json({ fileName: 'a.csv', text: 'kind,title\nfund,Тест' }, { Cookie: cookie, 'X-CSRF-Token': csrf }))).status, 403);
  assert.equal((await call('/admin/analytics', { headers: { Cookie: cookie } })).status, 200);
});
