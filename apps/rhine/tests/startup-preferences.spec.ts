import { test, expect, type Page } from '@playwright/test';

const stats = (page: Page) => page.evaluate(() => (window as any).rhine.stats());

test('entry preferences work before starting and persist when muted', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.entry-start')).toBeEnabled();
  await expect(page.locator('.opening-grid')).toBeHidden();
  await page.screenshot({ path: 'test-results/entry-collapsed.png' });
  await page.locator('.opening-controls summary').click();
  await expect(page.locator('#entry-speed')).toHaveValue('2');
  await expect(page.locator('#entry-quality')).toHaveValue('quality');
  await page.locator('#entry-language').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');
  await expect(page.locator('.entry-start')).toBeEnabled();
  await expect(page.locator('.opening-grid')).toBeVisible();
  expect((await stats(page)).startup).toBe('waiting');
  await page.locator('#entry-theme').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface', 'true');
  expect(await page.locator('.loading').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(17, 24, 27)');
  await page.locator('#entry-quality').selectOption('performance');
  await page.locator('#entry-speed').selectOption('3');
  await page.locator('[data-entry-mute]').click();
  await expect(page.locator('[data-entry-mute]')).toHaveAttribute('aria-pressed', 'true');
  expect((await stats(page)).startup).toBe('waiting');
  await page.screenshot({ path: 'test-results/entry-desktop-dark-en.png' });
  await page.reload();
  await expect(page.locator('.entry-start')).toBeEnabled();
  await expect(page.locator('.opening-grid')).toBeHidden();
  await page.screenshot({ path: 'test-results/entry-collapsed.png' });
  await page.locator('.opening-controls summary').click();
  await expect(page.locator('#entry-speed')).toHaveValue('3');
  await expect(page.locator('#entry-quality')).toHaveValue('performance');
  await expect(page.locator('[data-entry-mute]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.entry-start').click();
  expect((await stats(page)).audio.state).not.toBe('running');
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'boot');
  await page.locator('.opening-controls summary').click();
  const before = (await stats(page)).bootTime;
  await page.locator('#entry-language').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'boot');
  await expect(page.locator('.entry-start')).toHaveCount(0);
  expect((await stats(page)).bootTime).toBeGreaterThanOrEqual(before - .2);
});

test('animation speed changes the opening clock continuously and is available in settings', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.entry-start')).toBeEnabled();
  await expect(page.locator('.opening-grid')).toBeHidden();
  await page.screenshot({ path: 'test-results/entry-collapsed.png' });
  await page.locator('.opening-controls summary').click();
  await page.locator('[data-entry-mute]').click();
  await page.locator('.entry-start').click();
  await page.locator('.opening-controls summary').click();
  for (const speed of [1, 3]) {
    const before = (await stats(page)).bootTime;
    await page.locator('#entry-speed').selectOption(String(speed));
    const after = (await stats(page)).bootTime;
    expect(after - before).toBeLessThan(1);
    const elapsed = await page.evaluate(async () => {
      const start = performance.now(), boot = (window as any).rhine.stats().bootTime;
      await new Promise(resolve => setTimeout(resolve, 600));
      return { seconds: (performance.now() - start) / 1000, progress: (window as any).rhine.stats().bootTime - boot };
    });
    expect(elapsed.progress / elapsed.seconds).toBeCloseTo(speed, 1);
  }
  await page.locator('.opening-controls summary').click();
  await page.locator('#skip').click();
  await expect(page.locator('.opening-controls')).toBeHidden();
  await page.locator('[data-action="settings"]').click();
  await expect(page.locator('#animation-speed')).toHaveValue('3');
  await page.locator('#animation-speed').selectOption('1');
  expect((await stats(page)).motion.speed).toBe(1);
});

for (const [name, width, height] of [['phone', 390, 844], ['phone-landscape', 844, 390], ['tablet', 820, 1180]] as const) {
  test(`${name} defaults to performance and keeps entry controls accessible`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL:'http://127.0.0.1:5175', locale:'en-AU', viewport:{width,height}, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('.entry-start')).toBeEnabled();
  await expect(page.locator('.opening-grid')).toBeHidden();
  await page.screenshot({ path: 'test-results/entry-collapsed.png' });
  await page.locator('.opening-controls summary').click();
    await expect(page.locator('#entry-quality')).toHaveValue('performance');
    const result = await stats(page);
    expect(result.superPerformance).toBe(true);
    expect(result.performanceMaterials).toBeGreaterThan(0);
    await page.locator('#entry-theme').selectOption('dark');
    await page.locator('[data-entry-mute]').click();
    await page.screenshot({path:`test-results/entry-${name}.png`});
    for (const selector of ['#entry-language','#entry-theme','#entry-quality','#entry-speed','[data-entry-mute]']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      const box = (await page.locator(selector).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
    }
    await page.locator('#entry-quality').selectOption('quality');
    await page.reload();
    await expect(page.locator('#entry-quality')).toHaveValue('quality');
    await page.locator('.opening-controls summary').click();
    await page.locator('#entry-quality').selectOption('performance');
    await page.locator('.entry-start').click();
    await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
    expect(await page.locator('.archive-callout').evaluate(el=>getComputedStyle(el).backdropFilter)).toBe('none');
    await context.close();
  });
}
