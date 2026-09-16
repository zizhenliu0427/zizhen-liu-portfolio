import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import catalog from '../content/project-models.json';
import { assetUrl } from './asset-url';
import { disposeThreeTree } from './three-resources';

export type ProjectModel = { key: string; title: string; zh: string; design: string; layers: string[]; layersEn?: string[]; nativeInterior?: boolean };
export function projectModel(id: string): ProjectModel | undefined {
  return (catalog as Record<string, ProjectModel>)[id];
}
export function usesProjectGlass(id: string) {
  const model = projectModel(id);
  return Boolean(model && !model.nativeInterior);
}

// The old inner optics are merged by surface in the original cassette GLB.
// Preserve the shell, substrate, labels, screws and perimeter engravings.
const originalInterior = new Set(['Internal_Ceramic','Optical_Edges','Subsurface_Optics',
  'Optical_Film_Edge','Amber_Optical_Inlay','Optical_Film','Optical_Glass_Body',
  'Optical_Glass_Roof','Optical_Glass_Edge','Optical_Bridge_Glass']);
export function isOriginalInterior(mesh: Pick<THREE.Object3D, 'userData'>) {
  return originalInterior.has(mesh.userData.surface);
}

async function loadInterior(key: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(assetUrl(`assets/projects/${key}.glb`), {signal: controller.signal});
    if (!response.ok) throw new Error(`Project model HTTP ${response.status}`);
    return await new GLTFLoader().parseAsync(await response.arrayBuffer(), '');
  } finally { clearTimeout(timeout); }
}

/** Lazy CPU templates; clones share geometry but own materials/appearance state.
 * The finite archive-model catalogue bounds this cache. Only the selected archive loads.
 */
export class ProjectModels {
  private templates = new Map<string, Promise<THREE.Group>>();
  private disposed = false;
  async create(spec: ProjectModel): Promise<THREE.Mesh[]> {
    if (this.disposed) throw new Error('Project model library is disposed');
    let pending = this.templates.get(spec.key);
    if (!pending) {
      pending = loadInterior(spec.key).then(gltf => {
        gltf.scene.updateMatrixWorld(true);
        const flat = new THREE.Group();
        const transferred = new Set<THREE.MeshStandardMaterial>();
        gltf.scene.traverse(object => {
          if (!(object instanceof THREE.Mesh)) return;
          const original = object.material as THREE.MeshStandardMaterial;
          // Embedded screenshots belong to the cached template. Each instance
          // shares its textures but owns its material, just like its geometry.
          const material = new THREE.MeshPhysicalMaterial({color: original.color, metalness: original.metalness, roughness: original.roughness,
            map: original.map, emissiveMap: original.emissiveMap, emissive: original.emissive, emissiveIntensity: original.emissiveIntensity,
            side: original.side});
          transferred.add(original);
          material.name = original.name;
          const mesh = new THREE.Mesh(object.geometry.clone().applyMatrix4(object.matrixWorld), material);
          mesh.userData = { surface: material.name.replace(/\.\d+$/, ''),
            assemblyPart: object.userData.assemblyPart, portfolioInterior: true, projectKey: spec.key };
          mesh.name = object.name;
          flat.add(mesh);
        });
        for (const material of transferred) { material.map = null; material.emissiveMap = null; }
        disposeThreeTree(gltf.scene);
        if (this.disposed) { disposeThreeTree(flat); throw new Error('Project model library is disposed'); }
        return flat;
      }).catch(error => { this.templates.delete(spec.key); throw error; });
      this.templates.set(spec.key, pending);
    }
    const template = await pending;
    return template.children.map(child => {
      const source = child as THREE.Mesh;
      const mesh = new THREE.Mesh(source.geometry, (source.material as THREE.Material).clone());
      mesh.name = source.name;
      mesh.userData = { ...source.userData };
      mesh.receiveShadow = true;
      return mesh;
    });
  }
  dispose() {
    this.disposed = true;
    for (const template of this.templates.values()) void template.then(disposeThreeTree).catch(() => {});
    this.templates.clear();
  }
}
