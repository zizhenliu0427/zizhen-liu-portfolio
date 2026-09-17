// Build the experiment and serve release/background-lod on 3190 first.
import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const out='art/.cache/background-lod';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:3840,height:2160},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const runs=[];
const median=a=>{const v=a.filter(x=>x!==null).sort((a,b)=>a-b);return v.length?v[Math.floor(v.length/2)]:null;};
try{
 for(let round=0;round<(process.argv.includes('--visual-only')?0:3);round++)for(const quality of ['original','balanced']) {
  const order=round%2?['medium','high']:['high','medium'];
  for(const tier of order){
   // A fresh scene gives every tier exactly the same spring/history state.
   await page.goto('http://localhost:3190/reference/background-lod?bench=1');
   await page.waitForFunction(()=>window.lodBench,{timeout:60000});
   assert.equal(await page.evaluate(()=>window.lodBench.automation),true,'diagnostic flag lost during navigation');
   const result=await page.evaluate(async({tier,quality})=>{
    const b=window.lodBench;b.setTier(tier);b.prepare('idle',quality,false);
    await b.sample(60);b.prepare('idle',quality,false);
    return await b.sample(240);
   },{tier,quality});
   result.summary=Object.fromEntries(['cpu','gpu','calls','triangles'].map(k=>[k,median(result.samples.map(s=>s[k]))]));
   runs.push({...result,round:round+1,tier,quality,renderQuality:result.quality});
   writeFileSync(`${out}/runs.json`,JSON.stringify({errors,runs},null,2));
   console.log(JSON.stringify({round:round+1,tier,quality,...result.summary,archives:result.stats.archiveCount}));
  }
 }
 // Same camera, materials, instance population, selected geometry and settings.
 for(const quality of ['original','balanced']){
  const rows=runs.filter(r=>r.quality===quality),base=rows[0];
  for(const row of rows){
   assert.deepEqual(row.geometry.selected,base.geometry.selected,'selected geometry or materials changed');
   assert.deepEqual(row.geometry.materials,base.geometry.materials,'background materials changed');
   assert.equal(row.renderQuality,base.renderQuality);
   assert.equal(row.stats.archiveCount,base.stats.archiveCount);
   assert.deepEqual(row.stats.cameraPosition,base.stats.cameraPosition);
   assert.deepEqual(row.stats.modelPosition,base.stats.modelPosition);
   assert.deepEqual(row.samples.map(x=>x.calls),base.samples.map(x=>x.calls));
  }
 }
 for(const dark of [false,true])for(const shot of ['idle','detail'])for(const tier of ['high','medium']){
  await page.goto('http://localhost:3190/reference/background-lod?bench=1');
  await page.waitForFunction(()=>window.lodBench,{timeout:60000});
  await page.evaluate(({dark,shot,tier})=>{const b=window.lodBench;b.setTier(tier);b.prepare(shot,'original',dark);b.draw();}, {dark,shot,tier});
  await page.locator('canvas').screenshot({path:`${out}/${dark?'dark':'light'}-${shot}-${tier}.png`});
 }
 // Exercise the actual controls, including toggling an inactive geometry after
 // the scene has grown its instance buffers, and resizing the paused scene.
 await page.goto('http://localhost:3190/reference/background-lod');
 await page.waitForFunction(()=>window.lodBench,{timeout:60000});
 await page.click('#pause');
 const selected=await page.evaluate(()=>window.lodBench.geometryStats().selected);
 for(const tier of ['medium','high','medium']) {
  await page.selectOption('#lod',tier);
  assert.equal(await page.evaluate(()=>window.lodBench.geometryStats().tier),tier);
  assert.deepEqual(await page.evaluate(()=>window.lodBench.geometryStats().selected),selected);
 }
 await page.check('#dark');
 await page.selectOption('#shot','detail');
 await page.selectOption('#quality','balanced');
 await page.setViewportSize({width:1920,height:1080});
 await page.selectOption('#lod','high');
 await page.evaluate(()=>window.lodBench.sample(3));
 assert.deepEqual(errors,[]);
 if(runs.length)writeFileSync(`${out}/runs.json`,JSON.stringify({errors,runs},null,2));
}finally{await browser.close();}
