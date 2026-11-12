/* Based on the customer-provided historical note, which ends in 2022. */
(function () {
  'use strict';

  const milestones = [
    { year: '1940', title: 'Образование областного архива', text: 'Согласно исторической справке заказчика, Государственный архив Восточно-Казахстанской области образован в 1940 году.' },
    { year: '1963–1966', title: 'Первые филиалы', text: 'В 1963 году образованы Зайсанский и Зыряновский филиалы, а в 1966 году — Лениногорский филиал. Названия приведены для соответствующего исторического периода.' },
    { year: '1992', title: 'Изменения в управлении архивами', text: 'Архивный отдел был реорганизован в управление архивами и документацией областной администрации; в его подчинение вошёл областной госархив.' },
    { year: '2009', title: 'Самостоятельные юридические лица', text: 'Областной госархив и филиалы выделены из состава управления архивов и документации в самостоятельные юридические лица.' },
    { year: '2012–2013', title: 'Реорганизация архивных учреждений', text: 'В 2012 году изменена организационно-правовая форма архива, а в январе 2013 года вновь созданы филиалы учреждения.' },
    { year: '2019', title: 'Филиал в районе Алтай', text: 'После переименования района и города Зыряновск филиал прошёл перерегистрацию и получил название «филиал Алтай».' },
    { year: '2020', title: 'Новое подчинение', text: 'Госархив перешёл в подчинение созданного управления цифровизации и архивов Восточно-Казахстанской области.' },
    { year: '2022', title: 'Изменение сети филиалов', text: 'После образования области Абай Аягозский и Жарминский филиалы перешли в подчинение Центра документации новейшей истории области Абай.' }
  ];

  const labels = {
    ru: { breadcrumb:'Навигационная цепочка', home:'Главная', about:'Об архиве', title:'История архива', eyebrow:'О ГОСУДАРСТВЕННОМ АРХИВЕ ВКО', lead:'Ключевые этапы развития архивного учреждения и сети его филиалов.', noticeTitle:'По исторической справке заказчика.', notice:'Материал заканчивается 2022 годом. Факты и названия необходимо проверить перед публикацией; дальнейшие изменения здесь не отражены.', start:'НАЧАЛО ИСТОРИИ', introTitle:'Сохраняя память региона', intro:'Справка описывает образование архива, изменения в его подчинённости и развитие сети архивных учреждений Восточно-Казахстанской области.', openDocument:'Открыть хронологию', year:'Год образования', customer:'По материалам заказчика', timeline:'ХРОНОЛОГИЯ', stages:'Основные этапы', selection:'Выборка событий из предоставленной справки.', sourceTitle:'Источник и уточнения', sourceNote:'«История архива.docx», предоставленный заказчиком.', openSource:'Архивные учреждения ВКО на GOV.KZ', memory:'Архив памяти', branches:'Филиалы и контакты' },
    kk: { breadcrumb:'Навигация жолы', home:'Басты бет', about:'Архив туралы', title:'Архив тарихы', eyebrow:'ШҚО МЕМЛЕКЕТТІК АРХИВІ ТУРАЛЫ', lead:'Архив мекемесі мен оның филиалдары желісінің дамуындағы негізгі кезеңдер.', noticeTitle:'Тапсырыс берушінің тарихи анықтамасы бойынша.', notice:'Материал 2022 жылмен аяқталады. Жариялау алдында деректер мен атауларды тексеру қажет; кейінгі өзгерістер мұнда көрсетілмеген.', start:'ТАРИХТЫҢ БАСТАУЫ', introTitle:'Өңірдің жадын сақтаймыз', intro:'Анықтамада архивтің құрылуы, оның бағыныштылығындағы өзгерістер және Шығыс Қазақстан облысындағы архив мекемелері желісінің дамуы сипатталған.', openDocument:'Хронологияны ашу', year:'Құрылған жылы', customer:'Тапсырыс беруші материалы бойынша', timeline:'ХРОНОЛОГИЯ', stages:'Негізгі кезеңдер', selection:'Ұсынылған анықтамадан алынған оқиғалар.', sourceTitle:'Дереккөз және нақтылау', sourceNote:'Тапсырыс беруші ұсынған «История архива.docx».', openSource:'GOV.KZ сайтындағы ШҚО архив мекемелері', memory:'Архив жады', branches:'Филиалдар мен байланыс' },
    en: { breadcrumb:'Breadcrumbs', home:'Home', about:'About the archive', title:'History of the archive', eyebrow:'ABOUT THE EAST KAZAKHSTAN STATE ARCHIVE', lead:'Key stages in the development of the archive and its branch network.', noticeTitle:'Based on the historical note supplied by the customer.', notice:'The material ends in 2022. Facts and names require verification before publication; subsequent changes are not included.', start:'EARLY HISTORY', introTitle:'Preserving the region’s memory', intro:'The note describes the establishment of the archive, changes in its administrative authority and the development of the archival network in East Kazakhstan Region.', openDocument:'Open the timeline', year:'Year established', customer:'According to customer material', timeline:'TIMELINE', stages:'Key stages', selection:'Selected events from the supplied note.', sourceTitle:'Source and verification', sourceNote:'“История архива.docx”, provided by the customer.', openSource:'East Kazakhstan archives on GOV.KZ', memory:'Memory archive', branches:'Branches and contacts' }
  };
  const translatedMilestones = {
    kk: [
      ['Облыстық архивтің құрылуы','Тапсырыс берушінің тарихи анықтамасы бойынша Шығыс Қазақстан облысының мемлекеттік архиві 1940 жылы құрылған.'],
      ['Алғашқы филиалдар','1963 жылы Зайсан және Зырян филиалдары, ал 1966 жылы Лениногор филиалы құрылды. Атаулар тиісті тарихи кезең бойынша берілген.'],
      ['Архивтерді басқарудағы өзгерістер','Архив бөлімі облыстық әкімшіліктің архивтер мен құжаттама басқармасы болып қайта ұйымдастырылды; облыстық мемлекеттік архив оның қарамағына өтті.'],
      ['Дербес заңды тұлғалар','Облыстық мемлекеттік архив пен филиалдар архивтер мен құжаттама басқармасының құрамынан бөлініп, дербес заңды тұлғаға айналды.'],
      ['Архив мекемелерін қайта ұйымдастыру','2012 жылы архивтің ұйымдық-құқықтық нысаны өзгертілді, ал 2013 жылғы қаңтарда мекеменің филиалдары қайта құрылды.'],
      ['Алтай ауданындағы филиал','Зырян ауданы мен қаласының атауы өзгергеннен кейін филиал қайта тіркеліп, «Алтай филиалы» атауын алды.'],
      ['Жаңа бағыныштылық','Мемлекеттік архив жаңадан құрылған Шығыс Қазақстан облысының цифрландыру және архивтер басқармасының қарамағына өтті.'],
      ['Филиалдар желісінің өзгеруі','Абай облысы құрылғаннан кейін Аягөз және Жарма филиалдары Абай облысының қазіргі заман тарихы құжаттама орталығының қарамағына өтті.']
    ],
    en: [
      ['Establishment of the regional archive','According to the customer’s historical note, the State Archive of East Kazakhstan Region was established in 1940.'],
      ['The first branches','The Zaysan and Zyryanovsk branches were established in 1963, followed by the Leninogorsk branch in 1966. Names reflect the historical period.'],
      ['Changes in archival administration','The archival department was reorganised as the regional administration’s archives and documentation directorate, with the regional state archive under its authority.'],
      ['Independent legal entities','The regional state archive and its branches were separated from the archives and documentation directorate as independent legal entities.'],
      ['Reorganisation of archival institutions','The archive’s organisational and legal form changed in 2012, and its branches were established again in January 2013.'],
      ['The Altay district branch','Following the renaming of the district and the city of Zyryanovsk, the branch was re-registered as the Altay branch.'],
      ['New administrative authority','The state archive came under the newly created digitalisation and archives department of East Kazakhstan Region.'],
      ['Changes to the branch network','After the creation of Abay Region, the Ayagoz and Zharma branches came under the Abay Region Centre for Documentation of Contemporary History.']
    ]
  };

  window.renderArchiveHistory = function renderArchiveHistory(container, language = 'ru') {
    const t = labels[language] || labels.ru;
    const timeline = milestones.map((item, index) => ({ ...item, ...(translatedMilestones[language] ? { title: translatedMilestones[language][index][0], text: translatedMilestones[language][index][1] } : {}) }));
    container.innerHTML = `<section class="archive-history" aria-labelledby="archive-history-title"><div class="archive-history-shell">
      <nav class="archive-history-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/section/about">${t.about}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <header class="archive-history-heading"><p class="archive-history-eyebrow">${t.eyebrow}</p><h1 id="archive-history-title">${t.title}</h1><p>${t.lead}</p></header>
      <div class="archive-history-notice" role="note"><strong>${t.noticeTitle}</strong> ${t.notice}</div>
      <div class="archive-history-intro"><div class="archive-history-intro-copy"><p class="archive-history-eyebrow">${t.start}</p><h2>${t.introTitle}</h2><p>${t.intro}</p><a href="#/memory">${t.openDocument} <span aria-hidden="true">→</span></a></div><div class="archive-history-year"><span>${t.year}</span><strong>1940</strong><small>${t.customer}</small></div></div>
      <div class="archive-history-timeline-heading"><div><p class="archive-history-eyebrow">${t.timeline}</p><h2>${t.stages}</h2><p>${t.selection}</p></div></div>
      <ol class="archive-history-timeline">${timeline.map(item => `<li><div class="archive-history-timeline-year">${item.year}</div><article><h3>${item.title}</h3><p>${item.text}</p></article></li>`).join('')}</ol>
      <div class="archive-history-source"><div><h2>${t.sourceTitle}</h2><p>${t.sourceNote}</p></div><a href="https://www.gov.kz/org/vko-cultura-arhiv/press/article/details/11362?lang=ru" target="_blank" rel="noopener noreferrer">${t.openSource} <span aria-hidden="true">↗</span></a></div>
      <div class="archive-history-links"><a href="#/section/about">← ${t.about}</a><a href="#/memory">${t.memory} →</a><a href="#/section/branches">${t.branches} →</a></div>
    </div></section>`;
  };
}());
