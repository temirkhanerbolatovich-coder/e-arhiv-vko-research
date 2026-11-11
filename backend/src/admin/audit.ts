/** Журнал действий (ТЗ 6.8): дата, время, сотрудник, действие, объект. Пароли и токены сюда не пишутся. */
import type { Db } from '../db/client.ts';
import type { SessionUser } from '../auth/roles.ts';

export async function audit(db: Db, user: Pick<SessionUser, 'id'> | null, action: string, entity: string | null, entityId: string | null, details: Record<string, unknown> = {}): Promise<void> {
  await db.query('INSERT INTO audit_log (user_id, action, entity, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
    [user?.id ?? null, action, entity, entityId, JSON.stringify(details)]);
}
