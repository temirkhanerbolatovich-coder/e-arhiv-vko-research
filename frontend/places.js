/* A small example selection from the customer's 2026 anniversary calendar. */
(function () {
  'use strict';

  const places = [
    {
      period: '1901', aliases: 'мариинское училище август Oskemen Öskemen Ust Kamenogorsk',
      ru: ['Усть-Каменогорск', 'В календаре за 2026 год отмечено 125 лет со дня открытия Мариинского женского училища в Усть-Каменогорске. В календаре указан август, без числа.'],
      kk: ['Өскемен', '2026 жылғы күнтізбеде Өскемендегі Мария қыздар училищесінің ашылғанына 125 жыл толғаны көрсетілген. Күнтізбеде тамыз айы берілген, нақты күні көрсетілмеген.'],
      en: ['Ust-Kamenogorsk', 'The 2026 calendar marks 125 years since the Mariinsky Girls’ School opened in Ust-Kamenogorsk. The calendar lists August, without a day.']
    },
    {
      period: '1786 · 1941', aliases: 'февраль',
      ru: ['Риддер', 'Календарь указывает основание города в 1786 году и переименование Риддера в Лениногорск 6 февраля 1941 года.'],
      kk: ['Риддер', 'Күнтізбеде қаланың негізі 1786 жылы қаланғаны және 1941 жылғы 6 ақпанда Риддер атауы Лениногорск болып өзгертілгені көрсетілген.'],
      en: ['Ridder', 'The calendar records the founding of the town in 1786 and the renaming of Ridder to Leninogorsk on 6 February 1941.']
    },
    {
      period: '1941', aliases: 'Алтай Altay Altai январь',
      ru: ['Зыряновск', 'В календаре отмечено преобразование посёлка Зыряновск в город 17 января 1941 года. Название приведено по историческому источнику.'],
      kk: ['Зыряновск', 'Күнтізбеде Зыряновск кентінің 1941 жылғы 17 қаңтарда қала мәртебесін алғаны көрсетілген. Атауы тарихи дереккөз бойынша берілген.'],
      en: ['Zyryanovsk', 'The calendar records that the settlement of Zyryanovsk gained town status on 17 January 1941. Its name follows the historical source.']
    },
    {
      period: '1961', aliases: 'октябрь',
      ru: ['Шемонаиха', 'В календаре отмечено преобразование посёлка Шемонаиха в город 23 октября 1961 года.'],
      kk: ['Шемонаиха', 'Күнтізбеде Шемонаиха кентінің 1961 жылғы 23 қазанда қала мәртебесін алғаны көрсетілген.'],
      en: ['Shemonaikha', 'The calendar records that the settlement of Shemonaikha gained town status on 23 October 1961.']
    }
  ];

  const copy = {
    ru: {breadcrumb:'Навигационная цепочка',home:'Главная',memory:'Архив памяти',places:'Места',eyebrow:'БОЛЬШОЙ АРХИВ ПАМЯТИ',title:'Места в истории',intro:'Знакомьтесь с городами и событиями по материалам архива.',noticeTitle:'Примеры по календарю на 2026 год.',notice:'Это выборка из предоставленного заказчиком документа, а не полный справочник. Сведения и права на публикацию необходимо уточнить.',heading:'Истории мест',hint:'Найдите место по названию и прочитайте его описание.',search:'Найти место',placeholder:'Город или историческое название',count:'Мест в выборке: ',of:' из ',empty:'Ничего не найдено',emptyText:'Попробуйте другое название или очистите строку поиска.',reset:'Очистить поиск',related:'Ещё больше историй',relatedText:'Календарь памятных дат объединяет события и людей региона.',calendar:'К календарю',back:'Вернуться в архив памяти'},
    kk: {breadcrumb:'Навигация жолы',home:'Басты бет',memory:'Жад архиві',places:'Орындар',eyebrow:'ҮЛКЕН ЖАД АРХИВІ',title:'Тарихтағы орындар',intro:'Архив материалдары арқылы қалалармен және оқиғалармен танысыңыз.',noticeTitle:'2026 жылғы күнтізбеден мысалдар.',notice:'Бұл — тапсырыс беруші ұсынған құжаттан алынған іріктеме, толық анықтамалық емес. Мәліметтер мен жариялау құқықтарын нақтылау қажет.',heading:'Орындар тарихы',hint:'Орынды атауы бойынша тауып, сипаттамасын оқыңыз.',search:'Орынды табу',placeholder:'Қала немесе тарихи атау',count:'Іріктемедегі орындар: ',of:' / ',empty:'Ештеңе табылмады',emptyText:'Басқа атауды қолданыңыз немесе іздеу жолын тазалаңыз.',reset:'Іздеуді тазалау',related:'Тағы да тарихтар',relatedText:'Атаулы күндер күнтізбесі өңірдің оқиғалары мен тұлғаларын біріктіреді.',calendar:'Күнтізбеге өту',back:'Жад архивіне оралу'},
    en: {breadcrumb:'Breadcrumbs',home:'Home',memory:'Memory archive',places:'Places',eyebrow:'MEMORY ARCHIVE',title:'Places in history',intro:'Explore towns and events through archive materials.',noticeTitle:'Examples from the 2026 calendar.',notice:'This is a selection from a customer-provided document, not a complete directory. The information and publication rights need confirmation.',heading:'Stories of places',hint:'Find a place by name and read its description.',search:'Find a place',placeholder:'Town or historical name',count:'Places in selection: ',of:' of ',empty:'Nothing found',emptyText:'Try another name or clear your search.',reset:'Clear search',related:'More stories',relatedText:'The calendar of commemorative dates brings together events and people of the region.',calendar:'Open calendar',back:'Back to memory archive'}
  };

  function placeCard(place, locale) {
    const [title, summary] = place[locale];
    return `<article class="places-card"><span class="places-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg></span><div class="places-card-content"><span class="places-period">${place.period}</span><h2>${title}</h2><p>${summary}</p></div></article>`;
  }

  window.renderPlaces = function renderPlaces(container, params, language) {
    const locale = Object.hasOwn(copy, language) ? language : 'ru';
    const t = copy[locale];
    const draft = container.querySelector('#places-query')?.value || '';
    container.innerHTML = `<section class="places-page" aria-labelledby="places-title"><div class="places-shell">
      <nav class="places-breadcrumbs" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/memory">${t.memory}</a><span aria-hidden="true">/</span><span aria-current="page">${t.places}</span></nav>
      <header class="places-heading"><p class="places-eyebrow">${t.eyebrow}</p><h1 id="places-title">${t.title}</h1><p>${t.intro}</p></header>
      <div class="places-notice" role="note"><strong>${t.noticeTitle}</strong> ${t.notice}</div>
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
      const normalize = text => text.trim().toLowerCase().replaceAll('ё', 'е');
      const term = normalize(query.value);
      const found = places.filter(place => normalize([...place.ru, ...place.kk, ...place.en, place.aliases, place.period].join(' ')).includes(term));
      status.textContent = `${t.count}${found.length}${t.of}${places.length}`;
      list.innerHTML = found.length ? found.map(place => placeCard(place, locale)).join('') : `<div class="places-empty"><h2>${t.empty}</h2><p>${t.emptyText}</p><button class="places-reset" type="button">${t.reset}</button></div>`;
      const reset = list.querySelector('.places-reset');
      if (reset) reset.addEventListener('click', () => { query.value = ''; update(); query.focus(); });
    }
    query.addEventListener('input', update);
    update();
  };
}());
