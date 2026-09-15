import { test, expect } from '@playwright/test';

test('personal details, internships and project groups wrap with their own counts', async ({ browser }) => {
  const context = await browser.newContext({ baseURL:'http://127.0.0.1:5175', locale:'zh-CN', reducedMotion:'reduce', viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error=>errors.push(error.message));
  await page.goto('/');
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
  for (const [category, count] of [['个人资料',10],['实习经历',3],['系统与硬件',6],['Web 与应用',8],['AI 与数据',4]] as const) {
    await expect(page.locator('#column-name')).toHaveText(category);
    await expect(page.locator('#file-ticks button:visible')).toHaveCount(count);
    await expect(page.locator('.count-total')).toHaveText(String(count).padStart(2,'0'));
    const first = await page.locator('#file-ticks button:visible').first().getAttribute('data-select');
    await page.locator('#file-ticks button:visible').last().click();
    await page.locator('[data-action="next"]').click();
    await expect(page.locator('#file-ticks button.selected')).toHaveAttribute('data-select',first!);
    const navigation = (await page.locator('.archive-navigation').boundingBox())!;
    expect(navigation.x + navigation.width).toBeLessThanOrEqual(391);
    await page.screenshot({path:`test-results/category-${count}.png`});
    await page.locator('[data-action="column-next"]').click();
  }
  await expect(page.locator('#column-name')).toHaveText('个人资料');
  await page.locator('[data-action="search"]').click();
  await page.locator('#archive-search').fill('UNSW');
  await page.locator('.result-row').click();
  await expect(page.locator('.detail-title-cn')).toContainText('个人资料');
  expect(errors).toEqual([]);
  await context.close();
});

test('merged notes stay searchable and saved legacy IDs resolve to their parent', async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem('zl-archive-saved', JSON.stringify(['X-038','X-039','X-040']));
    localStorage.setItem('zl-archive-settings', JSON.stringify({sound:false,music:false,reduced:true}));
  });
  await page.goto('/');
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
  await page.locator('[data-action="saved"]').click();
  await expect(page.locator('.result-row')).toHaveCount(1);
  await expect(page.locator('.result-row')).toContainText('MediaJira');
  await page.locator('.result-row').click();
  await page.locator('[data-tab="notes"]').click();
  await expect(page.locator('.project-note')).toHaveCount(3);
  await expect(page.locator('#tab-panel')).toContainText('9,900');
  await expect(page.locator('#tab-panel')).toContainText('597');
  await page.locator('[data-action="search"]').click();
  await page.locator('#archive-search').fill('X-038');
  await expect(page.locator('.result-row')).toHaveCount(1);
  await expect(page.locator('.result-row')).toContainText('W-003');
  const legacy = await request.get('/archives/ZL-ARCHIVE-X-038.txt');
  expect(await legacy.text()).toContain('FILE W-003');
  expect(await legacy.text()).toContain('9,900');
});
