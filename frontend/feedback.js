/* Layout preview only: feedback is never transmitted or stored on disk. */
(function () {
  'use strict';
  const draft = { topic: 'suggestion', message: '' };
  const translations = {
    ru: { breadcrumb:'Навигационная цепочка', home:'Главная', title:'Отзывы и предложения', eyebrow:'ВАШЕ МНЕНИЕ ВАЖНО', intro:'Поделитесь идеями о том, как сделать сайт понятнее и удобнее.', notice:'Демонстрация формы', noticeText:'Отправка ещё не подключена. Черновик доступен только до перезагрузки страницы и не поступает в архив.', topic:'Тема', suggestion:'Предложение по сайту', review:'Отзыв о сайте', error:'Сообщение об ошибке', message:'Ваше сообщение', placeholder:'Напишите, что можно улучшить', hint:'Пожалуйста, не указывайте персональные данные в демонстрационной форме.', check:'Проверить форму', result:'Форма заполнена для примера. Сообщение не отправлено.', aside:'ОБРАТНАЯ СВЯЗЬ', asideTitle:'Помогите нам стать удобнее', asideText:'Здесь можно будет оставить отзыв, предложение или пожелание о работе сайта.', contactText:'Для справочной информации об архиве посмотрите раздел с контактами и адресами филиалов.', contacts:'Филиалы и контакты' },
    kk: { breadcrumb:'Навигация жолы', home:'Басты бет', title:'Пікірлер мен ұсыныстар', eyebrow:'СІЗДІҢ ПІКІРІҢІЗ МАҢЫЗДЫ', intro:'Сайтты түсінікті әрі ыңғайлы ету туралы ойыңызбен бөлісіңіз.', notice:'Нысанның көрсетілімі', noticeText:'Жіберу мүмкіндігі әлі қосылмаған. Мәтін бетті қайта жүктегенге дейін ғана қолжетімді және архивке жіберілмейді.', topic:'Тақырып', suggestion:'Сайт бойынша ұсыныс', review:'Сайт туралы пікір', error:'Қате туралы хабарлама', message:'Хабарламаңыз', placeholder:'Нені жақсартуға болатынын жазыңыз', hint:'Демонстрациялық нысанға жеке деректерді енгізбеңіз.', check:'Нысанды тексеру', result:'Нысан мысал ретінде толтырылды. Хабарлама жіберілген жоқ.', aside:'КЕРІ БАЙЛАНЫС', asideTitle:'Сайтты ыңғайлы етуге көмектесіңіз', asideText:'Мұнда сайт жұмысы туралы пікір, ұсыныс немесе тілек қалдыруға болады.', contactText:'Архив туралы анықтама алу үшін филиалдардың мекенжайлары мен байланыстарын қараңыз.', contacts:'Филиалдар және байланыс' },
    en: { breadcrumb:'Breadcrumb', home:'Home', title:'Feedback and suggestions', eyebrow:'YOUR OPINION MATTERS', intro:'Share ideas for making the website clearer and easier to use.', notice:'Form preview', noticeText:'Sending is not connected. Your draft is available only until the page is reloaded and is not sent to the archive.', topic:'Topic', suggestion:'Website suggestion', review:'Website feedback', error:'Report an error', message:'Your message', placeholder:'Tell us what could be improved', hint:'Please do not include personal information in this demonstration form.', check:'Check form', result:'This is a form preview. Your message has not been sent.', aside:'FEEDBACK', asideTitle:'Help us make the website easier to use', asideText:'This space will accept feedback, suggestions and wishes about the website.', contactText:'For archive information, see branch addresses and contact details.', contacts:'Branches and contacts' }
  };
  window.renderFeedback = function renderFeedback(container, language) {
    const t = translations[language] || translations.ru;
    container.innerHTML = `<section class="feedback-page"><div class="feedback-shell">
      <nav class="feedback-breadcrumb" aria-label="${t.breadcrumb}"><a href="#/">${t.home}</a><span aria-hidden="true">/</span><span aria-current="page">${t.title}</span></nav>
      <div class="feedback-heading"><p class="feedback-eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p>${t.intro}</p></div>
      <div class="feedback-grid"><div class="feedback-card"><div class="feedback-notice" role="note"><strong>${t.notice}</strong><p>${t.noticeText}</p></div>
      <form class="feedback-form"><label for="feedback-topic">${t.topic}</label><select id="feedback-topic"><option value="suggestion">${t.suggestion}</option><option value="review">${t.review}</option><option value="error">${t.error}</option></select>
      <label for="feedback-message">${t.message}</label><textarea id="feedback-message" rows="6" maxlength="2000" placeholder="${t.placeholder}" required></textarea><p class="feedback-hint">${t.hint}</p>
      <button type="submit">${t.check} <span aria-hidden="true">→</span></button><p class="feedback-result" role="status" aria-live="polite"></p></form></div>
      <aside class="feedback-aside"><p class="feedback-eyebrow">${t.aside}</p><h2>${t.asideTitle}</h2><p>${t.asideText}</p><div class="feedback-divider"></div><p>${t.contactText}</p><a href="#/section/branches">${t.contacts} <span aria-hidden="true">→</span></a></aside></div>
    </div></section>`;
    const topic = container.querySelector('#feedback-topic');
    const message = container.querySelector('#feedback-message');
    topic.value = draft.topic;
    message.value = draft.message;
    topic.addEventListener('change', () => { draft.topic = topic.value; });
    message.addEventListener('input', () => { draft.message = message.value; });
    container.querySelector('.feedback-form').addEventListener('submit', (event) => {
      event.preventDefault();
      container.querySelector('.feedback-result').textContent = t.result;
    });
  };
}());
