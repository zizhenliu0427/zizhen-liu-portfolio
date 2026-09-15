import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
// Rasterize our code-native SVG for PWA launchers; no upstream logo artwork.
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const svg = await readFile('public/favicon.svg', 'utf8');
  for (const [filename, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['icon-maskable-512.png', 512], ['apple-touch-icon.png', 180]]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:#e8e5e1}svg{display:block;width:100%;height:100%}</style>${svg}`);
    await page.screenshot({ path: `public/icons/${filename}` });
  }
} finally { await browser.close(); }
