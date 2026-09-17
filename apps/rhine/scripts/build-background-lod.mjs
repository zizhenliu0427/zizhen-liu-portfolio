import {build} from 'vite';
import {mkdir,cp} from 'node:fs/promises';
const outDir='release/background-lod';
await build({build:{outDir,rollupOptions:{input:'reference/background-lod.html'}}});
await mkdir(`${outDir}/reference/background-lod`,{recursive:true});
await cp('reference/background-lod/medium.glb',`${outDir}/reference/background-lod/medium.glb`);
