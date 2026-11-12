/* Fonds and descriptions were checked against the archive site snapshot from 8 November 2026. */
(function () {
  'use strict';

  const guideUrl = 'http://e-arhiv.vko.gov.kz/ru/Page/Index/1352';
  const funds = [
    {
      name: 'Сарсен Аманжолов',
      reference: 'Фонд 1299 · опись 1',
      period: '1915–2004',
      description: 'В описании фонда языковеда указаны научные труды по казахскому языку, статьи, стихи, переписка и фотографии.',
      url: 'http://e-arhiv.vko.gov.kz/ru/Page/Index/1403'
    },
    {
      name: 'Оралхан Бөкеев',
      reference: 'Фонд 1407 · опись 1',
      period: '1961–2004',
      description: 'В путеводителе фонда писателя и драматурга перечислены статьи, очерки, рассказы, стихи и материалы о его творчестве.',
      url: 'http://e-arhiv.vko.gov.kz/ru/Page/Index/1684'
    },
    {
      name: 'Борис Герасимов',
      reference: 'Фонд 1070 · опись 1',
      period: '1891–1936',
      description: 'В описании фонда краеведа упоминаются научные труды, переписка, записи сказок и газетные вырезки об истории Восточного Казахстана.',
      url: 'http://e-arhiv.vko.gov.kz/ru/Page/Index/1408'
    }
  ];

  const copy = {
    ru: { breadcrumb:'Навигационная цепочка', home:'Главная', sections:'Все разделы', title:'Личные фонды', intro:'Личные фонды помогают изучать историю края через документы отдельных людей: рукописи, переписку, фотографии и другие материалы.', notice:'Здесь приведены примеры из путеводителя прежнего сайта архива. Актуальный состав фондов и условия доступа уточняйте в архиве.', original:'Названия, шифры и описания приведены на русском языке источника.', dates:'Крайние даты по путеводителю', fundLink:'Описание фонда', label:'Описание фонда на сайте архива', external:'откроется в новой вкладке; источник на русском языке', sources:'Источники и контакты', sourcesText:'Шифры и крайние даты приведены по архивному путеводителю.', guide:'Путеводитель прежнего сайта', branches:'Филиалы и контакты' },
    kk: { breadcrumb:'Навигация жолы', home:'Басты бет', sections:'Барлық бөлімдер', title:'Жеке тектік қорлар', intro:'Жеке тектік қорлар өңір тарихын адамдардың құжаттары — қолжазбалар, хаттар, фотосуреттер және басқа материалдар арқылы зерттеуге көмектеседі.', notice:'Мұнда архивтің бұрынғы сайтындағы жолсілткіштен мысалдар берілген. Қорлардың қазіргі құрамы мен қолжетімділік шарттарын архивтен нақтылаңыз.', original:'Атаулар, шифрлар және сипаттамалар дереккөздің орыс тілінде берілген.', dates:'Жолсілткіш бойынша шеткі даталар', fundLink:'Қор сипаттамасы', label:'Архив сайтындағы қор сипаттамасы', external:'жаңа қойындыда ашылады; дереккөз орыс тілінде', sources:'Дереккөздер және байланыс', sourcesText:'Шифрлар мен шеткі даталар архив жолсілткіші бойынша берілген.', guide:'Бұрынғы сайттағы жолсілткіш', branches:'Филиалдар және байланыс' },
    en: { breadcrumb:'Breadcrumbs', home:'Home', sections:'All sections', title:'Personal fonds', intro:'Personal fonds help explore the region’s history through individuals’ manuscripts, correspondence, photographs and other documents.', notice:'These examples come from the guide on the archive’s former website. Ask the archive about the current contents of the fonds and conditions of access.', original:'Names, references and descriptions are shown in Russian, the source language.', dates:'Date range according to the guide', fundLink:'Fond description', label:'Fond description on the archive website', external:'opens in a new tab; source in Russian', sources:'Sources and contacts', sourcesText:'References and date ranges are taken from the archive guide.', guide:'Guide on the former website', branches:'Branches and contacts' }
  };

  function fundCard({ name, reference, period, description, url }, t) {
    return `<article class="info-paper-card info-about-story">
      <h2 lang="ru">${name}</h2>
      <p><strong lang="ru">${reference}</strong><br>${t.dates}: ${period}</p>
      <p lang="ru">${description}</p>
      <a class="info-text-link" href="${url}" target="_blank" rel="noopener noreferrer"
        aria-label="${t.label} — ${name}, ${t.external}">
        ${t.fundLink} <span aria-hidden="true">↗</span>
      </a>
    </article>`;
  }

  window.renderPersonalFunds = function renderPersonalFunds(container, language = 'ru') {
    const t = copy[language] || copy.ru;
    container.innerHTML = `
      <section class="info-page" aria-labelledby="personal-funds-title">
        <div class="info-container">
          <header class="info-heading">
            <nav class="info-breadcrumb" aria-label="${t.breadcrumb}">
              <a href="#/">${t.home}</a><span aria-hidden="true">/</span>
              <a href="#/section/all">${t.sections}</a><span aria-hidden="true">/</span>
              <span aria-current="page">${t.title}</span>
            </nav>
            <h1 id="personal-funds-title">${t.title}</h1>
            <p class="info-intro">${t.intro}</p>
          </header>
          <div class="info-notice" role="note">
            <span class="info-notice-dot" aria-hidden="true"></span>
            <p>${t.notice} ${t.original}</p>
          </div>
          <div class="info-link-grid">
            ${funds.map(fund => fundCard(fund, t)).join('')}
          </div>
          <div class="info-section-title">
            <h2>${t.sources}</h2>
          </div>
          <div class="info-paper-card info-about-story">
            <p>${t.sourcesText}</p>
            <p><a class="info-text-link" href="${guideUrl}" target="_blank" rel="noopener noreferrer">
              ${t.guide} <span aria-hidden="true">↗</span><span class="sr-only"> (${t.external})</span>
            </a></p>
            <a class="info-text-link" href="#/section/branches">${t.branches} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>`;
  };
}());
