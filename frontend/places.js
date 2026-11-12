/* A small example selection from the customer's 2026 anniversary calendar. */
(function () {
  'use strict';

  const source = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/docs/data/customer/2026-11-10/extracted-text/' + encodeURIComponent('Календарь памятных дат — календарь 2026 год каз рус.md');
  const places = [
    {title: 'Усть-Каменогорск', period: '1901', summary: 'В календаре за 2026 год отмечено 125 лет со дня открытия Мариинского женского училища в Усть-Каменогорске. В календаре указан август, без числа.', search: 'усть-каменогорск мариинское училище август 1901'},
    {title: 'Риддер', period: '1786 · 1941', summary: 'Календарь указывает основание города в 1786 году и переименование Риддера в Лениногорск 6 февраля 1941 года.', search: 'риддер лениногорск 1786 1941 февраль'},
    {title: 'Зыряновск', period: '1941', summary: 'В календаре отмечено преобразование посёлка Зыряновск в город 17 января 1941 года. Название приведено по историческому источнику.', search: 'зыряновск алтай 1941 январь'},
    {title: 'Шемонаиха', period: '1961', summary: 'В календаре отмечено преобразование посёлка Шемонаиха в город 23 октября 1961 года.', search: 'шемонаиха 1961 октябрь'}
  ];

  const copy = {
    ru: {breadcrumb:'Навигационная цепочка',home:'Главная',memory:'Архив памяти',places:'Места',eyebrow:'БОЛЬШОЙ АРХИВ ПАМЯТИ',title:'Места в истории',intro:'Знакомьтесь с городами и событиями по материалам архива.',noticeTitle:'Примеры по календарю на 2026 год.',notice:'Это выборка из предоставленного заказчиком документа, а не полный справочник. Сведения и права на публикацию необходимо уточнить.',language:'Названия и описания приведены на русском языке по материалам источника. Поиск выполняется по русскому тексту.',heading:'Истории мест',hint:'Найдите место по названию и прочитайте его описание.',search:'Найти место',placeholder:'Город или историческое название',count:'Мест в выборке: ',of:' из ',empty:'Ничего не найдено',emptyText:'Попробуйте другое название или очистите строку поиска.',reset:'Очистить поиск',source:'Открыть источник',external:' (новая вкладка; источник на русском языке)',related:'Ещё больше историй',relatedText:'Календарь памятных дат объединяет события и людей региона.',calendar:'К календарю',back:'Вернуться в архив памяти'},
    kk: {breadcrumb:'Навигация жолы',home:'Басты бет',memory:'Жад архиві',places:'Орындар',eyebrow:'ҮЛКЕН ЖАД АРХИВІ',title:'Тарихтағы орындар',intro:'Архив материалдары арқылы қалалармен және оқиғалармен танысыңыз.',noticeTitle:'2026 жылғы күнтізбеден мысалдар.',notice:'Бұл — тапсырыс беруші ұсынған құжаттан алынған іріктеме, толық анықтамалық емес. Мәліметтер мен жариялау құқықтарын нақтылау қажет.',language:'Атаулар мен сипаттамалар дереккөз материалдары бойынша орыс тілінде берілген. Іздеу орыс тіліндегі мәтін бойынша жүргізіледі.',heading:'Орындар тарихы',hint:'Орынды атауы бойынша тауып, сипаттамасын оқыңыз.',search:'Орынды табу',placeholder:'Қала немесе тарихи атау',count:'Іріктемедегі орындар: ',of:' / ',empty:'Ештеңе табылмады',emptyText:'Басқа атауды қолданыңыз немесе іздеу жолын тазалаңыз.',reset:'Іздеуді тазалау',source:'Дереккөзді ашу',external:' (жаңа қойынды; дереккөз орыс тілінде)',related:'Тағы да тарихтар',relatedText:'Атаулы күндер күнтізбесі өңірдің оқиғалары мен тұлғаларын біріктіреді.',calendar:'Күнтізбеге өту',back:'Жад архивіне оралу'},
    en: {breadcrumb:'Breadcrumbs',home:'Home',memory:'Memory archive',places:'Places',eyebrow:'MEMORY ARCHIVE',title:'Places in history',intro:'Explore towns and events through archive materials.',noticeTitle:'Examples from the 2026 calendar.',notice:'This is a selection from a customer-provided document, not a complete directory. The information and publication rights need confirmation.',language:'Names and descriptions are shown in Russian as supplied in the source. Search uses Russian text.',heading:'Stories of places',hint:'Find a place by name and read its description.',search:'Find a place',placeholder:'Town or historical name',count:'Places in selection: ',of:' of ',empty:'Nothing found',emptyText:'Try another name or clear your search.',reset:'Clear search',source:'Open source',external:' (new tab; source in Russian)',related:'More stories',relatedText:'The calendar of commemorative dates brings together events and people of the region.',calendar:'Open calendar',back:'Back to memory archive'}
  };

  function placeCard(place, t) {
    return `<article class="places-card"><span class="places-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg></span><div class="places-card-content"><span class="places-period">${place.period}</span><h2 lang="ru">${place.title}</h2><p lang="ru">${place.summary}</p><a href="${source}" target="_blank" rel="noopener noreferrer">${t.source} <span aria-hidden="true">↗</span><span class="sr-only">${t.external}</span></a></div></article>`;
  }

  window.renderPlaces = function renderPlaces(container, params, language) {
    const t = copy[language] || copy.ru;
    const draft = container.querySelector('#places-query')?.value || '';
    container.innerHTML = `<section class="places-page" aria-labelledby="places-title"><div class="places-shell">
      <nav class="places-breadcrumbs" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/memory">${t.memory}</a><span aria-hidden="true">/</span><span aria-current="page">${t.places}</span></nav>
      <header class="places-heading"><p class="places-eyebrow">${t.eyebrow}</p><h1 id="places-title">${t.title}</h1><p>${t.intro}</p></header>
      <div class="places-notice" role="note"><strong>${t.noticeTitle}</strong> ${t.notice}</div>
      <p class="places-language-note">${t.language}</p>
      <div class="places-toolbar"><div><h2>${t.heading}</h2><p>${t.hint}</p></div><label class="places-search"><span>${t.search}</span><input type="search" id="places-query" maxlength="150" autocomplete="off" placeholder="${t.placeholder}"></label></div>
      <p class="places-status" role="status" aria-live="polite"></p><div class="places-list"></div>
      <div class="places-related"><div><h2>${t.related}</h2><p>${t.relatedText}</p></div><a href="#/calendar">${t.calendar} <span aria-hidden="true">→</span></a></div>
      <a class="places-back" href="#/memory">← ${t.back}</a>
    </div></section>`;

    const query = container.querySelector('#places-query');
    query.value = draft;
    const list = container.querySelector('.places-list');
    const status = container.querySelector('.places-status');
    function update() {
      const term = query.value.trim().toLocaleLowerCase('ru').replace(/ё/g, 'е');
      const found = places.filter(place => `${place.title} ${place.summary} ${place.search}`.toLocaleLowerCase('ru').replace(/ё/g, 'е').includes(term));
      status.textContent = `${t.count}${found.length}${t.of}${places.length}`;
      list.innerHTML = found.length ? found.map(place => placeCard(place, t)).join('') : `<div class="places-empty"><h2>${t.empty}</h2><p>${t.emptyText}</p><button class="places-reset" type="button">${t.reset}</button></div>`;
      const reset = list.querySelector('.places-reset');
      if (reset) reset.addEventListener('click', () => { query.value = ''; update(); query.focus(); });
    }
    query.addEventListener('input', update);
    update();
  };
}());
