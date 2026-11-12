/* Demonstration cards use only the facts in the customer's 2025 anniversary calendar. */
(function () {
  'use strict';

  const people = [
    { id: 'abai', name: 'Абай Кунанбаев', date: '10 августа 1845 года', description: 'Поэт-просветитель. В календаре памятных дат Восточно-Казахстанской области на 2025 год отмечено 180 лет со дня его рождения.' },
    { id: 'varep', name: 'Иван Иосифович Вареп', date: '1 мая 1910 года', description: 'Герой Советского Союза. В календаре памятных дат Восточно-Казахстанской области на 2025 год отмечено 115 лет со дня его рождения.' },
    { id: 'turov', name: 'Фёдор Дементьевич Туров', date: '15 мая 1910 года', description: 'Герой Советского Союза. В календаре памятных дат Восточно-Казахстанской области на 2025 год отмечено 115 лет со дня его рождения.' }
  ];

  function personLink(person) {
    return '#/person?person=' + encodeURIComponent(person.id);
  }


  const copy = {
    ru: {home:'Главная',memory:'Архив памяти',breadcrumb:'Навигационная цепочка',people:'Люди и события',notice:'Демонстрационная подборка. Сведения из материалов заказчика следует проверить перед публикацией.',original:'Имена, даты и описания приведены на русском языке по материалам заказчика.',noPortrait:'Портрет не предоставлен',portraitNote:'Фотоматериалы и права на них уточняются',card:'Карточка',of:'из',anniversaries:'Памятные даты',birth:'Дата рождения',source:'Источник',sourceText:'Календарь памятных дат Восточно-Казахстанской области на 2025 год, предоставленный заказчиком.',audio:'Аудиоэкскурсия пока не подключена.',previous:'Предыдущий',next:'Следующий',peopleNav:'Карточки людей',back:'Вернуться в архив памяти',missing:'Карточка не найдена',missingText:'Выберите человека в архиве памяти.'},
    kk: {home:'Басты бет',memory:'Жад архиві',breadcrumb:'Навигация жолы',people:'Тұлғалар мен оқиғалар',notice:'Демонстрациялық іріктеме. Тапсырыс беруші материалдарындағы мәліметтерді жариялау алдында тексеру қажет.',original:'Есімдер, күндер мен сипаттамалар тапсырыс берушінің материалдары бойынша орыс тілінде берілген.',noPortrait:'Портрет ұсынылмаған',portraitNote:'Фотоматериалдар мен оларға құқықтар нақтылануда',card:'Карточка',of:'/',anniversaries:'Атаулы күндер',birth:'Туған күні',source:'Дереккөз',sourceText:'Тапсырыс беруші ұсынған Шығыс Қазақстан облысының 2025 жылға арналған атаулы күндер күнтізбесі.',audio:'Аудиоэкскурсия әлі қосылмаған.',previous:'Алдыңғы',next:'Келесі',peopleNav:'Тұлғалар карточкалары',back:'Жад архивіне оралу',missing:'Карточка табылмады',missingText:'Жад архивінен тұлғаны таңдаңыз.'},
    en: {home:'Home',memory:'Memory archive',breadcrumb:'Breadcrumbs',people:'People and events',notice:'Demonstration selection. Information from the customer’s materials should be checked before publication.',original:'Names, dates and descriptions are shown in Russian from the customer’s materials.',noPortrait:'Portrait not provided',portraitNote:'Photographs and their rights need confirmation',card:'Card',of:'of',anniversaries:'Commemorative dates',birth:'Date of birth',source:'Source',sourceText:'The 2025 calendar of commemorative dates for East Kazakhstan, supplied by the customer.',audio:'The audio tour is not connected yet.',previous:'Previous',next:'Next',peopleNav:'People cards',back:'Back to memory archive',missing:'Card not found',missingText:'Choose a person in the memory archive.'}
  };
  window.renderPerson = function renderPerson(container, params, language = 'ru') {
    const t = copy[language] || copy.ru;
    const selected = params instanceof URLSearchParams ? params.get('person') : '';
    const index = selected ? people.findIndex(person => person.id === selected) : 0;
    if (index < 0) {
      container.innerHTML = `<section class="person-page"><div class="person-shell"><h1>${t.missing}</h1><p>${t.missingText}</p><a class="person-back" href="#/memory">← ${t.back}</a></div></section>`;
      return;
    }
    const person = people[index];
    const previous = index > 0 ? `<a class="person-nav-button" href="${personLink(people[index - 1])}">← ${t.previous}</a>` : `<span class="person-nav-button is-disabled" aria-disabled="true">← ${t.previous}</span>`;
    const next = index < people.length - 1 ? `<a class="person-nav-button person-nav-next" href="${personLink(people[index + 1])}">${t.next} →</a>` : `<span class="person-nav-button is-disabled" aria-disabled="true">${t.next} →</span>`;
    container.innerHTML = `<section class="person-page" aria-labelledby="person-title"><div class="person-shell">
      <nav class="person-breadcrumbs" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/memory">${t.memory}</a><span aria-hidden="true">/</span><span aria-current="page">${t.people}</span></nav>
      <div class="person-notice" role="note">${t.notice} ${t.original}</div>
      <div class="person-grid"><div class="person-visual" role="img" aria-label="${t.noPortrait}"><div class="person-visual-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="17" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 39c1.5-7 6.6-11 14-11s12.5 4 14 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div><p>${t.noPortrait}</p><span>${t.portraitNote}</span></div>
      <article class="person-info"><div class="person-tags"><span>${t.card} ${index + 1} ${t.of} ${people.length}</span><span>${t.anniversaries}</span></div><h1 id="person-title" lang="ru">${person.name}</h1><p class="person-description" lang="ru">${person.description}</p><dl class="person-facts"><div><dt>${t.birth}</dt><dd lang="ru">${person.date}</dd></div></dl>
      <div class="person-source"><strong>${t.source}</strong><p>${t.sourceText}</p></div><p class="person-audio-note">${t.audio}</p><nav class="person-navigation" aria-label="${t.peopleNav}">${previous}<span>${index + 1} / ${people.length}</span>${next}</nav></article></div><a class="person-back" href="#/memory">← ${t.back}</a></div></section>`;
  };
}());
