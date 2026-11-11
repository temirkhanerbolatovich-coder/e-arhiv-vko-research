/* Preview pages are rendered from the unchanged customer-provided PDFs. */
(function () {
  'use strict';

  const documents = {
    'pricelist-ru': { language: 'ru', pages: 15, pdf: 'assets/docs/pricelist-ru.pdf' },
    'pricelist-kk': { language: 'kk', pages: 15, pdf: 'assets/docs/pricelist-kk.pdf' }
  };
  const labels = {
    ru: {
      title: 'Постановление и прейскурант',
      home: 'Главная',
      paid: 'Платные услуги',
      breadcrumbs: 'Навигационная цепочка',
      intro: 'Постановление акимата ВКО от 15 декабря 2023 года № 289. Выберите страницу или откройте исходный PDF.',
      documentLanguage: 'Язык документа',
      russian: 'Русский',
      kazakh: 'Қазақша',
      openPdf: 'Открыть исходный PDF',
      downloadPdf: 'Скачать PDF',
      newTab: 'откроется в новой вкладке',
      page: 'Страница',
      of: 'из',
      previous: 'Предыдущая',
      next: 'Следующая',
      zoom: 'Масштаб',
      fit: 'По ширине',
      scroll: 'Страница документа. При увеличении прокручивайте изображение внутри области.',
      loading: 'Загрузка страницы…',
      ready: 'Страница загружена',
      error: 'Не удалось загрузить страницу. Повторите попытку или откройте исходный PDF.',
      retry: 'Повторить загрузку',
      scanNote: 'Показаны изображения страниц исходного документа. Текст и таблицы можно увеличить.',
      missing: 'Документ не найден',
      missingHint: 'Выберите документ на странице платных услуг.',
      back: 'Вернуться к платным услугам'
    },
    kk: {
      title: 'Қаулы және прейскурант',
      home: 'Басты бет',
      paid: 'Ақылы қызметтер',
      breadcrumbs: 'Навигация жолы',
      intro: 'ШҚО әкімдігінің 2023 жылғы 15 желтоқсандағы № 289 қаулысы. Парақты таңдаңыз немесе бастапқы PDF файлын ашыңыз.',
      documentLanguage: 'Құжат тілі',
      russian: 'Орысша',
      kazakh: 'Қазақша',
      openPdf: 'Бастапқы PDF файлын ашу',
      downloadPdf: 'PDF жүктеп алу',
      newTab: 'жаңа қойындыда ашылады',
      page: 'Парақ',
      of: '/',
      previous: 'Алдыңғы',
      next: 'Келесі',
      zoom: 'Масштаб',
      fit: 'Ені бойынша',
      scroll: 'Құжат парағы. Үлкейткенде суретті осы аймақтың ішінде айналдырыңыз.',
      loading: 'Парақ жүктелуде…',
      ready: 'Парақ жүктелді',
      error: 'Парақты жүктеу мүмкін болмады. Қайталаңыз немесе бастапқы PDF файлын ашыңыз.',
      retry: 'Қайта жүктеу',
      scanNote: 'Бастапқы құжат парақтарының суреттері көрсетілген. Мәтін мен кестелерді үлкейтуге болады.',
      missing: 'Құжат табылмады',
      missingHint: 'Ақылы қызметтер бетінен құжатты таңдаңыз.',
      back: 'Ақылы қызметтерге оралу'
    },
    en: {
      title: 'Resolution and price list',
      home: 'Home',
      paid: 'Paid services',
      breadcrumbs: 'Breadcrumbs',
      intro: 'Resolution of the East Kazakhstan regional administration dated 15 December 2023, No. 289. Choose a page or open the original PDF.',
      documentLanguage: 'Document language',
      russian: 'Russian',
      kazakh: 'Kazakh',
      openPdf: 'Open original PDF',
      downloadPdf: 'Download PDF',
      newTab: 'opens in a new tab',
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next',
      zoom: 'Zoom',
      fit: 'Fit width',
      scroll: 'Document page. When zoomed in, scroll the image within this area.',
      loading: 'Loading page…',
      ready: 'Page loaded',
      error: 'Could not load this page. Try again or open the original PDF.',
      retry: 'Try again',
      scanNote: 'These images show pages from the original document. Zoom in to read the text and tables.',
      missing: 'Document not found',
      missingHint: 'Choose a document on the paid services page.',
      back: 'Back to paid services'
    }
  };

  function pageNumber(value, maximum) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 1) return 1;
    return Math.min(number, maximum);
  }

  function documentUrl(file, page, zoom) {
    const params = new URLSearchParams({ file, page: String(page) });
    if (zoom !== 'fit') params.set('zoom', zoom);
    return '#/document?' + params;
  }

  window.renderDocumentViewer = function renderDocumentViewer(container, params, language = 'ru') {
    const t = labels[language] || labels.ru;
    const query = params instanceof URLSearchParams ? params : new URLSearchParams();
    const file = query.get('file');
    if (!Object.hasOwn(documents, file)) {
      container.innerHTML = `<section class="document-page"><div class="document-shell">
        <h1>${t.missing}</h1><p>${t.missingHint}</p>
        <a class="document-back" href="#/section/paid">← ${t.back}</a>
      </div></section>`;
      return;
    }

    const fileInfo = documents[file];
    let currentPage = pageNumber(query.get('page'), fileInfo.pages);
    let zoom = ['100', '150', '200'].includes(query.get('zoom')) ? query.get('zoom') : 'fit';
    let requestVersion = 0;
    container.innerHTML = `<section class="document-page" aria-labelledby="document-title"><div class="document-shell">
      <nav class="document-breadcrumbs" aria-label="${t.breadcrumbs}">
        <a href="#/">${t.home}</a><span aria-hidden="true">/</span>
        <a href="#/section/paid">${t.paid}</a><span aria-hidden="true">/</span>
        <span aria-current="page">${t.title}</span>
      </nav>
      <header class="document-heading"><h1 id="document-title">${t.title}</h1><p>${t.intro}</p></header>
      <div class="document-file-actions">
        <a href="${fileInfo.pdf}" target="_blank" rel="noopener noreferrer">${t.openPdf} ↗<span class="sr-only"> (${t.newTab})</span></a>
        <a href="${fileInfo.pdf}" download>${t.downloadPdf} ↓</a>
      </div>
      <nav class="document-languages" aria-label="${t.documentLanguage}">
        <span>${t.documentLanguage}</span>
        <a href="${documentUrl('pricelist-ru', currentPage, zoom)}" lang="ru" ${fileInfo.language === 'ru' ? 'aria-current="page"' : ''}>Русский</a>
        <a href="${documentUrl('pricelist-kk', currentPage, zoom)}" lang="kk" ${fileInfo.language === 'kk' ? 'aria-current="page"' : ''}>Қазақша</a>
      </nav>
      <div class="document-toolbar">
        <button type="button" class="document-previous">← ${t.previous}</button>
        <label for="document-page-number">${t.page}
          <select id="document-page-number">${Array.from({length: fileInfo.pages}, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join('')}</select>
          <span class="document-page-count">${t.of} ${fileInfo.pages}</span>
        </label>
        <button type="button" class="document-next">${t.next} →</button>
        <label for="document-zoom">${t.zoom}<select id="document-zoom"><option value="fit">${t.fit}</option><option value="100">100%</option><option value="150">150%</option><option value="200">200%</option></select></label>
      </div>
      <p class="document-load-status" role="status" aria-live="polite"></p>
      <div class="document-canvas" role="region" aria-label="${t.scroll}" tabindex="0" aria-busy="true">
        <img class="document-image" hidden>
      </div>
      <button class="document-retry" type="button" hidden>${t.retry}</button>
      <p class="document-caption">${t.scanNote}</p>
      <a class="document-back" href="#/section/paid">← ${t.back}</a>
    </div></section>`;

    const viewer = container.querySelector('.document-page');
    const selectPage = viewer.querySelector('#document-page-number');
    const selectZoom = viewer.querySelector('#document-zoom');
    const previous = viewer.querySelector('.document-previous');
    const next = viewer.querySelector('.document-next');
    const canvas = viewer.querySelector('.document-canvas');
    const status = viewer.querySelector('.document-load-status');
    const retry = viewer.querySelector('.document-retry');
    let image = viewer.querySelector('.document-image');

    function updateUrl() {
      history.replaceState(null, '', documentUrl(file, currentPage, zoom));
      viewer.querySelectorAll('.document-languages a').forEach(link => {
        const id = link.lang === 'ru' ? 'pricelist-ru' : 'pricelist-kk';
        link.href = documentUrl(id, currentPage, zoom);
      });
    }

    function applyZoom() {
      image.style.width = zoom === 'fit' ? '100%' : (1400 * Number(zoom) / 100) + 'px';
      selectZoom.value = zoom;
      updateUrl();
    }

    function loadPage() {
      const version = ++requestVersion;
      const newImage = new Image();
      newImage.className = 'document-image';
      newImage.alt = t.title + ' — ' + t.page + ' ' + currentPage + ' ' + t.of + ' ' + fileInfo.pages;
      newImage.hidden = true;
      newImage.decoding = 'async';
      image.replaceWith(newImage);
      image = newImage;
      selectPage.value = String(currentPage);
      previous.disabled = currentPage === 1;
      next.disabled = currentPage === fileInfo.pages;
      status.textContent = t.loading;
      canvas.setAttribute('aria-busy', 'true');
      retry.hidden = true;
      canvas.scrollTop = 0;
      canvas.scrollLeft = 0;
      applyZoom();
      newImage.addEventListener('load', () => {
        if (version !== requestVersion || !viewer.isConnected) return;
        newImage.hidden = false;
        canvas.setAttribute('aria-busy', 'false');
        status.textContent = t.ready + ' · ' + t.page + ' ' + currentPage + ' ' + t.of + ' ' + fileInfo.pages;
      });
      newImage.addEventListener('error', () => {
        if (version !== requestVersion || !viewer.isConnected) return;
        canvas.setAttribute('aria-busy', 'false');
        status.textContent = t.error;
        retry.hidden = false;
      });
      newImage.src = 'assets/docs/' + file + '-' + String(currentPage).padStart(2, '0') + '.webp';
    }

    previous.addEventListener('click', () => {
      if (currentPage === 1) return;
      currentPage -= 1;
      loadPage();
    });
    next.addEventListener('click', () => {
      if (currentPage === fileInfo.pages) return;
      currentPage += 1;
      loadPage();
    });
    selectPage.addEventListener('change', () => {
      currentPage = pageNumber(selectPage.value, fileInfo.pages);
      loadPage();
    });
    selectZoom.addEventListener('change', () => {
      zoom = selectZoom.value;
      applyZoom();
    });
    retry.addEventListener('click', loadPage);
    loadPage();
  };
}());
