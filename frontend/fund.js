/* A single demonstrative record from the 2018 source catalogue. */
(function () {
  'use strict';

  const source = 'https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/blob/main/datasets/structured_data/funds_2018.csv';
  const back = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const documentIcon = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M12 5h17l7 7v30H12V5Zm17 0v8h7M17 21h14M17 27h14M17 33h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const text = {
    ru: {
      home: 'Главная', catalogue: 'Электронный каталог', breadcrumbs: 'Навигационная цепочка',
      fund: 'Фонд Р-1 ч.с.', copyInfo: 'Сведения о цифровой копии',
      digitalCopy: 'Цифровая копия', noCopyInfo: 'Сведения о наличии копии не предоставлены.',
      beingVerified: 'Информация уточняется', askFund: 'Спросить архив о фонде',
      demo: 'Помощник работает в демонстрационном режиме.',
      archivalFund: 'Архивный фонд', exportDate: 'Выгрузка 2018 года',
      original: 'Историческое название и номер фонда приведены на языке источника — русском.',
      number: 'Номер фонда', copyNumber: 'Скопировать номер', dates: 'Крайние годы фонда',
      namePeriod: 'Период названия', inventoryCase: 'Опись и дело', noInfo: 'Сведения не предоставлены',
      access: 'Статус доступа', unconfirmed: 'Не подтверждён', copyUnconfirmed: 'Наличие не подтверждено',
      source: 'Источник записи',
      sourceNote: 'Строка перечня фондов из выгрузки 2018 года. Текущее состояние фонда и доступность материалов требуют проверки.',
      openSource: 'Открыть исходную таблицу на GitHub', ask: 'Спросить архив', back: 'Вернуться в каталог',
      question: 'Что известно о фонде Р-1 ч.с.?', copied: 'Номер скопирован',
      failed: 'Не удалось скопировать. Выделите номер вручную.'
    },
    kk: {
      home: 'Басты бет', catalogue: 'Электрондық каталог', breadcrumbs: 'Навигация жолы',
      fund: 'Р-1 ч.с. қоры', copyInfo: 'Цифрлық көшірме туралы мәліметтер',
      digitalCopy: 'Цифрлық көшірме', noCopyInfo: 'Көшірменің бар екені туралы мәлімет берілмеген.',
      beingVerified: 'Ақпарат нақтылануда', askFund: 'Қор туралы архивтен сұрау',
      demo: 'Көмекші демонстрациялық режимде жұмыс істейді.',
      archivalFund: 'Архивтік қор', exportDate: '2018 жылғы деректер',
      original: 'Қордың тарихи атауы мен нөмірі дереккөз тілінде — орыс тілінде берілген.',
      number: 'Қор нөмірі', copyNumber: 'Нөмірді көшіру', dates: 'Қор құжаттарының жылдары',
      namePeriod: 'Атаудың қолданылу кезеңі', inventoryCase: 'Тізімдеме және іс', noInfo: 'Мәлімет берілмеген',
      access: 'Қолжетімділік мәртебесі', unconfirmed: 'Расталмаған', copyUnconfirmed: 'Бар екені расталмаған',
      source: 'Жазбаның дереккөзі',
      sourceNote: '2018 жылғы қорлар тізімінен алынған жазба. Қордың қазіргі жағдайы мен материалдардың қолжетімділігін тексеру қажет.',
      openSource: 'GitHub-тағы бастапқы кестені ашу', ask: 'Архивтен сұрау', back: 'Каталогқа оралу',
      question: 'Р-1 ч.с. қоры туралы не белгілі?', copied: 'Нөмір көшірілді',
      failed: 'Көшіру мүмкін болмады. Нөмірді қолмен белгілеңіз.'
    },
    en: {
      home: 'Home', catalogue: 'Electronic catalogue', breadcrumbs: 'Breadcrumbs',
      fund: 'Fund Р-1 ч.с.', copyInfo: 'Digital copy information',
      digitalCopy: 'Digital copy', noCopyInfo: 'No information about a digital copy has been provided.',
      beingVerified: 'Information being verified', askFund: 'Ask the archive about this fund',
      demo: 'The assistant is running in demonstration mode.',
      archivalFund: 'Archival fund', exportDate: '2018 export',
      original: 'The historical title and fund number are shown in the source language, Russian.',
      number: 'Fund number', copyNumber: 'Copy number', dates: 'Dates of fund documents',
      namePeriod: 'Period of this name', inventoryCase: 'Inventory and case', noInfo: 'Information not provided',
      access: 'Access status', unconfirmed: 'Unconfirmed', copyUnconfirmed: 'Availability unconfirmed',
      source: 'Record source',
      sourceNote: 'A row from the 2018 fund list export. The current state of the fund and access to its materials require verification.',
      openSource: 'Open source table on GitHub', ask: 'Ask the archive', back: 'Back to catalogue',
      question: 'What is known about fund Р-1 ч.с.?', copied: 'Number copied',
      failed: 'Could not copy. Select the number manually.'
    }
  };

  window.renderFund = function renderFund(container, language = 'ru') {
    const t = text[language] || text.ru;
    const askUrl = '#/chat?question=' + encodeURIComponent(t.question);
    container.innerHTML = `<section class="fund-page" aria-labelledby="fund-title"><div class="fund-shell">
      <nav class="fund-breadcrumbs" aria-label="${t.breadcrumbs}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/catalog">${t.catalogue}</a><span aria-hidden="true">/</span><span aria-current="page">${t.fund}</span></nav>
      <div class="fund-grid"><div class="fund-left">
        <div class="fund-viewer" role="note" aria-label="${t.copyInfo}"><span class="fund-viewer-icon">${documentIcon}</span><h2>${t.digitalCopy}</h2><p>${t.noCopyInfo}</p><span class="fund-viewer-caption">${t.beingVerified}</span></div>
        <a class="fund-ask" href="${askUrl}"><span class="fund-ask-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 5h14v11H9l-4 3V5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>${t.askFund}</span><span class="fund-ask-arrow">${arrow}</span></a>
        <p class="fund-chat-note">${t.demo}</p>
      </div><article class="fund-details">
        <div class="fund-tags"><span>${t.archivalFund}</span><span>${t.exportDate}</span></div>
        <h1 id="fund-title" lang="ru">Усть-Каменогорский городской Совет рабочих, крестьянских и красноармейских депутатов</h1>
        <p class="fund-historical-name" lang="ru">г. Усть-Каменогорск Семипалатинского округа</p>
        <p class="fund-chat-note">${t.original}</p>
        <div class="fund-number"><span>${t.number}</span><strong lang="ru">Р-1 ч.с.</strong><button class="fund-copy" type="button">${t.copyNumber}</button><span class="fund-copy-status" role="status" aria-live="polite"></span></div>
        <dl class="fund-metadata"><div><dt>${t.dates}</dt><dd>1926–1993</dd></div><div><dt>${t.namePeriod}</dt><dd>[03]1926–19.02.1932</dd></div><div><dt>${t.inventoryCase}</dt><dd>${t.noInfo}</dd></div><div><dt>${t.access}</dt><dd>${t.unconfirmed}</dd></div><div><dt>${t.digitalCopy}</dt><dd>${t.copyUnconfirmed}</dd></div></dl>
        <div class="fund-source"><strong>${t.source}</strong><p>${t.sourceNote}</p><a href="${source}" target="_blank" rel="noopener noreferrer">${t.openSource} ${arrow}</a></div>
        <div class="fund-actions"><a class="fund-primary" href="${askUrl}">${t.ask} ${arrow}</a><a class="fund-secondary" href="#/catalog">${back} ${t.back}</a></div>
      </article></div>
    </div></section>`;
    container.querySelector('.fund-copy').addEventListener('click', async () => {
      const status = container.querySelector('.fund-copy-status');
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText('Р-1 ч.с.');
        status.textContent = t.copied;
      } catch {
        status.textContent = t.failed;
      }
    });
  };
})();
