/* Localized FAQ. The page is informational and has no service submission form. */
(function () {
  'use strict';
  const copy = {
    ru: {
      breadcrumb:'Навигационная цепочка', home:'Главная', section:'Помощь', label:'ГОСУДАРСТВЕННЫЙ АРХИВ ВКО', title:'Как пользоваться архивом', intro:'Ответы на основные вопросы о поиске и просмотре материалов.',
      questions:[
        ['Как найти материал в каталоге?','Откройте каталог и введите известное название или номер фонда. Если не знаете точного названия, начните с общего запроса.','Открыть каталог'],
        ['Что такое архивный шифр?','Архивный шифр помогает определить место документа в системе архива. Он может включать обозначения фонда, описи и дела.','Как читать архивный шифр'],
        ['Все ли документы доступны онлайн?','Нет. Наличие описания не означает, что электронная копия опубликована. Условия доступа указываются в карточке материала.'],
        ['Как узнать адрес и контакты архива?','Сведения о главном архиве и филиалах собраны на отдельной странице.','Филиалы и контакты'],
        ['Где посмотреть график читального зала?','На странице читального зала собраны часы работы по справке архива и рекомендации перед визитом.','Читальный зал'],
        ['Можно ли оформить услугу на сайте?','Сайт носит информационный характер: на нём не принимаются заявления, заказы и платежи. Справочные сведения об услугах публикуются отдельно.','Информация об услугах']
      ], asideLabel:'НУЖНА ПОДСКАЗКА?', asideTitle:'Начните с вопроса', asideText:'Опишите, какую информацию вы ищете, на главной странице.', asideLink:'Перейти на главную'
    },
    kk: {
      breadcrumb:'Навигация жолы',home:'Басты бет',section:'Көмек',label:'ШҚО МЕМЛЕКЕТТІК АРХИВІ',title:'Архивті қалай пайдалануға болады',intro:'Материалдарды іздеу және қарау туралы негізгі сұрақтарға жауаптар.',
      questions:[
        ['Каталогтан материалды қалай табуға болады?','Каталогты ашып, өзіңіз білетін атауды немесе қор нөмірін енгізіңіз. Нақты атауды білмесеңіз, жалпы сұраудан бастаңыз.','Каталогты ашу'],
        ['Архивтік шифр дегеніміз не?','Архивтік шифр құжаттың архив жүйесіндегі орнын анықтауға көмектеседі. Ол қор, тізімдеме және іс белгілерін қамтуы мүмкін.','Архивтік шифрды қалай оқу керек'],
        ['Барлық құжаттар онлайн қолжетімді ме?','Жоқ. Сипаттаманың болуы электрондық көшірменің жарияланғанын білдірмейді. Қолжетімділік шарттары материал карточкасында көрсетіледі.'],
        ['Архивтің мекенжайы мен байланыс деректерін қалай білуге болады?','Бас архив пен филиалдар туралы мәліметтер жеке бетте жинақталған.','Филиалдар және байланыс'],
        ['Оқу залының жұмыс кестесін қайдан көруге болады?','Оқу залы бетінде архив анықтамасындағы жұмыс уақыты мен келу алдындағы ұсынымдар берілген.','Оқу залы'],
        ['Сайтта қызметті рәсімдеуге бола ма?','Сайт ақпараттық сипатта: мұнда өтініштер, тапсырыстар мен төлемдер қабылданбайды. Қызметтер туралы анықтамалық мәліметтер бөлек жарияланады.','Қызметтер туралы ақпарат']
      ],asideLabel:'КӨМЕК КЕРЕК ПЕ?',asideTitle:'Сұрақ қоюдан бастаңыз',asideText:'Басты бетте қандай ақпарат іздейтініңізді сипаттаңыз.',asideLink:'Басты бетке өту'
    },
    en: {
      breadcrumb:'Breadcrumbs',home:'Home',section:'Help',label:'EAST KAZAKHSTAN STATE ARCHIVE',title:'How to use the archive',intro:'Answers to common questions about finding and viewing materials.',
      questions:[
        ['How do I find material in the catalogue?','Open the catalogue and enter a title or fund number you know. If you do not know the exact title, start with a general search.','Open the catalogue'],
        ['What is an archival reference?','An archival reference helps identify a document’s place in the archive. It may include the fund, inventory and case.','How to read an archival reference'],
        ['Are all documents available online?','No. A description does not mean that a digital copy is published. The material record states the conditions of access.'],
        ['How can I find archive addresses and contacts?','Information about the main archive and its branches is available on a separate page.','Branches and contacts'],
        ['Where can I see the reading room hours?','The reading room page gives the hours from the archive’s contact information and suggestions for preparing your visit.','Reading room'],
        ['Can I apply for a service on this site?','This is an information site: it does not accept applications, orders or payments. Information about services is published separately.','Information about services']
      ],asideLabel:'NEED GUIDANCE?',asideTitle:'Start with a question',asideText:'Describe the information you are looking for on the home page.',asideLink:'Go to home page'
    }
  };
  const destinations = ['#/catalog','#/cipher',null,'#/section/branches','#/section/reading-room','#/section/services'];
  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  window.renderLocalizedHelp = function renderLocalizedHelp(container, language) {
    const text = copy[language] || copy.ru;
    const opened = Array.from(container.querySelectorAll('.info-faq-list details')).map(item => item.open);
    const entries = text.questions.map(([question,answer,link], index) => `<details${opened[index] ? ' open' : ''}><summary>${question}<span class="info-plus" aria-hidden="true"></span></summary><div><p>${answer}</p>${link ? `<a class="info-text-link" href="${destinations[index]}">${link}${arrow}</a>` : ''}</div></details>`).join('');
    container.innerHTML = `<section class="info-page"><div class="info-container"><div class="info-heading"><nav class="info-breadcrumb" aria-label="${text.breadcrumb}"><a href="#/">${text.home}</a><span aria-hidden="true">/</span><span aria-current="page">${text.section}</span></nav><p class="info-eyebrow">${text.label}</p><h1>${text.title}</h1><p class="info-intro">${text.intro}</p></div><div class="info-help-layout"><div class="info-faq-list">${entries}</div><aside class="info-paper-card info-help-aside"><p class="info-card-label">${text.asideLabel}</p><h2>${text.asideTitle}</h2><p>${text.asideText}</p><a class="info-text-link" href="#/">${text.asideLink}${arrow}</a></aside></div></div></section>`;
  };
}());
