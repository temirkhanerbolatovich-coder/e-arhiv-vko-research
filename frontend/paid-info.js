/* Source PDFs supplied by the customer on 11 November 2026. */
(function () {
  'use strict';

  const contactsSource = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/docs/data/customer/2026-11-10/originals/' + encodeURIComponent('Контакты.docx');
  const archiveSource = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/docs/data/customer/2026-11-11/originals/' + encodeURIComponent('Платные услуги.7z');
  const text = {
    ru: {
      breadcrumbs: 'Навигационная цепочка',
      home: 'Главная',
      title: 'Платные услуги',
      eyebrow: 'СПРАВОЧНАЯ ИНФОРМАЦИЯ',
      intro: 'Постановление и прейскурант из материалов, предоставленных архивом.',
      notice: 'Реквизиты и цены приведены в исходных PDF. Перед применением уточните актуальность документа в архиве.',
      documents: 'Документы и прейскурант',
      received: 'Получено от заказчика 11 ноября 2026 года.',
      resolution: 'Постановление акимата ВКО от 15 декабря 2023 года № 289.',
      ruDocument: 'Постановление и прейскурант на русском',
      kkDocument: 'Қаулы және прейскурант қазақ тілінде',
      ruLanguage: 'Русский',
      kkLanguage: 'Қазақша',
      pages: '15 страниц',
      preview: 'Просмотреть страницы',
      download: 'Скачать PDF',
      openOriginal: 'Открыть оригинал PDF',
      newTab: 'откроется в новой вкладке',
      archiveSource: 'Архив файлов заказчика на GitHub',
      officialText: 'Официальный текст в «Әділет»',
      accessNote: 'Доступ к исходному архиву на GitHub может требовать участия в репозитории.',
      contactTitle: 'Уточнить информацию',
      contactIntro: 'По вопросам опубликованных сведений можно связаться с приёмной архива.',
      reception: 'Приёмная',
      email: 'Электронная почта',
      address: 'Адрес',
      contactNote: 'Контакты взяты из документа заказчика; актуальность уточняется.',
      contactSource: 'Источник контактных данных',
      related: 'Связанные разделы',
      publicService: 'Государственная услуга',
      branches: 'Филиалы и контакты'
    },
    kk: {
      breadcrumbs: 'Навигация жолы',
      home: 'Басты бет',
      title: 'Ақылы қызметтер',
      eyebrow: 'АНЫҚТАМАЛЫҚ АҚПАРАТ',
      intro: 'Архив ұсынған материалдардағы қаулы мен прейскурант.',
      notice: 'Деректемелер мен бағалар түпнұсқа PDF файлдарында берілген. Қолданар алдында құжаттың өзектілігін архивтен нақтылаңыз.',
      documents: 'Құжаттар мен прейскурант',
      received: 'Тапсырыс берушіден 2026 жылғы 11 қарашада алынды.',
      resolution: 'ШҚО әкімдігінің 2023 жылғы 15 желтоқсандағы № 289 қаулысы.',
      ruDocument: 'Постановление и прейскурант на русском',
      kkDocument: 'Қаулы және прейскурант қазақ тілінде',
      ruLanguage: 'Русский',
      kkLanguage: 'Қазақша',
      pages: '15 бет',
      preview: 'Беттерін қарау',
      download: 'PDF жүктеу',
      openOriginal: 'Түпнұсқа PDF файлын ашу',
      newTab: 'жаңа қойындыда ашылады',
      archiveSource: 'Тапсырыс берушінің файлдары GitHub-та',
      officialText: '«Әділеттегі» ресми мәтін',
      accessNote: 'GitHub-тағы бастапқы архивке қол жеткізу үшін репозиторийге кіру құқығы қажет болуы мүмкін.',
      contactTitle: 'Ақпаратты нақтылау',
      contactIntro: 'Жарияланған мәліметтер бойынша архивтің қабылдау бөліміне хабарласуға болады.',
      reception: 'Қабылдау бөлімі',
      email: 'Электрондық пошта',
      address: 'Мекенжай',
      contactNote: 'Байланыс деректері тапсырыс берушінің құжатынан алынған; өзектілігі нақтылануда.',
      contactSource: 'Байланыс деректерінің дереккөзі',
      related: 'Байланысты бөлімдер',
      publicService: 'Мемлекеттік қызмет',
      branches: 'Филиалдар мен байланыс'
    },
    en: {
      breadcrumbs: 'Breadcrumbs',
      home: 'Home',
      title: 'Paid services',
      eyebrow: 'REFERENCE INFORMATION',
      intro: 'The resolution and price list supplied by the archive.',
      notice: 'The original PDFs contain the document details and prices. Confirm the current status of the document with the archive before using it.',
      documents: 'Documents and price list',
      received: 'Received from the customer on 11 November 2026.',
      resolution: 'Resolution of the East Kazakhstan regional administration dated 15 December 2023, No. 289.',
      ruDocument: 'Постановление и прейскурант на русском',
      kkDocument: 'Қаулы және прейскурант қазақ тілінде',
      ruLanguage: 'Russian',
      kkLanguage: 'Kazakh',
      pages: '15 pages',
      preview: 'View pages',
      download: 'Download PDF',
      openOriginal: 'Open original PDF',
      newTab: 'opens in a new tab',
      archiveSource: 'Customer source archive on GitHub',
      officialText: 'Official text in Russian on Adilet',
      accessNote: 'The source archive on GitHub may require repository access.',
      contactTitle: 'Clarify the information',
      contactIntro: 'Contact the archive reception desk with questions about the published information.',
      reception: 'Reception',
      email: 'Email',
      address: 'Address',
      contactNote: 'Contact details come from the customer document and need confirmation.',
      contactSource: 'Contact details source',
      related: 'Related sections',
      publicService: 'Public service',
      branches: 'Branches and contacts'
    }
  };

  const documents = [
    {id: 'pricelist-ru', language: 'ru', titleKey: 'ruDocument', languageKey: 'ruLanguage'},
    {id: 'pricelist-kk', language: 'kk', titleKey: 'kkDocument', languageKey: 'kkLanguage'}
  ];

  function documentCard(document, t) {
    const original = 'assets/docs/' + document.id + '.pdf';
    return `<article class="paid-info-document">
      <h3 lang="${document.language}">${t[document.titleKey]}</h3>
      <p>${t[document.languageKey]} · PDF · ${t.pages}</p>
      <div class="paid-info-document-actions">
        <a class="paid-info-preview" href="#/document?file=${document.id}">${t.preview} <span aria-hidden="true">→</span></a>
        <a href="${original}" download="${document.id}.pdf">${t.download}</a>
        <a href="${original}" target="_blank" rel="noopener noreferrer">${t.openOriginal} <span aria-hidden="true">↗</span><span class="sr-only"> (${t.newTab})</span></a>
      </div>
    </article>`;
  }

  window.renderPaidInfo = function renderPaidInfo(container, language = 'ru') {
    const t = text[language] || text.ru;
    const officialTextUrl = 'https://adilet.zan.kz/' + (language === 'kk' ? 'kaz' : 'rus') + '/docs/G23V000289A';
    container.innerHTML = `<section class="paid-info-page" aria-labelledby="paid-info-title">
      <div class="paid-info-shell">
        <nav class="paid-info-breadcrumb" aria-label="${t.breadcrumbs}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
        <header class="paid-info-heading"><p class="paid-info-eyebrow">${t.eyebrow}</p><h1 id="paid-info-title">${t.title}</h1><p>${t.intro}</p></header>
        <p class="paid-info-notice" role="note">${t.notice}</p>
        <div class="paid-info-grid">
          <section class="paid-info-documents" aria-labelledby="paid-documents-title">
            <h2 id="paid-documents-title">${t.documents}</h2>
            <p class="paid-info-lead">${t.received}</p>
            <p class="paid-info-lead">${t.resolution}</p>
            <a class="paid-info-source" href="${officialTextUrl}" target="_blank" rel="noopener noreferrer">${t.officialText} <span aria-hidden="true">↗</span></a>
            ${documents.map(document => documentCard(document, t)).join('')}
            <div class="paid-info-provenance">
              <a class="paid-info-source" href="${archiveSource}" target="_blank" rel="noopener noreferrer">${t.archiveSource} <span aria-hidden="true">↗</span></a>
              <p class="paid-info-source-note">${t.accessNote}</p>
            </div>
          </section>
          <aside class="paid-info-contact" aria-labelledby="paid-contact-title">
            <h2 id="paid-contact-title">${t.contactTitle}</h2><p>${t.contactIntro}</p>
            <dl>
              <div><dt>${t.reception}</dt><dd><a href="tel:+77232255976">8 (7232) 25-59-76</a></dd></div>
              <div><dt>${t.email}</dt><dd><a href="mailto:arhiv-ukg@yandex.kz">arhiv-ukg@yandex.kz</a></dd></div>
              <div><dt>${t.address}</dt><dd lang="ru">г. Усть-Каменогорск,<br>ул. Бейбітшілік, 26/1</dd></div>
            </dl>
            <p class="paid-info-source-note">${t.contactNote}</p>
            <a class="paid-info-source" href="${contactsSource}" target="_blank" rel="noopener noreferrer">${t.contactSource} <span aria-hidden="true">↗</span></a>
          </aside>
        </div>
        <nav class="paid-info-links" aria-label="${t.related}">
          <a href="#/section/services"><span>${t.publicService}</span><span aria-hidden="true">→</span></a>
          <a href="#/section/branches"><span>${t.branches}</span><span aria-hidden="true">→</span></a>
        </nav>
      </div>
    </section>`;
  };
}());
