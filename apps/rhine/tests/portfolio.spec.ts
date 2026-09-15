import { test, expect, type Page } from '@playwright/test';

async function enter(page: Page, skip = true) {
  await page.goto('/');
  const button = page.locator('.entry-start');
  await expect(button).toBeEnabled({ timeout: 45000 });
  await button.click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'boot');
  if (skip) {
    await page.locator('#skip').click();
    await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'archive');
  }
}

test('complete opening reaches the personal profile; navigation and viewer remain usable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await enter(page, false);
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'test-results/opening.png' });
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'detail', { timeout: 55000 });
  await page.waitForTimeout(3500);
  await expect(page.locator('#detail-content h2')).toHaveText('ZIZHEN LIU');
  await expect(page.locator('.portfolio-links a').first()).toHaveAttribute('href', 'https://github.com/zizhenliu0427');
  await page.screenshot({ path: 'test-results/profile.png' });
  await page.locator('[data-action="model-viewer"]').click();
  await expect(page.locator('#viewer-title')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#viewer-title')).toBeHidden();
  await page.locator('[data-action="back"]').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'archive');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'test-results/archive.png' });
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#column-name')).toContainText('实习经历');
  expect(errors).toEqual([]);
});

test('project search, links, notes, saved records and UTF-8 export use portfolio data', async ({ page, request }) => {
  await enter(page);
  await page.locator('[data-action="search"]').click();
  await page.locator('#archive-search').fill('Novacart');
  await expect(page.locator('.result-row')).toHaveCount(1);
  await page.locator('.result-row').click();
  await expect(page.locator('#detail-content h2')).toHaveText('Novacart');
  const source = page.locator('.portfolio-links a');
  await expect(source).toHaveAttribute('href', 'https://github.com/zizhenliu0427/Novacart');
  await expect(source).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  expect(await page.locator('#viewport').evaluate(el => [el.scrollLeft, el.scrollTop])).toEqual([0, 0]);
  expect(await page.locator('#stage').evaluate(el => [el.scrollLeft, el.scrollTop])).toEqual([0, 0]);
  const stageBox = await page.locator('#stage').boundingBox();
  expect(Math.abs(stageBox!.x)).toBeLessThan(1);
  expect(Math.abs(stageBox!.y)).toBeLessThan(1);
  await page.screenshot({ path: 'test-results/project.png' });
  await page.locator('[data-tab="notes"]').click();
  await expect(page.locator('#tab-panel')).toContainText('Stripe');
  await page.locator('[data-action="bookmark"]').click();
  await expect(page.locator('#saved-count')).toHaveText('01');
  const download = await request.get((await page.locator('.export-button').getAttribute('href'))!);
  expect(download.ok()).toBeTruthy();
  expect(await download.text()).toContain('ZIZHEN LIU · PERSONAL ARCHIVE');
  expect(await download.text()).toContain('Novacart');
  expect(await download.text()).not.toContain('游戏');
  await page.locator('[data-action="saved"]').click();
  await expect(page.locator('.result-row')).toHaveCount(1);
  await expect(page.locator('.result-row')).toContainText('Novacart');
  await page.locator('[data-action="close-modal"]').click();
  await page.locator('[data-action="settings"]').click();
  await expect(page.locator('a[href="https://github.com/LBEILC/RhineLabUI"]')).toBeVisible();
  expect((await request.get('/licenses/RhineLabUI-MIT.txt')).ok()).toBeTruthy();
});

test('portrait reduced-motion browsing, contact and technology search', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5175', locale: 'zh-CN', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.entry-start')).toBeEnabled({ timeout: 45000 });
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'archive');
  await expect(page.locator('.contact-link')).toHaveAttribute('href', 'mailto:lzz288898@gmail.com');
  await page.screenshot({ path: 'test-results/mobile-archive.png' });
  await page.locator('[data-action="search"]').click();
  await page.locator('#archive-search').fill('Qdrant');
  expect(await page.locator('.result-row').count()).toBeGreaterThan(0);
  await page.locator('.result-row').filter({ hasText: '楼宇传感器 AI' }).click();
  await expect(page.locator('#detail-content')).toContainText('传感器');
  await page.screenshot({ path: 'test-results/mobile-detail.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await context.close();
});
