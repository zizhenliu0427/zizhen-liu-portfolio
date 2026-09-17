// Build the root portfolio and serve out/ on port 3100 before running.
// Fresh Edge context; use --natural to play the 2D opening before measurement.
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const tag = process.argv[2] ?? "profile";
mkdirSync("art/.cache", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.addInitScript(() => {
  localStorage.setItem(
    "zl-archive-settings",
    JSON.stringify({
      sound: false,
      music: false,
      reduced: false,
      superPerformance: false,
      adaptive: false,
    }),
  );
  window.samples = [];
  window.programs = [];
  window.longFrames = [];
  const create = WebGL2RenderingContext.prototype.createProgram;
  WebGL2RenderingContext.prototype.createProgram = function (...args) {
    window.programs.push(performance.now());
    return create.apply(this, args);
  };
  new PerformanceObserver((list) =>
    window.longFrames.push(
      ...list
        .getEntries()
        .map((e) => ({
          start: e.startTime,
          duration: e.duration,
          blocking: e.blockingDuration,
        })),
    ),
  ).observe({ type: "long-animation-frame", buffered: true });
});
await page.goto("http://localhost:3100/");
await page.locator(".entry-start").click();
if (process.argv.includes("--natural"))
  await page.waitForFunction(() => window.rhine.stats().bootTime >= 26.8);
else await page.evaluate(() => window.rhine.seek(21.85));
await page.evaluate(() => {
  window.measureStart = performance.now();
  let prev = 0;
  function sample(t) {
    if (prev) window.samples.push({ t, dt: t - prev });
    prev = t;
    if (t - window.measureStart < 16000) requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
});
await page.waitForTimeout(16500);
const data = await page.evaluate(() => ({
  start: window.measureStart,
  frames: window.samples,
  programs: window.programs,
  longFrames: window.longFrames,
  stats: window.rhine.stats(),
}));
writeFileSync(`art/.cache/opening-${tag}.json`, JSON.stringify(data, null, 2));
console.log(
  JSON.stringify({
    tag,
    programsDuringOpening: data.programs
      .filter((t) => t >= data.start)
      .map((t) => +(t - data.start).toFixed(1)),
    worstFrames: data.frames
      .sort((a, b) => b.dt - a.dt)
      .slice(0, 10)
      .map((x) => ({
        t: +(x.t - data.start).toFixed(1),
        dt: +x.dt.toFixed(1),
      })),
    drawCalls: data.stats.drawCalls,
    triangles: data.stats.triangles,
    archives: data.stats.archiveCount,
  }),
);
await browser.close();
