import { test, expect, type Page } from '@playwright/test';
import catalog from '../content/project-models.json' with { type: 'json' };
import archives from '../content/archives.json' with { type: 'json' };
import { readFileSync } from 'node:fs';

const state = (page: Page) => page.evaluate(() => (window as any).rhine.stats());
const select = (page: Page, id: string) => page.evaluate(index => (window as any).rhine.select(index), archives.records.findIndex(record => record.id === id));

test('cassette and assembly have no moulded company lettering', () => {
  for (const name of ['archive-cassette', 'archive-assembly']) {
    const bytes = readFileSync(`public/assets/${name}.glb`);
    const json = JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
    const used = json.meshes.flatMap((mesh:any) => mesh.primitives.map((p:any) => json.materials[p.material].name.replace(/\.\d+$/, '')));
    expect(used).not.toContain('Moulded_Lettering');
    expect(used).toContain('Frosted_Polymer');
    expect(used).toContain('Case_Engraving');
  }
});

test('every project has a distinct bounded Blender asset with two assembly layers', () => {
  const hashes = new Set();
  const report = JSON.parse(readFileSync('art/project-models-report.json', 'utf8'));
  for (const [id,spec] of Object.entries(catalog)) {
    expect(archives.records.some(record=>record.id===id)).toBe(true);
    const bytes = readFileSync(`public/assets/projects/${spec.key}.glb`);
    expect(bytes.length).toBeLessThan(spec.key==='novacart'?1_000_000:800_000);
    const json = JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
    const layers = new Set(json.nodes.filter((node: any)=>node.mesh!==undefined).map((node: any)=>node.extras?.assemblyPart));
    if ('nativeInterior' in spec && spec.nativeInterior) {
      expect(layers).toEqual(new Set(['cover']));
      expect(json.materials.some((m:any) => m.name.startsWith('Moulded_Lettering'))).toBe(true);
      continue;
    }
    expect(layers).toEqual(new Set(['optical-core','optical-lenses']));
    expect(json.images).toBeUndefined();
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
    expect(report.find((entry:any) => entry.id === id)).toMatchObject({ key: spec.key, bytes: bytes.length, triangles });
    hashes.add(bytes.toString('base64'));
  }
  expect(hashes.size).toBe(31);
  expect(Object.keys(catalog).sort()).toEqual(archives.records.map(r=>r.id).sort());
});


for (const [name, width, height, performance] of [
  ['desktop', 1600, 900, false], ['phone', 390, 844, true],
] as const) {
  test(`${name}: all symbolic archive models survive category and theme changes`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [], projects: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().includes('/assets/projects/')) projects.push(request.url()); });
    await page.setViewportSize({ width, height });
    await page.addInitScript(performance => {
      localStorage.setItem('zl-portfolio-locale', 'zh');
      localStorage.setItem('zl-archive-settings', JSON.stringify({ sound: false, music: false, reduced: true, superPerformance: performance }));
    }, performance);
    await page.goto('/');
    await page.locator('.entry-start').click();
    await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'archive');
    // All records load distinct symbolic interiors on demand.
    for (const record of archives.records) {
      await select(page, record.id);
      const spec = (catalog as Record<string, {key: string, nativeInterior?: boolean}>)[record.id];
      if (spec) {
        await expect.poll(async () => (await state(page)).projectModel).toMatchObject({ key: spec.key, state: 'ready' });
        const model = (await state(page)).projectModel;
        expect(model.meshes).toBeGreaterThan(0);
        if (spec.nativeInterior) expect(model.visibleOriginalInteriors).toBeGreaterThan(0);
        else expect(model.visibleOriginalInteriors).toBe(0);
      } else {
        const model = (await state(page)).projectModel;
        expect(model).toMatchObject({ key: null, state: 'default', meshes: 0 });
        expect(model.visibleOriginalInteriors).toBeGreaterThan(0);
      }
    }
    for (const id of ['P-001', 'P-007', 'P-009', 'P-010', 'I-001', 'I-002', 'I-003', 'W-002', 'A-001', 'S-001']) {
      await select(page, id);
      await page.locator('.read-file').click();
      await expect(page.locator('#object-id')).toHaveText(id);
      await expect.poll(async () => (await state(page)).decryption.phase).toBe('clear');
      await expect(page.locator('#detail-content h2')).not.toBeEmpty();
      await expect.poll(async () => (await state(page)).cameraDetail).toBeGreaterThan(.999);
      await expect.poll(() => page.locator('#detail-content').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.99);
      await page.screenshot({path:`test-results/complete-${name}-${id}.png`});
      if (/^[PI]-/.test(id)) {
        await page.locator('[data-action="model-viewer"]').click();
        await expect(page.locator('.viewer-loading')).toBeHidden();
        await expect(page.locator('.model-viewer')).toHaveAttribute('data-project-model', (catalog as Record<string, {key: string}>)[id].key);
        await expect(page.locator('.viewer-parts')).toContainText('档案结构模块');
        await page.locator('[data-viewer="close"]').click();
        await expect(page.locator('.model-viewer')).toBeHidden();
      }
      await page.locator('[data-action="back"]').click();
    }
    await select(page, 'W-005');
    await page.locator('.read-file').click();
    await expect.poll(async () => (await state(page)).decryption.phase).toBe('clear');
    await expect.poll(async () => (await state(page)).cameraDetail).toBeGreaterThan(.999);
    await expect.poll(async () => (await state(page)).extraction).toBeGreaterThan(4.04);
    await expect.poll(() => page.locator('#detail-content').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.99);
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await expect(page.locator('html')).toHaveAttribute('data-dark-surface', String(theme === 'dark'));
      await expect(page.locator('.brand')).toHaveCSS('color', theme === 'dark' ? 'rgb(224, 227, 220)' : 'rgb(8, 10, 8)');
      await page.screenshot({ path: `test-results/restored-${name}-${theme}.png` });
      await page.locator('[data-action="model-viewer"]').click();
      await expect(page.locator('.viewer-loading')).toBeHidden();
      await expect(page.locator('.model-viewer')).toHaveAttribute('data-project-model', 'whale');
      await expect(page.locator('.viewer-parts')).toContainText('项目结构模块');
      await page.locator('[data-viewer="explode"]').click();
      await expect(page.locator('.model-viewer')).toHaveAttribute('data-exploded', 'true');
      await page.locator('[data-viewer="assemble"]').click();
      await page.locator('[data-viewer="close"]').click();
      await expect(page.locator('.model-viewer')).toBeHidden();
    }
    await page.locator('#language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');
    await expect(page.locator('#object-id')).toHaveText('W-005');
    expect((await state(page)).projectModel.key).toBe('whale');
    expect(projects).toHaveLength(32);
    expect(new Set(projects).size).toBe(32);
    expect(errors).toEqual([]);
  });
}


test('final acknowledgements retain original optics, lettering and bilingual credits', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('zl-portfolio-locale', 'zh');
    localStorage.setItem('zl-archive-settings', JSON.stringify({sound:false,music:false,reduced:true,superPerformance:false}));
  });
  await page.goto('/');
  await page.locator('.entry-start').click();
  await expect(page.locator('#stage')).toHaveAttribute('data-mode', 'archive');
  await select(page, 'C-001');
  await expect(page.locator('#column-name')).toContainText('致谢');
  await expect(page.locator('#column-number')).toContainText('/ 06');
  await expect.poll(async () => (await state(page)).projectModel).toMatchObject({key:'rhine-tribute',state:'ready'});
  expect((await state(page)).projectModel.visibleOriginalInteriors).toBeGreaterThan(0);
  await page.locator('.read-file').click();
  await expect.poll(async () => (await state(page)).decryption.phase).toBe('clear');
  await expect.poll(async () => (await state(page)).cameraDetail).toBeGreaterThan(.999);
  await expect.poll(async () => (await state(page)).extraction).toBeGreaterThan(4.04);
  for (const theme of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme:theme});
    await expect(page.locator('html')).toHaveAttribute('data-dark-surface',String(theme==='dark'));
    await expect(page.locator('.brand')).toHaveCSS('color', theme==='dark'?'rgb(224, 227, 220)':'rgb(8, 10, 8)');
    await page.screenshot({path:`test-results/credits-${theme}.png`});
  }
  await expect(page.locator('.portfolio-links a')).toHaveCount(5);
  await expect(page.locator('.portfolio-links a').first()).toHaveAttribute('href','https://github.com/LBEILC/RhineLabUI');
  await page.locator('[data-tab="notes"]').click();
  for (const phrase of ['LBEILC','鹰角网络','明日方舟','莱茵生命','GPT-6 Astra','Codex']) await expect(page.locator('#detail-content')).toContainText(phrase);
  await page.locator('#language-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en-AU');
  await expect(page.locator('#detail-content')).toContainText('HYPERGRYPH');
  await expect(page.locator('#object-id')).toHaveText('C-001');
  await page.locator('[data-action="model-viewer"]').click();
  await expect(page.locator('.viewer-loading')).toBeHidden();
  await expect(page.locator('.model-viewer')).toHaveAttribute('data-project-model','default');
  await page.screenshot({path:'test-results/credits-viewer.png'});
  await page.locator('[data-viewer="close"]').click();
  await page.locator('[data-action="back"]').click();
  await select(page,'P-001');
  await expect.poll(async () => (await state(page)).projectModel).toMatchObject({key:'profile',state:'ready',visibleOriginalInteriors:0});
});
