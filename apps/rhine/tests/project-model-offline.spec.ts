import { test, expect } from '@playwright/test';
import archives from '../content/archives.json' with {type:'json'};

test('project models cache only after selection and remain available offline', async ({page,context}) => {
  await page.addInitScript(()=>localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,reduced:true,superPerformance:true})));
  await page.goto('/');await page.locator('.entry-start').click();
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),undefined,{timeout:45000});
  const cachedProjects = () => page.evaluate(async()=> {
    const names=(await caches.keys()).filter(name=>name.startsWith('zl-archive:'));
    const urls=await Promise.all(names.map(async name=>(await(await caches.open(name)).keys()).map(request=>request.url)));
    return urls.flat().filter(url=>url.includes('/assets/projects/'));
  });
  // The introductory profile is now a real lazy interior too. Re-select it
  // after worker activation so this assertion does not depend on install timing.
  await page.reload();await page.locator('.entry-start').click();
  await expect.poll(cachedProjects).toHaveLength(1);
  expect((await cachedProjects())[0]).toContain('/profile.');
  const choose=(id:string)=>page.evaluate(index=>(window as any).rhine.select(index),archives.records.findIndex(record=>record.id===id));
  const modelState=()=>page.evaluate(()=>(window as any).rhine.stats().projectModel.state);
  await choose('W-002');
  await expect.poll(modelState).toBe('ready');
  await expect.poll(cachedProjects).toHaveLength(2);
  await context.setOffline(true);await page.reload();await page.locator('.entry-start').click();
  await choose('W-002');
  await expect.poll(modelState).toBe('ready');
  await choose('W-005');
  await expect.poll(modelState).toBe('error');
  await context.setOffline(false);
  await page.locator('.read-file').click();
  await page.locator('[data-action="retry-project-model"]').click();
  await expect.poll(modelState).toBe('ready');
});
