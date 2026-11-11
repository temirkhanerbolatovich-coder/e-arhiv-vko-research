/* Главная: «Машина времени» (фото по десятилетиям) и ближайшие памятные даты. Данные — /api/v1/timeline и /calendar/upcoming;
   без сервера блоки не показываются, остальная главная работает как прежде. */
(function () {
  'use strict';
  const text = {
    ru: { timeTitle: 'Машина времени', timeLead: 'Выберите десятилетие — покажем фотографии из архива', photos: (n) => `${n} ${plural(n, ['фото', 'фото', 'фото'])}`, openAll: 'Все фотографии', datesTitle: 'Памятные даты', datesLead: 'Ближайшие события из календаря архива', today: 'сегодня', tomorrow: 'завтра', inDays: (n) => `через ${n} ${plural(n, ['день', 'дня', 'дней'])}`, allDates: 'Весь календарь', ask: 'Спросить помощника', months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'], decade: (d) => `${d}-е` },
    kk: { timeTitle: 'Уақыт машинасы', timeLead: 'Онжылдықты таңдаңыз — архивтегі фотосуреттерді көрсетеміз', photos: (n) => `${n} фото`, openAll: 'Барлық фотосуреттер', datesTitle: 'Есте қаларлық күндер', datesLead: 'Архив күнтізбесіндегі жақын оқиғалар', today: 'бүгін', tomorrow: 'ертең', inDays: (n) => `${n} күннен кейін`, allDates: 'Толық күнтізбе', ask: 'Көмекшіден сұрау', months: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'], decade: (d) => `${d} жж.` },
    en: { timeTitle: 'Time machine', timeLead: 'Choose a decade to see photographs from the archive', photos: (n) => `${n} photos`, openAll: 'All photographs', datesTitle: 'Memorable dates', datesLead: 'Upcoming events from the archive calendar', today: 'today', tomorrow: 'tomorrow', inDays: (n) => `in ${n} days`, allDates: 'Full calendar', ask: 'Ask the assistant', months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], decade: (d) => `${d}s` },
  };
  function plural(n, forms) {
    const mod10 = n % 10, mod100 = n % 100;
    return forms[mod10 === 1 && mod100 !== 11 ? 0 : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 1 : 2];
  }

  function timeline(items, t, esc) {
    const cards = items.filter((item) => item.total > 0).map((item) => `<a class="time-card" href="#/catalog?type=photo&year-from=${item.decade}&year-to=${item.decade + 9}">
        <span class="time-card-image">${item.cover ? `<img src="${esc(item.cover.imageUrl)}" alt="" loading="lazy">` : `<span class="time-card-empty" aria-hidden="true">${String(item.decade).slice(2)}</span>`}</span>
        <span class="time-card-copy"><strong>${t.decade(item.decade)}</strong><small>${t.photos(item.total)}</small></span></a>`).join('');
    return `<section class="section-block home-timeline" aria-labelledby="time-title"><div class="section-title"><div><h2 id="time-title">${t.timeTitle}</h2><p class="section-lead">${t.timeLead}</p></div><a href="#/catalog?type=photo">${t.openAll} →</a></div><div class="time-grid">${cards}</div></section>`;
  }

  function dates(items, t, esc, language) {
    const when = (n) => (n === 0 ? t.today : n === 1 ? t.tomorrow : t.inDays(n));
    const ask = { ru: 'Расскажи о событии: ', kk: 'Оқиға туралы айтып беріңіз: ', en: 'Tell me about this event: ' }[language] || '';
    const cards = items.map((item) => `<li class="date-card">
        <span class="date-card-day"><strong>${item.day}</strong><span>${t.months[item.month]}</span></span>
        <span class="date-card-copy"><small>${when(item.inDays)}</small><span lang="ru">${esc(item.title)}</span><a href="#/chat?question=${encodeURIComponent(ask + item.title.slice(0, 180))}">${t.ask} →</a></span></li>`).join('');
    return `<section class="section-block home-dates" aria-labelledby="dates-title"><div class="section-title"><div><h2 id="dates-title">${t.datesTitle}</h2><p class="section-lead">${t.datesLead}</p></div><a href="#/calendar">${t.allDates} →</a></div><ol class="date-list">${cards}</ol></section>`;
  }

  window.renderHomeExtras = async function renderHomeExtras(root, language) {
    const api = window.archiveApi;
    if (!api || !(await api.ready)) return;
    const t = text[language] || text.ru;
    const anchor = root.querySelector('.section-tiles');
    if (!anchor) return;
    const [time, upcoming] = await Promise.all([api.get('/timeline').catch(() => null), api.get('/calendar/upcoming?limit=3').catch(() => null)]);
    if (!root.isConnected || !root.contains(anchor)) return; // пользователь уже ушёл с главной
    const html = (time?.items?.length ? timeline(time.items, t, api.escape) : '') + (upcoming?.items?.length ? dates(upcoming.items, t, api.escape, language) : '');
    anchor.insertAdjacentHTML('afterend', html);
  };
}());
