/* Official reference links checked on 2026-11-10; publication approval remains with the archive. */
(function () {
  'use strict';

  const serviceUrl = 'https://beta.egov.kz/services/3014?lang=ru';
  const rulesUrl = 'https://adilet.zan.kz/rus/docs/V2000020790';
  const lawUrl = 'https://adilet.zan.kz/rus/docs/Z1300000088';
  const branchReports = [
    ['988139', 'Шемонаихинский район'],
    ['988129', 'Район Үлкен Нарын'],
    ['988125', 'Уланский район']
  ];
  const copy = {
    ru: {
      breadcrumb:'Навигационная цепочка', home:'Главная', section:'Государственная услуга', eyebrow:'СПРАВОЧНАЯ ИНФОРМАЦИЯ', title:'Как получить архивную справку', intro:'Официальные сведения о выдаче архивных справок, копий документов и архивных выписок.',
      note:'Для оформления услуги перейдите на официальный внешний ресурс. Этот раздел помогает ознакомиться с порядком обращения.', service:'Справка, копия или выписка', description:'Услуга позволяет получить подтверждение сведений социально-правового характера по архивным документам. Возможный результат зависит от наличия запрашиваемых сведений в архиве.', recipients:'Получатели', recipientsValue:'Физические и юридические лица', cost:'Стоимость по карточке eGov', costValue:'Бесплатно', duration:'Срок по карточке eGov', durationValue:'В течение 11 рабочих дней', checked:'Условия сверены с карточкой официального портала 10 ноября 2026 года. Перед обращением ознакомьтесь с её актуальной редакцией.', serviceLink:'Информация об услуге на eGov', externalSource:'Внешний официальный ресурс · beta.egov.kz · источник на русском языке', external:' — внешний сайт, откроется в новой вкладке; источник на русском языке',
      before:'Перед обращением', steps:['Откройте карточку услуги на официальном портале.','Выберите подходящий способ обращения и ознакомьтесь с перечнем необходимых документов.','Следуйте инструкции выбранного официального канала.'], contacts:'Уточнить контакты архива', contactText:'Адреса и телефоны учреждения и филиалов собраны в справочнике.', branches:'Филиалы и контакты', documents:'Документы и правила', law:'Закон о государственных услугах', lawText:'Закон Республики Казахстан от 15 апреля 2013 года № 88-V. Наименование и актуальная редакция доступны в ИПС «Әділет».', lawLink:'Открыть закон в «Әділет»', rules:'Правила в области архивного дела', rulesText:'Официальный документ о порядке оказания государственных услуг в области архивного дела, включая выдачу архивных справок.', rulesLink:'Открыть правила в «Әділет»', reports:'Отчёты филиалов за 2025 год', reportsText:'Опубликованные отчёты отдельных филиалов о работе с государственной услугой.', reportLabel:'отчёт за 2025 год', reportsLanguage:'Названия филиалов приведены по источнику на русском языке.', missingReport:'Сводный отчёт головного архива пока не добавлен.', caption:'Справочный экран прототипа. Содержание и внешние ссылки подлежат согласованию с заказчиком перед публикацией.'
    },
    kk: {
      breadcrumb:'Навигация жолы', home:'Басты бет', section:'Мемлекеттік қызмет', eyebrow:'АНЫҚТАМАЛЫҚ АҚПАРАТ', title:'Архивтік анықтаманы қалай алуға болады', intro:'Архивтік анықтамалар, құжат көшірмелері және архивтік үзінділер беру туралы ресми мәліметтер.',
      note:'Қызметті рәсімдеу үшін ресми сыртқы ресурсқа өтіңіз. Бұл бөлім өтініш беру тәртібімен танысуға көмектеседі.', service:'Анықтама, көшірме немесе үзінді', description:'Қызмет архивтік құжаттар негізінде әлеуметтік-құқықтық сипаттағы мәліметтерді растауға мүмкіндік береді. Нәтиже сұратылған мәліметтердің архивте болуына байланысты.', recipients:'Қызмет алушылар', recipientsValue:'Жеке және заңды тұлғалар', cost:'eGov карточкасы бойынша құны', costValue:'Тегін', duration:'eGov карточкасы бойынша мерзімі', durationValue:'11 жұмыс күні ішінде', checked:'Шарттар ресми портал карточкасымен 2026 жылғы 10 қарашада салыстырылды. Жүгінер алдында оның қолданыстағы редакциясымен танысыңыз.', serviceLink:'eGov сайтындағы қызмет туралы ақпарат', externalSource:'Сыртқы ресми ресурс · beta.egov.kz · дереккөз орыс тілінде', external:' — сыртқы сайт жаңа қойындыда ашылады; дереккөз орыс тілінде',
      before:'Жүгінер алдында', steps:['Ресми порталдағы қызмет карточкасын ашыңыз.','Қолайлы жүгіну тәсілін таңдап, қажетті құжаттар тізімімен танысыңыз.','Таңдалған ресми арнаның нұсқаулығын орындаңыз.'], contacts:'Архив байланысын нақтылау', contactText:'Мекеме мен филиалдардың мекенжайлары және телефондары анықтамалықта берілген.', branches:'Филиалдар және байланыс', documents:'Құжаттар мен қағидалар', law:'Мемлекеттік көрсетілетін қызметтер туралы заң', lawText:'Қазақстан Республикасының 2013 жылғы 15 сәуірдегі № 88-V заңы. Атауы мен қолданыстағы редакциясы «Әділет» жүйесінде берілген.', lawLink:'«Әділет» жүйесіндегі заңды ашу', rules:'Архив ісі саласындағы қағидалар', rulesText:'Архивтік анықтамалар беруді қоса алғанда, архив ісі саласында мемлекеттік қызметтер көрсету тәртібі туралы ресми құжат.', rulesLink:'«Әділет» жүйесіндегі қағидаларды ашу', reports:'Филиалдардың 2025 жылғы есептері', reportsText:'Жекелеген филиалдардың мемлекеттік қызмет бойынша жұмысы туралы жарияланған есептер.', reportLabel:'2025 жылғы есеп', reportsLanguage:'Филиал атаулары дереккөз бойынша орыс тілінде берілген.', missingReport:'Бас архивтің жиынтық есебі әзірге қосылмаған.', caption:'Прототиптің анықтамалық беті. Жариялау алдында мазмұны мен сыртқы сілтемелер тапсырыс берушімен келісілуі тиіс.'
    },
    en: {
      breadcrumb:'Breadcrumbs', home:'Home', section:'Public service', eyebrow:'VISITOR INFORMATION', title:'How to obtain an archival certificate', intro:'Official information on issuing archival certificates, document copies and archival extracts.',
      note:'To apply for the service, go to the official external resource. This section explains how to find the application procedure.', service:'Certificate, copy or extract', description:'The service can confirm information of a social or legal nature using archival documents. The outcome depends on whether the requested information is held by the archive.', recipients:'Recipients', recipientsValue:'Individuals and legal entities', cost:'Cost stated on eGov', costValue:'Free of charge', duration:'Time stated on eGov', durationValue:'Within 11 working days', checked:'The conditions were checked against the official portal record on 10 November 2026. Review the current version before applying.', serviceLink:'Service information on eGov', externalSource:'Official external resource · beta.egov.kz · source in Russian', external:' — external website, opens in a new tab; source in Russian',
      before:'Before applying', steps:['Open the service record on the official portal.','Choose an appropriate application channel and review the list of required documents.','Follow the instructions for the official channel you selected.'], contacts:'Confirm archive contacts', contactText:'Addresses and telephone numbers for the archive and its branches are listed in the directory.', branches:'Branches and contacts', documents:'Documents and rules', law:'Law on public services', lawText:'Law of the Republic of Kazakhstan No. 88-V of 15 April 2013. Its title and current version are available on Adilet.', lawLink:'Open the law on Adilet', rules:'Rules on archival work', rulesText:'The official document on the provision of public services in archival work, including the issue of archival certificates.', rulesLink:'Open the rules on Adilet', reports:'Branch reports for 2025', reportsText:'Published reports by individual branches on their work with the public service.', reportLabel:'report for 2025', reportsLanguage:'Branch names are shown in Russian as stated in the source.', missingReport:'A consolidated report for the main archive has not yet been added.', caption:'Information screen of the prototype. The content and external links require customer approval before publication.'
    }
  };

  function externalLink(url, label, t, { className = 'service-info-link', brand } = {}) {
    const linkLabel = `${label} <span aria-hidden="true">↗</span>`;
    const content = brand
      ? `<span class="service-info-brand service-info-brand--${brand}"><img src="assets/${brand}-logo.png" alt=""></span><span class="service-info-link-label">${linkLabel}</span>`
      : linkLabel;
    return `<a class="${className}${brand ? ' service-info-branded' : ''}" href="${url}" target="_blank" rel="noopener noreferrer">${content}<span class="sr-only">${t.external}</span></a>`;
  }

  window.renderServiceInfo = function renderServiceInfo(container, language = 'ru', showReports = false) {
    const t = copy[language] || copy.ru;
    container.innerHTML = `<section class="service-info-page" aria-labelledby="service-info-title"><div class="service-info-shell">
      <nav class="service-info-breadcrumbs" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.section}</span></nav>
      <header class="service-info-heading"><p class="service-info-eyebrow">${t.eyebrow}</p><h1 id="service-info-title">${t.title}</h1><p>${t.intro}</p></header>
      <div class="service-info-note" role="note">${t.note}</div>
      <div class="service-info-grid"><article class="service-info-card"><h2>${t.service}</h2><p>${t.description}</p><dl class="service-info-facts"><div><dt>${t.recipients}</dt><dd>${t.recipientsValue}</dd></div><div><dt>${t.cost}</dt><dd>${t.costValue}</dd></div><div><dt>${t.duration}</dt><dd>${t.durationValue}</dd></div></dl><p class="service-info-caption">${t.checked}</p>${externalLink(serviceUrl, t.serviceLink, t, { className: 'service-info-primary', brand: 'egov' })}<p class="service-info-external">${t.externalSource}</p></article>
      <aside class="service-info-aside"><h2>${t.before}</h2><ol class="service-info-steps">${t.steps.map(step => `<li>${step}</li>`).join('')}</ol><div class="service-info-contact"><h3>${t.contacts}</h3><p>${t.contactText}</p><a href="#/section/branches">${t.branches} →</a></div></aside></div>
      <section class="service-info-documents" aria-labelledby="service-info-docs"><h2 id="service-info-docs">${t.documents}</h2><div class="service-info-document-grid"><article class="service-info-card"><h3>${t.law}</h3><p>${t.lawText}</p>${externalLink(lawUrl, t.lawLink, t, { brand: 'adilet' })}</article><article class="service-info-card"><h3>${t.rules}</h3><p>${t.rulesText}</p>${externalLink(rulesUrl, t.rulesLink, t, { brand: 'adilet' })}</article></div></section>
      <section class="service-info-reports" aria-labelledby="branch-reports-title"><div><h2 id="branch-reports-title" tabindex="-1">${t.reports}</h2><p>${t.reportsText}</p><p class="service-info-caption">${t.reportsLanguage}</p>
        <ul>${branchReports.map(([id, branch]) => `<li>${externalLink('https://www.gov.kz/org/vko-uca/documents/details/' + id + '?lang=ru', `<span lang="ru">${branch}</span> · ${t.reportLabel}`, t)}</li>`).join('')}</ul>
        <p>${t.missingReport}</p></div><a href="#/section/branches">${t.branches} →</a></section>
      <p class="service-info-caption">${t.caption}</p>
    </div></section>`;
    if (showReports) {
      const reports = container.querySelector('#branch-reports-title');
      requestAnimationFrame(() => {
        if (!reports.isConnected) return;
        reports.scrollIntoView({ block: 'start' });
        reports.focus({ preventScroll: true });
      });
    }
  };
}());
