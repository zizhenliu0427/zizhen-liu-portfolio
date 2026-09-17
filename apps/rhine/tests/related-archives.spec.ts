import {test, expect} from '@playwright/test';
import content from '../content/archives.json' with {type:'json'};

for (const phone of [false, true]) {
  test(`${phone ? 'phone' : 'desktop'}: project and internship open each other in both languages`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize(phone ? {width:390,height:844} : {width:1600,height:900});
    await page.addInitScript(() => {
      localStorage.setItem('zl-portfolio-locale','zh');
      localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,reduced:false,superPerformance:true}));
    });
    await page.goto('/');
    await page.locator('.entry-start').click();
    // The compact layout hides the opening's skip control.
    await page.evaluate(() => (window as any).rhine.archive());
    await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
    await page.evaluate(index => (window as any).rhine.select(index),content.records.findIndex(r=>r.id==='W-003'));
    await page.locator('.read-file').click();
    const clear = () => expect.poll(()=>page.evaluate(()=>(window as any).rhine.stats().decryption.phase)).toBe('clear');
    await clear();
    for (const english of [false,true]) {
      if (english) {
        await page.locator('#language-toggle').click();
        await expect(page.locator('html')).toHaveAttribute('lang','en-AU');
        await clear();
      }
      for (const [id,key,label] of [
        ['I-001','codritium',english?'Open Codritium internship':'查看 Codritium 实习经历'],
        ['W-003','mediajira',english?'Open Marketing Simplified project':'查看 Marketing Simplified 项目'],
      ]) {
        const link=page.locator(`[data-related-archive="${id}"]`);
        await expect(link).toContainText(label);
        await link.scrollIntoViewIfNeeded();
        if (!english) await page.screenshot({path:`test-results/related-${phone?'phone':'desktop'}-to-${id}.png`});
        // Keyboard activation follows the same path as a click.
        await link.focus();
        await link.press('Enter');
        await expect(page.locator('#object-id')).toHaveText(id);
        await expect(page.locator('#stage')).toHaveAttribute('data-mode','detail');
        await clear();
        await expect.poll(()=>page.evaluate(()=>(window as any).rhine.stats().projectModel)).toMatchObject({key,state:'ready'});
        await expect(page.locator('#saved-count')).toHaveText('00');
      }
    }
    await page.locator('[data-action="back"]').click();
    await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
    expect(errors).toEqual([]);
  });
}
