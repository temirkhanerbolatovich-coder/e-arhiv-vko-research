const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const toolsRoot = process.env.ARCHIVE_BROWSER_TOOLS || path.resolve(__dirname, '../../tools/docs');
const puppeteer = require(require.resolve('puppeteer', { paths: [toolsRoot] }));
const origin = 'http://127.0.0.1:4173/';

(async () => {
  const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-guestbook-'));
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(origin + '#/section/feedback', { waitUntil: 'networkidle0' });
    assert.match(await page.$eval('.guestbook-feed-state', element => element.textContent), /Публичная лента пока недоступна/);
    assert.equal(await page.$('.guestbook-message'), null);
    await page.click('[data-feedback-compose]');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'feedback-message');
    assert.ok(page.url().endsWith('#/section/feedback'));
    await page.type('#feedback-message', 'Черновик сообщения для проверки переходов');
    await page.click('[data-feedback-rules]');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'feedback-rules');
    assert.equal(await page.$eval('#feedback-message', element => element.value), 'Черновик сообщения для проверки переходов');

    await page.goto(origin + '#/section/feedback?preview=messages', { waitUntil: 'networkidle0' });
    assert.equal(await page.$$eval('.guestbook-message', elements => elements.length), 3);
    assert.ok(await page.$('.guestbook-reply'));
    await page.click('[data-feed-next]');
    assert.match(page.url(), /feed-page=2/);
    assert.match(await page.$eval('[data-feed-page]', element => element.textContent), /2 \/ 3/);
    assert.equal(await page.$eval('#feedback-message', element => element.value), 'Черновик сообщения для проверки переходов');
    await page.click('[data-feed-kind=wish]');
    assert.equal(await page.$$eval('.guestbook-message', elements => elements.length), 1);
    assert.equal(await page.$eval('.guestbook-feed-pagination', element => element.hidden), true);
    assert.ok(!page.url().includes('feed-page='));
    await page.select('#language', 'en');
    await page.waitForFunction(() => document.querySelector('.guestbook-preview-badge')?.textContent === 'Layout example');
    assert.equal(await page.$eval('[data-feed-kind=wish]', element => element.getAttribute('aria-pressed')), 'true');
    assert.equal(await page.$eval('#feedback-message', element => element.value), 'Черновик сообщения для проверки переходов');
    await page.click('[data-feed-kind=""]');
    await page.screenshot({ path: path.join(artifacts, 'guestbook-desktop.png'), fullPage: true });

    // The renderer only accepts a public projection and escapes all material text.
    await page.evaluate(() => {
      window.renderGuestbookFeed(document.querySelector('[data-guestbook-feed]'), 'en', { state: 'ready', items: [
        { status: 'pending', kind: 'review', message: 'PRIVATE-PENDING-MESSAGE', email: 'PRIVATE-EMAIL' },
        { status: 'published', kind: 'review', publicName: '<img src=x onerror=alert(1)>', message: '<script>window.feedXss=true</script>', publishedAt: '2026-11-12T08:00:00Z',
          email: 'PRIVATE-EMAIL', note: 'PRIVATE-NOTE', publicReply: { status: 'draft', message: 'PRIVATE-DRAFT-REPLY' } },
      ] });
    });
    assert.equal(await page.$$eval('.guestbook-message', elements => elements.length), 1);
    const text = await page.$eval('[data-guestbook-feed]', element => element.textContent);
    assert.ok(!text.includes('PRIVATE-'));
    assert.equal(await page.$eval('[data-guestbook-feed]', element => element.querySelectorAll('img,script').length), 0);
    assert.equal(await page.evaluate(() => window.feedXss), undefined);
    await page.click('[data-feed-kind=wish]');
    assert.equal(await page.$('.guestbook-message'), null);
    assert.match(await page.$eval('.guestbook-feed-state', element => element.textContent), /no messages in this category/);
    await page.evaluate(() => {
      window.renderGuestbookFeed(document.querySelector('[data-guestbook-feed]'), 'en', { state: 'loading' });
    });
    assert.match(await page.$eval('.guestbook-feed-state', element => element.textContent), /Loading messages/);
    await page.evaluate(() => {
      history.replaceState(null, '', '#/section/feedback');
      window.renderGuestbookFeed(document.querySelector('[data-guestbook-feed]'), 'en', { state: 'ready', items: [] });
    });
    assert.match(await page.$eval('.guestbook-feed-state', element => element.textContent), /No messages have been published/);
    await page.evaluate(() => {
      const container = document.querySelector('[data-guestbook-feed]');
      window.renderGuestbookFeed(container, 'en', { state: 'error', retry: () => { window.feedRetried = true; } });
    });
    await page.click('[data-feed-retry]');
    assert.equal(await page.evaluate(() => window.feedRetried), true);
    console.log('Guestbook states, filters, pagination, draft preservation and safe public projection: OK');

    for (const [width, locale, scale, theme] of [[1440, 'ru', '100', 'light'], [390, 'en', '100', 'dark'], [320, 'kk', '200', 'light']]) {
      await page.setViewport({ width, height: 1000 });
      await page.select('#language', locale);
      if (await page.evaluate(() => document.documentElement.dataset.theme) !== theme) await page.click('#theme-toggle');
      for (let attempt = 0; attempt < 4 && await page.evaluate(() => document.documentElement.dataset.fontScale) !== scale; attempt++) await page.click('#font-toggle');
      await page.goto(origin + '#/section/feedback?preview=messages', { waitUntil: 'networkidle0' });
      await page.waitForSelector('.guestbook-message');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Guestbook overflow: ' + width);
      await page.goto(origin + '#/section/branches?id=altay', { waitUntil: 'networkidle0' });
      await page.waitForSelector('.branches-building img');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Branch overflow: ' + width);
      assert.match(await page.$eval('.branches-building img', element => element.getAttribute('src')), /altay-exposition/);
      await page.$eval('.branches-building', element => element.scrollIntoView());
      await page.waitForFunction(() => document.querySelector('.branches-building img')?.naturalWidth > 0);
      await page.click('[data-branch=ridder]');
      await page.waitForSelector('.branches-photo-placeholder');
      assert.ok(await page.$('.branches-detail-list a[href^="tel:"]'));
      assert.equal(await page.$('.branches-building img'), null);
      await page.screenshot({ path: path.join(artifacts, `branch-${width}-${locale}-${scale}.png`), fullPage: true });
    }
    const failedPage = await browser.newPage();
    await failedPage.setRequestInterception(true);
    failedPage.on('request', request => request.url().includes('/assets/archive-building-preview.jpg')
      ? request.respond({ status: 404, contentType: 'text/plain', body: 'Test missing image' }) : request.continue());
    await failedPage.goto(origin + '#/section/branches?id=main', { waitUntil: 'networkidle0' });
    await failedPage.$eval('.branches-building', element => element.scrollIntoView());
    await failedPage.waitForSelector('[data-photo-state=error]');
    assert.ok(await failedPage.$('.branches-detail-list a[href^="tel:"]'));
    assert.equal(await failedPage.$('.branches-building img'), null);
    assert.equal(await page.evaluate(() => {
      const container = document.createElement('div');
      container.innerHTML = window.archiveBranchPhotos.render({ id: 'altay', originalBuilding: false }, 'en');
      return Boolean(container.querySelector('img'));
    }), false);
    await failedPage.close();
    assert.deepEqual(errors, []);
    console.log('Branch media, missing/failed images, changed address, languages and responsive layout: OK');
    console.log('Browser artifacts:', artifacts);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
