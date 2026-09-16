"""Export only the original side inscription for the acknowledgements archive.
The runtime keeps the shared native optics and adds this one optional mesh.
"""
import bpy
from pathlib import Path

TRIBUTE_LETTERING = True
BUILD_ROOT = Path(__file__).resolve().parents[1]
source = (BUILD_ROOT/'art/build_archive.py').read_text(encoding='utf-8')
exec(compile(source.split('# Convert text, bake modifiers')[0], str(BUILD_ROOT/'art/build_archive.py'), 'exec'))
lettering = next(obj for obj in scene.objects if obj.name == 'Moulded vertical lettering')
for obj in list(scene.objects):
    if obj != lettering: bpy.data.objects.remove(obj, do_unlink=True)
bpy.context.view_layer.objects.active = lettering
lettering.select_set(True)
bpy.ops.object.convert(target='MESH')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for vertex in lettering.data.vertices: vertex.co.y *= 2
lettering['assemblyPart'] = 'cover'
lettering['portfolioInterior'] = True
output = BUILD_ROOT/'public/assets/projects/rhine-tribute.glb'
staged = BUILD_ROOT/'art/.cache/rhine-tribute.glb'
staged.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(staged), export_format='GLB', use_selection=True, use_active_scene=True, export_extras=True)
staged.replace(output)
bpy.ops.wm.save_as_mainfile(filepath=str(BUILD_ROOT/'art/rhine-tribute.blend'), compress=True)
print('Exported tribute lettering; native glass and optics are reused by the runtime.')
