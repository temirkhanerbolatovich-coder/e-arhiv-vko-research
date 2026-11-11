/* Informational sections for the local Sandyq prototype. All copy is static. */
(function () {
  'use strict';

  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const branchNames = [
    'Филиал района Алтай', 'Глубоковский районный филиал', 'Зайсанский районный филиал',
    'Катон-Карагайский районный филиал', 'Курчумский районный филиал', 'Филиал района Марқакөл',
    'Риддерский городской филиал', 'Филиал района Самар', 'Тарбагатайский районный филиал',
    'Уланский районный филиал', 'Филиал района Үлкен-Нарын',
    'Усть-Каменогорский городской филиал по личному составу', 'Шемонаихинский районный филиал'
  ];
  const archiveSections = [
    ['about', 'Об архиве', 'История, структура и деятельность государственного архива.'],
    ['history', 'История архива', 'Основные этапы развития архива по справке заказчика.'],
    ['structure', 'Структура архива', 'Подразделения и должности в материалах заказчика.'],
    ['branches', 'Филиалы и контакты', 'Сведения о главном архиве и его подразделениях.']
  ];
  const collectionSections = [
    ['memory', 'История в документах', 'Тематические материалы об истории Восточного Казахстана.'],
    ['calendar', 'Календарь памятных дат', 'Выборка дат и событий из календаря на 2026 год.'],
    ['places', 'Места в истории', 'Города и события по календарю памятных дат.'],
    ['exhibitions', 'Онлайн-выставки', 'Архивные документы и фотографии в тематических подборках.'],
    ['publications', 'Публикации и сборники', 'Сборники документов и публикации из архива сайта.'],
    ['personal-funds', 'Личные фонды', 'Примеры фондов из справочника архива.'],
    ['news', 'Новости и события', 'Публикации и события государственного архива.']
  ];
  const referenceSections = [
    ['reading-room', 'Читальный зал', 'График, адрес и подготовка к посещению.'],
    ['help', 'Помощь', 'Подсказки по поиску и работе с сайтом.'],
    ['services', 'Государственная услуга', 'Справочная информация и официальные правила.'],
    ['paid', 'Платные услуги', 'Информация о документах и прейскуранте.'],
    ['normative', 'Нормативные документы', 'Правовые акты об архивном деле и государственных услугах.'],
    ['compliance', 'Комплаенс и антикоррупция', 'Материалы о работе комплаенс-службы архива.'],
    ['symbols', 'Государственные символы РК', 'Официальные сведения о флаге, гербе и гимне.'],
    ['links', 'Полезные ссылки', 'Официальные ресурсы Казахстана и Восточно-Казахстанской области.'],
    ['feedback', 'Отзывы и предложения', 'Поделитесь идеями по улучшению сайта.']
  ];

  function linkCard(key, title, description) {
    return `<a class="info-link-card" href="#/section/${key}"><span class="info-link-copy"><span class="info-link-title">${title}</span><span class="info-link-description">${description}</span></span><span class="info-link-arrow">${arrow}</span></a>`;
  }

  function head(label, title, intro) {
    return `<div class="info-heading"><div class="info-breadcrumb"><a href="#/">Главная</a><span aria-hidden="true">/</span><span aria-current="page">${label}</span></div><p class="info-eyebrow">ГОСУДАРСТВЕННЫЙ АРХИВ ВКО</p><h1>${title}</h1><p class="info-intro">${intro}</p></div>`;
  }

  function empty(title, detail, link, linkText) {
    return `<div class="info-empty"><span class="info-empty-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4.75h9l5 5v9.5H5V4.75Zm9 0v5h5M8 14h8M8 17h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div><h2>${title}</h2><p>${detail}</p>${link ? `<a class="info-text-link" href="${link}">${linkText}${arrow}</a>` : ''}</div></div>`;
  }

  const aboutCopy = {
    ru: { home:'Главная', label:'Об архиве', eyebrow:'ГОСУДАРСТВЕННЫЙ АРХИВ ВКО', title:'Память Восточного Казахстана', intro:'Государственный архив Восточно-Казахстанской области сохраняет документы об истории региона и его жителях.', history:'ИСТОРИЯ АРХИВА', story:'История, которую мы сохраняем', historyText:'Государственный архив Восточно-Казахстанской области образован в 1940 году. На протяжении десятилетий менялись его структура, подчинение и сеть архивных учреждений.', today:'Сегодня архив объединяет сведения о фондах, исторических материалах и филиалах региона.', source:'По материалам истории архива, предоставленным заказчиком. Сведения для публикации требуют подтверждения.', region:'Узнать об истории региона', year:'ГОД ОБРАЗОВАНИЯ', archive:'Государственный архив Восточно-Казахстанской области', contacts:'Контакты и филиалы', activity:'ДЕЯТЕЛЬНОСТЬ', directions:'Основные направления', directionsNote:'Направления представлены по структуре, предоставленной заказчиком.', directionCards:[['Сохранность и учёт','Хранение и государственный учёт архивных документов.'],['Комплектование архива','Комплектование и работа с ведомственными архивами.'],['Справочный аппарат и публикации','Научно-справочная работа, публикация и использование документов.'],['Экспертиза и цифровые технологии','Экспертиза ценности документов и информационные технологии.']], organization:'ОРГАНИЗАЦИЯ РАБОТЫ', managementTitle:'Руководство и подразделения', management:'Руководство', managementText:'В структуре заказчика указаны директор, заместители и главный хранитель фондов. Имена и актуальные должности уточняются перед публикацией.', structureLink:'Посмотреть структуру', reports:'Отчёты и документы', reportsText:'Отчёты отдельных филиалов о работе с государственной услугой представлены в справочном разделе. Сводные отчёты уточняются.', reportsLink:'Открыть справочную информацию', exploreLabel:'МАТЕРИАЛЫ И РАЗДЕЛЫ', explore:'Исследуйте архив', links:[['history','История архива','Ключевые этапы истории учреждения по документу заказчика.'],['memory','История в документах','События и материалы Восточного Казахстана.'],['structure','Структура архива','Должности и подразделения по материалам заказчика.'],['branches','Филиалы и контакты','Подразделения архива и контактная информация.'],['exhibitions','Выставки и изображения','Демонстрационные материалы и их источники.']] },
    kk: { home:'Басты бет', label:'Архив туралы', eyebrow:'ШҚО МЕМЛЕКЕТТІК АРХИВІ', title:'Шығыс Қазақстанның жады', intro:'Шығыс Қазақстан облысының мемлекеттік архиві өңір тарихы мен тұрғындары туралы құжаттарды сақтайды.', history:'АРХИВ ТАРИХЫ', story:'Біз сақтайтын тарих', historyText:'Шығыс Қазақстан облысының мемлекеттік архиві 1940 жылы құрылған. Кейінгі онжылдықтарда оның құрылымы, бағыныстылығы және архив мекемелерінің желісі өзгерді.', today:'Архив қорлар, тарихи материалдар және өңір филиалдары туралы мәліметтерді біріктіреді.', source:'Тапсырыс беруші ұсынған архив тарихы материалдары бойынша. Жарияланатын мәліметтер растауды қажет етеді.', region:'Өңір тарихымен танысу', year:'ҚҰРЫЛҒАН ЖЫЛЫ', archive:'Шығыс Қазақстан облысының мемлекеттік архиві', contacts:'Байланыс және филиалдар', activity:'ҚЫЗМЕТІ', directions:'Негізгі бағыттар', directionsNote:'Бағыттар тапсырыс беруші ұсынған құрылым бойынша көрсетілген.', directionCards:[['Сақтау және есепке алу','Архив құжаттарын сақтау және мемлекеттік есепке алу.'],['Архивті толықтыру','Қорларды толықтыру және ведомстволық архивтермен жұмыс.'],['Анықтамалық аппарат және жарияланымдар','Ғылыми-анықтамалық жұмыс, құжаттарды жариялау және пайдалану.'],['Сараптама және цифрлық технологиялар','Құжаттардың құндылығына сараптама және ақпараттық технологиялар.']], organization:'ЖҰМЫСТЫ ҰЙЫМДАСТЫРУ', managementTitle:'Басшылық және бөлімшелер', management:'Басшылық', managementText:'Тапсырыс беруші ұсынған құрылымда директор, орынбасарлар және қорлардың бас сақтаушысы көрсетілген. Аты-жөні мен қазіргі лауазымдары жариялау алдында нақтыланады.', structureLink:'Құрылымды қарау', reports:'Есептер мен құжаттар', reportsText:'Жекелеген филиалдардың мемлекеттік қызмет бойынша жұмыс есептері анықтама бөлімінде берілген. Жиынтық есептер нақтылануда.', reportsLink:'Анықтамалық ақпаратты ашу', exploreLabel:'МАТЕРИАЛДАР МЕН БӨЛІМДЕР', explore:'Архивпен танысыңыз', links:[['history','Архив тарихы','Тапсырыс беруші құжатындағы мекеме тарихының негізгі кезеңдері.'],['memory','Құжаттардағы тарих','Шығыс Қазақстан оқиғалары мен материалдары.'],['structure','Архив құрылымы','Тапсырыс беруші материалдарындағы лауазымдар мен бөлімшелер.'],['branches','Филиалдар және байланыс','Архив бөлімшелері мен байланыс ақпараты.'],['exhibitions','Көрмелер мен суреттер','Демонстрациялық материалдар және олардың дереккөздері.']] },
    en: { home:'Home', label:'About the archive', eyebrow:'EAST KAZAKHSTAN STATE ARCHIVE', title:'The memory of East Kazakhstan', intro:'The State Archive of East Kazakhstan Region preserves documents about the history of the region and its people.', history:'ARCHIVE HISTORY', story:'The history we preserve', historyText:'The State Archive of East Kazakhstan Region was established in 1940. Its structure, administrative affiliation and network of archival institutions changed over the decades.', today:'The archive brings together information about fonds, historical materials and regional branches.', source:'Based on archive history materials supplied by the customer. Information requires confirmation before publication.', region:'Explore the history of the region', year:'YEAR ESTABLISHED', archive:'State Archive of East Kazakhstan Region', contacts:'Branches and contacts', activity:'OUR WORK', directions:'Main areas of work', directionsNote:'The areas follow the organisational structure supplied by the customer.', directionCards:[['Preservation and registration','Preservation and state registration of archival documents.'],['Archive acquisition','Acquisition and work with departmental archives.'],['Reference resources and publications','Research and reference work, publication and use of documents.'],['Appraisal and digital technology','Appraisal of documents and information technology.']], organization:'ORGANISATION', managementTitle:'Management and departments', management:'Management', managementText:'The structure supplied by the customer lists a director, deputies and chief custodian of fonds. Names and current positions require confirmation before publication.', structureLink:'View the organisational structure', reports:'Reports and documents', reportsText:'Reports by selected branches on their work with the government service are available in the information section. Consolidated reports require confirmation.', reportsLink:'Open visitor information', exploreLabel:'MATERIALS AND SECTIONS', explore:'Explore the archive', links:[['history','Archive history','Key milestones in the institution’s history based on the customer’s document.'],['memory','History in documents','Events and materials from East Kazakhstan.'],['structure','Archive structure','Positions and departments in the customer’s materials.'],['branches','Branches and contacts','Archive departments and contact information.'],['exhibitions','Exhibitions and images','Demonstration materials and their sources.']] }
  };

  function about(language) {
    const t = aboutCopy[language] || aboutCopy.ru;
    return `<div class="info-heading"><nav class="info-breadcrumb" aria-label="${t.label}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.label}</span></nav><p class="info-eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p class="info-intro">${t.intro}</p></div>
      <div class="info-two-col"><article class="info-paper-card info-about-story"><p class="info-card-label">${t.history}</p><h2>${t.story}</h2><p>${t.historyText}</p><p>${t.today}</p><p class="info-source">${t.source}</p><a class="info-text-link" href="#/section/memory">${t.region}${arrow}</a></article>
      <aside class="info-fact-card"><span class="info-card-label">${t.year}</span><strong class="info-fact-number">1940</strong><span>${t.archive}</span><div class="info-fact-divider"></div><a class="info-text-link" href="#/section/branches">${t.contacts}${arrow}</a></aside></div>
      <div class="info-section-title"><div><p class="info-card-label">${t.activity}</p><h2>${t.directions}</h2><p>${t.directionsNote}</p></div></div>
      <div class="info-link-grid">${t.directionCards.map(([title, description]) => `<article class="info-paper-card about-direction"><h3>${title}</h3><p>${description}</p></article>`).join('')}</div>
      <div class="info-section-title"><div><p class="info-card-label">${t.organization}</p><h2>${t.managementTitle}</h2></div></div>
      <div class="info-two-col"><article class="info-paper-card about-direction"><h3>${t.management}</h3><p>${t.managementText}</p><a class="info-text-link" href="#/section/structure">${t.structureLink}${arrow}</a></article><article class="info-paper-card about-direction"><h3>${t.reports}</h3><p>${t.reportsText}</p><a class="info-text-link" href="#/section/services">${t.reportsLink}${arrow}</a></article></div>
      <div class="info-section-title"><div><p class="info-card-label">${t.exploreLabel}</p><h2>${t.explore}</h2></div></div><div class="info-link-grid">${t.links.map(entry => linkCard(...entry)).join('')}</div>`;
  }

  function branches() {
    return `${head('Филиалы и контакты', 'Архив рядом с вами', 'Информация о главном архиве и филиалах Восточно-Казахстанской области.')}
      <div class="info-notice" role="note"><span class="info-notice-dot" aria-hidden="true"></span><p>Сведения предоставлены заказчиком. Актуальность контактов и названий уточняется.</p></div>
      <div class="info-contact-card"><div><p class="info-card-label">ГЛАВНЫЙ АРХИВ</p><h2>Государственный архив ВКО</h2><p class="info-contact-address">г. Усть-Каменогорск, ул. Бейбітшілік, 26/1<br><span>(Головкова, 26/1)</span></p></div><dl class="info-contact-details"><div><dt>Приёмная</dt><dd><a href="tel:+77232255976">8 (7232) 25-59-76</a></dd></div><div><dt>Электронная почта</dt><dd><a href="mailto:arhiv-ukg@yandex.kz">arhiv-ukg@yandex.kz</a></dd></div><div><dt>Режим работы</dt><dd>Пн–пт, 08:00–17:00</dd></div><div><dt>Читальный зал</dt><dd>Пн–пт, 09:00–16:00</dd></div></dl></div>
      <div class="info-section-title"><div><p class="info-card-label">НАШИ ПОДРАЗДЕЛЕНИЯ</p><h2>Филиалы архива</h2><p>Перечень основан на таблице, предоставленной заказчиком.</p></div><span class="info-count">13 филиалов</span></div>
      <div class="info-branch-grid">${branchNames.map((name, index) => `<article class="info-branch-card"><span class="info-branch-number">${String(index + 1).padStart(2, '0')}</span><h3>${name}</h3><p>Адрес и контактные данные уточняются.</p></article>`).join('')}</div>`;
  }

  function memory() {
    return `${head('История в документах', 'История региона — в документах', 'Материалы архива помогают узнавать о людях, событиях и местах Восточного Казахстана.')}
      ${empty('Подборки готовятся', 'Исторические материалы появятся здесь после проверки источников и прав на публикацию.', '#/catalog', 'Перейти в каталог')}
      <div class="info-section-title"><div><p class="info-card-label">УЗНАЙТЕ БОЛЬШЕ</p><h2>Другие разделы</h2></div></div><div class="info-link-grid">${linkCard('about', 'Об архиве', 'История и деятельность государственного архива.')}${linkCard('exhibitions', 'Онлайн-выставки', 'Тематические экспозиции архивных материалов.')}</div>`;
  }

  function exhibitions() {
    return `${head('Онлайн-выставки', 'История в деталях', 'Тематические выставки объединят документы, фотографии и истории Восточного Казахстана.')}
      ${empty('Выставки готовятся', 'Экспозиции появятся после подтверждения материалов и их источников.', '#/section/memory', 'История в документах')}`;
  }

  function help() {
    return `${head('Помощь', 'Как пользоваться архивом', 'Ответы на основные вопросы о поиске и просмотре материалов.')}
      <div class="info-help-layout"><div class="info-faq-list"><details><summary>Как найти материал в каталоге?<span class="info-plus" aria-hidden="true"></span></summary><div><p>Откройте каталог и введите известное название или номер фонда. Если не знаете точного названия, начните с общего запроса.</p><a class="info-text-link" href="#/catalog">Открыть каталог${arrow}</a></div></details>
      <details><summary>Что такое архивный шифр?<span class="info-plus" aria-hidden="true"></span></summary><div><p>Архивный шифр помогает определить место документа в системе архива. Он может включать обозначения фонда, описи и дела.</p><a class="info-text-link" href="#/cipher">Как читать архивный шифр${arrow}</a></div></details>
      <details><summary>Все ли документы доступны онлайн?<span class="info-plus" aria-hidden="true"></span></summary><div><p>Нет. Наличие описания не означает, что электронная копия опубликована. Условия доступа указываются в карточке материала.</p></div></details>
      <details><summary>Как узнать адрес и контакты архива?<span class="info-plus" aria-hidden="true"></span></summary><div><p>Сведения о главном архиве и филиалах собраны на отдельной странице.</p><a class="info-text-link" href="#/section/branches">Филиалы и контакты${arrow}</a></div></details>
      <details><summary>Где посмотреть график читального зала?<span class="info-plus" aria-hidden="true"></span></summary><div><p>На странице читального зала собраны часы работы по справке архива и рекомендации перед визитом.</p><a class="info-text-link" href="#/section/reading-room">Читальный зал${arrow}</a></div></details>
      <details><summary>Можно ли оформить услугу на сайте?<span class="info-plus" aria-hidden="true"></span></summary><div><p>Сайт носит информационный характер: на нём не принимаются заявления, заказы и платежи. Справочные сведения об услугах публикуются отдельно.</p><a class="info-text-link" href="#/section/services">Информация об услугах${arrow}</a></div></details></div>
      <aside class="info-paper-card info-help-aside"><p class="info-card-label">НУЖНА ПОДСКАЗКА?</p><h2>Начните с вопроса</h2><p>Опишите, какую информацию вы ищете, на главной странице.</p><a class="info-text-link" href="#/">Перейти на главную${arrow}</a></aside></div>`;
  }

  function services() {
    return `${head('Государственная услуга', 'Информация о государственной услуге', 'Справочные сведения о правилах и официальных каналах обращения.')}
      <div class="info-notice" role="note"><span class="info-notice-dot" aria-hidden="true"></span><p>Этот сайт предоставляет информацию. Заявления и архивные запросы здесь не принимаются.</p></div>
      ${empty('Информация уточняется', 'Правила, необходимые документы и ссылки на официальные внешние ресурсы появятся после подтверждения заказчиком.')}
      <div class="info-section-title"><div><p class="info-card-label">ПОМОЩЬ И КОНТАКТЫ</p><h2>Нужна справочная информация?</h2></div></div><div class="info-link-grid">${linkCard('branches', 'Контакты архива', 'Адрес и телефон приёмной главного архива.')}${linkCard('help', 'Частые вопросы', 'Как пользоваться каталогом и разделами сайта.')}</div>`;
  }

  function paid() {
    return `${head('Платные услуги', 'Справочные сведения', 'Информация о нормативных документах и утверждённом прейскуранте архива.')}
      <div class="info-notice" role="note"><span class="info-notice-dot" aria-hidden="true"></span><p>Здесь не оформляются заказы, не рассчитывается стоимость и не принимается оплата.</p></div>
      ${empty('Прейскурант уточняется', 'Подтверждённые документы и действующий прейскурант будут опубликованы после предоставления заказчиком.')}
      <div class="info-section-title"><div><p class="info-card-label">СВЯЗАННАЯ ИНФОРМАЦИЯ</p><h2>Другие разделы</h2></div></div><div class="info-link-grid">${linkCard('services', 'Государственная услуга', 'Справочные сведения и официальные правила.')}${linkCard('branches', 'Контакты архива', 'Адрес и телефон приёмной главного архива.')}</div>`;
  }

  const directoryCopy = {
    ru: {home:'Главная',label:'Все разделы',title:'Разделы архива',intro:'Выберите интересующую тему или начните поиск в каталоге.',eyebrow:'ГОСУДАРСТВЕННЫЙ АРХИВ ВКО',catalog:'Электронный каталог',catalogText:'Поиск по материалам и архивным фондам.',groups:['Об архиве','История и публикации','Справочная информация']},
    kk: {home:'Басты бет',label:'Барлық бөлімдер',title:'Архив бөлімдері',intro:'Қажетті тақырыпты таңдаңыз немесе каталогтан іздеуді бастаңыз.',eyebrow:'ШҚО МЕМЛЕКЕТТІК АРХИВІ',catalog:'Электрондық каталог',catalogText:'Материалдар мен архив қорлары бойынша іздеу.',groups:['Архив туралы','Тарих және жарияланымдар','Анықтамалық ақпарат'],entries:{
      about:['Архив туралы','Мемлекеттік архивтің тарихы, құрылымы және қызметі.'],history:['Архив тарихы','Тапсырыс берушінің анықтамасы бойынша негізгі кезеңдер.'],structure:['Архив құрылымы','Ұсынылған материалдардағы бөлімшелер мен лауазымдар.'],branches:['Филиалдар және байланыс','Бас архив пен оның бөлімшелері туралы мәліметтер.'],memory:['Құжаттардағы тарих','Шығыс Қазақстан тарихы туралы тақырыптық материалдар.'],calendar:['Атаулы күндер күнтізбесі','2026 жылғы күнтізбеден күндер мен оқиғалар іріктемесі.'],places:['Тарихтағы орындар','Атаулы күндер күнтізбесіндегі қалалар мен оқиғалар.'],exhibitions:['Онлайн көрмелер','Тақырыптық жинақтардағы құжаттар мен фотосуреттер.'],publications:['Жарияланымдар мен жинақтар','Бұрынғы сайттан алынған жинақтар мен жарияланымдар.'],'personal-funds':['Жеке тектік қорлар','Архив анықтамалығындағы қор мысалдары.'],news:['Жаңалықтар мен оқиғалар','Архив туралы жарияланымдар мен оқиғалар.'],'reading-room':['Оқу залы','Жұмыс кестесі, мекенжайы және сапарға дайындық.'],help:['Көмек','Іздеу және сайтпен жұмыс істеу бойынша нұсқаулар.'],services:['Мемлекеттік қызмет','Анықтамалық ақпарат пен ресми қағидалар.'],paid:['Ақылы қызметтер','Құжаттар мен прейскурант туралы ақпарат.'],normative:['Нормативтік құжаттар','Архив ісі мен мемлекеттік қызметтер жөніндегі актілер.'],compliance:['Комплаенс және сыбайлас жемқорлыққа қарсы іс-қимыл','Архивтің комплаенс қызметі туралы материалдар.'],symbols:['ҚР мемлекеттік рәміздері','Ту, Елтаңба және Әнұран туралы ресми мәліметтер.'],links:['Пайдалы сілтемелер','Қазақстан мен Шығыс Қазақстанның ресми ресурстары.'],feedback:['Пікірлер мен ұсыныстар','Сайтты жақсарту туралы ойларыңызбен бөлісіңіз.']}},
    en: {home:'Home',label:'All sections',title:'Archive sections',intro:'Choose a topic or start searching the catalogue.',eyebrow:'EAST KAZAKHSTAN STATE ARCHIVE',catalog:'Electronic catalogue',catalogText:'Search archive materials and fonds.',groups:['About the archive','History and publications','Visitor information'],entries:{
      about:['About the archive','History, structure and activities of the state archive.'],history:['Archive history','Milestones from the customer-provided history.'],structure:['Archive structure','Departments and roles in the supplied materials.'],branches:['Branches and contacts','The main archive and its branches.'],memory:['History in documents','Thematic materials about East Kazakhstan history.'],calendar:['Calendar of commemorative dates','Selected dates and events from the 2026 calendar.'],places:['Places in history','Towns and events in the commemorative calendar.'],exhibitions:['Online exhibitions','Documents and photographs in thematic collections.'],publications:['Publications and collections','Publications and collections from the former website.'],'personal-funds':['Personal fonds','Sample fonds from the archive directory.'],news:['News and events','Publications and events concerning the archive.'],'reading-room':['Reading room','Opening hours, address and preparing a visit.'],help:['Help','Guidance on searching and using the website.'],services:['Public service information','Guidance and official rules.'],paid:['Paid service information','Documents and price-list information.'],normative:['Regulatory documents','Legal acts on archival work and public services.'],compliance:['Compliance and anti-corruption','Materials about the archive compliance service.'],symbols:['State symbols of Kazakhstan','Official information about the flag, emblem and anthem.'],links:['Useful links','Official resources of Kazakhstan and East Kazakhstan.'],feedback:['Feedback and suggestions','Share ideas for improving the website.']}}
  };
  function all(language = 'ru') {
    const t = directoryCopy[language] || directoryCopy.ru;
    const localEntries = entries => entries.map(([key,title,description]) => [key,...(t.entries?.[key] || [title,description])]);
    return `<div class="info-heading"><nav class="info-breadcrumb" aria-label="${t.label}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.label}</span></nav><p class="info-eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p class="info-intro">${t.intro}</p></div>
      <a class="info-link-card info-link-card-primary" href="#/catalog"><span class="info-link-copy"><span class="info-link-title">${t.catalog}</span><span class="info-link-description">${t.catalogText}</span></span><span class="info-link-arrow">${arrow}</span></a>
      ${sectionGroup(t.groups[0], 'archive-sections', localEntries(archiveSections))}
      ${sectionGroup(t.groups[1], 'collection-sections', localEntries(collectionSections))}
      ${sectionGroup(t.groups[2], 'reference-sections', localEntries(referenceSections))}`;
  }

  function sectionGroup(title, id, entries) {
    return `<section aria-labelledby="${id}"><div class="info-section-title"><h2 id="${id}">${title}</h2></div>
      <div class="info-link-grid info-link-grid-all">${entries.map(entry => linkCard(...entry)).join('')}</div></section>`;
  }

  const views = { about, branches, exhibitions, memory, help, services, paid, all };

  window.renderSection = function renderSection(container, key, language) {
    if (!container || !Object.hasOwn(views, key)) return false;
    container.innerHTML = `<div class="info-page"><div class="info-container">${views[key](language)}</div></div>`;
    return true;
  };
}());
