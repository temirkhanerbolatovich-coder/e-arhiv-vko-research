/* Static administrative layouts. No accounts, permissions, messages or settings are changed. */
(function () {
  'use strict';

  const roles = [
    ['Главный администратор', 'Полный доступ ко всем модулям и настройкам системы.'],
    ['Администратор сайта', 'Управление страницами, пользователями и настройками контента.'],
    ['Редактор', 'Создание, редактирование и публикация информационных материалов.'],
    ['Сотрудник архива', 'Работа с каталогом и архивными материалами в пределах предоставленных полномочий.'],
    ['Администратор филиала', 'Управление информацией конкретного филиала.'],
    ['Модератор', 'Проверка и согласование материалов перед публикацией.'],
    ['Аналитик', 'Просмотр статистики и аналитических отчётов.']
  ];

  function heading(kicker, title, description) {
    return `<header class="admin-heading"><div><p class="admin-kicker">${kicker}</p><h1>${title}</h1><p>${description}</p></div></header>`;
  }

  function empty(title, description) {
    return `<div class="admin-empty"><span class="admin-empty-icon" aria-hidden="true">—</span><h3>${title}</h3><p>${description}</p></div>`;
  }

  function users() {
    return `${heading('КОМАНДА И ДОСТУП', 'Сотрудники', 'Учётные записи сотрудников и область доступа по филиалам.')}
      <div class="admin-management-toolbar"><label>Поиск сотрудника<input type="search" placeholder="Имя или рабочая почта" disabled></label><label>Роль<select disabled><option>Все роли</option></select></label><label>Филиал<select disabled><option>Все филиалы</option></select></label><button type="button" disabled>Добавить сотрудника</button></div>
      <div class="admin-management-grid"><section class="admin-panel"><h2>Учётные записи</h2><p class="admin-muted">Реальные пользователи в прототипе отсутствуют.</p>${empty('Список не подключён', 'Здесь будут имя, рабочая почта, роль, филиал и статус учётной записи.')}</section>
      <aside class="admin-panel"><h2>Карточка сотрудника</h2><p class="admin-muted">Поля показаны для обсуждения интерфейса.</p><form class="admin-management-form"><label>Имя сотрудника<input type="text" placeholder="Не заполнено" disabled></label><label>Рабочая почта<input type="email" placeholder="Не заполнено" disabled></label><label>Роль<select disabled><option>Выберите роль</option>${roles.map(([name])=>`<option>${name}</option>`).join('')}</select></label><label>Область доступа<select disabled><option>Выберите филиал</option></select></label><label>Статус<select disabled><option>Не назначен</option></select></label><div class="admin-management-actions"><button type="button" disabled>Сохранить</button><button type="button" disabled class="admin-button-secondary">Отключить доступ</button></div></form><a class="admin-management-link" href="#/admin/roles">Роли и полномочия →</a></aside></div>`;
  }

  function roleList() {
    return `${heading('КОМАНДА И ДОСТУП', 'Роли и полномочия', 'Семь типов пользователей из технического задания. Настройка прав подключается на этапе бэкенда.')}
      <p class="admin-management-note">Перечень описывает требуемые роли. Он не подтверждает наличие защиты или назначенных прав в текущем прототипе.</p>
      <div class="admin-management-role-list">${roles.map(([name, description])=>`<article class="admin-panel admin-management-role"><div><h2>${name}</h2><p>${description}</p></div><button type="button" disabled class="admin-button-secondary">Настроить права</button></article>`).join('')}</div>
      <section class="admin-panel admin-management-scope"><h2>Область действия прав</h2><p>Полномочия и доступ к конкретному филиалу настраиваются отдельно. Точные разрешения согласовываются при реализации системы доступа.</p><div class="admin-management-permission-preview"><label><input type="checkbox" disabled> Просмотр</label><label><input type="checkbox" disabled> Редактирование</label><label><input type="checkbox" disabled> Публикация</label><label><input type="checkbox" disabled> Настройка доступа</label></div><p class="admin-muted">Пустые переключатели — пример элементов управления, а не действующая матрица разрешений.</p></section>`;
  }

  function feedback() {
    return `${heading('ОБРАТНАЯ СВЯЗЬ', 'Модерация отзывов', 'Отзывы, предложения и пожелания о работе сайта.')}
      <div class="admin-management-toolbar"><label>Поиск<input type="search" placeholder="Тема или текст" disabled></label><label>Статус<select disabled><option>Все сообщения</option></select></label><label>Тип<select disabled><option>Отзывы и предложения</option></select></label></div>
      <div class="admin-management-grid"><section class="admin-panel"><h2>Сообщения посетителей</h2>${empty('Полученных сообщений нет', 'Отправка отзывов не подключена. Ниже показана только структура карточки сообщения.')}<p class="admin-muted">Этот раздел не предназначен для заявлений, архивных запросов или заказов услуг.</p></section>
      <article class="admin-panel"><span class="admin-badge">Условный пример</span><h2 class="admin-management-example-title">Предложение по сайту</h2><dl class="admin-management-facts"><div><dt>Тип</dt><dd>Предложение</dd></div><div><dt>Дата</dt><dd>Не задана</dd></div><div><dt>Отправитель</dt><dd>Не указан</dd></div></dl><blockquote class="admin-management-quote">Пример текста: сделать ссылку на каталог заметнее.</blockquote><p class="admin-muted">Это вымышленный пример для проверки вёрстки, а не отзыв посетителя.</p><label class="admin-management-label">Комментарий модератора<textarea rows="3" placeholder="Комментарий к проверке" disabled></textarea></label><div class="admin-management-actions"><button type="button" disabled>Одобрить</button><button type="button" class="admin-button-secondary" disabled>Отклонить</button></div></article></div>`;
  }

  function audit() {
    return `${heading('КОНТРОЛЬ ИЗМЕНЕНИЙ', 'Журнал действий', 'Сведения о действиях сотрудников и изменениях в системе.')}
      <div class="admin-management-toolbar"><label>Поиск<input type="search" placeholder="Материал или описание действия" disabled></label><label>Тип действия<select disabled><option>Все действия</option></select></label><label>Период<input type="text" placeholder="Начало — конец периода" disabled></label><button type="button" class="admin-button-secondary" disabled>Экспорт</button></div>
      <section class="admin-panel"><h2>События журнала</h2><p class="admin-muted">Журнал не подключён. Демонстрационные события не создавались.</p><div class="admin-management-audit-columns" aria-hidden="true"><span>Время</span><span>Сотрудник</span><span>Действие</span><span>Материал / описание</span></div>${empty('Действий пока нет', 'В рабочей системе здесь будут время, сотрудник, тип действия и описание изменения.')}</section>
      <section class="admin-panel admin-management-scope"><h2>Какие изменения отражаются</h2><ul class="admin-management-list"><li>Входы в систему и действия с учётными записями.</li><li>Создание, редактирование и публикация материалов.</li><li>Изменения файлов, настроек и прав доступа.</li></ul><p class="admin-muted">Пароли и другие секреты не должны попадать в журнал.</p></section>`;
  }

  function settings() {
    return `${heading('НАСТРОЙКИ ПОРТАЛА', 'Настройки сайта', 'Общие сведения, языки, оформление и состояние интеграций.')}
      <div class="admin-management-grid"><section class="admin-panel"><h2>Основные сведения</h2><form class="admin-management-form"><label>Название учреждения<input type="text" value="Государственный архив ВКО" disabled></label><label>Описание сайта<textarea rows="3" disabled>Информационный портал государственного архива</textarea></label><label>Языки интерфейса<select disabled><option>Қазақша · Русский · English</option></select></label><label>Тема по умолчанию<select disabled><option>Светлая</option></select></label><button type="button" disabled>Сохранить настройки</button></form></section>
      <section class="admin-panel"><h2>Интеграции</h2><div class="admin-management-integration"><h3>ИИ-помощник</h3><span>Не подключён</span><p>На публичном сайте доступны заранее подготовленные примеры ответов.</p></div><div class="admin-management-integration"><h3>Карты</h3><span>Внешний виджет</span><p>В карточке головного архива предусмотрен просмотр внешней карты.</p></div><div class="admin-management-integration"><h3>Аналитика</h3><span>Не подключена</span><p>Показатели и отчёты появятся после подключения источника данных.</p></div><p class="admin-muted">Ключи и реквизиты подключения в макете не запрашиваются.</p><button type="button" class="admin-button-secondary" disabled>Настроить интеграции</button></section></div>`;
  }

  function login() {
    return `${heading('ДОСТУП СОТРУДНИКОВ', 'Вход в панель', 'Предпросмотр экрана авторизации. Ввод учётных данных отключён.')}
      <section class="admin-panel admin-management-auth"><h2>Учётная запись сотрудника</h2><p class="admin-muted">Вход будет доступен после подключения защищённой системы авторизации.</p><form class="admin-management-form"><label>Рабочая почта<input type="email" placeholder="Не вводите данные в прототип" autocomplete="off" disabled></label><label>Пароль<input type="text" value="Поле недоступно в макете" autocomplete="off" disabled></label><button type="button" disabled>Войти</button></form><p class="admin-management-note">Этот экран не защищает остальные страницы прототипа и не проверяет пользователя.</p><a class="admin-management-link" href="#/admin/session">Посмотреть пример истёкшей сессии →</a></section>`;
  }

  function session() {
    return `${heading('ДОСТУП СОТРУДНИКОВ', 'Пример: сессия завершена', 'Демонстрационное состояние интерфейса, а не событие реального входа.')}
      <section class="admin-panel admin-management-auth"><div class="admin-management-session-mark" aria-hidden="true">◷</div><h2>Необходимо войти снова</h2><p>В рабочей системе здесь будет сообщение о завершении сессии. После повторного входа доступ зависит от роли сотрудника.</p><p class="admin-muted">В прототипе авторизации и сохранённых сессий нет.</p><a class="admin-management-link" href="#/admin/login">К макету входа →</a><a class="admin-management-link" href="#/">Вернуться на сайт →</a></section>`;
  }

  // Exact static text translations keep the preview controls and route targets intact.
  const messages = [
    ['Главный администратор','Бас әкімші','Super administrator'],
    ['Полный доступ ко всем модулям и настройкам системы.','Жүйенің барлық модульдері мен баптауларына толық қолжетімділік.','Full access to all system modules and settings.'],
    ['Администратор сайта','Сайт әкімшісі','Website administrator'],
    ['Управление страницами, пользователями и настройками контента.','Беттерді, пайдаланушыларды және мазмұн баптауларын басқару.','Manage pages, users and content settings.'],
    ['Редактор','Редактор','Editor'],
    ['Создание, редактирование и публикация информационных материалов.','Ақпараттық материалдарды жасау, өңдеу және жариялау.','Create, edit and publish informational materials.'],
    ['Сотрудник архива','Архив қызметкері','Archive employee'],
    ['Работа с каталогом и архивными материалами в пределах предоставленных полномочий.','Берілген өкілеттіктер шегінде каталогпен және архив материалдарымен жұмыс істеу.','Work with the catalogue and archival materials within assigned permissions.'],
    ['Администратор филиала','Филиал әкімшісі','Branch administrator'],
    ['Управление информацией конкретного филиала.','Нақты филиал туралы ақпаратты басқару.','Manage information for a specific branch.'],
    ['Модератор','Модератор','Moderator'],
    ['Проверка и согласование материалов перед публикацией.','Материалдарды жариялау алдында тексеру және келісу.','Review and approve materials before publication.'],
    ['Аналитик','Талдаушы','Analyst'],
    ['Просмотр статистики и аналитических отчётов.','Статистиканы және талдамалық есептерді қарау.','View statistics and analytical reports.'],
    ['КОМАНДА И ДОСТУП','ҚЫЗМЕТКЕРЛЕР ЖӘНЕ ҚОЛЖЕТІМДІЛІК','TEAM AND ACCESS'],
    ['Сотрудники','Қызметкерлер','Employees'],
    ['Учётные записи сотрудников и область доступа по филиалам.','Қызметкерлердің тіркелгілері және филиалдар бойынша қолжетімділік ауқымы.','Employee accounts and branch access scope.'],
    ['Поиск сотрудника','Қызметкерді іздеу','Find employee'],
    ['Имя или рабочая почта','Аты немесе жұмыс поштасы','Name or work email'],
    ['Роль','Рөл','Role'],
    ['Все роли','Барлық рөлдер','All roles'],
    ['Филиал','Филиал','Branch'],
    ['Все филиалы','Барлық филиалдар','All branches'],
    ['Добавить сотрудника','Қызметкер қосу','Add employee'],
    ['Учётные записи','Тіркелгілер','Accounts'],
    ['Реальные пользователи в прототипе отсутствуют.','Прототипте нақты пайдаланушылар жоқ.','There are no real users in this prototype.'],
    ['Список не подключён','Тізім қосылмаған','List not connected'],
    ['Здесь будут имя, рабочая почта, роль, филиал и статус учётной записи.','Мұнда аты, жұмыс поштасы, рөлі, филиалы және тіркелгі күйі көрсетіледі.','The name, work email, role, branch and account status will appear here.'],
    ['Карточка сотрудника','Қызметкер карточкасы','Employee record'],
    ['Поля показаны для обсуждения интерфейса.','Өрістер интерфейсті талқылау үшін көрсетілген.','Fields are shown for discussing the interface.'],
    ['Имя сотрудника','Қызметкердің аты','Employee name'],
    ['Не заполнено','Толтырылмаған','Not entered'],
    ['Рабочая почта','Жұмыс поштасы','Work email'],
    ['Выберите роль','Рөлді таңдаңыз','Select a role'],
    ['Область доступа','Қолжетімділік ауқымы','Access scope'],
    ['Выберите филиал','Филиалды таңдаңыз','Select a branch'],
    ['Статус','Күйі','Status'],
    ['Не назначен','Тағайындалмаған','Not assigned'],
    ['Сохранить','Сақтау','Save'],
    ['Отключить доступ','Қолжетімділікті өшіру','Disable access'],
    ['Роли и полномочия →','Рөлдер мен өкілеттіктер →','Roles and permissions →'],
    ['Роли и полномочия','Рөлдер мен өкілеттіктер','Roles and permissions'],
    ['Семь типов пользователей из технического задания. Настройка прав подключается на этапе бэкенда.','Техникалық тапсырмадағы пайдаланушылардың жеті түрі. Құқықтарды баптау серверлік бөлікте қосылады.','Seven user types from the specification. Permission settings will be connected during backend development.'],
    ['Перечень описывает требуемые роли. Он не подтверждает наличие защиты или назначенных прав в текущем прототипе.','Тізім қажетті рөлдерді сипаттайды. Ол осы прототипте қорғаныс немесе тағайындалған құқықтар бар екенін растамайды.','This list describes required roles. It does not confirm protection or assigned permissions in the current prototype.'],
    ['Настроить права','Құқықтарды баптау','Configure permissions'],
    ['Область действия прав','Құқықтардың қолданылу ауқымы','Permission scope'],
    ['Полномочия и доступ к конкретному филиалу настраиваются отдельно. Точные разрешения согласовываются при реализации системы доступа.','Өкілеттіктер мен нақты филиалға қолжетімділік бөлек бапталады. Нақты рұқсаттар қолжетімділік жүйесін іске асыру кезінде келісіледі.','Permissions and access to a specific branch are configured separately. Exact permissions are agreed when implementing access control.'],
    ['Просмотр','Қарау','View'],
    ['Редактирование','Өңдеу','Edit'],
    ['Публикация','Жариялау','Publish'],
    ['Настройка доступа','Қолжетімділікті баптау','Configure access'],
    ['Пустые переключатели — пример элементов управления, а не действующая матрица разрешений.','Бос қосқыштар — басқару элементтерінің мысалы; бұл қолданыстағы рұқсаттар матрицасы емес.','Empty controls illustrate the interface; they are not an active permission matrix.'],
    ['ОБРАТНАЯ СВЯЗЬ','КЕРІ БАЙЛАНЫС','FEEDBACK'],
    ['Модерация отзывов','Пікірлерді модерациялау','Feedback moderation'],
    ['Отзывы, предложения и пожелания о работе сайта.','Сайт жұмысы туралы пікірлер, ұсыныстар мен тілектер.','Feedback, suggestions and wishes about the website.'],
    ['Поиск','Іздеу','Search'],
    ['Тема или текст','Тақырып немесе мәтін','Topic or text'],
    ['Все сообщения','Барлық хабарламалар','All messages'],
    ['Тип','Түрі','Type'],
    ['Отзывы и предложения','Пікірлер мен ұсыныстар','Feedback and suggestions'],
    ['Сообщения посетителей','Келушілердің хабарламалары','Visitor messages'],
    ['Полученных сообщений нет','Алынған хабарламалар жоқ','No messages received'],
    ['Отправка отзывов не подключена. Ниже показана только структура карточки сообщения.','Пікір жіберу қосылмаған. Төменде хабарлама карточкасының құрылымы ғана көрсетілген.','Feedback submission is not connected. Only the structure of a message record is shown below.'],
    ['Этот раздел не предназначен для заявлений, архивных запросов или заказов услуг.','Бұл бөлім өтініштерге, архивтік сұрауларға немесе қызметке тапсырыс беруге арналмаған.','This section is not for applications, archival requests or service orders.'],
    ['Условный пример','Шартты мысал','Illustrative example'],
    ['Предложение по сайту','Сайт бойынша ұсыныс','Website suggestion'],
    ['Предложение','Ұсыныс','Suggestion'],
    ['Дата','Күні','Date'],
    ['Не задана','Берілмеген','Not set'],
    ['Отправитель','Жіберуші','Sender'],
    ['Не указан','Көрсетілмеген','Not specified'],
    ['Пример текста: сделать ссылку на каталог заметнее.','Мәтін мысалы: каталогқа сілтемені айқынырақ ету.','Example text: make the catalogue link more visible.'],
    ['Это вымышленный пример для проверки вёрстки, а не отзыв посетителя.','Бұл — беттеуді тексеруге арналған ойдан шығарылған мысал, келушінің пікірі емес.','This is an invented layout example, not visitor feedback.'],
    ['Комментарий модератора','Модератор түсіндірмесі','Moderator comment'],
    ['Комментарий к проверке','Тексеруге түсіндірме','Review comment'],
    ['Одобрить','Мақұлдау','Approve'],
    ['Отклонить','Қабылдамау','Reject'],
    ['КОНТРОЛЬ ИЗМЕНЕНИЙ','ӨЗГЕРІСТЕРДІ БАҚЫЛАУ','CHANGE CONTROL'],
    ['Журнал действий','Әрекеттер журналы','Activity log'],
    ['Сведения о действиях сотрудников и изменениях в системе.','Қызметкерлердің әрекеттері мен жүйедегі өзгерістер туралы мәліметтер.','Information about employee actions and system changes.'],
    ['Материал или описание действия','Материал немесе әрекет сипаттамасы','Material or action description'],
    ['Тип действия','Әрекет түрі','Action type'],
    ['Все действия','Барлық әрекеттер','All actions'],
    ['Период','Кезең','Period'],
    ['Начало — конец периода','Кезеңнің басы — соңы','Period start — end'],
    ['Экспорт','Экспорт','Export'],
    ['События журнала','Журнал оқиғалары','Log events'],
    ['Журнал не подключён. Демонстрационные события не создавались.','Журнал қосылмаған. Демонстрациялық оқиғалар жасалмаған.','The log is not connected. No demonstration events have been created.'],
    ['Время','Уақыт','Time'],
    ['Сотрудник','Қызметкер','Employee'],
    ['Действие','Әрекет','Action'],
    ['Материал / описание','Материал / сипаттама','Material / description'],
    ['Действий пока нет','Әзірге әрекеттер жоқ','No actions yet'],
    ['В рабочей системе здесь будут время, сотрудник, тип действия и описание изменения.','Жұмыс жүйесінде мұнда уақыт, қызметкер, әрекет түрі және өзгеріс сипаттамасы көрсетіледі.','The live system will show the time, employee, action type and change description here.'],
    ['Какие изменения отражаются','Қандай өзгерістер көрсетіледі','Changes recorded'],
    ['Входы в систему и действия с учётными записями.','Жүйеге кіру және тіркелгілермен әрекеттер.','Sign-ins and account actions.'],
    ['Создание, редактирование и публикация материалов.','Материалдарды жасау, өңдеу және жариялау.','Creating, editing and publishing materials.'],
    ['Изменения файлов, настроек и прав доступа.','Файлдарды, баптауларды және қолжетімділік құқықтарын өзгерту.','Changes to files, settings and access permissions.'],
    ['Пароли и другие секреты не должны попадать в журнал.','Құпиясөздер мен басқа құпия мәліметтер журналға түспеуі тиіс.','Passwords and other secrets must not appear in the log.'],
    ['НАСТРОЙКИ ПОРТАЛА','ПОРТАЛ БАПТАУЛАРЫ','PORTAL SETTINGS'],
    ['Настройки сайта','Сайт баптаулары','Website settings'],
    ['Общие сведения, языки, оформление и состояние интеграций.','Жалпы мәліметтер, тілдер, безендіру және интеграциялар күйі.','General information, languages, appearance and integration status.'],
    ['Основные сведения','Негізгі мәліметтер','General information'],
    ['Название учреждения','Мекеме атауы','Institution name'],
    ['Государственный архив ВКО','ШҚО мемлекеттік архиві','East Kazakhstan State Archive'],
    ['Описание сайта','Сайт сипаттамасы','Website description'],
    ['Информационный портал государственного архива','Мемлекеттік архивтің ақпараттық порталы','State archive information portal'],
    ['Языки интерфейса','Интерфейс тілдері','Interface languages'],
    ['Қазақша · Русский · English','Қазақша · Орысша · Ағылшынша','Kazakh · Russian · English'],
    ['Тема по умолчанию','Әдепкі тақырып','Default theme'],
    ['Светлая','Жарық','Light'],
    ['Сохранить настройки','Баптауларды сақтау','Save settings'],
    ['Интеграции','Интеграциялар','Integrations'],
    ['ИИ-помощник','ЖИ көмекшісі','AI assistant'],
    ['Не подключён','Қосылмаған','Not connected'],
    ['На публичном сайте доступны заранее подготовленные примеры ответов.','Жария сайтта алдын ала дайындалған жауап мысалдары қолжетімді.','Prepared example answers are available on the public website.'],
    ['Карты','Карталар','Maps'],
    ['Внешний виджет','Сыртқы виджет','External widget'],
    ['В карточке головного архива предусмотрен просмотр внешней карты.','Бас архив карточкасында сыртқы картаны қарау қарастырылған.','The main archive record includes an external map view.'],
    ['Аналитика','Талдау','Analytics'],
    ['Не подключена','Қосылмаған','Not connected'],
    ['Показатели и отчёты появятся после подключения источника данных.','Көрсеткіштер мен есептер деректер көзі қосылғаннан кейін пайда болады.','Metrics and reports will appear after a data source is connected.'],
    ['Ключи и реквизиты подключения в макете не запрашиваются.','Макетте қосылу кілттері мен деректемелері сұралмайды.','The preview does not request connection keys or credentials.'],
    ['Настроить интеграции','Интеграцияларды баптау','Configure integrations'],
    ['ДОСТУП СОТРУДНИКОВ','ҚЫЗМЕТКЕРЛЕРДІҢ ҚОЛЖЕТІМДІЛІГІ','EMPLOYEE ACCESS'],
    ['Вход в панель','Панельге кіру','Panel sign-in'],
    ['Предпросмотр экрана авторизации. Ввод учётных данных отключён.','Авторизация экранының алдын ала көрінісі. Тіркелгі деректерін енгізу өшірілген.','Sign-in screen preview. Credential entry is disabled.'],
    ['Учётная запись сотрудника','Қызметкер тіркелгісі','Employee account'],
    ['Вход будет доступен после подключения защищённой системы авторизации.','Кіру қорғалған авторизация жүйесі қосылғаннан кейін қолжетімді болады.','Sign-in will be available after a secure authentication system is connected.'],
    ['Не вводите данные в прототип','Прототипке деректер енгізбеңіз','Do not enter data in the prototype'],
    ['Пароль','Құпиясөз','Password'],
    ['Поле недоступно в макете','Макетте өріс қолжетімсіз','Field unavailable in preview'],
    ['Войти','Кіру','Sign in'],
    ['Этот экран не защищает остальные страницы прототипа и не проверяет пользователя.','Бұл экран прототиптің басқа беттерін қорғамайды және пайдаланушыны тексермейді.','This screen does not protect other prototype pages or authenticate users.'],
    ['Посмотреть пример истёкшей сессии →','Аяқталған сессия мысалын қарау →','View expired-session example →'],
    ['Пример: сессия завершена','Мысал: сессия аяқталды','Example: session ended'],
    ['Демонстрационное состояние интерфейса, а не событие реального входа.','Бұл — нақты кіру оқиғасы емес, интерфейстің демонстрациялық күйі.','A demonstration interface state, not an actual sign-in event.'],
    ['Необходимо войти снова','Қайта кіру қажет','Sign in again'],
    ['В рабочей системе здесь будет сообщение о завершении сессии. После повторного входа доступ зависит от роли сотрудника.','Жұмыс жүйесінде мұнда сессияның аяқталғаны туралы хабарлама болады. Қайта кіргеннен кейін қолжетімділік қызметкердің рөліне байланысты.','The live system will show a session-expiry message here. Access after signing in again depends on the employee role.'],
    ['В прототипе авторизации и сохранённых сессий нет.','Прототипте авторизация және сақталған сессиялар жоқ.','The prototype has no authentication or saved sessions.'],
    ['К макету входа →','Кіру макетіне өту →','Go to sign-in preview →'],
    ['Вернуться на сайт →','Сайтқа оралу →','Return to website →']
  ];
  const dictionaries = {
    kk: new Map(messages.map(([ru,kk])=>[ru,kk])),
    en: new Map(messages.map(([ru,,en])=>[ru,en]))
  };
  function localizedMarkup(markup, language) {
    const dictionary = dictionaries[language];
    if (!dictionary) return markup;
    const template = document.createElement('template');
    template.innerHTML = markup;
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      if (dictionary.has(text)) node.textContent = node.textContent.replace(text, dictionary.get(text));
    }
    template.content.querySelectorAll('[placeholder],[value],[aria-label],[title]').forEach(element=>{
      for (const attribute of ['placeholder','value','aria-label','title']) {
        const value = element.getAttribute(attribute);
        if (dictionary.has(value)) element.setAttribute(attribute,dictionary.get(value));
      }
    });
    return template.innerHTML;
  }

  window.adminManagementScreens = [
    {id:'users',label:'Сотрудники',labels:{ru:'Сотрудники',kk:'Қызметкерлер',en:'Employees'},render:users},
    {id:'roles',label:'Роли и права',labels:{ru:'Роли и права',kk:'Рөлдер мен құқықтар',en:'Roles and permissions'},render:roleList},
    {id:'feedback',label:'Отзывы',labels:{ru:'Отзывы',kk:'Пікірлер',en:'Feedback'},render:feedback},
    {id:'audit',label:'Журнал действий',labels:{ru:'Журнал действий',kk:'Әрекеттер журналы',en:'Activity log'},render:audit},
    {id:'settings',label:'Настройки',labels:{ru:'Настройки',kk:'Баптаулар',en:'Settings'},render:settings},
    {id:'login',label:'Вход',labels:{ru:'Вход',kk:'Кіру',en:'Sign-in'},render:login},
    {id:'session',label:'Сессия',labels:{ru:'Сессия',kk:'Сессия',en:'Session'},render:session}
  ].map(screen=>({...screen,render:(language='ru')=>localizedMarkup(screen.render(),language)}));
}());
