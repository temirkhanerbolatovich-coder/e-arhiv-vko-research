const assert = require('node:assert/strict');
const path = require('node:path');
const toolsRoot = process.env.ARCHIVE_BROWSER_TOOLS || path.resolve(__dirname, '../../tools/docs');
const puppeteer = require(require.resolve('puppeteer', { paths: [toolsRoot] }));
const origin = 'http://127.0.0.1:4173/';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const errors = [];
    async function login(role) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(origin + '#/admin/content', { waitUntil: 'networkidle0' });
      await page.waitForSelector('#admin-login');
      assert.equal(await page.$('.admin-workbench'), null);
      await page.$eval('#admin-login [name=email]', (element, value) => { element.value = value; }, role + '@archive.demo');
      await page.type('#admin-login [name=password]', 'archive-demo-2026');
      await page.click('#admin-login button');
      await page.waitForSelector('#admin-logout');
      return { page, context };
    }
    for (const role of ['analyst', 'ridder', 'archivist', 'editor']) {
      const { page, context } = await login(role);
      if (role === 'analyst') {
        for (const route of ['files', 'content', 'translations', 'catalogue?record=photo-2725']) {
          await page.goto(origin + '#/admin/' + route, { waitUntil: 'networkidle0' });
          await page.waitForFunction(() => document.querySelector('.admin-main')?.textContent.includes('Для этого раздела у вашей роли нет прав.'));
          assert.equal(await page.$('.admin-workbench'), null);
        }
      } else if (role === 'ridder') {
        await page.goto(origin + '#/admin/catalogue?record=photo-2725', { waitUntil: 'networkidle0' });
        await page.waitForFunction(() => document.querySelector('[data-workbench-body]')?.textContent.includes('вне вашей области'));
        assert.equal(await page.$('[data-record-form]'), null);
      } else {
        await page.goto(origin + '#/admin/content', { waitUntil: 'networkidle0' });
        await page.waitForSelector('[data-content-create]');
        await page.click('[data-content-create]');
        await page.waitForSelector('[data-content-form]');
        await page.$eval('[data-content-form] [name=title]', element => { element.value = 'Проверка роли'; element.dispatchEvent(new Event('input', { bubbles: true })); });
        await page.click('a[href^="#/admin/translations?material="]');
        await page.waitForSelector('[name=reviewed]');
        assert.equal(await page.$eval('[name=reviewed]', element => element.disabled), role === 'archivist');
        await page.goto(origin + '#/admin/files', { waitUntil: 'networkidle0' });
        await page.waitForSelector('[data-local-files]');
      }
      await context.close();
    }
    const { page, context } = await login('admin');
    await page.setRequestInterception(true);
    let rejectResource = true;
    page.on('request', request => {
      if (request.url().endsWith('/api/v1/resources/photo-2725') && rejectResource) return request.respond({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Test failure' }) });
      request.continue();
    });
    await page.goto(origin + '#/admin/catalogue?record=photo-2725', { waitUntil: 'networkidle0' });
    await page.waitForSelector('[data-retry]');
    rejectResource = false;
    await page.click('[data-retry]');
    await page.waitForSelector('[data-record-form]');
    await page.goto(origin + '#/admin/files', { waitUntil: 'networkidle0' });
    await page.waitForSelector('[data-local-files]');
    await page.$eval('[data-local-files]', input => {
      const selection = new DataTransfer();
      selection.items.add(new File([new Uint8Array(21 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' }));
      selection.items.add(new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'broken.png', { type: 'image/png' }));
      input.files = selection.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForFunction(() => !document.querySelector('[data-local-files]').disabled);
    assert.match(await page.$eval('[data-file-errors]', element => element.textContent), /20 МБ/);
    assert.equal(await page.$$eval('[data-file-id]', elements => elements.length), 1);
    await page.click('[data-file-preview]');
    await page.waitForFunction(() => document.querySelector('dialog')?.textContent.includes('Не удалось показать изображение.'));
    await page.keyboard.press('Escape');
    await context.close();
    assert.deepEqual(errors, []);
    console.log('Anonymous access, 4 roles, branch scope, retry, file size and broken-image state: OK');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
