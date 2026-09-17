import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ArchiveScene} from '../src/scene';
import {qualityPresets} from '../src/render-quality';

// This separate experiment never changes the production scene or saved settings.
let seed=431;
Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const stage=document.querySelector<HTMLElement>('#stage')!;
const fit=()=>{stage.style.transform=`scale(${innerWidth/1920})`;stage.style.height=`${innerHeight*1920/innerWidth}px`;};
fit();
const scene=new ArchiveScene(document.querySelector<HTMLElement>('#scene')!);
await scene.load();
scene.select(0);
while(scene.projectModelState==='loading') await new Promise(r=>setTimeout(r,20));
const internal=scene as any;
const surfaces=new Set(['Ivory_Edges','Titanium_Fasteners']);
const original=new Map<THREE.InstancedMesh,THREE.BufferGeometry>();
const simplified=new Map<THREE.InstancedMesh,THREE.BufferGeometry>();
const source=await new GLTFLoader().loadAsync(new URL('./background-lod/medium.glb',location.href).href);
source.scene.updateMatrixWorld(true);
for(const instance of internal.instances as THREE.InstancedMesh[]) {
 const name=(instance.material as THREE.Material).name.replace(/(?:\.\d+)+$/,'');
 if(!surfaces.has(name)) continue;
 let next:THREE.BufferGeometry|undefined;
 source.scene.traverse(object=>{
  if(object instanceof THREE.Mesh && (object.material as THREE.Material).name.replace(/(?:\.\d+)+$/,'')===name) next=object.geometry.clone().applyMatrix4(object.matrixWorld);
 });
 if(!next) throw new Error(`Missing LOD surface ${name}`);
 const geometry=next as THREE.BufferGeometry;
 instance.geometry.computeBoundingBox();geometry.computeBoundingBox();
 const delta=instance.geometry.boundingBox!.min.distanceTo(geometry.boundingBox!.min)+instance.geometry.boundingBox!.max.distanceTo(geometry.boundingBox!.max);
 if(delta>.035) throw new Error(`LOD bounds differ for ${name}: ${delta}`);
 geometry.setAttribute('archiveTheme',internal.themeAttribute);
 original.set(instance,instance.geometry);simplified.set(instance,geometry);
}
if(simplified.size!==2) throw new Error('Expected two background substitutions');
source.scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(object.material as THREE.Material).dispose();}});
const triangles=(mesh:THREE.Mesh)=>(mesh.geometry.index?.count??mesh.geometry.attributes.position.count)/3;
let tier='high',time=100,paused=false,last=0,frames=0,frameStart=0;
const geometryStats=()=>({tier,arrayTriangles:(internal.instances as THREE.Mesh[]).reduce((s,m)=>s+triangles(m),0),selected:internal.model.children.filter((m:any)=>m.isMesh).map((m:THREE.Mesh)=>({id:m.geometry.id,triangles:triangles(m),material:(m.material as THREE.Material).uuid})),materials:(internal.instances as THREE.Mesh[]).map(m=>(m.material as THREE.Material).uuid)});
function setTier(next:string) {
 tier=next;
 (document.querySelector('#lod') as HTMLSelectElement).value=next;
 for(const [mesh,geometry] of next==='medium'?simplified:original) {
  // Preparing a full view can grow the pool while the other LOD is inactive.
  // Refresh its instance attribute or WebGL silently clips the surface count.
  geometry.setAttribute('archiveTheme',internal.themeAttribute);
  mesh.geometry=geometry;mesh.boundingSphere=null;
 }
 internal.renderState.invalidate();
 const stats=geometryStats();
 document.querySelector('#note')!.textContent=`背景 ${stats.arrayTriangles.toLocaleString()} 面／档案 · 近景保持原始模型`;
}
function prepare(shot='idle',quality='original',dark=false) {
 (document.querySelector('#shot') as HTMLSelectElement).value=shot;
 (document.querySelector('#quality') as HTMLSelectElement).value=quality;
 (document.querySelector('#dark') as HTMLInputElement).checked=dark;
 scene.setTheme(dark,true);scene.setQuality(qualityPresets[quality as 'original'|'balanced']);
 scene.setMode(shot==='detail'?'detail':'archive');scene.revealImmediately();
 scene.setReduced(false);scene.uiOnlyParallax=true;
 time=100;internal.last=time;internal.lastInteraction=time-10;internal.pulses=[];
 for(let i=0;i<1200;i++){time+=1/60;scene.update(time,undefined,true);}
 internal.renderState.invalidate();scene.update(time);
}
const gl=scene.renderer.getContext() as WebGL2RenderingContext;
const ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');
const debug=gl.getExtension('WEBGL_debug_renderer_info');
async function sample(count=120) {
 const pending:{query:WebGLQuery;index:number}[]=[];
 const samples:{cpu:number;gpu:number|null;calls:number;triangles:number}[]=[];
 const collect=()=>{
  for(let i=pending.length-1;i>=0;i--){const p=pending[i];if(!gl.getQueryParameter(p.query,gl.QUERY_RESULT_AVAILABLE))continue;
   if(!gl.getParameter(ext.GPU_DISJOINT_EXT))samples[p.index].gpu=gl.getQueryParameter(p.query,gl.QUERY_RESULT)/1e6;
   gl.deleteQuery(p.query);pending.splice(i,1);
  }
 };
 for(let i=0;i<count;i++) {
  await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
  collect();const q=ext?gl.createQuery():null;
  if(q)gl.beginQuery(ext.TIME_ELAPSED_EXT,q);
  time+=1/240;const begin=performance.now();scene.update(time);
  const cpu=performance.now()-begin;
  if(q){gl.endQuery(ext.TIME_ELAPSED_EXT);pending.push({query:q,index:samples.length});}
  samples.push({cpu,gpu:null,calls:scene.renderer.info.render.calls,triangles:scene.renderer.info.render.triangles});
 }
 const deadline=performance.now()+5000;
 while(pending.length && performance.now()<deadline){await new Promise(r=>setTimeout(r,5));collect();}
 pending.forEach(p=>gl.deleteQuery(p.query));
 for(const mesh of internal.instances as THREE.InstancedMesh[]) {
  if(mesh.geometry.getAttribute('archiveTheme')!==internal.themeAttribute || internal.themeAttribute.count<mesh.count) throw new Error('Stale LOD instance capacity');
 }
 return {samples,geometry:geometryStats(),stats:scene.getStats(),quality:document.querySelector<HTMLElement>('#scene')!.dataset.renderQuality,renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
}
setTier('high');prepare();
const automation=new URLSearchParams(location.search).has('bench');
if(automation)internal.inputEvents.abort();
Object.assign(window,{lodBench:{scene,setTier,prepare,sample,geometryStats,automation,freeze:()=>{paused=true;},draw:()=>scene.update(time)}});
const option=(id:string)=>(document.querySelector(id) as HTMLSelectElement).value;
const update=()=>{setTier(option('#lod'));prepare(option('#shot'),option('#quality'),(document.querySelector('#dark') as HTMLInputElement).checked);};
document.querySelector('#lod')!.addEventListener('change',()=>{setTier(option('#lod'));scene.update(time);});
for(const id of ['#quality','#shot','#dark'])document.querySelector(id)!.addEventListener('change',update);
document.querySelector('#pause')!.addEventListener('click',event=>{paused=!paused;(event.target as HTMLElement).textContent=paused?'继续动画':'暂停对比';});
window.addEventListener('resize',()=>{fit();scene.resize();scene.update(time);});
if(!automation)requestAnimationFrame(function tick(ms){
 if(!paused){time+=last?Math.min((ms-last)/1000,.05):1/60;scene.update(time);}
 last=ms;frames++;
 if(ms-frameStart>=1000){document.querySelector('#fps')!.textContent=paused?'已暂停':`${Math.round(frames*1000/(ms-frameStart))} FPS`;frames=0;frameStart=ms;}
 requestAnimationFrame(tick);
});
