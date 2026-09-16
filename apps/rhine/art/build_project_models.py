"""Original portfolio interiors. Blender 4.5+, no external assets or add-ons.
Run: blender --background --factory-startup --python art/build_project_models.py
Coordinates below are website coordinates (x, height, depth); glTF exports Y-up.
"""
import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / 'content/project-models.json').read_text(encoding='utf-8'))
OUTPUT = ROOT / 'public/assets/projects'
OUTPUT.mkdir(parents=True, exist_ok=True)
RENDERS = ROOT / 'art/project-previews'
RENDERS.mkdir(parents=True, exist_ok=True)
for obj in list(bpy.data.objects): bpy.data.objects.remove(obj, do_unlink=True)
MATERIALS = {}
for name, colour, metal, rough in [
    ('Project_Ceramic', (.71,.75,.70), .28, .32),
    ('Project_Graphite', (.045,.075,.08), .55, .3),
    ('Project_Amber', (.9,.43,.105), .52, .26),
    ('Project_Trace', (.22,.54,.53), .45, .28),
    ('Project_Silver', (.52,.60,.61), .7, .25),
]:
    mat = bpy.data.materials.new(name); mat.use_nodes = True
    mat.diffuse_color = (*colour, 1)
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*colour, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    MATERIALS[name.removeprefix('Project_').lower()] = mat

def finish(obj, name, material, part):
    obj.name = name; obj.data.materials.append(MATERIALS[material]); obj['assemblyPart'] = part
    obj['portfolioInterior'] = True
    return obj

def box(x,y,w,h,material='ceramic',depth=.065,z=.065,part='optical-core',angle=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x,-z,y))
    obj=bpy.context.object; obj.dimensions=(w,depth,h)
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.rotation_euler.y=-angle
    bevel=obj.modifiers.new('Machined edge','BEVEL'); bevel.width=min(.014,w/8,h/8,depth/4); bevel.segments=2
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    return finish(obj,'Machined module',material,part)

def disc(x,y,r,material='amber',depth=.055,z=.075,part='optical-core',vertices=40):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=(x,-z,y),rotation=(math.pi/2,0,0))
    obj=bpy.context.object
    return finish(obj,'Turned node',material,part)

def ring(x,y,r,material='silver',tube=.027,z=.09,part='optical-lenses'):
    bpy.ops.mesh.primitive_torus_add(major_segments=48,minor_segments=6,location=(x,-z,y),rotation=(math.pi/2,0,0),major_radius=r,minor_radius=tube)
    obj=bpy.context.object
    for face in obj.data.polygons: face.use_smooth=True
    return finish(obj,'Machined annulus',material,part)

def line(points,material='trace',width=.023,z=.025,part='optical-lenses'):
    for (x,y),(xx,yy) in zip(points,points[1:]):
        length=math.hypot(xx-x,yy-y)
        if length: box((x+xx)/2,(y+yy)/2,length,width,material,depth=.022,z=z,part=part,angle=math.atan2(yy-y,xx-x))

def label(text,x,y,size=.115,material='silver',part='optical-lenses'):
    curve=bpy.data.curves.new('Machined legend','FONT'); curve.body=text; curve.size=size; curve.extrude=.0007; curve.resolution_u=3
    obj=bpy.data.objects.new('Legend '+text,curve); bpy.context.scene.collection.objects.link(obj)
    obj.location=(x,-.143,y); obj.rotation_euler=(math.pi/2,0,0)
    finish(obj,obj.name,material,part)
    bpy.context.view_layer.objects.active=obj; obj.select_set(True)
    bpy.ops.object.convert(target='MESH'); obj.select_set(False)

def pins(x,y,w,h):
    for side in [-1,1]:
        for i in range(8): box(x-w*.38+i*w*.76/7,y+side*(h/2+.055),.035,.12,'silver',depth=.027,z=.04,part='optical-lenses')
        for i in range(6): box(x+side*(w/2+.055),y-h*.36+i*h*.72/5,.12,.035,'silver',depth=.027,z=.04,part='optical-lenses')

def node(x,y,r=.11,material='amber'):
    disc(x,y,r+.04,'graphite',z=.04); disc(x,y,r,material,z=.09)
    disc(x,y,r*.28,'silver',z=.125,depth=.014)

def rack(x,y,w=.8,h=1.35,rows=5):
    box(x,y,w,h,'graphite',depth=.09,z=.04)
    for i in range(rows):
        yy=y-h/2+.14+i*(h-.28)/max(1,rows-1)
        box(x,yy,w-.1,.16,'ceramic',depth=.035,z=.115)
        disc(x+w*.29,yy,.025,'amber',depth=.018,z=.144,vertices=12)
        line([(x-w*.32,yy),(x+w*.1,yy)],'graphite',.025,z=.141,part='optical-core')

def build(design):
    if design=='radar':
        for r in [.28,.53,.8]: ring(-.8,1.68,r,'trace',.019)
        for a in range(0,360,45):
            rad=math.radians(a); line([(-.8,1.68),(-.8+.8*math.cos(rad),1.68+.8*math.sin(rad))],'silver',.012)
        line([(-.8,1.68),(-.24,2.25)],'amber',.055,z=.13)
        for x,y in [(-1.12,1.91),(-.46,1.33),(-.64,2.21)]: node(x,y,.055)
        for i in range(4):
            box(1.05,2.42-i*.46,1.05,.29,'graphite')
            box(.67,2.42-i*.46,.19,.17,'amber',z=.12,depth=.026)
            line([(.89,2.42-i*.46),(1.46,2.42-i*.46)],'ceramic',.04,z=.12)
    elif design=='commerce':
        for x in [-1.17,0,1.17]:
            box(x,1.85,.91,1.58,'graphite',depth=.04,z=.012)
            for row in range(3):
                yy=1.25+row*.49
                line([(x-.4,yy-.17),(x+.4,yy-.17)],'silver',.028)
                for j in range(2):
                    xx=x-.2+j*.4
                    box(xx,yy,.30,.31,'amber' if (row+j)%3==0 else 'ceramic',z=.087,depth=.08)
                    line([(xx,yy-.15),(xx,yy+.15)],'graphite',.02,z=.133,part='optical-core')
        line([(-1.65,.68),(1.65,.68)],'trace',.045)
        for x in [-1.3,-.65,0,.65,1.3]: disc(x,.68,.06,'silver',z=.075)
    elif design=='campaign':
        box(-.75,2.05,1.6,1.08,'graphite',depth=.075)
        box(-.75,2.05,1.38,.87,'ceramic',depth=.025,z=.12)
        line([(-1.28,1.78),(-.93,2.15),(-.63,1.98),(-.24,2.37)],'amber',.065,z=.15)
        for i,h in enumerate([.35,.61,.91,1.2]): box(.38+i*.36,1.14+h/2,.23,h,'trace' if i<3 else 'amber',z=.07)
        for i,r in enumerate([.23,.16,.09]):
            disc(-1.25+i*.58,.76,r,'amber' if i==2 else 'silver')
        line([(-1.25,.76),(1.55,.76)],'trace',.025,z=.01)
    elif design=='kanban':
        for col in range(3):
            x=-1.18+col*1.18
            box(x,1.72,.95,1.9,'graphite',depth=.025,z=.005)
            box(x,2.52,.8,.12,'amber' if col==2 else 'trace',depth=.03,z=.05)
            for row in range([3,2,1][col]):
                y=2.14-row*.49; box(x,y,.76,.35,'ceramic',z=.065)
                line([(x-.25,y),(x+.16,y)],'graphite',.027,z=.105)
        line([(-1.2,.57),(1.2,.57)],'trace',.026)
        for x in [-1.2,0,1.2]:node(x,.57,.075)
    elif design=='shipping':
        # Long hull, bridge, stacked cargo and two distinct port endpoints.
        box(-.13,1.63,2.5,.66,'graphite',angle=-.08,depth=.075)
        disc(1.1,1.53,.33,'graphite',vertices=3,z=.065)
        for row in range(2):
            for col in range(5):
                x=-1.05+col*.44; y=1.48+row*.35
                box(x,y,.37,.27,'amber' if (row+col)%3==0 else 'ceramic',z=.12,depth=.04)
                for dx in [-.1,0,.1]:line([(x+dx,y-.1),(x+dx,y+.1)],'graphite',.013,z=.145,part='optical-core')
        box(-1.41,1.65,.26,.48,'silver',z=.115)
        line([(-1.75,2.63),(-.4,2.63),(.1,2.29),(1.72,2.29)],'trace',.035)
        line([(-1.7,.74),(-.58,.74),(.2,1.01),(1.7,1.01)],'trace',.035)
        for x,y in [(-1.75,2.63),(1.72,2.29),(-1.7,.74),(1.7,1.01)]:node(x,y,.09)
    elif design=='game':
        ring(0,1.62,.94,'trace',.04)
        box(0,1.62,.95,.95,'ceramic',z=.075,depth=.11,angle=.16)
        for x,y in [(-.23,1.39),(.23,1.85),(-.23,1.85),(.23,1.39),(0,1.62)]:disc(x,y,.052,'graphite',z=.14,depth=.012)
        for i in range(6):
            a=i*math.pi/3; x=1.45*math.cos(a); y=1.62+1.02*math.sin(a)
            disc(x,y,.17,'amber' if i%2 else 'silver',vertices=6)
            line([(x*.82,1.62+(y-1.62)*.82),(x*.68,1.62+(y-1.62)*.68)])
    elif design=='chat':
        for x,y,flip in [(-.78,2.11,-1),(.77,1.22,1)]:
            box(x,y,1.35,.74,'ceramic' if flip<0 else 'trace',z=.07)
            box(x+flip*.35,y-.36,.25,.25,'ceramic' if flip<0 else 'trace',angle=math.pi/4,z=.07)
            for dx in [-.35,0,.35]:disc(x+dx,y,.055,'graphite',z=.113,depth=.017)
        line([(-1.45,.69),(-1.45,1.21),(-.65,1.21),(-.65,1.7)],'amber',.035)
        line([(1.46,2.63),(1.46,2.06),(.63,2.06),(.63,1.68)],'amber',.035)
        node(-1.45,.69);node(1.46,2.63)
    elif design=='stream':
        ring(-.95,1.8,.65,'ceramic',.047)
        disc(-.94,1.8,.32,'amber',vertices=3,z=.08)
        for row in range(4):
            for col in range(3):box(.2+col*.46,2.4-row*.43,.35,.25,'ceramic' if row%2 else 'trace')
        line([(-1.6,.76),(1.55,.76)],'silver',.035)
        for x in [-1.4,-.9,-.4,.1,.6,1.1]:box(x,.76,.27,.12,'amber',depth=.025,z=.08)
    elif design=='building':
        for x,y,w,h in [(-1.15,1.5,.67,1.47),(-.27,1.82,.72,2.1),(.65,1.42,.7,1.31)]:
            box(x,y,w,h,'graphite',z=.055,depth=.09)
            for row in range(int(h/.32)):
                for col in range(2):box(x-.16+col*.32,y-h/2+.19+row*.31,.16,.15,'ceramic',z=.12,depth=.025)
        for x,y in [(1.62,2.59),(1.62,1.58),(1.62,.65)]:
            ring(x,y,.15,'trace',.024); node(x,y,.047)
            line([(x-.17,y),(1.15,y),(1.15,1.12),(.66,1.12)],'amber',.021)
    elif design=='classifier':
        ring(-.94,1.7,.76,'silver',.048);ring(-.94,1.7,.62,'trace',.022)
        for i in range(17):
            a=i*2.39996;r=.48*math.sqrt((i+1)/17)
            disc(-.94+r*math.cos(a),1.7+r*math.sin(a),.04+(i%3)*.013,'amber' if i%3==0 else 'graphite',vertices=12,z=.07)
        for col in range(3):
            for row in range(4-col):node(.35+col*.55,1.0+row*.43+col*.2,.063,'trace' if col<2 else 'amber')
        for i in range(3):line([(-.15,1.7),(.35,1.0+i*.43),(.9,1.2+i*.43),(1.45,1.5)],'silver',.012)
    elif design=='vision':
        for x,y,dx,dy in [(-1.65,.71,1,1),(-1.65,2.67,1,-1),(1.65,.71,-1,1),(1.65,2.67,-1,-1)]:line([(x,y+dy*.35),(x,y),(x+dx*.35,y)],'trace',.045)
        box(-.63,1.67,1.27,1.09,'graphite',z=.04)
        for r,mat in [(.49,'silver'),(.34,'amber'),(.18,'trace')]:ring(-.63,1.67,r,mat,.04,z=.11)
        for i in range(3):
            box(.96,2.28-i*.58,.73,.38,'ceramic')
            line([(.77,2.28-i*.58),(.89,2.16-i*.58),(1.17,2.41-i*.58)],'amber',.037,z=.11)
    elif design=='speech':
        for i in range(23):
            x=-1.7+i*.15;h=.17+.87*abs(math.sin(i*.72))*math.sin(math.pi*(i+1)/24)
            box(x,2.02,.067,h,'amber' if i in range(9,15) else 'trace',depth=.07)
        for row,w in enumerate([2.95,2.25,2.64]):
            yy=1.07-row*.21
            for i in range(int(w/.22)):box(-1.53+i*.22,yy,.16,.085,'ceramic',depth=.027,z=.08)
    elif design=='colour':
        for i in range(10):
            h=.26+i*.14;box(-1.57+i*.35,.74+h/2,.25,h,'graphite' if i<3 else 'trace' if i<7 else 'amber',depth=.075)
        for i in range(3):
            line([(-1.65,2.58-i*.15),(-.15,2.35),(.34,2.35),(1.65,2.71-i*.3)],['silver','trace','amber'][i],.032,z=.035)
        disc(.09,2.35,.43,'ceramic',vertices=3,z=.095,depth=.095)
    elif design=='gpu':
        box(0,1.72,1.81,1.69,'graphite',depth=.075,z=.05);pins(0,1.72,1.81,1.69)
        for row in range(4):
            for col in range(4):box(-.57+col*.38,1.16+row*.38,.27,.27,'amber' if (row+col)%4==0 else 'ceramic',depth=.04,z=.118)
        for x in [-1.55,1.55]:
            for i in range(3):box(x,1.03+i*.69,.38,.43,'graphite',depth=.065);line([(x,1.03+i*.69),(x*.63,1.03+i*.69)],'trace',.026)
    elif design=='graph':
        points=[(-1.6,1.7),(-.82,2.57),(-.73,.78),(.13,1.77),(.71,2.56),(.91,.73),(1.64,1.71)]
        for a,b in [(0,1),(0,2),(1,3),(2,3),(1,4),(3,4),(3,5),(4,6),(5,6),(3,6)]:
            p,q=points[a],points[b];line([p,q],'trace',.034)
            x=p[0]*.35+q[0]*.65;y=p[1]*.35+q[1]*.65
            disc(x,y,.055,'amber',vertices=3,z=.065,depth=.02)
        for i,(x,y) in enumerate(points):node(x,y,.16,'amber' if i==3 else 'ceramic')
    elif design=='fpga':
        for col in range(3):
            for row in range(3):
                x=-.85+col*.58;y=1.1+row*.57
                box(x,y,.4,.38,'graphite',depth=.08);box(x,y,.22,.2,'amber' if col==row else 'ceramic',z=.12,depth=.03)
        for y in [.81,1.38,1.95,2.52]:line([(-1.31,y),(.7,y)],'trace',.023)
        for x in [-1.14,-.57,.01,.59]:line([(x,.72),(x,2.65)],'silver',.019)
        for y in [1.05,1.72,2.39]:
            ring(1.4,y,.18,'silver',.045);disc(1.4,y,.08,'graphite');line([(.7,y),(1.2,y)],'amber',.028)
        line([(-1.82,.9),(-1.82,1.3),(-1.62,1.3),(-1.62,1.75),(-1.82,1.75),(-1.82,2.2),(-1.62,2.2),(-1.62,2.62)],'amber',.035)
    elif design=='cdn':
        ring(0,1.72,.63,'ceramic',.028)
        for r in [.23,.44]:ring(0,1.72,r,'silver',.015)
        line([(-.64,1.72),(.64,1.72)],'silver',.019)
        line([(0,1.09),(0,2.35)],'silver',.019)
        for i in range(8):
            a=i*math.pi/4;x=1.62*math.cos(a);y=1.72+1.01*math.sin(a)
            line([(x,y),(.58*math.cos(a),1.72+.58*math.sin(a))],'trace',.023)
            node(x,y,.12,'amber' if i%3==0 else 'ceramic')
    elif design=='server':
        rack(-1.17,1.85,.82,1.7,6);rack(-.14,1.85,.82,1.7,6)
        for i in range(3):
            box(1.06,1.25+i*.52,.79,.36,'graphite');ring(1.06,1.25+i*.52,.12,'silver',.03,z=.12)
        line([(-1.17,.98),(-1.17,.58),(1.07,.58),(1.07,.98)],'trace',.035)
        box(-.1,.58,1.0,.2,'silver',depth=.05)

report=[]
for identifier, spec in CATALOG.items():
    # Evidence prototypes have their own source scenes and embedded captures.
    if spec['design'].startswith(('evidence-','documentary-')): continue
    scene=bpy.data.scenes.new(spec['key']); bpy.context.window.scene=scene
    # Four mounting lands and a calibrated edge scale unify the collection.
    for x in [-1.94,1.94]:
        for y in [.46,2.82]:disc(x,y,.065,'silver',z=.016,depth=.024,vertices=16,part='optical-lenses')
    label(spec['title'],.1,3.04,.105)
    label(identifier+' / ENGINEERING STUDY',-1.85,.28,.088)
    for i in range(19):box(-1.8+i*.2,.4,.016,.047 if i%3 else .078,'silver',depth=.008,z=.006,part='optical-lenses')
    build(spec['design'])
    # Merge by material and assembly layer: fewer draws, no texture downloads.
    pairs={}
    for obj in list(scene.objects):pairs.setdefault((obj['assemblyPart'],obj.data.materials[0].name),[]).append(obj)
    for (part,surface),objects in pairs.items():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects:obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join()
        obj=bpy.context.object;obj.name=part+'__'+surface;obj['assemblyPart']=part;obj['portfolioInterior']=True
        scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    scene['archiveId']=identifier;scene['design']=spec['design']
    bpy.ops.object.select_all(action='SELECT')
    output=OUTPUT/(spec['key']+'.glb')
    bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
    triangles=sum(len(p.vertices)-2 for obj in scene.objects for p in obj.data.polygons)
    report.append(dict(id=identifier,key=spec['key'],meshes=len(scene.objects),triangles=triangles,bytes=output.stat().st_size))
    # A separate studio exists only in the editable .blend, never in the GLBs.
    scene.render.engine='CYCLES';scene.cycles.samples=16
    scene.render.resolution_x=640;scene.render.resolution_y=460;scene.render.resolution_percentage=100
    scene.world=bpy.data.worlds.new('Studio '+spec['key']);scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.14,.16,.17,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.6
    bpy.ops.object.camera_add(location=(.1,-8.5,4.6));camera=bpy.context.object
    camera.rotation_euler=(Vector((0,0,1.75))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=4.7;scene.camera=camera
    for pos,energy,size in [((-3,-4,6),500,4),((3,-2,4),300,3)]:
        bpy.ops.object.light_add(type='AREA',location=pos);light=bpy.context.object;light.data.energy=energy;light.data.shape='DISK';light.data.size=size
        light.rotation_euler=(Vector((0,0,1.7))-light.location).to_track_quat('-Z','Y').to_euler()
    # Neutral studio plate behind the entire assembly.
    box(0,1.7,4.5,3.4,'graphite',depth=.035,z=-.1,part='studio')
    scene.render.image_settings.file_format='PNG';scene.render.filepath=str(RENDERS/(spec['key']+'.png'))
    if '--render' in sys.argv:bpy.ops.render.render(write_still=True)
    print('PROJECT_MODEL',identifier,spec['key'],triangles,output.stat().st_size,flush=True)

# This report describes only the active first-generation designs. Documentary
# and evidence studies have their own reports and must not replace these rows.
(ROOT/'art/project-models-report.json').write_text(json.dumps(sorted(report,key=lambda entry:entry['id']),indent=2)+'\n',encoding='utf-8')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art/project-models.blend'),compress=True)
print('Completed',len(report),'project interiors.',flush=True)
