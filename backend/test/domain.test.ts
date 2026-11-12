import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFundNumber, parseShelfmark, formatShelfmark } from '../src/domain/shelfmark.ts';
import { isValidIin, redactPersonalData } from '../src/privacy/redact.ts';
import { placeVariants, explainPlaceAlias } from '../src/domain/places.ts';
import { stemKazakhWord, queryTerms } from '../src/domain/text.ts';
import { can, canEditBranch, type SessionUser } from '../src/auth/roles.ts';
import { issueToken, readToken } from '../src/auth/session.ts';
import { hashPassword, verifyPassword } from '../src/auth/password.ts';
import { allowedTransitions } from '../src/admin/moderation.ts';
import { validateDraft, parseCsvText, exportCsv } from '../src/admin/catalog-admin.ts';
import { parseCatalogQuery, ValidationError } from '../src/search/catalog.ts';

const user = (role: SessionUser['role'], branchId: string | null = null): SessionUser => ({ id: 'u1', name: 'Тест', role, branchId });

test('шифр: номер фонда нормализуется и разбирается', () => {
  assert.equal(normalizeFundNumber('р1'), 'Р-1');
  const parsed = parseShelfmark('Ф. Р-136, оп. 1, д. 25');
  assert.ok(parsed);
  assert.equal(parsed.fund, 'Р-136');
  assert.equal(parsed.inventory, '1');
  assert.equal(parsed.case, '25');
  assert.equal(parseShelfmark('р136')?.fund, 'Р-136');
  assert.match(formatShelfmark({ fund: 'Р-1', inventory: '2' }), /Р-1.*2/);
});

test('ИИН с верной контрольной суммой маскируется, телефон и почта тоже', () => {
  assert.equal(isValidIin('000000000000'), true);
  assert.equal(isValidIin('123456789012'), false);
  const result = redactPersonalData('Мой ИИН 000000000000, тел. +7 701 123 45 67, почта a@b.kz');
  assert.doesNotMatch(result.text, /000000000000|701 123|a@b\.kz/);
  assert.match(result.text, /\[ИИН\]/);
  assert.match(result.text, /\[ТЕЛЕФОН\]/);
  assert.match(result.text, /\[EMAIL\]/);
});

test('исторические названия мест расширяют поиск', () => {
  assert.ok(placeVariants('Лениногорск').some((v) => /риддер/i.test(v)));
  assert.ok(explainPlaceAlias('комбинат в Лениногорске'));
});

test('казахская морфология и стоп-слова', () => {
  assert.equal(stemKazakhWord('архивтері'), stemKazakhWord('архив'));
  assert.deepEqual(queryTerms('покажи фото и документы'), queryTerms('фото документы'));
});

test('роли: администратор филиала ограничен своим филиалом, аналитик не публикует', () => {
  assert.equal(canEditBranch(user('branch_admin', 'ridder'), 'ridder'), true);
  assert.equal(canEditBranch(user('branch_admin', 'ridder'), 'main'), false);
  assert.equal(canEditBranch(user('super_admin'), 'main'), true);
  assert.equal(can(user('analyst'), 'content.publish'), false);
  assert.equal(can(user('editor'), 'content.publish'), true);
});

test('сессия: подпись проверяется, подмена роли отклоняется', () => {
  const { token, csrf } = issueToken(user('editor'));
  const session = readToken(token);
  assert.equal(session?.role, 'editor');
  assert.equal(session?.csrf, csrf);
  const [payload, signature] = token.split('.');
  const forged = Buffer.from(Buffer.from(payload!, 'base64url').toString().replace('editor', 'super_admin')).toString('base64url');
  assert.equal(readToken(`${forged}.${signature}`), null);
  assert.equal(readToken(undefined), null);
});

test('пароль хранится как scrypt-хеш', async () => {
  const stored = await hashPassword('secret-1');
  assert.doesNotMatch(stored, /secret-1/);
  assert.equal(await verifyPassword('secret-1', stored), true);
  assert.equal(await verifyPassword('secret-2', stored), false);
});

test('модерация: переходы зависят от роли', () => {
  assert.deepEqual(allowedTransitions(user('archivist'), 'draft'), ['review']);
  assert.deepEqual(allowedTransitions(user('analyst'), 'review'), []);
  assert.ok(allowedTransitions(user('moderator'), 'review').includes('approved'));
  assert.equal(allowedTransitions(user('moderator'), 'approved').includes('published'), false);
});

test('черновик: для дела обязательны фонд, опись и номер дела', () => {
  assert.ok(validateDraft({ kind: 'case', title: 'Дело о строительстве' }).length > 0);
  assert.deepEqual(validateDraft({ kind: 'case', title: 'Дело о строительстве', fundNo: 'Р-1', inventoryNo: '1', caseNo: '5' }), []);
  assert.ok(validateDraft({ kind: 'document', title: 'x' }).length > 0);
});

test('CSV: кавычки и точка с запятой разбираются, формулы экранируются при выгрузке', () => {
  assert.deepEqual(parseCsvText('a;b\n"x;1";"он сказал ""да"""\n'), [['a', 'b'], ['x;1', 'он сказал "да"']]);
  assert.match(exportCsv([{ title: '=HYPERLINK("x")' }]), /'=HYPERLINK/);
});

test('параметры каталога проверяются', () => {
  const query = parseCatalogQuery(new URLSearchParams('q=комбинат&type=document&year-from=1950&year-to=1960&size=500'));
  assert.ok(query.size <= 50);
  assert.ok(query.kinds.includes('case'));
  assert.throws(() => parseCatalogQuery(new URLSearchParams('year-from=1990&year-to=1950')), ValidationError);
});

test('памятные даты: день и месяц из текста, ближайшие по кругу года', async () => {
  const { parseDayMonth, upcomingEvents } = await import('../src/domain/calendar.ts');
  assert.deepEqual(parseDayMonth('7 февраля 2025'), { day: 7, month: 1 });
  assert.deepEqual(parseDayMonth('9 мая'), { day: 9, month: 4 });
  assert.deepEqual(parseDayMonth('3 марта'), { day: 3, month: 2 });
  assert.equal(parseDayMonth('без даты'), null);
  const events = [{ date: '1 января' }, { date: '20 ноября' }, { date: '12 ноября' }];
  const next = upcomingEvents(events, new Date(Date.UTC(2026, 10, 11)), 3);
  assert.deepEqual(next.map((e) => e.date), ['12 ноября', '20 ноября', '1 января']);
  assert.equal(next[0]!.inDays, 1);
});
