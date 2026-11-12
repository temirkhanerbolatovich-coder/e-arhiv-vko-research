const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const toolsRoot = process.env.ARCHIVE_BROWSER_TOOLS || path.resolve(__dirname, '../../tools/docs');
const puppeteer = require(require.resolve('puppeteer', { paths: [toolsRoot] }));

const origin = 'http://127.0.0.1:4173/';
const artifacts = require('node:fs').mkdtempSync(path.join(os.tmpdir(), 'archive-workbench-'));
require('node:fs').writeFileSync(path.join(artifacts, 'scan.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'));
require('node:fs').writeFileSync(path.join(artifacts, 'spoof.png'), '<html><script>alert(1)</script></html>');
require('node:fs').writeFileSync(path.join(artifacts, 'empty.pdf'), '');
console.log('Browser artifacts:', artifacts);

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    const writes = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.url().includes('/api/v1/') && request.method() !== 'GET') writes.push([request.method(), new URL(request.url()).pathname]);
    });
    await page.setViewport({ width: 1440, height: 1000 });
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: artifacts });
    const go = async route => {
      await page.goto(origin + '#/admin/' + route, { waitUntil: 'networkidle0' });
    };
    const fill = async (selector, value) => {
      await page.$eval(selector, (element, value) => { element.value = value; element.dispatchEvent(new Event('input', { bubbles: true })); }, value);
    };
    const downloaded = async name => {
      for (let attempt = 0; attempt < 30; attempt++) {
        try { return JSON.parse(await fs.readFile(path.join(artifacts, name), 'utf8')); }
        catch { await new Promise(resolve => setTimeout(resolve, 100)); }
      }
      throw new Error('Download did not complete: ' + name);
    };
    await go('login');
    await page.waitForSelector('#admin-login');
    await page.type('#admin-login [name=password]', 'archive-demo-2026');
    await page.click('#admin-login button');
    await page.waitForSelector('.admin-workspace');
    await go('catalogue');
    await page.waitForSelector('[data-admin-catalog-list] li a.admin-content-link');
    const editURL = await page.$eval('[data-admin-catalog-list] li a.admin-content-link', element => element.href);
    const recordId = new URLSearchParams(editURL.split('?')[1]).get('record');
    const original = await page.evaluate(async id => (await (await fetch('/api/v1/resources/' + encodeURIComponent(id))).json()).resource, recordId);
    await page.click('[data-admin-catalog-list] li a.admin-content-link');
    await page.waitForSelector('[data-record-form]');
    const hostileTitle = '<img src=x onerror="window.workbenchXss=true"> — локальная правка';
    await fill('[data-record-form] [name=title]', hostileTitle);
    await fill('[data-record-form] [name=yearFrom]', '2020');
    await fill('[data-record-form] [name=yearTo]', '1900');
    await page.click('[data-record-form] [type=submit]');
    assert.ok(await page.$eval('[name=yearTo]', element => element.validity.customError));
    await fill('[data-record-form] [name=yearFrom]', '1900');
    await fill('[data-record-form] [name=yearTo]', '2000');
    await page.click('[data-record-form] [type=submit]');
    assert.match(await page.$eval('[data-record-status]', element => element.textContent), /памяти вкладки/);
    await page.click('[data-record-preview]');
    await page.waitForSelector('dialog[open]');
    assert.equal(await page.$eval('dialog', element => element.querySelectorAll('img').length), 0);
    assert.match(await page.$eval('dialog', element => element.textContent), /onerror/);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-record-preview')), true);
    await page.click('[data-record-export]');
    const recordExport = await downloaded(`archive-record-${encodeURIComponent(recordId)}.json`);
    assert.equal(recordExport.localOnly, true);
    assert.equal(recordExport.payload.baseUpdatedAt, original.updatedAt);
    assert.equal(recordExport.payload.values.yearFrom, 1900);
    assert.equal(recordExport.payload.values.title, hostileTitle);
    await page.screenshot({ path: path.join(artifacts, 'record-desktop.png'), fullPage: true });
    await page.click('a[href^="#/admin/files?record="]');
    await page.waitForSelector('[data-local-files]');
    const upload = await page.$('[data-local-files]');
    await upload.uploadFile(path.join(artifacts, 'scan.png'), path.join(artifacts, 'spoof.png'), path.join(artifacts, 'empty.pdf'));
    await page.waitForFunction(() => !document.querySelector('[data-local-files]').disabled);
    assert.equal(await page.$$eval('[data-file-id]', elements => elements.length), 1);
    assert.equal(await page.$$eval('[data-file-errors] li', elements => elements.length), 2);
    assert.equal(await page.$eval('[data-file-relation]', element => element.value), 'record:' + recordId);
    await fill('[data-file-caption]', 'Тестовый скан · проверка интерфейса');
    await page.click('[data-file-preview]');
    await page.waitForFunction(() => document.querySelector('dialog img')?.naturalWidth === 1);
    await page.keyboard.press('Escape');
    await page.click('[data-file-manifest]');
    await page.waitForFunction(() => document.querySelector('[data-file-status]').textContent.includes('скачивания'));
    const manifest = await downloaded('archive-local-files.json');
    assert.equal(manifest.localOnly, true);
    assert.equal(manifest.files[0].relation, 'record:' + recordId);
    assert.equal(manifest.files[0].caption, 'Тестовый скан · проверка интерфейса');
    await page.click('[data-file-remove]');
    await page.click('dialog button[value=cancel]');
    assert.equal(await page.$$eval('[data-file-id]', elements => elements.length), 1);
    console.log('Record validation, safe preview, files, signatures, manifest and cancel: OK');

    await go('content');
    await page.waitForSelector('[data-content-create]');
    await page.click('[data-content-create]');
    await page.waitForSelector('[data-content-form]');
    const materialRoute = page.url().split('#/admin/')[1];
    const materialId = new URLSearchParams(materialRoute.split('?')[1]).get('material');
    await fill('[data-content-form] [name=title]', 'История региона');
    await page.click('[data-content-ready]');
    assert.match(await page.$eval('[data-content-status]', element => element.textContent), /Заполните/);
    await fill('[data-content-form] [name=text]', 'Тестовый текст <script>window.workbenchXss=true</script>');
    await fill('[data-content-form] [name=source]', 'Материал для проверки локального интерфейса');
    await page.select('[data-content-form] [name=locale]', 'kk');
    await fill('[data-content-form] [name=title]', 'Өңір тарихы');
    await fill('[data-content-form] [name=text]', 'Интерфейсті тексеруге арналған мәтін.');
    await page.select('[data-content-form] [name=locale]', 'ru');
    assert.equal(await page.$eval('[data-content-form] [name=title]', element => element.value), 'История региона');
    await page.click('[data-content-preview]');
    await page.waitForSelector('dialog[open]');
    assert.equal(await page.$eval('dialog', element => element.querySelectorAll('script').length), 0);
    await page.keyboard.press('Escape');
    await page.click('[data-content-ready]');
    assert.match(await page.$eval('[data-content-status]', element => element.textContent), /Публикация не выполнялась/);
    await page.click('[data-content-export]');
    const materialExport = await downloaded(`archive-content-${materialId}.json`);
    assert.equal(materialExport.localOnly, true);
    assert.equal(materialExport.payload.readyForHandoff, true);
    assert.equal(materialExport.payload.versions.kk.title, 'Өңір тарихы');
    await page.click('a[href^="#/admin/translations?material="]');
    await page.waitForSelector('[data-translation-form]');
    assert.equal(await page.$eval('[data-translation-form] [name=title]', element => element.value), 'Өңір тарихы');
    await page.click('[data-translation-form] [name=reviewed]');
    assert.equal(await page.$eval('[name=reviewed]', element => element.checked), true);
    await fill('[data-translation-form] [name=text]', 'Өзгертілген мәтін.');
    assert.equal(await page.$eval('[name=reviewed]', element => element.checked), false);
    await page.click('[data-translation-form] [type=submit]');
    await page.select('[data-translation-locale]', 'en');
    await fill('[data-translation-form] [name=title]', 'Regional history');
    await fill('[data-translation-form] [name=text]', 'Text for a local interface check.');
    await page.select('[data-translation-locale]', 'kk');
    assert.equal(await page.$eval('[data-translation-form] [name=text]', element => element.value), 'Өзгертілген мәтін.');
    assert.equal(await page.evaluate(() => window.workbenchXss), undefined);
    await page.screenshot({ path: path.join(artifacts, 'translations-desktop.png'), fullPage: true });

    // A new attachment invalidates previous readiness and needs provenance.
    await go('files?material=' + materialId);
    await page.waitForSelector('[data-file-relation]');
    await page.select('[data-file-relation]', 'content:' + materialId);
    await fill('[data-file-caption]', '');
    await go(materialRoute);
    await page.waitForSelector('[data-content-ready]');
    await page.click('[data-content-ready]');
    assert.match(await page.$eval('[data-content-status]', element => element.textContent), /В связанных файлах/);

    for (const [width, locale, scale, theme] of [[1440, 'ru', 100, 'light'], [390, 'en', 100, 'dark'], [320, 'kk', 200, 'light']]) {
      await page.setViewport({ width, height: 1000 });
      if (await page.evaluate(() => document.documentElement.dataset.theme) !== theme) await page.click('#theme-toggle');
      for (let attempt = 0; attempt < 4 && await page.evaluate(() => document.documentElement.dataset.fontScale) !== String(scale); attempt++) await page.click('#font-toggle');
      assert.equal(await page.evaluate(() => document.documentElement.dataset.fontScale), String(scale));
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), theme);
      await page.select('#language', locale);
      for (const route of ['catalogue?record=' + encodeURIComponent(recordId), 'files', materialRoute, 'translations?material=' + materialId]) {
        await go(route);
        const selector = route.startsWith('catalogue') ? '[data-record-form]' : route === 'files' ? '[data-local-files]' : route.startsWith('content') ? '[data-content-form]' : '[data-translation-form]';
        await page.waitForSelector(selector);
        const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        assert.ok(overflow.scroll <= overflow.width + 1, JSON.stringify({ route, locale, scale, overflow }));
      }
      await page.screenshot({ path: path.join(artifacts, `translations-${width}-${locale}-${scale}.png`), fullPage: true });
    }
    await page.setViewport({ width: 1440, height: 1000 });
    await page.select('#language', 'ru');
    await go('files');
    await page.waitForSelector('[data-file-remove]');
    await page.click('[data-file-remove]');
    await page.click('dialog button[value=remove]');
    await page.waitForFunction(() => !document.querySelector('[data-file-id]'));
    assert.equal(await page.$$eval('[data-file-id]', elements => elements.length), 0);
    const after = await page.evaluate(async id => (await (await fetch('/api/v1/resources/' + encodeURIComponent(id))).json()).resource, recordId);
    assert.deepEqual(after, original);
    assert.deepEqual(writes.filter(([, route]) => !route.endsWith('/login') && !route.endsWith('/logout')), []);
    await page.click('#admin-logout');
    await page.waitForSelector('#admin-login');
    await page.type('#admin-login [name=password]', 'archive-demo-2026');
    await page.click('#admin-login button');
    await page.waitForSelector('.admin-workspace');
    await go('content');
    await page.waitForSelector('[data-content-create]');
    assert.equal(await page.$eval('[data-content-list]', element => element.querySelectorAll('article').length), 0);
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('[data-content-list]', element => element.querySelectorAll('article').length), 0);
    assert.deepEqual(errors, []);
    console.log('Content, translations, review reset, attachment readiness, RU/KK/EN reflow, logout and no server writes: OK');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
