/* Static catalogue administration layouts; no records or files are read or written. */
(function () {
  'use strict';

  // Exact static text keys preserve the original disabled layout and link targets.
  // Translations are applied only to text nodes and presentation attributes.
  const translationRows = [
  [
    "ЭЛЕКТРОННЫЙ КАТАЛОГ",
    "ЭЛЕКТРОНДЫҚ КАТАЛОГ",
    "ELECTRONIC CATALOGUE"
  ],
  [
    "Управление каталогом",
    "Каталогты басқару",
    "Catalogue management"
  ],
  [
    "Иерархия описаний и проверка реквизитов перед публикацией",
    "Сипаттамалар иерархиясы және жариялау алдындағы деректемелерді тексеру",
    "Description hierarchy and reference checks before publication"
  ],
  [
    "Показаны условные примеры структуры. Они не являются записями архива. Поиск, редактирование и экспорт пока не подключены.",
    "Құрылымның шартты мысалдары көрсетілген. Олар архив жазбалары емес. Іздеу, өңдеу және экспорт әлі қосылмаған.",
    "Illustrative structure examples are shown. They are not archive records. Search, editing and export are not connected yet."
  ],
  [
    "Поиск в каталоге",
    "Каталогтан іздеу",
    "Search the catalogue"
  ],
  [
    "Уровень",
    "Деңгей",
    "Level"
  ],
  [
    "Все уровни",
    "Барлық деңгейлер",
    "All levels"
  ],
  [
    "Фонд",
    "Қор",
    "Fund"
  ],
  [
    "Опись",
    "Тізімдеме",
    "Inventory"
  ],
  [
    "Дело",
    "Іс",
    "Case"
  ],
  [
    "Документ",
    "Құжат",
    "Document"
  ],
  [
    "Филиал",
    "Филиал",
    "Branch"
  ],
  [
    "Выбор филиала после подключения данных",
    "Деректер қосылғаннан кейін филиалды таңдау",
    "Select a branch after data is connected"
  ],
  [
    "Посмотреть редактор записи →",
    "Жазба редакторын қарау →",
    "View record editor →"
  ],
  [
    "Макет импорта →",
    "Импорт макеті →",
    "Import preview →"
  ],
  [
    "Экспорт CSV / Excel",
    "CSV / Excel экспорты",
    "Export CSV / Excel"
  ],
  [
    "Фонд → опись → дело → документ",
    "Қор → тізімдеме → іс → құжат",
    "Fund → inventory → case → document"
  ],
  [
    "Новая запись должна иметь соответствующего родителя.",
    "Жаңа жазбаның тиісті ата-аналық жазбасы болуы тиіс.",
    "A new record must have the appropriate parent record."
  ],
  [
    "Демонстрационный фонд",
    "Демонстрациялық қор",
    "Demonstration fund"
  ],
  [
    "Условный номер фонда",
    "Қордың шартты нөмірі",
    "Illustrative fund number"
  ],
  [
    "Условный пример · уровень 1",
    "Шартты мысал · 1-деңгей",
    "Illustrative example · level 1"
  ],
  [
    "Демонстрационная опись",
    "Демонстрациялық тізімдеме",
    "Demonstration inventory"
  ],
  [
    "Принадлежит примеру фонда",
    "Қор мысалына жатады",
    "Belongs to the example fund"
  ],
  [
    "Условный пример · уровень 2",
    "Шартты мысал · 2-деңгей",
    "Illustrative example · level 2"
  ],
  [
    "Демонстрационное дело",
    "Демонстрациялық іс",
    "Demonstration case"
  ],
  [
    "Принадлежит примеру описи",
    "Тізімдеме мысалына жатады",
    "Belongs to the example inventory"
  ],
  [
    "Условный пример · уровень 3",
    "Шартты мысал · 3-деңгей",
    "Illustrative example · level 3"
  ],
  [
    "Демонстрационный документ",
    "Демонстрациялық құжат",
    "Demonstration document"
  ],
  [
    "Принадлежит примеру дела",
    "Іс мысалына жатады",
    "Belongs to the example case"
  ],
  [
    "Условный пример · уровень 4",
    "Шартты мысал · 4-деңгей",
    "Illustrative example · level 4"
  ],
  [
    "Реквизиты записи",
    "Жазба деректемелері",
    "Record details"
  ],
  [
    "Название",
    "Атауы",
    "Title"
  ],
  [
    "Не заполнено",
    "Толтырылмаған",
    "Not filled in"
  ],
  [
    "Архивный шифр",
    "Архивтік шифр",
    "Archival reference"
  ],
  [
    "Не указан",
    "Көрсетілмеген",
    "Not specified"
  ],
  [
    "Место хранения",
    "Сақтау орны",
    "Place of storage"
  ],
  [
    "Не выбрано",
    "Таңдалмаған",
    "Not selected"
  ],
  [
    "Доступ",
    "Қолжетімділік",
    "Access"
  ],
  [
    "Требует проверки",
    "Тексеруді қажет етеді",
    "Needs verification"
  ],
  [
    "Обязательные сведения",
    "Міндетті мәліметтер",
    "Required information"
  ],
  [
    "Название, родительская запись и реквизиты проверяются до сохранения. Требования зависят от уровня описания.",
    "Атауы, ата-аналық жазба және деректемелер сақтау алдында тексеріледі. Талаптар сипаттама деңгейіне байланысты.",
    "The title, parent record and details are checked before saving. Requirements depend on the description level."
  ],
  [
    "Добавить запись",
    "Жазба қосу",
    "Add record"
  ],
  [
    "Удалить запись",
    "Жазбаны жою",
    "Delete record"
  ],
  [
    "Название или архивный шифр",
    "Атауы немесе архивтік шифр",
    "Title or archival reference"
  ],
  [
    "ЦИФРОВЫЕ МАТЕРИАЛЫ",
    "ЦИФРЛЫҚ МАТЕРИАЛДАР",
    "DIGITAL MATERIALS"
  ],
  [
    "Файлы и цифровые копии",
    "Файлдар мен цифрлық көшірмелер",
    "Files and digital copies"
  ],
  [
    "Оригинал хранится отдельно от облегчённой копии для просмотра",
    "Түпнұсқа қарауға арналған жеңілдетілген көшірмеден бөлек сақталады",
    "The original is stored separately from the lightweight viewing copy"
  ],
  [
    "Ниже — статические примеры состояний. Файлы не выбираются, не загружаются и не проверяются.",
    "Төменде күйлердің статикалық мысалдары берілген. Файлдар таңдалмайды, жүктелмейді және тексерілмейді.",
    "Static state examples are shown below. Files are not selected, uploaded or checked."
  ],
  [
    "Добавление файлов",
    "Файлдарды қосу",
    "Adding files"
  ],
  [
    "Одиночная и пакетная загрузка",
    "Жеке және топтық жүктеу",
    "Single and batch upload"
  ],
  [
    "PDF, JPG/JPEG, PNG, WebP, TIFF, аудио и видео.",
    "PDF, JPG/JPEG, PNG, WebP, TIFF, аудио және бейне.",
    "PDF, JPG/JPEG, PNG, WebP, TIFF, audio and video."
  ],
  [
    "Выбрать файлы",
    "Файлдарды таңдау",
    "Select files"
  ],
  [
    "Допустимые размеры и параметры определит конфигурация сервера.",
    "Рұқсат етілген өлшемдер мен параметрлер сервер конфигурациясында анықталады.",
    "Allowed sizes and parameters will be set by the server configuration."
  ],
  [
    "Примеры состояний",
    "Күйлердің мысалдары",
    "State examples"
  ],
  [
    "Пример файла A",
    "A файлының мысалы",
    "Example file A"
  ],
  [
    "Иллюстрация загрузки · 60%",
    "Жүктеу мысалы · 60%",
    "Upload illustration · 60%"
  ],
  [
    "Шкала неподвижна; передача данных не выполняется.",
    "Шкала қозғалмайды; деректер берілмейді.",
    "The bar is static; no data is being transferred."
  ],
  [
    "Пример файла B · проверка не пройдена",
    "B файлының мысалы · тексеруден өтпеген",
    "Example file B · validation failed"
  ],
  [
    "Не удалось подтвердить тип файла. Выберите поддерживаемый формат после подключения загрузки.",
    "Файл түрін растау мүмкін болмады. Жүктеу қосылғаннан кейін қолдау көрсетілетін форматты таңдаңыз.",
    "The file type could not be confirmed. Choose a supported format once upload is connected."
  ],
  [
    "Повторить загрузку",
    "Жүктеуді қайталау",
    "Retry upload"
  ],
  [
    "Карточка файла",
    "Файл карточкасы",
    "File details"
  ],
  [
    "Предпросмотр не подключён",
    "Алдын ала қарау қосылмаған",
    "Preview is not connected"
  ],
  [
    "Архивная запись",
    "Архивтік жазба",
    "Archive record"
  ],
  [
    "Не привязана",
    "Байланыстырылмаған",
    "Not linked"
  ],
  [
    "Мастер-копия",
    "Мастер-көшірме",
    "Master copy"
  ],
  [
    "Исходный файл сохраняется без изменения",
    "Бастапқы файл өзгеріссіз сақталады",
    "The source file is preserved unchanged"
  ],
  [
    "Копия для сайта",
    "Сайтқа арналған көшірме",
    "Website copy"
  ],
  [
    "Формируется отдельно после проверки",
    "Тексеруден кейін бөлек жасалады",
    "Created separately after validation"
  ],
  [
    "Не назначен",
    "Тағайындалмаған",
    "Not assigned"
  ],
  [
    "Уровень доступа",
    "Қолжетімділік деңгейі",
    "Access level"
  ],
  [
    "Выберите после подключения данных",
    "Деректер қосылғаннан кейін таңдаңыз",
    "Select after data is connected"
  ],
  [
    "Открытый",
    "Ашық",
    "Public"
  ],
  [
    "Ограниченный",
    "Шектеулі",
    "Restricted"
  ],
  [
    "Публикация описания сама по себе не открывает доступ к файлу. Для TIFF может потребоваться производное изображение.",
    "Сипаттаманы жариялау файлға қолжетімділікті өздігінен ашпайды. TIFF үшін туынды кескін қажет болуы мүмкін.",
    "Publishing a description does not itself make the file accessible. TIFF may require a derived image."
  ],
  [
    "Сохранить привязку",
    "Байланысты сақтау",
    "Save link"
  ],
  [
    "Демонстрация загрузки: 60 процентов",
    "Жүктеу көрсетілімі: 60 пайыз",
    "Upload demonstration: 60 percent"
  ],
  [
    "ПЕРЕНОС ДАННЫХ",
    "ДЕРЕКТЕРДІ ТАСЫМАЛДАУ",
    "DATA TRANSFER"
  ],
  [
    "Импорт каталога",
    "Каталог импорты",
    "Catalogue import"
  ],
  [
    "Сопоставление колонок, предварительная проверка и отчёт о результатах",
    "Бағандарды сәйкестендіру, алдын ала тексеру және нәтижелер есебі",
    "Column mapping, preliminary validation and results report"
  ],
  [
    "Макет процесса импорта Excel / CSV. Примеры строк условные; чтение файла, проверка и запись в каталог не выполняются.",
    "Excel / CSV импортының макеті. Жолдар шартты мысалдар; файл оқылмайды, тексерілмейді және каталогқа жазылмайды.",
    "Excel / CSV import preview. Rows are illustrative; the file is not read, validated or written to the catalogue."
  ],
  [
    "1. Выбор файла",
    "1. Файлды таңдау",
    "1. Select file"
  ],
  [
    "2. Сопоставление",
    "2. Сәйкестендіру",
    "2. Map columns"
  ],
  [
    "3. Проверка",
    "3. Тексеру",
    "3. Validate"
  ],
  [
    "4. Результат",
    "4. Нәтиже",
    "4. Result"
  ],
  [
    "Источник и назначение",
    "Дереккөз және тағайындау",
    "Source and destination"
  ],
  [
    "Файл не выбран. Импортируемый уровень связывается с архивной иерархией.",
    "Файл таңдалмаған. Импортталатын деңгей архивтік иерархиямен байланыстырылады.",
    "No file is selected. The imported level is linked to the archive hierarchy."
  ],
  [
    "Выбрать Excel / CSV",
    "Excel / CSV таңдау",
    "Select Excel / CSV"
  ],
  [
    "Уровень описания",
    "Сипаттама деңгейі",
    "Description level"
  ],
  [
    "Фонд / опись / дело / документ",
    "Қор / тізімдеме / іс / құжат",
    "Fund / inventory / case / document"
  ],
  [
    "Не выбран",
    "Таңдалмаған",
    "Not selected"
  ],
  [
    "Родительская запись",
    "Ата-аналық жазба",
    "Parent record"
  ],
  [
    "Сопоставление колонок",
    "Бағандарды сәйкестендіру",
    "Column mapping"
  ],
  [
    "Пример названий колонок, а не схема конкретного файла заказчика.",
    "Баған атауларының мысалы; тапсырыс берушінің нақты файлының сызбасы емес.",
    "Example column names, not the schema of a specific customer file."
  ],
  [
    "Заголовок записи",
    "Жазба тақырыбы",
    "Record title"
  ],
  [
    "Шифр",
    "Шифр",
    "Reference"
  ],
  [
    "Год начала",
    "Басталу жылы",
    "Start year"
  ],
  [
    "Начальная дата",
    "Басталу күні",
    "Start date"
  ],
  [
    "Предварительная проверка",
    "Алдын ала тексеру",
    "Preliminary validation"
  ],
  [
    "Обязательные поля и формат дат",
    "Міндетті өрістер және күндер форматы",
    "Required fields and date format"
  ],
  [
    "Связи фонд → опись → дело → документ",
    "Қор → тізімдеме → іс → құжат байланыстары",
    "Fund → inventory → case → document relationships"
  ],
  [
    "Повторные записи и совпадения шифров",
    "Қайталанатын жазбалар мен сәйкес шифрлар",
    "Duplicate records and matching references"
  ],
  [
    "Филиал и условия доступа",
    "Филиал және қолжетімділік шарттары",
    "Branch and access conditions"
  ],
  [
    "Проверить файл",
    "Файлды тексеру",
    "Validate file"
  ],
  [
    "Пример отчёта проверки",
    "Тексеру есебінің мысалы",
    "Validation report example"
  ],
  [
    "Это статический пример, а не результат обработки файла.",
    "Бұл — статикалық мысал, файлды өңдеу нәтижесі емес.",
    "This is a static example, not the result of processing a file."
  ],
  [
    "Строка-пример A",
    "A мысал жолы",
    "Example row A"
  ],
  [
    "Готова к проверке сотрудником",
    "Қызметкердің тексеруіне дайын",
    "Ready for staff review"
  ],
  [
    "Обязательные поля в примере заполнены. Запись ещё не импортирована.",
    "Мысалдағы міндетті өрістер толтырылған. Жазба әлі импортталмаған.",
    "Required fields in the example are filled in. The record has not been imported."
  ],
  [
    "Строка-пример B",
    "B мысал жолы",
    "Example row B"
  ],
  [
    "Ошибка · отсутствует родитель",
    "Қате · ата-аналық жазба жоқ",
    "Error · missing parent"
  ],
  [
    "Укажите родительскую запись и повторите проверку после исправления файла.",
    "Ата-аналық жазбаны көрсетіп, файлды түзеткеннен кейін тексеруді қайталаңыз.",
    "Specify a parent record and validate again after correcting the file."
  ],
  [
    "Строка-пример C",
    "C мысал жолы",
    "Example row C"
  ],
  [
    "Предупреждение · возможный дубль",
    "Ескерту · қайталануы мүмкін",
    "Warning · possible duplicate"
  ],
  [
    "Сотрудник должен сравнить записи до импорта.",
    "Қызметкер импорт алдында жазбаларды салыстыруы тиіс.",
    "A staff member must compare the records before import."
  ],
  [
    "Импортировать проверенные записи",
    "Тексерілген жазбаларды импорттау",
    "Import validated records"
  ],
  [
    "Скачать отчёт ошибок",
    "Қателер есебін жүктеп алу",
    "Download error report"
  ],
  [
    "Определяется уровнем описания",
    "Сипаттама деңгейімен анықталады",
    "Determined by description level"
  ],
  [
    "Каталог",
    "Каталог",
    "Catalogue"
  ],
  [
    "Файлы",
    "Файлдар",
    "Files"
  ],
  [
    "Импорт",
    "Импорт",
    "Import"
  ]
];
  const translatedText = new Map(translationRows.map(([ru,kk,en]) => [ru,{kk,en}]));
  function translate(text, language) {
    return translatedText.get(text)?.[language] || text;
  }
  function localize(html, language) {
    if (language !== 'kk' && language !== 'en') return html;
    const template = document.createElement('template');
    template.innerHTML = html;
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (text) node.textContent = node.textContent.replace(text, translate(text, language));
    }
    template.content.querySelectorAll('*').forEach(element => {
      ['placeholder','aria-label','title','value'].forEach(attribute => {
        if (element.hasAttribute(attribute)) element.setAttribute(attribute, translate(element.getAttribute(attribute), language));
      });
    });
    return template.innerHTML;
  }


  function heading(kicker, title, description) {
    return `<div class="admin-heading"><div><p class="admin-kicker">${kicker}</p><h1>${title}</h1><p>${description}</p></div></div>`;
  }

  function catalogue() {
    const levels = [['Фонд','Демонстрационный фонд','Условный номер фонда'],['Опись','Демонстрационная опись','Принадлежит примеру фонда'],['Дело','Демонстрационное дело','Принадлежит примеру описи'],['Документ','Демонстрационный документ','Принадлежит примеру дела']];
    return `<div class="admin-catalog-demo">${heading('ЭЛЕКТРОННЫЙ КАТАЛОГ','Управление каталогом','Иерархия описаний и проверка реквизитов перед публикацией')}
      <div class="admin-editor-note" role="note">Показаны условные примеры структуры. Они не являются записями архива. Поиск, редактирование и экспорт пока не подключены.</div>
      <div class="admin-catalog-toolbar"><label>Поиск в каталоге<input type="search" placeholder="Название или архивный шифр" disabled></label><label>Уровень<select disabled><option>Все уровни</option><option>Фонд</option><option>Опись</option><option>Дело</option><option>Документ</option></select></label><label>Филиал<select disabled><option>Выбор филиала после подключения данных</option></select></label></div>
      <div class="admin-catalog-actions"><a href="#/admin/editor">Посмотреть редактор записи →</a><a href="#/admin/imports">Макет импорта →</a><button type="button" disabled>Экспорт CSV / Excel</button></div>
      <div class="admin-catalog-grid"><section class="admin-panel"><h2>Фонд → опись → дело → документ</h2><p class="admin-muted">Новая запись должна иметь соответствующего родителя.</p><ol class="admin-catalog-tree">${levels.map(([level,title,note], index) => `<li><span class="admin-catalog-level">${level}</span><div><h3>${title}</h3><p>${note}</p><span class="admin-catalog-label">Условный пример · уровень ${index + 1}</span></div></li>`).join('')}</ol></section>
      <aside class="admin-panel"><h2>Реквизиты записи</h2><dl class="admin-catalog-facts"><div><dt>Название</dt><dd>Не заполнено</dd></div><div><dt>Архивный шифр</dt><dd>Не указан</dd></div><div><dt>Место хранения</dt><dd>Не выбрано</dd></div><div><dt>Доступ</dt><dd>Требует проверки</dd></div></dl><div class="admin-catalog-validation"><strong>Обязательные сведения</strong><p>Название, родительская запись и реквизиты проверяются до сохранения. Требования зависят от уровня описания.</p></div><div class="admin-catalog-actions"><button type="button" disabled>Добавить запись</button><button type="button" class="admin-button-secondary" disabled>Удалить запись</button></div></aside></div></div>`;
  }

  function files() {
    return `<div class="admin-catalog-demo">${heading('ЦИФРОВЫЕ МАТЕРИАЛЫ','Файлы и цифровые копии','Оригинал хранится отдельно от облегчённой копии для просмотра')}
      <div class="admin-editor-note" role="note">Ниже — статические примеры состояний. Файлы не выбираются, не загружаются и не проверяются.</div>
      <div class="admin-catalog-grid"><section class="admin-panel"><h2>Добавление файлов</h2><div class="admin-file-drop"><span aria-hidden="true">⇧</span><strong>Одиночная и пакетная загрузка</strong><p>PDF, JPG/JPEG, PNG, WebP, TIFF, аудио и видео.</p><button type="button" disabled>Выбрать файлы</button><small>Допустимые размеры и параметры определит конфигурация сервера.</small></div>
      <h2 class="admin-catalog-subtitle">Примеры состояний</h2><div class="admin-file-state"><div><strong>Пример файла A</strong><span>Иллюстрация загрузки · 60%</span></div><progress max="100" value="60" aria-label="Демонстрация загрузки: 60 процентов"></progress><p>Шкала неподвижна; передача данных не выполняется.</p></div><div class="admin-file-state admin-file-state-error"><strong>Пример файла B · проверка не пройдена</strong><p>Не удалось подтвердить тип файла. Выберите поддерживаемый формат после подключения загрузки.</p><button type="button" disabled class="admin-button-secondary">Повторить загрузку</button></div></section>
      <aside class="admin-panel"><h2>Карточка файла</h2><div class="admin-file-preview admin-file-placeholder"><span aria-hidden="true">▧</span><p>Предпросмотр не подключён</p></div><dl class="admin-catalog-facts"><div><dt>Архивная запись</dt><dd>Не привязана</dd></div><div><dt>Мастер-копия</dt><dd>Исходный файл сохраняется без изменения</dd></div><div><dt>Копия для сайта</dt><dd>Формируется отдельно после проверки</dd></div><div><dt>Доступ</dt><dd>Не назначен</dd></div></dl><label class="admin-catalog-field">Уровень доступа<select disabled><option>Выберите после подключения данных</option><option>Открытый</option><option>Ограниченный</option></select></label><p class="admin-muted">Публикация описания сама по себе не открывает доступ к файлу. Для TIFF может потребоваться производное изображение.</p><button type="button" disabled>Сохранить привязку</button></aside></div></div>`;
  }

  function imports() {
    return `<div class="admin-catalog-demo">${heading('ПЕРЕНОС ДАННЫХ','Импорт каталога','Сопоставление колонок, предварительная проверка и отчёт о результатах')}
      <div class="admin-editor-note" role="note">Макет процесса импорта Excel / CSV. Примеры строк условные; чтение файла, проверка и запись в каталог не выполняются.</div>
      <ol class="admin-import-steps"><li>1. Выбор файла</li><li>2. Сопоставление</li><li>3. Проверка</li><li>4. Результат</li></ol>
      <section class="admin-panel"><div class="admin-panel-header"><div><h2>Источник и назначение</h2><p class="admin-muted">Файл не выбран. Импортируемый уровень связывается с архивной иерархией.</p></div><button type="button" disabled>Выбрать Excel / CSV</button></div><div class="admin-catalog-toolbar"><label>Уровень описания<select disabled><option>Фонд / опись / дело / документ</option></select></label><label>Филиал<select disabled><option>Не выбран</option></select></label><label>Родительская запись<input disabled placeholder="Определяется уровнем описания"></label></div></section>
      <div class="admin-import-grid"><section class="admin-panel"><h2>Сопоставление колонок</h2><p class="admin-muted">Пример названий колонок, а не схема конкретного файла заказчика.</p><div class="admin-import-mapping">${[['Название','Заголовок записи'],['Шифр','Архивный шифр'],['Год начала','Начальная дата'],['Филиал','Место хранения']].map(([column,field])=>`<label><span>${column}</span><select disabled><option>${field}</option></select></label>`).join('')}</div></section>
      <section class="admin-panel"><h2>Предварительная проверка</h2><ul class="admin-import-checks"><li>Обязательные поля и формат дат</li><li>Связи фонд → опись → дело → документ</li><li>Повторные записи и совпадения шифров</li><li>Филиал и условия доступа</li></ul><button type="button" disabled>Проверить файл</button></section></div>
      <section class="admin-panel admin-import-result"><h2>Пример отчёта проверки</h2><p class="admin-muted">Это статический пример, а не результат обработки файла.</p><ul class="admin-import-rows"><li><span class="admin-catalog-label">Строка-пример A</span><div><strong>Готова к проверке сотрудником</strong><p>Обязательные поля в примере заполнены. Запись ещё не импортирована.</p></div></li><li><span class="admin-catalog-label">Строка-пример B</span><div><strong>Ошибка · отсутствует родитель</strong><p>Укажите родительскую запись и повторите проверку после исправления файла.</p></div></li><li><span class="admin-catalog-label">Строка-пример C</span><div><strong>Предупреждение · возможный дубль</strong><p>Сотрудник должен сравнить записи до импорта.</p></div></li></ul><div class="admin-catalog-actions"><button type="button" disabled>Импортировать проверенные записи</button><button type="button" disabled class="admin-button-secondary">Скачать отчёт ошибок</button></div></section></div>`;
  }

  const publishedCopy = {
    ru: {
      title: 'Опубликованный каталог', intro: 'Найдите опубликованную запись по названию или шифру и откройте её публичную карточку.',
      query: 'Название или шифр', kind: 'Тип материала', all: 'Все материалы',
      documents: 'Описи, дела и документы', kinds: { fund:'Фонд', inventory:'Опись', case:'Дело', document:'Документ', photo:'Фотодокумент', newspaper:'Газета' },
      search: 'Найти', reset: 'Сбросить', add: 'Новая запись', drafts: 'Черновики и проверка',
      loading: 'Загружаем записи…', found: 'Найдено: ', empty: 'Ничего не найдено.', error: 'Не удалось загрузить записи.',
      retry: 'Повторить загрузку', previous: 'Назад', next: 'Дальше', page: 'Страница', newTab: 'откроется в новой вкладке',
    },
    kk: {
      title: 'Жарияланған каталог', intro: 'Жарияланған жазбаны атауы немесе шифры бойынша тауып, оның ашық карточкасын көріңіз.',
      query: 'Атауы немесе шифры', kind: 'Материал түрі', all: 'Барлық материалдар',
      documents: 'Тізімдемелер, істер және құжаттар', kinds: { fund:'Қор', inventory:'Тізімдеме', case:'Іс', document:'Құжат', photo:'Фотоқұжат', newspaper:'Газет' },
      search: 'Табу', reset: 'Тазалау', add: 'Жаңа жазба', drafts: 'Жобалар және тексеру',
      loading: 'Жазбалар жүктелуде…', found: 'Табылды: ', empty: 'Ештеңе табылмады.', error: 'Жазбаларды жүктеу мүмкін болмады.',
      retry: 'Қайта жүктеу', previous: 'Артқа', next: 'Алға', page: 'Бет', newTab: 'жаңа қойындыда ашылады',
    },
    en: {
      title: 'Published catalogue', intro: 'Search published records by title or reference and open their public records.',
      query: 'Title or reference', kind: 'Material type', all: 'All materials',
      documents: 'Inventories, cases and documents', kinds: { fund:'Fund', inventory:'Inventory', case:'Case', document:'Document', photo:'Photograph', newspaper:'Newspaper' },
      search: 'Search', reset: 'Reset', add: 'New record', drafts: 'Drafts and review',
      loading: 'Loading records…', found: 'Found: ', empty: 'No records found.', error: 'Could not load records.',
      retry: 'Retry loading', previous: 'Previous', next: 'Next', page: 'Page', newTab: 'opens in a new tab',
    }
  };
  const publishedKinds = ['fund', 'document', 'photo', 'newspaper'];
  const publishedPageSize = 12;

  window.renderPublishedAdminCatalogue = async function renderPublishedAdminCatalogue(main, language, user) {
    if (new URLSearchParams(location.hash.split('?')[1]).has('record')) {
      return window.archiveWorkbench.record(main, language, user);
    }
    const t = publishedCopy[language] || publishedCopy.ru;
    const api = window.archiveApi;
    const esc = api.escape;
    const params = new URLSearchParams(location.hash.split('?')[1]);
    const q = (params.get('q') || '').slice(0, 300);
    const type = params.get('type');
    let page = Math.min(1000, Number(params.get('page')) || 1);
    let requestNumber = 0;
    main.innerHTML = `<div class="admin-catalog-demo">
      <header class="admin-heading"><div><h1>${t.title}</h1><p>${t.intro}</p></div></header>
      <section class="admin-panel admin-catalog-published">
        <div class="admin-catalog-actions"><a href="#/admin/editor">${t.add} →</a><a href="#/admin/moderation">${t.drafts} →</a></div>
        <form class="admin-catalog-toolbar" role="search">
          <label>${t.query}<input type="search" name="q" maxlength="300" value="${esc(q)}"></label>
          <label>${t.kind}<select name="type"><option value="">${t.all}</option>${publishedKinds.map(key => `<option value="${key}"${key === type ? ' selected' : ''}>${key === 'document' ? t.documents : t.kinds[key]}</option>`).join('')}</select></label>
          <div class="admin-live-actions"><button type="submit">${t.search}</button><button type="reset" class="admin-button-secondary">${t.reset}</button></div>
        </form>
        <p role="status" data-admin-catalog-status>${t.loading}</p><button type="button" class="admin-button-secondary" data-admin-catalog-retry hidden>${t.retry}</button>
        <ul class="admin-catalog-tree" data-admin-catalog-list></ul>
        <nav class="admin-live-actions" aria-label="${t.page}" data-admin-catalog-nav hidden>
          <button type="button" class="admin-button-secondary" data-admin-catalog-prev>${t.previous}</button>
          <span data-admin-catalog-page></span>
          <button type="button" class="admin-button-secondary" data-admin-catalog-next>${t.next}</button>
        </nav>
      </section></div>`;
    const form = main.querySelector('form');
    const input = form.elements.namedItem('q');
    const kind = form.elements.namedItem('type');
    const list = main.querySelector('[data-admin-catalog-list]');
    const status = main.querySelector('[data-admin-catalog-status]');
    const retry = main.querySelector('[data-admin-catalog-retry]');
    const pager = main.querySelector('[data-admin-catalog-nav]');
    const previous = pager.querySelector('[data-admin-catalog-prev]');
    const next = pager.querySelector('[data-admin-catalog-next]');

    async function load() {
      page = Math.max(1, Math.trunc(page));
      const request = ++requestNumber;
      const filters = new URLSearchParams();
      if (input.value.trim()) filters.set('q', input.value.trim());
      if (kind.value) filters.set('type', kind.value);
      if (page > 1) filters.set('page', String(page));
      history.replaceState(null, '', '#/admin/catalogue' + (filters.size ? '?' + filters : ''));
      filters.set('size', String(publishedPageSize));
      filters.set('locale', language);
      if (user.role === 'branch_admin' && user.branchId) filters.set('branch', user.branchId);
      retry.hidden = pager.hidden = true;
      status.textContent = t.loading;
      list.textContent = '';
      try {
        const data = await api.get('/catalog?' + filters);
        if (!form.isConnected || request !== requestNumber) return;
        const pages = Math.max(1, Math.ceil(data.total / data.size));
        if (page > pages) { page = pages; return load(); }
        status.textContent = data.total ? t.found + data.total.toLocaleString(language) : t.empty;
        list.innerHTML = data.items.map(item => `<li><span class="admin-catalog-level">${esc(t.kinds[item.kind] || item.kind)}</span><div>
          <h3><a class="admin-catalog-record-link" href="#/resource/${encodeURIComponent(item.id)}" target="_blank" rel="noopener"><span lang="ru">${esc(item.title)}</span><span class="sr-only"> (${t.newTab})</span></a></h3>
          <p lang="ru">${[item.reference, item.branchName, item.period].filter(Boolean).map(esc).join(' · ')}</p>
          <a class="admin-content-link" href="${esc(location.hash + (location.hash.includes('?') ? '&' : '?') + 'record=' + encodeURIComponent(item.id))}">${window.adminWorkbenchText('Подготовить изменения', language)} →</a>
        </div></li>`).join('');
        pager.querySelector('[data-admin-catalog-page]').textContent = `${t.page} ${page} / ${pages}`;
        previous.disabled = page <= 1;
        next.disabled = page >= pages || page >= 1000;
        pager.hidden = pages <= 1;
      } catch {
        if (!form.isConnected || request !== requestNumber) return;
        status.textContent = t.error;
        retry.hidden = false;
      }
    }

    form.addEventListener('submit', event => { event.preventDefault(); page = 1; load(); });
    form.addEventListener('reset', event => {
      event.preventDefault();
      input.value = kind.value = '';
      page = 1;
      load();
      input.focus();
    });
    previous.addEventListener('click', () => { page--; load(); });
    next.addEventListener('click', () => { page++; load(); });
    retry.addEventListener('click', load);
    await load();
  };

  window.adminCatalogScreens = [
    {id:'catalogue', label:'Каталог', labels:{ru:'Каталог',kk:'Каталог',en:'Catalogue'}, render:(language='ru') => localize(catalogue(),language)},
    {id:'files', label:'Файлы', labels:{ru:'Файлы',kk:'Файлдар',en:'Files'}, render:(language='ru') => localize(files(),language)},
    {id:'imports', label:'Импорт', labels:{ru:'Импорт',kk:'Импорт',en:'Import'}, render:(language='ru') => localize(imports(),language)}
  ];
}());
