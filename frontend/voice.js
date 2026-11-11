/* Голос для тех, кому трудно печатать или читать мелкий текст.
   «Сказать» — распознавание речи браузера (Web Speech API); текст вставляется в поле и НЕ отправляется сам,
   человек проверяет его и нажимает «Отправить». «Прослушать» — озвучивание ответа синтезатором браузера.
   Аудио на наш сервер не передаётся. Если браузер не умеет — кнопок нет. */
(function () {
  'use strict';
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canSpeak = 'speechSynthesis' in window;
  const lang = () => document.documentElement.lang || 'ru';
  const speechLang = () => ({ kk: 'kk-KZ', en: 'en-US' }[lang()] || 'ru-RU');
  const text = {
    ru: { say: 'Сказать', listening: 'Слушаю…', listen: 'Прослушать', stop: 'Остановить', voiceNote: 'Озвучивает синтезатор речи браузера' },
    kk: { say: 'Айту', listening: 'Тыңдап тұрмын…', listen: 'Тыңдау', stop: 'Тоқтату', voiceNote: 'Браузердің сөйлеу синтезаторы оқиды' },
    en: { say: 'Speak', listening: 'Listening…', listen: 'Listen', stop: 'Stop', voiceNote: 'Read aloud by the browser speech synthesiser' },
  };
  const t = () => text[lang()] || text.ru;
  const micIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  const speakerIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';

  function addMic(form) {
    if (!Recognition || form.querySelector('.voice-button')) return;
    const input = form.querySelector('input');
    const submit = form.querySelector('[type=submit]');
    if (!input || !submit) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'voice-button';
    button.innerHTML = `${micIcon}<span>${t().say}</span>`;
    button.setAttribute('aria-pressed', 'false');
    submit.before(button);
    let recognition = null;
    button.addEventListener('click', () => {
      if (recognition) { recognition.stop(); return; }
      recognition = new Recognition();
      recognition.lang = speechLang();
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      button.setAttribute('aria-pressed', 'true');
      button.querySelector('span').textContent = t().listening;
      recognition.onresult = (event) => { input.value = Array.from(event.results).map((r) => r[0].transcript).join(' ').trim(); };
      recognition.onend = recognition.onerror = () => {
        recognition = null;
        button.setAttribute('aria-pressed', 'false');
        button.querySelector('span').textContent = t().say;
        input.focus();
      };
      recognition.start();
    });
  }

  function addListen(actions) {
    if (!canSpeak || actions.querySelector('.voice-listen')) return;
    const answer = actions.closest('.chat-answer');
    const paragraph = answer?.querySelector(':scope > p');
    if (!paragraph) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-copy voice-listen';
    button.title = t().voiceNote;
    button.innerHTML = `${speakerIcon}<span>${t().listen}</span>`;
    actions.prepend(button);
    button.addEventListener('click', () => {
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
      const utterance = new SpeechSynthesisUtterance(paragraph.textContent);
      utterance.lang = speechLang();
      utterance.rate = 0.95; // чуть медленнее обычного — легче воспринимать
      utterance.onstart = () => { button.querySelector('span').textContent = t().stop; };
      utterance.onend = utterance.onerror = () => { button.querySelector('span').textContent = t().listen; };
      speechSynthesis.speak(utterance);
    });
  }

  function enhance(root) {
    root.querySelectorAll('#chat-form, .chat-composer').forEach(addMic);
    root.querySelectorAll('.chat-answer-actions').forEach(addListen);
  }

  // Экраны перерисовываются целиком при смене маршрута, поэтому кнопки добавляются по факту появления разметки.
  const app = document.getElementById('app') || document.body;
  new MutationObserver(() => enhance(app)).observe(app, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => { if (canSpeak) speechSynthesis.cancel(); });
  enhance(app);
}());
