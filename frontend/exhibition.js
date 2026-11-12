/* Exhibition with captions from the archive's photo gallery. */
(function () {
  'use strict';
  const album = {
    title: 'Мой град Устькаменный',
    url: 'http://e-arhiv.vko.gov.kz/ru/SiteGallery/Album?albumId=36'
  };
  const cover = { photoId: 1793, image: 'assets/hero.jpg', title: 'Вид города с собора' };
  const items = [
    { id: 1, photoId: 1792, image: 'assets/history-flood.jpg', title: 'Центр города. Наводнение 10 марта 1929 года' },
    { id: 2, photoId: 1826, image: 'assets/history-street.jpg', title: 'Ул. Мира (ныне Головкова), 1967 г.' },
    { id: 3, photoId: 1798, image: 'assets/history-wharf.jpg', title: 'Нижняя пристань, 1930 г.' }
  ];
  const galleryAlbums = [
    { id: 36, title: album.title, count: 91, cover: 1793 },
    { id: 37, title: 'Усть-Каменогорск - ты город из мечты...', count: 48, cover: 1882 },
    { id: 47, title: 'Зыряновск и зыряновцы', count: 24, cover: 2419 },
    { id: 38, title: 'Герои Советского Союза Восточного Казахстана', count: 64, cover: 1927 },
    { id: 42, title: 'Герои Социалистического Труда восточноказахстанцы', count: 74, cover: 2176 },
    { id: 44, title: 'Почетные граждане города Усть-Каменогорска', count: 54, cover: 2376 },
  ];
  window.archiveExhibition = { album, items };
  const copy = {
    ru: {
      breadcrumb: 'Навигационная цепочка', home: 'Главная', exhibitions: 'Онлайн-выставки', title: 'История в фотографиях',
      intro: 'Усть-Каменогорск на фотографиях из коллекции Государственного архива ВКО.', backHome: 'На главную',
      notice: 'Подписи приведены на русском языке по фотогалерее архива. Права на использование снимков требуют подтверждения.',
      coverTitle: 'Взгляд на прошлое', coverCaption: 'Фото на обложке', start: 'Начать просмотр', items: 'Экспонаты подборки',
      item: 'Экспонат', of: 'из', view: 'Посмотреть', zoom: 'Увеличить', source: 'Источник фотографии',
      album: 'Альбом на сайте архива', record: 'Карточка в каталоге', newTab: 'откроется в новой вкладке',
      all: 'Все экспонаты', navigation: 'Навигация по экспонатам', previous: 'Предыдущий', next: 'Следующий',
      dialogTitle: 'Изображение экспоната', close: 'Закрыть увеличенное изображение',
      notFound: 'Экспонат не найден', notFoundText: 'Выберите фотографию из подборки.', back: 'К подборке',
      relatedTitle: 'История в документах', relatedText: 'Хронология, памятные даты, люди и места Восточного Казахстана.', relatedLink: 'Перейти к разделу'
    },
    kk: {
      breadcrumb: 'Навигация жолы', home: 'Басты бет', exhibitions: 'Онлайн көрмелер', title: 'Фотосуреттердегі тарих',
      intro: 'Өскемен ШҚО мемлекеттік архивінің жинағындағы фотосуреттерде.', backHome: 'Басты бетке',
      notice: 'Сурет сипаттамалары архив фотогалереясынан орыс тілінде берілген. Суреттерді пайдалану құқықтарын растау қажет.',
      coverTitle: 'Өткенге көзқарас', coverCaption: 'Мұқабадағы фотосурет', start: 'Қарауды бастау', items: 'Жинақ экспонаттары',
      item: 'Экспонат', of: '/', view: 'Қарау', zoom: 'Үлкейту', source: 'Фотосурет дереккөзі',
      album: 'Архив сайтындағы альбом', record: 'Каталогтағы карточка', newTab: 'жаңа қойындыда ашылады',
      all: 'Барлық экспонаттар', navigation: 'Экспонаттар арасында ауысу', previous: 'Алдыңғы', next: 'Келесі',
      dialogTitle: 'Экспонат суреті', close: 'Үлкейтілген суретті жабу',
      notFound: 'Экспонат табылмады', notFoundText: 'Жинақтан фотосурет таңдаңыз.', back: 'Жинаққа оралу',
      relatedTitle: 'Құжаттардағы тарих', relatedText: 'Шығыс Қазақстанның хронологиясы, атаулы күндері, тұлғалары мен орындары.', relatedLink: 'Бөлімге өту'
    },
    en: {
      breadcrumb: 'Breadcrumbs', home: 'Home', exhibitions: 'Online exhibitions', title: 'History in photographs',
      intro: 'Ust-Kamenogorsk in photographs from the East Kazakhstan State Archive collection.', backHome: 'Home',
      notice: 'Captions are shown in Russian as listed in the archive gallery. Rights to use the photographs require confirmation.',
      coverTitle: 'A look into the past', coverCaption: 'Cover photograph', start: 'Start viewing', items: 'Collection exhibits',
      item: 'Exhibit', of: 'of', view: 'View', zoom: 'Enlarge', source: 'Photograph source',
      album: 'Album on the archive website', record: 'Catalogue record', newTab: 'opens in a new tab',
      all: 'All exhibits', navigation: 'Exhibit navigation', previous: 'Previous', next: 'Next',
      dialogTitle: 'Exhibit image', close: 'Close enlarged image',
      notFound: 'Exhibit not found', notFoundText: 'Choose a photograph from the collection.', back: 'Back to collection',
      relatedTitle: 'History in documents', relatedText: 'Explore East Kazakhstan’s timeline, commemorative dates, people and places.', relatedLink: 'Open section'
    }
  };
  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const backArrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const zoomIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4M10.5 7.5v6m-3-3h6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function recordLink(photoId, t) {
    return `<a class="response-link exhibit-record-link" href="#/resource/photo-${photoId}" hidden>${t.record} <span aria-hidden="true">→</span></a>`;
  }

  const galleryCopy = {
    ru: {
      title: 'Выставки и фотоальбомы', intro: 'Тематические подборки и фотографии из коллекций Государственного архива ВКО.',
      exhibitions: 'Онлайн-выставка', albums: 'Фотоальбомы', visit: 'Смотреть выставку', photo: count => `${count} фото`,
      openAlbum: 'Открыть альбом', all: 'Вся фотогалерея на сайте архива',
      sources: 'Названия альбомов приведены по фотогалерее архива. Альбомы открываются на сайте источника.'
    },
    kk: {
      title: 'Көрмелер мен фотоальбомдар', intro: 'ШҚО мемлекеттік архиві жинақтарындағы тақырыптық топтамалар мен фотосуреттер.',
      exhibitions: 'Онлайн көрме', albums: 'Фотоальбомдар', visit: 'Көрмені қарау', photo: count => `${count} фото`,
      openAlbum: 'Альбомды ашу', all: 'Архив сайтындағы толық фотогалерея',
      sources: 'Альбом атаулары архив фотогалереясынан алынды. Альбомдар дереккөз сайтында ашылады.'
    },
    en: {
      title: 'Exhibitions and photo albums', intro: 'Themed collections and photographs from the East Kazakhstan State Archive.',
      exhibitions: 'Online exhibition', albums: 'Photo albums', visit: 'View exhibition', photo: count => `${count} photos`,
      openAlbum: 'Open album', all: 'Full gallery on the archive website',
      sources: 'Album titles follow the archive’s gallery. Albums open on the source website.'
    }
  };
  const galleryUrl = 'http://e-arhiv.vko.gov.kz/ru/SiteGallery';

  window.renderExhibitionDirectory = function renderExhibitionDirectory(container, language = 'ru') {
    const t = copy[language] || copy.ru;
    const g = galleryCopy[language] || galleryCopy.ru;
    container.innerHTML = `<section class="exhibit-page exhibit-directory" aria-labelledby="exhibition-directory-title"><div class="exhibit-shell">
      <nav class="exhibit-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${g.title}</span></nav>
      <header class="exhibit-heading"><div><h1 id="exhibition-directory-title">${g.title}</h1><p>${g.intro}</p></div></header>
      <section aria-labelledby="exhibit-featured-title">
        <h2 id="exhibit-featured-title">${g.exhibitions}</h2>
        <a class="exhibit-card exhibit-directory-feature" href="#/exhibition"><div class="exhibit-card-image"><img src="${cover.image}" alt=""></div><div class="exhibit-card-body"><h3>${t.title}</h3><p>${t.intro}</p><span class="exhibit-card-more">${g.visit} ${arrow}</span></div></a>
      </section>
      <section class="exhibit-directory-albums" aria-labelledby="exhibit-albums-title">
        <div class="exhibit-section-heading"><h2 id="exhibit-albums-title">${g.albums}</h2></div>
        <p class="exhibit-directory-note">${g.sources}</p>
        <div class="exhibit-grid">${galleryAlbums.map(item => `<a class="exhibit-card" href="${galleryUrl}/Album?albumId=${item.id}" target="_blank" rel="noopener noreferrer"><div class="exhibit-card-image"><img src="assets/photos/${item.cover}.jpg" alt="" loading="lazy"></div><div class="exhibit-card-body"><h3 lang="ru">${item.title}</h3><p>${g.photo(item.count)}</p><span class="exhibit-card-more">${g.openAlbum} <span aria-hidden="true">↗</span><span class="sr-only"> (${t.newTab})</span></span></div></a>`).join('')}</div>
        <p><a class="response-link" href="${galleryUrl}" target="_blank" rel="noopener noreferrer">${g.all} <span aria-hidden="true">↗</span><span class="sr-only"> (${t.newTab})</span></a></p>
      </section>
    </div></section>`;
  };

  function collectionCard(item,t) {
    return `<a class="exhibit-card" href="#/exhibition?item=${item.id}"><div class="exhibit-card-image"><img src="${item.image}" alt="" loading="lazy"></div><div class="exhibit-card-body"><h3 lang="ru">${item.title}</h3><span class="exhibit-card-more">${t.view} ${arrow}</span></div></a>`;
  }
  function collectionView(t) {
    return `<section class="exhibit-page" aria-labelledby="exhibition-heading"><div class="exhibit-shell">
      <nav class="exhibit-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/section/exhibitions">${t.exhibitions}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <div class="exhibit-heading"><div><h1 id="exhibition-heading">${t.title}</h1><p>${t.intro}</p></div><a class="exhibit-back" href="#/section/exhibitions">${backArrow} ${t.exhibitions}</a></div>
      <div class="exhibit-notice" role="note"><span class="exhibit-notice-icon" aria-hidden="true">i</span><p>${t.notice}</p></div>
      <figure class="exhibit-cover-figure"><div class="exhibit-cover"><img src="${cover.image}" alt=""><div class="exhibit-cover-copy"><h2>${t.coverTitle}</h2><a class="exhibit-cover-button" href="#/exhibition?item=1">${t.start} ${arrow}</a></div></div>
        <figcaption class="exhibit-cover-source"><span>${t.coverCaption} · <span lang="ru">${cover.title}</span></span>${recordLink(cover.photoId, t)}</figcaption>
      </figure>
      <div class="exhibit-section-heading"><h2>${t.items}</h2></div>
      <div class="exhibit-grid">${items.map(item=>collectionCard(item,t)).join('')}</div>
      <div class="exhibit-related"><div><h2>${t.relatedTitle}</h2><p>${t.relatedText}</p></div><a href="#/section/memory">${t.relatedLink} ${arrow}</a></div>
    </div></section>`;
  }
  function itemView(item,t) {
    const previous=items[item.id-2],next=items[item.id];
    return `<section class="exhibit-page exhibit-detail-page" aria-labelledby="exhibit-item-heading"><div class="exhibit-shell">
      <nav class="exhibit-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/exhibition">${t.exhibitions}</a><span aria-hidden="true">/</span><span aria-current="page">${t.item} ${item.id}</span></nav>
      <div class="exhibit-detail-grid"><figure class="exhibit-viewer"><img src="${item.image}" alt="${item.title}" lang="ru"><figcaption class="exhibit-viewer-footer"><div class="exhibit-object-caption"><span lang="ru">${album.title}</span></div><button type="button" class="exhibit-zoom" aria-haspopup="dialog">${zoomIcon} ${t.zoom}</button></figcaption></figure>
      <div class="exhibit-detail"><div class="exhibit-tags"><span>${t.item} ${item.id} ${t.of} ${items.length}</span></div><h1 id="exhibit-item-heading" lang="ru">${item.title}</h1>
        <div class="exhibit-source"><strong>${t.source}</strong><p lang="ru">${album.title}</p><div class="exhibit-source-links">${recordLink(item.photoId, t)}<a class="response-link" href="${album.url}" target="_blank" rel="noopener noreferrer">${t.album} <span aria-hidden="true">↗</span><span class="sr-only"> (${t.newTab})</span></a></div></div><a class="exhibit-secondary" href="#/exhibition">${backArrow} ${t.all}</a>
        <nav class="exhibit-pagination" aria-label="${t.navigation}">${previous?`<a class="exhibit-prev" href="#/exhibition?item=${previous.id}">${backArrow} ${t.previous}</a>`:`<span class="exhibit-prev exhibit-disabled" aria-disabled="true">${t.previous}</span>`}<span class="exhibit-position">${item.id} / ${items.length}</span>${next?`<a class="exhibit-next" href="#/exhibition?item=${next.id}">${t.next} ${arrow}</a>`:`<span class="exhibit-next exhibit-disabled" aria-disabled="true">${t.next}</span>`}</nav>
      </div></div>
      <dialog class="exhibit-dialog" aria-labelledby="exhibit-dialog-title"><div class="exhibit-dialog-header"><span id="exhibit-dialog-title">${t.dialogTitle} ${item.id}</span><button type="button" class="exhibit-dialog-close" aria-label="${t.close}">×</button></div><img src="${item.image}" alt="${item.title}" lang="ru"></dialog>
    </div></section>`;
  }
  window.renderExhibition = function renderExhibition(container,params,language='ru') {
    const t=copy[language]||copy.ru;
    const selected=params instanceof URLSearchParams?params.get('item'):null;
    const item=items.find(entry=>String(entry.id)===selected);
    if(selected&&!item){container.innerHTML=`<section class="exhibit-page"><div class="exhibit-shell"><h1>${t.notFound}</h1><p>${t.notFoundText}</p><a class="exhibit-secondary" href="#/exhibition">${backArrow} ${t.back}</a></div></section>`;return;}
    container.innerHTML=item?itemView(item,t):collectionView(t);
    const link = container.querySelector('.exhibit-record-link');
    window.archiveApi?.ready.then(available => {
      if (available && link?.isConnected) link.hidden = false;
    });
    if(!item)return;
    const dialog=container.querySelector('.exhibit-dialog');
    const openButton=container.querySelector('.exhibit-zoom');
    openButton.addEventListener('click',()=>dialog.showModal());
    container.querySelector('.exhibit-dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>openButton.focus());
  };
})();
