/* Выдача электронного каталога с сервера: карточки результатов, счётчик, пагинация (ТЗ 5.3). */
(function () {
  'use strict';
  const text = {
    ru: { loading: 'Ищем…', found: 'Найдено: ', none: 'Ничего не найдено', kinds: { fund: 'Фонд', inventory: 'Опись', case: 'Дело', document: 'Документ', photo: 'Фотодокумент', newspaper: 'Газета', page: 'Страница', news: 'Новость', event: 'Памятная дата', person: 'Персона' }, open: 'Открыть карточку', copy: 'Есть цифровая копия', meta: 'Только описание', restricted: 'Ограниченный доступ', demo: 'демо', semantic: 'Учтён смысл запроса', error: 'Не удалось загрузить результаты. Попробуйте ещё раз.', emptyHint: 'Измените запрос, уберите часть фильтров или спросите помощника.', reset: 'Сбросить поиск' },
    kk: { loading: 'Іздеп жатырмыз…', found: 'Табылды: ', none: 'Ештеңе табылмады', kinds: { fund: 'Қор', inventory: 'Тізімдеме', case: 'Іс', document: 'Құжат', photo: 'Фотоқұжат', newspaper: 'Газет', page: 'Бет', news: 'Жаңалық', event: 'Есте қаларлық күн', person: 'Тұлға' }, open: 'Карточканы ашу', copy: 'Цифрлық көшірмесі бар', meta: 'Тек сипаттама', restricted: 'Қолжетімділігі шектеулі', demo: 'демо', semantic: 'Сұраудың мағынасы ескерілді', error: 'Нәтижелер жүктелмеді. Қайталап көріңіз.', emptyHint: 'Сұрауды өзгертіңіз немесе көмекшіден сұраңыз.', reset: 'Іздеуді тазарту' },
    en: { loading: 'Searching…', found: 'Found: ', none: 'Nothing found', kinds: { fund: 'Fund', inventory: 'Inventory', case: 'Case', document: 'Document', photo: 'Photograph', newspaper: 'Newspaper', page: 'Page', news: 'News', event: 'Memorable date', person: 'Person' }, open: 'Open record', copy: 'Digital copy available', meta: 'Description only', restricted: 'Restricted access', demo: 'demo', semantic: 'Query meaning considered', error: 'Could not load results. Please try again.', emptyHint: 'Change the query, remove some filters or ask the assistant.', reset: 'Reset search' },
  };

  function card(item, l, returnQuery) {
    const esc = window.archiveApi.escape;
    const hasCopy = item.access === 'open' && item.copyStatus === 'available';
    const access = item.access === 'restricted' ? l.restricted : hasCopy ? l.copy : l.meta;
    const href = `#/resource/${encodeURIComponent(item.id)}${returnQuery}`;
    return `<article class="catalog-result-card">
      <div class="catalog-result-top"><span class="catalog-kind">${esc(l.kinds[item.kind] || item.kind)}${item.isDemo ? ` · ${l.demo}` : ''}</span><span class="catalog-period">${esc(item.period || '')}</span></div>
      ${item.reference ? `<p class="catalog-result-number"><span lang="ru">${esc(item.reference)}</span></p>` : ''}
      <h2 class="catalog-result-title" lang="ru"><a href="${href}">${esc(item.title)}</a></h2>
      ${hasCopy && item.imageUrl ? `<img class="catalog-result-thumb" src="${esc(item.imageUrl)}" alt="" loading="lazy">` : ''}
      ${item.snippet ? `<p class="catalog-result-summary" lang="ru">${esc(item.snippet)}</p>` : ''}
      <div class="catalog-result-bottom"><span>${esc(access)}${item.branchName ? ' · ' + esc(item.branchName) : ''}</span><a class="catalog-details-toggle" href="${href}">${l.open} →</a></div>
    </article>`;
  }

  async function render(ctx) {
    const l = text[ctx.language] || text.ru;
    const pageLimitHint = {
      ru: 'Достигнут предел страниц. Уточните запрос или фильтры, чтобы увидеть другие результаты.',
      kk: 'Беттер шегіне жетті. Басқа нәтижелерді көру үшін сұрауды немесе сүзгілерді нақтылаңыз.',
      en: 'The page limit has been reached. Refine your query or filters to see other results.'
    };
    const params = new URLSearchParams(ctx.params);
    params.set('page', String(ctx.page));
    params.set('locale', ctx.language);
    ctx.count.textContent = l.loading;
    ctx.result.setAttribute('aria-busy', 'true');
    try {
      const data = await window.archiveApi.get('/catalog?' + params.toString());
      if (!ctx.isCurrent()) return; // устаревший ответ после смены фильтров
      const pageCount = Math.max(1, Math.ceil(data.total / data.size));
      const actualPage = Math.min(ctx.page, pageCount, data.page);
      if (ctx.page !== actualPage) {
        ctx.setPage(actualPage);
        return;
      }
      ctx.count.textContent = data.total ? l.found + data.total.toLocaleString('ru-RU') + (data.semantic ? ' · ' + l.semantic : '') : l.none;
      const catalogHash = '#/catalog' + (ctx.params.size ? '?' + ctx.params : '');
      const returnQuery = '?' + new URLSearchParams({ from: catalogHash });
      ctx.result.innerHTML = data.total ? data.items.map((item) => card(item, l, returnQuery)).join('')
        : `<div class="catalog-empty"><span class="catalog-empty-icon" aria-hidden="true">⌕</span><h3>${l.none}</h3><p>${l.emptyHint}</p><button type="button" class="catalog-empty-reset">${l.reset}</button></div>`;
      ctx.pagination.hidden = data.total === 0;
      const limitReached = data.page >= 1000 && pageCount > data.page;
      ctx.pageStatus.textContent = ctx.t.pagePrefix + data.page + ctx.t.pageOf + pageCount + (limitReached ? ' · ' + (pageLimitHint[ctx.language] || pageLimitHint.ru) : '');
      ctx.previousPage.disabled = data.page <= 1;
      ctx.nextPage.disabled = data.page >= pageCount || limitReached;
      ctx.result.querySelector('.catalog-empty-reset')?.addEventListener('click', ctx.onReset);
      ctx.container.querySelector('.catalog-demo-note')?.setAttribute('hidden', '');
      ctx.container.querySelector('#catalog-extra-note')?.setAttribute('hidden', '');
    } catch (error) {
      if (!ctx.isCurrent()) return;
      ctx.count.textContent = error.status === 400 ? error.message : l.error;
      ctx.result.innerHTML = '';
      ctx.pagination.hidden = true;
    } finally {
      if (ctx.isCurrent()) ctx.result.removeAttribute('aria-busy');
    }
  }

  window.archiveCatalogLive = { render };
}());
