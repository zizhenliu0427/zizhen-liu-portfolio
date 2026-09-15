import { test, expect, type Page } from '@playwright/test';
import catalog from '../content/project-models.json' with { type: 'json' };
import archives from '../content/archives.json' with { type: 'json' };
import { readFileSync } from 'node:fs';

const state = (page: Page) => page.evaluate(() => (window as any).rhine.stats());
const select = (page: Page, id: string) => page.evaluate(index => (window as any).rhine.select(index), archives.records.findIndex(record => record.id === id));
async function enter(page: Page) {
  await page.addInitScript(() => localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,reduced:true,superPerformance:true})));
  await page.goto('/');
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode','archive');
}

test('every project has a distinct bounded Blender asset with two assembly layers', () => {
  const hashes = new Set();
  for (const [id,spec] of Object.entries(catalog)) {
    expect(archives.records.some(record=>record.id===id)).toBe(true);
    const bytes = readFileSync(`public/assets/projects/${spec.key}.glb`);
    expect(bytes.length).toBeLessThan(spec.key==='novacart'?1_000_000:800_000);
    const json = JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
    const layers = new Set(json.nodes.filter((node: any)=>node.mesh!==undefined).map((node: any)=>node.extras?.assemblyPart));
    expect(layers).toEqual(new Set(['optical-core','optical-lenses']));
    if(spec.key==='novacart') {
      expect(json.images).toHaveLength(3);
      // Screenshots travel inside the lazy GLB, including for offline use.
      for(const image of json.images) {expect(image.bufferView).toBeDefined();expect(image.uri).toBeUndefined();}
      const textured = json.meshes.flatMap((mesh:any)=>mesh.primitives).filter((p:any)=>json.materials[p.material].emissiveTexture);
      expect(textured).toHaveLength(3);
      for(const primitive of textured) expect(primitive.attributes.TEXCOORD_0).toBeDefined();
    } else expect(json.images).toBeUndefined();
    let triangles = 0;
    for (const mesh of json.meshes) for (const primitive of mesh.primitives) {
      const bounds = json.accessors[primitive.attributes.POSITION];
      expect(bounds.min[0]).toBeGreaterThanOrEqual(-2.15);
      expect(bounds.max[0]).toBeLessThanOrEqual(2.15);
      expect(bounds.min[1]).toBeGreaterThanOrEqual(.2);
      expect(bounds.max[1]).toBeLessThanOrEqual(3.3);
      expect(bounds.min[2]).toBeGreaterThanOrEqual(-.035);
      expect(bounds.max[2]).toBeLessThan(.174);
      triangles += json.accessors[primitive.indices].count / 3;
    }
    expect(triangles).toBeLessThan(15000);
    hashes.add(bytes.toString('base64'));
  }
  expect(hashes.size).toBe(31);
  expect(Object.keys(catalog).sort()).toEqual(archives.records.map(r=>r.id).sort());
});

test('all 31 interiors appear and personal, internship and project assemblies match', async ({page}) => {
  test.setTimeout(180000);
  const errors: string[] = [], requests: string[] = [];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('request',r=>{if(r.url().includes('/assets/projects/'))requests.push(r.url());});
  await enter(page);
  await expect.poll(async()=>(await state(page)).projectModel.state).toBe('ready');
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain('/profile.');
  for (const [id,spec] of Object.entries(catalog)) {
    await select(page,id);
    await expect.poll(async()=>(await state(page)).projectModel).toMatchObject({key:spec.key,state:'ready',visibleOriginalInteriors:0});
    await page.locator('.read-file').click();
    await expect(page.locator('#stage')).toHaveAttribute('data-mode','detail');
    await expect(page.locator('.project-model-status')).toBeHidden();
    await expect.poll(async()=>(await state(page)).decryption.phase).toBe('clear');
    await page.screenshot({path:`test-results/models/${spec.key}.png`});
    if (['profile','unsw','codritium','intelli-new','golden-lady','novacart','whale','building-ai','gpu-benchmark'].includes(spec.key)) {
      await page.locator('[data-action="model-viewer"]').click();
      await expect(page.locator('.model-viewer')).toHaveAttribute('data-project-model',spec.key);
      await expect(page.locator('.viewer-loading')).toBeHidden();
      await expect(page.locator('.viewer-parts')).toContainText(spec.layers[1]);
      await page.locator('[data-viewer="explode"]').click();
      await expect(page.locator('.model-viewer')).toHaveAttribute('data-exploded','true');
      await page.screenshot({path:`test-results/models/${spec.key}-exploded.png`});
      await page.locator('[data-viewer="assemble"]').click();
      await page.locator('[data-viewer="close"]').click();
      await expect(page.locator('.model-viewer')).toBeHidden();
    }
    await page.locator('[data-action="back"]').click();
  }
  expect(new Set(requests).size).toBe(31);
  expect(requests).toHaveLength(31);
  await select(page,'P-001');
  await expect.poll(async()=>(await state(page)).projectModel).toMatchObject({key:'profile',state:'ready',visibleOriginalInteriors:0});
  expect(errors).toEqual([]);
});

test('full-motion decryption and returning copies retain the correct project', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,reduced:false,superPerformance:true})));
  await page.goto('/');await page.locator('.entry-start').click();await page.locator('#skip').click();
  await select(page,'W-002');
  await expect.poll(async()=>(await state(page)).projectModel.state).toBe('ready');
  await page.locator('.read-file').click();
  await expect.poll(async()=>(await state(page)).decryption.phase).toBe('clear');
  await page.locator('[data-action="back"]').click();
  await select(page,'W-005');
  expect((await state(page)).returningProjectModels.flat()).toContain('novacart');
  await expect.poll(async()=>(await state(page)).projectModel).toMatchObject({key:'whale',state:'ready'});
  await select(page,'W-002');
  await expect.poll(async()=>(await state(page)).projectModel).toMatchObject({key:'novacart',state:'ready'});
  await page.locator('.read-file').click();
  await expect.poll(async()=>(await state(page)).decryption.phase).toBe('clear');
});

test('project geometry remains readable in desktop quality and mobile performance modes', async ({ browser }) => {
  for (const [name,width,height,touch] of [['desktop',1600,900,false],['phone',390,844,true],['tablet',820,1180,true]] as const) {
    const context=await browser.newContext({baseURL:'http://127.0.0.1:5175',locale:'en-AU',viewport:{width,height},hasTouch:touch,isMobile:touch,colorScheme:'dark'});
    const page=await context.newPage();
    await page.addInitScript(performance => localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,reduced:true,superPerformance:performance})),touch);
    await page.goto('/');await page.locator('.entry-start').click();
    await select(page,'S-002');
    await expect.poll(async()=>(await state(page)).projectModel.state).toBe('ready');
    await page.locator('.read-file').click();
    await expect.poll(async()=>(await state(page)).decryption.phase).toBe('clear');
    await page.screenshot({path:`test-results/models/${name}-gpu-dark.png`});
    await page.locator('[data-action="model-viewer"]').click();
    await expect(page.locator('.viewer-loading')).toBeHidden();
    await page.screenshot({path:`test-results/models/${name}-viewer-dark.png`});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await context.close();
  }
});

test('Novacart keeps all three source screens after theme, language and viewer changes', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({colorScheme:'dark'});
  const requests:string[]=[];
  page.on('request',request=>{if(request.url().includes('/assets/projects/novacart'))requests.push(request.url());});
  await enter(page);
  await select(page,'W-002');
  await expect.poll(async()=>(await state(page)).projectModel.state).toBe('ready');
  await page.locator('.read-file').click();
  for (const theme of ['dark','light'] as const) {
    await page.emulateMedia({colorScheme:theme});
    await page.locator('[data-action="model-viewer"]').click();
    await expect(page.locator('.viewer-loading')).toBeHidden();
    await expect.poll(async()=>{
      const stats=JSON.parse((await page.locator('.model-viewer').getAttribute('data-stats'))!);
      return stats.parts.reduce((sum:number,part:any)=>sum+part.evidenceScreens,0);
    }).toBe(3);
    await page.locator('[data-viewer="explode"]').click();
    const parts=await page.locator('.viewer-parts').boundingBox();
    const actions=await page.locator('.viewer-actions').boundingBox();
    expect(parts!.y+parts!.height).toBeLessThan(actions!.y-8);
    await page.screenshot({path:`test-results/models/phone-novacart-${theme}.png`});
    await page.locator('[data-viewer="close"]').click();
    await page.locator('#language-toggle').click();
  }
  expect(requests).toHaveLength(1);
});

test('late requests cannot replace the active project and failed models can retry', async ({ page }) => {
  await page.route('**/assets/projects/novacart*.glb',async route=>{
    await new Promise(resolve=>setTimeout(resolve,500));
    await route.continue();
  });
  await enter(page);
  await select(page,'W-002');
  await select(page,'W-005');
  await expect.poll(async()=>(await state(page)).projectModel).toMatchObject({key:'whale',state:'ready'});
  await page.waitForTimeout(650);
  expect((await state(page)).projectModel.key).toBe('whale');
  await page.route('**/assets/projects/ctv*.glb',route=>route.abort());
  await select(page,'A-003');
  await expect.poll(async()=>(await state(page)).projectModel.state).toBe('error');
  await page.locator('.read-file').click();
  await expect(page.locator('.project-model-status')).toContainText('项目模型暂未载入');
  await page.unroute('**/assets/projects/ctv*.glb');
  await page.locator('[data-action="retry-project-model"]').click();
  await expect.poll(async()=>(await state(page)).projectModel.state).toBe('ready');
  await expect(page.locator('.project-model-status')).toBeHidden();
  await page.locator('#language-toggle').click();
  expect((await state(page)).projectModel.key).toBe('ctv');
});
