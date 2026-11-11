/* Local, static prototype: no backend, tracking, external AI, or submission. */
(function () {
  'use strict';

  const icons = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9" r="1.4"/><path d="m5 17 5-5 3 3 2-2 4 4"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    history: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    phone: '<path d="M6 3h3l1.5 4-2 1.8a15 15 0 0 0 6.7 6.7L17 13.5l4 1.5v3a3 3 0 0 1-3.3 3C10 20 4 14 3 6.3A3 3 0 0 1 6 3Z"/>',
    moon: '<path d="M20 15.4A8 8 0 0 1 8.6 4 8 8 0 1 0 20 15.4Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.2 8 8 10 4.8-2 8-5 8-10V5l-8-3Z"/><path d="m9 11 2 2 4-4"/>',
    book: '<path d="M4 4.5c3-1 5.5-.4 8 1.3 2.5-1.7 5-2.3 8-1.3v14c-3-1-5.5-.4-8 1.3-2.5-1.7-5-2.3-8-1.3v-14ZM12 6v14"/>',
    file: '<path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6M9 16h6"/>',
    assistant: '<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7Z"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
  const translations = {
    ru: {brandSub:'Государственный архив ВКО',catalog:'Каталог',exhibitions:'Выставки',memory:'Архив памяти',branches:'Филиалы',contacts:'Контакты',sections:'Разделы',askShort:'Спросить',footerTitle:'Государственный архив Восточно-Казахстанской области',footerDemo:'Локальный прототип · информация требует подтверждения',footerNav:'Разделы',about:'Об архиве',allSections:'Все разделы',contactDisclaimer:'Данные предоставлены заказчиком; актуальность уточняется.',footerInfo:'Информационный сайт · демонстрационная версия',heroEyebrow:'ЦИФРОВОЙ ЧИТАЛЬНЫЙ ЗАЛ',heroTitle:'Найдите документ, фото или фонд — просто спросите',heroDescription:'Помогаем находить историю Восточного Казахстана.',placeholder:'Спросите архив или введите шифр, название, место',assistantLabel:'Помощник архива · программа на основе ИИ',advanced:'Расширенный поиск',demo:'Демонстрационный режим: ИИ-поиск ещё не подключён.',example1:'Фото Усть-Каменогорска 1960-х',example2:'Где находится архив?',example3:'Что такое опись и дело?',tileCatalog:'Электронный каталог',tileExhibitions:'Онлайн-выставки',tileBranches:'Филиалы и контакты',tileMemory:'Большой архив памяти',tileAll:'Все разделы',historyTitle:'История в документах',allCollections:'Все подборки',historyTag:'Фотоматериалы',history1:'Город и его история',history2:'Улицы и повседневная жизнь',history3:'Люди и события региона',historySource:'Фото из макета · описание уточняется',branchesTitle:'Наши филиалы',allBranches:'Все филиалы',mapNote:'Координаты филиалов уточняются',mainArchive:'Головной архив',mainAddress:'Усть-Каменогорск, ул. Бейбітшілік, 26/1',branchMore:'Адреса и контакты →',newsTitle:'Новости и события',allNews:'Все новости',newsEmpty:'Публикации появятся после подтверждения материалов заказчиком.',newsLink:'О разделе новостей →',quick1:'Как пользоваться каталогом',quick2:'Что такое фонд, опись и дело',quick3:'Информация об услугах',responseLabel:'Помощник архива · демонстрационный сценарий',yourQuestion:'Ваш вопрос:',send:'Отправить',needQuestion:'Введите вопрос, чтобы продолжить.',languageNote:''},
    kk: {brandSub:'ШҚО мемлекеттік архиві',catalog:'Каталог',exhibitions:'Көрмелер',memory:'Архив жады',branches:'Филиалдар',contacts:'Байланыс',sections:'Бөлімдер',askShort:'Сұрау',footerTitle:'Шығыс Қазақстан облысының мемлекеттік архиві',footerDemo:'Жергілікті прототип · ақпарат тексерілуде',footerNav:'Бөлімдер',about:'Архив туралы',allSections:'Барлық бөлімдер',contactDisclaimer:'Тапсырыс беруші ұсынған мәліметтердің өзектілігі нақтылануда.',footerInfo:'Ақпараттық сайт · демонстрациялық нұсқа',heroEyebrow:'ЦИФРЛЫҚ ОҚУ ЗАЛЫ',heroTitle:'Құжатты, фотоны немесе қорды табу үшін жай ғана сұраңыз',heroDescription:'Шығыс Қазақстан тарихын табуға көмектесеміз.',placeholder:'Архивтен сұраңыз немесе шифрды, атауды енгізіңіз',assistantLabel:'Архив көмекшісі · жасанды интеллектке негізделген бағдарлама',advanced:'Кеңейтілген іздеу',demo:'Демонстрациялық режим: ЖИ іздеуі әлі қосылған жоқ.',example1:'Өскеменнің 1960 жылдардағы суреттері',example2:'Архив қайда орналасқан?',example3:'Тізімдеме мен іс деген не?',tileCatalog:'Электрондық каталог',tileExhibitions:'Онлайн көрмелер',tileBranches:'Филиалдар мен байланыс',tileMemory:'Үлкен архив жады',tileAll:'Барлық бөлімдер',historyTitle:'Құжаттардағы тарих',allCollections:'Барлық жинақтар',historyTag:'Фотоматериалдар',history1:'Қала және оның тарихы',history2:'Көшелер мен күнделікті өмір',history3:'Өңірдегі адамдар мен оқиғалар',historySource:'Макеттегі сурет · сипаттамасы нақтылануда',branchesTitle:'Біздің филиалдар',allBranches:'Барлық филиалдар',mapNote:'Филиалдардың координаттары нақтылануда',mainArchive:'Бас архив',mainAddress:'Өскемен, Бейбітшілік көшесі, 26/1',branchMore:'Мекенжай мен байланыс →',newsTitle:'Жаңалықтар мен оқиғалар',allNews:'Барлық жаңалықтар',newsEmpty:'Жарияланымдар тапсырыс беруші материалдарды растағаннан кейін шығады.',newsLink:'Жаңалықтар бөлімі →',quick1:'Каталогты пайдалану',quick2:'Қор, тізімдеме және іс',quick3:'Қызметтер туралы ақпарат',responseLabel:'Архив көмекшісі · демонстрациялық сценарий',yourQuestion:'Сіздің сұрағыңыз:',send:'Жіберу',needQuestion:'Жалғастыру үшін сұрақ енгізіңіз.',languageNote:'Бұл бөлімнің аудармасы дайындалуда. Түпнұсқа орыс тілінде көрсетілген.'},
    en: {brandSub:'East Kazakhstan State Archive',catalog:'Catalogue',exhibitions:'Exhibitions',memory:'Memory archive',branches:'Branches',contacts:'Contacts',sections:'Sections',askShort:'Ask',footerTitle:'State Archive of East Kazakhstan Region',footerDemo:'Local prototype · information is subject to verification',footerNav:'Explore',about:'About the archive',allSections:'All sections',contactDisclaimer:'Information supplied by the customer; accuracy is being verified.',footerInfo:'Information website · demonstration version',heroEyebrow:'DIGITAL READING ROOM',heroTitle:'Find a document, photo or collection — just ask',heroDescription:'Explore the history of East Kazakhstan.',placeholder:'Ask the archive or enter a reference, title or place',assistantLabel:'Archive assistant · an AI-based program',advanced:'Advanced search',demo:'Demo mode: AI search is not connected yet.',example1:'Photos of Ust-Kamenogorsk in the 1960s',example2:'Where is the archive?',example3:'What are an inventory and a case?',tileCatalog:'Electronic catalogue',tileExhibitions:'Online exhibitions',tileBranches:'Branches and contacts',tileMemory:'Memory archive',tileAll:'All sections',historyTitle:'History in documents',allCollections:'All collections',historyTag:'Photographs',history1:'The city and its history',history2:'Streets and everyday life',history3:'People and events in the region',historySource:'Photo from the mockup · caption to be verified',branchesTitle:'Our branches',allBranches:'All branches',mapNote:'Branch coordinates are being verified',mainArchive:'Main archive',mainAddress:'Ust-Kamenogorsk, 26/1 Beibitshilik Street',branchMore:'Addresses and contacts →',newsTitle:'News and events',allNews:'All news',newsEmpty:'Updates will appear after the content is approved.',newsLink:'News section →',quick1:'How to use the catalogue',quick2:'Funds, inventories and cases',quick3:'Information about services',responseLabel:'Archive assistant · demonstration scenario',yourQuestion:'Your question:',send:'Send',needQuestion:'Enter a question to continue.',languageNote:'Translation of this section is in progress. The Russian original is shown.'}
  };
  translations.ru.brandShort='Госархив ВКО'; translations.kk.brandShort='ШҚО архиві'; translations.en.brandShort='East Kazakhstan Archive';
  Object.assign(translations.ru,{openMenu:'Открыть меню',closeMenu:'Закрыть меню'});
  Object.assign(translations.kk,{openMenu:'Мәзірді ашу',closeMenu:'Мәзірді жабу'});
  Object.assign(translations.en,{openMenu:'Open menu',closeMenu:'Close menu'});
  Object.assign(translations.ru, {
    skipContent: 'Перейти к содержанию',
    brandHome: 'Государственный архив — на главную',
    mainNav: 'Основная навигация',
    interfaceLanguage: 'Язык интерфейса',
    mobileMenu: 'Мобильное меню',
    siteSections: 'Разделы сайта',
    quickNav: 'Быстрые переходы',
    copyright: '© Государственный архив ВКО',
    darkTheme: 'Включить тёмную тему',
    lightTheme: 'Включить светлую тему',
    textSize: 'Размер текста',
    notFound: 'Страница не найдена',
    notFoundHelp: 'Проверьте адрес или вернитесь на главную.',
    home: 'На главную'
  });
  Object.assign(translations.kk, {
    skipContent: 'Мазмұнға өту',
    brandHome: 'Мемлекеттік архив — басты бетке',
    mainNav: 'Негізгі навигация',
    interfaceLanguage: 'Интерфейс тілі',
    mobileMenu: 'Мобильді мәзір',
    siteSections: 'Сайт бөлімдері',
    quickNav: 'Жылдам өту',
    copyright: '© ШҚО мемлекеттік архиві',
    darkTheme: 'Қараңғы тақырыпты қосу',
    lightTheme: 'Жарық тақырыпты қосу',
    textSize: 'Мәтін өлшемі',
    notFound: 'Бет табылмады',
    notFoundHelp: 'Мекенжайды тексеріңіз немесе басты бетке оралыңыз.',
    home: 'Басты бетке'
  });
  Object.assign(translations.en, {
    skipContent: 'Skip to content',
    brandHome: 'State Archive — home',
    mainNav: 'Main navigation',
    interfaceLanguage: 'Interface language',
    mobileMenu: 'Mobile menu',
    siteSections: 'Site sections',
    quickNav: 'Quick navigation',
    copyright: '© East Kazakhstan State Archive',
    darkTheme: 'Switch to dark theme',
    lightTheme: 'Switch to light theme',
    textSize: 'Text size',
    notFound: 'Page not found',
    notFoundHelp: 'Check the address or return to the home page.',
    home: 'Home'
  });
  translations.ru.archivedNews = 'Из архива новостей';
  translations.kk.archivedNews = 'Жаңалықтар мұрағатынан · орыс тілінде';
  translations.en.archivedNews = 'From the news archive · in Russian';
  translations.ru.mainMap = 'Карта главного архива';
  translations.kk.mainMap = 'Бас архивтің картасы';
  translations.en.mainMap = 'Main archive map';
  Object.assign(translations.ru,{homeExhibitionTitle:'Онлайн-выставка',homeExhibitionKicker:'ДЕМОНСТРАЦИОННАЯ ПОДБОРКА',homeExhibitionName:'История в фотографиях',homeExhibitionDescription:'Пример виртуальной выставки: изображения из макета, подписи и права уточняются.',homeExhibitionAction:'Смотреть выставку'});
  Object.assign(translations.kk,{homeExhibitionTitle:'Онлайн көрме',homeExhibitionKicker:'ДЕМОНСТРАЦИЯЛЫҚ ЖИНАҚ',homeExhibitionName:'Фотосуреттердегі тарих',homeExhibitionDescription:'Виртуалды көрме үлгісі: суреттер макеттен алынған, сипаттамасы мен құқықтары нақтылануда.',homeExhibitionAction:'Көрмені көру'});
  Object.assign(translations.en,{homeExhibitionTitle:'Online exhibition',homeExhibitionKicker:'DEMONSTRATION COLLECTION',homeExhibitionName:'History in photographs',homeExhibitionDescription:'A virtual exhibition example: images are from the mockup; captions and rights need verification.',homeExhibitionAction:'Explore the exhibition'});

  Object.assign(translations.ru,{portalStatus:'Информационный ресурс · прототип',referenceInfo:'Справочная информация',symbols:'Государственные символы Республики Казахстан',heroTitle:'Найдите информацию в архиве',heroDescription:'Задайте вопрос ИИ-помощнику или перейдите к поиску архивных документов и сведений.',heroEyebrow:'ГОСУДАРСТВЕННЫЙ АРХИВ ВКО',placeholder:'Спросите об архиве или документах…',assistantLabel:'ИИ-помощник архива',tileHistory:'История архива'});
  Object.assign(translations.kk,{portalStatus:'Ақпараттық ресурс · прототип',referenceInfo:'Анықтамалық ақпарат',symbols:'Қазақстан Республикасының мемлекеттік рәміздері',heroTitle:'Архивтен ақпарат табыңыз',heroDescription:'ЖИ көмекшісіне сұрақ қойыңыз немесе архив құжаттары мен мәліметтерін іздеуге өтіңіз.',heroEyebrow:'ШҚО МЕМЛЕКЕТТІК АРХИВІ',placeholder:'Архив немесе құжаттар туралы сұраңыз…',assistantLabel:'Архивтің ЖИ көмекшісі',tileHistory:'Архив тарихы'});
  Object.assign(translations.en,{portalStatus:'Information resource · prototype',referenceInfo:'Visitor information',symbols:'State symbols of the Republic of Kazakhstan',heroTitle:'Find information in the archive',heroDescription:'Ask the AI assistant or search for archival documents and information.',heroEyebrow:'EAST KAZAKHSTAN STATE ARCHIVE',placeholder:'Ask about the archive or documents…',assistantLabel:'Archive AI assistant',tileHistory:'Archive history'});
  Object.assign(translations.ru, {
    footerHours:'Режим работы: понедельник–пятница, 08:00–17:00',
    footerResources:'Государственные ресурсы и полезные ссылки',
    footerPrivacy:'Конфиденциальность',
    footerRights:'Авторские права'
  });
  Object.assign(translations.kk, {
    footerHours:'Жұмыс уақыты: дүйсенбі–жұма, 08:00–17:00',
    footerResources:'Мемлекеттік ресурстар және пайдалы сілтемелер',
    footerPrivacy:'Құпиялық',
    footerRights:'Авторлық құқық'
  });
  Object.assign(translations.en, {
    footerHours:'Opening hours: Monday–Friday, 08:00–17:00',
    footerResources:'Government resources and useful links',
    footerPrivacy:'Privacy',
    footerRights:'Copyright'
  });
  const state = {language: safeGet('sandyq-language') || 'ru', theme: safeGet('sandyq-theme') || 'light', font: safeGet('sandyq-font') || '100', messages:[]};
  if (!translations[state.language]) state.language = 'ru';
  const app = document.getElementById('app');
  const tr = (key) => translations[state.language][key] || translations.ru[key] || key;
  function safeGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function safeSet(key,value) { try { localStorage.setItem(key,value); } catch { /* Preferences are optional. */ } }
  function injectIcons(root) { root.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); }); }
  function translateStatic(root) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = tr(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-label]').forEach(el => {
      el.setAttribute('aria-label', tr(el.dataset.i18nLabel));
    });
  }
  function applySettings() {
    document.documentElement.lang = state.language;
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.fontScale = state.font;
    document.getElementById('language').value = state.language;
    document.getElementById('theme-toggle').innerHTML = icon(state.theme === 'dark' ? 'sun' : 'moon');
    const themeLabel = tr(state.theme === 'dark' ? 'lightTheme' : 'darkTheme');
    document.getElementById('theme-toggle').setAttribute('aria-label', themeLabel);
    document.getElementById('theme-toggle').title = themeLabel;
    const fontLabel = tr('textSize') + ' ' + state.font + '%';
    document.getElementById('font-toggle').setAttribute('aria-label', fontLabel);
    document.getElementById('font-toggle').title = fontLabel;
    document.getElementById('skip-link').textContent = tr('skipContent');
    document.title = tr('footerTitle');
    document.getElementById('menu-toggle').setAttribute('aria-label',tr(document.getElementById('mobile-menu').hidden ? 'openMenu' : 'closeMenu'));
    translateStatic(document.querySelector('.site-header'));
    translateStatic(document.querySelector('.site-footer'));
    translateStatic(document.querySelector('.mobile-dock'));
  }
  function tile(href, symbol, label) { return `<a class="section-tile" href="${href}"><span class="tile-icon">${icon(symbol)}</span><span class="tile-text">${label}</span></a>`; }
  function historyCard(photo,title) { return `<a class="history-card" href="#/memory"><img src="assets/${photo}" alt="" loading="lazy"><div class="history-body"><span class="history-tag">${tr('historyTag')}</span><h3>${title}</h3><p>${tr('historySource')}</p></div></a>`; }
  function renderHome(focusQuestion) {
    const newsPreview = window.getNewsPreview?.();
    app.innerHTML = `<div class="shell home-page">
      <div class="portal-search-area"><div class="portal-landscape" aria-hidden="true"></div><section class="hero" aria-labelledby="hero-title"><div class="hero-content"><p class="hero-eyebrow">${tr('heroEyebrow')}</p><h1 id="hero-title">${tr('heroTitle')}</h1><p class="hero-desc">${tr('heroDescription')}</p></div></section>
      <section class="assistant-wrap" aria-label="${tr('assistantLabel')}"><form class="composer" id="chat-form"><span class="composer-icon">${icon('assistant')}</span><label class="sr-only" for="chat-input">${tr('assistantLabel')}</label><input id="chat-input" name="question" type="search" placeholder="${tr('placeholder')}" autocomplete="off" maxlength="500"><button class="submit-button" type="submit" aria-label="${tr('send')}">${icon('arrowUp')}</button></form>
        <div class="assistant-meta">${icon('shield')}<span>${tr('assistantLabel')}</span><span aria-hidden="true">·</span><a href="#/catalog">${tr('advanced')}</a></div><p class="demo-note">${tr('demo')}</p>
        <div class="example-list"><button class="example" type="button" data-question="ridder">${window.ridderRecord.questions[state.language]}</button><button class="example" type="button" data-question="address">${tr('example2')}</button><button class="example" type="button" data-question="terms">${tr('example3')}</button></div><div id="response-area" aria-live="polite"></div>
      </section>
      </div><nav class="section-tiles" aria-label="${tr('sections')}">${tile('#/catalog','layers',tr('tileCatalog'))}${tile('#/exhibition','image',tr('tileExhibitions'))}${tile('#/section/branches','pin',tr('tileBranches'))}${tile('#/section/history','history',tr('tileHistory'))}${tile('#/section/all','grid',tr('tileAll'))}</nav>
      <section class="section-block" aria-labelledby="history-title"><div class="section-title"><h2 id="history-title">${tr('historyTitle')}</h2><a href="#/memory">${tr('allCollections')} →</a></div><div class="history-grid">${historyCard('history-flood.jpg',tr('history1'))}${historyCard('history-street.jpg',tr('history2'))}${historyCard('history-wharf.jpg',tr('history3'))}</div></section>
      <section class="section-block" aria-labelledby="home-exhibition-title"><div class="section-title"><h2 id="home-exhibition-title">${tr('homeExhibitionTitle')}</h2><a href="#/exhibition">${tr('homeExhibitionAction')} →</a></div><a class="home-exhibition" href="#/exhibition"><img src="assets/history-street.jpg" alt="" loading="lazy"><span class="home-exhibition-copy"><span class="home-exhibition-kicker">${tr('homeExhibitionKicker')}</span><strong>${tr('homeExhibitionName')}</strong><span>${tr('homeExhibitionDescription')}</span><span class="home-exhibition-link">${tr('homeExhibitionAction')} →</span></span></a></section>
      <div class="home-grid"><section class="home-panel"><div class="panel-heading"><h2 class="panel-title">${tr('branchesTitle')}</h2><a href="#/section/branches">${tr('allBranches')} →</a></div><div class="branch-inner"><a class="map-placeholder home-map-link" href="#/section/branches?id=main"><span>${icon('pin')}${tr('mainMap')} →</span></a><div class="branch-address"><strong>${tr('mainArchive')}</strong><span>${tr('mainAddress')}</span><a href="#/section/branches">${tr('branchMore')}</a></div></div></section>
      <section class="home-panel" aria-labelledby="home-news-title"><div class="panel-heading"><h2 class="panel-title" id="home-news-title">${tr('newsTitle')}</h2><a href="#/section/news">${tr('allNews')} →</a></div><div class="news-empty home-news-preview"><p>${tr(newsPreview ? 'archivedNews' : 'newsEmpty')}</p><p class="home-news-date" lang="ru" hidden></p><a class="home-news-link" href="#/section/news">${tr('newsLink')}</a></div></section></div>
      <nav class="quick-info" aria-label="${tr('sections')}"><a href="#/section/help"><span class="tile-icon">${icon('book')}</span><span>${tr('quick1')}</span></a><a href="#/section/help"><span class="tile-icon">${icon('layers')}</span><span>${tr('quick2')}</span></a><a href="#/section/services"><span class="tile-icon">${icon('file')}</span><span>${tr('quick3')}</span></a></nav>
    </div>`;
    if (newsPreview) {
      const previewLink = app.querySelector('.home-news-link');
      previewLink.href = newsPreview.href;
      previewLink.textContent = newsPreview.title;
      previewLink.lang = 'ru';
      const previewDate = app.querySelector('.home-news-date');
      previewDate.textContent = newsPreview.dateLabel;
      previewDate.hidden = !newsPreview.dateLabel;
    }
    window.archiveApi.ready.then((available) => {
      const note = app.querySelector('.demo-note');
      if (available && note) note.textContent = {ru:'Отвечает программа на основе ИИ — только по открытым материалам архива, со ссылками на источники.',kk:'ЖИ негізіндегі бағдарлама тек архивтің ашық материалдары бойынша жауап береді.',en:'An AI-based program answers only from the archive’s open materials, with sources.'}[state.language];
    });
    const input = document.getElementById('chat-input');
    document.getElementById('chat-form').addEventListener('submit', (event) => { event.preventDefault(); ask(input.value); });
    app.querySelectorAll('[data-question]').forEach((button) => button.addEventListener('click', () => { input.value = button.textContent; ask(input.value,button.dataset.question); }));
    if (focusQuestion) input.focus();
  }
  function ask(raw,category) {
    const question = raw.trim();
    if (!question) { document.querySelector('#chat-input, #chat-followup')?.focus(); return; }
    const q = question.toLocaleLowerCase();
    const isArchiveAddress = /(архив|архиві|archive).{0,30}(где|адрес|находится|қайда|мекенжай|where)|(где|адрес|находится|қайда|мекенжай|where).{0,30}(архив|архиві|archive)/.test(q);
    const kind = category || (window.ridderRecord.matches(q) ? 'ridder' : /опись|опис[ьи]|дело|тізімдеме|inventory|\bcase\b/.test(q) ? 'terms' : isArchiveAddress ? 'address' : /фото|сурет|photo/.test(q) ? 'photos' : /р[-\s]?1|фонд|қор|fund/.test(q) ? 'fund' : 'unknown');
    if (kind.startsWith('demo-')) state.messages.push({question,kind});
    else {
      // Живой ответ сервера; если API недоступен, остаётся подготовленный локальный ответ.
      const message = {question,kind:'live',pending:true,fallbackKind:kind};
      state.messages.push(message);
      const refresh = () => { if (location.hash.split('?')[0] === '#/chat') renderChat(); };
      window.archiveApi.ready.then((available) => {
        if (!available) { message.kind = kind; return; }
        return window.archiveApi.post('/chat/messages',{question,locale:state.language}).then((reply) => { message.reply = reply; })
          .catch((error) => { if (error.status === 429 || error.status === 400) message.error = error.message; else message.kind = kind; });
      }).finally(() => { message.pending = false; refresh(); });
    }
    if (location.hash.split('?')[0] === '#/chat') { renderChat(); app.querySelector('#chat-followup')?.focus({preventScroll:true}); }
    else location.hash = '#/chat';
  }
  function answerFor(kind) {
    const answers = {
      ru:{terms:['Опись — перечень архивных дел внутри фонда; дело объединяет связанные документы. Это справочная подсказка, подготовленная заранее.','Как устроен архив','#/section/help'],address:['В предоставленных заказчиком материалах указан адрес главного архива: Усть-Каменогорск, ул. Бейбітшілік, 26/1. Актуальность контактов уточняется.','Филиалы и контакты','#/section/branches'],photos:['Подборка фотографий пока не опубликована, а поиск по архивным изображениям не подключён.','История в документах','#/section/memory'],fund:['В демонстрационном каталоге есть одна запись фонда Р-1 ч.с. из выгрузки 2018 года. Актуальность не подтверждена.','Открыть каталог','#/catalog?q=%D0%A0-1'],unknown:['Это демонстрационный сценарий: ИИ-поиск ещё не подключён, поэтому я не могу проверить ответ. Попробуйте поиск по описаниям в каталоге.','Перейти в каталог','#/catalog']},
      kk:{terms:['Тізімдеме — қордағы істер тізімі; іс өзара байланысты құжаттарды біріктіреді. Бұл алдын ала дайындалған анықтамалық жауап.','Көмек бөлімі','#/section/help'],address:['Тапсырыс беруші ұсынған мекенжай: Өскемен, Бейбітшілік көшесі, 26/1. Байланыс деректері нақтылануда.','Филиалдар мен байланыс','#/section/branches'],photos:['Фотосуреттер жинағы әзірге жарияланбаған, архив суреттері бойынша іздеу қосылмаған.','Құжаттардағы тарих','#/section/memory'],fund:['Демонстрациялық каталогта 2018 жылғы тізімнен Р-1 ч.с. қорының бір жазбасы бар. Өзектілігі расталмаған.','Каталогты ашу','#/catalog?q=%D0%A0-1'],unknown:['Бұл демонстрациялық сценарий: ЖИ іздеуі әлі қосылмаған, сондықтан жауапты тексере алмаймын. Каталогтағы жазбаларды қарап көріңіз.','Каталогқа өту','#/catalog']},
      en:{terms:['An inventory lists archival cases within a fund; a case groups related documents. This is a prepared guidance response.','How the archive works','#/section/help'],address:['The customer provided this address for the main archive: 26/1 Beibitshilik Street, Ust-Kamenogorsk. Contact details need confirmation.','Branches and contacts','#/section/branches'],photos:['The photo collection is not published yet and archival image search is not connected.','History in documents','#/section/memory'],fund:['The demonstration catalogue contains one record for fund Р-1 ч.с. from a 2018 export. Its current status is unconfirmed.','Open the catalogue','#/catalog?q=%D0%A0-1'],unknown:['This is a demonstration scenario: AI search is not connected, so I cannot verify an answer. Try the sample records in the catalogue.','Go to catalogue','#/catalog']}
    };
    if (kind === 'ridder') return window.ridderRecord.answers[state.language];
    return answers[state.language][kind] || answers[state.language].unknown;
  }
  function renderChat() {
    window.renderChat(app,{messages:state.messages,language:state.language,icon,answerFor,onSubmit:ask,onClear:()=>{state.messages=[];renderChat();app.querySelector('#chat-followup')?.focus();}});
  }
  function closeMenu(restoreFocus) {
    document.getElementById('mobile-menu').hidden = true;
    const toggle = document.getElementById('menu-toggle');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label',tr('openMenu'));
    if (restoreFocus) toggle.focus();
  }
  function renderNotFound() {
    app.lang = state.language;
    app.innerHTML = `<section class="shell page-shell"><h1>${tr('notFound')}</h1><p>${tr('notFoundHelp')}</p><a class="response-link" href="#/">${tr('home')} →</a></section>`;
  }
  function route() {
    const value = (location.hash || '#/').slice(1);
    const [path,query=''] = value.split('?');
    const navigationPath = path.startsWith('/fund/') || path.startsWith('/ridder/') || path.startsWith('/resource/') ? '/catalog'
      : path === '/exhibition' ? '/section/exhibitions' : path;
    document.querySelectorAll('.desktop-nav a, .mobile-menu a').forEach(link => {
      if (link.getAttribute('href') === '#' + navigationPath) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    let localized = ['/', '/ask', '/chat', '/catalog', '/fund/r1', '/section/branches', '/section/paid', '/section/feedback', '/section/reading-room', '/section/symbols', '/section/history', '/section/structure', '/section/about', '/section/help', '/section/normative', '/section/publications', '/section/news', '/section/compliance', '/section/personal-funds', '/section/all', '/section/links', '/section/services', '/section/privacy', '/section/copyright', '/exhibition', '/section/exhibitions', '/memory', '/section/memory', '/person', '/cipher', '/calendar', '/section/calendar', '/places', '/section/places', '/document'].includes(path)
      || window.ridderRecord.routes.includes(path) || path.startsWith('/resource/') || path === '/admin' || path.startsWith('/admin/');
    app.lang = localized ? state.language : 'ru';
    document.body.classList.toggle('chat-route',path === '/chat');
    document.body.classList.toggle('admin-route',path === '/admin' || path.startsWith('/admin/'));
    closeMenu(false);
    if (path === '/' || path === '/ask') { renderHome(path === '/ask'); return; }
    if (path === '/chat') { renderChat(); const question=new URLSearchParams(query).get('question'); const input=app.querySelector('#chat-followup'); if (question && input) { input.value=question.slice(0,500); } }
    else if (path === '/catalog') { window.renderCatalog(app,new URLSearchParams(query),state.language); }
    else if (window.ridderRecord.routes.includes(path)) { window.ridderRecord.render(app,path,state.language); }
    else if (path === '/fund/r1') { window.renderFund(app,state.language); }
    else if (path.startsWith('/resource/')) { window.renderResource(app,decodeURIComponent(path.slice('/resource/'.length)),state.language); }
    else if (path === '/exhibition' || path === '/section/exhibitions') { window.renderExhibition(app,new URLSearchParams(query),state.language); }
    else if (path === '/memory' || path === '/section/memory') { window.renderMemory(app,new URLSearchParams(query),state.language); }
    else if (path === '/section/branches') { window.renderBranches(app,new URLSearchParams(query),state.language); }
    else if (path === '/section/feedback') { window.renderFeedback(app,state.language); }
    else if (path === '/cipher') { window.renderCipher(app,state.language); }
    else if (path === '/section/structure') { window.renderStructure(app,state.language); }
    else if (path === '/section/help') { window.renderLocalizedHelp(app,state.language); }
    else if (path === '/admin' || path.startsWith('/admin/')) { window.renderAdmin(app,path.split('/')[2],state.language); }
    else if (path === '/person') { window.renderPerson(app,new URLSearchParams(query),state.language); }
    else if (path === '/calendar' || path === '/section/calendar') { window.renderCalendar(app,state.language); }
    else if (path === '/section/history') { window.renderArchiveHistory(app,state.language); }
    else if (path === '/places' || path === '/section/places') { window.renderPlaces(app,new URLSearchParams(query),state.language); }
    else if (path === '/section/services') { window.renderServiceInfo(app,state.language); }
    else if (path === '/section/paid') { window.renderPaidInfo(app,state.language); }
    else if (path === '/document') { window.renderDocumentViewer(app,new URLSearchParams(query),state.language); }
    else if (path === '/section/reading-room') { window.renderReadingRoom(app,state.language); }
    else if (path === '/section/compliance') { window.renderCompliance(app,state.language); }
    else if (path === '/section/normative') { window.renderNormativeDocuments(app,state.language); }
    else if (path === '/section/symbols') { window.renderStateSymbols(app,state.language); }
    else if (path === '/section/links') { window.renderOfficialLinks(app,state.language); }
    else if (path === '/section/privacy' || path === '/section/copyright') { window.renderPortalNotice(app,path.split('/')[2],state.language); }
    else if (path === '/section/news') { window.renderNews(app, new URLSearchParams(query),state.language); }
    else if (path === '/section/publications') { window.renderPublications(app,state.language); }
    else if (path === '/section/personal-funds') { window.renderPersonalFunds(app,state.language); }
    else if (path.startsWith('/section/')) {
      if (!window.renderSection(app,path.split('/')[2],state.language)) {
        renderNotFound();
        localized = true;
      }
    }
    else { renderNotFound(); localized = true; }
    if (state.language !== 'ru' && !localized) {
      const note=document.createElement('p'); note.className='translation-note shell'; note.lang=state.language; note.setAttribute('role','note'); note.textContent=tr('languageNote'); app.prepend(note);
    }
    window.scrollTo({top:0,behavior:'instant'});
  }
  injectIcons(document);
  applySettings();
  document.getElementById('skip-link').addEventListener('click', (event) => { event.preventDefault(); const main=document.getElementById('main'); main.focus(); main.scrollIntoView(); });
  document.getElementById('language').addEventListener('change', (event) => {
    const draftField = app.querySelector('#chat-input, #chat-followup');
    const draft = draftField ? {id:draftField.id, value:draftField.value} : null;
    if (location.hash.split('?')[0] === '#/catalog' && window.renderCatalog.captureParams) {
      const params = window.renderCatalog.captureParams();
      history.replaceState(null, '', '#/catalog' + (params.size ? '?' + params : ''));
    }
    state.language = event.target.value;
    safeSet('sandyq-language', state.language);
    applySettings();
    route();
    if (draft) {
      const field = app.querySelector('#' + draft.id);
      if (field) field.value = draft.value;
    }
  });
  document.getElementById('theme-toggle').addEventListener('click', () => { state.theme=state.theme==='light'?'dark':'light'; safeSet('sandyq-theme',state.theme); applySettings(); });
  document.getElementById('font-toggle').addEventListener('click', () => { const levels=['100','125','150','200']; state.font=levels[(levels.indexOf(state.font)+1)%levels.length]; safeSet('sandyq-font',state.font); applySettings(); if (getComputedStyle(document.getElementById('menu-toggle')).display === 'none') closeMenu(false); });
  document.getElementById('menu-toggle').addEventListener('click', (event) => { const menu=document.getElementById('mobile-menu'); menu.hidden=!menu.hidden; event.currentTarget.setAttribute('aria-expanded',String(!menu.hidden)); event.currentTarget.setAttribute('aria-label',tr(menu.hidden ? 'openMenu' : 'closeMenu')); });
  document.getElementById('mobile-menu').addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !document.getElementById('mobile-menu').hidden) closeMenu(true); });
  window.addEventListener('resize', () => { if (getComputedStyle(document.getElementById('menu-toggle')).display === 'none') closeMenu(false); });
  window.addEventListener('hashchange',route);
  route();
})();
