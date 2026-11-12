/**
 * Сессии сотрудников без хранилища: подписанный HMAC-SHA256 токен в cookie (HttpOnly, SameSite=Strict).
 * Подходит для нескольких экземпляров serverless. Автовыход по неактивности (ТЗ 7.3): токен
 * перевыпускается при каждом запросе, истекает через SESSION_IDLE_MINUTES без активности.
 * CSRF: cookie SameSite=Strict + обязательный заголовок X-CSRF-Token, равный значению из токена.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { config } from '../config.ts';
import type { Role, SessionUser } from './roles.ts';

export const SESSION_COOKIE = 'archive_staff';

interface Payload extends SessionUser { csrf: string; exp: number }

const sign = (data: string) => createHmac('sha256', config.sessionSecret).update(data).digest('base64url');

export function issueToken(user: SessionUser, csrf = randomBytes(18).toString('base64url')): { token: string; csrf: string } {
  const payload: Payload = { ...user, csrf, exp: Date.now() + config.sessionIdleMinutes * 60_000 };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { token: `${body}.${sign(body)}`, csrf };
}

export function readToken(token: string | undefined): (SessionUser & { csrf: string }) | null {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.') as [string, string];
  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as Payload;
    if (payload.exp < Date.now()) return null;
    return { id: payload.id, name: payload.name, role: payload.role as Role, branchId: payload.branchId, csrf: payload.csrf };
  } catch {
    return null;
  }
}

export function cookieHeader(token: string, secure: boolean): string {
  return `${SESSION_COOKIE}=${token}; Path=/api/v1/admin; HttpOnly; SameSite=Strict; Max-Age=${config.sessionIdleMinutes * 60}${secure ? '; Secure' : ''}`;
}

export function clearCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/api/v1/admin; HttpOnly; SameSite=Strict; Max-Age=0`;
}

/** Ограничение попыток входа (ТЗ 7.3): 5 неудач за 15 минут на адрес/учётку. В памяти экземпляра. */
const failures = new Map<string, number[]>();
export function loginAllowed(key: string): boolean {
  const now = Date.now();
  const recent = (failures.get(key) ?? []).filter((t) => now - t < 15 * 60_000);
  failures.set(key, recent);
  return recent.length < 5;
}
export function recordLoginFailure(key: string): void {
  failures.set(key, [...(failures.get(key) ?? []), Date.now()]);
}
