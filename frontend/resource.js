/* Карточка архивного материала из серверного каталога (ТЗ 5.3): шифр, поля, иерархия, копия, связанные материалы. */
(function () {
  'use strict';
  const text = {
    ru: { catalog: 'Каталог', loading: 'Загружаем карточку…', notFound: 'Карточка не найдена или не опубликована.', reference: 'Архивный шифр', copy: 'Копировать шифр', link: 'Копировать ссылку', copied: 'Скопировано', fields: { period: 'Дата или период', docType: 'Тип документа', language: 'Язык', sheets: 'Количество листов', place: 'Населённый пункт', author: 'Фондообразователь, автор', storage: 'Место хранения', access: 'Статус доступа', copy: 'Цифровая копия' }, access: { open: 'Открытый', metadata_only: 'Открыто только описание', restricted: 'Ограниченный доступ' }, copyStatus: { available: 'Есть, просмотр на сайте', none: 'Нет', unknown: 'Сведений нет', restricted: 'Доступ к копии ограничен' }, history: 'Историческая справка', description: 'Описание', names: 'Названия фондообразователя', children: 'Состав', childrenMore: 'Показаны первые 50 из', related: 'Смотрите также', source: 'Источник сведений', ask: 'Спросить помощника об этом материале', restrictedNote: 'Копия недоступна для просмотра на сайте. Условия доступа уточняйте в архиве: описание опубликовано, сам документ выдаётся по правилам читального зала.', demo: 'Демонстрационная запись: шифр условный, показывает работу карточки.', zoom: 'Увеличить', unknown: '—', unknownNote: 'Неизвестные поля не заполняются догадками.' },
    kk: { catalog: 'Каталог', loading: 'Карточка жүктелуде…', notFound: 'Карточка табылмады немесе жарияланбаған.', reference: 'Архивтік шифр', copy: 'Шифрды көшіру', link: 'Сілтемені көшіру', copied: 'Көшірілді', fields: { period: 'Күні немесе кезеңі', docType: 'Құжат түрі', language: 'Тілі', sheets: 'Парақ саны', place: 'Елді мекен', author: 'Қор құрушы, автор', storage: 'Сақталатын орны', access: 'Қолжетімділік', copy: 'Цифрлық көшірме' }, access: { open: 'Ашық', metadata_only: 'Тек сипаттамасы ашық', restricted: 'Шектеулі' }, copyStatus: { available: 'Бар, сайтта қарауға болады', none: 'Жоқ', unknown: 'Мәлімет жоқ', restricted: 'Көшірмеге қолжетімділік шектеулі' }, history: 'Тарихи анықтама', description: 'Сипаттама', names: 'Қор құрушының атаулары', children: 'Құрамы', childrenMore: 'Алғашқы 50 көрсетілді, барлығы', related: 'Байланысты материалдар', source: 'Мәлімет көзі', ask: 'Осы материал туралы көмекшіден сұрау', restrictedNote: 'Көшірме сайтта қолжетімсіз. Қолжетімділік шарттарын архивтен нақтылаңыз.', demo: 'Демонстрациялық жазба: шифр шартты.', zoom: 'Үлкейту', unknown: '—', unknownNote: 'Белгісіз өрістер болжаммен толтырылмайды.' },
    en: { catalog: 'Catalogue', loading: 'Loading record…', notFound: 'Record not found or not published.', reference: 'Archival reference', copy: 'Copy reference', link: 'Copy link', copied: 'Copied', fields: { period: 'Date or period', docType: 'Document type', language: 'Language', sheets: 'Sheets', place: 'Place', author: 'Creator, author', storage: 'Storage location', access: 'Access status', copy: 'Digital copy' }, access: { open: 'Open', metadata_only: 'Description only', restricted: 'Restricted access' }, copyStatus: { available: 'Available on the site', none: 'None', unknown: 'No information', restricted: 'Copy access restricted' }, history: 'Historical note', description: 'Description', names: 'Names of the creator', children: 'Contents', childrenMore: 'First 50 shown of', related: 'See also', source: 'Source of information', ask: 'Ask the assistant about this record', restrictedNote: 'The copy is not available on the site. Ask the archive about access conditions.', demo: 'Demonstration record: the reference is illustrative.', zoom: 'Zoom', unknown: '—', unknownNote: 'Unknown fields are not filled with guesses.' },
  };
  const kindLabel = { ru: { fund: 'Фонд', inventory: 'Опись', case: 'Дело', document: 'Документ', photo: 'Фотодокумент', newspaper: 'Газета', page: 'Страница сайта', news: 'Новость', event: 'Памятная дата' }, kk: { fund: 'Қор', inventory: 'Тізімдеме', case: 'Іс', document: 'Құжат', photo: 'Фотоқұжат', newspaper: 'Газет', page: 'Сайт беті', news: 'Жаңалық', event: 'Есте қаларлық күн' }, en: { fund: 'Fund', inventory: 'Inventory', case: 'Case', document: 'Document', photo: 'Photograph', newspaper: 'Newspaper', page: 'Site page', news: 'News', event: 'Memorable date' } };

  window.renderResource = async function renderResource(container, id, language) {
    const t = text[language] || text.ru;
    const kinds = kindLabel[language] || kindLabel.ru;
    const api = window.archiveApi;
    const esc = api.escape;
    container.innerHTML = `<section class="fund-page"><div class="fund-shell"><p role="status">${t.loading}</p></div></section>`;
    const available = await api.ready;
    let data;
    try {
      if (!available) throw new Error('offline');
      data = await api.get('/resources/' + encodeURIComponent(id));
    } catch {
      container.innerHTML = `<section class="fund-page"><div class="fund-shell"><h1>${t.notFound}</h1><a class="response-link" href="#/catalog">${t.catalog} →</a></div></section>`;
      return;
    }
    const r = data.resource;
    document.title = r.title.slice(0, 80) + ' — Госархив ВКО';
    const crumbs = [`<a href="#/catalog">${t.catalog}</a>`, ...r.parents.map((p) => `<a href="#/resource/${encodeURIComponent(p.id)}">${esc(p.reference || kinds[p.kind] || p.title)}</a>`)].join('<span aria-hidden="true">/</span>');
    const value = (v) => (v === null || v === undefined || v === '' ? `<span class="resource-unknown">${t.unknown}</span>` : esc(v));
    const fields = [
      [t.fields.period, r.period], [t.fields.docType, r.docType], [t.fields.language, r.language === 'ru' ? 'Русский' : r.language === 'kk' ? 'Қазақша' : r.language],
      [t.fields.sheets, r.sheets], [t.fields.place, r.place], [t.fields.author, r.kind === 'fund' ? null : r.authorOrg],
      [t.fields.storage, r.storage.name ? `${r.storage.name}${r.storage.address ? ', ' + r.storage.address : ''}` : null],
      [t.fields.access, t.access[r.access] || r.access], [t.fields.copy, t.copyStatus[r.copyStatus] || r.copyStatus],
    ];
    const viewer = r.imageUrl
      ? `<figure class="resource-viewer"><button type="button" class="resource-zoom" aria-pressed="false" aria-label="${t.zoom}"><img src="${esc(r.imageUrl)}" alt="${esc(r.title)}"></button><figcaption>${t.zoom}: нажмите на изображение</figcaption></figure>`
      : (r.copyStatus === 'restricted' || r.access === 'restricted' ? `<div class="resource-restricted" role="note"><strong>${t.access.restricted}.</strong> ${t.restrictedNote}</div>` : '');
    container.innerHTML = `<section class="fund-page"><div class="fund-shell resource-shell">
      <nav class="fund-breadcrumbs" aria-label="breadcrumbs">${crumbs}<span aria-hidden="true">/</span><span aria-current="page">${esc(kinds[r.kind] || r.kind)}</span></nav>
      <article class="fund-details">
        <p class="fund-historical-name">${esc(kinds[r.kind] || r.kind)}${r.isDemo ? ' · ' + t.demo : ''}</p>
        <h1 lang="ru">${esc(r.title)}</h1>
        ${r.reference ? `<div class="fund-number"><span class="resource-label">${t.reference}</span><strong lang="ru">${esc(r.reference)}</strong><button class="fund-copy" type="button" data-copy="reference">${t.copy}</button><button class="fund-copy" type="button" data-copy="link">${t.link}</button><span class="fund-copy-status" role="status"></span></div>` : `<div class="fund-number"><button class="fund-copy" type="button" data-copy="link">${t.link}</button><span class="fund-copy-status" role="status"></span></div>`}
        ${viewer}
        <dl class="fund-metadata">${fields.map(([label, v]) => `<div><dt>${label}</dt><dd>${value(v)}</dd></div>`).join('')}</dl>
        <p class="resource-note">${t.unknownNote}</p>
        ${r.description ? `<h2>${t.description}</h2><p class="resource-text" lang="ru">${esc(r.description).slice(0, 4000).replace(/\n/g, '<br>')}</p>` : ''}
        ${r.historyNote ? `<h2>${t.history}</h2><p lang="ru">${esc(r.historyNote)}</p>` : ''}
        ${r.names.length > 1 ? `<h2>${t.names}</h2><ol class="resource-names">${r.names.map((n) => `<li lang="ru">${esc(n.name)}${n.period ? ` <span class="resource-period">${esc(n.period)}</span>` : ''}</li>`).join('')}</ol>` : ''}
        ${r.children.length ? `<h2>${t.children}</h2><ul class="resource-children">${r.children.map((c) => `<li><a href="#/resource/${encodeURIComponent(c.id)}">${esc(c.reference || c.title)}</a> <span lang="ru">${esc(c.reference ? c.title : '')}</span></li>`).join('')}</ul>${r.childrenTotal > r.children.length ? `<p class="resource-note">${t.childrenMore} ${r.childrenTotal}</p>` : ''}` : ''}
        <h2>${t.source}</h2><p>${esc(r.source.label || t.unknown)}${r.source.url && /^https?:/.test(r.source.url) ? ` — <a href="${esc(r.source.url)}" target="_blank" rel="noopener noreferrer">${esc(r.source.url.replace(/^https?:\/\//, '').slice(0, 60))} ↗</a>` : ''}</p>
        <p><a class="response-link" href="#/chat?question=${encodeURIComponent((language === 'kk' ? 'Осы материал туралы айтып беріңіз: ' : language === 'en' ? 'Tell me about this record: ' : 'Расскажи об этом материале: ') + (r.reference ? r.reference + ' ' : '') + r.title.slice(0, 160))}">${t.ask} →</a></p>
      </article>
      ${data.related.length ? `<section class="resource-related"><h2>${t.related}</h2><div class="resource-related-grid">${data.related.map((item) => `<a class="resource-related-card" href="#/resource/${encodeURIComponent(item.id)}">${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="" loading="lazy">` : ''}<small>${esc(kinds[item.kind] || item.kind)}${item.period ? ' · ' + esc(item.period) : ''}</small><strong lang="ru">${esc(item.title.slice(0, 140))}</strong></a>`).join('')}</div></section>` : ''}
    </div></section>`;
    const status = container.querySelector('.fund-copy-status');
    container.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy === 'reference' ? r.reference : location.href);
        status.textContent = t.copied;
      } catch { status.textContent = ''; }
    }));
    const zoom = container.querySelector('.resource-zoom');
    if (zoom) zoom.addEventListener('click', () => {
      const pressed = zoom.getAttribute('aria-pressed') === 'true';
      zoom.setAttribute('aria-pressed', String(!pressed));
      zoom.classList.toggle('is-zoomed', !pressed);
    });
  };
}());
