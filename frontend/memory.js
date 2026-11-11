/* Исторические сведения приведены по предоставленному заказчиком документу. */
(function () {
  'use strict';

  const sourceUrl = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/docs/data/customer/2026-11-10/originals/' + encodeURIComponent('История архива.docx');
  const topics = [
    { id: 'all', label: 'Все события' },
    { id: 'foundation', label: 'Создание' },
    { id: 'renaming', label: 'Переименования' },
    { id: 'management', label: 'Управление' },
    { id: 'branches', label: 'Филиалы' }
  ];
  const events = [
    { year: 1940, topic: 'foundation', tag: 'Создание', title: 'Образован государственный архив области', summary: 'Начало работы Государственного архива Восточно-Казахстанской области.', detail: 'В документе об истории архива указано, что учреждение образовано в 1940 году с подчинением архивному отделению управления НКВД Казахской ССР по Восточно-Казахстанской области.' },
    { year: 2019, topic: 'renaming', tag: 'Переименование', title: 'Зыряновский филиал стал филиалом Алтай', summary: 'Переименование связано с изменением названий района и города.', detail: 'Согласно предоставленной исторической справке, после переименования Зыряновского района и города филиал 11 февраля 2019 года прошёл перерегистрацию и стал именоваться филиалом Алтай.' },
    { year: 2020, topic: 'management', tag: 'Управление', title: 'Создано управление цифровизации и архивов', summary: 'Архив перешёл в подчинение профильному управлению области.', detail: 'В исторической справке указано, что управление цифровизации и архивов ВКО создано постановлением от 11 июня 2020 года № 188; в его подчинение перешёл государственный архив области.' },
    { year: 2022, topic: 'branches', tag: 'Филиалы', title: 'Изменение подчинённости двух филиалов', summary: 'Аягозский и Жарминский филиалы вошли в систему архивов области Абай.', detail: 'По исторической справке заказчика, после образования области Абай Аягозский и Жарминский филиалы перешли в подчинение Центра документации новейшей истории области Абай.' }
  ];
  const images = [
    { file: 'assets/history-flood.jpg', title: 'Историческая фотография 01' },
    { file: 'assets/history-street.jpg', title: 'Историческая фотография 02' },
    { file: 'assets/history-wharf.jpg', title: 'Историческая фотография 03' }
  ];


  const copy = {
    ru: {breadcrumb:'Навигационная цепочка',home:'Главная',memory:'Архив памяти',eyebrow:'ИСТОРИЯ ВОСТОЧНОГО КАЗАХСТАНА',title:'Большой архив памяти',intro:'Изучайте историю архива через события и документы.',about:'Об архиве',notice:'События приведены по исторической справке, предоставленной заказчиком. Сведения для публикации необходимо подтвердить.',original:'Исторические сведения и имена приведены на русском языке по материалам заказчика.',history:'ИСТОРИЯ АРХИВА',timeline:'Хронология событий',source:'Открыть источник',topic:'Тема событий',topicNames:['Все события','Создание','Переименования','Управление','Филиалы'],yearFilter:'Фильтр по годам',period:'Период',from:'С',to:'по',reset:'Сбросить',year:'Выбрать год',more:'Подробнее',sourceDocument:'История архива: исходный документ',invalid:'Проверьте период: начальный год должен быть не больше конечного; допустимы годы от 1000 до 2100.',one:'Показано 1 событие',count:'Показано событий: ',empty:'Событий не найдено',emptyText:'Попробуйте изменить тему или выбрать другой период.',photos:'ФОТОМАТЕРИАЛЫ',photoTitle:'История в фотографиях',photoIntro:'Примеры изображений из дизайн-макета. Они не привязаны к событиям хронологии.',exhibition:'К выставке',photoAlt:'Историческая фотография из дизайн-макета; атрибуция уточняется',demo:'Демо',photo:'Историческая фотография',photoNote:'Фото из макета · происхождение и права уточняются',anniversaries:'ПАМЯТНЫЕ ДАТЫ',people:'Люди в истории',peopleText:'Карточки по календарю памятных дат, предоставленному заказчиком. Данные необходимо проверить перед публикацией.',calendar:'Календарь памятных дат',places:'Места в истории',peopleNav:'Карточки людей',find:'Ищете конкретный материал?',findText:'Откройте демонстрационный каталог или задайте вопрос на главной.',catalog:'Открыть каталог',ask:'Спросить архив'},
    kk: {breadcrumb:'Навигация жолы',home:'Басты бет',memory:'Жад архиві',eyebrow:'ШЫҒЫС ҚАЗАҚСТАН ТАРИХЫ',title:'Үлкен жад архиві',intro:'Архив тарихын оқиғалар мен құжаттар арқылы зерттеңіз.',about:'Архив туралы',notice:'Оқиғалар тапсырыс беруші ұсынған тарихи анықтамадан алынған. Жариялау алдында мәліметтерді растау қажет.',original:'Тарихи мәліметтер мен есімдер тапсырыс берушінің материалдары бойынша орыс тілінде берілген.',history:'АРХИВ ТАРИХЫ',timeline:'Оқиғалар хронологиясы',source:'Дереккөзді ашу',topic:'Оқиғалар тақырыбы',topicNames:['Барлық оқиғалар','Құрылуы','Атау өзгерістері','Басқару','Филиалдар'],yearFilter:'Жылдар бойынша сүзгі',period:'Кезең',from:'Бастап',to:'Дейін',reset:'Тазалау',year:'Жылды таңдау',more:'Толығырақ',sourceDocument:'Архив тарихы: бастапқы құжат',invalid:'Кезеңді тексеріңіз: бастапқы жыл соңғы жылдан аспауы тиіс; 1000–2100 жылдар аралығы рұқсат етіледі.',one:'1 оқиға көрсетілген',count:'Көрсетілген оқиғалар: ',empty:'Оқиғалар табылмады',emptyText:'Тақырыпты немесе кезеңді өзгертіп көріңіз.',photos:'ФОТОМАТЕРИАЛДАР',photoTitle:'Фотосуреттердегі тарих',photoIntro:'Дизайн макетіндегі сурет мысалдары. Олар хронология оқиғаларына байланыстырылмаған.',exhibition:'Көрмеге өту',photoAlt:'Дизайн макетіндегі тарихи фотосурет; авторлығы нақтылануда',demo:'Демо',photo:'Тарихи фотосурет',photoNote:'Макеттегі фото · шығу тегі мен құқықтары нақтылануда',anniversaries:'АТАУЛЫ КҮНДЕР',people:'Тарихтағы тұлғалар',peopleText:'Карточкалар тапсырыс беруші ұсынған атаулы күндер күнтізбесіне негізделген. Жариялау алдында деректерді тексеру қажет.',calendar:'Атаулы күндер күнтізбесі',places:'Тарихтағы орындар',peopleNav:'Тұлғалар карточкалары',find:'Нақты материал іздеп жүрсіз бе?',findText:'Демонстрациялық каталогты ашыңыз немесе басты бетте сұрақ қойыңыз.',catalog:'Каталогты ашу',ask:'Архивтен сұрау'},
    en: {breadcrumb:'Breadcrumbs',home:'Home',memory:'Memory archive',eyebrow:'HISTORY OF EAST KAZAKHSTAN',title:'Memory archive',intro:'Explore the archive’s history through events and documents.',about:'About the archive',notice:'Events are drawn from the historical account supplied by the customer. Information needs confirmation before publication.',original:'Historical information and names are shown in Russian from the customer’s materials.',history:'ARCHIVE HISTORY',timeline:'Timeline of events',source:'Open source',topic:'Event topic',topicNames:['All events','Foundation','Renaming','Management','Branches'],yearFilter:'Filter by year',period:'Period',from:'From',to:'To',reset:'Reset',year:'Select year',more:'Read more',sourceDocument:'Archive history: original document',invalid:'Check the period: the first year must not exceed the final year; years from 1000 to 2100 are allowed.',one:'1 event shown',count:'Events shown: ',empty:'No events found',emptyText:'Try another topic or period.',photos:'PHOTOGRAPHS',photoTitle:'History in photographs',photoIntro:'Example images from the design mockup. They are not linked to timeline events.',exhibition:'Open exhibition',photoAlt:'Historical photograph from the design mockup; attribution needs confirmation',demo:'Demo',photo:'Historical photograph',photoNote:'Mockup photo · origin and rights need confirmation',anniversaries:'COMMEMORATIVE DATES',people:'People in history',peopleText:'Cards use the customer’s calendar of commemorative dates. Information needs checking before publication.',calendar:'Calendar of commemorative dates',places:'Places in history',peopleNav:'People cards',find:'Looking for a particular item?',findText:'Open the demonstration catalogue or ask a question on the home page.',catalog:'Open catalogue',ask:'Ask the archive'}
  };

  function eventCard(event, t) {
    return `<article class="memory-event"><div class="memory-event-time"><span class="memory-event-dot" aria-hidden="true"></span><span class="memory-event-year">${event.year}</span></div>
      <div class="memory-event-card"><div class="memory-event-meta"><span class="memory-tag">${event.year}</span><span lang="ru">${event.tag}</span></div><h3 lang="ru">${event.title}</h3><p lang="ru">${event.summary}</p>
      <details class="memory-details"><summary>${t.more} <span aria-hidden="true">↓</span></summary><p lang="ru">${event.detail}</p><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${t.sourceDocument} <span aria-hidden="true">↗</span></a></details></div></article>`;
  }

  let renderedQuery = null;
  function renderMemory(container, params, language = 'ru') {
    if (!container) return;
    const t = copy[language] || copy.ru;
    const queryKey = params instanceof URLSearchParams ? params.toString() : '';
    const keepDraft = renderedQuery === queryKey && !!container.querySelector('.memory-page');
    const draft = {from:keepDraft ? container.querySelector('#memory-year-from').value : '',to:keepDraft ? container.querySelector('#memory-year-to').value : '',topic:keepDraft ? container.querySelector('[data-memory-topic][aria-pressed=true]')?.dataset.memoryTopic : null};
    const selected = draft.topic || (params instanceof URLSearchParams ? params.get('topic') : null);
    renderedQuery = queryKey;
    let topic = topics.some(item => item.id === selected) ? selected : 'all';
    container.innerHTML = `<section class="memory-page" aria-labelledby="memory-title"><div class="memory-container">
      <nav class="memory-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.memory}</span></nav>
      <div class="memory-heading"><div><p class="memory-eyebrow">${t.eyebrow}</p><h1 id="memory-title">${t.title}</h1><p>${t.intro}</p></div><a class="memory-outline-link" href="#/section/about">${t.about} <span aria-hidden="true">↗</span></a></div>
      <div class="memory-notice" role="note"><span aria-hidden="true">i</span><p>${t.notice} ${t.original}</p></div>
      <section aria-labelledby="memory-timeline-title" class="memory-timeline"><div class="memory-title-row"><div><p class="memory-eyebrow">${t.history}</p><h2 id="memory-timeline-title">${t.timeline}</h2></div><a class="memory-source" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${t.source} <span aria-hidden="true">↗</span></a></div>
      <div class="memory-filters" role="group" aria-label="${t.topic}">${topics.map((item,index)=>`<button type="button" class="memory-chip" data-memory-topic="${item.id}" aria-pressed="${topic === item.id}">${t.topicNames[index]}</button>`).join('')}</div>
      <form class="memory-period" aria-label="${t.yearFilter}"><span>${t.period}</span><label>${t.from} <input id="memory-year-from" type="number" min="1000" max="2100" inputmode="numeric" placeholder="1940"></label><span aria-hidden="true">—</span><label>${t.to} <input id="memory-year-to" type="number" min="1000" max="2100" inputmode="numeric" placeholder="2022"></label><button class="memory-reset" type="button">${t.reset}</button></form>
      <div class="memory-year-line" aria-label="${t.year}">${events.map(item=>`<button type="button" class="memory-year-button" data-memory-year="${item.year}"><span>${item.year}</span><i aria-hidden="true"></i></button>`).join('')}</div>
      <p class="memory-result" role="status" aria-live="polite"></p><div class="memory-events"></div></section>
      <section class="memory-photos" aria-labelledby="memory-photos-title"><div class="memory-title-row"><div><p class="memory-eyebrow">${t.photos}</p><h2 id="memory-photos-title">${t.photoTitle}</h2><p>${t.photoIntro}</p></div><a class="memory-source" href="#/exhibition">${t.exhibition} <span aria-hidden="true">→</span></a></div><div class="memory-photo-grid">${images.map((item,index)=>`<figure class="memory-photo"><img src="${item.file}" alt="${t.photoAlt}" loading="lazy"><figcaption><span class="memory-tag">${t.demo}</span><h3>${t.photo} ${String(index+1).padStart(2,'0')}</h3><p>${t.photoNote}</p></figcaption></figure>`).join('')}</div></section>
      <section class="memory-people" aria-labelledby="memory-people-title"><div><p class="memory-eyebrow">${t.anniversaries}</p><h2 id="memory-people-title">${t.people}</h2><p>${t.peopleText}</p><p><a class="memory-source" href="#/calendar">${t.calendar} →</a></p><p><a class="memory-source" href="#/places">${t.places} →</a></p></div><nav aria-label="${t.peopleNav}"><a href="#/person?person=abai"><span lang="ru">Абай Кунанбаев</span><span aria-hidden="true">→</span></a><a href="#/person?person=varep"><span lang="ru">Иван Вареп</span><span aria-hidden="true">→</span></a><a href="#/person?person=turov"><span lang="ru">Фёдор Туров</span><span aria-hidden="true">→</span></a></nav></section>
      <div class="memory-bottom"><div><p class="memory-bottom-title">${t.find}</p><p>${t.findText}</p></div><div class="memory-bottom-actions"><a href="#/catalog">${t.catalog}</a><a href="#/ask">${t.ask}</a></div></div></div></section>`;
    const list = container.querySelector('.memory-events');
    const result = container.querySelector('.memory-result');
    const from = container.querySelector('#memory-year-from');
    const to = container.querySelector('#memory-year-to');
    from.value = draft.from;
    to.value = draft.to;
    const topicButtons = [...container.querySelectorAll('[data-memory-topic]')];
    const yearButtons = [...container.querySelectorAll('[data-memory-year]')];
    function update() {
      const min = from.value ? Number(from.value) : null;
      const max = to.value ? Number(to.value) : null;
      const isInvalid = !from.validity.valid || !to.validity.valid || (min !== null && max !== null && min > max);
      from.setAttribute('aria-invalid', String(isInvalid));
      to.setAttribute('aria-invalid', String(isInvalid));
      const visible = isInvalid ? [] : events.filter(item => (topic === 'all' || topic === item.topic) && (min === null || item.year >= min) && (max === null || item.year <= max));
      topicButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.memoryTopic === topic)));
      yearButtons.forEach(button => button.classList.toggle('is-selected', min !== null && min === max && Number(button.dataset.memoryYear) === min));
      if (isInvalid) { result.textContent = t.invalid; list.innerHTML = ''; }
      else { result.textContent = visible.length === 1 ? t.one : t.count + visible.length; list.innerHTML = visible.length ? visible.map(event=>eventCard(event,t)).join('') : `<div class="memory-empty"><h3>${t.empty}</h3><p>${t.emptyText}</p></div>`; }
    }
    topicButtons.forEach(button => button.addEventListener('click', () => { topic = button.dataset.memoryTopic; update(); }));
    yearButtons.forEach(button => button.addEventListener('click', () => { from.value = button.dataset.memoryYear; to.value = button.dataset.memoryYear; topic = 'all'; update(); }));
    from.addEventListener('input', update);
    to.addEventListener('input', update);
    container.querySelector('.memory-period').addEventListener('submit', event => event.preventDefault());
    container.querySelector('.memory-reset').addEventListener('click', () => { from.value = ''; to.value = ''; topic = 'all'; update(); });
    update();
  }
  window.renderMemory = renderMemory;
})();
