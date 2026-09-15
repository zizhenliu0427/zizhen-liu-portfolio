import { test, expect } from '@playwright/test';

async function expectReadableButton(page: import('@playwright/test').Page) {
  const contrast = await page.locator('.read-file').evaluate(button => {
    const luminance = (color: string) => {
      const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(value => {
        const channel = Number(value) / 255;
        return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
      });
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    const style = getComputedStyle(button);
    const foreground = luminance(style.color), background = luminance(style.backgroundColor);
    return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
}

test('system theme, explicit override, bilingual content and language persistence', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5175', locale: 'en-AU', colorScheme: 'dark', reducedMotion: 'reduce', viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang','en-AU');
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface','true');
  await expect(page.locator('.entry-start')).toHaveText('Enter portfolio →');
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
  await expect(page.locator('.read-file')).toContainText('OPEN ARCHIVE');
  await expectReadableButton(page);
  await page.screenshot({path:'test-results/readability-dark-en.png'});
  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface','false');
  await page.locator('[data-action="settings"]').click();
  await expect(page.locator('[data-color-theme="auto"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.theme-settings')).toContainText('System');
  await page.locator('[data-color-theme="dark"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface','true');
  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('[data-color-theme="dark"]')).toHaveAttribute('aria-pressed','true');
  await page.screenshot({path:'test-results/settings-en.png'});
  await page.locator('[data-action="close-modal"]').click();
  await page.locator('[data-action="search"]').click();
  await page.locator('#archive-search').fill('Novacart');
  await page.locator('.result-row').click();
  await expect(page.locator('#tab-panel')).toContainText('e-commerce');
  await page.locator('#language-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await expect(page.locator('#detail-content h2')).toHaveText('Novacart');
  await expect(page.locator('#tab-panel')).toContainText('电商');
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface','true');
  await page.locator('[data-action="back"]').click();
  await expect(page.locator('.read-file')).toContainText('打开档案');
  await page.screenshot({path:'test-results/readability-dark-zh.png'});
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await expect(page.locator('#language-toggle .active')).toHaveText('中');
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
  await page.locator('#language-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en-AU');
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-color-theme="auto"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-dark-surface','false');
  await page.locator('[data-action="close-modal"]').click();
  await page.screenshot({path:'test-results/readability-light-en.png'});
  await expectReadableButton(page);
  expect(errors).toEqual([]);
  await context.close();
});

for (const [name,width,height] of [['phone',390,844],['phone-landscape',844,390],['tablet',820,1180],['tablet-landscape',1180,820]] as const) {
  test(`${name}: frosted panel and language controls fit in both themes`, async ({ browser }) => {
    const context = await browser.newContext({baseURL:'http://127.0.0.1:5175', locale:'zh-CN',colorScheme:'dark',reducedMotion:'reduce', viewport:{width,height},hasTouch:true,isMobile:true});
    const page=await context.newPage();
    await page.goto('/');
    await page.locator('.entry-start').click();
    await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
    await expect(page.locator('.read-file')).toContainText('打开档案');
    const panel=await page.locator('.archive-callout').boundingBox();
    expect(panel!.x).toBeGreaterThanOrEqual(0);
    expect(panel!.x+panel!.width).toBeLessThanOrEqual(width+1);
    expect(panel!.y+panel!.height).toBeLessThan(height);
    const navigation = (await page.locator('.column-navigation').boundingBox())!;
    expect(panel!.x + panel!.width <= navigation.x || navigation.x + navigation.width <= panel!.x || panel!.y + panel!.height <= navigation.y || navigation.y + navigation.height <= panel!.y).toBeTruthy();
    const languageMenu = (await page.locator('#language-toggle').boundingBox())!;
    expect(languageMenu.x).toBeGreaterThanOrEqual(0);
    expect(languageMenu.x + languageMenu.width).toBeLessThanOrEqual(width + 1);
    await page.locator('#language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang','en-AU');
    await expect(page.locator('.read-file')).toContainText('OPEN ARCHIVE');
    await expectReadableButton(page);
    await page.screenshot({path:`test-results/${name}-dark.png`});
    await page.emulateMedia({colorScheme:'light'});
    await expect(page.locator('html')).toHaveAttribute('data-dark-surface','false');
    await expectReadableButton(page);
    await page.screenshot({path:`test-results/${name}-light.png`});
    await page.locator('.read-file').click();
    await expect(page.locator('#detail-content')).toContainText('complete products');
    await context.close();
  });
}
