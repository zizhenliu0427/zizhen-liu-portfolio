"""Two project-specific archive interiors, with source captures and measured data.
Blender 4.5+: --background --factory-startup --python art/build_evidence_models.py -- --render
"""
from pathlib import Path
import bpy, json, math, sys
from mathutils import Vector
ROOT = Path(__file__).resolve().parents[1]
# Reuse the collection's coordinate, machining and material conventions only.
exec(compile((ROOT/'art/build_project_models.py').read_text(encoding='utf-8').split('report=[]')[0], str(ROOT/'art/build_project_models.py'), 'exec'))
EVIDENCE = ROOT/'art/project-evidence'
RESULTS = json.loads((EVIDENCE/'gpu-results.json').read_text(encoding='utf-8'))

def screen(name,x,y,w,z,part):
    image=bpy.data.images.load(str(EVIDENCE/('novacart-'+name+'.png')),check_existing=True)
    image.pack()
    h=w*image.size[1]/image.size[0]
    box(x,y,w+.07,h+.07,'graphite',depth=.03,z=z-.022,part=part)
    mesh=bpy.data.meshes.new('Source interface '+name)
    mesh.from_pydata([(x-w/2,-z,y-h/2),(x+w/2,-z,y-h/2),(x+w/2,-z,y+h/2),(x-w/2,-z,y+h/2)],[],[(0,1,2,3)])
    uv=mesh.uv_layers.new()
    for i,coord in enumerate([(0,0),(1,0),(1,1),(0,1)]):uv.data[i].uv=coord
    mat=bpy.data.materials.new('Project_Evidence_Novacart_'+name);mat.use_nodes=True
    shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Roughness'].default_value=.65
    tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image
    shader.inputs['Base Color'].default_value=(0,0,0,1)
    shader.inputs['Specular IOR Level'].default_value=0
    mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Emission Color'])
    shader.inputs['Emission Strength'].default_value=1
    obj=bpy.data.objects.new('Actual '+name+' interface',mesh);bpy.context.scene.collection.objects.link(obj)
    mesh.materials.append(mat);obj['assemblyPart']=part;obj['portfolioInterior']=True
    return h

def stamp(text,x,y,size=.09,part='optical-lenses',material='ceramic'):
    label(text,x,y,size,material,part)

def novacart():
    # Large catalogue sheet and two transaction sheets, independently separated
    # by the existing explode control. Shallow rails keep the source UI in focus.
    screen('products',-.78,1.94,2.24,.079,'optical-core')
    screen('cart',1.22,2.16,1.43,.145,'optical-lenses')
    screen('orders',1.22,1.28,1.43,.145,'optical-lenses')
    stamp('01 / CATALOGUE',-1.91,2.74,.105,part='optical-core')
    stamp('02 / CART',.50,2.64,.095)
    stamp('03 / ORDER',.50,1.63,.095)
    stamp('SOURCE UI / DEMO DATA',-1.9,1.06,.085,part='optical-core')
    # Explicit route from the architecture document, not decorative electronics.
    for x,w,text in [(-1.35,1.1,'NEXT.JS'),(0,1.05,'YARP'),(1.35,1.15,'APIs')]:
        box(x,.72,w,.22,'graphite',depth=.05,z=.055,part='optical-core')
        stamp(text,x-w/2+.09,.69,.105,part='optical-core')
    line([(-.80,.72),(-.54,.72)],'amber',.028)
    line([(.53,.72),(.77,.72)],'amber',.028)
    stamp('AUTH / PRODUCT / CART / ORDER',-1.65,.39,.087)

def gpu():
    stamp('RX 9070 XT / VULKAN / 1M',-1.90,2.76,.13)
    max_width=3.72; maximum=RESULTS['headless']['throughput']
    for key,y,mat,title in [('windowed',2.24,'silver','WINDOWED'),('headless',1.47,'amber','COMPUTE ONLY')]:
        value=RESULTS[key]['throughput'];width=max_width*value/maximum
        box(0,y,3.82,.24,'graphite',depth=.028,z=.008,part='optical-core')
        box(-1.86+width/2,y,width,.20,mat,depth=.065,z=.077,part='optical-core')
        stamp(title,-1.9,y+.23,.12,part='optical-core')
        stamp(f'{value:,.1f} /s',.43,y+.23,.15,part='optical-core')
    # Equal-looking compute timings explain the throughput difference honestly.
    stamp('COMPUTE TIME',-1.90,.95,.095)
    stamp('0.033 ms  /  0.034 ms',-.53,.95,.13)
    stamp('WINDOWED: COMPUTE > DRAW > PRESENT',-1.9,.66,.084)
    stamp('HEADLESS: COMPUTE',-1.9,.44,.084)
    stamp('REPORT / 5c',.80,.44,.085)

report=[]
for identifier,build in [('W-002',novacart),('S-002',gpu)]:
    spec=CATALOG[identifier];scene=bpy.data.scenes.new(spec['key']);bpy.context.window.scene=scene
    # A dark exhibit backing keeps both the source UI and engraved captions
    # legible inside the light archive shell as well as the dark one.
    box(0,1.7,4.12,2.98,'graphite',depth=.025,z=-.016,part='optical-core')
    for x in [-2.04,2.04]:
        box(x,1.7,.04,2.8,'silver',depth=.028,z=.006,part='optical-core')
        for y in [.43,2.93]:disc(x,y,.051,'amber',z=.035,depth=.025,vertices=16,part='optical-lenses')
    stamp(spec['key'].upper(),.1,3.06,.11)
    stamp(identifier+' / PROJECT EVIDENCE',-1.9,.25,.081)
    build()
    pairs={}
    for obj in list(scene.objects):pairs.setdefault((obj['assemblyPart'],obj.data.materials[0].name),[]).append(obj)
    for (part,surface),objects in pairs.items():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects:obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join()
        obj=bpy.context.object;obj.name=part+'__'+surface;obj['assemblyPart']=part;obj['portfolioInterior']=True
        scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    scene['archiveId']=identifier;scene['evidenceSource']='art/project-evidence'
    bpy.ops.object.select_all(action='SELECT');output=OUTPUT/(spec['key']+'.glb')
    bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
    report.append(dict(id=identifier,key=spec['key'],meshes=len(scene.objects),triangles=sum(len(p.vertices)-2 for obj in scene.objects for p in obj.data.polygons),bytes=output.stat().st_size))
    scene.render.engine='CYCLES';scene.cycles.samples=24
    scene.render.resolution_x=1280;scene.render.resolution_y=920;scene.render.resolution_percentage=100
    scene.world=bpy.data.worlds.new('Evidence studio');scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.12,.15,.17,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.4
    scene.view_settings.view_transform='Standard'
    bpy.ops.object.camera_add(location=(.4,-9,4.1));camera=bpy.context.object
    camera.rotation_euler=(Vector((0,0,1.75))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=4.7;scene.camera=camera
    for pos,energy,size in [((-3,-4,6),350,4),((3,-2,4),180,3)]:
        bpy.ops.object.light_add(type='AREA',location=pos);light=bpy.context.object;light.data.energy=energy;light.data.shape='DISK';light.data.size=size
        light.rotation_euler=(Vector((0,0,1.7))-light.location).to_track_quat('-Z','Y').to_euler()
    box(0,1.7,4.5,3.4,'graphite',depth=.035,z=-.1,part='studio')
    scene.render.image_settings.file_format='PNG';scene.render.filepath=str(RENDERS/(spec['key']+'.png'))
    if '--render' in sys.argv:bpy.ops.render.render(write_still=True)
    print('EVIDENCE_MODEL',report[-1],flush=True)
(ROOT/'art/project-evidence/report.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
combined={entry['id']:entry for entry in json.loads((ROOT/'art/project-models-report.json').read_text(encoding='utf-8'))}
combined.update({entry['id']:entry for entry in report})
(ROOT/'art/project-models-report.json').write_text(json.dumps(sorted(combined.values(),key=lambda entry:entry['id']),indent=2)+'\n',encoding='utf-8')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art/project-evidence.blend'),compress=True)
