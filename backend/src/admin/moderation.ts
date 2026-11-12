/**
 * Согласование публикаций (ТЗ 6.7): черновик → на проверке → требует доработки / одобрено → опубликовано → архивировано.
 * Переход проверяется по таблице допустимых переходов и роли. Публикация пересобирает поисковый индекс записи,
 * каждый шаг пишется в журнал (ТЗ 6.8).
 */
import type { Db } from '../db/client.ts';
import { reindex } from '../db/load.ts';
import { can, type Permission, type SessionUser } from '../auth/roles.ts';
import { audit } from './audit.ts';

export const STATUSES = ['draft', 'review', 'needs_changes', 'approved', 'published', 'archived'] as const;
export type Status = (typeof STATUSES)[number];

/** Кто может выполнить переход: автор отправляет на проверку, модератор/редактор решают, публикует редактор. */
const TRANSITIONS: Record<Status, Partial<Record<Status, Permission>>> = {
  draft: { review: 'content.create' },
  review: { approved: 'moderation.review', needs_changes: 'moderation.review' },
  needs_changes: { review: 'content.create' },
  approved: { published: 'content.publish', needs_changes: 'moderation.review' },
  published: { archived: 'content.publish' },
  archived: { draft: 'content.publish' },
};

export class TransitionError extends Error {}

export function allowedTransitions(user: SessionUser, from: Status): Status[] {
  return (Object.entries(TRANSITIONS[from]) as Array<[Status, Permission]>)
    .filter(([, permission]) => can(user, permission)).map(([to]) => to);
}

export async function transition(db: Db, user: SessionUser, resourceId: string, to: Status, note: string | null): Promise<void> {
  const [row] = await db.query<{ status: Status; branch_id: string | null }>('SELECT status, branch_id FROM resources WHERE id = $1', [resourceId]);
  if (!row) throw new TransitionError('Материал не найден');
  const permission = TRANSITIONS[row.status][to];
  if (!permission) throw new TransitionError(`Переход «${row.status} → ${to}» не предусмотрен`);
  if (!can(user, permission)) throw new TransitionError('Недостаточно прав для этого шага');
  if (user.role === 'branch_admin' && row.branch_id !== user.branchId) throw new TransitionError('Материал другого филиала');
  await db.transaction(async (tx) => {
    await tx.query(`UPDATE resources SET status = $2, updated_at = now(), published_at = CASE WHEN $2 = 'published' THEN now() ELSE published_at END WHERE id = $1`, [resourceId, to]);
    await tx.query('INSERT INTO moderation_events (resource_id, from_status, to_status, user_id, note) VALUES ($1, $2, $3, $4, $5)', [resourceId, row.status, to, user.id, note]);
    await audit(tx, user, `moderation.${to}`, 'resource', resourceId, { from: row.status, note });
    if (to === 'published' || row.status === 'published') {
      if (to === 'published') await reindex(tx, undefined, [resourceId]);
      else await tx.query('DELETE FROM search_chunks WHERE resource_id = $1', [resourceId]);
    }
  });
}
