/* Selected entries from the customer's 2026 anniversary calendar, not a complete calendar. */
(function () {
  'use strict';

  const calendarYear = 2026;
  const events = [
    {
      month: 1, day: 8, year: '1896–1971',
      // The Kazakh calendar gives 1917. The regional library confirms the Russian edition's 1971.
      source: 'https://esimder.pushkinlibrary.kz/ru/pisateli-i-poety/784-.html',
      ru: ['Ефим Николаевич Пермитин', '130 лет со дня рождения писателя, уроженца Восточного Казахстана.'],
      kk: ['Ефим Николаевич Пермитин', 'Шығыс Қазақстанның тумасы, жазушы Пермитиннің туғанына 130 жыл.'],
      en: ['Yefim Nikolayevich Permitin', '130 years since the birth of the writer, a native of East Kazakhstan.']
    },
    {
      month: 1, day: 17, year: '1941',
      ru: ['Преобразование Зыряновска в город', '85 лет со дня преобразования посёлка Зыряновск в город.'],
      kk: ['Зыряновскінің қала мәртебесін алуы', 'Зыряновск кентінің қала мәртебесін алғанына 85 жыл.'],
      en: ['Zyryanovsk gains town status', '85 years since the settlement of Zyryanovsk gained town status.']
    },
    {
      month: 2, day: 6, year: '1941',
      ru: ['Переименование Риддера', '85 лет со дня переименования Риддера в Лениногорск.'],
      kk: ['Риддер атауының өзгеруі', 'Риддердің Лениногорск болып өзгертілгеніне 85 жыл.'],
      en: ['Ridder is renamed', '85 years since Ridder was renamed Leninogorsk.']
    },
    {
      month: 3, day: 20, year: '1896',
      ru: ['Областная библиотека имени А. С. Пушкина', '130 лет со дня образования Восточно-Казахстанской областной библиотеки имени А. С. Пушкина.'],
      kk: ['А. С. Пушкин атындағы облыстық кітапхана', 'А. С. Пушкин атындағы Шығыс Қазақстан облыстық кітапханасының құрылғанына 130 жыл.'],
      en: ['A. S. Pushkin Regional Library', '130 years since the East Kazakhstan Regional Library named after A. S. Pushkin was established.']
    },
    {
      month: 4, day: 12, year: '1901–1989',
      ru: ['Семён Николаевич Герасимов', '125 лет со дня рождения краеведа, учёного и писателя.'],
      kk: ['Семен Николаевич Герасимов', 'Өлкетанушы, ғалым және жазушының туғанына 125 жыл.'],
      en: ['Semyon Nikolayevich Gerasimov', '125 years since the birth of the local historian, scholar and writer.']
    },
    {
      month: 5, year: '1786',
      ru: ['Основание города Риддера', '240 лет со дня основания города Риддера.'],
      kk: ['Риддер қаласының негізі қаланды', 'Риддер қаласының негізі қаланғанына 240 жыл.'],
      en: ['Ridder is founded', '240 years since the founding of Ridder.']
    },
    {
      month: 6, day: 14, year: '1891–1977',
      ru: ['Александр Мелентьевич Волков', '135 лет со дня рождения учёного и детского писателя.'],
      kk: ['Александр Мелентьевич Волков', 'Ғалым және балалар жазушысының туғанына 135 жыл.'],
      en: ['Alexander Melentyevich Volkov', '135 years since the birth of the scholar and children’s author.']
    },
    {
      month: 7, day: 1, year: '1961',
      ru: ['Музей в Риддере', '65 лет со дня образования историко-краеведческого музея в городе Риддере.'],
      kk: ['Риддердегі музей', 'Риддер тарихи-өлкетану музейінің құрылғанына 65 жыл.'],
      en: ['Museum in Ridder', '65 years since the founding of the Museum of Local History in Ridder.']
    },
    {
      month: 8, day: 29, year: '1991',
      ru: ['Закрытие Семипалатинского полигона', '35 лет со дня закрытия Семипалатинского ядерного полигона.'],
      kk: ['Семей полигонының жабылуы', 'Семей ядролық полигонының жабылғанына 35 жыл.'],
      en: ['Closure of the Semipalatinsk test site', '35 years since the closure of the Semipalatinsk nuclear test site.']
    },
    {
      month: 9, day: 26, year: '1841–1913',
      ru: ['Евгений Петрович Михаэлис', '185 лет со дня рождения политического ссыльного, учёного, краеведа, друга Абая.'],
      kk: ['Евгений Петрович Михаэлис', 'Саяси жер аударылған ғалым, өлкетанушы және Абайдың досы Михаэлистің туғанына 185 жыл.'],
      en: ['Yevgeny Petrovich Mikhaelis', '185 years since the birth of the political exile, scholar, local historian and friend of Abai.']
    },
    {
      month: 10, day: 23, year: '1961',
      ru: ['Преобразование Шемонаихи в город', '65 лет со дня преобразования посёлка Шемонаиха в город.'],
      kk: ['Шемонаиханың қала мәртебесін алуы', 'Шемонаиха кентінің қала мәртебесін алғанына 65 жыл.'],
      en: ['Shemonaikha gains town status', '65 years since the settlement of Shemonaikha gained town status.']
    },
    {
      month: 11, year: '1931',
      ru: ['Риддерская газета «Жумышы»', '95 лет со дня образования газеты.'],
      kk: ['Риддердің «Жұмысшы» газеті', 'Газеттің құрылғанына 95 жыл.'],
      en: ['Ridder’s “Zhumyshy” newspaper', '95 years since the newspaper was founded.']
    },
    {
      month: 12, day: 16, year: '1991',
      ru: ['Независимость Казахстана', '35 лет со дня обретения Казахстаном независимости.'],
      kk: ['Қазақстанның тәуелсіздігі', 'Қазақстан Республикасының тәуелсіздігіне 35 жыл.'],
      en: ['Independence of Kazakhstan', '35 years since Kazakhstan gained independence.']
    },
    {
      month: 0, year: '1761',
      ru: ['Основание Бухтарминской крепости', '265 лет со дня основания Бухтарминской крепости.'],
      kk: ['Бұқтырма бекетінің негізі қаланды', 'Бұқтырма бекетінің негізі қаланғанына 265 жыл.'],
      en: ['Founding of the Bukhtarma fortress', '265 years since the founding of the Bukhtarma fortress.']
    }
  ];

  const copy = {
    ru: {months:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],breadcrumb:'Навигационная цепочка',home:'Главная',memory:'Архив памяти',short:'Памятные даты',eyebrow:'ИСТОРИЯ ВОСТОЧНОГО КАЗАХСТАНА',title:'Календарь памятных дат',intro:'События и люди из календаря юбилейных и памятных дат заказчика.',notice:'Выборка из календаря на 2026 год. Указанные годовщины относятся к 2026 году; год события приведён отдельно. Сведения и права на публикацию необходимо подтвердить.',search:'Поиск по выборке',placeholder:'Имя, место или событие',month:'Месяц',all:'Все даты',unknown:'Дата не указана',reset:'Сбросить',tag:'Календарь 2026 года',year:'Год или годы в источнике:',status:'Записей в выборке:',outOf:'из',empty:'Ничего не найдено',emptyText:'Попробуйте другое слово или выберите все даты.',sourceLabel:'ИСТОЧНИК',sourceTitle:'Календарь заказчика',sourceText:'Подборка показывает только часть календаря на 2026 год.',back:'Вернуться в архив памяти'},
    kk: {months:['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'],breadcrumb:'Навигация жолы',home:'Басты бет',memory:'Архив жады',short:'Атаулы күндер',eyebrow:'ШЫҒЫС ҚАЗАҚСТАН ТАРИХЫ',title:'Атаулы күндер күнтізбесі',intro:'Тапсырыс берушінің мерейтойлар мен атаулы күндер күнтізбесіндегі оқиғалар мен тұлғалар.',notice:'2026 жылғы күнтізбеден үзінді. Көрсетілген мерейтойлар 2026 жылға қатысты; оқиға жылы бөлек берілген. Мәліметтер мен жариялау құқықтарын растау қажет.',search:'Жазбалардан іздеу',placeholder:'Аты, жері немесе оқиға',month:'Ай',all:'Барлық күндер',unknown:'Күні көрсетілмеген',reset:'Тазалау',tag:'2026 жылғы күнтізбе',year:'Дереккөздегі жыл немесе жылдар:',status:'Жазбалар саны:',outOf:'/',empty:'Ештеңе табылмады',emptyText:'Басқа сөз енгізіңіз немесе барлық күндерді таңдаңыз.',sourceLabel:'ДЕРЕККӨЗ',sourceTitle:'Тапсырыс берушінің күнтізбесі',sourceText:'Жинақта 2026 жылғы күнтізбенің бір бөлігі ғана көрсетілген.',back:'Архив жадына оралу'},
    en: {months:['January','February','March','April','May','June','July','August','September','October','November','December'],breadcrumb:'Breadcrumbs',home:'Home',memory:'Memory archive',short:'Commemorative dates',eyebrow:'HISTORY OF EAST KAZAKHSTAN',title:'Calendar of commemorative dates',intro:'Events and people from the customer-provided calendar of anniversaries and commemorative dates.',notice:'A selection from the 2026 calendar. Anniversaries refer to 2026; the event year is shown separately. Information and publication rights require confirmation.',search:'Search this selection',placeholder:'Name, place or event',month:'Month',all:'All dates',unknown:'Date not specified',reset:'Reset',tag:'2026 calendar',year:'Year or years in the source:',status:'Entries in this selection:',outOf:'of',empty:'No results',emptyText:'Try another word or select all dates.',sourceLabel:'SOURCE',sourceTitle:'Customer calendar',sourceText:'The selection shows only part of the 2026 calendar.',back:'Back to memory archive'}
  };

  const dateLabels = {
    ru: { noDay: 'день не указан', source: 'Даты жизни в справочнике библиотеки имени А. С. Пушкина' },
    kk: { noDay: 'күні көрсетілмеген', source: 'А. С. Пушкин атындағы кітапхана анықтамалығындағы өмір сүрген жылдары' },
    en: { noDay: 'day unspecified', source: 'Life dates in the A. S. Pushkin Library directory' }
  };

  function card(event, t, labels, formatter) {
    let date = t.unknown;
    if (event.day) {
      const timestamp = new Date(Date.UTC(calendarYear, event.month - 1, event.day));
      date = `<time datetime="${timestamp.toISOString().slice(0, 10)}">${formatter.format(timestamp)}</time>`;
    } else if (event.month) {
      date = `${t.months[event.month - 1]} · ${labels.noDay}`;
    }
    return `<article class="calendar-event"><div class="calendar-event-date">${date}</div><div class="calendar-event-body">
      <span class="calendar-event-tag">${t.tag}</span><h2>${event.title}</h2><p>${event.description}</p>
      <p class="calendar-event-year">${t.year} ${event.year}</p>
      ${event.source ? `<a href="${event.source}">${labels.source}</a>` : ''}
    </div></article>`;
  }

  window.renderCalendar = function renderCalendar(container, language = 'ru') {
    const locale = Object.hasOwn(copy, language) ? language : 'ru';
    const t = copy[locale];
    const labels = dateLabels[locale];
    const formatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
      month: 'long', day: 'numeric', timeZone: 'UTC'
    });
    const normalize = value => value.trim().toLowerCase().replaceAll('ё', 'е');
    const localizedEvents = events.map(event => {
      const [title, description] = event[locale];
      const search = normalize([...event.ru, ...event.kk, ...event.en, event.year].join(' '));
      return { ...event, title, description, search };
    });
    const previousQuery = container.querySelector('#calendar-query')?.value || '';
    const previousMonth = container.querySelector('#calendar-month')?.value || 'all';
    container.innerHTML = `<section class="calendar-page" aria-labelledby="calendar-title"><div class="calendar-shell">
      <nav class="calendar-breadcrumbs" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><a href="#/memory">${t.memory}</a><span aria-hidden="true">/</span><span aria-current="page">${t.short}</span></nav>
      <div class="calendar-heading"><p class="calendar-eyebrow">${t.eyebrow}</p><h1 id="calendar-title">${t.title}</h1><p>${t.intro}</p></div>
      <div class="calendar-notice" role="note">${t.notice}</div>
      <form class="calendar-filters" role="search"><label>${t.search}<input id="calendar-query" type="search" maxlength="150" placeholder="${t.placeholder}" autocomplete="off"></label><label>${t.month}<select id="calendar-month"><option value="all">${t.all}</option>${t.months.map((month, index) => `<option value="${index + 1}">${month}</option>`).join('')}<option value="0">${t.unknown}</option></select></label><button class="calendar-reset" type="reset">${t.reset}</button></form>
      <p class="calendar-status" role="status" aria-live="polite"></p><div class="calendar-events"></div>
      <div class="calendar-source"><div><p class="calendar-eyebrow">${t.sourceLabel}</p><h2>${t.sourceTitle}</h2><p>${t.sourceText}</p></div></div>
      <a class="calendar-back" href="#/memory">← ${t.back}</a>
    </div></section>`;
    const query = container.querySelector('#calendar-query');
    const month = container.querySelector('#calendar-month');
    const list = container.querySelector('.calendar-events');
    const status = container.querySelector('.calendar-status');
    query.value = previousQuery;
    month.value = previousMonth;
    function renderResults() {
      const term = normalize(query.value);
      const matches = localizedEvents.filter(event => (month.value === 'all' || String(event.month) === month.value) && event.search.includes(term));
      status.textContent = `${t.status} ${matches.length} ${t.outOf} ${events.length}`;
      list.innerHTML = matches.length ? matches.map(event => card(event, t, labels, formatter)).join('') : `<div class="calendar-empty"><h2>${t.empty}</h2><p>${t.emptyText}</p></div>`;
    }
    query.addEventListener('input', renderResults);
    month.addEventListener('change', renderResults);
    container.querySelector('.calendar-filters').addEventListener('submit', event => event.preventDefault());
    container.querySelector('.calendar-filters').addEventListener('reset', () => { setTimeout(renderResults, 0); });
    renderResults();
  };
}());
