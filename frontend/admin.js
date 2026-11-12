/* Static layout preview. This is not an authenticated administration interface. */
(function () {
  'use strict';

  const coreScreens = [
    {id:'dashboard', label:'Рабочий стол', render:dashboard},
    {id:'moderation', label:'Модерация', render:moderation},
    {id:'editor', label:'Новая запись', render:editor},
    {id:'analytics', label:'ИИ-аналитика', render:analytics}
  ];

  function dashboard() {
    return `<div class="admin-heading"><div><h1>Рабочий стол</h1><p>Выберите задачу для работы с материалами архива.</p></div></div>
      <section class="admin-panel"><p>Войдите в панель сотрудника, чтобы увидеть доступные задачи.</p><a href="#/admin/login">Войти</a></section>`;
  }

  function cards(labels) {
    return `<div class="admin-metrics">${labels.map(label => `<div class="admin-metric"><span>${label}</span><strong aria-label="Нет данных">—</strong></div>`).join('')}</div>`;
  }

  function moderation() {
    return `<div class="admin-heading"><div><p class="admin-kicker">РАБОТА С ПУБЛИКАЦИЯМИ</p><h1>Модерация публикаций</h1><p>Проверка материалов и управление статусами публикаций</p></div></div>
      ${cards(['На проверке', 'Требует доработки', 'Одобрено', 'Опубликовано'])}
      <div class="admin-moderation-grid"><section class="admin-panel"><div class="admin-panel-header"><div><h2>Материалы</h2><p>Здесь будет список публикаций для проверки</p></div><span class="admin-badge">Предпросмотр</span></div><div class="admin-table-head" aria-hidden="true"><span>МАТЕРИАЛ</span><span>РАЗДЕЛ</span><span>АВТОР</span><span>СТАТУС</span></div><div class="admin-empty"><span class="admin-empty-icon" aria-hidden="true">✓</span><h3>Список пока не подключён</h3><p>После подключения системы здесь появятся материалы, доступные сотруднику.</p></div></section>
      <aside class="admin-panel admin-detail"><h2>История проверки</h2><p>Выберите материал, чтобы увидеть его сведения и этапы модерации.</p><div class="admin-status-list"><span>Черновик</span><span>На проверке</span><span>Требует доработки</span><span>Одобрено</span><span>Опубликовано</span><span>Архивировано</span></div><button disabled type="button">Одобрить</button><button disabled type="button" class="admin-button-secondary">На доработку</button></aside></div>`;
  }

  function editor() {
    return `<div class="admin-heading"><div><p class="admin-kicker">КАТАЛОГ</p><h1>Новая запись каталога</h1><p>Предпросмотр рабочего места сотрудника архива</p></div></div>
      <div class="admin-editor-grid"><section class="admin-file-column"><div class="admin-file-preview"><div class="admin-file-symbol" aria-hidden="true">▧</div><h2>Предпросмотр документа</h2><p>Изображение появится после подключения загрузки файлов.</p></div><div class="admin-panel admin-file-info"><strong>Файл не выбран</strong><p>Загрузка, распознавание текста и поиск дублей ещё не подключены.</p><button type="button" disabled class="admin-button-secondary">Выбрать файл</button></div></section>
      <section class="admin-panel admin-editor"><div class="admin-panel-header"><div><h2>Карточка материала</h2><p>Поля для проверки и заполнения сотрудником</p></div><span class="admin-badge">Черновик</span></div><div class="admin-editor-note">ИИ-подсказки и сохранение не подключены. Поля показаны для ознакомления.</div><form class="admin-form"><label>Заголовок<input type="text" placeholder="Название материала" disabled></label><label>Фонд<input type="text" placeholder="Выберите фонд" disabled></label><label>Опись<input type="text" placeholder="Выберите опись фонда" disabled></label><label>Дело<input type="text" placeholder="Выберите дело описи" disabled></label><label>Лист<input type="text" placeholder="Лист или диапазон листов" disabled></label><label>Дата<input type="text" placeholder="Дата документа" disabled></label><label>Тип документа<input type="text" placeholder="Выберите тип" disabled></label><label>Место<input type="text" placeholder="Место или регион" disabled></label><label>Ключевые слова<input type="text" placeholder="Добавьте ключевые слова" disabled></label><label>Описание<textarea rows="3" placeholder="Краткое описание" disabled></textarea></label><label>Язык оригинала<select disabled><option>Выберите язык</option><option>Казахский</option><option>Русский</option><option>Другой</option></select></label><label>Источник<input type="text" placeholder="Ссылка или документ-основание" disabled></label><label>Хранение<input type="text" placeholder="Архив или филиал" disabled></label><label>Доступ<select disabled><option>Требует проверки</option><option>Открытые метаданные</option><option>Ограниченные метаданные</option></select></label><label>Копия<select disabled><option>Наличие не подтверждено</option><option>Разрешена публикация копии</option><option>Только описание</option><option>Доступ к копии ограничен</option></select></label><div class="admin-form-actions"><button type="button" class="admin-button-secondary" disabled>Сохранить черновик</button><button type="button" disabled>Отправить на проверку</button></div></form></section></div>`;
  }

  function analytics() {
    return `<div class="admin-heading"><div><p class="admin-kicker">АНАЛИТИКА</p><h1>ИИ-аналитика качества сайта</h1><p>Сводка по работе помощника и потребностям посетителей</p></div></div>
      ${cards(['Вопросов к помощнику', 'Ответов с источником', 'Без результата', 'Оценок «Помогло»'])}
      <div class="admin-analytics-grid"><section class="admin-panel"><div class="admin-panel-header"><div><h2>Запросы без результата</h2><p>Обезличенная сводка тем, по которым не найден ответ</p></div></div><div class="admin-empty admin-analytics-empty"><span class="admin-empty-icon" aria-hidden="true">⌕</span><h3>Данные пока недоступны</h3><p>Аналитика не подключена. Примеры запросов и показатели здесь не представлены.</p></div><div class="admin-divider"></div><h2>Популярные разделы</h2><p class="admin-muted">Сводка появится после подключения аналитики.</p><div class="admin-chart" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div></section>
      <aside class="admin-panel"><h2>Рекомендации</h2><p class="admin-muted">Здесь могут отображаться предложения по улучшению содержания сайта. Решение принимает сотрудник.</p><div class="admin-recommendation"><strong>Рекомендаций пока нет</strong><p>Генерация рекомендаций не подключена.</p></div></aside></div>`;
  }

  function accessDenied() {
    return `<div class="admin-heading"><div><p class="admin-kicker">ПРИМЕР СОСТОЯНИЯ</p><h1>Доступ к разделу ограничен</h1><p>Макет сообщения об отсутствии необходимых полномочий.</p></div></div><section class="admin-panel"><h2>Проверьте область доступа</h2><p>В рабочей системе доступ будет зависеть от роли сотрудника и назначенного филиала. Для изменения полномочий потребуется обратиться к администратору.</p><p class="admin-muted">В этом прототипе роли не проверяются. Этот экран показывает только оформление сообщения.</p><div class="admin-screen-actions"><a href="#/admin/moderation">К обзору панели →</a><a href="#/admin/roles">Макет ролей →</a></div></section>`;
  }

  window.renderAdmin = function renderAdmin(container, path, language = 'ru') {
    const t = value => window.adminCoreCopy.text(value, language);
    const allScreens = [...coreScreens, ...(window.adminCatalogScreens || []), ...(window.adminContentScreens || []), ...(window.adminManagementScreens || []), {id:'access-denied', label:'Пример ограничения доступа', render:accessDenied}];
    const groups = [
      ['Рабочие задачи', ['dashboard', 'moderation']],
      ['Архивный каталог', ['editor', 'catalogue', 'files', 'imports']],
      ['Публикации сайта', ['content', 'translations']],
      ['Гостевая книга', ['feedback']],
      ['Филиалы', ['branch-editor']],
      ['Управление', ['analytics', 'users', 'roles', 'audit', 'settings', 'login', 'session', 'access-denied']]
    ].map(([title, ids]) => [title, ids.map(id => allScreens.find(item => item.id === id)).filter(Boolean)]);
    const screens = allScreens;
    const key = path || 'dashboard';
    const screen = screens.find(item => item.id === key);
    const label = item => item.labels?.[language] || t(item.label);
    const screenLink = (item, text = label(item)) => `<a href="#/admin/${item.id}" ${item.id === key ? 'aria-current="page"' : ''}>${text}</a>`;
    const groupLinks = () => groups.filter(([,items]) => items.length).map(([title,items]) => {
      if (items.length === 1) return screenLink(items[0], title === 'Рабочие задачи' ? label(items[0]) : t(title));
      return `<details class="admin-nav-group" ${items.some(item => item.id === key) ? 'open' : ''}><summary>${t(title)}</summary>${items.map(item => screenLink(item)).join('')}</details>`;
    }).join('');
    let body = screen ? screen.render(language) : '<div class="admin-heading"><div><h1>Экран не найден</h1><p>Выберите раздел в меню демонстрации.</p><a href="#/admin/moderation">К модерации →</a></div></div>';
    if (!screen || coreScreens.includes(screen) || key === 'access-denied') body = window.adminCoreCopy.html(body,language);
    container.innerHTML = `<section class="admin-layout">
      <aside class="admin-sidebar"><a class="admin-brand" href="#/"><span aria-hidden="true">▣</span><span><strong>${t('Госархив ВКО')}</strong><small>${t('Панель сотрудника')}</small></span></a>
        <nav aria-label="${t('Разделы панели')}">${groupLinks()}</nav><a class="admin-back" href="#/">← ${t('На сайт')}</a>
      </aside>
      <div class="admin-main"><div class="admin-mobile-nav"><div class="admin-mobile-header"><strong>${t('Госархив ВКО')} · ${t('Панель сотрудника')}</strong><a href="#/">← ${t('На сайт')}</a></div><details class="admin-mobile-menu"><summary>${t('Разделы панели')} · ${screen ? label(screen) : t('Выбрать раздел')}</summary><nav aria-label="${t('Разделы панели')}">${groupLinks()}</nav></details></div>
        <div class="admin-notice" role="note"><strong>${t('Демонстрация интерфейса.')}</strong> ${t('Авторизация, данные, обработка файлов и сохранение не подключены. Это не защищённая рабочая панель.')}</div>${body}
      </div></section>`;

    const layout = container.querySelector('.admin-layout');
    const api = window.archiveApi;
    if (!api) return;
    api.ready.then(async available => {
      if (!available) return;
      let user;
      try {
        ({ user } = await api.get('/admin/session'));
      } catch (error) {
        if (error.status !== 401) return;
      }
      if (!layout.isConnected) return;
      const permissions = user?.permissions || [];
      const allowed = {
        dashboard: Boolean(user),
        moderation: permissions.includes('moderation.review') || permissions.includes('content.create') || permissions.includes('catalog.edit'),
        editor: permissions.includes('catalog.edit') || permissions.includes('content.create'),
        catalogue: permissions.includes('catalog.edit'),
        files: ['catalog.edit', 'content.create', 'content.publish'].some(permission => permissions.includes(permission)),
        imports: permissions.includes('catalog.import'),
        content: permissions.includes('content.create') || permissions.includes('content.publish'),
        translations: permissions.includes('content.create') || permissions.includes('content.publish'),
        review: permissions.includes('moderation.review'),
        feedback: permissions.includes('feedback.moderate'),
        'branch-editor': permissions.includes('branches.edit'),
        analytics: permissions.includes('analytics.read'),
        users: permissions.includes('users.manage'),
        roles: permissions.includes('users.manage'),
        audit: permissions.includes('audit.read'),
        settings: permissions.includes('settings.manage'),
        login: !user,
        session: false,
        'access-denied': false
      };
      layout.querySelectorAll('nav a[href^="#/admin/"]').forEach(link => {
        const id = link.getAttribute('href').slice('#/admin/'.length);
        link.hidden = !allowed[id];
      });
      layout.querySelectorAll('.admin-nav-group').forEach(group => {
        group.hidden = !Array.from(group.querySelectorAll('a')).some(link => !link.hidden);
      });
    }).catch(() => {});
  };
}());
