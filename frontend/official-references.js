/* Official reference links checked on 2026-11-11. */
(function () {
  'use strict';

  const regulations = [
    {
      title: 'Прейскурант государственных архивов ВКО',
      description: 'Постановление акимата Восточно-Казахстанской области от 15 декабря 2023 года № 289. Сканированные версии доступны в разделе платных услуг.',
      href: 'https://adilet.zan.kz/rus/docs/G23V000289A'
    },
    {
      title: 'О Национальном архивном фонде и архивах',
      description: 'Закон Республики Казахстан от 22 декабря 1998 года № 326-1. Дата изменения в карточке акта — 25 августа 2026 года.',
      href: 'https://adilet.zan.kz/rus/docs/Z980000326_'
    },
    {
      title: 'Правила работы государственных и специальных государственных архивов',
      description: 'Приказ от 9 августа 2023 года № 215 о комплектовании, хранении, учёте и использовании архивных документов. Дата изменения в карточке акта — 12 июля 2026 года.',
      href: 'https://adilet.zan.kz/rus/docs/V2300033290'
    },
    {
      title: 'Правила оказания государственных услуг в области архивного дела',
      description: 'Приказ от 29 мая 2020 года № 159. Дата изменения в карточке акта — 24 июня 2026 года.',
      href: 'https://adilet.zan.kz/rus/docs/V2000020790'
    }
  ];

  const symbolCopy = {
    ru: {
      home: 'Главная', sections: 'Все разделы', breadcrumb: 'Навигационная цепочка',
      title: 'Государственные символы Казахстана',
      intro: 'Флаг, герб и гимн Республики Казахстан. Изображения и сведения представлены по материалам официального сайта Президента Республики Казахстан.',
      official: 'Открыть на сайте Акорды', external: 'Внешний сайт, откроется в новой вкладке; источник на русском языке',
      flag: 'Государственный флаг', flagDescription: 'Описание флага, солнца, орла и национального орнамента.',
      emblem: 'Государственный герб', emblemDescription: 'Описание герба, шанырака и крылатых тулпаров.',
      anthem: 'Государственный гимн', anthemDescription: 'Текст гимна, сведения об авторах и аудиозапись на официальном сайте.'
    },
    kk: {
      home: 'Басты бет', sections: 'Барлық бөлімдер', breadcrumb: 'Навигация жолы',
      title: 'Қазақстанның мемлекеттік рәміздері',
      intro: 'Қазақстан Республикасының Туы, Елтаңбасы және Әнұраны. Суреттер мен мәліметтер Қазақстан Республикасы Президентінің ресми сайтынан алынған.',
      official: 'Ақорда сайтында ашу', external: 'Сыртқы сайт жаңа бетте ашылады; дереккөз орыс тілінде',
      flag: 'Мемлекеттік Ту', flagDescription: 'Тудың, күннің, қыранның және ұлттық өрнектің сипаттамасы.',
      emblem: 'Мемлекеттік Елтаңба', emblemDescription: 'Елтаңбаның, шаңырақтың және қанатты тұлпарлардың сипаттамасы.',
      anthem: 'Мемлекеттік Әнұран', anthemDescription: 'Әнұран мәтіні, авторлар туралы мәлімет және аудиожазба ресми сайтта берілген.'
    },
    en: {
      home: 'Home', sections: 'All sections', breadcrumb: 'Breadcrumbs',
      title: 'State symbols of Kazakhstan',
      intro: 'The flag, emblem and anthem of the Republic of Kazakhstan. Images and information are from the official website of the President of Kazakhstan.',
      official: 'Open on the Akorda website', external: 'External website, opens in a new tab; source in Russian',
      flag: 'State flag', flagDescription: 'Description of the flag, sun, eagle and national ornament.',
      emblem: 'State emblem', emblemDescription: 'Description of the emblem, shanyrak and winged horses.',
      anthem: 'State anthem', anthemDescription: 'The anthem text, information about its authors and an audio recording are available on the official website.'
    }
  };

  const officialLinks = [
    {
      title: 'Ақорда',
      description: 'Официальный сайт Президента Республики Казахстан.',
      href: 'https://www.akorda.kz/ru'
    },
    {
      title: 'Акимат Восточно-Казахстанской области',
      description: 'Новости, документы и справочная информация о регионе.',
      href: 'https://www.gov.kz/memleket/entities/akimvko?lang=ru'
    },
    {
      title: 'Управление цифровизации и архивов ВКО',
      description: 'Документы и контакты профильного управления области.',
      href: 'https://www.gov.kz/org/vko-uca?lang=ru'
    },
    {
      title: '«Батырларға тағзым»',
      description: 'Мемориальный портал о казахстанских участниках Великой Отечественной войны.',
      href: 'https://batyrlarga-tagzym.kz/'
    }
  ];

  function referenceCard({ title, description, href }) {
    return `<a class="info-link-card" href="${href}" target="_blank" rel="noopener noreferrer">
      <span class="info-link-copy"><span class="info-link-title">${title}</span><span class="info-link-description">${description}</span></span>
      <span class="info-link-arrow" aria-hidden="true">↗</span><span class="sr-only"> (внешний сайт, новая вкладка)</span>
    </a>`;
  }

  function renderReferences(container, title, intro, entries) {
    container.innerHTML = `<section class="info-page" aria-labelledby="official-references-title"><div class="info-container">
      <header class="info-heading">
        <nav class="info-breadcrumb" aria-label="Навигационная цепочка"><a href="#/">Главная</a><span aria-hidden="true">/</span><a href="#/section/all">Все разделы</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav>
        <h1 id="official-references-title">${title}</h1><p class="info-intro">${intro}</p>
      </header>
      <div class="info-link-grid">${entries.map(referenceCard).join('')}</div>
    </div></section>`;
  }

  const normativeCopy = {
    ru: {home:'Главная', sections:'Все разделы', breadcrumb:'Навигационная цепочка', title:'Нормативные документы', intro:'Основные документы по архивному делу. Действующую редакцию проверяйте в ИПС «Әділет»; ссылки проверены 11 ноября 2026 года.', source:'ИПС «Әділет» · текст на русском языке', open:'Открыть документ', external:' (внешний сайт, новая вкладка)'},
    kk: {home:'Басты бет', sections:'Барлық бөлімдер', breadcrumb:'Навигация жолы', title:'Нормативтік құжаттар', intro:'Архив ісі жөніндегі негізгі құжаттар. Қолданыстағы редакциясын «Әділет» жүйесінен тексеріңіз; сілтемелер 2026 жылғы 11 қарашада тексерілді.', source:'«Әділет» АҚЖ · мәтін орыс тілінде', open:'Құжатты ашу', external:' (сыртқы сайт, жаңа қойындыда)'},
    en: {home:'Home', sections:'All sections', breadcrumb:'Breadcrumbs', title:'Regulatory documents', intro:'Key documents on archival work. Check the current version on Adilet; links were checked on 11 November 2026.', source:'Adilet · text in Russian', open:'Open document', external:' (external website, opens in a new tab)'}
  };
  window.renderNormativeDocuments = function (container, language = 'ru') {
    const t = normativeCopy[language] || normativeCopy.ru;
    container.innerHTML = `<section class="info-page normative-page" aria-labelledby="official-references-title"><div class="info-container">
      <header class="info-heading"><nav class="info-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/section/all">${t.sections}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <h1 id="official-references-title">${t.title}</h1><p class="info-intro">${t.intro}</p></header>
      <div class="normative-list">${regulations.map(entry => `<article class="normative-item"><div><p class="normative-source">${t.source}</p><h2 lang="ru">${entry.title}</h2><p lang="ru">${entry.description}</p></div><a href="${entry.href}" target="_blank" rel="noopener noreferrer">${t.open} <span aria-hidden="true">↗</span><span class="sr-only">${t.external}</span></a></article>`).join('')}</div>
    </div></section>`;
  };

  window.renderStateSymbols = function (container, language = 'ru') {
    const t = symbolCopy[language] || symbolCopy.ru;
    const cards = [
      {title: t.flag, description: t.flagDescription, image: 'assets/kz-flag.jpg', href: 'https://www.akorda.kz/ru/state_symbols/kazakhstan_flag?lang=ru'},
      {title: t.emblem, description: t.emblemDescription, image: 'assets/kz-emblem.png', href: 'https://www.akorda.kz/ru/state_symbols/kazakhstan_emblem'},
      {title: t.anthem, description: t.anthemDescription, href: 'https://www.akorda.kz/ru/state_symbols/kazakhstan_anthem'}
    ];
    container.innerHTML = `<section class="info-page symbols-page" aria-labelledby="symbols-title"><div class="info-container">
      <header class="info-heading"><nav class="info-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/section/all">${t.sections}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <h1 id="symbols-title">${t.title}</h1><p class="info-intro">${t.intro}</p></header>
      <div class="symbols-grid">${cards.map(card => `<article class="symbols-card">
        ${card.image ? `<div class="symbols-image"><img src="${card.image}" alt="${card.title}"></div>` : ''}
        <div class="symbols-content"><h2>${card.title}</h2><p>${card.description}</p><a href="${card.href}" target="_blank" rel="noopener noreferrer">${t.official} <span aria-hidden="true">↗</span><span class="sr-only"> — ${t.external}</span></a></div>
      </article>`).join('')}</div></div></section>`;
  };

  const linksCopy = {
    ru: {title:'Полезные ссылки', intro:'Государственные ресурсы и открытые материалы по истории Казахстана. Ссылки ведут на внешние сайты.', external:'Внешний сайт, новая вкладка; страница может быть на русском языке'},
    kk: {title:'Пайдалы сілтемелер', intro:'Қазақстан тарихы туралы мемлекеттік ресурстар мен ашық материалдар. Сілтемелер сыртқы сайттарға апарады.', external:'Сыртқы сайт жаңа қойындыда ашылады; бет орыс тілінде болуы мүмкін', descriptions:['Қазақстан Республикасы Президентінің ресми сайты.','Өңірдің жаңалықтары, құжаттары және анықтамалық ақпараты.','Облыстың бейінді басқармасының құжаттары мен байланыстары.','Ұлы Отан соғысына қатысқан қазақстандықтар туралы мемориалдық портал.']},
    en: {title:'Useful links', intro:'Government resources and open materials on the history of Kazakhstan. Links lead to external websites.', external:'External website, opens in a new tab; the page may be in Russian', descriptions:['Official website of the President of Kazakhstan.','Regional news, documents and visitor information.','Documents and contacts of the regional department.','Memorial portal about Kazakhstan participants in the Second World War.']}
  };
  window.renderOfficialLinks = function (container, language = 'ru') {
    const t = linksCopy[language] || linksCopy.ru;
    const nav = normativeCopy[language] || normativeCopy.ru;
    container.innerHTML = `<section class="info-page" aria-labelledby="official-references-title"><div class="info-container"><header class="info-heading"><nav class="info-breadcrumb" aria-label="${nav.breadcrumb}"><a href="#/">${nav.home}</a><span aria-hidden="true">/</span><a href="#/section/all">${nav.sections}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav><h1 id="official-references-title">${t.title}</h1><p class="info-intro">${t.intro}</p></header>
      <div class="info-link-grid">${officialLinks.map((entry,index) => `<a class="info-link-card" href="${entry.href}" target="_blank" rel="noopener noreferrer"><span class="info-link-copy"><span class="info-link-title" lang="${index === 0 || index === 3 ? 'kk' : 'ru'}">${entry.title}</span><span class="info-link-description">${t.descriptions?.[index] || entry.description}</span></span><span class="info-link-arrow" aria-hidden="true">↗</span><span class="sr-only"> — ${t.external}</span></a>`).join('')}</div></div></section>`;
  };
}());
