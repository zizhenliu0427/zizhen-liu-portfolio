import {test,expect} from '@playwright/test';
import content from '../content/archives.json' with {type:'json'};

test('category prefixes are consistent on selection, search, downloads and saved legacy records',async({page,request})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('zl-archive-saved',JSON.stringify(['X-001','X-033','X-036','X-038','X-039']));
    localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,reduced:true,superPerformance:true}));
  });
  await page.goto('/');await page.locator('.entry-start').click();
  for(const id of ['P-009','I-002','W-004','A-003','S-005']) {
    await page.evaluate(index=>(window as any).rhine.select(index),content.records.findIndex(r=>r.id===id));
    await expect(page.locator('#selected-id')).toHaveText(id);
    await page.locator('.read-file').click();
    await expect(page.locator('#object-id')).toHaveText(id);
    await expect(page.locator('.detail-kicker')).toContainText(id);
    await expect(page.locator('.export-button')).toHaveCount(0);
    await page.locator('[data-action="back"]').click();
  }
  await page.locator('[data-action="saved"]').click();
  await expect(page.locator('.result-row')).toHaveCount(4);
  for(const id of ['P-001','I-001','P-009','W-003'])await expect(page.locator('.result-row').filter({hasText:id})).toHaveCount(1);
  for(const [old,id] of Object.entries(content.redirects)) {
    const response=await request.get(`/archives/ZL-ARCHIVE-${old}.txt`);
    expect(response.ok()).toBe(true);expect(await response.text()).toContain(`FILE ${id} /`);
  }
});

test('old main IDs and merged-note IDs both remain searchable',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('zl-archive-settings',JSON.stringify({reduced:true,sound:false,music:false,superPerformance:true})));
  await page.goto('/');await page.locator('.entry-start').click();await page.locator('[data-action="search"]').click();
  for(const [query,id] of [['X-036','P-009'],['P-009','P-009'],['X-038','W-003'],['X-033','I-001']]) {
    await page.locator('#archive-search').fill(query);
    await expect(page.locator('.result-row')).toHaveCount(1);
    await expect(page.locator('.result-row')).toContainText(id);
  }
});
