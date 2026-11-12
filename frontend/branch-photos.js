/* Local photo candidates: provenance is documented in BRANCH_PHOTO_REGISTER.md. */
(function () {
  'use strict';
  const photos = {
    main: {
      src: 'assets/archive-building-preview.jpg',
      source: 'https://yk-news.kz/news/v-ust-kamenogorske-gosudarstvennyy-arhiv-provodit-den-otkrytyh-dverey-64048',
      alt: { ru: 'Здание головного архива', kk: 'Бас архив ғимараты', en: 'Main archive building' },
      caption: { ru: 'Здание головного архива · фото из публикации YK-news', kk: 'Бас архив ғимараты · YK-news жарияланымындағы фото', en: 'Main archive building · photograph from YK-news' },
    },
    altay: {
      src: 'assets/archive-altay-exposition-preview.jpg',
      source: 'https://yandex.kz/maps/ru/org/shyghys_qazaqstan_oblysynyng_memlekettik_muraghaty_altay_filialy/244165745020/gallery/?lang=ru',
      alt: { ru: 'Стенд «Зыряновск: прошлое и настоящее»', kk: '«Зыряновск: өткені мен бүгінгісі» стенді', en: 'Display about Zyryanovsk’s past and present' },
      caption: { ru: 'Экспозиция внутри архива · галерея филиала Алтай в Яндекс Картах', kk: 'Архив ішіндегі экспозиция · Алтай филиалының Яндекс Карталардағы галереясы', en: 'Archive exhibition display · Altay branch gallery on Yandex Maps' },
    },
  };
  const copy = {
    ru: { missing:'Фотография подразделения пока не добавлена', failed:'Фотографию не удалось загрузить', hint:'Адрес и контакты доступны ниже.', source:'Источник фотографии', enlarge:'Открыть фотографию', candidate:'Фото для локального просмотра; размещение согласуется с архивом.' },
    kk: { missing:'Бөлімшенің фотосуреті әлі қосылмаған', failed:'Фотосуретті жүктеу мүмкін болмады', hint:'Мекенжай мен байланыс деректері төменде берілген.', source:'Фотосурет дереккөзі', enlarge:'Фотосуретті ашу', candidate:'Жергілікті қарауға арналған фото; жариялау архивпен келісіледі.' },
    en: { missing:'A photograph of this office has not been added yet', failed:'The photograph could not be loaded', hint:'The address and contacts are available below.', source:'Photo source', enlarge:'Open photograph', candidate:'Local preview photograph; publication is subject to archive approval.' },
  };
  const building = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 26 32 12l23 14M13 27h38v27H13zM8 55h48M20 32v15m12-15v15m12-15v15M9 27h46"/></svg>';
  function photoFor(record) {
    return record.originalBuilding !== false ? photos[record.id] : null;
  }
  function placeholder(language, failed = false) {
    const t = copy[language] || copy.ru;
    return `<div class="branches-photo-placeholder" data-photo-state="${failed ? 'error' : 'missing'}">${building}<strong>${failed ? t.failed : t.missing}</strong><span>${t.hint}</span></div>`;
  }
  function render(record, language, thumbnail = false) {
    const t = copy[language] || copy.ru;
    const photo = photoFor(record);
    const esc = window.archiveApi.escape;
    if (thumbnail) return `<span class="branches-card-photo" aria-hidden="true">${photo ? `<img src="${photo.src}" alt="" loading="lazy" data-branch-photo="thumbnail">` : building}</span>`;
    return `<figure class="branches-building" data-branch-photo-figure><div class="branches-photo-media">${photo ? `<a href="${photo.src}" target="_blank" rel="noopener" aria-label="${t.enlarge}"><img src="${photo.src}" alt="${esc(photo.alt[language] || photo.alt.ru)}" loading="lazy" data-branch-photo="detail"></a>` : placeholder(language)}</div>${photo ? `<figcaption><a href="${esc(photo.source)}" target="_blank" rel="noopener noreferrer">${esc(photo.caption[language] || photo.caption.ru)} ↗</a><span>${t.candidate}</span></figcaption>` : ''}</figure>`;
  }
  function bind(container, language) {
    container.querySelectorAll('img[data-branch-photo]').forEach(image => {
      const fallback = () => {
        if (!image.isConnected) return;
        const media = image.closest('.branches-photo-media');
        if (media) media.innerHTML = placeholder(language, true);
        else image.parentElement.innerHTML = building;
      };
      image.addEventListener('error', fallback, { once: true });
      if (image.complete && !image.naturalWidth) fallback();
    });
  }
  window.archiveBranchPhotos = { render, bind };
}());
