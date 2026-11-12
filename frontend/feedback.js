/* Отзывы и предложения о сайте: при работающем API отправляются на модерацию (не официальные обращения). */
(function () {
  'use strict';
  const draft = { topic: 'suggestion', message: '' };
  const translations = {
    ru: { breadcrumb:'Навигационная цепочка', home:'Главная', title:'Гостевая книга', eyebrow:'ВАШЕ МНЕНИЕ ВАЖНО', intro:'Поделитесь идеями о том, как сделать сайт понятнее и удобнее.', notice:'Демонстрация формы', noticeText:'Отправка ещё не подключена. Черновик доступен только до перезагрузки страницы и не поступает в архив.', topic:'Тема', suggestion:'Предложение по сайту', review:'Отзыв о сайте', error:'Сообщение об ошибке', wish:'Пожелание', send:'Отправить сообщение', message:'Ваше сообщение', placeholder:'Напишите, что можно улучшить', hint:'Не указывайте персональные данные в сообщении.', check:'Проверить форму', result:'Форма заполнена для примера. Сообщение не отправлено.', aside:'ОБРАТНАЯ СВЯЗЬ', asideTitle:'Помогите нам стать удобнее', asideText:'Здесь можно оставить отзыв, предложение или пожелание о работе сайта.', contactText:'Для справочной информации об архиве посмотрите раздел с контактами и адресами филиалов.', contacts:'Филиалы и контакты' },
    kk: { breadcrumb:'Навигация жолы', home:'Басты бет', title:'Қонақ кітабы', eyebrow:'СІЗДІҢ ПІКІРІҢІЗ МАҢЫЗДЫ', intro:'Сайтты түсінікті әрі ыңғайлы ету туралы ойыңызбен бөлісіңіз.', notice:'Нысанның көрсетілімі', noticeText:'Жіберу мүмкіндігі әлі қосылмаған. Мәтін бетті қайта жүктегенге дейін ғана қолжетімді және архивке жіберілмейді.', topic:'Тақырып', suggestion:'Сайт бойынша ұсыныс', review:'Сайт туралы пікір', error:'Қате туралы хабарлама', wish:'Тілек', send:'Хабарламаны жіберу', message:'Хабарламаңыз', placeholder:'Нені жақсартуға болатынын жазыңыз', hint:'Хабарламаға жеке деректерді енгізбеңіз.', check:'Нысанды тексеру', result:'Нысан мысал ретінде толтырылды. Хабарлама жіберілген жоқ.', aside:'КЕРІ БАЙЛАНЫС', asideTitle:'Сайтты ыңғайлы етуге көмектесіңіз', asideText:'Мұнда сайт жұмысы туралы пікір, ұсыныс немесе тілек қалдыра аласыз.', contactText:'Архив туралы анықтама алу үшін филиалдардың мекенжайлары мен байланыстарын қараңыз.', contacts:'Филиалдар және байланыс' },
    en: { breadcrumb:'Breadcrumb', home:'Home', title:'Guestbook', eyebrow:'YOUR OPINION MATTERS', intro:'Share ideas for making the website clearer and easier to use.', notice:'Form preview', noticeText:'Sending is not connected. Your draft is available only until the page is reloaded and is not sent to the archive.', topic:'Topic', suggestion:'Website suggestion', review:'Website feedback', error:'Report an error', wish:'Wish', send:'Send message', message:'Your message', placeholder:'Tell us what could be improved', hint:'Please do not include personal information in your message.', check:'Check form', result:'This is a form preview. Your message has not been sent.', aside:'FEEDBACK', asideTitle:'Help us make the website easier to use', asideText:'Leave feedback, suggestions or wishes about the website.', contactText:'For archive information, see branch addresses and contact details.', contacts:'Branches and contacts' }
  };
  window.renderFeedback = function renderFeedback(container, language) {
    const t = translations[language] || translations.ru;
    container.innerHTML = `<section class="feedback-page"><div class="feedback-shell">
      <nav class="feedback-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <div class="feedback-heading"><p class="feedback-eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p>${t.intro}</p></div>
      <div class="feedback-grid"><div class="feedback-card"><div class="feedback-notice" role="note"><strong>${t.notice}</strong><p>${t.noticeText}</p></div>
      <form class="feedback-form"><label for="feedback-topic">${t.topic}</label><select id="feedback-topic"><option value="suggestion">${t.suggestion}</option><option value="review">${t.review}</option><option value="error">${t.error}</option><option value="wish">${t.wish}</option></select>
      <label for="feedback-message">${t.message}</label><textarea id="feedback-message" rows="6" minlength="5" maxlength="2000" placeholder="${t.placeholder}" required></textarea><p class="feedback-hint">${t.hint}</p>
      <button type="submit">${t.check} <span aria-hidden="true">→</span></button><p class="feedback-result" role="status" aria-live="polite"></p></form></div>
      <aside class="feedback-aside"><p class="feedback-eyebrow">${t.aside}</p><h2>${t.asideTitle}</h2><p>${t.asideText}</p><div class="feedback-divider"></div><p>${t.contactText}</p><a href="#/section/branches">${t.contacts} <span aria-hidden="true">→</span></a></aside></div>
    </div></section>`;
    const topic = container.querySelector('#feedback-topic');
    const message = container.querySelector('#feedback-message');
    topic.value = draft.topic;
    message.value = draft.message;
    topic.addEventListener('change', () => { draft.topic = topic.value; });
    message.addEventListener('input', () => { draft.message = message.value; });
    const sent = { ru: 'Спасибо! Сообщение отправлено на модерацию. Это не официальное обращение: ответ и номер не присваиваются.', kk: 'Рақмет! Хабарлама модерацияға жіберілді. Бұл ресми өтініш емес.', en: 'Thank you! Your message was sent for moderation. This is not an official appeal.' }[language] || '';
    const failed = { ru: 'Не удалось отправить. Черновик сохранён — попробуйте ещё раз.', kk: 'Жіберу мүмкін болмады. Жоба сақталды — қайталап көріңіз.', en: 'Sending failed. Your draft is kept — please try again.' }[language] || '';
    window.archiveApi?.ready.then((available) => { if (available) { container.querySelector('.feedback-notice')?.setAttribute('hidden', ''); container.querySelector('.feedback-form button').textContent = t.send; } });
    container.querySelector('.feedback-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const result = container.querySelector('.feedback-result');
      const api = window.archiveApi;
      if (!api || !(await api.ready)) { result.textContent = t.result; return; }
      const button = event.target.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        // Успех показываем только после ответа сервера; при ошибке черновик остаётся.
        await api.post('/feedback', { kind: topic.value, message: message.value });
        result.textContent = sent;
        draft.message = '';
        message.value = '';
      } catch (error) {
        result.textContent = error.status === 400 ? error.message : failed;
      } finally {
        button.disabled = false;
      }
    });
  };
}());
