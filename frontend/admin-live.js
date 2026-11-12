/* Рабочие экраны панели сотрудника поверх макета: вход, модерация, новая запись (с ИИ-распознаванием), импорт,
   аналитика, отзывы, журнал, роли. Права проверяет сервер; интерфейс лишь скрывает недоступные действия. */
(function () {
  'use strict';
  const LIVE = new Set(['login', 'session', 'dashboard', 'moderation', 'editor', 'analytics', 'feedback', 'audit', 'imports', 'users', 'roles', 'branch-editor', 'catalogue', 'files', 'content', 'translations']);
  let session = null;
  let editorDraft = null;
  let feedbackOperation = null;
  const feedbackViews = new WeakMap();

  const api = () => window.archiveApi;
  const esc = (v) => window.archiveApi.escape(v);
  const date = (v) => new Date(v).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  const message = (text, kind = 'info') => `<p class="admin-live-message" data-kind="${kind}" role="status">${esc(text)}</p>`;
  const heading = (kicker, title, desc) => `<div class="admin-heading"><div><p class="admin-kicker">${kicker}</p><h1>${title}</h1><p>${desc}</p></div></div>`;
  const tableRegion = (main, label) => {
    const table = main.querySelector('.admin-live-table');
    if (!table) return;
    const region = document.createElement('div');
    region.className = 'admin-live-table-region';
    region.tabIndex = 0;
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', label);
    table.before(region);
    region.append(table);
  };

  async function loadSession() {
    try {
      const data = await api().get('/admin/session');
      session = data.user; api().setCsrf(data.csrf);
    } catch (error) {
      if (error.status === 401) window.archiveWorkbench.clear();
      session = null;
    }
    return session;
  }

  function loginScreen(target, language) {
    const title = target === 'session' ? 'Войдите снова' : 'Вход в панель';
    const intro = target === 'session' ? 'Сессия завершена. Войдите, чтобы продолжить работу.' : 'Используйте рабочую почту и пароль сотрудника.';
    return window.adminCoreCopy.html(`<div class="admin-auth-layout">${heading('ДОСТУП СОТРУДНИКОВ', title, intro)}
      <section class="admin-panel admin-auth-panel"><form class="admin-live-form" id="admin-login"><label>Рабочая почта<input type="email" name="email" autocomplete="username" required value="admin@archive.demo"></label>
      <label>Пароль<input type="password" name="password" autocomplete="current-password" required></label><button type="submit">Войти</button><div id="admin-login-result" role="status" aria-live="polite"></div></form>
      <p class="admin-auth-help">После 5 неудачных попыток вход блокируется на 15 минут. Сессия завершается после 30 минут бездействия.</p>
      <details class="admin-demo-accounts"><summary>Учётные записи демонстрации</summary><p>Демо-учётки по ролям ТЗ 6.1: admin@, site@, editor@, archivist@, ridder@ (администратор филиала), moderator@, analyst@archive.demo. Пароль демо-стенда указан в README.</p></details></section></div>`, language);
  }

  function bindLogin(main, target, language) {
    main.querySelector('#admin-login')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      const box = main.querySelector('#admin-login-result');
      const button = event.target.querySelector('button[type="submit"]');
      if (button.disabled) return;
      button.disabled = true;
      box.textContent = window.adminCoreCopy.text('Выполняется вход…', language);
      try {
        const data = await api().post('/admin/login', { email: form.get('email'), password: form.get('password') });
        session = data.user; api().setCsrf(data.csrf);
        location.hash = '#/admin/' + (target && target !== 'login' && target !== 'session' ? target : 'dashboard');
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } catch (error) { box.innerHTML = message(error.message, 'error'); }
      finally { button.disabled = false; }
    });
  }

  function dashboard(main, language = 'ru') {
    const translations = {
      ru: { title:'Рабочий стол', intro:'Выберите задачу, чтобы продолжить работу.', tasks:'Доступные задачи', create:'Создать запись', createDesc:'Добавить описание архивного материала.', review:'Проверить материалы', reviewDesc:'Посмотреть черновики и материалы на согласовании.', feedback:'Гостевая книга', feedbackDesc:'Просмотреть сообщения посетителей.', imports:'Импорт каталога', importsDesc:'Загрузить или выгрузить записи.', analytics:'Аналитика', analyticsDesc:'Посмотреть статистику поиска и помощника.', empty:'Для вашей роли пока нет доступных задач.' },
      kk: { title:'Жұмыс үстелі', intro:'Жұмысты жалғастыру үшін тапсырманы таңдаңыз.', tasks:'Қолжетімді тапсырмалар', create:'Жазба жасау', createDesc:'Архив материалының сипаттамасын қосу.', review:'Материалдарды тексеру', reviewDesc:'Жобалар мен тексерілетін материалдарды қарау.', feedback:'Қонақ кітабы', feedbackDesc:'Келушілер хабарламаларын қарау.', imports:'Каталогты импорттау', importsDesc:'Жазбаларды жүктеу немесе шығару.', analytics:'Талдау', analyticsDesc:'Іздеу мен көмекші статистикасын қарау.', empty:'Рөліңіз үшін қолжетімді тапсырмалар жоқ.' },
      en: { title:'Dashboard', intro:'Choose a task to continue.', tasks:'Available tasks', create:'Create a record', createDesc:'Add a description of archive material.', review:'Review materials', reviewDesc:'View drafts and materials awaiting review.', feedback:'Guestbook', feedbackDesc:'View visitors’ messages.', imports:'Catalogue import', importsDesc:'Import or export records.', analytics:'Analytics', analyticsDesc:'View search and assistant statistics.', empty:'There are no tasks available for your role.' }
    };
    const copy = translations[language] || translations.ru;
    const permissions = session.permissions || [];
    const branchTask = {
      ru: ['Редактировать филиал', 'Обновить контакты и график работы.'],
      kk: ['Филиалды өңдеу', 'Байланыс деректері мен жұмыс кестесін жаңарту.'],
      en: ['Edit a branch', 'Update contact details and opening hours.']
    }[language] || ['Редактировать филиал', 'Обновить контакты и график работы.'];
    const tasks = [
      { id:'editor', title:copy.create, description:copy.createDesc, allowed:permissions.includes('catalog.edit') || permissions.includes('content.create') },
      { id:'moderation', title:copy.review, description:copy.reviewDesc, allowed:permissions.includes('moderation.review') || permissions.includes('content.create') || permissions.includes('catalog.edit') },
      { id:'feedback', title:copy.feedback, description:copy.feedbackDesc, allowed:permissions.includes('feedback.moderate') },
      { id:'branch-editor', title:branchTask[0], description:branchTask[1], allowed:permissions.includes('branches.edit') },
      { id:'imports', title:copy.imports, description:copy.importsDesc, allowed:permissions.includes('catalog.import') },
      { id:'analytics', title:copy.analytics, description:copy.analyticsDesc, allowed:permissions.includes('analytics.read') }
    ].filter(task => task.allowed);
    main.innerHTML = `<div class="admin-heading"><div><h1>${copy.title}</h1><p>${copy.intro}</p></div></div><section class="admin-workspace"><h2>${copy.tasks}</h2><div class="admin-workspace-grid">${tasks.map(task => `<a class="admin-workspace-card" href="#/admin/${task.id}"><strong>${task.title}</strong><span>${task.description}</span><span aria-hidden="true">→</span></a>`).join('') || `<p>${copy.empty}</p>`}</div></section>`;
  }

  async function moderation(main, language = 'ru') {
    const translations = {
      ru: {
        kicker: 'РАБОТА С ПУБЛИКАЦИЯМИ', title: 'Проверка материалов', intro: 'Выберите статус, чтобы найти нужные материалы. Доступные действия зависят от вашей роли.',
        statusLabel: 'Статус материала', all: 'Все статусы', limit: 'Показаны последние 50 материалов выбранного статуса.', loading: 'Загрузка материалов…',
        type: 'Тип', author: 'Автор', changed: 'Изменено', unspecified: 'Не указан', noActions: 'Нет доступных действий для вашей роли', empty: 'Материалов с выбранным статусом нет.',
        revisionPrompt: 'Что нужно доработать?', updated: 'Статус материала обновлён.', failed: 'Не удалось загрузить материалы.', refreshFailed: 'Статус сохранён. Не удалось обновить список.', retry: 'Обновить список', actionFailed: 'Не удалось изменить статус материала.',
        statuses: { draft: 'Черновик', review: 'На проверке', needs_changes: 'Требует доработки', approved: 'Одобрено', published: 'Опубликовано', archived: 'Архивировано' },
        actions: { review: 'Отправить на проверку', approved: 'Одобрить', needs_changes: 'На доработку', published: 'Опубликовать', archived: 'В архив', draft: 'Вернуть в черновик' },
        kinds: { fund: 'Фонд', inventory: 'Опись', case: 'Дело', document: 'Документ', photo: 'Фотография', newspaper: 'Газета', page: 'Страница' }, locale: 'ru-RU'
      },
      kk: {
        kicker: 'ЖАРИЯЛАНЫМДАРМЕН ЖҰМЫС', title: 'Материалдарды тексеру', intro: 'Қажетті материалдарды табу үшін мәртебені таңдаңыз. Қолжетімді әрекеттер рөліңізге байланысты.',
        statusLabel: 'Материал мәртебесі', all: 'Барлық мәртебелер', limit: 'Таңдалған мәртебедегі соңғы 50 материал көрсетіледі.', loading: 'Материалдар жүктелуде…',
        type: 'Түрі', author: 'Авторы', changed: 'Өзгертілген', unspecified: 'Көрсетілмеген', noActions: 'Рөліңіз үшін қолжетімді әрекеттер жоқ', empty: 'Таңдалған мәртебеде материалдар жоқ.',
        revisionPrompt: 'Нені түзету керек?', updated: 'Материал мәртебесі жаңартылды.', failed: 'Материалдарды жүктеу мүмкін болмады.', refreshFailed: 'Мәртебе сақталды. Тізімді жаңарту мүмкін болмады.', retry: 'Тізімді жаңарту', actionFailed: 'Материал мәртебесін өзгерту мүмкін болмады.',
        statuses: { draft: 'Жоба', review: 'Тексерілуде', needs_changes: 'Түзету қажет', approved: 'Мақұлданды', published: 'Жарияланды', archived: 'Архивтелді' },
        actions: { review: 'Тексеруге жіберу', approved: 'Мақұлдау', needs_changes: 'Түзетуге жіберу', published: 'Жариялау', archived: 'Архивке жіберу', draft: 'Жобаға қайтару' },
        kinds: { fund: 'Қор', inventory: 'Тізімдеме', case: 'Іс', document: 'Құжат', photo: 'Фотосурет', newspaper: 'Газет', page: 'Бет' }, locale: 'kk-KZ'
      },
      en: {
        kicker: 'CONTENT REVIEW', title: 'Review materials', intro: 'Select a status to find materials. Available actions depend on your role.',
        statusLabel: 'Material status', all: 'All statuses', limit: 'Showing the latest 50 materials with the selected status.', loading: 'Loading materials…',
        type: 'Type', author: 'Author', changed: 'Updated', unspecified: 'Not specified', noActions: 'No actions are available for your role', empty: 'No materials have the selected status.',
        revisionPrompt: 'What needs to be changed?', updated: 'The material status has been updated.', failed: 'Could not load materials.', refreshFailed: 'The status was saved. Could not refresh the list.', retry: 'Refresh the list', actionFailed: 'Could not update the material status.',
        statuses: { draft: 'Draft', review: 'In review', needs_changes: 'Changes requested', approved: 'Approved', published: 'Published', archived: 'Archived' },
        actions: { review: 'Submit for review', approved: 'Approve', needs_changes: 'Request changes', published: 'Publish', archived: 'Archive', draft: 'Return to draft' },
        kinds: { fund: 'Fund', inventory: 'Inventory', case: 'Case', document: 'Document', photo: 'Photograph', newspaper: 'Newspaper', page: 'Page' }, locale: 'en-GB'
      }
    };
    const t = translations[language] || translations.ru;
    main.innerHTML = `${heading(t.kicker, t.title, t.intro)}
      <section class="admin-panel admin-moderation-queue">
        <div class="admin-moderation-filter"><label for="moderation-status">${t.statusLabel}</label>
          <select id="moderation-status"><option value="">${t.all}</option>${Object.entries(t.statuses).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select>
        </div>
        <p class="admin-muted">${t.limit}</p>
        <div id="moderation-result" aria-live="polite"></div>
        <button type="button" class="admin-button-secondary" id="moderation-retry" hidden>${t.retry}</button>
        <div id="moderation-list" aria-live="polite"></div>
      </section>`;
    const select = main.querySelector('#moderation-status');
    const result = main.querySelector('#moderation-result');
    const list = main.querySelector('#moderation-list');
    const retry = main.querySelector('#moderation-retry');
    let requestNumber = 0;
    let busy = false;
    let statusUpdated = false;

    async function load() {
      const request = ++requestNumber;
      result.textContent = '';
      retry.hidden = true;
      list.innerHTML = `<p class="admin-muted">${t.loading}</p>`;
      try {
        const query = select.value ? `?status=${encodeURIComponent(select.value)}` : '';
        const data = await api().get('/admin/moderation' + query);
        if (request !== requestNumber) return;
        list.innerHTML = data.items.length ? data.items.map(item => `<article class="admin-moderation-card">
          <div class="admin-moderation-card-header"><h2>${esc(item.title)}</h2><span class="admin-live-status" data-status="${esc(item.status)}">${esc(t.statuses[item.status] || item.status)}</span></div>
          <dl class="admin-moderation-meta"><div><dt>${t.type}</dt><dd>${esc(t.kinds[item.kind] || item.kind)}</dd></div><div><dt>${t.author}</dt><dd>${esc(item.author || t.unspecified)}</dd></div><div><dt>${t.changed}</dt><dd>${esc(new Date(item.updated_at).toLocaleString(t.locale, { dateStyle: 'short', timeStyle: 'short' }))}</dd></div></dl>
          <div class="admin-live-actions">${item.transitions.map(to => `<button type="button" data-id="${esc(item.id)}" data-to="${esc(to)}"${to === 'needs_changes' ? ' class="admin-button-secondary"' : ''}>${esc(t.actions[to] || to)}</button>`).join('') || `<span class="admin-muted">${t.noActions}</span>`}</div>
        </article>`).join('') : `<p class="admin-muted">${t.empty}</p>`;
        if (statusUpdated) result.innerHTML = message(t.updated);
      } catch (error) {
        if (request !== requestNumber) return;
        if (error.status === 401 && main.isConnected) {
          session = null;
          location.hash = '#/admin/session';
          return;
        }
        list.textContent = '';
        result.innerHTML = message(statusUpdated ? t.refreshFailed : t.failed, 'error');
        retry.hidden = false;
      }
    }

    select.addEventListener('change', () => { statusUpdated = false; load(); });
    retry.addEventListener('click', load);
    list.addEventListener('click', async event => {
      const button = event.target.closest('button[data-to]');
      if (!button || busy) return;
      const note = button.dataset.to === 'needs_changes' ? prompt(t.revisionPrompt) : null;
      if (button.dataset.to === 'needs_changes' && note === null) return;
      busy = true;
      const actions = Array.from(list.querySelectorAll('button[data-to]'));
      actions.forEach(action => { action.disabled = true; });
      select.disabled = true;
      try {
        await api().post('/admin/moderation/' + encodeURIComponent(button.dataset.id), { to: button.dataset.to, note });
        statusUpdated = true;
        await load();
      } catch (error) {
        result.innerHTML = message(error.message || t.actionFailed, 'error');
      } finally {
        busy = false;
        select.disabled = false;
        actions.forEach(action => { action.disabled = false; });
        if (main.isConnected && document.activeElement === document.body) {
          (retry.hidden ? (button.isConnected ? button : select) : retry).focus();
        }
      }
    });
    await load();
  }

  function editor(main, language = 'ru') {
    const translations = {
      "kk": {
        "КАТАЛОГ": "КАТАЛОГ",
        "Новая запись каталога": "Каталогқа жаңа жазба",
        "Создайте описание и проверьте его перед сохранением черновика.": "Сипаттаманы жасап, жобаны сақтамас бұрын тексеріңіз.",
        "Этапы создания записи": "Жазба жасау кезеңдері",
        "Материал": "Материал",
        "Описание": "Сипаттама",
        "Проверка": "Тексеру",
        "Тип материала": "Материал түрі",
        "Документ": "Құжат",
        "Фотодокумент": "Фотоқұжат",
        "Дело": "Іс",
        "Фонд": "Қор",
        "Скан или фотография для распознавания": "Тану үшін скан немесе фотосурет",
        "Необязательно. Файл используется для распознавания и не прикрепляется к записи.": "Міндетті емес. Файл тану үшін пайдаланылады және жазбаға тіркелмейді.",
        "Распознать с помощью ИИ": "ЖИ көмегімен тану",
        "Продолжить к описанию": "Сипаттамаға өту",
        "Проверьте все данные, включая предложенные ИИ. Поля со звёздочкой обязательны.": "ЖИ ұсынған мәліметтерді қоса, барлық деректі тексеріңіз. Жұлдызшамен белгіленген өрістер міндетті.",
        "Заголовок *": "Тақырып *",
        "Опись": "Тізімдеме",
        "Дополнительные сведения": "Қосымша мәліметтер",
        "Листы": "Парақтар",
        "Год с": "Бастапқы жыл",
        "Год по": "Соңғы жыл",
        "Тип документа": "Құжат түрі",
        "Место": "Орын",
        "Ключевые слова (через запятую)": "Түйінді сөздер (үтір арқылы)",
        "Доступ": "Қолжетімділік",
        "Открыто только описание": "Тек сипаттама ашық",
        "Открытый": "Ашық",
        "Ограниченный": "Шектеулі",
        "Назад": "Артқа",
        "Проверить запись": "Жазбаны тексеру",
        "Проверка записи": "Жазбаны тексеру",
        "Проверьте данные и сохраните черновик.": "Мәліметтерді тексеріп, жобаны сақтаңыз.",
        "Изменить описание": "Сипаттаманы өзгерту",
        "Сохранить черновик": "Жобаны сақтау",
        "Заголовок": "Тақырып",
        "Тип": "Түрі",
        "Ключевые слова": "Түйінді сөздер",
        "Заголовок должен содержать не менее трёх символов.": "Тақырып кемінде үш таңбадан тұруы керек.",
        "Начальный год должен быть не позднее конечного.": "Бастапқы жыл соңғы жылдан кеш болмауы керек.",
        "Файл больше 5 МБ": "Файл 5 МБ-тан үлкен",
        "Выберите изображение PNG, JPEG или WebP.": "PNG, JPEG немесе WebP суретін таңдаңыз.",
        "Предпросмотр скана": "Сканды алдын ала қарау",
        "Не удалось прочитать файл.": "Файлды оқу мүмкін болмады.",
        "ИИ распознаёт документ…": "ЖИ құжатты тануда…",
        "Лица: ": "Тұлғалар: ",
        "Организации: ": "Ұйымдар: ",
        "Возможные дубли: ": "Ықтимал қайталанулар: ",
        "Распознанный текст": "Танылған мәтін",
        "Поля заполнены ИИ (уверенность ": "Өрістерді ЖИ толтырды (сенімділігі ",
        "%). Проверьте каждое поле перед сохранением.": "%). Сақтамас бұрын әр өрісті тексеріңіз.",
        "Черновик ": "Жоба ",
        " сохранён.": " сақталды.",
        "Не удалось подтвердить сохранение черновика. Проверьте список материалов перед повторной попыткой.": "Жобаның сақталғанын растау мүмкін болмады. Қайталап көрмес бұрын материалдар тізімін тексеріңіз.",
        "Отправить на проверку": "Тексеруге жіберу",
        "Отправляем на проверку…": "Тексеруге жіберілуде…",
        "Запись отправлена на проверку.": "Жазба тексеруге жіберілді.",
        "Не удалось отправить запись. Проверьте её статус в разделе «Проверка материалов».": "Жазбаны жіберу мүмкін болмады. Мәртебесін «Материалдарды тексеру» бөлімінен қараңыз.",
        "Проверка материалов": "Материалдарды тексеру",
        "Создать ещё запись": "Тағы бір жазба жасау"
      },
      "en": {
        "КАТАЛОГ": "CATALOGUE",
        "Новая запись каталога": "New catalogue record",
        "Создайте описание и проверьте его перед сохранением черновика.": "Create a description and review it before saving the draft.",
        "Этапы создания записи": "Record creation steps",
        "Материал": "Material",
        "Описание": "Description",
        "Проверка": "Review",
        "Тип материала": "Material type",
        "Документ": "Document",
        "Фотодокумент": "Photograph",
        "Дело": "Case",
        "Фонд": "Fonds",
        "Скан или фотография для распознавания": "Scan or photo for recognition",
        "Необязательно. Файл используется для распознавания и не прикрепляется к записи.": "Optional. The file is used for recognition and is not attached to the record.",
        "Распознать с помощью ИИ": "Recognise with AI",
        "Продолжить к описанию": "Continue to description",
        "Проверьте все данные, включая предложенные ИИ. Поля со звёздочкой обязательны.": "Check all information, including AI suggestions. Fields marked with an asterisk are required.",
        "Заголовок *": "Title *",
        "Опись": "Inventory",
        "Дополнительные сведения": "Additional details",
        "Листы": "Sheets",
        "Год с": "From year",
        "Год по": "To year",
        "Тип документа": "Document type",
        "Место": "Place",
        "Ключевые слова (через запятую)": "Keywords (comma-separated)",
        "Доступ": "Access",
        "Открыто только описание": "Description only",
        "Открытый": "Open",
        "Ограниченный": "Restricted",
        "Назад": "Back",
        "Проверить запись": "Review record",
        "Проверка записи": "Review record",
        "Проверьте данные и сохраните черновик.": "Check the information and save the draft.",
        "Изменить описание": "Edit description",
        "Сохранить черновик": "Save draft",
        "Заголовок": "Title",
        "Тип": "Type",
        "Ключевые слова": "Keywords",
        "Заголовок должен содержать не менее трёх символов.": "The title must contain at least three characters.",
        "Начальный год должен быть не позднее конечного.": "The start year must not be later than the end year.",
        "Файл больше 5 МБ": "The file exceeds 5 MB",
        "Выберите изображение PNG, JPEG или WebP.": "Choose a PNG, JPEG or WebP image.",
        "Предпросмотр скана": "Scan preview",
        "Не удалось прочитать файл.": "Could not read the file.",
        "ИИ распознаёт документ…": "AI is recognising the document…",
        "Лица: ": "People: ",
        "Организации: ": "Organisations: ",
        "Возможные дубли: ": "Possible duplicates: ",
        "Распознанный текст": "Recognised text",
        "Поля заполнены ИИ (уверенность ": "AI filled the fields (confidence ",
        "%). Проверьте каждое поле перед сохранением.": "%). Check every field before saving.",
        "Черновик ": "Draft ",
        " сохранён.": " saved.",
        "Не удалось подтвердить сохранение черновика. Проверьте список материалов перед повторной попыткой.": "Could not confirm the draft was saved. Check the list of materials before retrying.",
        "Отправить на проверку": "Submit for review",
        "Отправляем на проверку…": "Submitting for review…",
        "Запись отправлена на проверку.": "The record was submitted for review.",
        "Не удалось отправить запись. Проверьте её статус в разделе «Проверка материалов».": "Could not submit the record. Check its status in Review materials.",
        "Проверка материалов": "Review materials",
        "Создать ещё запись": "Create another record"
      }
    };
    const translate = text => translations[language]?.[text] || text;
    const validationText = {
      ru: 'Проверьте выделенное поле и заполните его допустимым значением.',
      kk: 'Белгіленген өрісті тексеріп, рұқсат етілген мәнді енгізіңіз.',
      en: 'Check the highlighted field and enter a valid value.'
    }[language] || 'Проверьте выделенное поле и заполните его допустимым значением.';
    main.innerHTML = `${heading('КАТАЛОГ', 'Новая запись каталога', 'Создайте описание и проверьте его перед сохранением черновика.')}
      <section class="admin-panel admin-editor"><form class="admin-live-form" id="draft-form" novalidate>
        <ol class="admin-editor-steps" aria-label="Этапы создания записи"><li>Материал</li><li>Описание</li><li>Проверка</li></ol>
        <section data-editor-step="0"><h2 tabindex="-1">Материал</h2>
          <label>Тип материала<select name="kind"><option value="document">Документ</option><option value="photo">Фотодокумент</option><option value="case">Дело</option><option value="fund">Фонд</option></select></label>
          <label>Скан или фотография для распознавания<input type="file" id="scan-file" accept="image/png,image/jpeg,image/webp"></label>
          <p class="admin-muted">Необязательно. Файл используется для распознавания и не прикрепляется к записи.</p>
          <div id="scan-preview"></div><button type="button" id="scan-run" disabled>Распознать с помощью ИИ</button><div id="scan-result" aria-live="polite"></div>
          <div class="admin-editor-actions"><button type="button" data-next>Продолжить к описанию</button></div>
        </section>
        <section data-editor-step="1" hidden><h2 tabindex="-1">Описание</h2>
          <p class="admin-muted">Проверьте все данные, включая предложенные ИИ. Поля со звёздочкой обязательны.</p>
          <label>Заголовок *<input name="title" required minlength="3"></label>
          <label>Фонд <span data-required-for="fundNo"></span><input name="fundNo" placeholder="Р-1"></label>
          <label>Опись <span data-required-for="inventoryNo"></span><input name="inventoryNo"></label>
          <label>Дело <span data-required-for="caseNo"></span><input name="caseNo"></label>
          <details class="admin-editor-fields"><summary>Дополнительные сведения</summary><div class="admin-editor-fields-content">
            <label>Листы<input name="sheets"></label><label>Год с<input name="yearFrom" type="number" min="1600" max="2100"></label><label>Год по<input name="yearTo" type="number" min="1600" max="2100"></label>
            <label>Тип документа<input name="docType"></label><label>Место<input name="place"></label><label>Ключевые слова (через запятую)<input name="topics"></label><label>Описание<textarea name="description" rows="4"></textarea></label>
          </div></details>
          <label>Доступ<select name="access"><option value="metadata_only">Открыто только описание</option><option value="open">Открытый</option><option value="restricted">Ограниченный</option></select></label>
          <div id="draft-validation" role="status"></div><div class="admin-editor-actions"><button class="admin-button-secondary" type="button" data-back>Назад</button><button type="button" data-next>Проверить запись</button></div>
        </section>
        <section data-editor-step="2" hidden><h2 tabindex="-1">Проверка записи</h2><p class="admin-muted">Проверьте данные и сохраните черновик.</p>
          <dl class="admin-editor-review"></dl><div id="draft-result" role="status"></div>
          <div class="admin-editor-actions" id="draft-edit-actions"><button class="admin-button-secondary" type="button" data-back>Изменить описание</button><button type="submit">Сохранить черновик</button></div>
          <div class="admin-editor-actions" id="draft-next-actions" hidden></div>
        </section>
      </form></section>`;
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue.trim();
      if (value) node.nodeValue = node.nodeValue.replace(value, translate(value));
    }
    const stepList = main.querySelector('.admin-editor-steps');
    stepList.setAttribute('aria-label', translate(stepList.getAttribute('aria-label')));
    if (!editorDraft || editorDraft.userId !== session.id) {
      editorDraft = { userId: session.id, values: {}, fieldVersions: {}, image: null, step: 0, pending: null, ocr: null, savedId: null, reviewRequest: null, reviewStatus: null };
    }
    const draft = editorDraft;
    let image = draft.image;
    let imageVersion = 0;
    let step = 0;
    const form = main.querySelector('#draft-form');
    const steps = [...form.querySelectorAll('[data-editor-step]')];
    const markers = [...form.querySelectorAll('.admin-editor-steps li')];
    const result = main.querySelector('#draft-result');
    const button = form.querySelector('[type="submit"]');
    const editActions = form.querySelector('#draft-edit-actions');
    const nextActions = form.querySelector('#draft-next-actions');
    const canSubmitForReview = session.permissions.includes('content.create');
    for (const [name, value] of Object.entries(draft.values)) {
      if (form.elements[name]) form.elements[name].value = value;
    }
    function rememberFields() {
      if (editorDraft !== draft) return;
      for (const field of form.querySelectorAll('input[name], select[name], textarea[name]')) {
        draft.values[field.name] = field.value;
      }
    }
    form.addEventListener('input', rememberFields);
    form.addEventListener('change', rememberFields);
    form.addEventListener('input', event => {
      const name = event.target.name;
      if (name) draft.fieldVersions[name] = (draft.fieldVersions[name] || 0) + 1;
    });
    form.addEventListener('change', event => {
      const name = event.target.name;
      if (name) draft.fieldVersions[name] = (draft.fieldVersions[name] || 0) + 1;
    });
    const updateRequired = () => {
      const kind = form.elements.kind.value;
      const required = { fundNo:['fund','case','document'].includes(kind), inventoryNo:['case','document'].includes(kind), caseNo:['case','document'].includes(kind) };
      for (const [name, value] of Object.entries(required)) {
        form.elements[name].required = value;
        form.querySelector(`[data-required-for="${name}"]`).textContent = value ? '*' : '';
      }
    };
    function showStep(next) {
      step = next;
      draft.step = next;
      steps.forEach((section, index) => { section.hidden = index !== step; });
      markers.forEach((marker, index) => { if (index === step) marker.setAttribute('aria-current', 'step'); else marker.removeAttribute('aria-current'); });
      if (step === 2 && draft.ocr?.status === 'pending') result.innerHTML = message(translate('ИИ распознаёт документ…'));
      steps[step].querySelector('h2').focus();
    }
    function validateDescription() {
      const validation = main.querySelector('#draft-validation');
      validation.textContent = '';
      for (const field of steps[1].querySelectorAll('input, select, textarea')) {
        if (!field.checkValidity()) {
          field.closest('details')?.setAttribute('open', '');
          validation.textContent = validationText;
          field.focus();
          return false;
        }
      }
      const title = form.elements.title.value.trim();
      if (title.length < 3) { validation.textContent = translate("Заголовок должен содержать не менее трёх символов."); form.elements.title.focus(); return false; }
      const from = Number(form.elements.yearFrom.value);
      const to = Number(form.elements.yearTo.value);
      if (from && to && from > to) { validation.textContent = translate("Начальный год должен быть не позднее конечного."); form.querySelector('.admin-editor-fields').open = true; form.elements.yearFrom.focus(); return false; }
      return true;
    }
    function renderReview() {
      const fields = [ [translate('Тип'), form.elements.kind.selectedOptions[0].textContent], [translate('Заголовок'), form.elements.title.value.trim()], [translate('Фонд'), form.elements.fundNo.value], [translate('Опись'), form.elements.inventoryNo.value], [translate('Дело'), form.elements.caseNo.value], [translate('Листы'), form.elements.sheets.value], [translate('Год с'), form.elements.yearFrom.value], [translate('Год по'), form.elements.yearTo.value], [translate('Тип документа'), form.elements.docType.value], [translate('Место'), form.elements.place.value], [translate('Ключевые слова'), form.elements.topics.value], [translate('Описание'), form.elements.description.value], [translate('Доступ'), form.elements.access.selectedOptions[0].textContent] ];
      form.querySelector('.admin-editor-review').innerHTML = fields.filter(([,value]) => value && value.trim()).map(([label,value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
    }
    updateRequired();
    if (image) {
      main.querySelector('#scan-preview').innerHTML = `<img class="admin-live-scan" src="${image}" alt="${translate('Предпросмотр скана')}">`;
      main.querySelector('#scan-run').disabled = false;
    }
    if (draft.step === 2) renderReview();
    showStep(draft.step);
    form.elements.kind.addEventListener('change', updateRequired);
    form.querySelectorAll('[data-back]').forEach(item => item.addEventListener('click', () => showStep(step - 1)));
    form.querySelectorAll('[data-next]').forEach(item => item.addEventListener('click', () => {
      if (step === 1 && !validateDescription()) return;
      if (step === 1) renderReview();
      showStep(step + 1);
    }));
    main.querySelector('#scan-file').addEventListener('change', (event) => {
      image = null;
      draft.image = null;
      draft.ocr = null;
      const version = ++imageVersion;
      const run = main.querySelector('#scan-run');
      const preview = main.querySelector('#scan-preview');
      const box = main.querySelector('#scan-result');
      run.disabled = true;
      preview.replaceChildren();
      box.textContent = '';
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { box.innerHTML = message(translate("Файл больше 5 МБ"), 'error'); return; }
      if (!['image/png','image/jpeg','image/webp'].includes(file.type)) { box.innerHTML = message(translate("Выберите изображение PNG, JPEG или WebP."), 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => { if (version !== imageVersion || editorDraft !== draft) return; image = reader.result; draft.image = image; preview.innerHTML = `<img class="admin-live-scan" src="${image}" alt="${translate('Предпросмотр скана')}">`; run.disabled = false; };
      reader.onerror = () => { if (version === imageVersion) box.innerHTML = message(translate("Не удалось прочитать файл."), 'error'); };
      reader.readAsDataURL(file);
    });
    function watchRecognition(operation) {
      const box = main.querySelector('#scan-result');
      const run = main.querySelector('#scan-run');
      const fileInput = main.querySelector('#scan-file');
      if (operation.status === 'pending') {
        run.disabled = true;
        fileInput.disabled = true;
        button.disabled = true;
        box.innerHTML = message(translate('ИИ распознаёт документ…'));
        if (step === 2) result.innerHTML = message(translate('ИИ распознаёт документ…'));
      }
      operation.promise.then(({ card, duplicates }) => {
        if (!form.isConnected || editorDraft !== draft || draft.ocr !== operation) return;
        for (const name of operation.appliedFields) {
          if ((draft.fieldVersions[name] || 0) === (operation.versions[name] || 0)) {
            form.elements[name].value = draft.values[name];
          }
        }
        form.querySelector('.admin-editor-fields').open = true;
        if (step === 2) { renderReview(); result.textContent = ''; }
        box.innerHTML = message(`${translate('Поля заполнены ИИ (уверенность ')}${Math.round(card.confidence * 100)}${translate('%). Проверьте каждое поле перед сохранением.')}`)
          + (duplicates.length ? message(translate('Возможные дубли: ') + duplicates.map(item => item.reference || item.title).join('; '), 'error') : '')
          + (card.transcript ? `<details><summary>${translate('Распознанный текст')}</summary><p style="white-space:pre-wrap">${esc(card.transcript)}</p></details>` : '');
      }).catch(error => {
        if (!form.isConnected || editorDraft !== draft || draft.ocr !== operation) return;
        if (step === 2) result.textContent = '';
        box.innerHTML = message(error.message, 'error');
      }).finally(() => {
        if (!form.isConnected || editorDraft !== draft || draft.ocr !== operation) return;
        fileInput.disabled = false;
        run.disabled = !draft.image;
        button.disabled = Boolean(draft.pending);
      });
    }
    if (draft.ocr) watchRecognition(draft.ocr);
    main.querySelector('#scan-run').addEventListener('click', () => {
      if (!image || draft.ocr?.status === 'pending') return;
      rememberFields();
      const operation = { status: 'pending', versions: { ...draft.fieldVersions }, appliedFields: [], promise: null };
      draft.ocr = operation;
      operation.promise = api().post('/admin/extract', { image }).then(data => {
        if (editorDraft !== draft || draft.ocr !== operation) return data;
        const { card } = data;
        const suggestions = {
          title: card.title,
          yearFrom: card.year_from || '',
          yearTo: card.year_to || '',
          docType: card.doc_type,
          place: card.places.join(', '),
          topics: card.keywords.join(', '),
          description: [card.description, card.persons.length ? translate('Лица: ') + card.persons.join(', ') : '', card.organizations.length ? translate('Организации: ') + card.organizations.join(', ') : ''].filter(Boolean).join('\n')
        };
        for (const [name, value] of Object.entries(suggestions)) {
          if (value && (draft.fieldVersions[name] || 0) === (operation.versions[name] || 0)) {
            draft.values[name] = String(value);
            operation.appliedFields.push(name);
          }
        }
        operation.status = 'complete';
        return data;
      }, error => {
        operation.status = 'error';
        throw error;
      });
      watchRecognition(operation);
    });
    function renderSavedDraft() {
      editActions.hidden = true;
      nextActions.hidden = false;
      button.disabled = true;
      const reviewing = Boolean(draft.reviewRequest);
      const submitted = draft.reviewStatus === 'submitted';
      const failed = draft.reviewStatus === 'error';
      result.innerHTML = message(submitted
        ? translate('Запись отправлена на проверку.')
        : `${translate('Черновик ')}${draft.savedId}${translate(' сохранён.')}`);
      if (failed) result.innerHTML += message(translate('Не удалось отправить запись. Проверьте её статус в разделе «Проверка материалов».'), 'error');
      nextActions.innerHTML = `
        ${canSubmitForReview && !submitted ? `<button type="button" data-submit-review${reviewing ? ' disabled' : ''}>${translate(reviewing ? 'Отправляем на проверку…' : 'Отправить на проверку')}</button>` : ''}
        <a class="admin-button-secondary" href="#/admin/moderation">${translate('Проверка материалов')} →</a>
        <button type="button" class="admin-button-secondary" data-create-another${reviewing ? ' disabled' : ''}>${translate('Создать ещё запись')}</button>`;
    }

    function watchReview(request, restoreFocus = false) {
      request.finally(() => {
        if (!form.isConnected) return;
        const moveFocus = restoreFocus && (document.activeElement === document.body || nextActions.contains(document.activeElement));
        renderSavedDraft();
        if (moveFocus) nextActions.querySelector('[data-submit-review], a')?.focus();
      });
    }

    nextActions.addEventListener('click', event => {
      if (draft.reviewRequest) return;
      if (event.target.closest('[data-create-another]')) {
        editorDraft = null;
        editor(main, language);
        main.querySelector('[data-editor-step="0"] h2')?.focus();
        return;
      }
      if (!event.target.closest('[data-submit-review]') || !canSubmitForReview || draft.reviewStatus === 'submitted') return;
      draft.reviewStatus = null;
      draft.reviewRequest = api().post('/admin/moderation/' + encodeURIComponent(draft.savedId), { to: 'review', note: null })
        .then(response => { draft.reviewStatus = response?.ok === true ? 'submitted' : 'error'; }, () => { draft.reviewStatus = 'error'; })
        .finally(() => { draft.reviewRequest = null; });
      renderSavedDraft();
      watchReview(draft.reviewRequest, true);
    });

    function watchSave(pending) {
      button.disabled = true;
      const backButtons = form.querySelectorAll('[data-back]');
      backButtons.forEach(item => { item.disabled = true; });
      pending.then(() => {
        if (!form.isConnected) return;
        const moveFocus = document.activeElement === button || document.activeElement === document.body;
        renderSavedDraft();
        if (moveFocus) nextActions.querySelector('[data-submit-review], a')?.focus();
      }).catch(error => {
        if (!form.isConnected) return;
        result.innerHTML = message(error.message, 'error');
        button.disabled = false;
        backButtons.forEach(item => { item.disabled = false; });
      });
    }
    if (draft.savedId) renderSavedDraft();
    if (draft.reviewRequest) watchReview(draft.reviewRequest);
    if (draft.pending) watchSave(draft.pending);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (step !== 2 || button.disabled || draft.pending || draft.savedId) return;
      const data = Object.fromEntries(new FormData(form));
      data.yearFrom = Number(data.yearFrom) || null; data.yearTo = Number(data.yearTo) || null;
      data.topics = String(data.topics || '').split(',').map((s) => s.trim()).filter(Boolean);
      draft.pending = api().post('/admin/resources', data)
        .then(response => {
          if (typeof response?.id !== 'string' || !response.id) {
            throw new Error(translate('Не удалось подтвердить сохранение черновика. Проверьте список материалов перед повторной попыткой.'));
          }
          draft.savedId = response.id;
        })
        .finally(() => { draft.pending = null; });
      watchSave(draft.pending);
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
        tableRegion(box, 'Результат импорта');
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

  async function feedback(main, language = 'ru') {
    const translations = {
      ru: { kicker:'ОБРАТНАЯ СВЯЗЬ', title:'Гостевая книга', intro:'Отзывы, предложения и пожелания о сайте. Личные данные скрываются до сохранения.', date:'Дата', type:'Тип', status:'Статус', filter:'Показать сообщения', all:'Все сообщения', approve:'Одобрить', reject:'Отклонить', empty:'Сообщений с выбранным статусом нет.', loading:'Загрузка сообщений…', saved:'Решение сохранено.', note:'Причина отклонения (необязательно)', noteLabel:'Комментарий модератора', limit:'Показаны последние 100 сообщений.', statuses:{new:'Новое', approved:'Одобрено', rejected:'Отклонено'}, kinds:{review:'Отзыв', suggestion:'Предложение', wish:'Пожелание', error:'Сообщение об ошибке'}, locale:'ru-RU' },
      kk: { kicker:'КЕРІ БАЙЛАНЫС', title:'Қонақ кітабы', intro:'Сайт туралы пікірлер, ұсыныстар және тілектер. Жеке деректер сақтар алдында жасырылады.', date:'Күні', type:'Түрі', status:'Мәртебесі', filter:'Хабарламаларды көрсету', all:'Барлық хабарламалар', approve:'Мақұлдау', reject:'Қабылдамау', empty:'Таңдалған мәртебедегі хабарламалар жоқ.', loading:'Хабарламалар жүктелуде…', saved:'Шешім сақталды.', note:'Қабылдамау себебі (міндетті емес)', noteLabel:'Модератор пікірі', limit:'Соңғы 100 хабарлама көрсетілген.', statuses:{new:'Жаңа', approved:'Мақұлданды', rejected:'Қабылданбады'}, kinds:{review:'Пікір', suggestion:'Ұсыныс', wish:'Тілек', error:'Қате туралы хабарлама'}, locale:'kk-KZ' },
      en: { kicker:'FEEDBACK', title:'Guestbook', intro:'Feedback, suggestions and wishes about the website. Personal data is masked before storage.', date:'Date', type:'Type', status:'Status', filter:'Show messages', all:'All messages', approve:'Approve', reject:'Reject', empty:'There are no messages with this status.', loading:'Loading messages…', saved:'Decision saved.', note:'Reason for rejection (optional)', noteLabel:'Moderator comment', limit:'Showing the latest 100 messages.', statuses:{new:'New', approved:'Approved', rejected:'Rejected'}, kinds:{review:'Feedback', suggestion:'Suggestion', wish:'Wish', error:'Error report'}, locale:'en-GB' }
    };
    const t = translations[language] || translations.ru;
    const actionMessages = {
      ru: { failed:'Не удалось загрузить сообщения.', refreshFailed:'Решение сохранено. Не удалось обновить список.', retry:'Повторить загрузку', saving:'Сохраняем решение…', confirm:'Подтвердить отклонение', cancel:'Отмена' },
      kk: { failed:'Хабарламаларды жүктеу мүмкін болмады.', refreshFailed:'Шешім сақталды. Тізімді жаңарту мүмкін болмады.', retry:'Қайта жүктеу', saving:'Шешім сақталуда…', confirm:'Қабылдамауды растау', cancel:'Бас тарту' },
      en: { failed:'Could not load messages.', refreshFailed:'Decision saved. Could not refresh the list.', retry:'Try again', saving:'Saving decision…', confirm:'Confirm rejection', cancel:'Cancel' }
    };
    const actions = actionMessages[language] || actionMessages.ru;
    const user = session;
    const isActive = () => main.isConnected && session === user;
    if (!feedbackViews.has(user)) feedbackViews.set(user, { filter: '', rejection: null });
    const view = feedbackViews.get(user);
    main.innerHTML = `${heading(t.kicker, t.title, t.intro)}
      <section class="admin-panel admin-feedback-queue"><label class="admin-moderation-filter" for="feedback-status">${t.filter}
        <select id="feedback-status"><option value="">${t.all}</option>${Object.entries(t.statuses).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></label>
        <p class="admin-muted">${t.limit}</p><div id="feedback-result" role="status" aria-live="polite"></div><div id="feedback-list" aria-live="polite"></div>
      </section>`;
    const filter = main.querySelector('#feedback-status');
    const result = main.querySelector('#feedback-result');
    const list = main.querySelector('#feedback-list');
    filter.value = view.filter;
    let items = [];
    let busy = false;
    let retryMessage = '';
    function showLoadError(text) {
      retryMessage = text;
      result.innerHTML = `${message(text, 'error')}<button type="button" class="admin-button-secondary" data-feedback-retry>${actions.retry}</button>`;
    }
    function rejectionForm(item) {
      if (view.rejection?.id !== item.id) return '';
      return `<form class="admin-live-form admin-feedback-rejection" id="feedback-rejection-${esc(item.id)}" data-feedback-rejection data-id="${esc(item.id)}">
        <label>${t.note}<textarea name="note" rows="3" maxlength="500"></textarea></label>
        <div class="admin-live-actions"><button type="submit">${actions.confirm}</button><button type="button" class="admin-button-secondary" data-feedback-cancel>${actions.cancel}</button></div>
      </form>`;
    }
    function render() {
      const visible = items.filter(item => !filter.value || item.status === filter.value);
      list.innerHTML = visible.length ? visible.map(item => `<article class="admin-feedback-card">
        <div class="admin-feedback-card-header"><strong>${esc(t.kinds[item.kind] || item.kind)}</strong><span class="admin-live-status" data-status="${esc(item.status)}">${esc(t.statuses[item.status] || item.status)}</span></div>
        <p class="admin-feedback-text">${esc(item.message)}</p>
        <p class="admin-muted">${t.date}: ${esc(new Date(item.created_at).toLocaleString(t.locale, {dateStyle:'short',timeStyle:'short'}))}</p>
        ${item.moderator_note ? `<p class="admin-feedback-note"><strong>${t.noteLabel}:</strong> ${esc(item.moderator_note)}</p>` : ''}
        <div class="admin-live-actions">${item.status !== 'approved' ? `<button type="button" data-id="${esc(item.id)}" data-action="approved">${t.approve}</button>` : ''}${item.status !== 'rejected' ? `<button type="button" class="admin-button-secondary" data-id="${esc(item.id)}" data-action="rejected" aria-expanded="${view.rejection?.id === item.id}"${view.rejection?.id === item.id ? ` aria-controls="feedback-rejection-${esc(item.id)}"` : ''}>${t.reject}</button>` : ''}</div>
        ${item.status !== 'rejected' ? rejectionForm(item) : ''}
      </article>`).join('') : `<p class="admin-muted">${t.empty}</p>`;
      const note = list.querySelector('[data-feedback-rejection] textarea');
      if (note) note.value = view.rejection.note;
    }
    async function load() {
      list.setAttribute('aria-busy', 'true');
      try {
        const data = await api().get('/admin/feedback');
        if (!isActive()) return;
        items = data.items;
        render();
      } finally {
        list.removeAttribute('aria-busy');
      }
    }
    result.addEventListener('click', async event => {
      const retry = event.target.closest('[data-feedback-retry]');
      if (!retry || busy) return;
      busy = true;
      retry.disabled = true;
      try {
        await load();
        if (!isActive()) return;
        result.textContent = '';
        filter.disabled = false;
        filter.focus();
      }
      catch (error) {
        if (!isActive()) return;
        if (error.status === 401) { session = null; location.hash = '#/admin/session'; return; }
        if (error.status === 403) {
          result.innerHTML = message(window.adminCoreCopy.text('Для этого раздела у вашей роли нет прав.', language), 'error');
          return;
        }
        showLoadError(retryMessage);
        result.querySelector('[data-feedback-retry]').focus();
      }
      finally { busy = false; }
    });
    filter.addEventListener('change', () => { view.filter = filter.value; render(); });
    const canDecide = () => isActive() && !busy && feedbackOperation?.user !== user;
    const decisionButton = (id, action) => list.querySelector(`[data-id="${CSS.escape(id)}"][data-action="${action}"]`);
    list.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !canDecide()) return;
      if (button.matches('[data-feedback-cancel]')) {
        const id = view.rejection.id;
        view.rejection = null;
        render();
        decisionButton(id, 'rejected')?.focus();
        return;
      }
      const { id, action } = button.dataset;
      if (action === 'rejected') {
        if (view.rejection?.id !== id) {
          view.rejection = { id, note: '' };
          render();
        }
        list.querySelector('[data-feedback-rejection] textarea')?.focus();
      } else if (action === 'approved') {
        saveDecision(id, action, null, button);
      }
    });
    list.addEventListener('input', event => {
      if (event.target.matches('[data-feedback-rejection] textarea')) view.rejection.note = event.target.value;
    });
    list.addEventListener('submit', event => {
      event.preventDefault();
      if (event.target.matches('[data-feedback-rejection]') && canDecide()) {
        const note = view.rejection.note.trim();
        saveDecision(event.target.dataset.id, 'rejected', note || null, event.submitter);
      }
    });
    async function saveDecision(id, status, note, control) {
      busy = true;
      list.querySelectorAll('button, textarea').forEach(field => { field.disabled = true; });
      filter.disabled = true;
      result.innerHTML = message(actions.saving);
      const operation = { user, promise: null };
      operation.promise = api().post('/admin/feedback/' + encodeURIComponent(id), { status, note })
        .then(() => {
          if (view.rejection?.id === id) view.rejection = null;
          return { error: null };
        }, error => ({ error }));
      feedbackOperation = operation;
      try {
        const outcome = await operation.promise;
        if (feedbackOperation === operation) feedbackOperation = null;
        if (!isActive()) return;
        if (outcome.error) throw outcome.error;
        try {
          await load();
          if (!isActive()) return;
          result.innerHTML = message(t.saved);
        } catch (error) {
          if (error.status === 401) throw error;
          if (!isActive()) return;
          items = []; list.textContent = ''; showLoadError(actions.refreshFailed);
        }
      } catch (error) {
        if (error.status === 401) { session = null; location.hash = '#/admin/session'; return; }
        result.innerHTML = message(error.message, 'error');
      }
      finally {
        busy = false;
        list.querySelectorAll('button, textarea').forEach(field => { field.disabled = false; });
        const retry = result.querySelector('[data-feedback-retry]');
        filter.disabled = Boolean(retry);
        if (isActive() && document.activeElement === document.body) {
          const nextAction = decisionButton(id, status === 'approved' ? 'rejected' : 'approved');
          (retry || (control?.isConnected ? control : nextAction) || filter).focus();
        }
      }
    }
    list.textContent = t.loading;
    filter.disabled = true;
    let decisionSaved = false;
    try {
      const operation = feedbackOperation && feedbackOperation.user === user ? feedbackOperation : null;
      if (operation) {
        filter.disabled = true;
        const outcome = await operation.promise;
        if (!isActive()) return;
        if (outcome.error && outcome.error.status === 401) throw outcome.error;
        if (outcome.error) result.innerHTML = message(outcome.error.message, 'error');
        else { decisionSaved = true; result.innerHTML = message(t.saved); }
      }
      await load();
      filter.disabled = false;
    }
    catch (error) {
      if (!isActive()) return;
      if (error.status === 401 || error.status === 403) throw error;
      list.textContent = '';
      filter.disabled = true;
      showLoadError(decisionSaved ? actions.refreshFailed : actions.failed);
    }
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

  const SCREENS = { dashboard, moderation, editor, analytics, feedback, audit, imports, roles, users, 'branch-editor': window.renderLiveBranchEditor, catalogue: window.renderPublishedAdminCatalogue, files: window.archiveWorkbench.files, content: window.archiveWorkbench.content, translations: window.archiveWorkbench.translations };

  const original = window.renderAdmin;
  window.renderAdmin = function renderAdminLive(container, path, language) {
    original(container, path, language);
    const key = path || 'dashboard';
    const a = api();
    if (!a) return;
    const layout = container.querySelector('.admin-layout');
    const notice = layout?.querySelector('.admin-notice');
    if (!notice) return;
    const t = value => window.adminCoreCopy.text(value, language);
    const previewNotice = notice.innerHTML;
    notice.textContent = t('Проверяем доступ…');
    a.ready.then(async (available) => {
      if (!layout.isConnected) return;
      if (!available) { notice.innerHTML = previewNotice; return; }
      const user = session || await loadSession();
      if (!layout.isConnected) return;
      const main = document.createElement('div');
      if (!user || key === 'login' || key === 'session') {
        while (notice.nextSibling) notice.nextSibling.remove();
        notice.after(main);
        notice.textContent = t('Для работы с материалами требуется вход сотрудника.');
        main.innerHTML = loginScreen(key, language);
        bindLogin(main, key, language);
        return;
      }
      notice.setAttribute('role', 'region');
      notice.setAttribute('aria-label', t('Учётная запись сотрудника'));
      notice.innerHTML = `<div class="admin-session-details"><strong>${esc(user.name)}</strong><span>${esc(t(user.roleLabel))}</span></div><button type="button" class="admin-button-secondary" id="admin-logout">${t('Выйти')}</button><p id="admin-session-result" role="status" aria-live="polite" hidden></p>`;
      if (user.branchId) {
        const branchLabel = document.createElement('span');
        notice.querySelector('.admin-session-details').append(branchLabel);
        a.get('/branches').then(({ items }) => {
          const branch = items.find(item => item.id === user.branchId);
          const name = branch?.[`name_${language}`] || branch?.name_ru;
          if (name) branchLabel.textContent = name;
        }).catch(() => { branchLabel.textContent = ''; });
      }
      notice.querySelector('#admin-logout').addEventListener('click', async event => {
        const button = event.currentTarget;
        const result = notice.querySelector('#admin-session-result');
        button.disabled = true;
        result.hidden = true;
        try {
          await a.post('/admin/logout');
        } catch (error) {
          if (error.status !== 401) {
            result.hidden = false;
            result.textContent = t('Не удалось выйти. Повторите попытку.') + ' ' + error.message;
            button.disabled = false;
            return;
          }
        }
        window.archiveWorkbench.clear();
        editorDraft = null;
        session = null;
        location.hash = '#/admin/login';
      });
      if (!LIVE.has(key)) {
        const preview = document.createElement('p');
        preview.className = 'admin-screen-preview-note';
        preview.textContent = t('Макет раздела. Загрузка данных и сохранение изменений для этого экрана ещё не подключены.');
        notice.after(preview);
        return;
      }
      while (notice.nextSibling) notice.nextSibling.remove();
      notice.after(main);
      const permissions = user.permissions;
      const canCreate = permissions.includes('catalog.edit') || permissions.includes('content.create');
      if ((key === 'editor' && !canCreate)
        || (key === 'moderation' && !canCreate && !permissions.includes('moderation.review'))
        || (key === 'branch-editor' && !permissions.includes('branches.edit'))
        || (key === 'catalogue' && !permissions.includes('catalog.edit'))
        || (key === 'files' && !['catalog.edit', 'content.create', 'content.publish'].some(permission => permissions.includes(permission)))
        || (['content', 'translations'].includes(key) && !permissions.includes('content.create') && !permissions.includes('content.publish'))) {
        main.innerHTML = message(t('Для этого раздела у вашей роли нет прав.'), 'error');
        return;
      }
      try {
        await SCREENS[key](main, language, user, () => {
          if (session !== user) return;
          window.archiveWorkbench.clear();
          session = null;
          if (location.hash.startsWith('#/admin')) location.hash = '#/admin/session';
        });
        if (['audit', 'roles', 'users'].includes(key)) tableRegion(main, main.querySelector('h1').textContent);
      }
      catch (error) {
        if (error.status === 401) {
          window.archiveWorkbench.clear();
          session = null;
          notice.setAttribute('role', 'note');
          notice.removeAttribute('aria-label');
          notice.textContent = t('Для работы с материалами требуется вход сотрудника.');
          main.innerHTML = loginScreen('session', language);
          bindLogin(main, key, language);
        }
        else main.innerHTML = message(error.status === 403 ? t('Для этого раздела у вашей роли нет прав.') : error.message, 'error');
      }
    });
  };
}());
