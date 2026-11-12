/* Address directory based on the visible sheet of the customer-provided workbook. */
(function () {
  'use strict';

  const mainArchiveMap = {
    widget: 'https://yandex.kz/map-widget/v1/?oid=118215067870&ol=biz',
    source: 'https://yandex.kz/maps/ru/org/shyghys_qazaqstan_oblysynyng_memlekettik_muraghaty/118215067870/'
  };

  const records = [
    { id: 'main', name: 'Главный архив', address: 'г. Усть-Каменогорск, ул. Бейбітшілік, 26/1 (Головкова, 26/1)', phone: '8 (7232) 25-59-76', isMain: true, map: mainArchiveMap },
    { id: 'altay', name: 'Филиал района Алтай', address: 'ВКО, район Алтай, ул. М. Горького, 33', phone: '8 (72335) 41630' },
    { id: 'glubokoe', name: 'Глубоковский районный филиал', address: 'ВКО, Глубоковский район, п. Глубокое, ул. Пирогова, 6', phone: '8 (72331) 22878' },
    { id: 'zaysan', name: 'Зайсанский районный филиал', address: 'ВКО, Зайсанский район, с. Зайсан, ул. Д. А. Конаева, 52', phone: '8 (72340) 21476' },
    { id: 'katon', name: 'Катон-Карагайский районный филиал', address: 'ВКО, Катон-Карагайский район, с. Катон-Карагай, ул. Жампеисова, 19/1', phone: '8 (72342) 29007' },
    { id: 'kurchum', name: 'Курчумский районный филиал', address: 'ВКО, Курчумский район, с. Курчум, ул. Барак Батыра, 25', phone: '8 (72339) 33104' },
    { id: 'markakol', name: 'Филиал района Марқакөл', address: 'ВКО, район Марқакөл, с. Маркаколь, ул. Крахмаля, 67', phone: '' },
    { id: 'ridder', name: 'Риддерский городской филиал', address: 'ВКО, г. Риддер, ул. Ч. Уалиханова, 44', phone: '8 (72336) 42264' },
    { id: 'samar', name: 'Филиал района Самар', address: 'ВКО, район Самар, с. Самар, ул. Горохова, 58', phone: '8 (72333) 31032' },
    { id: 'tarbagatay', name: 'Тарбагатайский районный филиал', address: 'ВКО, Тарбагатайский район, с. Акжар, ул. Даулетбая, 45', phone: '8 (72344) 21468' },
    { id: 'ulan', name: 'Уланский районный филиал', address: 'ВКО, Уланский район, пос. Касыма Кайсенова, ул. З. Ахметова, 5, н.п. 5', phone: '8 (72338) 27120' },
    { id: 'ulken', name: 'Филиал района Үлкен-Нарын', address: 'ВКО, район Үлкен-Нарын, с. Улкен Нарын, ул. Огнева, 40', phone: '8 (72341) 21599' },
    { id: 'personnel', name: 'Усть-Каменогорский городской филиал по личному составу', address: 'ВКО, г. Усть-Каменогорск, ул. Потанина, 12/2', phone: '8 (7232) 766560' },
    { id: 'shemonaiha', name: 'Шемонаихинский районный филиал', address: 'ВКО, Шемонаихинский район, г. Шемонаиха, ул. Жукова, здание 2, н.п. 4', phone: '8 (72332) 62358' }
  ];

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
      choose: 'Выберите подразделение', chooseHint: 'Адрес и контактный телефон появятся здесь.',
      mainType: 'ГЛАВНЫЙ АРХИВ', branchType: 'ФИЛИАЛ АРХИВА', address: 'Адрес', phone: 'Телефон', noPhone: 'Не указан',
      route: 'Как добраться', routeNote: 'Поиск адреса откроется во внешнем сервисе. 2ГИС может не найти отдельные адреса. В этом случае попробуйте Google Maps. Перед поездкой уточните адрес и наличие маршрута.',
      find2gis: 'Найти в 2ГИС', newTab: 'откроется в новой вкладке',
      mapMissing: 'Точка филиала уточняется. Для поиска используйте адрес и ссылки на карты ниже.',
      map: 'На карте', mapStatus: 'Метка из карточки Яндекс Карт. Координаты уточняются у архива.',
      showMap: 'Показать карту', hideMap: 'Скрыть карту', openYandex: 'Открыть в Яндекс Картах',
      mapOffline: 'Карта недоступна без интернета. Адрес и телефон указаны выше.',
      mapFallback: 'Если карта не открылась, воспользуйтесь ссылкой на Яндекс Карты или поиском по адресу ниже.',
      yandex: 'Яндекс Карты'
    },
    kk: {
      breadcrumbs: 'Навигациялық жол', home: 'Басты бет', title: 'Филиалдар мен байланыс',
      eyebrow: 'ШҚО МЕМЛЕКЕТТІК АРХИВІ', intro: 'Архивті атауы немесе елді мекен бойынша табыңыз.',
      data: 'Тапсырыс берушінің деректері.', notice: 'Мекенжайлар мен телефондардың өзектілігі нақтылануда. Филиалдардың координаттары расталмаған.',
      original: 'Филиалдардың атаулары мен мекенжайлары тапсырыс беруші ұсынған орыс тіліндегі түпнұсқада берілген.',
      search: 'Филиалды немесе елді мекенді табу', placeholder: 'Атауы немесе елді мекен',
      type: 'Бөлімшенің түрі', all: 'Барлығы', main: 'Бас архив', branches: 'Филиалдар',
      count: 'Көрсетілген бөлімшелер', noResults: 'Бөлімшелер табылмады', empty: 'Ештеңе табылмады',
      emptyHint: 'Сұрауды өзгертіңіз немесе бөлімшенің басқа түрін таңдаңыз.',
      source: 'Мекенжайлар мен телефондарды тапсырыс беруші ұсынған. Жариялау алдында ақпаратты тексеру қажет.',
      choose: 'Бөлімшені таңдаңыз', chooseHint: 'Мекенжайы мен байланыс телефоны осы жерде көрсетіледі.',
      mainType: 'БАС АРХИВ', branchType: 'АРХИВ ФИЛИАЛЫ', address: 'Мекенжай', phone: 'Телефон', noPhone: 'Көрсетілмеген',
      route: 'Қалай жетуге болады', routeNote: 'Мекенжайды іздеу сыртқы сервисте ашылады. 2ГИС кейбір мекенжайларды таппауы мүмкін. Ондай жағдайда Google Maps қолданып көріңіз. Бармас бұрын мекенжай мен бағытты нақтылаңыз.',
      find2gis: '2ГИС-тен табу', newTab: 'жаңа қойындыда ашылады',
      mapMissing: 'Филиалдың картадағы орны нақтылануда. Іздеу үшін төмендегі мекенжай мен карта сілтемелерін пайдаланыңыз.',
      map: 'Картада', mapStatus: 'Белгі Яндекс Карталардағы ұйым карточкасынан алынған. Координаттар архивпен нақтылануда.',
      showMap: 'Картаны көрсету', hideMap: 'Картаны жасыру', openYandex: 'Яндекс Карталарда ашу',
      mapOffline: 'Интернетсіз карта қолжетімсіз. Мекенжай мен телефон жоғарыда көрсетілген.',
      mapFallback: 'Карта ашылмаса, Яндекс Карталар сілтемесін немесе төмендегі мекенжай бойынша іздеуді пайдаланыңыз.',
      yandex: 'Яндекс Карталар'
    },
    en: {
      breadcrumbs: 'Breadcrumbs', home: 'Home', title: 'Branches and contacts',
      eyebrow: 'EAST KAZAKHSTAN STATE ARCHIVE', intro: 'Find an archive by name or locality.',
      data: 'Customer-provided information.', notice: 'Addresses and telephone numbers are being verified. Branch coordinates have not been confirmed.',
      original: 'Branch names and addresses are shown in the Russian original supplied by the customer.',
      search: 'Find a branch or locality', placeholder: 'Name or locality',
      type: 'Type of office', all: 'All', main: 'Main archive', branches: 'Branches',
      count: 'Offices shown', noResults: 'No offices found', empty: 'No results',
      emptyHint: 'Change your search or select another type of office.',
      source: 'Addresses and telephone numbers were supplied by the customer. The information needs verification before publication.',
      choose: 'Select an office', chooseHint: 'Its address and telephone number will appear here.',
      mainType: 'MAIN ARCHIVE', branchType: 'ARCHIVE BRANCH', address: 'Address', phone: 'Telephone', noPhone: 'Not provided',
      route: 'Directions', routeNote: 'Address search opens in an external service. 2GIS may not find every address. If that happens, try Google Maps. Confirm the address and route before travelling.',
      find2gis: 'Find in 2GIS', newTab: 'opens in a new tab',
      mapMissing: 'The branch location is being verified. Use the address and external map links below to search.',
      map: 'On the map', mapStatus: 'The marker comes from the organisation listing on Yandex Maps. The archive is being asked to confirm the coordinates.',
      showMap: 'Show map', hideMap: 'Hide map', openYandex: 'Open in Yandex Maps',
      mapOffline: 'The map requires an internet connection. The address and telephone number are shown above.',
      mapFallback: 'If the map does not open, use the Yandex Maps link or the address search below.',
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
  const phoneUrl = phone => 'tel:' + phone.replace(/[^\d+]/g, '');
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
    if (!record.map && record.lat) {
      return `<section class="branch-map" aria-labelledby="branch-map-heading"><div class="branch-map-heading">${icon('pin')}<h3 id="branch-map-heading">${t.map}</h3></div>
        <p class="branch-map-status">${g.precision[record.precision] || ''} ${g.verify}</p>
        <iframe class="branch-map-frame" title="${g.osm} — ${record.name}" src="${osmEmbedUrl(record)}" loading="lazy" referrerpolicy="no-referrer"></iframe></section>`;
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
    return `<div class="branches-detail-content"><p class="branches-detail-type">${record.isMain ? t.mainType : t.branchType}</p><h2 id="branches-detail-heading" lang="ru">${record.name}</h2>
      <dl class="branches-detail-list"><div><dt>${icon('pin')} ${t.address}</dt><dd lang="ru">${record.address}</dd></div><div><dt>${icon('phone')} ${t.phone}</dt><dd>${record.phone ? `<a href="${phoneUrl(record.phone)}">${record.phone}</a>` : t.noPhone}</dd></div></dl>
      <div class="branches-divider"></div>${mapPanel(record, t)}
      <div class="branches-divider"></div><h3>${t.route}</h3><p class="branches-route-note">${t.routeNote}</p>
      ${record.lat ? `<div class="branches-route-links"><a class="branches-route" href="${route2gisUrl(record)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${(geoText[t.lang] || geoText.ru).route2gis} <span class="branches-visually-hidden">(${t.newTab})</span></a><a class="branches-route branches-route-secondary" href="${routeGoogleUrl(record)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${(geoText[t.lang] || geoText.ru).routeGoogle} <span class="branches-visually-hidden">(${t.newTab})</span></a>` : `<div class="branches-route-links"><a class="branches-route" href="${mapUrl(record.address)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t.find2gis} <span class="branches-visually-hidden">(${t.newTab})</span></a><a class="branches-route branches-route-secondary" href="${googleMapUrl(record.address)}" target="_blank" rel="noopener noreferrer">${icon('external')} Google Maps <span class="branches-visually-hidden">(${t.newTab})</span></a>`}</div></div>`;
  }

  function renderBranches(container, params, language = 'ru') {
    const t = { ...(translations[language] || translations.ru), lang: language };
    const urlParams = params instanceof URLSearchParams ? params : new URLSearchParams();
    let selected = records.find(item => item.id === urlParams.get('id')) || records[0];
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
    const count = container.querySelector('.branches-count');
    const filterButtons = Array.from(container.querySelectorAll('[data-filter]'));
    queryInput.value = (urlParams.get('q') || '').slice(0, 150);

    function saveFilters() {
      const next = new URLSearchParams();
      if (selected) next.set('id', selected.id);
      if (queryInput.value.trim()) next.set('q', queryInput.value.trim());
      if (filter !== 'all') next.set('filter', filter);
      history.replaceState(null, '', '#/section/branches' + (next.size ? '?' + next.toString() : ''));
    }

    function update() {
      const q = normalize(queryInput.value);
      const filtered = records.filter(item => {
        const typeMatch = filter === 'all' || (filter === 'main' && item.isMain) || (filter === 'branch' && !item.isMain);
        return typeMatch && (!q || normalize(item.name + ' ' + item.address).includes(q));
      });
      if (filtered.some(item => item.distance !== undefined)) filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      if (!filtered.some(item => item.id === selected?.id)) selected = filtered[0] || null;
      count.textContent = filtered.length ? `${t.count}: ${filtered.length}` : t.noResults;
      list.innerHTML = filtered.length ? filtered.map(item => `<button type="button" class="branches-card${selected?.id === item.id ? ' is-selected' : ''}" data-branch="${item.id}" aria-pressed="${selected?.id === item.id}"><span class="branches-card-icon">${icon('archive')}</span><span class="branches-card-copy" lang="ru"><strong>${item.name}</strong><span>${item.address}</span>${item.phone ? `<span>${t.phone}: ${item.phone}</span>` : ''}${item.distance !== undefined ? `<span class="branches-distance">≈ ${item.distance.toFixed(1)} ${(geoText[t.lang] || geoText.ru).km}</span>` : ''}</span><span class="branches-card-arrow" aria-hidden="true">›</span></button>`).join('') : `<div class="branches-empty"><strong>${t.empty}</strong><p>${t.emptyHint}</p></div>`;
      if (renderedSelection !== selected) {
        detailContainer.innerHTML = detail(selected, t);
        renderedSelection = selected;
      }
      if (!selected) detailContainer.removeAttribute('aria-labelledby');
      else detailContainer.setAttribute('aria-labelledby', 'branches-detail-heading');
      saveFilters();
    }

    container.querySelector('.branches-search').addEventListener('submit', event => event.preventDefault());
    detailContainer.addEventListener('click', event => {
      const toggle = event.target.closest('[data-show-branch-map]');
      if (!toggle || !selected?.map) return;
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
      frame.title = `${t.yandex} — ${selected.name}`;
      frame.referrerPolicy = 'no-referrer';
      frame.allow = "geolocation 'none'";
      frame.src = selected.map.widget;
      view.replaceChildren(frame);
      view.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.textContent = t.hideMap;
      status.textContent = t.mapFallback;
      status.hidden = false;
    });
    queryInput.addEventListener('input', update);
    filterButtons.forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update();
    }));
    list.addEventListener('click', event => {
      const card = event.target.closest('[data-branch]');
      if (!card) return;
      selected = records.find(item => item.id === card.dataset.branch) || null;
      update();
      const newCard = list.querySelector(`[data-branch="${card.dataset.branch}"]`);
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
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const here = { lat: coords.latitude, lng: coords.longitude };
        records.forEach(item => { if (item.lat) item.distance = distanceKm(here, item); });
        selected = records.filter(item => item.distance !== undefined).sort((a, b) => a.distance - b.distance)[0] || selected;
        status.textContent = '';
        renderedSelection = null;
        update();
      }, () => { status.textContent = g.geoError; }, { timeout: 10000, maximumAge: 600000 });
    });
    const api = window.archiveApi;
    if (api) api.ready.then(async available => {
      if (!available) return;
      const { items } = await api.get('/branches');
      items.forEach(branch => {
        const record = records.find(item => item.id === branch.id);
        if (record && branch.lat !== null) Object.assign(record, { lat: Number(branch.lat), lng: Number(branch.lng), precision: branch.coords_precision });
      });
      nearest.hidden = false;
      renderedSelection = null;
      update();
    }).catch(() => {});
    update();
  }

  window.renderBranches = renderBranches;
}());
