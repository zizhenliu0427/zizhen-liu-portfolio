import { test, expect } from '@playwright/test';
import archives from '../content/archives.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('zl-portfolio-locale', 'zh');
    if (!localStorage.getItem('zl-archive-settings')) localStorage.setItem('zl-archive-settings', JSON.stringify({ sound: false, music: false, reduced: false, superPerformance: true }));
  });
  await page.goto('/');
  await expect(page.locator('.entry-start')).toHaveText('进入个人网站 →');
  await page.locator('.entry-start').click();
  await page.locator('#skip').click();
});

test('native theme stays readable independently of the host system colour scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.locator('.read-file').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-color-theme="light"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface', 'false');
  // Run against the integrated Next build: its body colour follows the OS.
  // Rhine must own inherited text colour even when the host remains dark.
  for (const selector of ['#viewport', '.brand', '#detail-content h2', '.metadata dd', '.powered']) {
    await expect(page.locator(selector).first()).toHaveCSS('color', 'rgb(8, 10, 8)');
  }
  await expect(page.locator('#viewport')).toHaveCSS('color-scheme', 'light');
  await page.locator('[data-color-theme="dark"]').click();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('.brand')).toHaveCSS('color', 'rgb(224, 227, 220)');
  await expect(page.locator('#viewport')).toHaveCSS('color-scheme', 'dark');
  await page.locator('[data-color-theme="auto"]').click();
  await expect(page.locator('.brand')).toHaveCSS('color', 'rgb(8, 10, 8)');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('.brand')).toHaveCSS('color', 'rgb(224, 227, 220)');
  await page.locator('[data-color-theme="light"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface', 'false');
  await expect(page.locator('.brand')).toHaveCSS('color', 'rgb(8, 10, 8)');
});

test('hover caption has a theme-aware opaque panel with readable text', async ({ page }) => {
  for (const theme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await expect(page.locator('html')).toHaveAttribute('data-dark-surface', String(theme === 'dark'));
    await expect(page.locator('.brand')).toHaveCSS('color', theme === 'dark' ? 'rgb(224, 227, 220)' : 'rgb(8, 10, 8)');
    // Move across the actual canvas to trigger its picking and rolling label.
    for (const [x,y] of [[800,450],[1000,600],[650,650],[1150,450]]) {
      await page.mouse.move(x,y);
      if (await page.locator('#hover-label').isVisible()) break;
    }
    await expect(page.locator('#hover-label')).toBeVisible();
    const contrast = await page.locator('#hover-label').evaluate(el => {
      const luminance = (colour: string) => {
        const channels = colour.match(/[\d.]+/g)!.slice(0,3).map(v => {
          const c = Number(v)/255;
          return c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4;
        });
        return channels[0]*.2126 + channels[1]*.7152 + channels[2]*.0722;
      };
      const style = getComputedStyle(el);
      const fg = luminance(style.color), bg = luminance(style.backgroundColor);
      return { ratio: (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05), background: style.backgroundColor };
    });
    expect(contrast.background).not.toContain('rgba');
    expect(contrast.ratio).toBeGreaterThanOrEqual(7);
    await page.locator('#hover-label').screenshot({path:`test-results/hover-${theme}.png`});
  }
});

test('category order, full language decryption and removed utility controls', async ({ page }) => {
  for (const [index, name] of ['个人资料', '实习经历', 'Web 与应用', 'AI 与数据', '系统与硬件', '致谢'].entries()) {
    await expect(page.locator('#column-name')).toContainText(name);
    await expect(page.locator('#column-index')).toContainText(String(index + 1).padStart(2, '0'));
    if (index < 5) await page.locator('[data-action="column-next"]').click();
  }
  await page.locator('.read-file').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await page.locator('[data-tab="notes"]').click();
  const canvas = await page.locator('#three-scene canvas').elementHandle();
  for (let i = 0; i < 2; i++) {
    await page.locator('#language-toggle').click();
    await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'refrosting');
    await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', /joining|connected/);
    await expect(page.locator('.document-redaction-window').first()).toBeVisible();
    await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'retracting');
    await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
    await expect(page.locator('.document-redaction-window')).toHaveCount(0);
    await expect(page.locator('[data-tab="notes"]')).toHaveAttribute('aria-selected', 'true');
  }
  await page.locator('#language-toggle').click();
  await page.locator('#language-toggle').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  expect(await canvas!.evaluate(el => el === document.querySelector('#three-scene canvas'))).toBe(true);
  await expect(page.locator('.export-button, #pwa-update-notice')).toHaveCount(0);
  await page.locator('[data-action="settings"]').click();
  await expect(page.locator('#pwa-settings, [data-pwa-action]')).toHaveCount(0);
});

test('language changes close the old document before replacement and never revive saved notices', async ({ page }) => {
  await page.locator('.read-file').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  await page.locator('[data-action="bookmark"]').click();
  await expect(page.locator('#toast')).toHaveClass(/visible/);
  await expect.poll(() => page.locator('#toast').evaluate(el => getComputedStyle(el).opacity)).toBe('0');
  const saved = await page.evaluate(() => localStorage.getItem('zl-archive-saved'));
  const oldTitle = await page.locator('#detail-content .detail-title-cn').textContent();
  await page.locator('#language-toggle').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'refrosting');
  await expect(page.locator('#detail-content .detail-title-cn')).toHaveText(oldTitle!);
  // Translation must never override the opacity of an expired notification.
  expect(await page.locator('#toast').evaluate(el => getComputedStyle(el).opacity)).toBe('0');
  expect(await page.locator('#toast').evaluate(el => el.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  await page.screenshot({ path: 'test-results/language-refrost.png' });
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', /joining|connected/);
  await expect(page.locator('#detail-content .detail-title-cn')).toContainText('Full-stack Engineer');
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('zl-archive-saved'))).toBe(saved);
  await expect(page.locator('[data-action="bookmark"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#saved-count')).toHaveText('01');
  expect(await page.locator('#toast').evaluate(el => getComputedStyle(el).opacity)).toBe('0');
});

test('leaving during refrost cancels the pending document replacement', async ({ page }) => {
  await page.locator('.read-file').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await page.locator('#language-toggle').click();
  await page.locator('[data-action="back"]').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'archive');
  await page.locator('[data-action="column-next"]').click();
  await page.locator('.read-file').click();
  await expect(page.locator('#object-id')).toHaveText('I-001');
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  await expect(page.locator('#object-id')).toHaveText('I-001');
});

test('opening composition stays identical across category order and hands off without a lateral jump', async ({ page }) => {
  await page.goto('/?review=1&freeze=1&time=22');
  await expect.poll(() => page.evaluate(() => (window as any).rhine?.stats().ready)).toBe(true);
  const sample = async (id: string, time: number) => page.evaluate(async ({ index, time }) => {
    (window as any).rhine.select(index);
    window.postMessage({ type: 'rhine-review-frame', time }, location.origin);
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const stats = (window as any).rhine.stats();
    return { position: stats.modelPosition, camera: stats.cameraPosition, label: stats.labelTopLeft, fov: stats.fieldOfView };
  }, { index: archives.records.findIndex(record => record.id === id), time });
  for (const time of [22.2, 23.5, 25.05, 25.5, 26.4, 27.3, 27.31, 29.5, 34.99]) {
    // Web is currently the original calibrated centre lane (index 2).
    const centre = await sample('W-001', time);
    for (const id of ['P-001', 'I-001', 'A-001', 'S-001']) {
      const actual = await sample(id, time);
      expect(actual.position).toEqual(centre.position);
      expect(actual.camera).toEqual(centre.camera);
      expect(actual.label).toEqual(centre.label);
      expect(actual.fov).toBeCloseTo(centre.fov, 8);
    }
  }
  const before = await sample('P-001', 34.99);
  expect(before.position[0]).toBe(0);
  await page.evaluate(() => (window as any).rhine.detail());
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'detail');
  const after = await page.evaluate(() => (window as any).rhine.stats());
  expect(after.modelPosition[0]).toBe(before.position[0]);
  await expect(page.locator('#object-id')).toHaveText('P-001');
});

test('translated redaction bars morph between different line widths before reveal', async ({ page }) => {
  await page.locator('.read-file').click();
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  await page.locator('#language-toggle').click();
  await expect(page.locator('.document-morph-bars')).toBeVisible();
  expect(await page.locator('.document-morph-bars > span').evaluateAll(bars => bars.some(bar => {
    const frames = bar.getAnimations()[0]?.effect?.getKeyframes();
    return frames && frames[0].transform !== frames[1].transform;
  }))).toBe(true);
  await expect(page.locator('#detail-content')).toHaveClass(/document-morphing/);
  await page.screenshot({ path: 'test-results/language-bar-morph.png' });
  await expect(page.locator('.document-morph-bars, .document-morph-copy')).toHaveCount(0);
  await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
  await expect(page.locator('.document-redaction-window')).toHaveCount(0);
  await expect(page.locator('#detail-content')).not.toHaveClass(/document-morphing/);
});

test('FPS setting persists, updates in 3D and fits a phone screen', async ({ page }) => {
  await expect(page.locator('#fps-meter')).toBeHidden();
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-pref="showFps"]').check();
  await page.locator('[data-action="close-modal"]').click();
  await expect(page.locator('#fps-meter')).toBeVisible();
  await expect(page.locator('#fps-meter')).toHaveText(/[1-9]\d* FPS/);
  await page.reload();
  await expect(page.locator('[data-entry="waiting"]')).toBeVisible();
  await expect(page.locator('#fps-meter')).toBeHidden();
  await page.locator('.entry-start').click();
  await page.locator('#skip').click();
  await expect(page.locator('#fps-meter')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  const box = await page.locator('#fps-meter').boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'test-results/fps-mobile.png' });
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-pref="showFps"]').uncheck();
  await page.locator('[data-action="close-modal"]').click();
  await expect(page.locator('#fps-meter')).toBeHidden();
});

test('legacy offline storage retires without touching unrelated workers or reloading', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: string[] = [];
    const workerUrl = new URL('/rhine/sw.js', location.href).href;
    Object.defineProperty(navigator.serviceWorker, 'getRegistrations', { value: async () => [
      { active: { scriptURL: workerUrl }, unregister: async () => { calls.push('rhine'); return true; } },
      { active: { scriptURL: new URL('/other/sw.js', location.href).href }, unregister: async () => { calls.push('other'); return true; } },
    ] });
    Object.defineProperty(caches, 'keys', { value: async () => ['zl-archive:/rhine/:old', 'zl-archive:/other/:keep', 'other-cache'] });
    Object.defineProperty(caches, 'delete', { value: async (key: string) => { calls.push(key); return true; } });
    (window as any).retirementCalls = calls;
  });
  await page.reload();
  const origin = await page.evaluate(() => performance.timeOrigin);
  await page.locator('.entry-start').click();
  await page.locator('#skip').click();
  await expect.poll(() => page.evaluate(() => (window as any).retirementCalls)).toEqual(['rhine', 'zl-archive:/rhine/:old']);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(origin);
  await expect(page.locator('.export-button, [data-pwa-action]')).toHaveCount(0);
});

for (const size of [{ width: 1600, height: 900 }, { width: 390, height: 844 }]) {
  test(`long document uses a single scroll surface at ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.locator('[data-action="search"]').click();
    await page.locator('#archive-search').fill('S-001');
    await page.locator('.result-row').click();
    await expect(page.locator('#inspection-marks')).toHaveAttribute('data-phase', 'clear');
    await page.locator('[data-tab="notes"]').click();
    const detail = page.locator('#detail-content');
    expect(await page.locator('#tab-panel').evaluate(el => getComputedStyle(el).overflowY)).toBe('visible');
    expect(await detail.evaluate(el => getComputedStyle(el).scrollbarColor)).not.toBe('auto');
    expect(await detail.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    await page.locator('.detail-actions').scrollIntoViewIfNeeded();
    const actions = await page.locator('.detail-actions').boundingBox();
    if (size.width > 1000) {
      const signature = await page.locator('.powered').boundingBox();
      expect(actions!.y + actions!.height).toBeLessThan(signature!.y);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(size.width);
    await page.screenshot({ path: `test-results/archive-polish-${size.width}.png` });
  });
}
