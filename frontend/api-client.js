/* Клиент API /api/v1. Если сервер недоступен (статическая раздача прототипа), модули остаются на локальных примерах. */
(function () {
  'use strict';
  const base = '/api/v1';
  let csrf = null;

  const ready = fetch(base + '/health', { headers: { Accept: 'application/json' } })
    .then((response) => (response.ok ? response.json() : null))
    .then((health) => { api.health = health; return Boolean(health && health.ok); })
    .catch(() => false);

  async function request(method, path, body) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (csrf && method !== 'GET') headers['X-CSRF-Token'] = csrf;
    const response = await fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), credentials: 'same-origin' });
    const contentType = response.headers.get('Content-Type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const error = new Error((data && data.message) || 'Ошибка запроса');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  /** Экранирование данных из API перед вставкой в разметку. */
  function escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  /** Разрешены только внутренние маршруты и https-ссылки. */
  function safeHref(value) {
    const href = String(value || '');
    return /^#\//.test(href) || /^https:\/\//.test(href) ? href : '#/';
  }

  const api = {
    ready,
    health: null,
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body ?? {}),
    put: (path, body) => request('PUT', path, body ?? {}),
    setCsrf: (value) => { csrf = value; },
    escape,
    safeHref,
  };
  window.archiveApi = api;
}());
