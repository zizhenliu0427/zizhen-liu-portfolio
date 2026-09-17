import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const tag=process.argv[2] ?? 'baseline';
mkdirSync('art/.cache',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
for(const theme of ['light','dark']) {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 await page.addInitScript(({theme,half})=>{
  // Fix SSAO's random kernel so two captures compare the rendering change.
  let seed=12345;
  Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  localStorage.setItem('zl-archive-theme',theme);
  localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,adaptive:false,colorTheme:theme,rendering:{transmission:half ? .5 : 1}}));
 },{theme,half:process.argv.includes('--half')});
 await page.goto('http://localhost:3100/?review=1&freeze=1&time=24');
 await page.waitForFunction(()=>window.rhine?.stats().openingPrepared);
 for(const time of [24,30,34.8]) {
  await page.evaluate(time=>window.postMessage({type:'rhine-review-frame',time},location.origin),time);
  await page.waitForTimeout(1500);
  await page.locator('#three-scene canvas').screenshot({path:`art/.cache/render-${tag}-${theme}-${time}.png`});
 }
 await page.close();
}
await browser.close();
