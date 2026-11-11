/**
 * Роли панели сотрудника (ТЗ 6.1) и их полномочия. Права настраиваются матрицей ROLE_PERMISSIONS;
 * область филиала проверяется отдельно (canEditBranch).
 */
export const ROLES = ['super_admin', 'site_admin', 'editor', 'archivist', 'branch_admin', 'moderator', 'analyst'] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  'users.manage', 'settings.manage', 'audit.read', 'content.create', 'content.publish', 'catalog.edit', 'catalog.import',
  'branches.edit', 'moderation.review', 'feedback.moderate', 'analytics.read', 'ai.extract',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: PERMISSIONS,
  site_admin: ['users.manage', 'settings.manage', 'audit.read', 'content.create', 'content.publish', 'branches.edit', 'feedback.moderate', 'analytics.read'],
  editor: ['content.create', 'content.publish', 'moderation.review', 'ai.extract'],
  archivist: ['catalog.edit', 'catalog.import', 'content.create', 'ai.extract'],
  branch_admin: ['branches.edit', 'content.create', 'catalog.edit'],
  moderator: ['moderation.review', 'feedback.moderate'],
  analyst: ['analytics.read'],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Главный администратор', site_admin: 'Администратор сайта', editor: 'Редактор', archivist: 'Сотрудник архива',
  branch_admin: 'Администратор филиала', moderator: 'Модератор', analyst: 'Аналитик',
};

export interface SessionUser { id: string; name: string; role: Role; branchId: string | null }

export function can(user: SessionUser, permission: Permission): boolean {
  return ROLE_PERMISSIONS[user.role].includes(permission);
}

/** Администратор филиала меняет только свой филиал; остальные с правом branches.edit — любой. */
export function canEditBranch(user: SessionUser, branchId: string | null): boolean {
  if (!can(user, 'branches.edit') && !can(user, 'catalog.edit')) return false;
  return user.role !== 'branch_admin' || (branchId !== null && branchId === user.branchId);
}

/** Демо-учётки по одной на роль. Пароль общий (config.demoPassword), в продакшене учётки создаёт администратор. */
export const DEMO_USERS: Array<{ id: string; email: string; name: string; role: Role; branchId: string | null }> = [
  { id: 'u-super', email: 'admin@archive.demo', name: 'Главный администратор (демо)', role: 'super_admin', branchId: null },
  { id: 'u-site', email: 'site@archive.demo', name: 'Администратор сайта (демо)', role: 'site_admin', branchId: null },
  { id: 'u-editor', email: 'editor@archive.demo', name: 'Редактор (демо)', role: 'editor', branchId: null },
  { id: 'u-archivist', email: 'archivist@archive.demo', name: 'Сотрудник архива (демо)', role: 'archivist', branchId: 'main' },
  { id: 'u-ridder', email: 'ridder@archive.demo', name: 'Администратор Риддерского филиала (демо)', role: 'branch_admin', branchId: 'ridder' },
  { id: 'u-moderator', email: 'moderator@archive.demo', name: 'Модератор (демо)', role: 'moderator', branchId: null },
  { id: 'u-analyst', email: 'analyst@archive.demo', name: 'Аналитик (демо)', role: 'analyst', branchId: null },
];
