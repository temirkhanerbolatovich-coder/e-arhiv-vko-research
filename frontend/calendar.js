/* Selected entries from the customer's 2026 anniversary calendar, not a complete calendar. */
(function () {
  'use strict';

  const source = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/docs/data/customer/2026-11-10/extracted-text/' + encodeURIComponent('Календарь памятных дат — календарь 2026 год каз рус.md');
  const events = [
    {month: 1, date: '8 января', title: 'Ефим Николаевич Пермитин', description: '130 лет со дня рождения писателя, уроженца Восточного Казахстана.', year: '1896–1971'},
    {month: 1, date: '17 января', title: 'Преобразование Зыряновска в город', description: '85 лет со дня преобразования посёлка Зыряновск в город.', year: '1941'},
    {month: 2, date: '6 февраля', title: 'Переименование Риддера', description: '85 лет со дня переименования Риддера в Лениногорск.', year: '1941'},
    {month: 3, date: '20 марта', title: 'Областная библиотека имени А. С. Пушкина', description: '130 лет со дня образования Восточно-Казахстанской областной библиотеки имени А. С. Пушкина.', year: '1896'},
    {month: 4, date: '12 апреля', title: 'Семён Николаевич Герасимов', description: '125 лет со дня рождения краеведа, учёного и писателя.', year: '1901–1989'},
    {month: 5, date: 'Май · день не указан', title: 'Основание города Риддера', description: '240 лет со дня основания города Риддера.', year: '1786'},
    {month: 6, date: '14 июня', title: 'Александр Мелентьевич Волков', description: '135 лет со дня рождения учёного и детского писателя.', year: '1891–1977'},
    {month: 7, date: '1 июля', title: 'Музей в Риддере', description: '65 лет со дня образования историко-краеведческого музея в городе Риддере.', year: '1961'},
    {month: 8, date: '29 августа', title: 'Закрытие Семипалатинского полигона', description: '35 лет со дня закрытия Семипалатинского ядерного полигона.', year: '1991'},
    {month: 9, date: '26 сентября', title: 'Евгений Петрович Михаэлис', description: '185 лет со дня рождения политического ссыльного, учёного, краеведа, друга Абая.', year: '1841–1913'},
    {month: 10, date: '23 октября', title: 'Преобразование Шемонаихи в город', description: '65 лет со дня преобразования посёлка Шемонаиха в город.', year: '1961'},
    {month: 11, date: 'Ноябрь · день не указан', title: 'Риддерская газета «Жумышы»', description: '95 лет со дня образования газеты.', year: '1931'},
    {month: 12, date: '16 декабря', title: 'Независимость Казахстана', description: '35 лет со дня обретения Казахстаном независимости.', year: '1991'},
    {month: 0, date: 'Дата не указана', title: 'Основание Бухтарминской крепости', description: '265 лет со дня основания Бухтарминской крепости.', year: '1761'}
  ];

  const copy = {
    ru: {months:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],breadcrumb:'Навигационная цепочка',home:'Главная',memory:'Архив памяти',short:'Памятные даты',eyebrow:'ИСТОРИЯ ВОСТОЧНОГО КАЗАХСТАНА',title:'Календарь памятных дат',intro:'События и люди из календаря юбилейных и памятных дат заказчика.',notice:'Выборка из календаря на 2026 год. Указанные годовщины относятся к 2026 году; год события приведён отдельно. Сведения и права на публикацию необходимо подтвердить.',original:'Записи приведены на русском языке; поиск работает по русскому тексту.',search:'Поиск по выборке',placeholder:'Имя, место или событие',month:'Месяц',all:'Все даты',unknown:'Дата не указана',reset:'Сбросить',tag:'Календарь 2026 года',year:'Год или годы в источнике:',recordSource:'Источник записи',status:'Записей в выборке:',outOf:'из',empty:'Ничего не найдено',emptyText:'Попробуйте другое слово или выберите все даты.',sourceLabel:'ИСТОЧНИК',sourceTitle:'Календарь заказчика',sourceText:'Подборка показывает только часть календаря на 2026 год. Исходный документ может быть доступен только участникам репозитория.',open:'Открыть исходный текст',external:' (источник на русском языке, открывается в новой вкладке)',back:'Вернуться в архив памяти'},
    kk: {months:['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'],breadcrumb:'Навигация жолы',home:'Басты бет',memory:'Архив жады',short:'Атаулы күндер',eyebrow:'ШЫҒЫС ҚАЗАҚСТАН ТАРИХЫ',title:'Атаулы күндер күнтізбесі',intro:'Тапсырыс берушінің мерейтойлар мен атаулы күндер күнтізбесіндегі оқиғалар мен тұлғалар.',notice:'2026 жылғы күнтізбеден үзінді. Көрсетілген мерейтойлар 2026 жылға қатысты; оқиға жылы бөлек берілген. Мәліметтер мен жариялау құқықтарын растау қажет.',original:'Жазбалар орыс тілінде берілген; іздеу орысша мәтін бойынша жүргізіледі.',search:'Жазбалардан іздеу',placeholder:'Аты, жері немесе оқиға',month:'Ай',all:'Барлық күндер',unknown:'Күні көрсетілмеген',reset:'Тазалау',tag:'2026 жылғы күнтізбе',year:'Дереккөздегі жыл немесе жылдар:',recordSource:'Жазба дереккөзі',status:'Жазбалар саны:',outOf:'/',empty:'Ештеңе табылмады',emptyText:'Басқа сөз енгізіңіз немесе барлық күндерді таңдаңыз.',sourceLabel:'ДЕРЕККӨЗ',sourceTitle:'Тапсырыс берушінің күнтізбесі',sourceText:'Жинақта 2026 жылғы күнтізбенің бір бөлігі ғана көрсетілген. Бастапқы құжат тек репозиторий қатысушыларына қолжетімді болуы мүмкін.',open:'Бастапқы мәтінді ашу',external:' (дереккөз орыс тілінде, жаңа қойындыда ашылады)',back:'Архив жадына оралу'},
    en: {months:['January','February','March','April','May','June','July','August','September','October','November','December'],breadcrumb:'Breadcrumbs',home:'Home',memory:'Memory archive',short:'Commemorative dates',eyebrow:'HISTORY OF EAST KAZAKHSTAN',title:'Calendar of commemorative dates',intro:'Events and people from the customer-provided calendar of anniversaries and commemorative dates.',notice:'A selection from the 2026 calendar. Anniversaries refer to 2026; the event year is shown separately. Information and publication rights require confirmation.',original:'Entries are shown in Russian; search uses the Russian text.',search:'Search this selection',placeholder:'Name, place or event',month:'Month',all:'All dates',unknown:'Date not specified',reset:'Reset',tag:'2026 calendar',year:'Year or years in the source:',recordSource:'Entry source',status:'Entries in this selection:',outOf:'of',empty:'No results',emptyText:'Try another word or select all dates.',sourceLabel:'SOURCE',sourceTitle:'Customer calendar',sourceText:'The selection shows only part of the 2026 calendar. The original document may be available only to repository members.',open:'Open source text',external:' (source in Russian, opens in a new tab)',back:'Back to memory archive'}
  };

  function card(event, t) {
    return `<article class="calendar-event"><div class="calendar-event-date" lang="ru">${event.date}</div><div class="calendar-event-body"><span class="calendar-event-tag">${t.tag}</span><h2 lang="ru">${event.title}</h2><p lang="ru">${event.description}</p><p class="calendar-event-year">${t.year} <span lang="ru">${event.year}</span></p><a href="${source}" target="_blank" rel="noopener noreferrer">${t.recordSource} <span aria-hidden="true">↗</span><span class="sr-only">${t.external}</span></a></div></article>`;
  }

  window.renderCalendar = function renderCalendar(container, language = 'ru') {
    const t = copy[language] || copy.ru;
    const previousQuery = container.querySelector('#calendar-query')?.value || '';
    const previousMonth = container.querySelector('#calendar-month')?.value || 'all';
    container.innerHTML = `<section class="calendar-page" aria-labelledby="calendar-title"><div class="calendar-shell">
      <nav class="calendar-breadcrumbs" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/memory">${t.memory}</a><span aria-hidden="true">/</span><span aria-current="page">${t.short}</span></nav>
      <div class="calendar-heading"><p class="calendar-eyebrow">${t.eyebrow}</p><h1 id="calendar-title">${t.title}</h1><p>${t.intro}</p></div>
      <div class="calendar-notice" role="note">${t.notice}<br>${t.original}</div>
      <form class="calendar-filters" role="search"><label>${t.search}<input id="calendar-query" type="search" maxlength="150" placeholder="${t.placeholder}" autocomplete="off"></label><label>${t.month}<select id="calendar-month"><option value="all">${t.all}</option>${t.months.map((month, index) => `<option value="${index + 1}">${month}</option>`).join('')}<option value="0">${t.unknown}</option></select></label><button class="calendar-reset" type="reset">${t.reset}</button></form>
      <p class="calendar-status" role="status" aria-live="polite"></p><div class="calendar-events"></div>
      <div class="calendar-source"><div><p class="calendar-eyebrow">${t.sourceLabel}</p><h2>${t.sourceTitle}</h2><p>${t.sourceText}</p></div><a href="${source}" target="_blank" rel="noopener noreferrer">${t.open} <span aria-hidden="true">↗</span><span class="sr-only">${t.external}</span></a></div>
      <a class="calendar-back" href="#/memory">← ${t.back}</a>
    </div></section>`;
    const query = container.querySelector('#calendar-query');
    const month = container.querySelector('#calendar-month');
    const list = container.querySelector('.calendar-events');
    const status = container.querySelector('.calendar-status');
    query.value = previousQuery;
    month.value = previousMonth;
    function renderResults() {
      const term = query.value.trim().toLocaleLowerCase('ru');
      const matches = events.filter(event => (month.value === 'all' || String(event.month) === month.value) && `${event.title} ${event.description} ${event.year}`.toLocaleLowerCase('ru').includes(term));
      status.textContent = `${t.status} ${matches.length} ${t.outOf} ${events.length}`;
      list.innerHTML = matches.length ? matches.map(event => card(event, t)).join('') : `<div class="calendar-empty"><h2>${t.empty}</h2><p>${t.emptyText}</p></div>`;
    }
    query.addEventListener('input', renderResults);
    month.addEventListener('change', renderResults);
    container.querySelector('.calendar-filters').addEventListener('submit', event => event.preventDefault());
    container.querySelector('.calendar-filters').addEventListener('reset', () => { setTimeout(renderResults, 0); });
    renderResults();
  };
}());
