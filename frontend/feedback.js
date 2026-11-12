/* Отзывы и предложения о сайте: при работающем API отправляются на модерацию (не официальные обращения). */
(function () {
  'use strict';
  const draft = { topic: 'suggestion', message: '' };
  let sending = false;
  let outcome = null;
  let updateCurrentView = () => {};
  const translations = {
    ru: { breadcrumb:'Навигационная цепочка', home:'Главная', title:'Гостевая книга', eyebrow:'ВАШЕ МНЕНИЕ ВАЖНО', intro:'Поделитесь идеями о том, как сделать сайт понятнее и удобнее.', notice:'Демонстрация формы', noticeText:'Отправка ещё не подключена. Черновик доступен только до перезагрузки страницы и не поступает в архив.', topic:'Тема', suggestion:'Предложение по сайту', review:'Отзыв о сайте', error:'Сообщение об ошибке', wish:'Пожелание', send:'Отправить сообщение', message:'Ваше сообщение', placeholder:'Напишите, что можно улучшить', hint:'Не указывайте персональные данные в сообщении.', check:'Проверить форму', result:'Форма заполнена для примера. Сообщение не отправлено.', aside:'ОБРАТНАЯ СВЯЗЬ', asideTitle:'Помогите нам стать удобнее', asideText:'Здесь можно оставить отзыв, предложение или пожелание о работе сайта.', contactText:'Для справочной информации об архиве посмотрите раздел с контактами и адресами филиалов.', contacts:'Филиалы и контакты' },
    kk: { breadcrumb:'Навигация жолы', home:'Басты бет', title:'Қонақ кітабы', eyebrow:'СІЗДІҢ ПІКІРІҢІЗ МАҢЫЗДЫ', intro:'Сайтты түсінікті әрі ыңғайлы ету туралы ойыңызбен бөлісіңіз.', notice:'Нысанның көрсетілімі', noticeText:'Жіберу мүмкіндігі әлі қосылмаған. Мәтін бетті қайта жүктегенге дейін ғана қолжетімді және архивке жіберілмейді.', topic:'Тақырып', suggestion:'Сайт бойынша ұсыныс', review:'Сайт туралы пікір', error:'Қате туралы хабарлама', wish:'Тілек', send:'Хабарламаны жіберу', message:'Хабарламаңыз', placeholder:'Нені жақсартуға болатынын жазыңыз', hint:'Хабарламаға жеке деректерді енгізбеңіз.', check:'Нысанды тексеру', result:'Нысан мысал ретінде толтырылды. Хабарлама жіберілген жоқ.', aside:'КЕРІ БАЙЛАНЫС', asideTitle:'Сайтты ыңғайлы етуге көмектесіңіз', asideText:'Мұнда сайт жұмысы туралы пікір, ұсыныс немесе тілек қалдыра аласыз.', contactText:'Архив туралы анықтама алу үшін филиалдардың мекенжайлары мен байланыстарын қараңыз.', contacts:'Филиалдар және байланыс' },
    en: { breadcrumb:'Breadcrumb', home:'Home', title:'Guestbook', eyebrow:'YOUR OPINION MATTERS', intro:'Share ideas for making the website clearer and easier to use.', notice:'Form preview', noticeText:'Sending is not connected. Your draft is available only until the page is reloaded and is not sent to the archive.', topic:'Topic', suggestion:'Website suggestion', review:'Website feedback', error:'Report an error', wish:'Wish', send:'Send message', message:'Your message', placeholder:'Tell us what could be improved', hint:'Please do not include personal information in your message.', check:'Check form', result:'This is a form preview. Your message has not been sent.', aside:'FEEDBACK', asideTitle:'Help us make the website easier to use', asideText:'Leave feedback, suggestions or wishes about the website.', contactText:'For archive information, see branch addresses and contact details.', contacts:'Branches and contacts' }
  };
  const formText = {
    ru: {
      rulesTitle:'Правила публикации', rulesLink:'Как публикуются сообщения', rules:['Перед публикацией сообщение проверяет сотрудник.','Не указывайте ИИН, документы и другие личные сведения.','Здесь принимаются отзывы, предложения и пожелания; архивные запросы оформляются через официальные каналы.'],
      heading:'Оставить сообщение', description:'Сообщения передаются сотрудникам архива на модерацию.', visibility:'Публичный список сообщений и ответы сотрудников пока недоступны.',
      limit:'От 5 до 2000 символов', counter:'Символов', sending:'Отправка…', validation:'Введите сообщение длиной от 5 до 2000 символов.',
      success:'Спасибо! Сообщение отправлено на модерацию.', sentPrevious:'Предыдущее сообщение отправлено на модерацию. Новый черновик остался в форме.',
      rejected:'Проверьте тему и длину сообщения. Текст остался в форме.',
      rateLimited:'Слишком много попыток отправки. Попробуйте позже. Текст остался в форме.',
      error:'Не удалось подтвердить отправку. Текст остался в форме.'
    },
    kk: {
      rulesTitle:'Жариялау ережелері', rulesLink:'Хабарламалар қалай жарияланады', rules:['Жариялау алдында хабарламаны қызметкер тексереді.','ЖСН, құжаттар мен басқа жеке мәліметтерді көрсетпеңіз.','Мұнда пікірлер, ұсыныстар мен тілектер қабылданады; архивтік сұраулар ресми арналар арқылы беріледі.'],
      heading:'Хабарлама қалдыру', description:'Хабарламалар архив қызметкерлеріне модерацияға жіберіледі.', visibility:'Хабарламалардың жария тізімі мен қызметкерлердің жауаптары әзірге қолжетімсіз.',
      limit:'5-тен 2000 таңбаға дейін', counter:'Таңба', sending:'Жіберілуде…', validation:'5-тен 2000 таңбаға дейін хабарлама енгізіңіз.',
      success:'Рақмет! Хабарлама модерацияға жіберілді.', sentPrevious:'Алдыңғы хабарлама модерацияға жіберілді. Жаңа жоба нысанда сақталды.',
      rejected:'Тақырып пен хабарлама ұзындығын тексеріңіз. Мәтін нысанда сақталды.',
      rateLimited:'Жіберу әрекеттері тым көп. Кейінірек қайталап көріңіз. Мәтін нысанда сақталды.',
      error:'Жіберілгенін растау мүмкін болмады. Мәтін нысанда сақталды.'
    },
    en: {
      rulesTitle:'Publication rules', rulesLink:'How messages are published', rules:['Staff review messages before publication.','Do not include personal ID numbers, documents or other private information.','This form accepts feedback, suggestions and wishes; use official channels for archive requests.'],
      heading:'Leave a message', description:'Messages are sent to archive staff for moderation.', visibility:'The public list of messages and staff replies are not available yet.',
      limit:'5 to 2000 characters', counter:'Characters', sending:'Sending…', validation:'Enter a message of 5 to 2000 characters.',
      success:'Thank you! Your message was sent for moderation.', sentPrevious:'Your previous message was sent for moderation. The new draft is still in the form.',
      rejected:'Check the topic and message length. Your text is still in the form.',
      rateLimited:'Too many attempts. Try again later. Your text is still in the form.',
      error:'Delivery confirmation failed. Your text is still in the form.'
    }
  };
  window.renderFeedback = function renderFeedback(container, language) {
    const t = translations[language] || translations.ru;
    const f = formText[language] || formText.ru;
    container.innerHTML = `<section class="feedback-page"><div class="feedback-shell">
      <nav class="feedback-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <div class="feedback-heading"><p class="feedback-eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p>${t.intro}</p></div>
      <p class="feedback-page-actions"><button type="button" data-feedback-compose>${f.heading} <span aria-hidden="true">↓</span></button><button type="button" data-feedback-rules>${f.rulesLink}</button></p>
      <div data-guestbook-feed></div>
      <div class="feedback-grid"><div class="feedback-card" id="feedback-compose"><h2>${f.heading}</h2><p class="feedback-card-intro">${f.description}</p><div class="feedback-notice" role="note"><strong>${t.notice}</strong><p>${t.noticeText}</p></div>
      <form class="feedback-form" novalidate><label for="feedback-topic">${t.topic}</label><select id="feedback-topic"><option value="suggestion">${t.suggestion}</option><option value="review">${t.review}</option><option value="error">${t.error}</option><option value="wish">${t.wish}</option></select>
      <label for="feedback-message">${t.message}</label><textarea id="feedback-message" rows="6" minlength="5" maxlength="2000" placeholder="${t.placeholder}" required></textarea><div class="feedback-meta"><span id="feedback-instructions">${f.limit}</span><span id="feedback-count">${f.counter}: <span>0</span> / 2000</span></div><p id="feedback-hint" class="feedback-hint">${t.hint}</p>
      <button type="submit">${t.check} <span aria-hidden="true">→</span></button><p id="feedback-result" class="feedback-result" role="status"></p></form></div>
      <aside class="feedback-aside"><p class="feedback-eyebrow">${t.aside}</p><h2>${t.asideTitle}</h2><p>${t.asideText}</p><div id="feedback-rules" class="feedback-rules" tabindex="-1"><h3>${f.rulesTitle}</h3><ul>${f.rules.map(item=>`<li>${item}</li>`).join('')}</ul></div><div class="feedback-divider"></div><p>${t.contactText}</p><a href="#/section/branches">${t.contacts} <span aria-hidden="true">→</span></a></aside></div>
    </div></section>`;
    const topic = container.querySelector('#feedback-topic');
    const feedParams = new URLSearchParams(location.hash.split('?')[1]);
    window.renderGuestbookFeed(container.querySelector('[data-guestbook-feed]'), language, { preview: feedParams.get('preview') === 'messages' });
    // In-page navigation must not replace the application's hash route or lose the form.
    container.querySelector('[data-feedback-compose]').addEventListener('click', event => { event.preventDefault(); container.querySelector('#feedback-message').focus(); });
    container.querySelector('[data-feedback-rules]').addEventListener('click', event => { event.preventDefault(); container.querySelector('#feedback-rules').focus(); });
    const message = container.querySelector('#feedback-message');
    const count = container.querySelector('#feedback-count span');
    const result = container.querySelector('.feedback-result');
    topic.value = draft.topic;
    message.value = draft.message;
    count.textContent = String(message.value.length);
    topic.addEventListener('change', () => { draft.topic = topic.value; outcome = null; updateCurrentView(); });
    message.addEventListener('input', () => { draft.message = message.value; outcome = null; updateCurrentView(); });
    const form = container.querySelector('.feedback-form');
    const notice = container.querySelector('.feedback-notice');
    const submit = form.querySelector('button[type="submit"]');
    const api = window.archiveApi;
    let available = Boolean(api?.health?.ok);
    updateCurrentView = () => {
      if (!form.isConnected) return;
      if (message.value !== draft.message) message.value = draft.message;
      count.textContent = String(draft.message.length);
      notice.hidden = available;
      submit.disabled = sending;
      submit.textContent = sending ? f.sending : available ? t.send : t.check;
      const hasValidationError = outcome === 'validation';
      const descriptionIds = 'feedback-instructions feedback-count feedback-hint';
      message.setAttribute('aria-describedby', hasValidationError ? descriptionIds + ' feedback-result' : descriptionIds);
      if (hasValidationError) message.setAttribute('aria-invalid', 'true');
      else message.removeAttribute('aria-invalid');
      result.textContent = outcome === 'preview' ? t.result : (f[outcome] || '');
      const hasConfirmation = outcome === 'success' || outcome === 'sentPrevious';
      if (outcome && outcome !== 'preview') result.dataset.state = hasConfirmation ? 'success' : 'error';
      else delete result.dataset.state;
    };
    updateCurrentView();
    api?.ready.then((isAvailable) => { available = isAvailable; if (form.isConnected) updateCurrentView(); });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (sending) return;
      if (draft.message.trim().length < 5 || draft.message.length > 2000) {
        outcome = 'validation';
        updateCurrentView();
        message.focus();
        return;
      }
      const submitted = { topic: draft.topic, message: draft.message };
      sending = true;
      outcome = null;
      updateCurrentView();
      try {
        if (!api || !(await api.ready)) {
          outcome = 'preview';
          return;
        }
        const response = await api.post('/feedback', { kind: submitted.topic, message: submitted.message });
        if (response?.ok !== true) {
          outcome = 'error';
          return;
        }
        const unchanged = draft.message === submitted.message && draft.topic === submitted.topic;
        if (unchanged) draft.message = '';
        outcome = unchanged ? 'success' : 'sentPrevious';
      } catch (error) {
        if (error.status === 400) outcome = 'rejected';
        else if (error.status === 429) outcome = 'rateLimited';
        else outcome = 'error';
      } finally {
        sending = false;
        updateCurrentView();
      }
    });
  };
}());
