/**
 * Адаптер языковой модели и эмбеддингов (OpenAI-совместимый HTTP API).
 * Провайдер меняется переменными LLM_BASE_URL / LLM_MODEL — например, на модель в контуре РК.
 * В модель передаются только открытые фрагменты и вопрос после маскирования ПДн.
 */
import { config } from '../config.ts';

export class LlmUnavailableError extends Error {}

/** OIDC-токен Vercel приходит в заголовке каждого запроса к функции; хранится только в памяти процесса. */
let gatewayToken = '';
export function setGatewayToken(token: string | undefined): void {
  if (token) gatewayToken = token;
}

function apiKey(): string {
  return config.llm.apiKey || (config.llm.useGateway ? config.llm.gatewayApiKey || gatewayToken || process.env.VERCEL_OIDC_TOKEN || '' : '');
}

function headers(): Record<string, string> {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey()}` };
}

export function llmConfigured(): boolean {
  return Boolean(config.llm.apiKey || config.llm.useGateway);
}

/** Сбой модели не ломает ответ (есть режим поиска), но должен быть виден в журнале сервера. Ключ не логируется. */
function logged(error: LlmUnavailableError, pathName: string): LlmUnavailableError {
  console.warn(`[llm] ${pathName} via ${config.llm.useGateway ? 'gateway' : 'direct'}: ${error.message}`);
  return error;
}

async function post<T>(pathName: string, body: unknown, timeoutMs = config.llm.timeoutMs): Promise<T> {
  if (!apiKey()) throw new LlmUnavailableError('LLM API key is not configured');
  const response = await fetch(`${config.llm.baseUrl}${pathName}`, {
    method: 'POST', headers: headers(), body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs),
  }).catch((error: unknown) => { throw logged(new LlmUnavailableError(`LLM request failed: ${(error as Error).message}`), pathName); });
  if (!response.ok) throw logged(new LlmUnavailableError(`LLM HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`), pathName);
  return (await response.json()) as T;
}

export async function embed(texts: string[]): Promise<number[][]> {
  if (!config.llm.queryEmbeddings) throw new LlmUnavailableError('Query embeddings are disabled');
  const result = await post<{ data: Array<{ embedding: number[]; index: number }> }>('/embeddings', {
    model: config.llm.embeddingModel, input: texts, dimensions: config.llm.embeddingDimensions,
  }, 60000);
  return result.data.sort((a, b) => a.index - b.index).map((item) => item.embedding);
}

interface ResponsesOutput { output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }> }

/** Ответ модели в формате JSON по схеме (structured output). */
export async function completeJson<T>(instructions: string, input: string, schemaName: string, schema: Record<string, unknown>, maxTokens = 900): Promise<T> {
  const result = await post<ResponsesOutput>('/responses', {
    model: config.llm.chatModel,
    reasoning: { effort: config.llm.reasoningEffort },
    instructions,
    input,
    max_output_tokens: maxTokens,
    text: { format: { type: 'json_schema', name: schemaName, schema, strict: true } },
  });
  const text = result.output?.flatMap((item) => item.content ?? []).find((part) => part.type === 'output_text')?.text;
  if (!text) throw new LlmUnavailableError('Empty model response');
  return JSON.parse(text) as T;
}

/** Ответ модели по изображению (распознавание скана) в формате JSON. */
export async function completeJsonFromImage<T>(instructions: string, imageDataUrl: string, schemaName: string, schema: Record<string, unknown>): Promise<T> {
  const result = await post<ResponsesOutput>('/responses', {
    model: config.llm.chatModel,
    reasoning: { effort: config.llm.reasoningEffort },
    instructions,
    input: [{ role: 'user', content: [{ type: 'input_text', text: 'Распознай документ и заполни карточку.' }, { type: 'input_image', image_url: imageDataUrl }] }],
    max_output_tokens: 1200,
    text: { format: { type: 'json_schema', name: schemaName, schema, strict: true } },
  }, 45000);
  const text = result.output?.flatMap((item) => item.content ?? []).find((part) => part.type === 'output_text')?.text;
  if (!text) throw new LlmUnavailableError('Empty model response');
  return JSON.parse(text) as T;
}
