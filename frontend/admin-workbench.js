/* Local preparation only. Reads published metadata; never writes records or uploads files. */
(function () {
  'use strict';
  const locales = ['ru', 'kk', 'en'];
  const localeLabels = { ru: 'Русский · RU', kk: 'Қазақша · KK', en: 'English · EN' };
  const kinds = { page: 'Страница', news: 'Новость', exhibition: 'Выставка', collection: 'Коллекция' };
  const recordKinds = { fund: 'Фонд', inventory: 'Опись', case: 'Дело', document: 'Документ', photo: 'Фотодокумент', newspaper: 'Газета' };
  let owner = null;
  let records = new Map();
  let materials = new Map();
  let files = [];

  function clear() {
    owner = null;
    records.clear();
    materials.clear();
    files = [];
  }

  function context(main, language, user, permissions) {
    const t = value => window.adminWorkbenchText(value, language);
    if (!user?.id || !permissions.some(permission => user.permissions.includes(permission))) {
      main.innerHTML = `<p class="admin-live-message" data-kind="error" role="status">${t('Для этого раздела у вашей роли нет прав.')}</p>`;
      return null;
    }
    if (owner !== user.id) { clear(); owner = user.id; }
    return { main, t, esc: window.archiveApi.escape, language, user };
  }

  function shell(c, title, intro) {
    c.main.innerHTML = `<section class="admin-workbench">
      <header class="admin-heading"><div><h1>${c.t(title)}</h1><p>${c.t(intro)}</p></div></header>
      <p class="admin-content-note" role="note"><strong>${c.t('Локальная подготовка')}.</strong> ${c.t('Изменения и файлы остаются в памяти этой вкладки до перезагрузки или выхода. На сервер они не отправляются.')}</p>
      <div data-workbench-body></div></section>`;
    return c.main.querySelector('[data-workbench-body]');
  }

  function field(c, name, label, value = '', options = {}) {
    const attrs = `${options.required ? ' required' : ''} maxlength="${options.long ? 20000 : 500}"`;
    return `<label>${c.t(label)}${options.required ? ' *' : ''}${options.long
      ? `<textarea name="${name}" rows="${options.rows || 5}"${attrs}>${c.esc(value)}</textarea>`
      : `<input name="${name}" type="${options.number ? 'number' : 'text'}" value="${c.esc(value ?? '')}"${options.number ? ' min="1" max="2100" step="1"' : ''}${attrs}>`}</label>`;
  }

  function options(values, selected, label) {
    return values.map(value => `<option value="${value}"${value === selected ? ' selected' : ''}>${label(value)}</option>`).join('');
  }

  function status(node, text, error = false) {
    node.textContent = text;
    node.dataset.kind = error ? 'error' : 'info';
  }

  function openDialog(c, title, body, onClose = () => {}) {
    const previousFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = 'admin-workbench-dialog';
    const titleId = 'workbench-dialog-' + crypto.randomUUID();
    dialog.setAttribute('aria-labelledby', titleId);
    dialog.innerHTML = `<header><h2 id="${titleId}">${c.esc(title)}</h2><form method="dialog"><button aria-label="${c.t('Закрыть')}" value="cancel" class="admin-button-secondary">×</button></form></header>${body}`;
    let disposed = false;
    function dispose(value) {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      onClose(value);
      dialog.remove();
      if (previousFocus?.isConnected) previousFocus.focus();
    }
    const observer = new MutationObserver(() => { if (!dialog.isConnected) dispose('cancel'); });
    c.main.append(dialog);
    observer.observe(document.body, { childList: true, subtree: true });
    dialog.addEventListener('close', () => dispose(dialog.returnValue));
    dialog.showModal();
    return dialog;
  }

  function downloadJSON(c, name, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    c.main.append(link);
    link.click();
    link.remove();
    // Keep the object URL alive until the browser has accepted the download.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function fileMetadata(file) {
    return { name: file.file.name, size: file.file.size, format: file.format, lastModified: file.file.lastModified, relation: file.relation, caption: file.caption };
  }

  function exportDraft(c, type, id, payload, relation) {
    downloadJSON(c, `archive-${type}-${encodeURIComponent(id)}.json`, {
      format: 'archive-local-draft', version: 1, exportedAt: new Date().toISOString(),
      localOnly: true, type, payload, files: files.filter(file => file.relation === relation).map(fileMetadata),
    });
  }

  const recordFields = {
    title: 'Заголовок', description: 'Описание', fundNo: 'Фонд', inventoryNo: 'Опись', caseNo: 'Дело',
    period: 'Дата или период', yearFrom: 'Год с', yearTo: 'Год по', authorOrg: 'Автор или организация', place: 'Место', source: 'Источник',
  };

  async function record(main, language, user) {
    const c = context(main, language, user, ['catalog.edit']);
    if (!c) return;
    const params = new URLSearchParams(location.hash.split('?')[1]);
    const id = params.get('record');
    params.delete('record');
    const back = '#/admin/catalogue' + (params.size ? '?' + params : '');
    const body = shell(c, 'Изменение записи', 'Проверьте описание и реквизиты. Опубликованная карточка останется прежней.');
    body.innerHTML = `<p role="status">${c.t('Загружаем карточку…')}</p>`;
    let draft = records.get(id);
    if (!draft) {
      try {
        const { resource } = await window.archiveApi.get('/resources/' + encodeURIComponent(id));
        if (!body.isConnected || owner !== user.id) return;
        if (user.role === 'branch_admin' && resource.storage?.branchId !== user.branchId) {
          body.innerHTML = `<p role="status">${c.t('Это подразделение вне вашей области редактирования.')}</p>`;
          return;
        }
        const values = Object.fromEntries(Object.keys(recordFields).map(key => [key, key === 'source'
          ? [resource.source?.label, resource.source?.url].filter(Boolean).join('\n') : String(resource[key] ?? '')]));
        draft = { original: resource, before: { ...values }, values, savedSignature: JSON.stringify(values) };
        records.set(id, draft);
      } catch {
        if (!body.isConnected) return;
        body.innerHTML = `<p role="status">${c.t('Не удалось загрузить карточку.')}</p><button type="button" data-retry>${c.t('Повторить')}</button>`;
        body.querySelector('[data-retry]').addEventListener('click', () => record(main, language, user));
        return;
      }
    }
    const original = draft.original;
    body.innerHTML = `<nav class="admin-workbench-links"><a href="${c.esc(back)}">← ${c.t('К списку записей')}</a><a href="#/resource/${encodeURIComponent(id)}" target="_blank" rel="noopener">${c.t('Открыть опубликованную карточку')} ↗</a></nav>
      <div class="admin-workbench-grid"><section class="admin-panel"><form data-record-form class="admin-content-form" novalidate>
      ${field(c, 'title', 'Заголовок', draft.values.title, { required: true })}
      ${field(c, 'description', 'Описание', draft.values.description, { long: true })}
      <div class="admin-workbench-fields">${['fundNo', 'inventoryNo', 'caseNo', 'period', 'yearFrom', 'yearTo'].map(key => field(c, key, recordFields[key], draft.values[key], { number: key.startsWith('year') })).join('')}</div>
      <details><summary>${c.t('Дополнительные реквизиты')}</summary><div class="admin-content-form">${['authorOrg', 'place', 'source'].map(key => field(c, key, recordFields[key], draft.values[key], { long: key === 'source', rows: 3 })).join('')}</div></details>
      <p class="admin-live-message" role="status" aria-live="polite" data-record-status></p>
      <div class="admin-content-actions"><button type="submit">${c.t('Сохранить локальный черновик')}</button><button type="button" class="admin-button-secondary" data-record-preview>${c.t('Предпросмотр')}</button><button type="button" class="admin-button-secondary" data-record-export>${c.t('Скачать черновик JSON')}</button></div></form></section>
      <aside class="admin-panel"><h2>${c.t('Опубликованные сведения')}</h2><dl class="admin-content-facts">${[
        ['Архивный шифр', original.reference], ['Тип', c.t(recordKinds[original.kind] || original.kind)], ['Место хранения', original.storage?.name],
      ].map(([label, value]) => `<div><dt>${c.t(label)}</dt><dd>${c.esc(value || c.t('Нет сведений'))}</dd></div>`).join('')}</dl>
      <a class="admin-content-link" href="#/admin/files?record=${encodeURIComponent(id)}">${c.t('Добавить файлы')} →</a></aside></div>`;
    const form = body.querySelector('form[data-record-form]');
    const result = form.querySelector('[data-record-status]');
    const read = () => {
      for (const key of Object.keys(recordFields)) draft.values[key] = form.elements.namedItem(key).value;
    };
    const validate = () => {
      const title = form.elements.namedItem('title');
      title.setCustomValidity(title.value.trim() ? '' : c.t('Заголовок'));
      const from = form.elements.namedItem('yearFrom');
      const to = form.elements.namedItem('yearTo');
      to.setCustomValidity(from.value && to.value && Number(from.value) > Number(to.value) ? c.t('Начальный год должен быть не позднее конечного.') : '');
      return form.reportValidity();
    };
    form.addEventListener('input', () => { read(); status(result, c.t(JSON.stringify(draft.values) === draft.savedSignature ? 'Локальный черновик' : 'Есть несохранённые изменения')); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate()) return;
      read();
      draft.savedSignature = JSON.stringify(draft.values);
      status(result, c.t('Черновик сохранён в памяти вкладки.'));
    });
    body.querySelector('[data-record-preview]').addEventListener('click', () => {
      if (!validate()) return;
      read();
      const changed = Object.keys(recordFields).filter(key => String(draft.before[key]) !== String(draft.values[key]));
      openDialog(c, c.t('Проверка изменений'), changed.length ? `<div class="admin-workbench-diff">${changed.map(key => `<section><h3>${c.t(recordFields[key])}</h3><div><p><strong>${c.t('Было')}</strong><span>${c.esc(draft.before[key] || '—')}</span></p><p><strong>${c.t('Подготовлено')}</strong><span>${c.esc(draft.values[key] || '—')}</span></p></div></section>`).join('')}</div>` : `<p>${c.t('Пока нет изменений.')}</p>`);
    });
    body.querySelector('[data-record-export]').addEventListener('click', () => {
      if (!validate()) return;
      read();
      exportDraft(c, 'record', id, { resourceId: id, baseUpdatedAt: original.updatedAt, branchId: original.storage?.branchId,
        values: { ...draft.values, yearFrom: draft.values.yearFrom ? Number(draft.values.yearFrom) : null, yearTo: draft.values.yearTo ? Number(draft.values.yearTo) : null } }, 'record:' + id);
      status(result, c.t('Файл черновика подготовлен для скачивания.'));
    });
    status(result, c.t(JSON.stringify(draft.values) === draft.savedSignature ? 'Локальный черновик' : 'Есть несохранённые изменения'));
  }

  async function inspectFile(file) {
    if (!file.size || file.size > 20 * 1024 * 1024) throw new Error('Файл пустой или превышает 20 МБ.');
    const extension = file.name.split('.').pop().toLowerCase();
    const accepted = { pdf: ['application/pdf'], jpg: ['image/jpeg'], jpeg: ['image/jpeg'], png: ['image/png'], tif: ['image/tiff'], tiff: ['image/tiff'] };
    if (!Object.hasOwn(accepted, extension) || (file.type && file.type !== 'application/octet-stream' && !accepted[extension].includes(file.type))) throw new Error('Неизвестный или неподдерживаемый формат.');
    let bytes;
    try { bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer()); }
    catch { throw new Error('Не удалось прочитать файл.'); }
    const starts = signature => signature.every((byte, index) => bytes[index] === byte);
    const valid = extension === 'pdf' ? starts([37, 80, 68, 70, 45])
      : extension === 'png' ? starts([137, 80, 78, 71, 13, 10, 26, 10])
      : ['jpg', 'jpeg'].includes(extension) ? starts([255, 216, 255])
      : starts([73, 73, 42, 0]) || starts([77, 77, 0, 42]) || starts([73, 73, 43, 0]) || starts([77, 77, 0, 43]);
    if (!valid) throw new Error('Содержимое не соответствует формату файла.');
    return extension;
  }

  function filesScreen(main, language, user) {
    const c = context(main, language, user, ['catalog.edit', 'content.create', 'content.publish']);
    if (!c) return;
    const body = shell(c, 'Файлы материала', 'Выберите PDF, JPEG, PNG или TIFF. До 20 МБ на файл, до 50 МБ и 20 файлов в очереди.');
    const params = new URLSearchParams(location.hash.split('?')[1]);
    const defaultRelation = records.has(params.get('record')) ? 'record:' + params.get('record')
      : materials.has(params.get('material')) ? 'content:' + params.get('material') : '';
    body.innerHTML = `<section class="admin-panel"><label class="admin-workbench-upload"><strong>${c.t('Выбрать файлы')}</strong><input data-local-files type="file" accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff" multiple></label>
      <p class="admin-muted">${c.t('Файлы не загружены на сервер. Проверка формата в браузере не заменяет антивирусную проверку.')}</p>
      <p class="admin-live-message" role="status" aria-live="polite" data-file-status></p><ul class="admin-workbench-errors" data-file-errors></ul>
      <div data-file-list></div><div class="admin-content-actions"><button type="button" class="admin-button-secondary" data-file-manifest>${c.t('Скачать реестр файлов')}</button></div><p class="admin-muted">${c.t('Реестр содержит только описания и связи. Исходные файлы передаются отдельно.')}</p></section>`;
    const input = body.querySelector('[data-local-files]');
    const result = body.querySelector('[data-file-status]');
    const list = body.querySelector('[data-file-list]');
    const errors = body.querySelector('[data-file-errors]');
    const manifest = body.querySelector('[data-file-manifest]');
    function renderList() {
      manifest.disabled = !files.length;
      const relations = [...records].map(([id, item]) => ['record:' + id, item.values.title]).concat([...materials].map(([id, item]) => ['content:' + id, item.versions[item.original].title || c.t('Новый материал')]));
      list.innerHTML = files.length ? files.map(item => `<article class="admin-workbench-file" data-file-id="${item.id}"><header><div><h2>${c.esc(item.file.name)}</h2><p>${item.format.toUpperCase()} · ${(item.file.size / 1024 / 1024).toLocaleString(language, { maximumFractionDigits: 2 })} ${c.t('МБ')} · ${c.t('Локально')}</p></div><button type="button" class="admin-button-secondary" data-file-remove>${c.t('Удалить')}</button></header>
        <div class="admin-workbench-fields"><label>${c.t('Связанный черновик')}<select data-file-relation><option value="">${c.t('Без привязки')}</option>${relations.map(([key, title]) => `<option value="${c.esc(key)}"${key === item.relation ? ' selected' : ''}>${c.esc(title)}</option>`).join('')}</select></label><label>${c.t('Подпись и источник')}<input data-file-caption maxlength="1000" value="${c.esc(item.caption)}"></label></div>
        <button type="button" class="admin-button-secondary" data-file-preview>${c.t('Предпросмотр')}</button></article>`).join('')
        : `<div class="admin-workbench-empty"><h2>${c.t('Файлы ещё не выбраны')}</h2><p>${c.t('Добавьте сканы и укажите, к какому локальному черновику они относятся.')}</p></div>`;
    }
    input.addEventListener('change', async () => {
      const selected = Array.from(input.files);
      input.disabled = true;
      errors.textContent = '';
      status(result, c.t('Проверяем выбранные файлы…'));
      let added = 0;
      for (const file of selected) {
        if (!body.isConnected || owner !== user.id) break;
        try {
          if (files.length >= 20 || files.reduce((sum, item) => sum + item.file.size, 0) + file.size > 50 * 1024 * 1024) throw new Error('Превышен лимит очереди.');
          if (files.some(item => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified)) throw new Error('Файл уже добавлен.');
          const format = await inspectFile(file);
          if (!body.isConnected || owner !== user.id) break;
          files.push({ id: crypto.randomUUID(), file, format, relation: defaultRelation, caption: '' });
          added++;
        } catch (error) {
          if (!body.isConnected) break;
          const li = document.createElement('li');
          li.textContent = file.name + ': ' + c.t(error.message);
          errors.append(li);
        }
      }
      input.disabled = false;
      input.value = '';
      status(result, c.t('Добавлено файлов') + ': ' + added, Boolean(errors.children.length));
      renderList();
    });
    list.addEventListener('change', event => {
      const item = files.find(file => file.id === event.target.closest('[data-file-id]')?.dataset.fileId);
      if (!item) return;
      if (event.target.matches('[data-file-relation]')) item.relation = event.target.value;
    });
    list.addEventListener('input', event => {
      const item = files.find(file => file.id === event.target.closest('[data-file-id]')?.dataset.fileId);
      if (item && event.target.matches('[data-file-caption]')) item.caption = event.target.value;
    });
    list.addEventListener('click', event => {
      const item = files.find(file => file.id === event.target.closest('[data-file-id]')?.dataset.fileId);
      if (!item) return;
      if (event.target.closest('[data-file-remove]')) {
        openDialog(c, c.t('Удалить из локальной очереди?'), `<p>${c.t('Исходный файл на компьютере останется.')}</p><form method="dialog" class="admin-content-actions"><button value="cancel" class="admin-button-secondary">${c.t('Отмена')}</button><button value="remove">${c.t('Удалить')}</button></form>`, value => {
          if (value !== 'remove' || !body.isConnected) return;
          files = files.filter(file => file.id !== item.id);
          renderList();
          input.focus();
        });
      }
      if (event.target.closest('[data-file-preview]')) {
        const url = URL.createObjectURL(item.file);
        const preview = ['jpg', 'jpeg', 'png'].includes(item.format)
          ? `<img class="admin-workbench-image" src="${url}" alt="${c.esc(item.caption || item.file.name)}">`
          : `<p>${c.t(item.format === 'pdf' ? 'PDF можно открыть в отдельной вкладке.' : 'Предпросмотр TIFF в браузере не поддерживается. Скачайте исходный файл.')}</p>${item.format === 'pdf' ? `<p><a href="${url}" target="_blank" rel="noopener">${c.t('Открыть PDF')} ↗</a></p>` : ''}`;
        const dialog = openDialog(c, item.file.name, `${preview}<a href="${url}" download="${c.esc(item.file.name)}">${c.t('Скачать исходный файл')}</a>`, () => URL.revokeObjectURL(url));
        dialog.querySelector('img')?.addEventListener('error', event => {
          const error = document.createElement('p');
          error.setAttribute('role', 'status');
          error.textContent = c.t('Не удалось показать изображение. Скачайте исходный файл.');
          event.target.replaceWith(error);
        });
      }
    });
    manifest.addEventListener('click', () => {
      downloadJSON(c, 'archive-local-files.json', { format: 'archive-local-file-manifest', version: 1, localOnly: true, files: files.map(fileMetadata) });
      status(result, c.t('Файл черновика подготовлен для скачивания.'));
    });
    renderList();
  }

  function newMaterial() {
    const item = { id: crypto.randomUUID(), kind: 'page', original: 'ru', source: '', category: '', versions: Object.fromEntries(locales.map(locale => [locale, { title: '', text: '', reviewed: false }])), savedSignature: '', readySignature: '' };
    materials.set(item.id, item);
    return item;
  }

  function signature(item) {
    return JSON.stringify([item.kind, item.original, item.source, item.category, item.versions,
      files.filter(file => file.relation === 'content:' + item.id).map(fileMetadata)]);
  }

  function materialTitle(item, language) {
    return item.versions[language].title || item.versions[item.original].title;
  }

  function materialState(c, item) {
    if (signature(item) === item.readySignature) return c.t('Готов к передаче');
    return c.t(signature(item) === item.savedSignature ? 'Локальный черновик' : 'Есть несохранённые изменения');
  }

  function updateVersion(item, locale, title, text) {
    const version = item.versions[locale];
    if (title === version.title && text === version.text) return;
    version.title = title;
    version.text = text;
    version.reviewed = false;
    if (locale === item.original) for (const entry of Object.values(item.versions)) entry.reviewed = false;
  }

  function versionsSummary(c, item) {
    return `<ul class="admin-workbench-languages">${locales.map(locale => `<li><strong>${locale.toUpperCase()}</strong><span>${c.t(locale === item.original ? 'Оригинал' : item.versions[locale].reviewed ? 'Проверено редактором' : item.versions[locale].title.trim() && item.versions[locale].text.trim() ? 'Заполнено' : 'Не заполнено')}</span></li>`).join('')}</ul>`;
  }

  function content(main, language, user) {
    const c = context(main, language, user, ['content.create', 'content.publish']);
    if (!c) return;
    const body = shell(c, 'Публикации сайта', 'Подготовьте текст, источник и языковые версии перед передачей редактору.');
    const params = new URLSearchParams(location.hash.split('?')[1]);
    const selected = params.get('material');
    const item = materials.get(selected);
    if (selected && !item) {
      body.innerHTML = `<p role="status">${c.t('Материал не найден в этой вкладке.')}</p><a href="#/admin/content">${c.t('Список')}</a>`;
      return;
    }
    body.innerHTML = `<div class="admin-workbench-links"><button type="button" data-content-create>${c.t('Создать материал')}</button>${item ? `<a href="#/admin/content">← ${c.t('Список')}</a>` : ''}</div><div data-content-area></div>`;
    body.querySelector('[data-content-create]').addEventListener('click', () => { const draft = newMaterial(); location.hash = '#/admin/content?material=' + draft.id; });
    const area = body.querySelector('[data-content-area]');
    if (!item) {
      area.innerHTML = `<section class="admin-panel"><h2>${c.t('Локальные материалы')}</h2><div class="admin-content-tools"><label>${c.t('Поиск по заголовку')}<input type="search" maxlength="300" data-content-search></label><label>${c.t('Тип')}<select data-content-kind><option value="">${c.t('Все типы')}</option>${options(Object.keys(kinds), '', key => c.t(kinds[key]))}</select></label></div><div data-content-list></div></section>`;
      const list = area.querySelector('[data-content-list]');
      function filter() {
        const query = area.querySelector('[data-content-search]').value.trim().toLocaleLowerCase(language);
        const kind = area.querySelector('[data-content-kind]').value;
        const items = [...materials.values()].filter(entry => (!kind || entry.kind === kind) && (!query || Object.values(entry.versions).some(version => version.title.toLocaleLowerCase(language).includes(query))));
        list.innerHTML = items.length ? items.map(entry => `<article class="admin-content-row"><div><span class="admin-content-type">${c.t(kinds[entry.kind])}</span><h3><a href="#/admin/content?material=${entry.id}">${c.esc(materialTitle(entry, language) || c.t('Новый материал'))}</a></h3>${versionsSummary(c, entry)}</div><span class="admin-badge">${materialState(c, entry)}</span></article>`).join('')
          : `<div class="admin-workbench-empty"><h3>${c.t(materials.size ? 'Ничего не найдено.' : 'Нет локальных материалов')}</h3><p>${c.t('Создайте материал, затем добавьте текст и переводы.')}</p></div>`;
      }
      area.querySelector('[data-content-search]').addEventListener('input', filter);
      area.querySelector('[data-content-kind]').addEventListener('change', filter);
      filter();
      return;
    }
    let editLocale = item.original;
    area.innerHTML = `<div class="admin-workbench-grid"><section class="admin-panel"><form class="admin-content-form" data-content-form novalidate>
      <div class="admin-workbench-fields"><label>${c.t('Тип')}<select name="kind">${options(Object.keys(kinds), item.kind, key => c.t(kinds[key]))}</select></label><label>${c.t('Язык оригинала')}<select name="original">${options(locales, item.original, key => localeLabels[key])}</select></label></div>
      <label>${c.t('Языковая версия')}<select name="locale">${options(locales, editLocale, key => localeLabels[key])}</select></label>
      ${field(c, 'title', 'Заголовок', item.versions[editLocale].title, { required: true })}${field(c, 'text', 'Текст', item.versions[editLocale].text, { long: true, rows: 10 })}${field(c, 'source', 'Источник', item.source, { long: true, rows: 2 })}${field(c, 'category', 'Категория', item.category)}
      <p class="admin-live-message" data-content-status role="status" aria-live="polite"></p><div class="admin-content-actions"><button type="submit">${c.t('Сохранить локальный черновик')}</button><button type="button" class="admin-button-secondary" data-content-preview>${c.t('Предпросмотр')}</button><button type="button" class="admin-button-secondary" data-content-ready>${c.t('Проверить готовность')}</button><button type="button" class="admin-button-secondary" data-content-export>${c.t('Скачать черновик')}</button></div></form></section>
      <aside class="admin-panel"><h2>${c.t('Переводы')}</h2><div data-content-versions>${versionsSummary(c, item)}</div><a class="admin-content-link" href="#/admin/translations?material=${item.id}">${c.t('Перейти к переводам')} →</a><p class="admin-muted">${c.t('Изменение текста снимает отметку проверки перевода.')}</p><a class="admin-content-link" href="#/admin/files?material=${item.id}">${c.t('Добавить файлы')} →</a></aside></div>`;
    const form = area.querySelector('form');
    const result = form.querySelector('[data-content-status]');
    const title = form.elements.namedItem('title');
    const text = form.elements.namedItem('text');
    function read() {
      updateVersion(item, editLocale, title.value, text.value);
      item.source = form.elements.namedItem('source').value;
      item.category = form.elements.namedItem('category').value;
      item.kind = form.elements.namedItem('kind').value;
      area.querySelector('[data-content-versions]').innerHTML = versionsSummary(c, item);
      status(result, materialState(c, item));
    }
    form.addEventListener('input', () => { title.setCustomValidity(''); read(); });
    form.elements.namedItem('locale').addEventListener('change', event => {
      read();
      editLocale = event.target.value;
      title.value = item.versions[editLocale].title;
      text.value = item.versions[editLocale].text;
      title.setCustomValidity('');
    });
    form.elements.namedItem('original').addEventListener('change', event => {
      read();
      item.original = event.target.value;
      for (const version of Object.values(item.versions)) version.reviewed = false;
      read();
    });
    function validTitle() {
      title.setCustomValidity(title.value.trim() ? '' : c.t('Заголовок'));
      return form.reportValidity();
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); read();
      if (!validTitle()) return;
      item.savedSignature = signature(item);
      status(result, c.t('Черновик сохранён в памяти вкладки.'));
    });
    form.querySelector('[data-content-preview]').addEventListener('click', () => {
      read();
      if (!validTitle()) return;
      openDialog(c, c.t('Предпросмотр'), `<article class="admin-workbench-publication" lang="${editLocale}"><p>${c.t(kinds[item.kind])} · ${editLocale.toUpperCase()}</p><h2>${c.esc(title.value)}</h2><div>${c.esc(text.value)}</div><p><strong>${c.t('Источник')}:</strong> ${c.esc(item.source || '—')}</p></article>`);
    });
    form.querySelector('[data-content-ready]').addEventListener('click', () => {
      read();
      const original = item.versions[item.original];
      if (!original.title.trim() || !original.text.trim() || !item.source.trim()) {
        status(result, c.t('Заполните заголовок, текст и источник оригинала.'), true);
        if (!original.title.trim() || !original.text.trim()) {
          editLocale = item.original;
          form.elements.namedItem('locale').value = editLocale;
          title.value = original.title;
          text.value = original.text;
          (!original.title.trim() ? title : text).focus();
        } else form.elements.namedItem('source').focus();
        return;
      }
      if (files.some(file => file.relation === 'content:' + item.id && !file.caption.trim())) {
        status(result, c.t('В связанных файлах не заполнена подпись и источник.'), true);
        return;
      }
      item.savedSignature = item.readySignature = signature(item);
      status(result, c.t('Поля оригинала заполнены. Скачайте черновик для передачи редактору. Публикация не выполнялась.'));
    });
    form.querySelector('[data-content-export]').addEventListener('click', () => {
      read();
      if (!validTitle()) return;
      exportDraft(c, 'content', item.id, materialPayload(item), 'content:' + item.id);
      status(result, c.t('Файл черновика подготовлен для скачивания.'));
    });
    status(result, materialState(c, item));
  }

  function materialPayload(item) {
    return { localId: item.id, kind: item.kind, originalLocale: item.original, source: item.source, category: item.category, versions: item.versions, readyForHandoff: signature(item) === item.readySignature };
  }

  function translations(main, language, user) {
    const c = context(main, language, user, ['content.create', 'content.publish']);
    if (!c) return;
    const body = shell(c, 'Редактор переводов', 'Выберите локальный материал. Переводы вводятся и проверяются сотрудником.');
    if (!materials.size) {
      body.innerHTML = `<section class="admin-panel admin-workbench-empty"><h2>${c.t('Нет локальных материалов')}</h2><p>${c.t('Создайте материал, затем добавьте текст и переводы.')}</p><a href="#/admin/content">${c.t('Публикации сайта')} →</a></section>`;
      return;
    }
    const params = new URLSearchParams(location.hash.split('?')[1]);
    const selected = params.get('material');
    if (selected && !materials.has(selected)) {
      body.innerHTML = `<p role="status">${c.t('Материал не найден в этой вкладке.')}</p><a href="#/admin/content">${c.t('Список')}</a>`;
      return;
    }
    const item = materials.get(selected) || materials.values().next().value;
    const available = locales.filter(locale => locale !== item.original);
    let target = available.includes(params.get('locale')) ? params.get('locale') : available[0];
    const canReview = user.permissions.includes('content.publish') || user.permissions.includes('moderation.review');
    body.innerHTML = `<section class="admin-panel"><div class="admin-content-tools"><label>${c.t('Материал')}<select data-translation-material>${[...materials].map(([id, entry]) => `<option value="${id}"${id === item.id ? ' selected' : ''}>${c.esc(materialTitle(entry, language) || c.t('Новый материал'))}</option>`).join('')}</select></label><label>${c.t('Язык перевода')}<select data-translation-locale>${options(available, target, key => localeLabels[key])}</select></label></div>
      <form data-translation-form novalidate><div class="admin-workbench-translation-grid"><section><h2>${c.t('Оригинал')} · ${item.original.toUpperCase()}</h2><div class="admin-workbench-original" lang="${item.original}"><h3>${c.esc(item.versions[item.original].title || '—')}</h3><p>${c.esc(item.versions[item.original].text || '—')}</p></div></section><section><h2 data-translation-heading>${c.t('Перевод')} · ${target.toUpperCase()}</h2><div class="admin-content-form">
      ${field(c, 'title', 'Заголовок', item.versions[target].title, { required: true })}${field(c, 'text', 'Текст', item.versions[target].text, { required: true, long: true, rows: 10 })}
      <label class="admin-content-check"><input name="reviewed" type="checkbox"${canReview ? '' : ' disabled'}${item.versions[target].reviewed ? ' checked' : ''}>${c.t('Проверено редактором')}</label></div><p class="admin-muted">${c.t(canReview ? 'Изменение текста снимает отметку проверки перевода.' : 'Проверку перевода отмечает редактор с соответствующими правами.')}</p></section></div>
      <p role="status" aria-live="polite" class="admin-live-message" data-translation-status></p><div class="admin-content-actions"><button type="submit">${c.t('Сохранить перевод локально')}</button><a href="#/admin/content?material=${item.id}">${c.t('К материалу')} →</a></div></form></section>`;
    body.querySelector('[data-translation-material]').addEventListener('change', event => { location.hash = '#/admin/translations?material=' + event.target.value; });
    const form = body.querySelector('form[data-translation-form]');
    const title = form.elements.namedItem('title');
    const text = form.elements.namedItem('text');
    const reviewed = form.elements.namedItem('reviewed');
    const result = form.querySelector('[data-translation-status]');
    function read() {
      updateVersion(item, target, title.value, text.value);
      reviewed.checked = item.versions[target].reviewed;
      status(result, materialState(c, item));
    }
    form.addEventListener('input', event => {
      if (event.target === reviewed) return;
      title.setCustomValidity(''); text.setCustomValidity(''); read();
    });
    reviewed.addEventListener('change', () => {
      if (!canReview) return;
      const original = item.versions[item.original];
      if (!original.title.trim() || !original.text.trim()) {
        reviewed.checked = false;
        status(result, c.t('Сначала заполните оригинал материала.'), true);
        return;
      }
      if (!title.value.trim() || !text.value.trim()) {
        reviewed.checked = false;
        status(result, c.t('Заполните заголовок и текст перевода.'), true);
        return;
      }
      item.versions[target].reviewed = reviewed.checked;
      status(result, materialState(c, item));
    });
    body.querySelector('[data-translation-locale]').addEventListener('change', event => {
      read();
      target = event.target.value;
      title.value = item.versions[target].title;
      text.value = item.versions[target].text;
      reviewed.checked = item.versions[target].reviewed;
      title.setCustomValidity(''); text.setCustomValidity('');
      body.querySelector('[data-translation-heading]').textContent = c.t('Перевод') + ' · ' + target.toUpperCase();
    });
    form.addEventListener('submit', event => {
      event.preventDefault(); read();
      title.setCustomValidity(title.value.trim() ? '' : c.t('Заполните заголовок и текст перевода.'));
      text.setCustomValidity(text.value.trim() ? '' : c.t('Заполните заголовок и текст перевода.'));
      if (!form.reportValidity()) return;
      item.savedSignature = signature(item);
      status(result, c.t('Черновик сохранён в памяти вкладки.'));
    });
    status(result, materialState(c, item));
  }

  window.addEventListener('beforeunload', event => {
    const changedRecords = [...records.values()].some(draft => JSON.stringify(draft.values) !== JSON.stringify(draft.before));
    const enteredMaterials = [...materials.values()].some(item => item.source || Object.values(item.versions).some(version => version.title || version.text));
    if (!files.length && !changedRecords && !enteredMaterials) return;
    event.preventDefault();
    event.returnValue = '';
  });

  window.archiveWorkbench = { record, files: filesScreen, content, translations, clear };
}());
