"""Local Blender: generate only the two simplified background surfaces.

The runtime experiment substitutes geometry, never materials or selected parts.
Run: blender --background --python art/build_background_lod.py
"""
import bpy
import bmesh
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/assets/archive-cassette.glb'
OUT = ROOT / 'reference/background-lod'
RATIOS = {'Titanium_Fasteners': .18, 'Ivory_Edges': .60}
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
rows, reduced = [], []
for obj in list(bpy.context.scene.objects):
    if obj.type != 'MESH':
        continue
    name = re.sub(r'(\.\d+)+$', '', obj.data.materials[0].name)
    if name not in RATIOS:
        continue
    obj.data.calc_loop_triangles()
    before = len(obj.data.loop_triangles)
    original = obj.copy()
    original.data = obj.data.copy()
    original.name = 'Reference_' + name
    bpy.context.scene.collection.objects.link(original)
    bpy.context.view_layer.objects.active = obj
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.000001)
    bm.to_mesh(obj.data)
    bm.free()
    dec = obj.modifiers.new('Background reduction', 'DECIMATE')
    dec.ratio = RATIOS[name]
    dec.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=dec.name)
    normals = obj.modifiers.new('Preserve source normals', 'DATA_TRANSFER')
    normals.object = original
    normals.use_loop_data = True
    normals.data_types_loops = {'CUSTOM_NORMAL'}
    normals.loop_mapping = 'POLYINTERP_NEAREST'
    bpy.ops.object.modifier_apply(modifier=normals.name)
    original.hide_render = True
    original.hide_set(True)
    obj.name = 'Background_' + name
    obj.data.calc_loop_triangles()
    rows.append({'surface': name, 'before': before, 'after': len(obj.data.loop_triangles)})
    reduced.append(obj)
assert len(reduced) == 2, rows
bpy.ops.object.select_all(action='DESELECT')
for obj in reduced:
    obj.select_set(True)
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(OUT / 'medium.glb'), export_format='GLB',
                         use_selection=True, export_yup=True, export_normals=True)
manifest = {'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'parts': rows}
(OUT / 'medium.json').write_text(json.dumps(manifest, indent=2), encoding='utf8')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'art/background-lod.blend'), compress=True)
print(json.dumps(manifest))
