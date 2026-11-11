/* Presentation-only chat. Answers are prepared locally, never sent to a model. */
(function () {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const text = {
    ru: {title:'Помощник архива',sub:'Программа на основе ИИ',new:'Новый разговор',nav:'РАЗДЕЛЫ',catalog:'Электронный каталог',exhibitions:'Онлайн-выставки',memory:'Архив памяти',branches:'Филиалы и контакты',all:'Все разделы',label:'Демонстрационная версия',demo:'Ответы подготовлены заранее. Реальный ИИ и поиск по архиву ещё не подключены.',question:'Ваш вопрос',prepared:'Подготовленный ответ',source:'Связанная страница',input:'Уточните или спросите ещё',send:'Отправить',empty:'О чём вы хотите узнать?',emptyText:'Задайте вопрос об архиве или попробуйте один из примеров.',example1:'Где находится архив?',example2:'Что такое опись и дело?',example3:'Найти фонд Р-1',search:'Открыть каталог',clear:'Начать новый разговор'},
    kk: {title:'Архив көмекшісі',sub:'Жасанды интеллектке негізделген бағдарлама',new:'Жаңа әңгіме',nav:'БӨЛІМДЕР',catalog:'Электрондық каталог',exhibitions:'Онлайн көрмелер',memory:'Архив жады',branches:'Филиалдар мен байланыс',all:'Барлық бөлімдер',label:'Демонстрациялық нұсқа',demo:'Жауаптар алдын ала дайындалған. ЖИ мен архивтік іздеу әлі қосылған жоқ.',question:'Сіздің сұрағыңыз',prepared:'Алдын ала дайындалған жауап',source:'Байланысты бет',input:'Нақтылаңыз немесе тағы сұраңыз',send:'Жіберу',empty:'Не туралы білгіңіз келеді?',emptyText:'Архив туралы сұрақ қойыңыз немесе мысал таңдаңыз.',example1:'Архив қайда орналасқан?',example2:'Тізімдеме мен іс деген не?',example3:'Р-1 қорын табу',search:'Каталогты ашу',clear:'Жаңа әңгіме бастау'},
    en: {title:'Archive assistant',sub:'An AI-based program',new:'New conversation',nav:'EXPLORE',catalog:'Electronic catalogue',exhibitions:'Online exhibitions',memory:'Memory archive',branches:'Branches and contacts',all:'All sections',label:'Demonstration',demo:'Answers are prepared in advance. AI and archive search are not connected yet.',question:'Your question',prepared:'Prepared answer',source:'Related page',input:'Ask a follow-up question',send:'Send',empty:'What would you like to know?',emptyText:'Ask about the archive or select an example.',example1:'Where is the archive?',example2:'What are an inventory and a case?',example3:'Find fund Р-1',search:'Open catalogue',clear:'Start a new conversation'}
  };
  const nav = [
    ['#/catalog','layers','catalog'], ['#/exhibition','image','exhibitions'], ['#/memory','history','memory'],
    ['#/section/branches','pin','branches'], ['#/section/all','grid','all']
  ];
  text.ru.brandShort = 'Госархив ВКО';
  text.kk.brandShort = 'ШҚО архиві';
  text.en.brandShort = 'East Kazakhstan Archive';
  const copyText = {
    ru: {button:'Скопировать ответ', copied:'Ответ скопирован', failed:'Не удалось скопировать. Выделите текст ответа вручную.'},
    kk: {button:'Жауапты көшіру', copied:'Жауап көшірілді', failed:'Көшіру мүмкін болмады. Жауап мәтінін қолмен белгілеңіз.'},
    en: {button:'Copy answer', copied:'Answer copied', failed:'Could not copy. Select the answer text manually.'}
  };
  const scenarioText = {
    ru: {
      examples: 'Демонстрационные ситуации',
      restricted: 'Пример: ограниченный доступ',
      error: 'Пример: ошибка поиска',
      restrictedAnswer: 'Пример: доступ к материалу ограничен. Для такого материала необходимо уточнить условия доступа в архиве. Этот пример не относится к конкретному делу.',
      restrictedLink: 'Помощь по доступу',
      errorAnswer: 'Пример ошибки: поиск временно недоступен. Реальный ИИ и поиск не подключены. Вы можете повторить демонстрацию или открыть каталог.',
      retry: 'Повторить пример',
      related: 'Перейти'
    },
    kk: {
      examples: 'Демонстрациялық жағдайлар',
      restricted: 'Мысал: қолжетімділік шектеулі',
      error: 'Мысал: іздеу қатесі',
      restrictedAnswer: 'Мысал: материалға қолжетімділік шектеулі. Мұндай материалға қол жеткізу шарттарын архивтен нақтылау қажет. Бұл мысал нақты іске қатысты емес.',
      restrictedLink: 'Қолжетімділік туралы көмек',
      errorAnswer: 'Қате мысалы: іздеу уақытша қолжетімсіз. Нақты ЖИ мен іздеу қосылмаған. Демонстрацияны қайталауға немесе каталогты ашуға болады.',
      retry: 'Мысалды қайталау',
      related: 'Өту'
    },
    en: {
      examples: 'Demonstration scenarios',
      restricted: 'Example: restricted access',
      error: 'Example: search error',
      restrictedAnswer: 'Example: access to a material is restricted. Check the conditions of access with the archive. This example does not refer to a specific case.',
      restrictedLink: 'Help with access',
      errorAnswer: 'Error example: search is temporarily unavailable. Real AI and search are not connected. You can repeat the demonstration or open the catalogue.',
      retry: 'Repeat example',
      related: 'Go to'
    }
  };

  const previewText = {
    ru: { noResult:'Пример: ничего не найдено', noResultAnswer:'Пример пустого результата. Поиск не выполнялся. Попробуйте изменить запрос или перейти в каталог.', sources:'Пример: несколько ссылок', sourcesAnswer:'Пример ответа: познакомьтесь с каталогом и справкой об архивных терминах. Это связанные страницы, а не результат поиска.', sourcesLabel:'Связанные страницы', waiting:'Пример: ожидание ответа', waitingText:'Пример состояния ожидания. Настоящий запрос не выполняется.', showAnswer:'Показать пример ответа', shownAnswer:'Демонстрация завершена. Настоящий ИИ и поиск ещё не подключены.', rate:'Ответ был полезен?', yes:'Да', no:'Нет', rated:'Оценка отмечена только в этом окне; она не отправляется.', ratingGroup:'Оценка ответа' },
    kk: { noResult:'Мысал: ештеңе табылмады', noResultAnswer:'Бос нәтиже мысалы. Іздеу орындалған жоқ. Сұрауды өзгертіңіз немесе каталогқа өтіңіз.', sources:'Мысал: бірнеше сілтеме', sourcesAnswer:'Жауап мысалы: каталогпен және архив терминдері туралы анықтамамен танысыңыз. Бұл іздеу нәтижесі емес, байланысты беттер.', sourcesLabel:'Байланысты беттер', waiting:'Мысал: жауапты күту', waitingText:'Күту күйінің мысалы. Нақты сұрау орындалмайды.', showAnswer:'Жауап мысалын көрсету', shownAnswer:'Көрсетілім аяқталды. Нақты ЖИ мен іздеу әлі қосылған жоқ.', rate:'Жауап пайдалы болды ма?', yes:'Иә', no:'Жоқ', rated:'Баға тек осы терезеде белгіленді; ол жіберілмейді.', ratingGroup:'Жауапты бағалау' },
    en: { noResult:'Example: no results', noResultAnswer:'Example of an empty result. No search was performed. Change your question or open the catalogue.', sources:'Example: multiple links', sourcesAnswer:'Example answer: explore the catalogue and the guide to archive terms. These are related pages, not search results.', sourcesLabel:'Related pages', waiting:'Example: waiting for an answer', waitingText:'Example of a waiting state. No actual request is being made.', showAnswer:'Show example answer', shownAnswer:'Demonstration complete. Real AI and search are not connected yet.', rate:'Was this answer helpful?', yes:'Yes', no:'No', rated:'Your choice is marked only in this window; it is not sent.', ratingGroup:'Rate this answer' }
  };

  window.renderChat = function renderChat(container, options) {
    const {messages, language, icon, answerFor, onSubmit, onClear} = options;
    const t = text[language] || text.ru;
    const copy = copyText[language] || copyText.ru;
    const scenarios = scenarioText[language] || scenarioText.ru;
    const preview = previewText[language] || previewText.ru;
    function getAnswer(kind) {
      if (kind === 'demo-no-result') return [preview.noResultAnswer, t.search, '#/catalog'];
      if (kind === 'demo-sources') return [preview.sourcesAnswer, t.search, '#/catalog'];
      if (kind === 'demo-loading') return [preview.waitingText, t.search, '#/catalog'];
      if (kind === 'demo-restricted') return [scenarios.restrictedAnswer, scenarios.restrictedLink, '#/section/help'];
      if (kind === 'demo-error') return [scenarios.errorAnswer, t.search, '#/catalog'];
      return answerFor(kind);
    }
    function sourceCard(label, href, caption) {
      return `<a class="chat-source-card" href="${escape(href)}"><span class="chat-source-icon">${icon('file')}</span><span><small>${escape(caption)}</small><strong>${escape(label)}</strong></span><span class="chat-arrow">${icon('arrowRight')}</span></a>`;
    }
    const liveText = { ru: { label: 'Помощник архива · программа на основе ИИ', search: 'Ответ по результатам поиска', thinking: 'Ищу в каталоге и материалах сайта…', catalog: 'Открыть в каталоге с этими фильтрами', applied: 'Помощник применил фильтры', sources: 'Источники', more: 'Можно уточнить', copy: 'Скопировать', copied: 'Скопировано', helpful: 'Ответ был полезен?', yes: 'Да', no: 'Нет', thanks: 'Спасибо, оценка учтена.', noResults: 'Подходящих открытых материалов не нашлось.' },
      kk: { label: 'Архив көмекшісі · ЖИ негізіндегі бағдарлама', search: 'Іздеу нәтижесі бойынша жауап', thinking: 'Каталог пен сайт материалдарынан іздеп жатырмын…', catalog: 'Осы сүзгілермен каталогта ашу', applied: 'Көмекші қолданған сүзгілер', sources: 'Дереккөздер', more: 'Нақтылауға болады', copy: 'Көшіру', copied: 'Көшірілді', helpful: 'Жауап пайдалы болды ма?', yes: 'Иә', no: 'Жоқ', thanks: 'Рақмет, баға есепке алынды.', noResults: 'Сәйкес ашық материал табылмады.' },
      en: { label: 'Archive assistant · AI-based program', search: 'Answer from search results', thinking: 'Searching the catalogue and site materials…', catalog: 'Open in the catalogue with these filters', applied: 'Filters applied by the assistant', sources: 'Sources', more: 'You can refine', copy: 'Copy', copied: 'Copied', helpful: 'Was this answer helpful?', yes: 'Yes', no: 'No', thanks: 'Thank you, your rating was saved.', noResults: 'No matching open materials were found.' } }[language] || {};
    const api = window.archiveApi;
    // Закон РК «Об искусственном интеллекте»: посетитель видит, что отвечает программа, и знает её ограничения.
    const disclosure = { ru: ['ИИ-помощник', 'Отвечает программа на основе ИИ — только по открытым материалам сайта архива, со ссылками на источники. Проверяйте важное в карточке. Сайт не принимает заявления; можно пользоваться каталогом без помощника.'], kk: ['ЖИ-көмекші', 'ЖИ негізіндегі бағдарлама тек архив сайтының ашық материалдары бойынша, дереккөз сілтемелерімен жауап береді. Маңыздысын карточкадан тексеріңіз. Сайт өтініш қабылдамайды; каталогты көмекшісіз де пайдалануға болады.'], en: ['AI assistant', 'An AI-based program answers only from open materials on the archive site, with links to sources. Check important details in the record. The site does not accept applications; you can use the catalogue without the assistant.'] }[language];
    const isLive = Boolean(api && api.health && api.health.ok);
    const bannerLabel = isLive ? disclosure[0] : t.label;
    const bannerText = isLive ? disclosure[1] : t.demo;
    function liveEntry(message, index) {
      const user = `<div class="chat-user-row"><div class="chat-user-bubble"><span class="chat-visually-hidden">${t.question}: </span>${escape(message.question)}</div></div>`;
      const label = `<div class="chat-answer-label"><span class="chat-assistant-icon">${icon('assistant')}</span><span>${message.reply && message.reply.mode === 'search' ? liveText.search : liveText.label}</span></div>`;
      if (message.pending) return `<div class="chat-turn">${user}<div class="chat-answer">${label}<div class="chat-waiting" role="status"><span class="chat-waiting-dot" aria-hidden="true"></span>${liveText.thinking}</div></div></div>`;
      if (message.error) return `<div class="chat-turn">${user}<div class="chat-answer">${label}<p>${escape(message.error)}</p></div></div>`;
      const reply = message.reply;
      const chips = reply.filters.length ? `<div class="chat-live-filters" aria-label="${liveText.applied}">${reply.filters.map((f) => `<span class="chat-live-chip">${escape(f.label)}</span>`).join('')}${reply.catalogHref ? `<a class="chat-live-catalog" href="${api.safeHref(reply.catalogHref)}">${liveText.catalog} →</a>` : ''}</div>` : (reply.catalogHref ? `<p><a class="chat-live-catalog" href="${api.safeHref(reply.catalogHref)}">${liveText.catalog} →</a></p>` : '');
      const notice = reply.notice ? `<p class="chat-live-notice">${escape(reply.notice)}</p>` : '';
      const sources = reply.sources.map((source) => `<a class="chat-source-card" href="${api.safeHref(source.href)}">${source.imageUrl ? `<img class="chat-source-thumb" src="${escape(source.imageUrl)}" alt="" loading="lazy">` : `<span class="chat-source-icon">${icon('file')}</span>`}<span><small>${escape([source.reference, source.period].filter(Boolean).join(' · ') || liveText.sources)}</small><strong>${escape(source.title)}</strong></span><span class="chat-arrow">${icon('arrowRight')}</span></a>`).join('');
      const links = reply.links.map((link) => `<a class="chat-source-card" href="${api.safeHref(link.href)}"${/^https:/.test(link.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="chat-source-icon">${icon('arrowRight')}</span><span><strong>${escape(link.label)}</strong></span><span class="chat-arrow">${icon('arrowRight')}</span></a>`).join('');
      const followups = reply.followups.length ? `<div class="chat-live-followups"><span>${liveText.more}:</span>${reply.followups.map((text) => `<button type="button" class="chat-live-followup">${escape(text)}</button>`).join('')}</div>` : '';
      const rating = `<div class="chat-rating" role="group" aria-label="${liveText.helpful}"><span>${liveText.helpful}</span><button type="button" data-live-rating="1" data-chat-index="${index}" aria-pressed="${message.rating === 1}">${liveText.yes}</button><button type="button" data-live-rating="-1" data-chat-index="${index}" aria-pressed="${message.rating === -1}">${liveText.no}</button><span class="chat-rating-status" role="status">${message.rating ? liveText.thanks : ''}</span></div>`;
      return `<div class="chat-turn">${user}<div class="chat-answer">${label}${chips}<p>${escape(reply.answer || liveText.noResults)}</p>${notice}${sources || links ? `<div class="chat-source-list">${sources}${links}</div>` : ''}${followups}<div class="chat-answer-actions"><button type="button" class="chat-copy" data-live-copy="${index}">${liveText.copy}</button><span class="chat-copy-status" role="status"></span></div>${rating}</div></div>`;
    }
    const entries = messages.map((message, index) => {
      if (message.kind === 'live') return liveEntry(message, index);
      const answer = getAnswer(message.kind);
      const loading = message.kind === 'demo-loading' && !message.previewShown;
      const related = message.kind.startsWith('demo-') ? scenarios.related : t.source;
      const sources = sourceCard(answer[1], answer[2], message.kind === 'demo-sources' ? preview.sourcesLabel : related)
        + (message.kind === 'demo-sources' ? sourceCard(scenarios.restrictedLink, '#/section/help', preview.sourcesLabel) : '');
      const response = message.kind === 'demo-loading' && message.previewShown ? preview.shownAnswer : answer[0];
      return `<div class="chat-turn"><div class="chat-user-row"><div class="chat-user-bubble"><span class="chat-visually-hidden">${t.question}: </span>${escape(message.question)}</div></div>
        <div class="chat-answer"><div class="chat-answer-label"><span class="chat-assistant-icon">${icon('assistant')}</span><span>${t.title} · ${t.prepared}</span></div>${loading ? `<div class="chat-waiting" role="status"><span class="chat-waiting-dot" aria-hidden="true"></span>${preview.waitingText}</div><button type="button" class="chat-copy" data-chat-show="${index}">${preview.showAnswer}</button>` : `<p>${escape(response)}</p><div class="chat-source-list">${sources}</div><div class="chat-answer-actions">${message.kind === 'demo-error' ? `<button type="button" class="chat-copy" data-chat-retry="${index}">${scenarios.retry}</button>` : ''}<button type="button" class="chat-copy" data-chat-copy="${index}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="11" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" stroke="currentColor" stroke-width="1.7"/></svg><span>${copy.button}</span></button><span class="chat-copy-status" role="status"></span></div><div class="chat-rating" role="group" aria-label="${preview.ratingGroup}"><span>${preview.rate}</span><button type="button" data-chat-rating="yes" data-chat-index="${index}" aria-pressed="${message.rating === 'yes'}">${preview.yes}</button><button type="button" data-chat-rating="no" data-chat-index="${index}" aria-pressed="${message.rating === 'no'}">${preview.no}</button><span class="chat-rating-status" role="status">${message.rating ? preview.rated : ''}</span></div>`}</div></div>`;
    }).join('');
    const empty = `<div class="chat-empty"><span class="chat-empty-icon">${icon('assistant')}</span><h1>${t.empty}</h1><p>${t.emptyText}</p><div class="chat-suggestions"><button type="button" data-chat-example="address">${t.example1}</button><button type="button" data-chat-example="terms">${t.example2}</button><button type="button" data-chat-example="fund">${t.example3}</button></div><div class="chat-scenario-examples"><p>${scenarios.examples}</p><div class="chat-suggestions"><button type="button" data-chat-example="demo-restricted">${scenarios.restricted}</button><button type="button" data-chat-example="demo-error">${scenarios.error}</button><button type="button" data-chat-example="demo-no-result">${preview.noResult}</button><button type="button" data-chat-example="demo-sources">${preview.sources}</button><button type="button" data-chat-example="demo-loading">${preview.waiting}</button></div></div></div>`;
    container.innerHTML = `<section class="chat-layout${messages.length ? '' : ' chat-layout-empty'}" aria-label="${t.title}">
      <aside class="chat-sidebar"><a class="chat-sidebar-brand" href="#/"><span class="chat-sidebar-mark">${icon('assistant')}</span><span><strong>${t.brandShort}</strong><small>${t.title}</small></span></a><button type="button" class="chat-new">${icon('arrowRight')}<span>${t.new}</span></button><p class="chat-nav-title">${t.nav}</p><nav class="chat-side-nav" aria-label="${t.nav}">${nav.map(([href,symbol,label])=>`<a href="${href}">${icon(symbol)}<span>${t[label]}</span></a>`).join('')}</nav><div class="chat-side-foot"><span>${bannerLabel}</span><p>${bannerText}</p></div></aside>
      <div class="chat-main"><div class="chat-top"><div><strong>${t.title}</strong><span>${t.sub}</span></div><button type="button" class="chat-clear" aria-label="${t.clear}" title="${t.clear}">+</button></div>
        <div class="chat-thread-wrap"><div class="chat-demo-banner" role="note"><strong>${bannerLabel}.</strong> ${bannerText}</div><div class="chat-thread" aria-live="polite">${entries || empty}</div></div>
        <div class="chat-composer-wrap"><form class="chat-composer"><label class="chat-visually-hidden" for="chat-followup">${t.input}</label><span class="chat-composer-search">${icon('search')}</span><input id="chat-followup" type="search" maxlength="500" autocomplete="off" placeholder="${t.input}"><button type="submit" aria-label="${t.send}">${icon('arrowUp')}</button></form><p>${bannerText}</p></div>
      </div></section>`;
    container.querySelector('.chat-composer').addEventListener('submit', (event)=>{
      event.preventDefault();
      const field = container.querySelector('#chat-followup');
      if (field.value.trim()) onSubmit(field.value);
      else field.focus();
    });
    container.querySelectorAll('.chat-new,.chat-clear').forEach(button=>button.addEventListener('click',onClear));
    container.querySelectorAll('[data-chat-example]').forEach(button=>button.addEventListener('click',()=>onSubmit(button.textContent,button.dataset.chatExample)));
    container.querySelectorAll('[data-chat-retry]').forEach(button=>button.addEventListener('click',()=>{
      const message = messages[Number(button.dataset.chatRetry)];
      onSubmit(message.question, 'demo-error');
    }));
    container.querySelectorAll('[data-chat-show]').forEach(button=>button.addEventListener('click',()=>{
      const index = Number(button.dataset.chatShow);
      const message = messages[index];
      message.previewShown = true;
      window.renderChat(container, options);
      const answer = container.querySelectorAll('.chat-answer')[index];
      answer.setAttribute('tabindex', '-1');
      answer.focus({preventScroll:true});
    }));
    container.querySelectorAll('[data-chat-rating]').forEach(button=>button.addEventListener('click',()=>{
      const message = messages[Number(button.dataset.chatIndex)];
      message.rating = button.dataset.chatRating;
      const group = button.closest('.chat-rating');
      group.querySelectorAll('[data-chat-rating]').forEach(choice=>choice.setAttribute('aria-pressed', String(choice.dataset.chatRating === message.rating)));
      group.querySelector('.chat-rating-status').textContent = preview.rated;
    }));
    container.querySelectorAll('.chat-live-followup').forEach(button=>button.addEventListener('click',()=>onSubmit(button.textContent)));
    container.querySelectorAll('[data-live-rating]').forEach(button=>button.addEventListener('click',()=>{
      const message = messages[Number(button.dataset.chatIndex)];
      message.rating = Number(button.dataset.liveRating);
      api.put('/chat/messages/' + encodeURIComponent(message.reply.messageId) + '/rating', {rating: message.rating}).catch(() => {});
      const group = button.closest('.chat-rating');
      group.querySelectorAll('[data-live-rating]').forEach(choice=>choice.setAttribute('aria-pressed', String(Number(choice.dataset.liveRating) === message.rating)));
      group.querySelector('.chat-rating-status').textContent = liveText.thanks;
    }));
    container.querySelectorAll('[data-live-copy]').forEach(button=>button.addEventListener('click',async()=>{
      const status = button.parentElement.querySelector('.chat-copy-status');
      try { await navigator.clipboard.writeText(messages[Number(button.dataset.liveCopy)].reply.answer); status.textContent = liveText.copied; } catch { status.textContent = ''; }
    }));
    container.querySelectorAll('[data-chat-copy]').forEach(button=>button.addEventListener('click',async()=>{
      const status = button.parentElement.querySelector('.chat-copy-status');
      const message = messages[Number(button.dataset.chatCopy)];
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(message.kind === 'demo-loading' && message.previewShown ? preview.shownAnswer : getAnswer(message.kind)[0]);
        status.textContent = copy.copied;
      } catch {
        status.textContent = copy.failed;
      }
    }));
    if (messages.length) requestAnimationFrame(() => {
      if (container.querySelector('.chat-layout')) window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'});
    });
  };
})();
