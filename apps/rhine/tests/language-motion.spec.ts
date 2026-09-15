import { test, expect } from '@playwright/test';
import { DecryptionController } from '../src/decryption';

test('language toggles preserve the live canvas throughout opening and file decryption', async ({ page }) => {
  const errors: string[] = [];
  let documents = 0, models = 0;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
    if (request.url().includes('.glb')) models++;
  });
  await page.addInitScript(() => localStorage.setItem('zl-archive-settings', JSON.stringify({sound:false,music:false,reduced:false,superPerformance:true})));
  await page.goto('/');
  await expect(page.locator('.entry-start')).toBeEnabled();
  const canvas = await page.locator('#three-scene canvas').elementHandle();
  const initialModels = models;
  const origin = await page.evaluate(() => performance.timeOrigin);
  await page.locator('.opening-controls summary').click();
  for (const lang of ['en-AU', 'zh-CN', 'en-AU']) {
    await page.locator('#entry-language').click();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('.entry-start')).toBeEnabled();
  }
  await page.locator('.entry-start').click();
  await page.locator('.opening-controls summary').click();
  await page.locator('#entry-language').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'boot');
  await expect(page.locator('.entry-start')).toHaveCount(0);
  await page.locator('.opening-controls summary').click();
  await page.locator('#skip').click();
  await expect(page.locator('#column-name')).toContainText('个人资料');
  await page.locator('#language-toggle').click();
  await expect(page.locator('#column-name')).toContainText('About me');
  await page.locator('.read-file').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode','detail');
  // Switch while the document is still being decrypted with full motion enabled.
  for (const lang of ['zh-CN', 'en-AU', 'zh-CN', 'en-AU']) {
    await page.locator('#language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang',lang);
    await expect(page.locator('#stage')).toHaveAttribute('data-mode','detail');
  }
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  await expect(page.locator('#tab-panel')).toContainText('complete products');
  await expect(page.locator('.system-nav a')).toHaveAttribute('aria-label', 'Contact Zizhen Liu');
  await expect(page.locator('[data-action="saved"]')).toHaveAttribute('aria-label', 'View saved archives');
  await page.locator('[data-tab="notes"]').click();
  await page.locator('#language-toggle').click();
  await expect(page.locator('[data-tab="notes"]')).toHaveAttribute('aria-selected','true');
  await expect(page.locator('#tab-panel')).not.toContainText('complete products');
  expect(await canvas!.evaluate(el => el.isConnected && el === document.querySelector('#three-scene canvas'))).toBe(true);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(origin);
  expect(documents).toBe(1);
  expect(models).toBe(initialModels);
  expect(errors).toEqual([]);
});

test('only active decryption speeds up; refrosting retains its original rate', () => {
  const duration = (speed: number) => {
    const decryption = new DecryptionController();
    decryption.enter(false);
    let elapsed = 0;
    while (decryption.frame.phase !== 'clear' && elapsed < 10) {
      decryption.update(1 / 120, true, false, undefined, speed);
      elapsed += 1 / 120;
    }
    expect(decryption.frame.phase).toBe('clear');
    decryption.leave();
    decryption.update(.05, false, false, undefined, speed);
    return { elapsed, clarity: decryption.clarity };
  };
  const normal = duration(1), fast = duration(3);
  expect(normal.elapsed / fast.elapsed).toBeCloseTo(3, 1);
  expect(normal.clarity).toBeCloseTo(fast.clarity, 8);
});

test('loading speed leaves modal transitions at their original duration', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('zl-archive-settings', JSON.stringify({sound:false,music:false,reduced:false,superPerformance:true}));
    const original = Element.prototype.animate;
    (window as any).recordedAnimations = [];
    Element.prototype.animate = function (keyframes, options) {
      if (this.matches('.modal-backdrop, .terminal-modal'))
        (window as any).recordedAnimations.push(typeof options === 'object' ? options?.duration : options);
      return original.call(this, keyframes, options);
    };
  });
  await page.goto('/');
  await page.locator('.entry-start').click();
  await page.locator('#skip').click();
  for (const speed of ['1','3']) {
    await page.locator('[data-action="settings"]').click();
    await page.locator('#animation-speed').selectOption(speed);
    await page.locator('[data-action="close-modal"]').click();
    await expect(page.locator('.modal-backdrop')).toBeHidden();
    await page.evaluate(() => (window as any).recordedAnimations.length = 0);
    await page.locator('[data-action="settings"]').click();
    expect(await page.evaluate(() => (window as any).recordedAnimations)).toEqual([300,300]);
    await page.locator('[data-action="close-modal"]').click();
    await expect(page.locator('.modal-backdrop')).toBeHidden();
    expect(await page.evaluate(() => (window as any).recordedAnimations)).toEqual([300,300,200,200]);
  }
});
