/* Department names retain the language of the customer-provided document. */
(function () {
  'use strict';

  const departments = [
    'Отдел обеспечения сохранности и государственного учёта документов',
    'Отдел комплектования и контроля за ведомственными архивами',
    'Отдел научно-справочного аппарата, публикации и научного использования документов',
    'Отдел информационных технологий',
    'Отдел экспертизы ценности документов',
    'Отдел финансовой и кадровой работы',
    'Отдел административно-хозяйственной части'
  ];
  const director = 'Жапаров Аскар Кенжебаевич';
  const deputy = 'Костина Елена Валерьевна';
  const contactSources = {
    ru: 'Контактная информация на сайте архива',
    kk: 'Архив сайтындағы байланыс ақпараты',
    en: 'Contact information on the archive website',
  };
  const copy = {
    ru: {
      breadcrumb:'Навигационная цепочка', home:'Главная', about:'Об архиве', title:'Структура архива', eyebrow:'ОБ АРХИВЕ', intro:'Должности и подразделения, указанные в материалах Государственного архива Восточно-Казахстанской области.',
      warning:'Данные требуют подтверждения.', warningText:'Перечень основан на документе заказчика; актуальный состав и подчинённость подразделений необходимо уточнить.', leadership:'РУКОВОДСТВО', management:'Управление архивом', roleIntro:'Должности, указанные в предоставленной структуре.', contacts:'Контакты архива', director:'Директор', deputy:'Заместители директора', deputyNote:'Две должности по документу', custodian:'Главный хранитель фондов',
      units:'ПОДРАЗДЕЛЕНИЯ', unitsHeading:'Отделы архива', unitsNote:'Наименования приведены по предоставленному документу.', source:'ИСТОЧНИК', sourceTitle:'Документ заказчика', sourceText:'«Структура.docx»; текст извлечён автоматически и требует сверки с оригиналом.', back:'Об архиве', branches:'Филиалы и контакты'
    },
    kk: {
      breadcrumb:'Навигация жолы', home:'Басты бет', about:'Архив туралы', title:'Архив құрылымы', eyebrow:'АРХИВ ТУРАЛЫ', intro:'Шығыс Қазақстан облысының мемлекеттік архиві ұсынған материалдарда көрсетілген лауазымдар мен бөлімшелер.',
      warning:'Мәліметтерді растау қажет.', warningText:'Тізім тапсырыс берушінің құжатына негізделген; бөлімшелердің қазіргі құрамы мен бағыныстылығын нақтылау қажет.', leadership:'БАСШЫЛЫҚ', management:'Архивті басқару', roleIntro:'Ұсынылған құрылымда көрсетілген лауазымдар.', contacts:'Архив байланыстары', director:'Директор', deputy:'Директордың орынбасарлары', deputyNote:'Құжат бойынша екі лауазым', custodian:'Қорлардың бас сақтаушысы',
      units:'БӨЛІМШЕЛЕР', unitsHeading:'Архив бөлімдері', unitsNote:'Бөлім атаулары ұсынылған құжаттың түпнұсқа тілінде — орысша берілген.', source:'ДЕРЕККӨЗ', sourceTitle:'Тапсырыс берушінің құжаты', sourceText:'«Структура.docx»; мәтін автоматты түрде алынған және түпнұсқамен салыстыруды қажет етеді.', back:'Архив туралы', branches:'Филиалдар және байланыс'
    },
    en: {
      breadcrumb:'Breadcrumbs', home:'Home', about:'About the archive', title:'Archive structure', eyebrow:'ABOUT THE ARCHIVE', intro:'Positions and departments listed in materials supplied by the State Archive of East Kazakhstan Region.',
      warning:'Information requires confirmation.', warningText:'The list is based on the customer’s document; the current structure and reporting relationships need to be confirmed.', leadership:'LEADERSHIP', management:'Archive management', roleIntro:'Positions listed in the supplied structure.', contacts:'Archive contacts', director:'Director', deputy:'Deputy directors', deputyNote:'Two positions listed in the document', custodian:'Chief custodian of fonds',
      units:'DEPARTMENTS', unitsHeading:'Archive departments', unitsNote:'Department names are shown in Russian, the original language of the supplied document.', source:'SOURCE', sourceTitle:'Customer-provided document', sourceText:'“Структура.docx”; the text was extracted automatically and needs to be checked against the original.', back:'About the archive', branches:'Branches and contacts'
    }
  };

  window.renderStructure = function renderStructure(container, language) {
    const t = copy[language] || copy.ru;
    const sourceLocale = language === 'kk' ? 'kk' : 'ru';
    container.innerHTML = `<section class="structure-page" aria-labelledby="structure-title"><div class="structure-shell">
      <nav class="structure-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/section/about">${t.about}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <header class="structure-heading"><p class="structure-eyebrow">${t.eyebrow}</p><h1 id="structure-title">${t.title}</h1><p>${t.intro}</p></header>
      <div class="structure-notice" role="note"><strong>${t.warning}</strong> ${t.warningText}</div>
      <div class="structure-intro"><div><p class="structure-eyebrow">${t.leadership}</p><h2>${t.management}</h2><p>${t.roleIntro}</p></div><a href="#/section/branches">${t.contacts} <span aria-hidden="true">→</span></a></div>
      <div class="structure-roles"><article><h3>${t.director}</h3><p lang="ru">${director}</p></article><article><h3>${t.deputy}</h3><p lang="ru">${deputy}</p><p>${t.deputyNote}</p></article><article><h3>${t.custodian}</h3></article></div>
      <div class="structure-intro structure-department-heading"><div><p class="structure-eyebrow">${t.units}</p><h2>${t.unitsHeading}</h2><p>${t.unitsNote}</p></div></div>
      <div class="structure-departments">${departments.map(name => `<article class="structure-department"><h3 lang="ru">${name}</h3></article>`).join('')}</div>
      <div class="structure-source"><div><p class="structure-eyebrow">${t.source}</p><h2>${t.sourceTitle}</h2><p>${t.sourceText}</p></div><a href="http://e-arhiv.vko.gov.kz/${sourceLocale}/Page/Index/1330" target="_blank" rel="noopener noreferrer">${contactSources[language] || contactSources.ru} <span aria-hidden="true">↗</span></a></div>
      <div class="structure-next"><a href="#/section/about">← ${t.back}</a><a href="#/section/branches">${t.branches} →</a></div>
    </div></section>`;
  };
}());
