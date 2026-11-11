/** Конфигурация из окружения. Секреты в репозиторий не попадают: см. backend/.env.example. */
function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const value = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const isProduction = process.env.NODE_ENV === 'production';
const directApiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';
/**
 * На Vercel без собственного ключа модель вызывается через Vercel AI Gateway (те же модели OpenAI,
 * ключ AI_GATEWAY_API_KEY или OIDC-токен проекта). Собственный ключ OPENAI_API_KEY имеет приоритет.
 */
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY || '';
const useGateway = !directApiKey && (Boolean(gatewayApiKey) || process.env.VERCEL === '1') && process.env.LLM_GATEWAY !== 'off';
const gatewayModel = (model: string) => (useGateway && !model.includes('/') ? `openai/${model}` : model);

export const config = {
  port: intFromEnv('PORT', 4173),
  databaseUrl: process.env.DATABASE_URL || null,
  /** Каталог PGlite на диске (локальная разработка). Пусто — база в памяти. */
  pgliteDir: process.env.PGLITE_DIR || null,
  llm: {
    baseUrl: process.env.LLM_BASE_URL || (useGateway ? 'https://ai-gateway.vercel.sh/v1' : 'https://api.openai.com/v1'),
    apiKey: directApiKey,
    useGateway,
    /** Ключ Vercel AI Gateway; без него на Vercel используется OIDC-токен проекта. */
    gatewayApiKey,
    chatModel: gatewayModel(process.env.LLM_MODEL || 'gpt-6-luna'),
    /** Модель без рассуждений: быстрее и дешевле для справочных ответов. */
    reasoningEffort: process.env.LLM_REASONING_EFFORT || 'none',
    embeddingModel: gatewayModel(process.env.EMBEDDING_MODEL || 'text-embedding-3-small'),
    embeddingDimensions: 256,
    /** off — не считать эмбеддинги запросов (например, тариф шлюза без моделей эмбеддингов); поиск остаётся полнотекстовым. */
    queryEmbeddings: process.env.QUERY_EMBEDDINGS !== 'off',
    timeoutMs: intFromEnv('LLM_TIMEOUT_MS', 20000),
  },
  /** Ключ подписи сессий сотрудников. В продакшене обязателен. */
  sessionSecret: process.env.SESSION_SECRET || (isProduction ? '' : 'dev-only-session-secret-change-me'),
  sessionIdleMinutes: intFromEnv('SESSION_IDLE_MINUTES', 30),
  /** Пароль демо-учёток (только для демонстрации; в продакшене учётки создаёт администратор). */
  demoPassword: process.env.DEMO_PASSWORD || 'archive-demo-2026',
  isProduction,
};

export function assertProductionConfig(): void {
  if (config.isProduction && !config.sessionSecret) {
    throw new Error('SESSION_SECRET is required in production');
  }
}
