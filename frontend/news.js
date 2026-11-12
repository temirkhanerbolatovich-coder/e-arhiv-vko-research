/* Published archive news and a separate selection summarized from government publications. */
(function () {
  'use strict';

  const listUrl = '#/section/news';
  const categories = {
    information: 'Справка',
    events: 'События',
    announcements: 'Объявления'
  };
  const interfaceCopy = {
    ru: {crumb:'Навигационная цепочка',home:'Главная',all:'Все разделы',title:'Новости и события',publication:'Публикация',intro:'Подборка публикаций об архивах Восточного Казахстана с датами и ссылками на первоисточники.',notice:'Содержание публикаций приведено на русском языке; поиск выполняется по этому тексту.',search:'Поиск по новостям',placeholder:'Тема или название',category:'Категория',allCategories:'Все категории',sort:'Сортировка',newest:'Сначала новые даты',oldest:'Сначала ранние даты',byTitle:'По названию',size:'Публикаций на странице',reset:'Сбросить',dateNote:'Сортировка по дате использует указанную дату публикации, события или объявления; её тип указан в карточке.',pages:'Страницы новостей',previous:'Назад',next:'Далее',count:'Найдено публикаций: ',none:'Публикации не найдены',noneHelp:'Попробуйте изменить запрос или выбрать другую категорию.',page:'Страница',of:'из',notFound:'Публикация не найдена',notFoundHelp:'Проверьте адрес или выберите материал в списке.',back:'Вернуться к новостям',original:'Оригинал на gov.kz',external:' (в новой вкладке; источник на русском языке)',allNews:'Все новости',categories:{information:'Справка',events:'События',announcements:'Объявления'}},
    kk: {crumb:'Навигация жолы',home:'Басты бет',all:'Барлық бөлімдер',title:'Жаңалықтар мен оқиғалар',publication:'Жарияланым',intro:'Шығыс Қазақстан архивтері туралы жарияланымдар, күндер және бастапқы дереккөздерге сілтемелер.',notice:'Жарияланымдардың мазмұны орыс тілінде берілген; іздеу осы мәтін бойынша орындалады.',search:'Жаңалықтардан іздеу',placeholder:'Тақырып немесе атау',category:'Санат',allCategories:'Барлық санаттар',sort:'Сұрыптау',newest:'Алдымен жаңа күндер',oldest:'Алдымен ертерек күндер',byTitle:'Атауы бойынша',size:'Беттегі жарияланымдар',reset:'Тазалау',dateNote:'Күн бойынша сұрыптауда жарияланымның, оқиғаның немесе хабарландырудың көрсетілген күні қолданылады; түрі карточкада көрсетілген.',pages:'Жаңалықтар беттері',previous:'Артқа',next:'Келесі',count:'Табылған жарияланымдар: ',none:'Жарияланымдар табылмады',noneHelp:'Басқа сұрау енгізіңіз немесе санатты өзгертіңіз.',page:'Бет',of:'/',notFound:'Жарияланым табылмады',notFoundHelp:'Мекенжайды тексеріңіз немесе тізімнен материалды таңдаңыз.',back:'Жаңалықтарға оралу',original:'gov.kz сайтындағы түпнұсқа',external:' (жаңа қойындыда; дереккөз орыс тілінде)',allNews:'Барлық жаңалықтар',categories:{information:'Анықтама',events:'Оқиғалар',announcements:'Хабарландырулар'}},
    en: {crumb:'Breadcrumbs',home:'Home',all:'All sections',title:'News and events',publication:'Publication',intro:'Selected publications about East Kazakhstan archives with dates and links to original sources.',notice:'Publication content is shown in Russian; search matches this text.',search:'Search news',placeholder:'Topic or title',category:'Category',allCategories:'All categories',sort:'Sort',newest:'Newest dates first',oldest:'Oldest dates first',byTitle:'By title',size:'Publications per page',reset:'Reset',dateNote:'Date sorting uses the stated publication, event or announcement date; the type is shown on each card.',pages:'News pages',previous:'Previous',next:'Next',count:'Publications found: ',none:'No publications found',noneHelp:'Try a different query or category.',page:'Page',of:'of',notFound:'Publication not found',notFoundHelp:'Check the address or choose an item from the list.',back:'Back to news',original:'Original on gov.kz',external:' (opens in a new tab; source in Russian)',allNews:'All news',categories:{information:'Information',events:'Events',announcements:'Announcements'}}
  };
  const entries = [
    {
      id: 'archive-services-vko',
      category: 'information',
      title: 'Об архивных справках через eGov',
      date: '2026-09-26',
      dateLabel: 'Опубликовано 26 сентября 2026 года',
      summary: 'Акимат ВКО опубликовал итоги брифинга о дистанционном получении архивных справок, копий и выписок.',
      detail: 'На брифинге объяснили, как архивные документы помогают подтвердить трудовой стаж и другие сведения. В публикации также описано, как архивисты проверяют фонды, описи и дела после получения запроса.',
      source: 'Акимат Восточно-Казахстанской области',
      sourceUrl: 'https://www.gov.kz/org/akimvko/press/news/details/1299189?lang=ru',
      related: { href: '#/section/services', label: 'Справочная страница об архивных услугах' }
    },
    {
      id: 'electronic-archive-seminar',
      category: 'events',
      title: 'Семинар по электронному архиву в Тарбагатайском районе',
      date: '2026-03-03',
      dateLabel: 'Событие 3 марта 2026 года',
      summary: 'Областной и районный архивы провели семинар по работе с системой «Единый электронный архив документов».',
      detail: 'Сотрудники государственных органов района познакомились с возможностями системы и обсудили практические вопросы работы с ней.',
      source: 'Управление цифровизации и архивов ВКО',
      sourceUrl: 'https://www.gov.kz/org/vko-uca/press/news/details/1174657',
      related: { href: '#/section/branches', label: 'Филиалы и контакты архива' }
    },
    {
      id: 'corruption-risks-discussion',
      category: 'announcements',
      title: 'Объявление об обсуждении результатов анализа коррупционных рисков',
      date: '2025-07-16',
      dateLabel: 'Запланированная дата 16 июля 2025 года',
      summary: 'Управление цифровизации и архивов ВКО анонсировало публичное обсуждение результатов внутреннего анализа.',
      detail: 'В объявлении встречу назначили на 16 июля 2025 года. Эта дата уже прошла. Источник содержит анонс встречи.',
      source: 'Управление цифровизации и архивов ВКО',
      sourceUrl: 'https://www.gov.kz/memleket/entities/vko-uca/press/news/details/1035056?lang=ru',
      related: { href: '#/section/compliance', label: 'Комплаенс и антикоррупция' }
    }
  ];
  const feedCopy = {
    ru: {
      feed: 'Новости архива', selection: 'Подборка', intro: 'Публикации и события Государственного архива ВКО.',
      sourceNotice: 'Публикации показаны на языке источника.', search: 'Найти', searchTitle: 'Поиск по заголовку',
      loading: 'Загружаем публикации…', count: 'Публикаций на странице: ', error: 'Не удалось загрузить публикации.',
      retry: 'Повторить загрузку', end: 'Вы на последней странице.', read: 'Читать публикацию', original: 'Открыть первоисточник',
      noText: 'Текст публикации доступен у источника.'
    },
    kk: {
      feed: 'Архив жаңалықтары', selection: 'Таңдаулы материалдар', intro: 'ШҚО мемлекеттік архивінің жарияланымдары мен оқиғалары.',
      sourceNotice: 'Жарияланымдар дереккөз тілінде берілген.', search: 'Табу', searchTitle: 'Тақырып бойынша іздеу',
      loading: 'Жарияланымдар жүктелуде…', count: 'Беттегі жарияланымдар: ', error: 'Жарияланымдарды жүктеу мүмкін болмады.',
      retry: 'Қайта жүктеу', end: 'Сіз соңғы беттесіз.', read: 'Жарияланымды оқу', original: 'Бастапқы дереккөзді ашу',
      noText: 'Жарияланым мәтіні дереккөзде қолжетімді.'
    },
    en: {
      feed: 'Archive news', selection: 'Selected stories', intro: 'Publications and events from the East Kazakhstan State Archive.',
      sourceNotice: 'Publications are shown in their source language.', search: 'Search', searchTitle: 'Search by title',
      loading: 'Loading publications…', count: 'Publications on this page: ', error: 'Could not load the publications.',
      retry: 'Retry loading', end: 'You are on the last page.', read: 'Read the publication', original: 'Open original source',
      noText: 'The publication text is available from the source.'
    }
  };
  const feedPageSize = 12;
  const feedPageLimit = 200;
  const feedLanguage = language => language === 'kk' ? 'kk' : 'ru';

  function listState(params) {
    const category = params.get('category');
    return {
      query: (params.get('q') || '').trim().slice(0, 100),
      edition: params.get('edition') === 'selection' ? 'selection' : '',
      category: Object.hasOwn(categories, category) ? category : '',
      sort: ['newest', 'oldest', 'title'].includes(params.get('sort')) ? params.get('sort') : 'newest',
      pageSize: ['2', '3'].includes(params.get('size')) ? Number(params.get('size')) : 3,
      page: /^\d{1,5}$/.test(params.get('page') || '') ? Math.max(1, Number(params.get('page'))) : 1
    };
  }

  function route(state, item) {
    const params = new URLSearchParams();
    if (item) params.set('item', item);
    if (state.edition) params.set('edition', state.edition);
    if (state.query) params.set('q', state.query);
    if (state.category) params.set('category', state.category);
    if (state.sort && state.sort !== 'newest') params.set('sort', state.sort);
    if (state.pageSize && state.pageSize !== 3) params.set('size', String(state.pageSize));
    if (state.page > 1) params.set('page', String(state.page));
    return params.size ? `${listUrl}?${params}` : listUrl;
  }

  function normalize(value) {
    return value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  }

  function header(title, intro, backUrl, t, originalLanguage = '') {
    return `<header class="info-heading">
      <nav class="info-breadcrumb" aria-label="${t.crumb}">
        <a href="#/">${t.home}</a><span aria-hidden="true">/</span>
        <a href="#/section/all">${t.all}</a><span aria-hidden="true">/</span>
        ${backUrl ? `<a href="${backUrl}">${t.title}</a><span aria-hidden="true">/</span>` : ''}
        <span aria-current="page">${backUrl ? t.publication : title}</span>
      </nav>
      <h1 id="news-title"${originalLanguage ? ` lang="${originalLanguage}"` : ''}>${title}</h1>
      ${intro ? `<p class="info-intro">${intro}</p>` : ''}
    </header>`;
  }

  function page(content) {
    return `<section class="info-page news-page" aria-labelledby="news-title">
      <div class="info-container">${content}</div>
    </section>`;
  }

  function dateMarkup(entry) {
    return `<time lang="ru" datetime="${entry.date}">${entry.dateLabel}</time>`;
  }

  function card(entry, state, t) {
    return `<a class="info-link-card news-card" href="${route(state, entry.id)}">
      <span class="news-card-meta"><span>${t.categories[entry.category]}</span>${dateMarkup(entry)}</span>
      <h2 lang="ru">${entry.title}</h2>
      <p lang="ru">${entry.summary}</p>
      <span class="news-card-source" lang="ru">${entry.source}<span aria-hidden="true">→</span></span>
    </a>`;
  }

  function feedNavigation(f, selection) {
    return `<nav class="news-editions" aria-label="${f.feed}"><a href="${listUrl}"${selection ? '' : ' aria-current="page"'}>${f.feed}</a><a href="${listUrl}?edition=selection"${selection ? ' aria-current="page"' : ''}>${f.selection}</a></nav>`;
  }

  function renderList(container, state, t, f) {
    container.innerHTML = page(`${header(t.title, t.intro, null, t)}
      ${feedNavigation(f, true)}
      <p class="news-language-note" role="note">${t.notice}</p><form class="news-filter" role="search" aria-label="${t.search}">
        <label for="news-query">${t.search}<input id="news-query" type="search" placeholder="${t.placeholder}" maxlength="100"></label>
        <label for="news-category">${t.category}<select id="news-category">
          <option value="">${t.allCategories}</option>
          ${Object.entries(t.categories).map(([id, title]) => `<option value="${id}">${title}</option>`).join('')}
        </select></label>
        <label for="news-sort">${t.sort}<select id="news-sort"><option value="newest">${t.newest}</option><option value="oldest">${t.oldest}</option><option value="title">${t.byTitle}</option></select></label>
        <label for="news-size">${t.size}<select id="news-size"><option value="3">3</option><option value="2">2</option></select></label>
        <button class="news-reset" type="reset">${t.reset}</button>
      </form>
      <p class="news-date-note">${t.dateNote}</p>
      <p id="news-results-count" class="news-results-count" role="status"></p>
      <div id="news-results" class="news-results"></div>
      <nav class="news-pagination" aria-label="${t.pages}" hidden><button type="button" class="news-prev">← ${t.previous}</button><span class="news-page-status" role="status"></span><button type="button" class="news-next">${t.next} →</button></nav>`);

    const form = container.querySelector('.news-filter');
    const input = container.querySelector('#news-query');
    const category = container.querySelector('#news-category');
    const sort = container.querySelector('#news-sort');
    const size = container.querySelector('#news-size');
    const pagination = container.querySelector('.news-pagination');
    const previous = container.querySelector('.news-prev');
    const next = container.querySelector('.news-next');
    const pageStatus = container.querySelector('.news-page-status');
    const count = container.querySelector('#news-results-count');
    const results = container.querySelector('#news-results');
    input.value = state.query;
    category.value = state.category;
    sort.value = state.sort;
    size.value = String(state.pageSize);
    let currentPage = state.page;

    function updateResults() {
      const filters = { edition: 'selection', query: input.value.trim().slice(0, 100), category: category.value, sort: sort.value, pageSize: Number(size.value), page: currentPage };
      const query = normalize(filters.query);
      const filtered = entries.filter(entry => {
        const text = normalize([entry.title, entry.summary, entry.detail, entry.source, entry.dateLabel].join(' '));
        return (!filters.category || entry.category === filters.category) && text.includes(query);
      });

      filtered.sort((a, b) => filters.sort === 'title' ? a.title.localeCompare(b.title, 'ru') : filters.sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
      const pageCount = Math.max(1, Math.ceil(filtered.length / filters.pageSize));
      currentPage = Math.min(currentPage, pageCount);
      filters.page = currentPage;
      const listHash = route(filters);
      if (location.hash !== listHash) history.replaceState(null, '', listHash);
      const visible = filtered.slice((currentPage - 1) * filters.pageSize, currentPage * filters.pageSize);

      count.textContent = `${t.count}${filtered.length}`;
      results.innerHTML = filtered.length
        ? visible.map(entry => card(entry, filters, t)).join('')
        : `<div class="info-empty"><div><h2>${t.none}</h2><p>${t.noneHelp}</p></div></div>`;
      pagination.hidden = pageCount <= 1;
      previous.disabled = currentPage <= 1;
      next.disabled = currentPage >= pageCount;
      pageStatus.textContent = `${t.page} ${currentPage} ${t.of} ${pageCount}`;
    }

    function resetPage() { currentPage = 1; updateResults(); }
    input.addEventListener('input', resetPage);
    category.addEventListener('change', resetPage);
    sort.addEventListener('change', resetPage);
    size.addEventListener('change', resetPage);
    previous.addEventListener('click', () => { currentPage--; updateResults(); });
    next.addEventListener('click', () => { currentPage++; updateResults(); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      updateResults();
    });
    form.addEventListener('reset', event => {
      event.preventDefault();
      input.value = '';
      category.value = '';
      sort.value = 'newest';
      size.value = '3';
      currentPage = 1;
      updateResults();
      input.focus();
    });
    updateResults();
  }

  function renderItem(container, entry, state, t) {
    const backUrl = route(state);
    if (!entry) {
      container.innerHTML = page(`${header(t.notFound, t.notFoundHelp, backUrl, t)}
        <a class="info-text-link" href="${backUrl}">${t.back} <span aria-hidden="true">→</span></a>`);
      return;
    }

    container.innerHTML = page(`${header(entry.title, '', backUrl, t, 'ru')}
      <p class="news-language-note" role="note">${t.notice}</p><article class="info-paper-card info-about-story news-detail">
        <div class="news-card-meta"><span>${t.categories[entry.category]}</span>${dateMarkup(entry)}</div>
        <p lang="ru">${entry.summary}</p>
        <p lang="ru">${entry.detail}</p>
        <div class="news-detail-links">
          <a class="info-text-link" href="${entry.sourceUrl}" target="_blank" rel="noopener noreferrer">
            ${t.original} <span aria-hidden="true">↗</span><span class="sr-only">${t.external}</span>
          </a>
          <span class="news-card-source" lang="ru">${entry.source}</span>
        </div>
      </article>
      <div class="news-related">
        <a class="info-text-link" lang="ru" href="${entry.related.href}">${entry.related.label} <span aria-hidden="true">→</span></a>
        <a class="info-text-link" href="${backUrl}">${t.allNews} <span aria-hidden="true">→</span></a>
      </div>`);
  }

  async function getPublishedNews(language, query = '', pageNumber = 1) {
    const params = new URLSearchParams({ locale: feedLanguage(language), q: query, page: String(pageNumber) });
    const data = await window.archiveApi.get('/sections/news?' + params);
    if (!Array.isArray(data?.items)) throw new Error('Invalid news list');
    return data.items;
  }

  function publishedCard(entry, state, locale, f) {
    const esc = window.archiveApi.escape;
    return `<a class="info-link-card news-card" href="${esc(route(state, entry.id))}">
      ${entry.date ? `<span class="news-card-meta" lang="${locale}">${esc(entry.date)}</span>` : ''}
      <h2 lang="${locale}">${esc(entry.title)}</h2>
      ${entry.lead ? `<p lang="${locale}">${esc(entry.lead)}</p>` : ''}
      <span class="news-card-source">${f.read}<span aria-hidden="true">→</span></span>
    </a>`;
  }

  async function renderPublishedList(container, state, t, f, language) {
    const api = window.archiveApi;
    container.innerHTML = page(`${header(t.title, f.intro, null, t)}
      ${feedNavigation(f, false)}<p class="news-language-note" role="note">${f.sourceNotice}</p>
      <form class="news-filter news-filter-live" role="search" aria-label="${f.searchTitle}">
        <label for="news-query">${f.searchTitle}<input id="news-query" type="search" placeholder="${t.placeholder}" maxlength="100"></label>
        <button class="news-submit" type="submit" disabled>${f.search}</button><button class="news-reset" type="reset" disabled>${t.reset}</button>
      </form>
      <p id="news-results-count" class="news-results-count" role="status" tabindex="-1">${f.loading}</p>
      <div id="news-results" class="news-results"></div>
      <button class="news-reset" type="button" data-news-retry hidden>${f.retry}</button>
      <nav class="news-pagination" aria-label="${t.pages}" hidden><button type="button" class="news-prev">← ${t.previous}</button><span class="news-page-status"></span><button type="button" class="news-next">${t.next} →</button></nav>`);
    const form = container.querySelector('.news-filter');
    const input = form.querySelector('#news-query');
    const count = container.querySelector('#news-results-count');
    const results = container.querySelector('#news-results');
    const nav = container.querySelector('.news-pagination');
    const previous = nav.querySelector('.news-prev');
    const next = nav.querySelector('.news-next');
    const pageStatus = nav.querySelector('.news-page-status');
    const retry = container.querySelector('[data-news-retry]');
    input.value = state.query;
    form.addEventListener('submit', event => event.preventDefault());
    const available = await api?.ready;
    if (!form.isConnected) return;
    if (!available) { renderList(container, { ...state, query: input.value.trim(), page: 1 }, t, f); return; }
    form.querySelectorAll('button').forEach(button => { button.disabled = false; });

    let requestNumber = 0;
    let requested = { query: state.query, page: Math.min(state.page, feedPageLimit) };
    let shown = null;
    let lastPage = false;
    function pagination() {
      nav.hidden = !shown || (shown.page === 1 && lastPage);
      previous.disabled = !shown || shown.page <= 1;
      next.disabled = !shown || lastPage;
      pageStatus.textContent = shown ? `${t.page} ${shown.page}` : '';
    }
    function saveRoute(selection) {
      const nextRoute = route(selection);
      if (location.hash !== nextRoute) history.replaceState(null, '', nextRoute);
    }
    async function load(selection, fromPager = false) {
      requested = selection;
      const request = ++requestNumber;
      retry.hidden = true;
      count.textContent = f.loading;
      results.setAttribute('aria-busy', 'true');
      previous.disabled = next.disabled = true;
      if (!fromPager) saveRoute(selection);
      try {
        const items = await getPublishedNews(language, selection.query, selection.page);
        if (!form.isConnected || request !== requestNumber) return;
        if (!items.length && shown && shown.query === selection.query && selection.page === shown.page + 1) {
          requested = shown;
          lastPage = true;
          count.textContent = f.end;
          saveRoute(shown);
        } else {
          shown = selection;
          lastPage = items.length < feedPageSize || shown.page >= feedPageLimit;
          count.textContent = items.length ? f.count + items.length : t.none;
          results.innerHTML = items.length
            ? items.map(item => publishedCard(item, shown, feedLanguage(language), f)).join('')
            : `<div class="info-empty"><div><h2>${t.none}</h2><p>${t.noneHelp}</p></div></div>`;
          saveRoute(shown);
        }
        pagination();
        if (fromPager) count.focus();
      } catch {
        if (!form.isConnected || request !== requestNumber) return;
        count.textContent = f.error;
        if (shown?.query !== selection.query) { results.textContent = ''; nav.hidden = true; }
        retry.hidden = false;
      } finally {
        if (request === requestNumber) results.removeAttribute('aria-busy');
      }
    }
    form.addEventListener('submit', () => load({ query: input.value.trim().slice(0, 100), page: 1 }));
    form.addEventListener('reset', event => {
      event.preventDefault();
      input.value = '';
      load({ query: '', page: 1 });
      input.focus();
    });
    previous.addEventListener('click', () => load({ query: shown.query, page: shown.page - 1 }, true));
    next.addEventListener('click', () => load({ query: shown.query, page: shown.page + 1 }, true));
    retry.addEventListener('click', () => load(requested));
    await load(requested);
  }

  function externalSource(value) {
    try {
      const url = new URL(value);
      return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password ? url.href : '';
    } catch {
      return '';
    }
  }

  async function renderPublishedItem(container, id, state, t, f, language) {
    const api = window.archiveApi;
    const backUrl = api.escape(route(state));
    const back = `<a class="info-text-link" href="${backUrl}">${t.back} <span aria-hidden="true">→</span></a>`;
    container.innerHTML = page(`${header(t.publication, '', backUrl, t)}<p role="status">${f.loading}</p>${back}`);
    const loading = container.firstElementChild;
    try {
      const available = await api.ready;
      if (!loading.isConnected) return;
      if (!available) throw new Error('Unavailable');
      const { resource } = await api.get('/resources/' + encodeURIComponent(id));
      if (!loading.isConnected) return;
      if (resource?.kind !== 'news') { renderItem(container, null, state, t); return; }
      const esc = api.escape;
      const locale = ['ru', 'kk', 'en'].includes(resource.language) ? resource.language : feedLanguage(language);
      const source = externalSource(resource.source?.url);
      const body = resource.description?.trim().split(/\n\s*\n/).filter(Boolean) || [];
      document.title = resource.title;
      container.innerHTML = page(`${header(esc(resource.title), '', backUrl, t, locale)}
        <article class="info-paper-card info-about-story news-detail">
          ${resource.period ? `<div class="news-card-meta" lang="${locale}">${esc(resource.period)}</div>` : ''}
          ${body.map(paragraph => `<p lang="${locale}">${esc(paragraph)}</p>`).join('')}
          ${!body.length && source ? `<p>${f.noText}</p>` : ''}
          ${source ? `<a class="info-text-link" href="${esc(source)}" target="_blank" rel="noopener noreferrer">${f.original} <span aria-hidden="true">↗</span></a>` : ''}
        </article><div class="news-related">${back}</div>`);
    } catch (error) {
      if (!loading.isConnected) return;
      if (error.status === 404) { renderItem(container, null, state, t); return; }
      loading.innerHTML = `<div class="info-container">${header(t.publication, '', backUrl, t)}<p role="status">${f.error}</p><button class="news-reset" type="button" data-news-retry>${f.retry}</button><p>${back}</p></div>`;
      loading.querySelector('[data-news-retry]').addEventListener('click', () => renderPublishedItem(container, id, state, t, f, language));
    }
  }

  window.renderNews = function renderNews(container, params = new URLSearchParams(), language = 'ru') {
    const t = interfaceCopy[language] || interfaceCopy.ru;
    const f = feedCopy[language] || feedCopy.ru;
    const state = listState(params);
    const id = params.get('item');
    const selected = entries.find(entry => entry.id === id);
    const selection = state.edition === 'selection' || ['category', 'sort', 'size'].some(key => params.has(key));
    if (id !== null && (selected || selection || !id || id.length > 120)) {
      renderItem(container, selected, { ...state, edition: 'selection' }, t);
    } else if (id !== null) {
      renderPublishedItem(container, id, { query: state.query, page: state.page }, t, f, language);
    } else if (selection) {
      renderList(container, state, t, f);
    } else {
      renderPublishedList(container, state, t, f, language);
    }
  };

  window.getNewsPreview = function getNewsPreview() {
    const { id, title, dateLabel } = entries[0];
    return { title, dateLabel, href: route({}, id) };
  };
  window.refreshHomeNews = async function refreshHomeNews(preview, language) {
    if (!preview || !(await window.archiveApi?.ready)) return;
    try {
      const [entry] = await getPublishedNews(language);
      if (!entry || !preview.isConnected) return;
      const link = preview.querySelector('.home-news-link');
      const date = preview.querySelector('.home-news-date');
      preview.firstElementChild.textContent = (feedCopy[language] || feedCopy.ru).feed;
      link.href = route({}, entry.id);
      link.textContent = entry.title;
      link.lang = date.lang = feedLanguage(language);
      date.textContent = entry.date || '';
      date.hidden = !entry.date;
    } catch {
      // Keep the selected local story when the archive feed is unavailable.
    }
  };
}());
