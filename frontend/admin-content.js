/* Static employee UI examples. No content is read, sent or saved. */
(function () {
  'use strict';

  function heading(kicker, title, description) {
    return `<div class="admin-heading"><div><p class="admin-kicker">${kicker}</p><h1>${title}</h1><p>${description}</p></div></div>`;
  }
  function note() {
    return '<p class="admin-content-note" role="note">Условный пример интерфейса. Названия и строки ниже не являются записями архива. Действия сохранения и публикации отключены.</p>';
  }
  function field(label, placeholder, type = 'text') {
    return `<label>${label}<input type="${type}" placeholder="${placeholder}" disabled></label>`;
  }
  function actions(primary) {
    return `<div class="admin-content-actions"><button type="button" class="admin-button-secondary" disabled>Сохранить черновик</button><button type="button" disabled>${primary}</button></div>`;
  }
  function content() {
    return `${heading('СОДЕРЖАНИЕ САЙТА', 'Страницы, новости и выставки', 'Список материалов и элементы редактирования содержания.')}${note()}
      <section class="admin-panel"><div class="admin-content-tools"><label>Поиск<input type="search" placeholder="Название материала" disabled></label><label>Тип<select disabled><option>Все типы материалов</option><option>Страница</option><option>Новость</option><option>Выставка</option><option>Историческая коллекция</option></select></label><button type="button" disabled>Создать материал</button></div>
      <div class="admin-content-list" role="list">${[['Пример информационной страницы','Страница','Черновик'],['Пример публикации','Новость','На проверке'],['Пример тематической экспозиции','Выставка','Черновик'],['Пример исторической подборки','Коллекция','Черновик']].map(([title,type,status])=>`<article class="admin-content-row" role="listitem"><div><span class="admin-content-type">${type} · условный пример</span><h2>${title}</h2><p>Язык: RU · дата публикации не задана</p></div><span class="admin-badge">${status}</span><a href="#/admin/review">Макет проверки →</a></article>`).join('')}</div></section>
      <div class="admin-content-grid"><section class="admin-panel"><h2>Содержание материала</h2><div class="admin-content-form">${field('Заголовок','Название материала')}<label>Описание<textarea rows="4" disabled placeholder="Описание, текст публикации или сведения о коллекции"></textarea></label>${field('Источник','Ссылка или описание источника')}${field('Категория','Тематическая категория')}</div>${actions('Отправить на проверку')}</section>
      <section class="admin-panel"><h2>Экспонаты и связанные материалы</h2><p class="admin-muted">Пример порядка экспонатов. Файлы и связи пока не подключены.</p><ol class="admin-content-order"><li><span>Пример фотографии</span><span>Позиция 1</span></li><li><span>Пример документа</span><span>Позиция 2</span></li></ol><div class="admin-content-form">${field('Связанный фонд','Выбор архивного фонда')}${field('Связанное событие','Выбор исторического события')}</div><div class="admin-content-actions"><button type="button" disabled>Добавить экспонат</button><button type="button" class="admin-button-secondary" disabled>Изменить порядок</button></div><a class="admin-content-link" href="#/admin/translations">Макет переводов →</a></section></div>`;
  }
  function translations() {
    return `${heading('ЯЗЫКОВЫЕ ВЕРСИИ', 'Редактор переводов', 'Сопоставление оригинала и перевода перед публикацией.')}${note()}
      <section class="admin-panel"><div class="admin-content-tools"><label>Материал<select disabled><option>Условный пример информационной страницы</option></select></label><label>Язык оригинала<select disabled><option>Русский (RU)</option></select></label><label>Язык перевода<select disabled><option>Қазақша (KK)</option><option>English (EN)</option><option>Русский (RU)</option></select></label></div><p class="admin-content-note">Перевод не проверен. Публикация должна быть доступна после проверки ответственным редактором.</p>
      <div class="admin-content-grid"><div><h2>Оригинал · RU</h2><div class="admin-content-form">${field('Заголовок оригинала','Название в исходном материале')}<label>Текст оригинала<textarea rows="8" disabled placeholder="Исходный текст материала"></textarea></label></div></div><div><h2>Перевод · KK</h2><div class="admin-content-form">${field('Заголовок перевода','Заголовок на выбранном языке')}<label>Текст перевода<textarea rows="8" disabled placeholder="Проверенный перевод материала"></textarea></label><label class="admin-content-check"><input type="checkbox" disabled>Перевод проверен редактором</label></div></div></div>${actions('Передать перевод на проверку')}</section>`;
  }
  function branchEditor() {
    return `${heading('ФИЛИАЛЫ', 'Редактор филиала', 'Контакты, график работы, изображение здания и отображение на карте.')}${note()}
      <div class="admin-content-grid"><section class="admin-panel"><h2>Основные сведения</h2><div class="admin-content-form">${field('Официальное название','Название из подтверждённого документа')}${field('Адрес','Населённый пункт, улица и номер здания')}${field('Телефон','Рабочий телефон')}${field('Электронная почта','Публичный адрес электронной почты','email')}${field('Режим работы','Рабочие дни и часы')}${field('Подразделения','Сведения о подразделениях')}<label>Описание<textarea rows="4" disabled placeholder="Краткая справочная информация"></textarea></label></div>${actions('Отправить на проверку')}</section>
      <section class="admin-panel"><h2>Карта и фотография</h2><div class="admin-content-form">${field('Широта','Подтверждённая координата')}${field('Долгота','Подтверждённая координата')}<label class="admin-content-check"><input type="checkbox" disabled>Показывать филиал на карте</label></div><div class="admin-content-placeholder"><strong>Изображение не выбрано</strong><p>Фотография здания и её источник будут указаны при подготовке материала.</p><button type="button" disabled>Выбрать фотографию</button></div><p class="admin-muted">Точка не показывается без подтверждённых координат. Этот макет не определяет местоположение.</p><a class="admin-content-link" href="#/section/branches">Публичный справочник филиалов →</a></section></div>`;
  }
  function review() {
    const statuses = ['Черновик','На проверке','Требует доработки','Одобрено','Опубликовано','Архивировано'];
    return `${heading('СОГЛАСОВАНИЕ', 'Карточка проверки материала', 'Проверка содержания, источников и переводов перед публикацией.')}${note()}
      <section class="admin-panel"><h2>Этапы согласования</h2><ol class="admin-content-statuses">${statuses.map((status,index)=>`<li${index===1?' aria-current="step"':''}><span>${index+1}</span>${status}</li>`).join('')}</ol><p class="admin-muted">Показан пример материала на проверке. Это не выполненная операция.</p></section>
      <div class="admin-content-grid"><section class="admin-panel"><div class="admin-panel-header"><div><h2>Условный пример публикации</h2><p>Новость · RU · демонстрационная запись</p></div><span class="admin-badge">На проверке</span></div><dl class="admin-content-facts"><div><dt>Автор</dt><dd>Не указан в примере</dd></div><div><dt>Филиал</dt><dd>Не выбран</dd></div><div><dt>Источник</dt><dd>Требует подтверждения</dd></div><div><dt>Переводы</dt><dd>Проверка не завершена</dd></div></dl><div class="admin-content-placeholder"><h3>Предпросмотр содержания</h3><p>Здесь будут показаны текст, изображения и связанные материалы выбранной публикации.</p></div><div class="admin-content-form"><label>Комментарий редактора<textarea rows="4" placeholder="Что необходимо уточнить или исправить" disabled></textarea></label></div><div class="admin-content-actions"><button type="button" class="admin-button-secondary" disabled>На доработку</button><button type="button" disabled>Одобрить</button></div></section>
      <section class="admin-panel"><h2>История проверки</h2><ol class="admin-content-history"><li><strong>Пример этапа: черновик</strong><p>Материал подготовлен для передачи редактору.</p></li><li><strong>Пример этапа: на проверке</strong><p>Редактор проверяет источник, содержание и языковые версии.</p></li></ol><h2>Подтверждение публикации</h2><div class="admin-content-confirm"><p>Опубликовать материал на сайте?</p><p class="admin-muted">В рабочей системе публикация должна учитывать согласованные права и проверку содержания.</p><div class="admin-content-actions"><button type="button" class="admin-button-secondary" disabled>Отмена</button><button type="button" disabled>Опубликовать</button></div></div><a class="admin-content-link" href="#/admin/content">К макету списка материалов →</a></section></div>`;
  }
  // Translate exact static text nodes so the four preview layouts share one markup structure.
  const textRows = [
    ['СОДЕРЖАНИЕ САЙТА','САЙТ МАЗМҰНЫ','SITE CONTENT'],
    ['Страницы, новости и выставки','Беттер, жаңалықтар және көрмелер','Pages, news and exhibitions'],
    ['Список материалов и элементы редактирования содержания.','Материалдар тізімі және мазмұнды өңдеу элементтері.','Materials and content editing controls.'],
    ['Условный пример интерфейса. Названия и строки ниже не являются записями архива. Действия сохранения и публикации отключены.','Интерфейстің шартты мысалы. Төмендегі атаулар мен жолдар архив жазбалары емес. Сақтау және жариялау әрекеттері өшірілген.','Illustrative interface. The titles and rows below are not archive records. Saving and publishing are disabled.'],
    ['Поиск','Іздеу','Search'], ['Тип','Түрі','Type'], ['Все типы материалов','Материалдардың барлық түрлері','All material types'],
    ['Страница','Бет','Page'], ['Новость','Жаңалық','News item'], ['Выставка','Көрме','Exhibition'], ['Историческая коллекция','Тарихи жинақ','Historical collection'],
    ['Создать материал','Материал жасау','Create material'], ['Страница · условный пример','Бет · шартты мысал','Page · illustrative example'],
    ['Пример информационной страницы','Ақпараттық беттің мысалы','Sample information page'],
    ['Язык: RU · дата публикации не задана','Тілі: RU · жариялау күні белгіленбеген','Language: RU · publication date not set'],
    ['Черновик','Жоба','Draft'], ['Макет проверки →','Тексеру макеті →','Review preview →'],
    ['Новость · условный пример','Жаңалық · шартты мысал','News item · illustrative example'], ['Пример публикации','Жарияланым мысалы','Sample publication'],
    ['На проверке','Тексеруде','Under review'], ['Выставка · условный пример','Көрме · шартты мысал','Exhibition · illustrative example'],
    ['Пример тематической экспозиции','Тақырыптық экспозиция мысалы','Sample thematic exhibition'],
    ['Коллекция · условный пример','Жинақ · шартты мысал','Collection · illustrative example'], ['Пример исторической подборки','Тарихи іріктеме мысалы','Sample historical collection'],
    ['Содержание материала','Материал мазмұны','Material content'], ['Заголовок','Тақырып','Title'], ['Описание','Сипаттама','Description'],
    ['Источник','Дереккөз','Source'], ['Категория','Санат','Category'], ['Сохранить черновик','Жобаны сақтау','Save draft'],
    ['Отправить на проверку','Тексеруге жіберу','Submit for review'], ['Экспонаты и связанные материалы','Экспонаттар және байланысты материалдар','Exhibits and related materials'],
    ['Пример порядка экспонатов. Файлы и связи пока не подключены.','Экспонаттар ретінің мысалы. Файлдар мен байланыстар әлі қосылмаған.','Sample exhibit order. Files and links are not connected yet.'],
    ['Пример фотографии','Фотосурет мысалы','Sample photograph'], ['Позиция 1','1-орын','Position 1'], ['Пример документа','Құжат мысалы','Sample document'], ['Позиция 2','2-орын','Position 2'],
    ['Связанный фонд','Байланысты қор','Related fund'], ['Связанное событие','Байланысты оқиға','Related event'], ['Добавить экспонат','Экспонат қосу','Add exhibit'],
    ['Изменить порядок','Ретін өзгерту','Change order'], ['Макет переводов →','Аударма макеті →','Translation preview →'],
    ['Название материала','Материал атауы','Material title'], ['Описание, текст публикации или сведения о коллекции','Сипаттама, жарияланым мәтіні немесе жинақ туралы мәлімет','Description, publication text or collection information'],
    ['Ссылка или описание источника','Дереккөз сілтемесі немесе сипаттамасы','Source link or description'], ['Тематическая категория','Тақырыптық санат','Thematic category'],
    ['Выбор архивного фонда','Архив қорын таңдау','Select an archive fund'], ['Выбор исторического события','Тарихи оқиғаны таңдау','Select a historical event'],
    ['ЯЗЫКОВЫЕ ВЕРСИИ','ТІЛДІК НҰСҚАЛАР','LANGUAGE VERSIONS'], ['Редактор переводов','Аударма редакторы','Translation editor'],
    ['Сопоставление оригинала и перевода перед публикацией.','Жариялау алдында түпнұсқа мен аударманы салыстыру.','Compare the original and translation before publication.'],
    ['Материал','Материал','Material'], ['Условный пример информационной страницы','Ақпараттық беттің шартты мысалы','Illustrative information page'],
    ['Язык оригинала','Түпнұсқа тілі','Original language'], ['Русский (RU)','Орысша (RU)','Russian (RU)'], ['Язык перевода','Аударма тілі','Translation language'],
    ['Қазақша (KK)','Қазақша (KK)','Kazakh (KK)'], ['English (EN)','Ағылшынша (EN)','English (EN)'],
    ['Перевод не проверен. Публикация должна быть доступна после проверки ответственным редактором.','Аударма тексерілмеген. Жариялау жауапты редактор тексергеннен кейін қолжетімді болуы тиіс.','The translation is unreviewed. Publication should be available after review by the responsible editor.'],
    ['Оригинал · RU','Түпнұсқа · RU','Original · RU'], ['Заголовок оригинала','Түпнұсқа тақырыбы','Original title'], ['Текст оригинала','Түпнұсқа мәтіні','Original text'],
    ['Перевод · KK','Аударма · KK','Translation · KK'], ['Заголовок перевода','Аударма тақырыбы','Translation title'], ['Текст перевода','Аударма мәтіні','Translation text'],
    ['Перевод проверен редактором','Аударманы редактор тексерді','Translation reviewed by the editor'], ['Передать перевод на проверку','Аударманы тексеруге жіберу','Submit translation for review'],
    ['Название в исходном материале','Бастапқы материалдағы атау','Title in the source material'], ['Исходный текст материала','Материалдың бастапқы мәтіні','Source material text'],
    ['Заголовок на выбранном языке','Таңдалған тілдегі тақырып','Title in the selected language'], ['Проверенный перевод материала','Материалдың тексерілген аудармасы','Reviewed translation'],
    ['ФИЛИАЛЫ','ФИЛИАЛДАР','BRANCHES'], ['Редактор филиала','Филиал редакторы','Branch editor'],
    ['Контакты, график работы, изображение здания и отображение на карте.','Байланыс, жұмыс кестесі, ғимарат суреті және картада көрсету.','Contacts, opening hours, building image and map display.'],
    ['Основные сведения','Негізгі мәліметтер','General information'], ['Официальное название','Ресми атауы','Official name'], ['Адрес','Мекенжай','Address'],
    ['Телефон','Телефон','Phone'], ['Электронная почта','Электрондық пошта','Email'], ['Режим работы','Жұмыс кестесі','Opening hours'],
    ['Подразделения','Бөлімшелер','Departments'], ['Карта и фотография','Карта және фотосурет','Map and photograph'], ['Широта','Ендік','Latitude'], ['Долгота','Бойлық','Longitude'],
    ['Показывать филиал на карте','Филиалды картада көрсету','Show branch on the map'], ['Изображение не выбрано','Сурет таңдалмаған','No image selected'],
    ['Фотография здания и её источник будут указаны при подготовке материала.','Ғимарат фотосуреті мен оның дереккөзі материалды дайындау кезінде көрсетіледі.','The building photograph and its source will be specified when preparing the material.'],
    ['Выбрать фотографию','Фотосуретті таңдау','Select photograph'],
    ['Точка не показывается без подтверждённых координат. Этот макет не определяет местоположение.','Расталған координаттарсыз нүкте көрсетілмейді. Бұл макет орналасқан жерді анықтамайды.','No marker is shown without confirmed coordinates. This preview does not determine a location.'],
    ['Публичный справочник филиалов →','Филиалдардың ашық анықтамалығы →','Public branch directory →'],
    ['Название из подтверждённого документа','Расталған құжаттағы атау','Name from a confirmed document'], ['Населённый пункт, улица и номер здания','Елді мекен, көше және ғимарат нөмірі','Town, street and building number'],
    ['Рабочий телефон','Жұмыс телефоны','Work phone'], ['Публичный адрес электронной почты','Ашық электрондық пошта мекенжайы','Public email address'],
    ['Рабочие дни и часы','Жұмыс күндері мен сағаттары','Working days and hours'], ['Сведения о подразделениях','Бөлімшелер туралы мәліметтер','Department information'],
    ['Краткая справочная информация','Қысқаша анықтамалық ақпарат','Brief visitor information'], ['Подтверждённая координата','Расталған координата','Confirmed coordinate'],
    ['СОГЛАСОВАНИЕ','КЕЛІСУ','APPROVAL'], ['Карточка проверки материала','Материалды тексеру карточкасы','Material review'],
    ['Проверка содержания, источников и переводов перед публикацией.','Жариялау алдында мазмұнды, дереккөздерді және аудармаларды тексеру.','Review content, sources and translations before publication.'],
    ['Этапы согласования','Келісу кезеңдері','Approval stages'], ['Требует доработки','Толықтыру қажет','Changes requested'], ['Одобрено','Мақұлданды','Approved'],
    ['Опубликовано','Жарияланды','Published'], ['Архивировано','Архивке жіберілді','Archived'],
    ['Показан пример материала на проверке. Это не выполненная операция.','Тексерудегі материал мысалы көрсетілген. Бұл орындалған әрекет емес.','This is an example of material under review, not a completed action.'],
    ['Условный пример публикации','Жарияланымның шартты мысалы','Illustrative publication'], ['Новость · RU · демонстрационная запись','Жаңалық · RU · демонстрациялық жазба','News item · RU · demonstration record'],
    ['Автор','Автор','Author'], ['Не указан в примере','Мысалда көрсетілмеген','Not specified in this example'], ['Филиал','Филиал','Branch'], ['Не выбран','Таңдалмаған','Not selected'],
    ['Требует подтверждения','Растау қажет','Needs confirmation'], ['Переводы','Аудармалар','Translations'], ['Проверка не завершена','Тексеру аяқталмаған','Review incomplete'],
    ['Предпросмотр содержания','Мазмұнды алдын ала қарау','Content preview'],
    ['Здесь будут показаны текст, изображения и связанные материалы выбранной публикации.','Мұнда таңдалған жарияланымның мәтіні, суреттері және байланысты материалдары көрсетіледі.','The selected publication text, images and related materials will appear here.'],
    ['Комментарий редактора','Редактор пікірі','Editor comment'], ['На доработку','Толықтыруға қайтару','Request changes'], ['Одобрить','Мақұлдау','Approve'],
    ['История проверки','Тексеру тарихы','Review history'], ['Пример этапа: черновик','Кезең мысалы: жоба','Sample stage: draft'],
    ['Материал подготовлен для передачи редактору.','Материал редакторға жіберуге дайындалған.','Material prepared for submission to the editor.'],
    ['Пример этапа: на проверке','Кезең мысалы: тексеруде','Sample stage: under review'],
    ['Редактор проверяет источник, содержание и языковые версии.','Редактор дереккөзді, мазмұнды және тілдік нұсқаларды тексереді.','The editor reviews the source, content and language versions.'],
    ['Подтверждение публикации','Жариялауды растау','Publication confirmation'], ['Опубликовать материал на сайте?','Материал сайтта жариялансын ба?','Publish this material on the website?'],
    ['В рабочей системе публикация должна учитывать согласованные права и проверку содержания.','Жұмыс жүйесінде жариялау келісілген құқықтар мен мазмұн тексеруін ескеруі тиіс.','In the working system, publication must respect agreed permissions and content review.'],
    ['Отмена','Бас тарту','Cancel'], ['Опубликовать','Жариялау','Publish'], ['К макету списка материалов →','Материалдар тізімінің макетіне →','Back to the materials list preview →'],
    ['Что необходимо уточнить или исправить','Нені нақтылау немесе түзету қажет','What needs clarification or correction']
  ];
  const dictionaries = {
    kk: new Map(textRows.map(([ru, kk]) => [ru, kk])),
    en: new Map(textRows.map(([ru, , en]) => [ru, en]))
  };
  function localizedMarkup(markup, language) {
    const dictionary = dictionaries[language];
    if (!dictionary) return markup;
    const template = document.createElement('template');
    template.innerHTML = markup;
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const original = node.nodeValue.trim();
      if (dictionary.has(original)) {
        const start = node.nodeValue.indexOf(original);
        node.nodeValue = node.nodeValue.slice(0, start) + dictionary.get(original) + node.nodeValue.slice(start + original.length);
      }
    }
    template.content.querySelectorAll('[placeholder],[aria-label],[title]').forEach(element => {
      ['placeholder', 'aria-label', 'title'].forEach(attribute => {
        const original = element.getAttribute(attribute);
        if (dictionary.has(original)) element.setAttribute(attribute, dictionary.get(original));
      });
    });
    return template.innerHTML;
  }
  const branchEditorCopy = {
    ru: {
      title: 'Редактор филиала', intro: 'Обновите контакты, которые посетители видят в справочнике.',
      branch: 'Подразделение', address: 'Адрес', phone: 'Телефон', email: 'Электронная почта', hours: 'График работы',
      hoursHint: 'Для графика читального зала добавьте отдельную строку «Читальный зал: …».',
      map: 'Показывать отметку на карте', mapHint: 'Отметка появится, если в справочнике есть координаты. При смене адреса проверьте точку на карте.',
      save: 'Сохранить изменения', reset: 'Сбросить правки', public: 'Открыть публичную карточку',
      loading: 'Загружаем филиалы…', loadError: 'Не удалось загрузить филиалы.', retry: 'Повторить загрузку',
      saving: 'Сохраняем…', saved: 'Контакты сохранены.', refreshError: 'Изменения сохранены. Не удалось перечитать справочник.',
      saveError: 'Не удалось подтвердить сохранение. Введённые данные остались в форме.',
      forbidden: 'У вашей роли нет доступа к изменению этого филиала.', empty: 'Нет доступных для редактирования подразделений.'
    },
    kk: {
      title: 'Филиал редакторы', intro: 'Келушілер анықтамалықтан көретін байланыс деректерін жаңартыңыз.',
      branch: 'Бөлімше', address: 'Мекенжай', phone: 'Телефон', email: 'Электрондық пошта', hours: 'Жұмыс кестесі',
      hoursHint: 'Оқу залының кестесін «Читальный зал: …» деген жеке жолға жазыңыз.',
      map: 'Белгіні картада көрсету', mapHint: 'Белгі анықтамалықта координаттар болса көрсетіледі. Мекенжай өзгерсе, картадағы нүктені тексеріңіз.',
      save: 'Өзгерістерді сақтау', reset: 'Өзгерістерді тазалау', public: 'Жария карточканы ашу',
      loading: 'Филиалдар жүктелуде…', loadError: 'Филиалдарды жүктеу мүмкін болмады.', retry: 'Қайта жүктеу',
      saving: 'Сақталуда…', saved: 'Байланыс деректері сақталды.', refreshError: 'Өзгерістер сақталды. Анықтамалықты қайта жүктеу мүмкін болмады.',
      saveError: 'Сақтауды растау мүмкін болмады. Енгізілген деректер нысанда қалды.',
      forbidden: 'Рөліңізге бұл филиалды өзгерту құқығы берілмеген.', empty: 'Өңдеуге болатын бөлімшелер жоқ.'
    },
    en: {
      title: 'Branch editor', intro: 'Update the contact details visitors see in the archive directory.',
      branch: 'Office', address: 'Address', phone: 'Telephone', email: 'Email', hours: 'Opening hours',
      hoursHint: 'Put the reading room hours on a separate line beginning with “Читальный зал:”.',
      map: 'Show the marker on the map', mapHint: 'The marker appears when coordinates are available. Check the map if the address changes.',
      save: 'Save changes', reset: 'Reset changes', public: 'Open public branch record',
      loading: 'Loading offices…', loadError: 'Could not load the offices.', retry: 'Retry loading',
      saving: 'Saving…', saved: 'Contact details saved.', refreshError: 'Changes were saved. Could not reload the directory.',
      saveError: 'Could not confirm the save. Your changes are still in the form.',
      forbidden: 'Your role cannot edit this office.', empty: 'There are no offices you can edit.'
    }
  };
  const branchEditorStates = new WeakMap();
  const branchContactFields = ['address', 'phone', 'email', 'hours'];

  window.renderLiveBranchEditor = async function renderLiveBranchEditor(main, language, user, expireSession) {
    const t = branchEditorCopy[language] || branchEditorCopy.ru;
    const api = window.archiveApi;
    const esc = api.escape;
    if (!branchEditorStates.has(user)) {
      branchEditorStates.set(user, { selectedId: user.branchId, drafts: new Map(), pending: null, outcome: null });
    }
    const state = branchEditorStates.get(user);
    main.innerHTML = `<header class="admin-heading"><div><h1>${t.title}</h1><p>${t.intro}</p></div></header>
      <section class="admin-panel admin-branch-live">
        <p class="admin-live-message" data-branch-result role="status" tabindex="-1">${t.loading}</p>
        <button type="button" class="admin-button-secondary" data-branch-retry hidden>${t.retry}</button>
        <div data-branch-form></div>
      </section>`;
    const section = main.querySelector('.admin-branch-live');
    const result = section.querySelector('[data-branch-result]');
    const retry = section.querySelector('[data-branch-retry]');
    const body = section.querySelector('[data-branch-form]');
    let branches = [];

    function report(key, error = false) {
      result.textContent = key ? t[key] : '';
      result.hidden = !key;
      result.dataset.kind = error ? 'error' : 'info';
    }

    function render() {
      const branch = branches.find(item => item.id === state.selectedId) || branches[0];
      if (!branch) { report('empty'); return; }
      state.selectedId = branch.id;
      const saved = Object.fromEntries(branchContactFields.map(key => [key, branch[key]?.trim() || '']));
      saved.show_on_map = branch.lat != null && branch.lng != null;
      const values = { ...saved, ...state.drafts.get(branch.id) };
      const name = item => item[`name_${language}`] || item.name_ru || item.id;
      const textInput = (key, type) => `<label>${t[key]}<input type="${type}" name="${key}" maxlength="300" value="${esc(values[key])}"></label>`;
      body.innerHTML = `<div class="admin-content-tools"><label>${t.branch}<select data-branch-select${branches.length === 1 ? ' disabled' : ''}>${branches.map(item => `<option value="${esc(item.id)}"${item.id === branch.id ? ' selected' : ''}>${esc(name(item))}</option>`).join('')}</select></label></div>
        <form class="admin-content-form" id="admin-branch-form">
          <fieldset>
            ${textInput('address', 'text')}
            ${textInput('phone', 'tel')}
            ${textInput('email', 'email')}
            <label>${t.hours}<textarea name="hours" rows="3" maxlength="300"${branch.kind === 'main' ? ' aria-describedby="admin-branch-hours-hint"' : ''}>${esc(values.hours)}</textarea></label>
            ${branch.kind === 'main' ? `<p class="admin-muted" id="admin-branch-hours-hint">${t.hoursHint}</p>` : ''}
            <label class="admin-content-check"><input type="checkbox" name="show_on_map" aria-describedby="admin-branch-map-hint"${values.show_on_map ? ' checked' : ''}> ${t.map}</label>
            <p class="admin-muted" id="admin-branch-map-hint">${t.mapHint}</p>
            <div class="admin-content-actions"><button type="submit">${t.save}</button><button type="button" class="admin-button-secondary" data-branch-reset>${t.reset}</button></div>
          </fieldset>
          <a class="admin-content-link" href="#/section/branches?id=${encodeURIComponent(branch.id)}">${t.public} <span aria-hidden="true">→</span></a>
        </form>`;
      const selector = body.querySelector('[data-branch-select]');
      const form = body.querySelector('form');
      const submit = form.querySelector('[type="submit"]');
      const reset = form.querySelector('[data-branch-reset]');
      const map = form.elements.namedItem('show_on_map');
      const address = form.elements.namedItem('address');
      let mapEdited = values.address !== saved.address && values.show_on_map;

      function readChanges() {
        const entries = branchContactFields.map(key => [key, form.elements.namedItem(key).value.trim()]);
        entries.push(['show_on_map', map.checked]);
        const changes = Object.fromEntries(entries.filter(([key, value]) => value !== saved[key]));
        const hasChanges = Object.keys(changes).length > 0;
        if (hasChanges) state.drafts.set(branch.id, changes);
        else state.drafts.delete(branch.id);
        submit.disabled = reset.disabled = !hasChanges;
        return changes;
      }

      readChanges();
      const outcome = state.outcome?.id === branch.id ? state.outcome : null;
      report(outcome?.key, outcome?.key !== 'saved');
      selector.addEventListener('change', () => {
        state.selectedId = selector.value;
        render();
        body.querySelector('[data-branch-select]').focus();
      });
      form.addEventListener('input', event => {
        if (event.target === map) mapEdited = true;
        if (event.target === address && !mapEdited) map.checked = address.value.trim() === saved.address && saved.show_on_map;
        if (state.outcome?.id === branch.id && state.outcome.key === 'saved') {
          state.outcome = null;
          report();
        }
        readChanges();
      });
      reset.addEventListener('click', () => {
        state.drafts.delete(branch.id);
        state.outcome = null;
        render();
        body.querySelector('[name="address"]').focus();
      });
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (state.pending || submit.disabled) return;
        const changes = readChanges();
        if (!Object.keys(changes).length) return;
        form.querySelector('fieldset').disabled = selector.disabled = true;
        report('saving');
        state.pending = api.post('/admin/branches/' + encodeURIComponent(branch.id), changes)
          .then(response => {
            if (response?.ok !== true) throw new Error('Missing save confirmation');
            state.drafts.delete(branch.id);
            state.outcome = { id: branch.id, key: 'saved' };
          })
          .catch(error => {
            const key = error.status === 403 ? 'forbidden' : 'saveError';
            state.outcome = { id: branch.id, key };
            if (error.status === 401) expireSession();
          })
          .finally(() => { state.pending = null; });
        await state.pending;
        if (!section.isConnected) return;
        if (state.outcome?.key === 'saved') {
          await load(true);
          if (branch.id === 'main') window.refreshMainBranchContacts?.(language);
        } else render();
        if (section.isConnected && !result.hidden && document.activeElement === document.body) result.focus();
      });
    }

    async function load(fresh = false) {
      retry.hidden = true;
      body.replaceChildren();
      report(state.pending ? 'saving' : 'loading');
      if (state.pending) await state.pending;
      if (!section.isConnected) return;
      try {
        const items = await window.loadArchiveBranches(fresh);
        if (!section.isConnected) return;
        branches = user.role === 'branch_admin' ? items.filter(item => item.id === user.branchId) : items;
        render();
      } catch (error) {
        if (!section.isConnected) return;
        if (error.status === 401) { expireSession(); return; }
        report(state.outcome?.key === 'saved' ? 'refreshError' : 'loadError', true);
        retry.hidden = false;
      }
    }

    retry.addEventListener('click', () => load(true));
    await load();
  };

  window.adminContentScreens = [
    {id:'content',label:'Контент',labels:{ru:'Контент',kk:'Мазмұн',en:'Content'},render:(language='ru')=>localizedMarkup(content(),language)},
    {id:'translations',label:'Переводы',labels:{ru:'Переводы',kk:'Аудармалар',en:'Translations'},render:(language='ru')=>localizedMarkup(translations(),language)},
    {id:'branch-editor',label:'Редактор филиала',labels:{ru:'Редактор филиала',kk:'Филиал редакторы',en:'Branch editor'},render:(language='ru')=>localizedMarkup(branchEditor(),language)},
    {id:'review',label:'Проверка материала',labels:{ru:'Проверка материала',kk:'Материалды тексеру',en:'Material review'},render:(language='ru')=>localizedMarkup(review(),language)}
  ];
}());
