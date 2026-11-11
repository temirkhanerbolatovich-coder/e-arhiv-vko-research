/* Archival reference as printed on page 42459 of the archive website. */
(function () {
  'use strict';

  const title = 'Статистические данные по мобилизации в Лениногорске';
  const reference = 'Ф. 261, оп. 1, д. 248, л. 1';
  const source = 'http://e-arhiv.vko.gov.kz/ru/Page/Index/42459';
  const routes = ['/ridder/fund/261', '/ridder/inventory/1', '/ridder/case/248', '/ridder/document/1'];
  const target = '#' + routes[3];
  const text = {
    ru: {
      levels: ['Фонд 261', 'Опись 1', 'Дело 248', 'Лист 1'],
      breadcrumbs: 'Навигационная цепочка', catalog: 'Каталог',
      archive: 'Государственный архив города Риддера · по публикации архива',
      original: 'Название и архивный шифр приведены на языке источника — русском.',
      copyReference: 'Скопировать шифр', copyLink: 'Скопировать ссылку',
      period: 'Период событий', publication: 'Сведения в публикации', asOf: 'По состоянию на 1995 год',
      digitalCopy: 'Цифровая копия', unconfirmed: 'Наличие не подтверждено',
      inSection: 'В этом разделе', source: 'Источник описания',
      sourceNote: 'Название карточки следует заголовку публикации. Архивный шифр приведён в её строке «Основание».',
      openSource: 'Открыть публикацию архива', referenceCopied: 'Шифр скопирован',
      linkCopied: 'Ссылка скопирована', manualCopy: 'Выделите и скопируйте вручную',
      kind: 'Документ · по архивной публикации', goToFund: 'Перейти к фонду 261'
    },
    kk: {
      levels: ['261-қор', '1-тізімдеме', '248-іс', '1-парақ'],
      breadcrumbs: 'Навигация жолы', catalog: 'Каталог',
      archive: 'Риддер қаласының мемлекеттік архиві · архив жарияланымы бойынша',
      original: 'Атауы мен архивтік шифры дереккөз тілінде — орыс тілінде берілген.',
      copyReference: 'Шифрды көшіру', copyLink: 'Сілтемені көшіру',
      period: 'Оқиғалар кезеңі', publication: 'Жарияланымдағы мәліметтер', asOf: '1995 жылғы мәліметтер',
      digitalCopy: 'Цифрлық көшірме', unconfirmed: 'Бар екені расталмаған',
      inSection: 'Осы бөлімде', source: 'Сипаттаманың дереккөзі',
      sourceNote: 'Карточканың атауы жарияланым тақырыбына сәйкес берілген. Архивтік шифр оның «Основание» жолында көрсетілген.',
      openSource: 'Архив жарияланымын ашу', referenceCopied: 'Шифр көшірілді',
      linkCopied: 'Сілтеме көшірілді', manualCopy: 'Мәтінді белгілеп, қолмен көшіріңіз',
      kind: 'Құжат · архив жарияланымы бойынша', goToFund: '261-қорға өту'
    },
    en: {
      levels: ['Fund 261', 'Inventory 1', 'Case 248', 'Leaf 1'],
      breadcrumbs: 'Breadcrumbs', catalog: 'Catalogue',
      archive: 'State Archive of Ridder · according to the archive publication',
      original: 'The title and archival reference are shown in the source language, Russian.',
      copyReference: 'Copy reference', copyLink: 'Copy link',
      period: 'Period of events', publication: 'Publication information', asOf: 'Information as of 1995',
      digitalCopy: 'Digital copy', unconfirmed: 'Availability unconfirmed',
      inSection: 'In this section', source: 'Description source',
      sourceNote: 'The record title follows the publication heading. The archival reference appears in its “Основание” source line.',
      openSource: 'Open archive publication', referenceCopied: 'Reference copied',
      linkCopied: 'Link copied', manualCopy: 'Select and copy manually',
      kind: 'Document · from an archive publication', goToFund: 'Go to fund 261'
    }
  };
  // These examples describe interface states, not the availability of this archival record.
  const previewText = {
    ru: { heading:'Просмотр документа', unknown:'Наличие цифровой копии этого документа не подтверждено.', examples:'Примеры состояний просмотрщика', note:'Это демонстрация интерфейса. Примеры ниже не описывают доступ к этому архивному документу.', available:'Копия доступна', absent:'Копия недоступна', restricted:'Доступ ограничен', error:'Ошибка загрузки', availableText:'Пример доступной копии: страница постановления из материалов заказчика. Она не относится к этой архивной записи.', absentText:'Пример: для материала нет опубликованной цифровой копии.', restrictedText:'Пример: доступ к копии ограничен. Сведения об условиях доступа следует уточнить в архиве.', errorText:'Пример: страницу не удалось загрузить. Повторите попытку позже.', open:'Открыть пример документа', retry:'Повторить пример', status:'Состояние примера', language:'Язык публикации', languageValue:'Русский; язык документа не подтверждён', storage:'Место хранения', storageValue:'Риддер · по публикации архива' },
    kk: { heading:'Құжатты қарау', unknown:'Осы құжаттың цифрлық көшірмесінің бар екені расталмаған.', examples:'Құжатты қарау күйлерінің мысалдары', note:'Бұл — интерфейстің көрсетілімі. Төмендегі мысалдар осы архив құжатына қолжетімділікті сипаттамайды.', available:'Көшірме қолжетімді', absent:'Көшірме қолжетімсіз', restricted:'Қолжетімділік шектелген', error:'Жүктеу қатесі', availableText:'Қолжетімді көшірме мысалы: тапсырыс беруші ұсынған қаулының бір беті. Ол осы архив жазбасына қатысы жоқ.', absentText:'Мысал: материалдың жарияланған цифрлық көшірмесі жоқ.', restrictedText:'Мысал: көшірмеге қолжетімділік шектелген. Шарттарды архивтен нақтылаңыз.', errorText:'Мысал: бетті жүктеу мүмкін болмады. Кейінірек қайталап көріңіз.', open:'Құжат мысалын ашу', retry:'Мысалды қайталау', status:'Мысал күйі', language:'Жарияланым тілі', languageValue:'Орысша; құжат тілі расталмаған', storage:'Сақтау орны', storageValue:'Риддер · архив жарияланымы бойынша' },
    en: { heading:'Document preview', unknown:'A digital copy of this document has not been confirmed.', examples:'Viewer state examples', note:'These interface examples do not describe access to this archival document.', available:'Copy available', absent:'Copy unavailable', restricted:'Restricted access', error:'Loading error', availableText:'Available copy example: a page of a resolution supplied by the customer. It is unrelated to this archival record.', absentText:'Example: no digital copy of this material has been published.', restrictedText:'Example: access to the copy is restricted. Ask the archive about access conditions.', errorText:'Example: the page could not be loaded. Try again later.', open:'Open example document', retry:'Retry example', status:'Example state', language:'Publication language', languageValue:'Russian; document language unconfirmed', storage:'Place of storage', storageValue:'Ridder · from the archive publication' }
  };
  const questions = {
    ru: 'Где найти данные о мобилизации в Лениногорске?',
    kk: 'Лениногорскідегі мобилизация туралы деректер қайда?',
    en: 'Where can I find mobilisation records for Leninogorsk?'
  };
  const answers = {
    ru: ['Архивная публикация приводит сведения о мобилизации в Лениногорске в 1939–1945 годах и указывает источник: ' + reference + '.', 'Открыть карточку документа', target],
    kk: ['Архив жарияланымында Лениногорскідегі 1939–1945 жылдардағы мобилизация туралы деректер берілген. Дереккөз: ' + reference + '.', 'Құжат карточкасын ашу', target],
    en: ['The archive publication covers mobilisation in Leninogorsk in 1939–1945 and cites fund 261, inventory 1, case 248, leaf 1.', 'Open the document record', target]
  };

  function normalize(value) {
    return value.toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/[.,–—-]/g, ' ').trim();
  }

  const terms = normalize([
    title, reference, 'фонд опись дело лист Риддер Лениногорск 1939 1945 1995',
    'қор тізімдеме іс парақ мобилизация деректер лениногорскідегі',
    'fund inventory case leaf ridder leninogorsk mobilisation mobilization records data'
  ].join(' '));

  function search(value) {
    return normalize(value).split(/\s+/).every(word => terms.includes(word));
  }

  function matches(value) {
    const mentionsTown = /лениногорск|leninogorsk/i.test(value);
    const mentionsMobilisation = /мобилиз|mobilis|mobiliz/i.test(value);
    const mentionsFund = /(?:^|[\s,(])(?:фонд|ф\.|fund|қор)\s*261\b|(?:^|[\s,(])261\s*[-–]?\s*қор/i.test(value);
    return (mentionsTown && mentionsMobilisation) || mentionsFund;
  }

  function render(container, path, language = 'ru') {
    const t = text[language] || text.ru;
    const index = routes.indexOf(path);
    const last = index === routes.length - 1;
    const preview = previewText[language] || previewText.ru;
    const crumbs = routes.slice(0, index).map((route, level) =>
      `<a href="#${route}">${t.levels[level]}</a><span aria-hidden="true">/</span>`
    ).join('');
    container.innerHTML = `<section class="fund-page"><div class="fund-shell">
      <nav class="fund-breadcrumbs" aria-label="${t.breadcrumbs}"><a href="#/catalog">${t.catalog}</a><span aria-hidden="true">/</span>${crumbs}<span aria-current="page">${t.levels[index]}</span></nav>
      ${last ? `<div class="record-document-grid"><section class="record-viewer" aria-labelledby="record-viewer-heading"><h2 id="record-viewer-heading">${preview.heading}</h2><div class="record-viewer-empty"><span aria-hidden="true">▤</span><p>${preview.unknown}</p></div></section>` : ''}
      <article class="fund-details"><h1${last ? ' lang="ru"' : ''}>${last ? title : t.levels[index]}</h1>
      <p class="fund-historical-name">${t.archive}</p>
      <p class="fund-chat-note">${t.original}</p>
      ${last ? `<div class="fund-number"><strong lang="ru">${reference}</strong><button class="fund-copy" type="button" data-copy="reference">${t.copyReference}</button><button class="fund-copy" type="button" data-copy="link">${t.copyLink}</button><span class="fund-copy-status" role="status"></span></div>
      <dl class="fund-metadata"><div><dt>${t.period}</dt><dd>1939–1945</dd></div><div><dt>${t.publication}</dt><dd>${t.asOf}</dd></div><div><dt>${t.digitalCopy}</dt><dd>${t.unconfirmed}</dd></div><div><dt>${preview.language}</dt><dd>${preview.languageValue}</dd></div><div><dt>${preview.storage}</dt><dd>${preview.storageValue}</dd></div></dl>` : `<div class="fund-source"><h2>${t.inSection}</h2>${index === 2 ? '<p lang="ru">' + title + '</p>' : ''}<a href="#${routes[index + 1]}">${t.levels[index + 1]} →</a></div>`}
      <div class="fund-source"><strong>${t.source}</strong><p>${t.sourceNote}</p><a href="${source}" target="_blank" rel="noopener noreferrer">${t.openSource} ↗</a></div></article>${last ? `</div><details class="record-examples"><summary>${preview.examples}</summary><p>${preview.note}</p><div class="record-example-controls" role="group" aria-label="${preview.examples}">${['available','absent','restricted','error'].map((key, i) => `<button type="button" data-preview-state="${key}" aria-pressed="${i === 0}">${preview[key]}</button>`).join('')}</div><div class="record-example-output" role="status" aria-live="polite"></div></details>` : ''}</div></section>`;
    if (last) {
      const output = container.querySelector('.record-example-output');
      const buttons = container.querySelectorAll('[data-preview-state]');
      function showExample(state) {
        const message = preview[state + 'Text'];
        buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.previewState === state)));
        output.innerHTML = `<strong>${preview.status}: ${preview[state]}</strong><p>${message}</p>${state === 'available' ? `<img src="assets/docs/pricelist-ru-01.webp" alt="" width="420" loading="lazy"><a href="#/document?file=pricelist-ru&amp;page=1">${preview.open} →</a>` : ''}${state === 'error' ? `<button type="button" data-preview-retry>${preview.retry}</button>` : ''}`;
        output.querySelector('[data-preview-retry]')?.addEventListener('click', () => showExample('error'));
      }
      buttons.forEach(button => button.addEventListener('click', () => showExample(button.dataset.previewState)));
      showExample('available');
    }
    container.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
      const status = container.querySelector('.fund-copy-status');
      const value = button.dataset.copy === 'reference' ? reference : location.href;
      try {
        await navigator.clipboard.writeText(value);
        status.textContent = button.dataset.copy === 'reference' ? t.referenceCopied : t.linkCopied;
      } catch {
        status.textContent = t.manualCopy + ': ' + value;
      }
    }));
  }

  function cardMarkup(language = 'ru') {
    const t = text[language] || text.ru;
    return `<article class="catalog-result-card"><span class="catalog-kind">${t.kind}</span><p lang="ru">${reference}</p><h2 class="catalog-result-title"><a href="${target}" lang="ru">${title} →</a></h2><p>${t.original}</p><p>${t.period}: 1939–1945.</p><a class="catalog-source-link" href="#${routes[0]}">${t.goToFund} →</a></article>`;
  }

  window.ridderRecord = { routes, questions, answers, search, matches, render, cardMarkup, card: cardMarkup() };
}());
