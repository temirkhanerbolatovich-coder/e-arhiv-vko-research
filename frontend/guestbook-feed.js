/* Public guestbook presentation. There is no public feed endpoint in the current API. */
(function () {
  'use strict';
  const copy = {
    ru: {
      title: 'Сообщения посетителей', intro: 'Отзывы, предложения и пожелания, прошедшие проверку сотрудником архива.',
      unavailable: 'Публичная лента пока недоступна.', unavailableHint: 'Оставить сообщение сотрудникам можно через форму ниже.',
      loading: 'Загружаем сообщения…', error: 'Не удалось загрузить сообщения.', retry: 'Повторить загрузку',
      empty: 'Опубликованных сообщений пока нет.', emptyHint: 'После модерации здесь появятся сообщения посетителей.',
      filteredEmpty: 'Сообщений этой категории пока нет.', all: 'Все сообщения', review: 'Отзывы', suggestion: 'Предложения', wish: 'Пожелания', errorKind: 'Сообщения об ошибках',
      filter: 'Категория сообщений', count: 'Найдено сообщений', page: 'Страница', previous: 'Назад', next: 'Дальше',
      preview: 'Образец оформления', previewHint: 'Ниже показаны условные примеры. Это не отзывы посетителей и не ответы сотрудников.',
      example: 'Пример сообщения', author: 'Посетитель', reply: 'Ответ архива', replyExample: 'Пример ответа архива',
      sampleAuthor: 'Имя для публикации', sampleMessage: 'Так будет выглядеть опубликованное сообщение посетителя. Здесь можно прочитать отзыв, предложение или пожелание.',
      sampleLong: 'Длинное сообщение отображается полностью, с сохранением абзацев. Текст переносится на узком экране, а категория помогает найти нужные сообщения.\n\nЭто пример содержания для проверки оформления гостевой книги.',
      sampleReply: 'Здесь будет опубликован ответ сотрудника архива. Он отображается отдельно от сообщения посетителя.',
    },
    kk: {
      title: 'Келушілер хабарламалары', intro: 'Архив қызметкері тексерген пікірлер, ұсыныстар мен тілектер.',
      unavailable: 'Хабарламалардың ашық тізімі әзірге қолжетімсіз.', unavailableHint: 'Төмендегі нысан арқылы қызметкерлерге хабарлама қалдыра аласыз.',
      loading: 'Хабарламалар жүктелуде…', error: 'Хабарламаларды жүктеу мүмкін болмады.', retry: 'Қайта жүктеу',
      empty: 'Әзірге жарияланған хабарламалар жоқ.', emptyHint: 'Модерациядан кейін мұнда келушілердің хабарламалары пайда болады.',
      filteredEmpty: 'Бұл санатта әзірге хабарламалар жоқ.', all: 'Барлық хабарламалар', review: 'Пікірлер', suggestion: 'Ұсыныстар', wish: 'Тілектер', errorKind: 'Қате туралы хабарламалар',
      filter: 'Хабарлама санаты', count: 'Табылған хабарламалар', page: 'Бет', previous: 'Артқа', next: 'Алға',
      preview: 'Безендіру үлгісі', previewHint: 'Төменде шартты мысалдар көрсетілген. Бұл келушілердің пікірлері немесе қызметкерлердің жауаптары емес.',
      example: 'Хабарлама үлгісі', author: 'Келуші', reply: 'Архив жауабы', replyExample: 'Архив жауабының үлгісі',
      sampleAuthor: 'Жариялауға арналған есім', sampleMessage: 'Келушінің жарияланған хабарламасы осылай көрінеді. Мұнда пікірді, ұсынысты немесе тілекті оқуға болады.',
      sampleLong: 'Ұзын хабарлама абзацтары сақталып, толық көрсетіледі. Мәтін тар экранда тасымалданады, ал санат қажетті хабарламаны табуға көмектеседі.\n\nБұл қонақ кітабының безендірілуін тексеруге арналған мәтін үлгісі.',
      sampleReply: 'Мұнда архив қызметкерінің жауабы жарияланады. Ол келушінің хабарламасынан бөлек көрсетіледі.',
    },
    en: {
      title: 'Visitor messages', intro: 'Feedback, suggestions and wishes reviewed by archive staff.',
      unavailable: 'The public feed is not available yet.', unavailableHint: 'You can leave a message for staff using the form below.',
      loading: 'Loading messages…', error: 'Could not load messages.', retry: 'Retry loading',
      empty: 'No messages have been published yet.', emptyHint: 'Visitor messages will appear here after moderation.',
      filteredEmpty: 'There are no messages in this category yet.', all: 'All messages', review: 'Reviews', suggestion: 'Suggestions', wish: 'Wishes', errorKind: 'Error reports',
      filter: 'Message category', count: 'Messages found', page: 'Page', previous: 'Previous', next: 'Next',
      preview: 'Layout example', previewHint: 'These are illustrative samples, not visitor feedback or staff replies.',
      example: 'Sample message', author: 'Visitor', reply: 'Archive reply', replyExample: 'Sample archive reply',
      sampleAuthor: 'Public display name', sampleMessage: 'This is how a published visitor message will look. Visitors can read feedback, suggestions and wishes here.',
      sampleLong: 'Long messages are displayed in full, retaining paragraph breaks. Text wraps on narrow screens, and categories help visitors find relevant messages.\n\nThis sample text is provided to review the guestbook layout.',
      sampleReply: 'An archive staff reply will appear here, visually separated from the visitor’s message.',
    },
  };
  const kinds = ['review', 'suggestion', 'wish', 'error'];
  const pageSize = 3;

  function exampleMessages(t) {
    return ['review', 'suggestion', 'wish', 'review', 'error', 'suggestion', 'review'].map((kind, index) => ({
      id: 'preview-' + index, status: 'published', kind, publicName: t.sampleAuthor,
      message: index === 1 ? t.sampleLong : t.sampleMessage,
      publicReply: index % 2 === 0 ? { status: 'published', message: t.sampleReply } : null,
    }));
  }

  function dateLabel(value, language) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value)) return '';
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  }

  /** Component input is a public projection, never the private moderation queue. No network writes. */
  window.renderGuestbookFeed = function renderGuestbookFeed(container, language, configuration = {}) {
    const t = copy[language] || copy.ru;
    const esc = window.archiveApi.escape;
    const preview = configuration.preview === true;
    const state = preview ? 'ready' : configuration.state || 'unavailable';
    const provided = preview ? exampleMessages(t) : configuration.items;
    const items = Array.isArray(provided) ? provided.filter(item => item && item.status === 'published' && kinds.includes(item.kind) && typeof item.message === 'string' && item.message.trim()) : [];
    const params = new URLSearchParams(location.hash.split('?')[1]);
    let kind = kinds.includes(params.get('feed-type')) ? params.get('feed-type') : '';
    let page = Math.max(1, Math.min(1000, Math.trunc(Number(params.get('feed-page'))) || 1));
    container.innerHTML = `<section class="guestbook-feed" aria-labelledby="guestbook-messages-title">
      <header><div><h2 id="guestbook-messages-title">${t.title}</h2><p>${t.intro}</p></div>${preview ? `<span class="guestbook-preview-badge">${t.preview}</span>` : ''}</header>
      ${preview ? `<p class="guestbook-preview-note" role="note">${t.previewHint}</p>` : ''}
      <div data-guestbook-results></div></section>`;
    const results = container.querySelector('[data-guestbook-results]');
    if (state !== 'ready') {
      const message = state === 'loading' ? t.loading : state === 'error' ? t.error : t.unavailable;
      results.innerHTML = `<div class="guestbook-feed-state" role="status"><p>${message}</p>${state === 'unavailable' ? `<p>${t.unavailableHint}</p>` : ''}${state === 'error' && typeof configuration.retry === 'function' ? `<button type="button" class="button-secondary" data-feed-retry>${t.retry}</button>` : ''}</div>`;
      results.querySelector('[data-feed-retry]')?.addEventListener('click', () => configuration.retry());
      return;
    }
    results.innerHTML = `<div class="guestbook-feed-filters" role="group" aria-label="${t.filter}">${['', ...kinds].map(value => `<button type="button" data-feed-kind="${value}" aria-pressed="${value === kind}">${value ? t[value === 'error' ? 'errorKind' : value] : t.all}</button>`).join('')}</div>
      <p class="guestbook-feed-count" role="status" aria-live="polite"></p><div data-feed-list></div>
      <nav class="guestbook-feed-pagination" aria-label="${t.page}" hidden><button type="button" data-feed-previous>${t.previous}</button><span data-feed-page></span><button type="button" data-feed-next>${t.next}</button></nav>`;
    const list = results.querySelector('[data-feed-list]');
    const pager = results.querySelector('nav');
    function draw(moveFocus = false) {
      const filtered = items.filter(item => !kind || kind === item.kind);
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(pages, page);
      const currentParams = new URLSearchParams(location.hash.split('?')[1]);
      if (kind) currentParams.set('feed-type', kind); else currentParams.delete('feed-type');
      if (page > 1) currentParams.set('feed-page', String(page)); else currentParams.delete('feed-page');
      history.replaceState(null, '', '#/section/feedback' + (currentParams.size ? '?' + currentParams : ''));
      results.querySelectorAll('[data-feed-kind]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.feedKind === kind)));
      results.querySelector('.guestbook-feed-count').textContent = `${t.count}: ${filtered.length}`;
      list.innerHTML = filtered.length ? filtered.slice((page - 1) * pageSize, page * pageSize).map(item => {
        const date = dateLabel(item.publishedAt, language);
        const reply = item.publicReply?.status === 'published' && typeof item.publicReply.message === 'string' ? item.publicReply.message.slice(0, 4000) : '';
        return `<article class="guestbook-message"><header><div><span class="guestbook-message-kind">${t[item.kind === 'error' ? 'errorKind' : item.kind]}</span><h3>${esc(typeof item.publicName === 'string' && item.publicName.trim() ? item.publicName.slice(0, 80) : t.author)}</h3></div>${preview ? `<span class="guestbook-message-date">${t.example}</span>` : date ? `<time class="guestbook-message-date" datetime="${esc(new Date(item.publishedAt).toISOString())}">${esc(date)}</time>` : ''}</header>
          <p class="guestbook-message-body">${esc(item.message.slice(0, 2000))}</p>${reply ? `<section class="guestbook-reply"><h4>${preview ? t.replyExample : t.reply}</h4><p>${esc(reply)}</p></section>` : ''}</article>`;
      }).join('') : `<div class="guestbook-feed-state"><h3>${kind ? t.filteredEmpty : t.empty}</h3><p>${t.emptyHint}</p></div>`;
      pager.hidden = pages <= 1;
      pager.querySelector('[data-feed-page]').textContent = `${t.page} ${page} / ${pages}`;
      pager.querySelector('[data-feed-previous]').disabled = page <= 1;
      pager.querySelector('[data-feed-next]').disabled = page >= pages;
      if (moveFocus) { list.tabIndex = -1; list.focus({ preventScroll: true }); }
    }
    results.querySelectorAll('[data-feed-kind]').forEach(button => button.addEventListener('click', () => { kind = button.dataset.feedKind; page = 1; draw(); }));
    pager.querySelector('[data-feed-previous]').addEventListener('click', () => { page--; draw(true); });
    pager.querySelector('[data-feed-next]').addEventListener('click', () => { page++; draw(true); });
    draw();
  };
}());
