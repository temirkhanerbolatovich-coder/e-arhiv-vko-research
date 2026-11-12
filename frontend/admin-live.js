/* Рабочие экраны панели сотрудника поверх макета: вход, модерация, новая запись (с ИИ-распознаванием), импорт,
   аналитика, отзывы, журнал, роли. Права проверяет сервер; интерфейс лишь скрывает недоступные действия. */
(function () {
  'use strict';
  const LIVE = new Set(['login', 'session', 'moderation', 'editor', 'analytics', 'feedback', 'audit', 'imports', 'users', 'roles']);
  const STATUS = { draft: 'Черновик', review: 'На проверке', needs_changes: 'Требует доработки', approved: 'Одобрено', published: 'Опубликовано', archived: 'Архивировано' };
  const ACTION = { review: 'Отправить на проверку', approved: 'Одобрить', needs_changes: 'На доработку', published: 'Опубликовать', archived: 'В архив', draft: 'Вернуть в черновик' };
  let session = null;

  const api = () => window.archiveApi;
  const esc = (v) => window.archiveApi.escape(v);
  const date = (v) => new Date(v).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  const message = (text, kind = 'info') => `<p class="admin-live-message" data-kind="${kind}" role="status">${esc(text)}</p>`;
  const heading = (kicker, title, desc) => `<div class="admin-heading"><div><p class="admin-kicker">${kicker}</p><h1>${title}</h1><p>${desc}</p></div></div>`;

  async function loadSession() {
    try {
      const data = await api().get('/admin/session');
      session = data.user; api().setCsrf(data.csrf);
    } catch { session = null; }
    return session;
  }

  function loginScreen(target) {
    return `${heading('ДОСТУП СОТРУДНИКОВ', 'Вход в панель', 'Вход по рабочей почте. После 5 неудачных попыток вход блокируется на 15 минут; сессия завершается после 30 минут бездействия.')}
      <section class="admin-panel"><form class="admin-live-form" id="admin-login"><label>Рабочая почта<input type="email" name="email" autocomplete="username" required value="admin@archive.demo"></label>
      <label>Пароль<input type="password" name="password" autocomplete="current-password" required></label><button type="submit">Войти</button><div id="admin-login-result"></div></form>
      <p class="admin-muted">Демо-учётки по ролям ТЗ 6.1: admin@, site@, editor@, archivist@, ridder@ (администратор филиала), moderator@, analyst@archive.demo. Пароль демо-стенда указан в README.</p></section>`;
  }

  function bindLogin(main, target) {
    main.querySelector('#admin-login')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      const box = main.querySelector('#admin-login-result');
      try {
        const data = await api().post('/admin/login', { email: form.get('email'), password: form.get('password') });
        session = data.user; api().setCsrf(data.csrf);
        location.hash = '#/admin/' + (target && target !== 'login' ? target : 'moderation');
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } catch (error) { box.innerHTML = message(error.message, 'error'); }
    });
  }

  async function moderation(main) {
    const data = await api().get('/admin/moderation');
    const counts = ['review', 'needs_changes', 'approved', 'draft'].map((s) => `<div class="admin-metric"><span>${STATUS[s]}</span><strong>${data.counts[s] || 0}</strong></div>`).join('');
    const rows = data.items.map((item) => `<tr><td><strong>${esc(item.title)}</strong><br><small>${esc(item.kind)} · ${esc(item.id)}</small></td><td>${esc(item.author || '—')}</td><td><span class="admin-live-status" data-status="${item.status}">${STATUS[item.status]}</span></td><td>${date(item.updated_at)}</td>
      <td><div class="admin-live-actions">${item.transitions.map((to) => `<button type="button" data-id="${esc(item.id)}" data-to="${to}"${to === 'needs_changes' ? ' class="admin-button-secondary"' : ''}>${ACTION[to]}</button>`).join('') || '<span class="admin-muted">Нет действий для вашей роли</span>'}</div></td></tr>`).join('');
    main.innerHTML = `${heading('РАБОТА С ПУБЛИКАЦИЯМИ', 'Модерация публикаций', 'Черновик → На проверке → Требует доработки / Одобрено → Опубликовано → Архивировано. Публикация сразу обновляет поиск и помощника.')}
      <div class="admin-metrics">${counts}</div><section class="admin-panel"><div id="moderation-result"></div>${data.items.length ? `<table class="admin-live-table"><thead><tr><th>Материал</th><th>Автор</th><th>Статус</th><th>Изменено</th><th>Действия</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="admin-muted">Материалов на согласовании нет. Создайте запись в разделе «Новая запись».</p>'}</section>`;
    main.querySelectorAll('[data-to]').forEach((button) => button.addEventListener('click', async () => {
      const note = button.dataset.to === 'needs_changes' ? prompt('Что доработать?') : null;
      try { await api().post('/admin/moderation/' + encodeURIComponent(button.dataset.id), { to: button.dataset.to, note }); await moderation(main); }
      catch (error) { main.querySelector('#moderation-result').innerHTML = message(error.message, 'error'); }
    }));
  }

  function editor(main) {
    main.innerHTML = `${heading('КАТАЛОГ', 'Новая запись каталога', 'Загрузите скан или фото — ИИ предложит заполнение. Всё, что предложил ИИ, остаётся черновиком до проверки сотрудником.')}
      <div class="admin-live-grid"><section class="admin-panel"><h2>Скан документа</h2><input type="file" id="scan-file" accept="image/png,image/jpeg,image/webp"><div id="scan-preview"></div><button type="button" id="scan-run" disabled>Распознать с помощью ИИ</button><div id="scan-result"></div></section>
      <section class="admin-panel"><h2>Карточка</h2><form class="admin-live-form" id="draft-form">
        <label>Тип<select name="kind"><option value="document">Документ</option><option value="photo">Фотодокумент</option><option value="case">Дело</option><option value="fund">Фонд</option></select></label>
        <label>Заголовок *<input name="title" required minlength="3"></label>
        <details class="admin-editor-fields"><summary>Архивные реквизиты и описание</summary><div class="admin-editor-fields-content"><label>Фонд<input name="fundNo" placeholder="Р-1"></label><label>Опись<input name="inventoryNo"></label><label>Дело<input name="caseNo"></label><label>Листы<input name="sheets"></label>
        <label>Год с<input name="yearFrom" type="number" min="1600" max="2100"></label><label>Год по<input name="yearTo" type="number" min="1600" max="2100"></label>
        <label>Тип документа<input name="docType"></label><label>Место<input name="place"></label><label>Ключевые слова (через запятую)<input name="topics"></label>
        <label>Описание<textarea name="description" rows="4"></textarea></label></div></details>
        <label>Доступ<select name="access"><option value="metadata_only">Открыто только описание</option><option value="open">Открытый</option><option value="restricted">Ограниченный</option></select></label>
        <button type="submit">Сохранить черновик</button><div id="draft-result"></div></form></section></div>`;
    let image = null;
    const form = main.querySelector('#draft-form');
    form.elements.kind.addEventListener('change', () => {
      if (form.elements.kind.value === 'case') form.querySelector('.admin-editor-fields').open = true;
    });
    main.querySelector('#scan-file').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { main.querySelector('#scan-result').innerHTML = message('Файл больше 5 МБ', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => { image = reader.result; main.querySelector('#scan-preview').innerHTML = `<img class="admin-live-scan" src="${image}" alt="Предпросмотр скана">`; main.querySelector('#scan-run').disabled = false; };
      reader.readAsDataURL(file);
    });
    main.querySelector('#scan-run').addEventListener('click', async () => {
      const box = main.querySelector('#scan-result');
      box.innerHTML = message('ИИ распознаёт документ…');
      try {
        const { card, duplicates } = await api().post('/admin/extract', { image });
        form.querySelector('.admin-editor-fields').open = true;
        const set = (name, value) => { if (value) form.elements[name].value = value; };
        set('title', card.title); set('yearFrom', card.year_from || ''); set('yearTo', card.year_to || ''); set('docType', card.doc_type);
        set('place', card.places.join(', ')); set('topics', card.keywords.join(', '));
        set('description', [card.description, card.persons.length ? 'Лица: ' + card.persons.join(', ') : '', card.organizations.length ? 'Организации: ' + card.organizations.join(', ') : ''].filter(Boolean).join('\n'));
        box.innerHTML = message(`Поля заполнены ИИ (уверенность ${Math.round(card.confidence * 100)}%). Проверьте каждое поле перед сохранением.`)
          + (duplicates.length ? message('Возможные дубли: ' + duplicates.map((d) => d.reference || d.title).join('; '), 'error') : '')
          + (card.transcript ? `<details><summary>Распознанный текст</summary><p style="white-space:pre-wrap">${esc(card.transcript)}</p></details>` : '');
      } catch (error) { box.innerHTML = message(error.message, 'error'); }
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      data.yearFrom = Number(data.yearFrom) || null; data.yearTo = Number(data.yearTo) || null;
      data.topics = String(data.topics || '').split(',').map((s) => s.trim()).filter(Boolean);
      try { const res = await api().post('/admin/resources', data); main.querySelector('#draft-result').innerHTML = message(`Черновик ${res.id} сохранён. Отправьте его на проверку в разделе «Модерация».`); }
      catch (error) { main.querySelector('#draft-result').innerHTML = message(error.message, 'error'); }
    });
  }

  function imports(main) {
    main.innerHTML = `${heading('КАТАЛОГ И ФАЙЛЫ', 'Импорт и экспорт каталога', 'CSV (UTF-8, разделитель запятая или точка с запятой). Колонки: kind, title, fund, inventory, case, year_from, year_to, doc_type, place, description. Каждая строка проверяется; повтор не создаёт дубль; записи попадают в черновики.')}
      <div class="admin-live-grid"><section class="admin-panel"><h2>Импорт</h2><input type="file" id="import-file" accept=".csv,text/csv"><button type="button" id="import-run" disabled>Загрузить</button><div id="import-result"></div></section>
      <section class="admin-panel"><h2>Экспорт</h2><p>Выгрузка опубликованных записей в CSV.</p><div class="admin-live-actions">${['fund', 'document', 'photo', 'newspaper'].map((k) => `<a class="admin-button-secondary" href="/api/v1/admin/export?kind=${k}">${{ fund: 'Фонды', document: 'Документы', photo: 'Фото', newspaper: 'Газеты' }[k]}</a>`).join('')}</div></section></div>`;
    let file = null;
    main.querySelector('#import-file').addEventListener('change', (event) => { file = event.target.files[0]; main.querySelector('#import-run').disabled = !file; });
    main.querySelector('#import-run').addEventListener('click', async () => {
      const box = main.querySelector('#import-result');
      try {
        const report = await api().post('/admin/import', { fileName: file.name, text: await file.text() });
        box.innerHTML = message(`Принято: ${report.accepted}, отклонено: ${report.rejected}, дублей: ${report.rows.filter((r) => r.status === 'duplicate').length}.`)
          + `<table class="admin-live-table"><thead><tr><th>Строка</th><th>Результат</th><th>Пояснение</th></tr></thead><tbody>${report.rows.slice(0, 100).map((r) => `<tr><td>${r.line}</td><td>${r.status}</td><td>${esc((r.errors || []).join('; ') || r.id || '')}</td></tr>`).join('')}</tbody></table>`;
      } catch (error) { box.innerHTML = message(error.message, 'error'); }
    });
  }

  async function analytics(main) {
    const data = await api().get('/admin/analytics');
    const t = data.totals;
    const list = (items) => items.length ? `<ol>${items.map((i) => `<li>«${esc(i.query)}» — ${i.count}</li>`).join('')}</ol>` : '<p class="admin-muted">Пока недостаточно обезличенных данных (запрос показывается, если его задали в нескольких разных сессиях).</p>';
    main.innerHTML = `${heading('АНАЛИТИКА', 'ИИ-аналитика качества сайта', 'Обезличенная статистика за 30 дней. Личные данные из вопросов маскируются до сохранения; рекомендации ИИ — предложения, решение принимает сотрудник.')}
      <div class="admin-metrics"><div class="admin-metric"><span>Вопросов к помощнику</span><strong>${t.questions}</strong></div><div class="admin-metric"><span>Ответов с источником</span><strong>${t.answered}</strong></div><div class="admin-metric"><span>Без результата</span><strong>${t.noResults}</strong></div><div class="admin-metric"><span>Оценок «Помогло»</span><strong>${t.helpful} из ${t.rated}</strong></div></div>
      <div class="admin-live-grid"><section class="admin-panel"><h2>Запросы без результата</h2>${list(data.zeroResultQueries)}<h2>Частые запросы</h2>${list(data.topQueries)}<h2>Страницы, которые стоит проверить</h2>${data.stalePages.length ? `<ul>${data.stalePages.map((p) => `<li><a href="#/resource/${encodeURIComponent(p.id)}">${esc(p.title)}</a></li>`).join('')}</ul>` : '<p class="admin-muted">Нет</p>'}<p>Новых отзывов на модерации: ${data.feedbackNew}</p></section>
      <aside class="admin-panel"><h2>Рекомендации ИИ</h2><button type="button" id="recommend">Сформировать рекомендации</button><div id="recommend-result"></div></aside></div>`;
    main.querySelector('#recommend').addEventListener('click', async () => {
      const box = main.querySelector('#recommend-result');
      box.innerHTML = message('ИИ анализирует обезличенную статистику…');
      try { const res = await api().post('/admin/analytics/recommendations'); box.innerHTML = res.items.map((r) => `<div class="admin-recommendation"><strong>${esc(r.title)}</strong><p>${esc(r.reason)}</p><p><em>${esc(r.action)}</em></p></div>`).join('') || message('Рекомендаций нет'); }
      catch (error) { box.innerHTML = message(error.message, 'error'); }
    });
  }

  async function feedback(main) {
    const data = await api().get('/admin/feedback');
    main.innerHTML = `${heading('ОБРАТНАЯ СВЯЗЬ', 'Модерация отзывов', 'Отзывы, предложения и пожелания о сайте. Это не официальные обращения. Личные данные скрываются до сохранения.')}
      <section class="admin-panel"><div id="feedback-result"></div>${data.items.length ? `<table class="admin-live-table"><thead><tr><th>Дата</th><th>Тип</th><th>Сообщение</th><th>Статус</th><th></th></tr></thead><tbody>${data.items.map((f) => `<tr><td>${date(f.created_at)}</td><td>${esc(f.kind)}</td><td>${esc(f.message)}</td><td>${esc(f.status)}</td><td><div class="admin-live-actions"><button type="button" data-id="${f.id}" data-status="approved">Одобрить</button><button type="button" class="admin-button-secondary" data-id="${f.id}" data-status="rejected">Отклонить</button></div></td></tr>`).join('')}</tbody></table>` : '<p class="admin-muted">Сообщений пока нет. Отправьте отзыв на странице «Отзывы и предложения».</p>'}</section>`;
    main.querySelectorAll('[data-status]').forEach((button) => button.addEventListener('click', async () => {
      try { await api().post('/admin/feedback/' + button.dataset.id, { status: button.dataset.status }); await feedback(main); }
      catch (error) { main.querySelector('#feedback-result').innerHTML = message(error.message, 'error'); }
    }));
  }

  async function audit(main) {
    const data = await api().get('/admin/audit');
    main.innerHTML = `${heading('КОНТРОЛЬ ИЗМЕНЕНИЙ', 'Журнал действий', 'Вход, создание, изменение и публикация материалов, импорт, решения модерации. Пароли и токены в журнал не пишутся.')}
      <section class="admin-panel"><table class="admin-live-table"><thead><tr><th>Время</th><th>Сотрудник</th><th>Действие</th><th>Объект</th></tr></thead><tbody>${data.items.map((a) => `<tr><td>${date(a.at)}</td><td>${esc(a.user_name || '—')}</td><td>${esc(a.action)}</td><td>${esc([a.entity, a.entity_id].filter(Boolean).join(' '))}</td></tr>`).join('')}</tbody></table></section>`;
  }

  async function roles(main) {
    const data = await api().get('/admin/roles');
    main.innerHTML = `${heading('УПРАВЛЕНИЕ', 'Роли и права', 'Семь ролей по ТЗ 6.1. Права проверяются сервером на каждом запросе; администратор филиала работает только со своим филиалом.')}
      <section class="admin-panel"><table class="admin-live-table"><thead><tr><th>Роль</th><th>Права</th></tr></thead><tbody>${data.items.map((r) => `<tr><td><strong>${esc(r.label)}</strong></td><td>${r.permissions.map(esc).join(', ')}</td></tr>`).join('')}</tbody></table></section>`;
  }

  async function users(main) {
    const data = await api().get('/admin/users');
    main.innerHTML = `${heading('УПРАВЛЕНИЕ', 'Сотрудники', 'Учётные записи панели. На демо-стенде — по одной на роль.')}
      <section class="admin-panel"><table class="admin-live-table"><thead><tr><th>Имя</th><th>Почта</th><th>Роль</th><th>Филиал</th></tr></thead><tbody>${data.items.map((u) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.role)}</td><td>${esc(u.branch_id || 'все')}</td></tr>`).join('')}</tbody></table></section>`;
  }

  const SCREENS = { moderation, editor, analytics, feedback, audit, imports, roles, users };

  const original = window.renderAdmin;
  window.renderAdmin = function renderAdminLive(container, path, language) {
    original(container, path, language);
    const key = path || 'moderation';
    const a = api();
    if (!a || !LIVE.has(key)) return;
    a.ready.then(async (available) => {
      if (!available) return;
      const notice = container.querySelector('.admin-notice');
      if (!notice) return;
      const main = document.createElement('div');
      while (notice.nextSibling) notice.nextSibling.remove();
      notice.after(main);
      const user = session || await loadSession();
      if (!user || key === 'login' || key === 'session') {
        notice.innerHTML = '<strong>Рабочая панель.</strong> Требуется вход сотрудника.';
        main.innerHTML = loginScreen(key);
        bindLogin(main, key);
        return;
      }
      notice.innerHTML = `<strong>${esc(user.name)}</strong> · ${esc(user.roleLabel)} · <button type="button" class="admin-button-secondary" id="admin-logout">Выйти</button>`;
      notice.querySelector('#admin-logout').addEventListener('click', async () => { await a.post('/admin/logout').catch(() => {}); session = null; location.hash = '#/admin/login'; });
      try { await SCREENS[key](main); }
      catch (error) {
        if (error.status === 401) { session = null; main.innerHTML = loginScreen(key); bindLogin(main, key); }
        else main.innerHTML = message(error.status === 403 ? 'Для этого раздела у вашей роли нет прав.' : error.message, 'error');
      }
    });
  };
}());
