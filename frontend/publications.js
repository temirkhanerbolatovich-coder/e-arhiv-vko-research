/* Editorial selection verified against the locally saved archive pages. */
(function () {
  'use strict';

  const archivePage = 'http://e-arhiv.vko.gov.kz/ru/Page/Index/';
  const publications = [
    {
      title: 'Тургусунская ГЭС — хроника строительства',
      description: 'Статья об истории гидроэнергетики Восточного Казахстана по архивным документам. В ней рассказывается о строительстве Бухтарминской ГЭС и работах на реке Тургусун.',
      source: archivePage + '1938/zirian'
    },
    {
      title: 'История Восточного Казахстана в документах зарубежных архивов',
      description: 'Материал о поиске документов по истории края в зарубежных архивах и научных учреждениях. Описана работа архивистов по выявлению и получению копий.',
      source: archivePage + '1486'
    }
  ];

  const collections = [
    {
      title: 'Рудный Алтай. 1918–1998 годы. Биография в документах',
      description: 'Сборник документов к 80-летию газеты «Рудный Алтай».'
    },
    {
      title: 'Под грифом секретности. Массовые откочевки казахов в Китай в период коллективизации. Реэмиграция. 1928–1957 годы',
      description: 'Документальное издание, подготовленное Государственным архивом Восточно-Казахстанской области.'
    },
    {
      title: 'Восточный Казахстан в годы Великой Отечественной войны. 1941–1945 годы',
      description: 'Сборник архивных документов о Восточном Казахстане в годы войны.'
    }
  ];

  const copy = {
    ru: {breadcrumb:'Навигационная цепочка',home:'Главная',all:'Все разделы',title:'Публикации и сборники',intro:'Архивная подборка статей и изданий об истории Восточного Казахстана.',languageNote:'Названия и описания приведены на русском языке источника.',articles:'Статьи',collections:'Сборники документов',collectionsNote:'Эти издания упомянуты в обзоре работы архива за 1991–2011 годы. Сведения о доступности полных текстов уточняются.',articleLink:'Открыть статью на сайте архива',listLink:'Открыть перечень изданий в обзоре архива',external:' (внешний сайт, новая вкладка; источник на русском языке)'},
    kk: {breadcrumb:'Навигация жолы',home:'Басты бет',all:'Барлық бөлімдер',title:'Жарияланымдар мен жинақтар',intro:'Шығыс Қазақстан тарихына арналған архив мақалалары мен басылымдарының таңдауы.',languageNote:'Атаулар мен сипаттамалар дереккөздің орыс тілінде берілген.',articles:'Мақалалар',collections:'Құжаттар жинақтары',collectionsNote:'Бұл басылымдар архивтің 1991–2011 жылдардағы жұмысына шолуда аталған. Толық мәтіндердің қолжетімділігі нақтылануда.',articleLink:'Мақаланы архив сайтында ашу',listLink:'Архив шолуындағы басылымдар тізімін ашу',external:' (сыртқы сайт, жаңа қойынды; дереккөз орыс тілінде)'},
    en: {breadcrumb:'Breadcrumbs',home:'Home',all:'All sections',title:'Publications and collections',intro:'A selection of archive articles and publications about the history of East Kazakhstan.',languageNote:'Titles and descriptions are shown in Russian, the source language.',articles:'Articles',collections:'Document collections',collectionsNote:'These publications are mentioned in the archive’s 1991–2011 activity review. Availability of full texts has not been confirmed.',articleLink:'Open the article on the archive website',listLink:'Open the publication list in the archive review',external:' (external website, opens in a new tab; source in Russian)'}
  };

  function card({ title, description, source }, t) {
    return `<article class="info-paper-card info-about-story">
      <h3 lang="ru">${title}</h3><p lang="ru">${description}</p>
      ${source ? sourceLink(source, t.articleLink, t.external) : ''}
    </article>`;
  }

  function sourceLink(url, label, external) {
    return `<a class="info-text-link" href="${url}" target="_blank" rel="noopener noreferrer">
      ${label} <span aria-hidden="true">↗</span><span class="sr-only">${external}</span>
    </a>`;
  }

  window.renderPublications = function renderPublications(container, language = 'ru') {
    const t = copy[language] || copy.ru;
    container.innerHTML = `<section class="info-page" aria-labelledby="publications-title">
      <div class="info-container">
        <header class="info-heading">
          <nav class="info-breadcrumb" aria-label="${t.breadcrumb}">
            <a href="#/">${t.home}</a><span aria-hidden="true">/</span>
            <a href="#/section/all">${t.all}</a><span aria-hidden="true">/</span>
            <span aria-current="page">${t.title}</span>
          </nav>
          <h1 id="publications-title">${t.title}</h1>
          <p class="info-intro">${t.intro}</p>
        </header>
        <div class="info-notice" role="note"><span class="info-notice-dot" aria-hidden="true"></span><p>${t.languageNote}</p></div>
        <section aria-labelledby="publications-articles">
          <div class="info-section-title"><h2 id="publications-articles">${t.articles}</h2></div>
          <div class="info-link-grid">${publications.map(item => card(item, t)).join('')}</div>
        </section>
        <section aria-labelledby="publications-collections">
          <div class="info-section-title"><div>
            <h2 id="publications-collections">${t.collections}</h2>
            <p>${t.collectionsNote}</p>
          </div></div>
          <div class="info-link-grid">${collections.map(item => card(item, t)).join('')}</div>
          <div class="info-section-title">${sourceLink(archivePage + '1599', t.listLink, t.external)}</div>
        </section>
      </div>
    </section>`;
  };
}());
