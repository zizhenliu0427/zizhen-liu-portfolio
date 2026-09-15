import { cp, mkdir, readFile, rm, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'apps/rhine');
const target = resolve(root, 'public/rhine');
// This is the only generated subtree the build may replace.
if (target !== resolve(root, 'public', 'rhine') || !target.startsWith(root + sep)) {
  throw new Error('Invalid Rhine output directory');
}
try { await access(resolve(source, 'node_modules/vite/bin/vite.js')); }
catch { throw new Error('Rhine dependencies are missing. Run npm ci from the portfolio root.'); }
function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: source, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Rhine build failed: ${script}`);
}
run('scripts/patch-rolling-number.mjs');
run('scripts/export-records.mjs');
run('scripts/prepare-webfonts.mjs');
run('node_modules/typescript/bin/tsc');
run('node_modules/vite/bin/vite.js', ['build', '--mode', 'portfolio']);
run('scripts/build-pwa.mjs');
// Check the build before replacing the previous working preview.
const html = await readFile(resolve(source, 'dist/index.html'), 'utf8');
if (!html.includes('/rhine/assets/index-')) throw new Error('Rhine build is missing its URL prefix');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(resolve(source, 'dist'), target, { recursive: true });
await cp(resolve(source, 'art/project-previews'), resolve(target, 'art/project-previews'), { recursive: true });
await cp(resolve(source, 'art/project-evidence'), resolve(target, 'art/project-evidence'), { recursive: true });
console.log('Rhine is ready at /rhine/index.html (service worker scoped to /rhine/).');
