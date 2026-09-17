// Diagnostic only: root build served on 3100. GPU queries never enter production.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const tag = process.argv[2] ?? 'baseline';
const browser = await chromium.launch({channel:'msedge', headless:true});
const results = [];
const cases = process.argv.includes('--repeat')
  ? [['original-1',{}],['halfGlass-1',{transmission:.5}],['halfGlass-2',{transmission:.5}],['original-2',{}],['original-3',{}],['halfGlass-3',{transmission:.5}]]
  : Object.entries({original:{}, noAO:{aoSamples:0}, noDOF:{depthOfField:0}, noShadows:{shadows:0}, halfGlass:{transmission:0.5}});
for (const [name, rendering] of cases) {
  const page = await browser.newPage({viewport:{width:3840,height:2160},deviceScaleFactor:1});
  await page.addInitScript(({rendering}) => {
    localStorage.setItem('zl-archive-settings',JSON.stringify({sound:false,music:false,adaptive:false,superPerformance:false,colorTheme:'light',rendering}));
    const probe = window.probe = {enabled:false,cpu:[],gpu:[],gl:null,ext:null,pending:[]};
    const context = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(...args) {
      const gl = context.apply(this,args);
      if (args[0] === 'webgl2' && gl && !probe.gl) {
        probe.gl = gl; probe.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        probe.renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'unavailable';
      }
      return gl;
    };
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = cb => raf.call(window,t => {
      if (!probe.enabled || !probe.gl) return cb(t);
      const {gl,ext} = probe;
      // Sample all animation callbacks; zero-draw callbacks cost virtually no GPU time.
      while (probe.pending.length && gl.getQueryParameter(probe.pending[0],gl.QUERY_RESULT_AVAILABLE)) {
        const q = probe.pending.shift();
        if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) probe.gpu.push(gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6);
        gl.deleteQuery(q);
      }
      const q = ext && probe.pending.length < 16 ? gl.createQuery() : null;
      if (q) gl.beginQuery(ext.TIME_ELAPSED_EXT,q);
      const start = performance.now();
      try { cb(t); } finally {
        probe.cpu.push(performance.now()-start);
        if(q) {gl.endQuery(ext.TIME_ELAPSED_EXT);probe.pending.push(q);}
      }
    });
  },{rendering});
  await page.goto('http://localhost:3100/');
  await page.waitForFunction(() => window.rhine?.stats().openingPrepared);
  await page.locator('.entry-start').click();
  await page.evaluate(() => window.rhine.archive());
  await page.waitForTimeout(6000);
  const cdp = await page.context().newCDPSession(page);
  if(name==='original') {await cdp.send('Profiler.enable');await cdp.send('Profiler.start');}
  await page.evaluate(() => window.probe.enabled=true);
  await page.waitForTimeout(5000);
  const data = await page.evaluate(() => {
    window.probe.enabled=false;
    const mean = a => a.reduce((s,x)=>s+x,0)/a.length;
    return {cpu:mean(window.probe.cpu),gpu:mean(window.probe.gpu),samples:window.probe.cpu.length,gpuSamples:window.probe.gpu.length,renderer:window.probe.renderer,stats:window.rhine.stats(),dimensions:document.querySelector('#three-scene').dataset.renderQuality};
  });
  mkdirSync('art/.cache',{recursive:true});
  if(name==='original') {
    const {profile}=await cdp.send('Profiler.stop');
    writeFileSync(`art/.cache/home-${tag}.cpuprofile`,JSON.stringify(profile));
  }
  results.push({name,...data});
  console.log(JSON.stringify({name,cpu:data.cpu,gpu:data.gpu,renderer:data.renderer,drawCalls:data.stats.drawCalls,triangles:data.stats.triangles,dimensions:data.dimensions}));
  await page.close();
}
writeFileSync(`art/.cache/home-${tag}.json`,JSON.stringify(results,null,2));
await browser.close();
