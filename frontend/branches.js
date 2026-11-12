/* Address directory based on the visible sheet of the customer-provided workbook. */
(function () {
  'use strict';

  const mainArchiveMap = {
    widget: 'https://yandex.kz/map-widget/v1/?oid=118215067870&ol=biz',
    source: 'https://yandex.kz/maps/ru/org/shyghys_qazaqstan_oblysynyng_memlekettik_muraghaty/118215067870/'
  };

  const records = [
    { id: 'main', name: 'Главный архив', address: 'г. Усть-Каменогорск, ул. Бейбітшілік, 26/1 (Головкова, 26/1)', searchAliases: 'Өскемен Oskemen Ust-Kamenogorsk', phone: '8 (7232) 25-59-76', email: 'arhiv-ukg@yandex.kz', isMain: true, map: mainArchiveMap },
    { id: 'altay', name: 'Филиал района Алтай', address: 'ВКО, район Алтай, ул. М. Горького, 33', phone: '8 (72335) 41630', mapListing: 'https://yandex.kz/maps/ru/org/shyghys_qazaqstan_oblysynyng_memlekettik_muraghaty_altay_filialy/244165745020/' },
    { id: 'glubokoe', name: 'Глубоковский районный филиал', address: 'ВКО, Глубоковский район, п. Глубокое, ул. Пирогова, 6', phone: '8 (72331) 22878' },
    { id: 'zaysan', name: 'Зайсанский районный филиал', address: 'ВКО, Зайсанский район, с. Зайсан, ул. Д. А. Конаева, 52', phone: '8 (72340) 21476' },
    { id: 'katon', name: 'Катон-Карагайский районный филиал', address: 'ВКО, Катон-Карагайский район, с. Катон-Карагай, ул. Жампеисова, 19/1', phone: '8 (72342) 29007' },
    { id: 'kurchum', name: 'Курчумский районный филиал', address: 'ВКО, Курчумский район, с. Курчум, ул. Барак Батыра, 25', phone: '8 (72339) 33104' },
    { id: 'markakol', name: 'Филиал района Марқакөл', address: 'ВКО, район Марқакөл, с. Маркаколь, ул. Крахмаля, 67', phone: '' },
    { id: 'ridder', name: 'Риддерский городской филиал', address: 'ВКО, г. Риддер, ул. Ч. Уалиханова, 44', phone: '8 (72336) 42264' },
    { id: 'samar', name: 'Филиал района Самар', address: 'ВКО, район Самар, с. Самар, ул. Горохова, 58', phone: '8 (72333) 31032' },
    { id: 'tarbagatay', name: 'Тарбагатайский районный филиал', address: 'ВКО, Тарбагатайский район, с. Акжар, ул. Даулетбая, 45', searchAliases: 'Ақжар Akzhar', phone: '8 (72344) 21468' },
    { id: 'ulan', name: 'Уланский районный филиал', address: 'ВКО, Уланский район, пос. Касыма Кайсенова, ул. З. Ахметова, 5, н.п. 5', searchAliases: 'Қасым Қайсенов Kasym Kaisenov', phone: '8 (72338) 27120' },
    { id: 'ulken', name: 'Филиал района Үлкен-Нарын', address: 'ВКО, район Үлкен-Нарын, с. Улкен Нарын, ул. Огнева, 40', phone: '8 (72341) 21599' },
    { id: 'personnel', name: 'Усть-Каменогорский городской филиал по личному составу', address: 'ВКО, г. Усть-Каменогорск, ул. Потанина, 12/2', searchAliases: 'Oskemen', phone: '8 (7232) 766560', mapListing: 'https://yandex.kz/maps/ru/org/shyghys_qazaqstan_oblysy_memlekettik_muraghatynyng_filialy/137746419812/' },
    { id: 'shemonaiha', name: 'Шемонаихинский районный филиал', address: 'ВКО, Шемонаихинский район, г. Шемонаиха, ул. Жукова, здание 2, н.п. 4', phone: '8 (72332) 62358' }
  ];

  const branchNames = {
    main: { kk: 'Бас архив', en: 'Main archive' },
    altay: { kk: 'Алтай ауданының филиалы', en: 'Altay district branch' },
    glubokoe: { kk: 'Глубокое аудандық филиалы', en: 'Glubokoe district branch' },
    zaysan: { kk: 'Зайсан аудандық филиалы', en: 'Zaysan district branch' },
    katon: { kk: 'Катонқарағай аудандық филиалы', en: 'Katon-Karagay district branch' },
    kurchum: { kk: 'Күршім аудандық филиалы', en: 'Kurchum district branch' },
    markakol: { kk: 'Марқакөл ауданының филиалы', en: 'Markakol district branch' },
    ridder: { kk: 'Риддер қалалық филиалы', en: 'Ridder city branch' },
    samar: { kk: 'Самар ауданының филиалы', en: 'Samar district branch' },
    tarbagatay: { kk: 'Тарбағатай аудандық филиалы', en: 'Tarbagatay district branch' },
    ulan: { kk: 'Ұлан аудандық филиалы', en: 'Ulan district branch' },
    ulken: { kk: 'Үлкен Нарын ауданының филиалы', en: 'Ulken Naryn district branch' },
    personnel: { kk: 'Өскемен қалалық жеке құрам бойынша филиалы', en: 'Ust-Kamenogorsk city branch for personnel records' },
    shemonaiha: { kk: 'Шемонаиха аудандық филиалы', en: 'Shemonaikha district branch' }
  };
  const branchName = (record, language) => branchNames[record.id]?.[language] || record.names?.[language] || record.name;

  const translations = {
    ru: {
      breadcrumbs: 'Навигационная цепочка', home: 'Главная', title: 'Филиалы и контакты',
      eyebrow: 'ГОСУДАРСТВЕННЫЙ АРХИВ ВКО', intro: 'Найдите архив по названию или населённому пункту.',
      data: 'Данные заказчика.', notice: 'Актуальность адресов и телефонов уточняется. Координаты филиалов не подтверждены.',
      original: '', search: 'Найти филиал или населённый пункт', placeholder: 'Название или населённый пункт',
      type: 'Тип подразделения', all: 'Все', main: 'Главный архив', branches: 'Филиалы',
      count: 'Показано подразделений', noResults: 'Подразделения не найдены', empty: 'Ничего не найдено',
      emptyHint: 'Измените запрос или выберите другой тип подразделения.',
      source: 'Адреса и телефоны предоставлены заказчиком. Информация требует проверки перед публикацией.',
      liveSource: 'Контактные данные из справочника архива. Перед визитом уточните график.',
      fallbackSource: 'Показана сохранённая версия справочника. Текущие данные временно недоступны.',
      choose: 'Выберите подразделение', chooseHint: 'Адрес и контактный телефон появятся здесь.',
      mainType: 'ГЛАВНЫЙ АРХИВ', branchType: 'ФИЛИАЛ АРХИВА', address: 'Адрес', phone: 'Телефон', noPhone: 'Не указан', email: 'Эл. почта', hours: 'Часы работы', hoursMissing: 'Уточняется', details: 'Контакты и маршрут',
      weekdays: 'Понедельник–пятница', readingRoom: 'Читальный зал', readingRoomLink: 'Как подготовиться к посещению', gallery: 'Фотографии на Яндекс Картах',
      nearestUnavailable: 'Для выбранного типа подразделения пока нет координат здания.',
      distanceHint: 'Расстояние по прямой рассчитано для подразделений, у которых есть координаты здания.',
      route: 'Как добраться', routeNote: 'Поиск адреса откроется во внешнем сервисе. 2ГИС может не найти отдельные адреса. В этом случае попробуйте Google Maps. Перед поездкой уточните адрес и наличие маршрута.',
      find2gis: 'Найти в 2ГИС', newTab: 'откроется в новой вкладке',
      mapMissing: 'Точка филиала уточняется. Найдите здание по указанному адресу.',
      map: 'На карте', mapStatus: 'Метка из карточки Яндекс Карт. Координаты уточняются у архива.',
      showMap: 'Показать карту', hideMap: 'Скрыть карту', openYandex: 'Открыть в Яндекс Картах',
      mapOffline: 'Карта недоступна без интернета. Адрес и телефон указаны выше.',
      mapFallback: 'Если карта не открылась, воспользуйтесь ссылкой на Яндекс Карты или поиском по адресу.',
      yandex: 'Яндекс Карты'
    },
    kk: {
      breadcrumbs: 'Навигациялық жол', home: 'Басты бет', title: 'Филиалдар мен байланыс',
      eyebrow: 'ШҚО МЕМЛЕКЕТТІК АРХИВІ', intro: 'Архивті атауы немесе елді мекен бойынша табыңыз.',
      data: 'Тапсырыс берушінің деректері.', notice: 'Мекенжайлар мен телефондардың өзектілігі нақтылануда. Филиалдардың координаттары расталмаған.',
      original: 'Мекенжайлар тапсырыс беруші ұсынған орыс тіліндегі түпнұсқада берілген.',
      search: 'Филиалды немесе елді мекенді табу', placeholder: 'Атауы немесе елді мекен',
      type: 'Бөлімшенің түрі', all: 'Барлығы', main: 'Бас архив', branches: 'Филиалдар',
      count: 'Көрсетілген бөлімшелер', noResults: 'Бөлімшелер табылмады', empty: 'Ештеңе табылмады',
      emptyHint: 'Сұрауды өзгертіңіз немесе бөлімшенің басқа түрін таңдаңыз.',
      source: 'Мекенжайлар мен телефондарды тапсырыс беруші ұсынған. Жариялау алдында ақпаратты тексеру қажет.',
      liveSource: 'Байланыс деректері архив анықтамалығынан алынды. Бармас бұрын жұмыс уақытын нақтылаңыз.',
      fallbackSource: 'Анықтамалықтың сақталған нұсқасы көрсетілді. Өзекті деректер уақытша қолжетімсіз.',
      choose: 'Бөлімшені таңдаңыз', chooseHint: 'Мекенжайы мен байланыс телефоны осы жерде көрсетіледі.',
      mainType: 'БАС АРХИВ', branchType: 'АРХИВ ФИЛИАЛЫ', address: 'Мекенжай', phone: 'Телефон', noPhone: 'Көрсетілмеген', email: 'Эл. пошта', hours: 'Жұмыс уақыты', hoursMissing: 'Нақтылануда', details: 'Байланыс және бағыт',
      weekdays: 'Дүйсенбі–жұма', readingRoom: 'Оқу залы', readingRoomLink: 'Келуге қалай дайындалуға болады', gallery: 'Яндекс Карталардағы фотосуреттер',
      nearestUnavailable: 'Таңдалған бөлімше түрі үшін ғимарат координаттары әзірге жоқ.',
      distanceHint: 'Түзу сызық бойымен қашықтық ғимарат координаттары бар бөлімшелер үшін есептелді.',
      route: 'Қалай жетуге болады', routeNote: 'Мекенжайды іздеу сыртқы сервисте ашылады. 2ГИС кейбір мекенжайларды таппауы мүмкін. Ондай жағдайда Google Maps қолданып көріңіз. Бармас бұрын мекенжай мен бағытты нақтылаңыз.',
      find2gis: '2ГИС-тен табу', newTab: 'жаңа қойындыда ашылады',
      mapMissing: 'Филиалдың картадағы орны нақтылануда. Ғимаратты көрсетілген мекенжай бойынша іздеңіз.',
      map: 'Картада', mapStatus: 'Белгі Яндекс Карталардағы ұйым карточкасынан алынған. Координаттар архивпен нақтылануда.',
      showMap: 'Картаны көрсету', hideMap: 'Картаны жасыру', openYandex: 'Яндекс Карталарда ашу',
      mapOffline: 'Интернетсіз карта қолжетімсіз. Мекенжай мен телефон жоғарыда көрсетілген.',
      mapFallback: 'Карта ашылмаса, Яндекс Карталар сілтемесін немесе мекенжай бойынша іздеуді пайдаланыңыз.',
      yandex: 'Яндекс Карталар'
    },
    en: {
      breadcrumbs: 'Breadcrumbs', home: 'Home', title: 'Branches and contacts',
      eyebrow: 'EAST KAZAKHSTAN STATE ARCHIVE', intro: 'Find an archive by name or locality.',
      data: 'Customer-provided information.', notice: 'Addresses and telephone numbers are being verified. Branch coordinates have not been confirmed.',
      original: 'Addresses are shown as supplied, in Russian.',
      search: 'Find a branch or locality', placeholder: 'Name or locality',
      type: 'Type of office', all: 'All', main: 'Main archive', branches: 'Branches',
      count: 'Offices shown', noResults: 'No offices found', empty: 'No results',
      emptyHint: 'Change your search or select another type of office.',
      source: 'Addresses and telephone numbers were supplied by the customer. The information needs verification before publication.',
      liveSource: 'Contact details from the archive directory. Confirm opening hours before visiting.',
      fallbackSource: 'Showing the saved directory. Current details are temporarily unavailable.',
      choose: 'Select an office', chooseHint: 'Its address and telephone number will appear here.',
      mainType: 'MAIN ARCHIVE', branchType: 'ARCHIVE BRANCH', address: 'Address', phone: 'Telephone', noPhone: 'Not provided', email: 'Email', hours: 'Opening hours', hoursMissing: 'To be confirmed', details: 'Contacts and directions',
      weekdays: 'Monday–Friday', readingRoom: 'Reading room', readingRoomLink: 'Prepare for your visit', gallery: 'Photos on Yandex Maps',
      nearestUnavailable: 'There are no building coordinates for the selected type of office yet.',
      distanceHint: 'Straight-line distances are shown for offices with building coordinates.',
      route: 'Directions', routeNote: 'Address search opens in an external service. 2GIS may not find every address. If that happens, try Google Maps. Confirm the address and route before travelling.',
      find2gis: 'Find in 2GIS', newTab: 'opens in a new tab',
      mapMissing: 'The branch location is being verified. Look up the building by its listed address.',
      map: 'On the map', mapStatus: 'The marker comes from the organisation listing on Yandex Maps. The archive is being asked to confirm the coordinates.',
      showMap: 'Show map', hideMap: 'Hide map', openYandex: 'Open in Yandex Maps',
      mapOffline: 'The map requires an internet connection. The address and telephone number are shown above.',
      mapFallback: 'If the map does not open, use the Yandex Maps link or search by address.',
      yandex: 'Yandex Maps'
    }
  };

  const paths = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 4 4"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M6 3h3l1.5 4-2 1.8a15 15 0 0 0 6.7 6.7L17 13.5l4 1.5v3a3 3 0 0 1-3.3 3C10 20 4 14 3 6.3A3 3 0 0 1 6 3Z"/>',
    external: '<path d="M13 5h6v6M19 5l-8 8M18 14v5H5V6h5"/>',
    archive: '<rect x="4" y="4" width="16" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  const normalize = value => value.toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/[–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  const mapUrl = address => 'https://2gis.kz/ust-kamenogorsk/search/' + encodeURIComponent(address);
  const googleMapUrl = address => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
  const mainSeedHours = 'Пн–Пт 8:00–17:00; читальный зал Пн–Пт 9:00–16:00';
  const unconfirmedSeedHours = 'Пн–Пт 9:00–18:00 (уточняется)';
  const esc = value => window.archiveApi.escape(value);
  const emailUrl = value => /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)
    ? 'mailto:' + encodeURIComponent(value).replace('%40', '@') : '';

  function phoneUrl(phone) {
    const number = phone.replace(/[^\d+]/g, '').replace(/^8(?=\d{10}$)/, '+7');
    return /^\+?\d{5,15}$/.test(number) ? 'tel:' + number : '';
  }

  function schedule(value, isMain, t) {
    if (!isMain) return { opening: value && value !== unconfirmedSeedHours ? value : t.hoursMissing };
    const reading = t.weekdays + ', 09:00–16:00';
    if (value === undefined || value === mainSeedHours) return { opening: t.weekdays + ', 08:00–17:00', reading };
    const [opening, readingRoom] = (value || '').split(/\s*[;\n]\s*читальный зал\s*:?\s*/i, 2);
    return { opening: opening.trim() || t.hoursMissing, reading: readingRoom?.trim() || t.hoursMissing };
  }

  let directoryRequest;
  function loadDirectory(fresh = false) {
    if (!fresh && directoryRequest) return directoryRequest;
    const request = window.archiveApi.get('/branches').then(({ items }) => {
      if (!Array.isArray(items)) throw new Error('Invalid branch directory');
      return items;
    }).finally(() => { if (directoryRequest === request) directoryRequest = null; });
    directoryRequest = request;
    return request;
  }

  window.loadArchiveBranches = loadDirectory;

  window.refreshMainBranchContacts = async function refreshMainBranchContacts(language) {
    const fields = [...document.querySelectorAll('[data-main-contact]')];
    const api = window.archiveApi;
    if (!fields.length || !(await api?.ready)) return;
    try {
      const main = (await loadDirectory()).find(branch => branch.id === 'main');
      if (!main || document.documentElement.lang !== language) return;
      const t = translations[language] || translations.ru;
      const hours = schedule(main.hours, true, t);
      const values = {
        address: [main.address, ''],
        phone: [main.phone, phoneUrl(main.phone || '')],
        email: [main.email, emailUrl(main.email || '')],
        hours: [hours.opening, ''],
        readingHours: [hours.reading, ''],
      };
      for (const field of fields) {
        if (!field.isConnected) continue;
        const [label, href] = values[field.dataset.mainContact];
        field.textContent = (field.hasAttribute('data-hours-label') ? t.hours + ': ' : '')
          + (label || (field.dataset.mainContact === 'phone' ? t.noPhone : '—'));
        if (field.tagName === 'A') {
          if (href) field.href = href;
          else field.removeAttribute('href');
        }
        field.hidden = field.dataset.mainContact === 'email' && !label;
      }
    } catch {
      // The static contact labels are the offline directory.
    }
  };

  function publishedRecord(branch) {
    const original = records.find(item => item.id === branch.id);
    const lat = branch.lat === null || branch.lat === undefined ? NaN : Number(branch.lat);
    const lng = branch.lng === null || branch.lng === undefined ? NaN : Number(branch.lng);
    const hasPoint = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    // The geocoder matched house 19 in Katon-Karagay, while the archive lists 19/1.
    const precision = branch.id === 'katon' && branch.coords_source?.includes('Nominatim') ? 'street' : branch.coords_precision;
    const normalizedAddress = value => normalize(value || '').replace(/[.,\s]/g, '');
    const originalAddress = original && normalizedAddress(branch.address) === normalizedAddress(original.address);
    return {
      ...original,
      id: branch.id, name: original?.name || branch.name_ru,
      names: { kk: branch.name_kk, en: branch.name_en },
      isMain: branch.kind === 'main',
      address: branch.address || '', phone: branch.phone || '', email: branch.email || '', hours: branch.hours || '',
      locality: branch.locality,
      lat: hasPoint ? lat : undefined, lng: hasPoint ? lng : undefined, precision,
      map: hasPoint && originalAddress ? original.map : undefined,
      mapListing: originalAddress ? original.mapListing : undefined,
      originalBuilding: Boolean(originalAddress),
    };
  }
  const hasBuildingPoint = record => record.precision === 'building' && Number.isFinite(record.lat);
  // Координаты приходят из /api/v1/branches (геокодирование OSM по адресам заказчика, требуют подтверждения архивом).
  const geoText = {
    ru: { osm: 'Карта OpenStreetMap', precision: { building: 'Точка по адресу здания.', street: 'Точка по улице: номер дома на карте не найден.', town: 'Показан населённый пункт: точный адрес на карте не найден.' }, verify: 'Координаты определены автоматически по адресу и ожидают подтверждения архивом.', route2gis: 'Маршрут в 2ГИС', routeGoogle: 'Маршрут в Google Maps', nearest: 'Найти ближайший филиал', nearestHint: 'Местоположение используется только в браузере и никуда не отправляется.', km: 'км', geoError: 'Не удалось определить местоположение. Выберите филиал по адресу.' },
    kk: { osm: 'OpenStreetMap картасы', precision: { building: 'Ғимарат мекенжайы бойынша нүкте.', street: 'Көше бойынша нүкте: үй нөмірі картада табылмады.', town: 'Елді мекен көрсетілген: нақты мекенжай картада табылмады.' }, verify: 'Координаттар мекенжай бойынша автоматты анықталды, архивтің растауын күтеді.', route2gis: '2ГИС-те бағыт', routeGoogle: 'Google Maps-та бағыт', nearest: 'Ең жақын филиалды табу', nearestHint: 'Орналасқан жер тек браузерде қолданылады, ешқайда жіберілмейді.', km: 'км', geoError: 'Орналасқан жерді анықтау мүмкін болмады. Филиалды мекенжай бойынша таңдаңыз.' },
    en: { osm: 'OpenStreetMap', precision: { building: 'Marker at the building address.', street: 'Marker on the street: the house number was not found on the map.', town: 'The settlement is shown: the exact address was not found on the map.' }, verify: 'Coordinates were derived automatically from the address and await confirmation by the archive.', route2gis: 'Route in 2GIS', routeGoogle: 'Route in Google Maps', nearest: 'Find the nearest branch', nearestHint: 'Your location stays in the browser and is not sent anywhere.', km: 'km', geoError: 'Could not determine your location. Choose a branch by address.' }
  };
  const osmEmbedUrl = ({ lat, lng }) => `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.012},${lat - 0.006},${lng + 0.012},${lat + 0.006}&layer=mapnik&marker=${lat},${lng}`;
  const route2gisUrl = ({ lat, lng }) => `https://2gis.kz/directions/points/%7C${lng}%2C${lat}`;
  const routeGoogleUrl = ({ lat, lng }) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  function distanceKm(a, b) {
    const rad = Math.PI / 180;
    const h = Math.sin((b.lat - a.lat) * rad / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin((b.lng - a.lng) * rad / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  }

  function mapPanel(record, t) {
    const g = geoText[t.lang] || geoText.ru;
    if (!record.map && Number.isFinite(record.lat)) {
      return `<section class="branch-map" aria-labelledby="branch-map-heading"><div class="branch-map-heading">${icon('pin')}<h3 id="branch-map-heading">${t.map}</h3></div>
        <p class="branch-map-status">${g.precision[record.precision] || ''} ${g.verify}</p>
        <div class="branch-map-actions"><button type="button" data-show-branch-map aria-controls="branch-map-view" aria-expanded="false">${t.showMap}</button></div>
        <div id="branch-map-view" hidden></div><p class="branch-map-fallback" data-branch-map-status role="status" hidden></p></section>`;
    }
    if (!record.map) {
      return `<div class="branch-map"><p class="branch-map-fallback">${t.mapMissing}</p></div>`;
    }
    return `<section class="branch-map" aria-labelledby="branch-map-heading">
      <div class="branch-map-heading">${icon('pin')}<h3 id="branch-map-heading">${t.map}</h3></div>
      <p class="branch-map-status">${t.mapStatus}</p>
      <div class="branch-map-actions">
        <button type="button" data-show-branch-map aria-controls="branch-map-view" aria-expanded="false">${t.showMap}</button>
        <a href="${record.map.source}" target="_blank" rel="noopener noreferrer">${t.openYandex} <span aria-hidden="true">↗</span><span class="branches-visually-hidden"> (${t.newTab})</span></a>
      </div>
      <div id="branch-map-view" hidden></div>
      <p class="branch-map-fallback" data-branch-map-status role="status" hidden></p>
    </section>`;
  }

  function detail(record, t) {
    if (!record) return `<div class="branches-no-selection"><h2>${t.choose}</h2><p>${t.chooseHint}</p></div>`;
    const panoramaLabel = { ru: 'Посмотреть здание на панораме', kk: 'Ғимаратты панорамадан көру', en: 'View the building in a panorama' }[t.lang] || 'Посмотреть здание на панораме';
    const hasOriginalBuilding = record.originalBuilding !== false;
    const listing = record.isMain && hasOriginalBuilding ? mainArchiveMap.source : record.mapListing;
    const panorama = listing && (record.isMain || record.id === 'personnel') ? listing + 'panorama/' : '';
    const photo = window.archiveBranchPhotos.render(record, t.lang);
    const g = geoText[t.lang] || geoText.ru;
    const routes = hasBuildingPoint(record)
      ? [[route2gisUrl(record), g.route2gis], [routeGoogleUrl(record), g.routeGoogle]]
      : record.address ? [[mapUrl(record.address), t.find2gis], [googleMapUrl(record.address), 'Google Maps']] : [];
    const phone = phoneUrl(record.phone);
    const email = emailUrl(record.email || '');
    const hours = schedule(record.hours, record.isMain, t);
    const hoursLang = hours.opening === record.hours || record.hours?.startsWith(hours.opening) ? ' lang="ru"' : '';
    return `<div class="branches-detail-content"><p class="branches-detail-type">${record.isMain ? t.mainType : t.branchType}</p><h2 id="branches-detail-heading">${esc(branchName(record, t.lang))}</h2>
      ${photo}<dl class="branches-detail-list"><div><dt>${icon('pin')} ${t.address}</dt><dd lang="ru">${esc(record.address || '—')}</dd></div><div><dt>${icon('phone')} ${t.phone}</dt><dd>${phone ? `<a href="${phone}">${esc(record.phone)}</a>` : esc(record.phone || t.noPhone)}</dd></div>${email ? `<div><dt>${t.email}</dt><dd><a href="${email}">${esc(record.email)}</a></dd></div>` : ''}
      <div><dt>${t.hours}</dt><dd${hoursLang}>${esc(hours.opening)}</dd></div>
      ${record.isMain ? `<div><dt>${t.readingRoom}</dt><dd>${esc(hours.reading)}<br><a href="#/section/reading-room">${t.readingRoomLink} <span aria-hidden="true">→</span></a></dd></div>` : ''}</dl>
      ${routes.length ? `<div class="branches-divider"></div><h3>${t.route}</h3><p class="branches-route-note">${t.routeNote}</p>
      <div class="branches-route-links">${routes.map(([href, label], index) => `<a class="branches-route${index ? ' branches-route-secondary' : ''}" href="${href}" target="_blank" rel="noopener noreferrer">${icon('external')} ${label} <span class="branches-visually-hidden">(${t.newTab})</span></a>`).join('')}</div>` : ''}
      ${panorama ? `<p class="branches-panorama"><a href="${panorama}" target="_blank" rel="noopener noreferrer">${panoramaLabel} ↗ <span class="branches-visually-hidden">(${t.newTab})</span></a></p>` : ''}
      ${listing ? `<p class="branches-panorama"><a href="${listing}gallery/?lang=ru" target="_blank" rel="noopener noreferrer">${t.gallery} <span aria-hidden="true">↗</span><span class="branches-visually-hidden"> (${t.newTab})</span></a></p>` : ''}
      <div class="branches-divider"></div>${mapPanel(record, t)}</div>`;
  }

  function renderBranches(container, params, language = 'ru') {
    const t = { ...(translations[language] || translations.ru), lang: language };
    const urlParams = params instanceof URLSearchParams ? params : new URLSearchParams();
    const requestedId = urlParams.get('id');
    let directory = records.map(item => ({ ...item }));
    let selected = directory.find(item => item.id === requestedId) || directory[0];
    let renderedSelection;
    const requestedFilter = urlParams.get('filter');
    let filter = ['all', 'main', 'branch'].includes(requestedFilter) ? requestedFilter : 'all';

    container.innerHTML = `<section class="branches-page" aria-labelledby="branches-heading"><div class="branches-container">
      <nav class="branches-breadcrumb" aria-label="${t.breadcrumbs}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <div class="branches-heading"><div><p class="branches-eyebrow">${t.eyebrow}</p><h1 id="branches-heading">${t.title}</h1><p>${t.intro}</p></div></div>
      <div class="branches-notice" role="note"><span class="branches-notice-icon" aria-hidden="true">i</span><p><strong>${t.data}</strong> ${t.notice}${t.original ? ' ' + t.original : ''}</p></div>
      <div class="branches-layout"><div class="branches-list-area"><form class="branches-search" role="search"><label class="branches-visually-hidden" for="branches-query">${t.search}</label>${icon('search')}<input id="branches-query" type="search" maxlength="150" autocomplete="off" placeholder="${t.placeholder}"></form>
      <div class="branches-filters" role="group" aria-label="${t.type}"><button type="button" data-filter="all" aria-pressed="${filter === 'all'}">${t.all}</button><button type="button" data-filter="main" aria-pressed="${filter === 'main'}">${t.main}</button><button type="button" data-filter="branch" aria-pressed="${filter === 'branch'}">${t.branches}</button></div><p class="branches-count" role="status" aria-live="polite"></p><div class="branches-list"></div></div>
      <aside class="branches-detail" aria-live="polite" aria-labelledby="branches-detail-heading"></aside></div>
      <p class="branches-source">${t.source}</p>
    </div></section>`;
    const queryInput = container.querySelector('#branches-query');
    const list = container.querySelector('.branches-list');
    const detailContainer = container.querySelector('.branches-detail');
    const page = container.querySelector('.branches-page');
    const count = container.querySelector('.branches-count');
    const filterButtons = Array.from(container.querySelectorAll('[data-filter]'));
    let selectionVersion = 0;
    queryInput.value = (urlParams.get('q') || '').slice(0, 150);

    function saveFilters() {
      const next = new URLSearchParams();
      if (selected) next.set('id', selected.id);
      if (queryInput.value.trim()) next.set('q', queryInput.value.trim());
      if (filter !== 'all') next.set('filter', filter);
      history.replaceState(null, '', '#/section/branches' + (next.size ? '?' + next.toString() : ''));
    }

    function update(keepMap) {
      const q = normalize(queryInput.value);
      const filtered = directory.filter(item => {
        const typeMatch = filter === 'all' || (filter === 'main' && item.isMain) || (filter === 'branch' && !item.isMain);
        const names = branchNames[item.id];
        return typeMatch && (!q || normalize([item.name, item.address, item.locality, names?.kk || item.names?.kk, names?.en || item.names?.en, item.searchAliases].join(' ')).includes(q));
      });
      if (filtered.some(item => item.distance !== undefined)) filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      if (!filtered.some(item => item.id === selected?.id)) selected = filtered[0] || null;
      count.textContent = filtered.length ? `${t.count}: ${filtered.length}` : t.noResults;
      list.innerHTML = filtered.length ? filtered.map(item => `<button type="button" class="branches-card${selected?.id === item.id ? ' is-selected' : ''}" data-branch="${esc(item.id)}" aria-pressed="${selected?.id === item.id}">${window.archiveBranchPhotos.render(item, t.lang, true)}<span class="branches-card-copy"><strong>${esc(branchName(item, t.lang))}</strong><span lang="ru">${esc(item.address)}</span>${item.phone ? `<span>${t.phone}: <span dir="ltr">${esc(item.phone)}</span></span>` : ''}${item.distance !== undefined ? `<span class="branches-distance">≈ ${item.distance.toFixed(1)} ${(geoText[t.lang] || geoText.ru).km}</span>` : ''}<span class="branches-card-action">${t.details} <span aria-hidden="true">→</span></span></span></button>`).join('') : `<div class="branches-empty"><strong>${t.empty}</strong><p>${t.emptyHint}</p></div>`;
      window.archiveBranchPhotos.bind(list, language);
      updateDetail(keepMap);
      saveFilters();
    }

    function updateDetail(keepMap) {
      if (renderedSelection !== selected) {
        const map = keepMap && renderedSelection?.id === selected?.id ? detailContainer.querySelector('.branch-map') : null;
        const markup = detail(selected, t);
        if (map) {
          const template = document.createElement('template');
          template.innerHTML = markup;
          template.content.querySelector('.branch-map').remove();
          const siblings = [...map.parentNode.childNodes].filter(node => node !== map);
          siblings.forEach(node => node.remove());
          map.before(...template.content.firstElementChild.childNodes);
        } else detailContainer.innerHTML = markup;
        window.archiveBranchPhotos.bind(detailContainer, language);
        renderedSelection = selected;
      }
      if (!selected) detailContainer.removeAttribute('aria-labelledby');
      else detailContainer.setAttribute('aria-labelledby', 'branches-detail-heading');
    }

    container.querySelector('.branches-search').addEventListener('submit', event => event.preventDefault());
    detailContainer.addEventListener('click', event => {
      const toggle = event.target.closest('[data-show-branch-map]');
      if (!toggle || !selected || (!selected.map && !Number.isFinite(selected.lat))) return;
      const view = detailContainer.querySelector('#branch-map-view');
      const status = detailContainer.querySelector('[data-branch-map-status]');
      if (!view.hidden) {
        view.replaceChildren();
        view.hidden = true;
        status.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = t.showMap;
        return;
      }
      if (!navigator.onLine) {
        status.textContent = t.mapOffline;
        status.hidden = false;
        return;
      }
      const frame = document.createElement('iframe');
      frame.className = 'branch-map-frame';
      frame.title = `${selected.map ? t.yandex : g.osm} — ${branchName(selected, language)}`;
      frame.referrerPolicy = 'no-referrer';
      frame.allow = "geolocation 'none'";
      frame.src = selected.map ? selected.map.widget : osmEmbedUrl(selected);
      view.replaceChildren(frame);
      view.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.textContent = t.hideMap;
      status.textContent = t.mapFallback;
      status.hidden = false;
    });
    queryInput.addEventListener('input', () => {
      selectionVersion++;
      update();
    });
    filterButtons.forEach(button => button.addEventListener('click', () => {
      selectionVersion++;
      filter = button.dataset.filter;
      filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update();
    }));
    list.addEventListener('click', event => {
      const card = event.target.closest('[data-branch]');
      if (!card) return;
      selectionVersion++;
      selected = directory.find(item => item.id === card.dataset.branch) || null;
      update();
      const newCard = list.querySelector(`[data-branch="${CSS.escape(card.dataset.branch)}"]`);
      if (newCard) newCard.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) {
        detailContainer.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
    const g = geoText[t.lang] || geoText.ru;
    const nearest = document.createElement('div');
    nearest.className = 'branches-nearest';
    nearest.innerHTML = `<button type="button" class="branches-route branches-route-secondary">${icon('pin')} ${g.nearest}</button><small>${g.nearestHint}</small><p role="status"></p>`;
    nearest.hidden = true;
    count.before(nearest);
    nearest.querySelector('button').addEventListener('click', () => {
      const status = nearest.querySelector('p');
      if (!navigator.geolocation) { status.textContent = g.geoError; return; }
      const requestedVersion = ++selectionVersion;
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        if (!page.isConnected || selectionVersion !== requestedVersion) return;
        const here = { lat: coords.latitude, lng: coords.longitude };
        directory.forEach(item => {
          if (hasBuildingPoint(item)) item.distance = distanceKm(here, item);
          else delete item.distance;
        });
        const matchesFilter = item => filter === 'all' || (filter === 'main' ? item.isMain : !item.isMain);
        const nearestOffice = directory.filter(item => matchesFilter(item) && item.distance !== undefined).sort((a, b) => a.distance - b.distance)[0];
        if (nearestOffice) queryInput.value = '';
        selected = nearestOffice || selected;
        status.textContent = nearestOffice ? t.distanceHint : t.nearestUnavailable;
        renderedSelection = null;
        update();
      }, () => {
        if (page.isConnected && selectionVersion === requestedVersion) status.textContent = g.geoError;
      }, { timeout: 10000, maximumAge: 600000 });
    });
    const api = window.archiveApi;
    if (api) api.ready.then(async available => {
      if (!available || !page.isConnected) return;
      const items = await loadDirectory();
      if (!page.isConnected) return;
      const previous = selected;
      directory = items.map(publishedRecord);
      const selectedId = selectionVersion === 0 && requestedId ? requestedId : previous?.id;
      selected = directory.find(item => item.id === selectedId) || null;
      nearest.hidden = !directory.some(hasBuildingPoint);
      page.querySelector('.branches-source').textContent = t.liveSource;
      const keepMap = previous?.map && previous.map === selected?.map
        && detailContainer.querySelector('[data-show-branch-map][aria-expanded="true"]');
      const focusedId = list.contains(document.activeElement) ? document.activeElement.dataset.branch : null;
      update(keepMap);
      if (focusedId) list.querySelector(`[data-branch="${CSS.escape(focusedId)}"]`)?.focus({ preventScroll:true });
    }).catch(() => {
      if (page.isConnected) page.querySelector('.branches-source').textContent = t.fallbackSource;
    });
    update();
  }

  window.renderBranches = renderBranches;
}());
