/* Source materials and translations require editorial review before publication. */
(function () {
  'use strict';
  const reportUrl = 'https://www.gov.kz/org/vko-uca/documents/details/1071652?lang=ru';
  const departmentUrl = 'https://www.gov.kz/org/vko-uca/activities/14785?lang=ru';
  const copy = {
    ru: {
      breadcrumb:'Навигационная цепочка', home:'Главная', about:'Об архиве', section:'Комплаенс-служба', title:'Комплаенс-служба и антикоррупция',
      intro:'Материалы о внутреннем анализе коррупционных рисков и профилактических мерах в архиве.',
      analysis:'Внутренний анализ коррупционных рисков', analysisText:'В материалах архива указано, что по результатам внутреннего анализа подготовлены аналитическая справка, перечень должностей, подверженных коррупционным рискам, и план профилактических мер.',
      publishedBefore:'Аналитическая справка об архиве опубликована управлением ВКО ', publishedDate:'24 сентября 2026 года', publishedAfter:'.',
      report:'Открыть справку на gov.kz', external:'Внешний сайт, откроется в новой вкладке; источник на русском языке',
      contacts:'Контакты', contactsText:'Прямой контакт комплаенс-офицера уточняется. Общий телефон и адрес архива доступны в справочнике.', branches:'Филиалы и контакты',
      materials:'Материалы за 2026 год', announcement:'Объявление о начале анализа', announcedBefore:'В объявлении архива начало анализа было назначено на ', announcedDate:'11 сентября 2026 года', announcedAfter:'.',
      sourceAnnouncement:'Источник — «О проведении внутреннего анализа коррупционных рисков», документ заказчика.', measures:'Меры по итогам анализа',
      measuresBefore:'В справке архива упомянуты приказы от ', date1:'21 октября', between:' и ', date2:'22 октября 2026 года', measuresAfter:' о распределении ответственности за закупки и платные услуги и о работе кадровой службы.',
      sourceMeasures:'Источник — «Информация о работе комплаенс-службы», документ заказчика.', official:'Официальные материалы управления', officialLink:'Раздел «Противодействие коррупции» на gov.kz'
    },
    kk: {
      breadcrumb:'Навигация жолы', home:'Басты бет', about:'Архив туралы', section:'Комплаенс қызметі', title:'Комплаенс қызметі және сыбайлас жемқорлыққа қарсы іс-қимыл',
      intro:'Архивтегі сыбайлас жемқорлық тәуекелдеріне ішкі талдау және алдын алу шаралары туралы материалдар.',
      analysis:'Сыбайлас жемқорлық тәуекелдеріне ішкі талдау', analysisText:'Архив материалдарында ішкі талдау нәтижесінде талдамалық анықтама, сыбайлас жемқорлық тәуекелдеріне ұшырауы мүмкін лауазымдар тізбесі және алдын алу шараларының жоспары дайындалғаны көрсетілген.',
      publishedBefore:'Архив туралы талдамалық анықтаманы ШҚО басқармасы ', publishedDate:'2026 жылғы 24 қыркүйекте', publishedAfter:' жариялады.',
      report:'Анықтаманы gov.kz сайтында ашу', external:'Сыртқы сайт жаңа қойындыда ашылады; дереккөз орыс тілінде',
      contacts:'Байланыс', contactsText:'Комплаенс-офицердің тікелей байланысы нақтылануда. Архивтің жалпы телефоны мен мекенжайы анықтамалықта берілген.', branches:'Филиалдар және байланыс',
      materials:'2026 жылғы материалдар', announcement:'Талдаудың басталуы туралы хабарландыру', announcedBefore:'Архив хабарландыруында талдаудың басталуы ', announcedDate:'2026 жылғы 11 қыркүйекке', announcedAfter:' белгіленген.',
      sourceAnnouncement:'Дереккөз — «О проведении внутреннего анализа коррупционных рисков», тапсырыс берушінің құжаты.', measures:'Талдау нәтижесіндегі шаралар',
      measuresBefore:'Архив анықтамасында сатып алулар мен ақылы қызметтер үшін жауапкершілікті бөлу және кадр қызметінің жұмысы туралы ', date1:'2026 жылғы 21 қазандағы', between:' және ', date2:'22 қазандағы', measuresAfter:' бұйрықтар аталған.',
      sourceMeasures:'Дереккөз — «Информация о работе комплаенс-службы», тапсырыс берушінің құжаты.', official:'Басқарманың ресми материалдары', officialLink:'gov.kz сайтындағы «Сыбайлас жемқорлыққа қарсы іс-қимыл» бөлімі'
    },
    en: {
      breadcrumb:'Breadcrumbs', home:'Home', about:'About the archive', section:'Compliance service', title:'Compliance service and anti-corruption',
      intro:'Materials on the internal analysis of corruption risks and preventive measures at the archive.',
      analysis:'Internal analysis of corruption risks', analysisText:'The archive materials state that the internal analysis resulted in an analytical report, a list of positions exposed to corruption risks and a plan of preventive measures.',
      publishedBefore:'The regional department published the analytical report about the archive on ', publishedDate:'24 September 2026', publishedAfter:'.',
      report:'Open the report on gov.kz', external:'External website, opens in a new tab; source in Russian',
      contacts:'Contacts', contactsText:'The compliance officer’s direct contact is being confirmed. The archive’s general phone number and address are available in the directory.', branches:'Branches and contacts',
      materials:'Materials for 2026', announcement:'Announcement of the analysis', announcedBefore:'The archive announcement scheduled the start of the analysis for ', announcedDate:'11 September 2026', announcedAfter:'.',
      sourceAnnouncement:'Source: «О проведении внутреннего анализа коррупционных рисков», customer-provided document.', measures:'Measures following the analysis',
      measuresBefore:'The archive report mentions orders dated ', date1:'21 October', between:' and ', date2:'22 October 2026', measuresAfter:' concerning the allocation of responsibility for procurement and paid services and the work of the personnel department.',
      sourceMeasures:'Source: «Информация о работе комплаенс-службы», customer-provided document.', official:'Official materials from the department', officialLink:'Anti-corruption section on gov.kz'
    }
  };
  window.renderCompliance = function renderCompliance(container, language) {
    const t = copy[language] || copy.ru;
    container.innerHTML = `<section class="info-page" aria-labelledby="compliance-title"><div class="info-container">
      <header class="info-heading"><nav class="info-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/section/about">${t.about}</a><span aria-hidden="true">/</span><span aria-current="page">${t.section}</span></nav><h1 id="compliance-title">${t.title}</h1><p class="info-intro">${t.intro}</p></header>
      <div class="info-two-col"><article class="info-paper-card info-about-story"><h2>${t.analysis}</h2><p>${t.analysisText}</p><p class="info-source">${t.publishedBefore}<time datetime="2026-09-24">${t.publishedDate}</time>${t.publishedAfter}</p><a class="info-text-link" href="${reportUrl}" target="_blank" rel="noopener noreferrer">${t.report} <span aria-hidden="true">↗</span><span class="sr-only"> — ${t.external}</span></a></article>
      <aside class="info-paper-card info-help-aside"><h2>${t.contacts}</h2><p>${t.contactsText}</p><a class="info-text-link" href="#/section/branches">${t.branches} <span aria-hidden="true">→</span></a></aside></div>
      <section aria-labelledby="compliance-materials"><div class="info-section-title"><h2 id="compliance-materials">${t.materials}</h2></div><div class="info-link-grid"><article class="info-paper-card info-about-story"><h3>${t.announcement}</h3><p>${t.announcedBefore}<time datetime="2026-09-11">${t.announcedDate}</time>${t.announcedAfter}</p><p class="info-source">${t.sourceAnnouncement}</p></article><article class="info-paper-card info-about-story"><h3>${t.measures}</h3><p>${t.measuresBefore}<time datetime="2026-10-21">${t.date1}</time>${t.between}<time datetime="2026-10-22">${t.date2}</time>${t.measuresAfter}</p><p class="info-source">${t.sourceMeasures}</p></article></div></section>
      <div class="info-section-title"><h2>${t.official}</h2></div><a class="info-text-link" href="${departmentUrl}" target="_blank" rel="noopener noreferrer">${t.officialLink} <span aria-hidden="true">↗</span><span class="sr-only"> — ${t.external}</span></a>
    </div></section>`;
  };
}());
