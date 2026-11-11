/* Local catalogue preview based on two source-backed demonstration records. */
(function () {
  'use strict';

  const translations = {
    "ru": {
      "home": "Главная",
      "catalog": "Каталог",
      "breadcrumbs": "Навигационная цепочка",
      "eyebrow": "ЭЛЕКТРОННЫЙ АРХИВ",
      "heading": "Электронный каталог",
      "lead": "Ищите фонды и архивные материалы по названию или номеру.",
      "ask": "Спросить архив",
      "demo": "Демонстрационная версия.",
      "demoText": "В каталоге показаны фонд из выгрузки 2018 года и архивная ссылка из публикации о Лениногорске.",
      "personal": "Личные фонды",
      "searchLabel": "Поиск в каталоге",
      "placeholder": "Название фонда или архивный шифр",
      "find": "Найти",
      "filters": "Фильтры каталога",
      "type": "Тип материала",
      "allMaterials": "Все материалы",
      "fonds": "Фонды",
      "documents": "Документы",
      "photos": "Фотографии",
      "period": "Период",
      "allPeriods": "Все периоды",
      "before": "До 1926 года",
      "after": "После 2000 года",
      "clearFilters": "Сбросить фильтры",
      "referenceSearch": "Поиск по архивному шифру",
      "fond": "Фонд",
      "inventory": "Опись",
      "case": "Дело",
      "exampleFund": "Например, 261",
      "exampleInventory": "Например, 1",
      "exampleCase": "Например, 248",
      "combine": "Поля можно сочетать с названием, типом материала и периодом.",
      "apply": "Применить",
      "sort": "Сортировка",
      "titleAsc": "Название: А–Я",
      "titleDesc": "Название: Я–А",
      "yearAsc": "Начало периода: сначала ранние",
      "yearDesc": "Начало периода: сначала поздние",
      "pageSize": "Записей на странице",
      "results": "Результаты поиска",
      "pages": "Страницы результатов",
      "previous": "Назад",
      "next": "Далее",
      "helpTitle": "Не знаете, с чего начать?",
      "helpText": "Задайте вопрос помощнику архива или узнайте,",
      "cipherHelp": "как читать архивный шифр",
      "kind": "Архивный фонд",
      "recordSummary": "Историческое название из перечня фондов. Даты названия:",
      "originalLanguage": "Название и шифр приведены на языке источника — русском.",
      "exportNote": "Выгрузка 2018 года · сведения требуют проверки",
      "more": "Подробнее",
      "less": "Свернуть",
      "aboutFond": "О фонде",
      "fondNumber": "Номер фонда",
      "fondPeriod": "Период фонда",
      "accordingExport": "по данным выгрузки",
      "nameDates": "Название действовало",
      "asSource": "как указано в источнике",
      "digitalCopy": "Цифровая копия",
      "unknown": "Сведения не предоставлены",
      "recordNote": "Это одна строка исторической выгрузки за 2018 год. Наличие документов, цифровых копий и актуальность сведений не подтверждены.",
      "openFond": "Открыть карточку фонда",
      "openSource": "Открыть исходную таблицу на GitHub",
      "noResults": "Записей не найдено",
      "emptyTitle": "Ничего не найдено",
      "emptyHint": "Попробуйте другое название, номер фонда или измените фильтры.",
      "resetSearch": "Сбросить поиск",
      "countPrefix": "Найдено записей: ",
      "pagePrefix": "Страница ",
      "pageOf": " из "
    },
    "kk": {
      "home": "Басты бет",
      "catalog": "Каталог",
      "breadcrumbs": "Навигация тізбегі",
      "eyebrow": "ЭЛЕКТРОНДЫҚ АРХИВ",
      "heading": "Электрондық каталог",
      "lead": "Қорлар мен архив материалдарын атауы немесе нөмірі бойынша іздеңіз.",
      "ask": "Архивтен сұрау",
      "demo": "Демонстрациялық нұсқа.",
      "demoText": "Каталогта 2018 жылғы деректерден алынған қор және Лениногорск туралы жарияланымдағы архивтік сілтеме көрсетілген.",
      "personal": "Жеке тектік қорлар",
      "searchLabel": "Каталогтан іздеу",
      "placeholder": "Қор атауы немесе архивтік шифр",
      "find": "Табу",
      "filters": "Каталог сүзгілері",
      "type": "Материал түрі",
      "allMaterials": "Барлық материалдар",
      "fonds": "Қорлар",
      "documents": "Құжаттар",
      "photos": "Фотосуреттер",
      "period": "Кезең",
      "allPeriods": "Барлық кезеңдер",
      "before": "1926 жылға дейін",
      "after": "2000 жылдан кейін",
      "clearFilters": "Сүзгілерді тазалау",
      "referenceSearch": "Архивтік шифр бойынша іздеу",
      "fond": "Қор",
      "inventory": "Тізімдеме",
      "case": "Іс",
      "exampleFund": "Мысалы, 261",
      "exampleInventory": "Мысалы, 1",
      "exampleCase": "Мысалы, 248",
      "combine": "Өрістерді атаумен, материал түрімен және кезеңмен бірге қолдануға болады.",
      "apply": "Қолдану",
      "sort": "Сұрыптау",
      "titleAsc": "Атауы: А–Я",
      "titleDesc": "Атауы: Я–А",
      "yearAsc": "Кезеңнің басталуы: алдымен ертерек",
      "yearDesc": "Кезеңнің басталуы: алдымен кейінгі",
      "pageSize": "Беттегі жазбалар саны",
      "results": "Іздеу нәтижелері",
      "pages": "Нәтижелер беттері",
      "previous": "Артқа",
      "next": "Келесі",
      "helpTitle": "Неден бастау керегін білмейсіз бе?",
      "helpText": "Архив көмекшісіне сұрақ қойыңыз немесе",
      "cipherHelp": "архивтік шифр туралы анықтаманы оқыңыз",
      "kind": "Архив қоры",
      "recordSummary": "Қорлар тізіміндегі тарихи атау. Атаудың қолданылған кезеңі:",
      "originalLanguage": "Атау мен шифр дереккөздің орыс тілінде берілген.",
      "exportNote": "2018 жылғы деректер · мәліметтер тексеруді қажет етеді",
      "more": "Толығырақ",
      "less": "Жию",
      "aboutFond": "Қор туралы",
      "fondNumber": "Қор нөмірі",
      "fondPeriod": "Қор кезеңі",
      "accordingExport": "деректер бойынша",
      "nameDates": "Атаудың қолданылған кезеңі",
      "asSource": "дереккөзде көрсетілгендей",
      "digitalCopy": "Цифрлық көшірме",
      "unknown": "Мәліметтер ұсынылмаған",
      "recordNote": "Бұл — 2018 жылғы тарихи деректердің бір жазбасы. Құжаттардың, цифрлық көшірмелердің болуы және мәліметтердің өзектілігі расталмаған.",
      "openFond": "Қор карточкасын ашу",
      "openSource": "GitHub-та бастапқы кестені ашу",
      "noResults": "Жазбалар табылмады",
      "emptyTitle": "Ештеңе табылмады",
      "emptyHint": "Басқа атауды, қор нөмірін қолданып көріңіз немесе сүзгілерді өзгертіңіз.",
      "resetSearch": "Іздеуді тазалау",
      "countPrefix": "Табылған жазбалар: ",
      "pagePrefix": "Бет ",
      "pageOf": " / "
    },
    "en": {
      "home": "Home",
      "catalog": "Catalogue",
      "breadcrumbs": "Breadcrumbs",
      "eyebrow": "ELECTRONIC ARCHIVE",
      "heading": "Electronic catalogue",
      "lead": "Search fonds and archive materials by title or number.",
      "ask": "Ask the archive",
      "demo": "Demonstration version.",
      "demoText": "The catalogue contains a fond from the 2018 export and an archival reference from a publication about Leninogorsk.",
      "personal": "Personal fonds",
      "searchLabel": "Search the catalogue",
      "placeholder": "Fond title or archival reference",
      "find": "Search",
      "filters": "Catalogue filters",
      "type": "Material type",
      "allMaterials": "All materials",
      "fonds": "Fonds",
      "documents": "Documents",
      "photos": "Photographs",
      "period": "Period",
      "allPeriods": "All periods",
      "before": "Before 1926",
      "after": "After 2000",
      "clearFilters": "Reset filters",
      "referenceSearch": "Search by archival reference",
      "fond": "Fond",
      "inventory": "Inventory",
      "case": "Case",
      "exampleFund": "For example, 261",
      "exampleInventory": "For example, 1",
      "exampleCase": "For example, 248",
      "combine": "Combine these fields with the title, material type and period.",
      "apply": "Apply",
      "sort": "Sort",
      "titleAsc": "Title: A–Z",
      "titleDesc": "Title: Z–A",
      "yearAsc": "Period start: earliest first",
      "yearDesc": "Period start: latest first",
      "pageSize": "Records per page",
      "results": "Search results",
      "pages": "Result pages",
      "previous": "Previous",
      "next": "Next",
      "helpTitle": "Need help getting started?",
      "helpText": "Ask the archive assistant or learn",
      "cipherHelp": "how to read an archival reference",
      "kind": "Archival fond",
      "recordSummary": "Historical title from the list of fonds. Title dates:",
      "originalLanguage": "The title and reference are shown in the source language, Russian.",
      "exportNote": "2018 export · information needs verification",
      "more": "Details",
      "less": "Collapse",
      "aboutFond": "About the fond",
      "fondNumber": "Fond number",
      "fondPeriod": "Fond period",
      "accordingExport": "according to the export",
      "nameDates": "Title in use",
      "asSource": "as stated in the source",
      "digitalCopy": "Digital copy",
      "unknown": "Information not provided",
      "recordNote": "This is one row of the historical 2018 export. Document holdings, digital copies and current information have not been confirmed.",
      "openFond": "Open the fond record",
      "openSource": "Open the source table on GitHub",
      "noResults": "No records found",
      "emptyTitle": "No results",
      "emptyHint": "Try another title or fond number, or change the filters.",
      "resetSearch": "Reset search",
      "countPrefix": "Records found: ",
      "pagePrefix": "Page ",
      "pageOf": " of "
    }
  };

  Object.assign(translations.ru, {showFilters:'Фильтры', extraFilters:'Дополнительные фильтры', author:'Автор или организация', topic:'Тема', place:'Место', branch:'Филиал', yearFrom:'Год с', yearTo:'Год по', unknownFields:'В двух демонстрационных записях эти поля не подтверждены: их заполнение исключит записи из результатов.', yearsError:'Начальный год должен быть не позднее конечного.'});
  Object.assign(translations.kk, {showFilters:'Сүзгілер', extraFilters:'Қосымша сүзгілер', author:'Автор немесе ұйым', topic:'Тақырып', place:'Орын', branch:'Филиал', yearFrom:'Бастапқы жыл', yearTo:'Соңғы жыл', unknownFields:'Екі демонстрациялық жазбада бұл өрістер расталмаған: оларды толтырсаңыз, жазбалар нәтижелерге кірмейді.', yearsError:'Бастапқы жыл соңғы жылдан кеш болмауы керек.'});
  Object.assign(translations.en, {showFilters:'Filters', extraFilters:'Additional filters', author:'Author or organisation', topic:'Subject', place:'Place', branch:'Branch', yearFrom:'From year', yearTo:'To year', unknownFields:'These fields are unconfirmed in the two sample records: filling them excludes the records from results.', yearsError:'The start year must not be later than the end year.'});

  const sourceUrl = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/datasets/structured_data/funds_2018.csv';
  const record = {
    number: 'Р-1 ч.с.',
    name: 'Усть-Каменогорский городской Совет рабочих, крестьянских и красноармейских депутатов г. Усть-Каменогорск Семипалатинского округа',
    namePeriod: '[03]1926–19.02.1932',
    startYear: 1926,
    endYear: 1993,
    keywords: 'р-1 р 1 ч с р-1 ч.с. фонд фонды усть каменогорск усть-каменогорск совет депутатов 1926 1932 1993'
  };

  function normalize(value) {
    return value.toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/[\s.,–—-]+/g, ' ').trim();
  }

  function queryMatches(query) {
    const normalized = normalize(query);
    if (!normalized) return true;
    const haystack = normalize([record.number, record.name, record.namePeriod, record.startYear, record.endYear, record.keywords].join(' '));
    return normalized.split(' ').every((word) => haystack.includes(word));
  }

  function resultMarkup(t) {
    return `
      <article class="catalog-result-card">
        <div class="catalog-result-top"><span class="catalog-kind">${t.kind}</span><span class="catalog-period">1926–1993</span></div>
        <p class="catalog-result-number">${t.fond} <span lang="ru">${record.number}</span></p>
        <h2 class="catalog-result-title" lang="ru">${record.name}</h2>
        <p class="catalog-source-language">${t.originalLanguage}</p>
        <p class="catalog-result-summary">${t.recordSummary} ${record.namePeriod}.</p>
        <div class="catalog-result-bottom"><span>${t.exportNote}</span><button type="button" class="catalog-details-toggle" aria-expanded="false" aria-controls="catalog-fund-details">${t.more} <span aria-hidden="true">↓</span></button></div>
        <section id="catalog-fund-details" class="catalog-details" hidden>
          <h3>${t.aboutFond}</h3>
          <dl><div><dt>${t.fondNumber}</dt><dd lang="ru">${record.number}</dd></div><div><dt>${t.fondPeriod}</dt><dd>1926–1993, ${t.accordingExport}</dd></div><div><dt>${t.nameDates}</dt><dd>${record.namePeriod}, ${t.asSource}</dd></div><div><dt>${t.digitalCopy}</dt><dd>${t.unknown}</dd></div></dl>
          <p>${t.recordNote}</p>
          <p><a class="catalog-source-link" href="#/fund/r1">${t.openFond} <span aria-hidden="true">→</span></a></p>
          <a class="catalog-source-link" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${t.openSource} <span aria-hidden="true">↗</span></a>
        </section>
      </article>`;
  }

  function renderCatalog(container, params, language = 'ru') {
    const t = translations[language] || translations.ru;
    params = params instanceof URLSearchParams ? params : new URLSearchParams();
    const query = params.get('q') || '';
    container.innerHTML = `
      <section class="catalog-page" aria-labelledby="catalog-heading">
        <div class="catalog-container">
          <nav class="catalog-breadcrumbs" aria-label="${t.breadcrumbs}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.catalog}</span></nav>
          <div class="catalog-heading-row"><div><p class="catalog-eyebrow">${t.eyebrow}</p><h1 id="catalog-heading">${t.heading}</h1><p class="catalog-lead">${t.lead}</p></div><a class="catalog-help-link" href="#/">${t.ask} <span aria-hidden="true">↗</span></a></div>
          <div class="catalog-demo-note" role="note"><span class="catalog-note-mark" aria-hidden="true">i</span><p><strong>${t.demo}</strong> ${t.demoText}</p></div>
          <p><a class="response-link" href="#/section/personal-funds">${t.personal} <span aria-hidden="true">→</span></a></p>
          <form id="catalog-search-form" class="catalog-search" role="search"><label class="catalog-sr-only" for="catalog-query">${t.searchLabel}</label><svg class="catalog-search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="m16.2 16.2 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input id="catalog-query" name="q" type="search" placeholder="${t.placeholder}" autocomplete="off"><button class="catalog-search-button" type="submit">${t.find}</button></form>
          <div class="portal-catalog-layout"><aside class="portal-catalog-sidebar"><details class="catalog-filter-panel"><summary>${t.showFilters}</summary><div class="catalog-filters" aria-label="${t.filters}"><label class="catalog-select-wrap"><span>${t.type}</span><select id="catalog-type"><option value="all">${t.allMaterials}</option><option value="fund">${t.fonds}</option><option value="document">${t.documents}</option><option value="photo">${t.photos}</option></select></label><label class="catalog-select-wrap"><span>${t.period}</span><select id="catalog-period"><option value="all">${t.allPeriods}</option><option value="before1926">${t.before}</option><option value="1926-1950">1926–1950</option><option value="1951-2000">1951–2000</option><option value="after2000">${t.after}</option></select></label><button type="button" class="catalog-clear">${t.clearFilters}</button></div>
          <details class="catalog-advanced"><summary>${t.referenceSearch}</summary><div class="catalog-reference-fields"><label>${t.fond}<input id="catalog-fund" maxlength="50" placeholder="${t.exampleFund}" form="catalog-search-form"></label><label>${t.inventory}<input id="catalog-inventory" maxlength="50" placeholder="${t.exampleInventory}" form="catalog-search-form"></label><label>${t.case}<input id="catalog-case" maxlength="50" placeholder="${t.exampleCase}" form="catalog-search-form"></label></div><p>${t.combine}</p><button type="submit" form="catalog-search-form" class="catalog-search-button">${t.apply}</button></details>
          <div class="catalog-extra-filters"><h2>${t.extraFilters}</h2><div class="catalog-extra-fields">
            <label for="catalog-year-from">${t.yearFrom}<input id="catalog-year-from" type="number" min="1" max="9999" inputmode="numeric" form="catalog-search-form"></label>
            <label for="catalog-year-to">${t.yearTo}<input id="catalog-year-to" type="number" min="1" max="9999" inputmode="numeric" form="catalog-search-form"></label>
            <label for="catalog-author">${t.author}<input id="catalog-author" aria-describedby="catalog-extra-note" type="text" maxlength="100" form="catalog-search-form"></label>
            <label for="catalog-topic">${t.topic}<input id="catalog-topic" aria-describedby="catalog-extra-note" type="text" maxlength="100" form="catalog-search-form"></label>
            <label for="catalog-place">${t.place}<input id="catalog-place" aria-describedby="catalog-extra-note" type="text" maxlength="100" form="catalog-search-form"></label>
            <label for="catalog-branch">${t.branch}<input id="catalog-branch" aria-describedby="catalog-extra-note" type="text" maxlength="100" form="catalog-search-form"></label>
          </div><p class="catalog-extra-note" id="catalog-extra-note">${t.unknownFields}</p><button type="submit" form="catalog-search-form" class="catalog-search-button">${t.apply}</button></div></details>
          </aside><div class="portal-catalog-results"><div class="catalog-result-controls">
            <label class="catalog-select-wrap"><span>${t.sort}</span><select id="catalog-sort"><option value="title-asc">${t.titleAsc}</option><option value="title-desc">${t.titleDesc}</option><option value="year-asc">${t.yearAsc}</option><option value="year-desc">${t.yearDesc}</option></select></label>
            <label class="catalog-select-wrap"><span>${t.pageSize}</span><select id="catalog-page-size"><option value="1">1</option><option value="10" selected>10</option><option value="20">20</option></select></label>
          </div>
          <div class="catalog-results-heading"><h2>${t.results}</h2><p class="catalog-result-count" role="status" aria-live="polite"></p></div><div class="catalog-results"></div>
          <nav class="catalog-pagination" aria-label="${t.pages}" hidden>
            <button class="catalog-page-previous" type="button">← ${t.previous}</button>
            <span class="catalog-page-status" aria-live="polite"></span>
            <button class="catalog-page-next" type="button">${t.next} →</button>
          </nav>
          </div></div><div class="catalog-bottom-help"><div class="catalog-bottom-icon" aria-hidden="true">?</div><div><h2>${t.helpTitle}</h2><p>${t.helpText} <a class="catalog-cipher-link" href="#/cipher">${t.cipherHelp}</a>.</p></div><a href="#/">${t.ask} <span aria-hidden="true">→</span></a></div>
        </div>
      </section>`;
    const form = container.querySelector('.catalog-search');
    const input = container.querySelector('#catalog-query');
    const type = container.querySelector('#catalog-type');
    const period = container.querySelector('#catalog-period');
    const result = container.querySelector('.catalog-results');
    const count = container.querySelector('.catalog-result-count');
    const sort = container.querySelector('#catalog-sort');
    const pageSize = container.querySelector('#catalog-page-size');
    const pagination = container.querySelector('.catalog-pagination');
    const previousPage = container.querySelector('.catalog-page-previous');
    const nextPage = container.querySelector('.catalog-page-next');
    const pageStatus = container.querySelector('.catalog-page-status');
    const requestedPage = params.get('page') || '1';
    let currentPage = /^[1-9][0-9]*$/.test(requestedPage) && Number.isSafeInteger(Number(requestedPage))
      ? Number(requestedPage)
      : 1;
    input.value = query;
    const referenceFields = {
      fund: container.querySelector('#catalog-fund'),
      inventory: container.querySelector('#catalog-inventory'),
      case: container.querySelector('#catalog-case')
    };
    for (const [key, field] of Object.entries(referenceFields)) {
      field.value = (params.get(key) || '').slice(0, 50);
    }
    const extraFields = Object.fromEntries(['year-from', 'year-to', 'author', 'topic', 'place', 'branch'].map(key => [key, container.querySelector('#catalog-' + key)]));
    for (const [key, field] of Object.entries(extraFields)) {
      const value = (params.get(key) || '').slice(0, key.startsWith('year-') ? 4 : 100);
      field.value = key.startsWith('year-') && !/^[1-9][0-9]{0,3}$/.test(value) ? '' : value;
    }
    container.querySelector('.catalog-filter-panel').open = !window.matchMedia('(max-width: 760px)').matches || [...Object.values(referenceFields), ...Object.values(extraFields)].some(field => field.value) || type.value !== 'all' || period.value !== 'all';
    for (const [key, select] of [['type', type], ['period', period], ['sort', sort], ['size', pageSize]]) {
      const value = params.get(key);
      if (Array.from(select.options).some(option => option.value === value)) select.value = value;
    }
    container.querySelector('.catalog-filter-panel').open ||= type.value !== 'all' || period.value !== 'all';
    container.querySelector('.catalog-advanced').open = Object.values(referenceFields).some(field => field.value);

    function referenceMatches(fund, inventory, archiveCase) {
      const expected = { fund, inventory, case: archiveCase };
      return Object.entries(referenceFields).every(([key, field]) => {
        const value = normalize(field.value);
        return !value || (expected[key] !== null && value === normalize(expected[key]));
      });
    }

    function getFilterParams() {
      const next = new URLSearchParams();
      if (input.value.trim()) next.set('q', input.value.trim());
      for (const [key, field] of Object.entries(referenceFields)) {
        if (field.value.trim()) next.set(key, field.value.trim());
      }
      for (const [key, field] of Object.entries(extraFields)) {
        if (field.value.trim()) next.set(key, field.value.trim());
      }
      if (type.value !== 'all') next.set('type', type.value);
      if (period.value !== 'all') next.set('period', period.value);
      if (sort.value !== 'title-asc') next.set('sort', sort.value);
      if (pageSize.value !== '10') next.set('size', pageSize.value);
      if (currentPage > 1) next.set('page', String(currentPage));
      return next;
    }

    renderCatalog.captureParams = getFilterParams;

    function saveFilters() {
      const next = getFilterParams();
      const hash = '#/catalog' + (next.size ? '?' + next.toString() : '');
      history.replaceState(null, '', hash);
    }

    function updateResults() {
      const selected = period.value;
      const periodMatches = selected === 'all' || (selected === '1926-1950' && record.startYear <= 1950 && record.endYear >= 1926) || (selected === '1951-2000' && record.startYear <= 2000 && record.endYear >= 1951);
      // Both sample records lack confirmed metadata for these fields, so they must not match guesses.
      const metadataMatches = ['author', 'topic', 'place', 'branch'].every(key => !extraFields[key].value.trim());
      const rangeMatches = (start, end) => (!extraFields['year-from'].value || end >= Number(extraFields['year-from'].value)) && (!extraFields['year-to'].value || start <= Number(extraFields['year-to'].value));
      const found = metadataMatches && rangeMatches(record.startYear, record.endYear) && queryMatches(input.value) && (type.value === 'all' || type.value === 'fund') && periodMatches && referenceMatches(record.number, null, null);
      const documentFound = metadataMatches && rangeMatches(1939, 1945) && (type.value === 'all' || type.value === 'document') && (selected === 'all' || selected === '1926-1950') && window.ridderRecord.search(input.value) && referenceMatches('261', '1', '248');
      const matches = [];
      if (found) matches.push({ title: record.name, startYear: record.startYear, markup: resultMarkup(t) });
      if (documentFound) {
        matches.push({
          title: 'Статистические данные по мобилизации в Лениногорске',
          startYear: 1939,
          markup: window.ridderRecord.cardMarkup ? window.ridderRecord.cardMarkup(language) : window.ridderRecord.card
        });
      }
      const descending = sort.value.endsWith('-desc');
      matches.sort((left, right) => {
        const comparison = sort.value.startsWith('year-')
          ? left.startYear - right.startYear
          : left.title.localeCompare(right.title, 'ru');
        return descending ? -comparison : comparison;
      });
      const total = matches.length;
      const size = Number(pageSize.value);
      const pageCount = Math.max(1, Math.ceil(total / size));
      currentPage = Math.min(currentPage, pageCount);
      const start = (currentPage - 1) * size;
      const visible = matches.slice(start, start + size);
      count.textContent = total ? t.countPrefix + total : t.noResults;
      result.innerHTML = total
        ? visible.map(item => item.markup).join('')
        : `<div class="catalog-empty"><span class="catalog-empty-icon" aria-hidden="true">⌕</span><h3>${t.emptyTitle}</h3><p>${t.emptyHint}</p><button type="button" class="catalog-empty-reset">${t.resetSearch}</button></div>`;
      pagination.hidden = total === 0;
      pageStatus.textContent = t.pagePrefix + currentPage + t.pageOf + pageCount;
      previousPage.disabled = currentPage === 1;
      nextPage.disabled = currentPage === pageCount;
      saveFilters();
      const detailsButton = result.querySelector('.catalog-details-toggle');
      if (detailsButton) detailsButton.addEventListener('click', () => {
        const panel = result.querySelector('#catalog-fund-details');
        panel.hidden = !panel.hidden;
        detailsButton.setAttribute('aria-expanded', String(!panel.hidden));
        detailsButton.innerHTML = panel.hidden ? `${t.more} <span aria-hidden="true">↓</span>` : `${t.less} <span aria-hidden="true">↑</span>`;
      });
      const resetButton = result.querySelector('.catalog-empty-reset');
      if (resetButton) resetButton.addEventListener('click', clear);
    }

    function clear() {
      input.value = '';
      Object.values(referenceFields).forEach(field => { field.value = ''; });
      Object.values(extraFields).forEach(field => { field.value = ''; field.setCustomValidity(''); });
      type.value = 'all';
      period.value = 'all';
      sort.value = 'title-asc';
      pageSize.value = '10';
      currentPage = 1;
      updateResults();
      input.focus();
    }

    function validateYears() {
      const from = extraFields['year-from'];
      const to = extraFields['year-to'];
      to.setCustomValidity(from.value && to.value && Number(from.value) > Number(to.value) ? t.yearsError : '');
      return form.reportValidity();
    }
    function applyFilters() {
      if (!validateYears()) return;
      currentPage = 1;
      updateResults();
    }
    [extraFields['year-from'], extraFields['year-to']].forEach(field => field.addEventListener('input', () => extraFields['year-to'].setCustomValidity('')));
    form.addEventListener('submit', event => {
      event.preventDefault();
      applyFilters();
    });
    [type, period, sort, pageSize].forEach(control => control.addEventListener('change', applyFilters));
    previousPage.addEventListener('click', () => {
      currentPage -= 1;
      updateResults();
    });
    nextPage.addEventListener('click', () => {
      currentPage += 1;
      updateResults();
    });
    container.querySelector('.catalog-clear').addEventListener('click', clear);
    updateResults();
  }

  window.renderCatalog = renderCatalog;
})();
