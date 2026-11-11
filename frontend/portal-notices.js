/* Describe the local preview as it works today. The archive supplies the publication terms. */
(function () {
  'use strict';

  const copy = {
    ru: {
      home: 'Главная', breadcrumb: 'Навигационная цепочка',
      privacy: {
        title: 'Конфиденциальность',
        intro: 'Сведения о работе локального прототипа. Текст политики для официального портала требует согласования с архивом.',
        sections: [
          ['Настройки и поиск', 'Язык, тема и размер текста сохраняются в браузере. Поиск по демонстрационному каталогу работает в браузере, а выбранные фильтры и запрос могут быть видны в адресе страницы.'],
          ['Чат и отзывы', 'Чат показывает подготовленные примеры. Введённый текст и черновик отзыва остаются в памяти открытой страницы до её перезагрузки. Демонстрационная форма не отправляет сообщения в архив.'],
          ['Внешние ресурсы', 'При переходе по внешним ссылкам браузер открывает другой сайт. По кнопке «Показать карту» загружается виджет Яндекс Карт. Обработка данных внешними ресурсами описана в их собственных политиках.']
        ]
      },
      copyright: {
        title: 'Авторские права',
        intro: 'Сведения об источниках материалов прототипа. Условия использования материалов официального портала требуют согласования с архивом.',
        sections: [
          ['Документы и фотографии', 'Источники указаны в карточках материалов, где они известны. Право публикации фотографий из дизайн-макета требует подтверждения.'],
          ['Государственные символы и шрифт', 'Изображения герба и флага получены с сайта Акорды. Шрифт Inter распространяется по лицензии SIL Open Font License 1.1.']
        ],
        symbols: 'Источники государственных символов', license: 'Лицензия шрифта Inter'
      }
    },
    kk: {
      home: 'Басты бет', breadcrumb: 'Навигация жолы',
      privacy: {
        title: 'Құпиялық',
        intro: 'Жергілікті прототиптің жұмысы туралы мәлімет. Ресми порталдың құпиялық саясатының мәтінін архивпен келісу қажет.',
        sections: [
          ['Баптаулар және іздеу', 'Тіл, тақырып және мәтін өлшемі браузерде сақталады. Көрсетілім каталогындағы іздеу браузерде орындалады. Таңдалған сүзгілер мен сұрау бет мекенжайында көрінуі мүмкін.'],
          ['Чат және пікірлер', 'Чат алдын ала дайындалған мысалдарды көрсетеді. Енгізілген мәтін мен пікір жобасы бет қайта жүктелгенге дейін ашық беттің жадында қалады. Көрсетілім нысаны хабарламаларды архивке жібермейді.'],
          ['Сыртқы ресурстар', 'Сыртқы сілтемені басқанда браузер басқа сайтты ашады. «Картаны көрсету» түймесі Яндекс Карталар виджетін жүктейді. Сыртқы ресурстар деректерді өңдеу тәртібін өз саясаттарында сипаттайды.']
        ]
      },
      copyright: {
        title: 'Авторлық құқық',
        intro: 'Прототип материалдарының дереккөздері туралы мәлімет. Ресми портал материалдарын пайдалану шарттарын архивпен келісу қажет.',
        sections: [
          ['Құжаттар мен фотосуреттер', 'Белгілі дереккөздер материал карточкаларында көрсетілген. Дизайн макетіндегі фотосуреттерді жариялау құқығын растау қажет.'],
          ['Мемлекеттік рәміздер және қаріп', 'Елтаңба мен тудың суреттері Ақорда сайтынан алынды. Inter қарпі SIL Open Font License 1.1 лицензиясымен таратылады.']
        ],
        symbols: 'Мемлекеттік рәміздердің дереккөздері', license: 'Inter қарпінің лицензиясы'
      }
    },
    en: {
      home: 'Home', breadcrumb: 'Breadcrumbs',
      privacy: {
        title: 'Privacy',
        intro: 'How this local prototype handles information. The privacy policy for the official portal requires confirmation from the archive.',
        sections: [
          ['Preferences and search', 'The browser stores the language, theme and text size. The demonstration catalogue searches within the browser. Selected filters and the query may appear in the page address.'],
          ['Chat and feedback', 'The chat shows prepared examples. Entered text and feedback drafts remain in the open page’s memory until you reload it. The demonstration form does not send messages to the archive.'],
          ['External resources', 'External links open another website. The Show map button loads a Yandex Maps widget. External resources describe their data handling in their own policies.']
        ]
      },
      copyright: {
        title: 'Copyright',
        intro: 'Information about the sources used in this prototype. The terms for using materials from the official portal require confirmation from the archive.',
        sections: [
          ['Documents and photographs', 'Item records list sources where known. Publication rights for photographs from the design mockup need confirmation.'],
          ['State symbols and typography', 'The flag and emblem images come from the Akorda website. The Inter font is available under the SIL Open Font License 1.1.']
        ],
        symbols: 'Sources for the state symbols', license: 'Inter font license'
      }
    }
  };

  window.renderPortalNotice = function renderPortalNotice(container, key, language) {
    if (key !== 'privacy' && key !== 'copyright') return false;
    const text = Object.hasOwn(copy, language) ? copy[language] : copy.ru;
    const notice = text[key];
    const sources = key === 'copyright' ? `<ul><li><a class="info-text-link" href="#/section/symbols">${notice.symbols}</a></li><li><a class="info-text-link" href="assets/INTER-LICENSE.txt" download>${notice.license}</a></li></ul>` : '';

    container.innerHTML = `<section class="info-page" aria-labelledby="portal-notice-title"><div class="info-container">
      <header class="info-heading"><nav class="info-breadcrumb" aria-label="${text.breadcrumb}"><a href="#/">${text.home}</a><span aria-hidden="true">/</span><span aria-current="page">${notice.title}</span></nav><h1 id="portal-notice-title">${notice.title}</h1><p class="info-intro">${notice.intro}</p></header>
      <div class="info-paper-card info-about-story">${notice.sections.map(([title, body]) => `<h2>${title}</h2><p>${body}</p>`).join('')}${sources}</div>
    </div></section>`;
    return true;
  };
}());
