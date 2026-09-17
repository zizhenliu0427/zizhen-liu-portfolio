import {readFileSync,writeFileSync} from 'node:fs';
const zh=JSON.parse(readFileSync('content/archives.json','utf8'));
const en=JSON.parse(readFileSync('content/archives.en.json','utf8'));
const catalog=JSON.parse(readFileSync('content/project-models.json','utf8'));
// Text and metrics are documentary extracts; arrangements are explanatory,
// never screenshots, customer records, measured signals or proficiency scores.
const plans={
 'P-001':['profile','profile','ZIZHEN LIU',['LANCE','WEB','AI + DATA','SYSTEMS'],'FULL-STACK ENGINEER'],
 'P-002':['contact','contact','LET US BUILD',['EMAIL','GITHUB','LINKEDIN'],'lzz288898@gmail.com'],
 'P-003':['skills','stack','WEB / AI / SYSTEMS',['REACT','FASTAPI','C++','NEXT.JS','POSTGRES','CUDA','TYPESCRIPT','PYTORCH','VULKAN'],'PRODUCT TO GPU'],
 'P-004':['frontend','devices','INTERFACE ENGINEERING',['REACT','NEXT.JS','TYPESCRIPT','KOTLIN'],'WEB + MOBILE'],
 'P-005':['backend','branch','SERVER / DATA',['API','POSTGRES','KAFKA','QDRANT','PYTORCH'],'INGEST / QUERY / LEARN'],
 'P-006':['delivery','flow','BUILD / TEST / SHIP',['GIT','TEST','DOCKER','DEPLOY'],'VITEST / CATCH2 / CLOUDFLARE'],
 'P-007':['photography','photo','PHOTOGRAPHY',['CAPTURE','PROCESS','DISPLAY'],'PERSONAL GALLERY IN CURATION'],
 'P-008':['driving-languages','gear','DRIVING / LANGUAGES',['MANDARIN / NATIVE','ENGLISH / PROFICIENT','JAPANESE / BEGINNER'],'FK8 / MANUAL / AD09'],
 'P-009':['unsw','scores','UNSW / 2024-2025',['CAPSTONE','AI','ADVANCED C++'],'MASTER OF IT',[85,81,81]],
 'P-010':['uts','scores','UTS / 2021-2024',['DATABASES','SYSTEMS TESTING','DATA STRUCTURES'],'BSE / HONOURS',[94,90,84]],
 'I-001':['codritium','bars','CODRITIUM / 2026',['CI BEFORE','CI AFTER'],'PIPELINE DURATION / MINUTES',[57,20]],
 'I-002':['intelli-new','etl','INTELLI NEW',['COLLECT','VALIDATE','NORMALISE','DATA'],'PYTHON / PANDAS / API CONTRACTS'],
 'I-003':['golden-lady','workstation','GOLDEN LADY / 2024',['NEXT.JS','CMS API','SSR'],'CMS FRONTEND + LEGACY MIGRATION'],
 'W-001':['equipment-database','schema','CMO-DB',['EQUIPMENT','SENSORS','WEAPONS','QUERY'],'29,000+ RECORDS / 6-TABLE JOINS'],
 'W-003':['mediajira','bars','MEDIAJIRA / CHAT',['P95 BEFORE','P95 AFTER'],'WEBSOCKET LATENCY / SECONDS',[47.5,5]],
 'W-004':['lanely','kanban','LANELY',['TODO','IN PROGRESS','REVIEW','DONE'],'TASK STATES / SOURCE README'],
 'W-005':['whale','route','WHALE LOGISTICS',['REGISTER','SCHEDULE','DELIVER','DEHIRE'],'CONTAINER LIFECYCLE'],
 'W-006':['breaktime','room','BREAKTIME ARCADE',['HOST','JOIN','PLAY','VOTE'],'WHO IS UNDERCOVER / ROOM FLOW'],
 'W-007':['good360','chat','GOOD360',['VIEW','VIEWMODEL','FIREBASE'],'TEXT + IMAGE / MVVM'],
 'W-008':['hls-keeper','tracks','WEB KEEPER',['BROWSER','WORKSPACE','DOWNLOADS','PYTHON','FFMPEG','ARCHIVE'],'BROWSER + LEGACY ARCHIVE PATHS'],
 'A-001':['building-ai','sensor','BUILDING SENSOR AI',['CO2','TEMP','HUMIDITY','KAFKA','SQL','RAG'],'SENSOR DATA TO CONVERSATION'],
 'A-002':['dermoscopy','classifier','SKIN LESION AI',['DENSENET','EFFICIENTNET','RESNET','SE ATTENTION','GRAD-CAM'],'83% MACRO F1 / PORTFOLIO RESULT'],
 'A-003':['ctv','cameras','CTV / YOLOv8',['CAMERAS','OPENCV','MJPEG','REACT'],'10,025 FRAMES / 85% mAP50'],
 'A-004':['transcription','speech','AUDIO / VIDEO TO TEXT',['FFMPEG','ASR','TEXT','CLI / WEB / DESKTOP'],'SPEAKER DIARISATION'],
 'S-001':['sdr-hdr','codec','SDR TO HDR',['NVDEC','CUDA','RTX VIDEO','NVENC'],'BT.709 TO HDR10 / GPU PIPELINE'],
 'S-003':['generic-graph','hierarchy','C++20 / GENERIC GRAPH',['EDGE<N,E>','WEIGHTED','UNWEIGHTED'],'VALUE SEMANTICS / CATCH2'],
 'S-004':['fpga-audio','audio','FPGA AUDIO',['I2S','AXI STREAM','DMA','LINUX'],'48 kHz / 24-bit / VHDL'],
 'S-005':['cdn-probe','dns','CDN NODE PROBING',['CANDIDATES','TCP 443','THRESHOLD','DNS PIN'],'RECHECK / RETAIN / REPLACE'],
 'S-006':['home-lab','lab','HOME LAB',['VMWARE','SERVER 2025','ACTIVE DIR','SYNOLOGY','EFI / ACPI','ANDROID'],'IDENTITY / STORAGE / DEVICES'],
};
const exhibits={};
for(const [id,[key,kind,heading,nodes,caption,values]] of Object.entries(plans)) {
 const record=en.records.find(r=>r.id===id), chinese=zh.records.find(r=>r.id===id);
 const personal=id.startsWith('P'), internship=id.startsWith('I');
 exhibits[id]={key,kind,heading,nodes,caption,...(values?{values}:{}),title:record.title,zh:chinese.title,
   source:record.source,sourceKind:personal?'profile':internship?'experience':'documented-design',
   sourceFile:'content/archives.en.json',legacyId:record.legacyId,
   explanation:chinese.abstract,notes:chinese.findings,
   notice:values?'数值取自现有个人档案；并非本次重新测试。':'依据现有档案与项目文档制作的结构示意，不是原始界面截图。'};
 catalog[id]={key,title:heading,zh:chinese.title,design:'documentary-'+kind,
   layers:personal?['资料标注','个人档案']:internship?['职责与成果','工作流程']:['流程标注','项目结构'],
   layersEn:personal?['Profile notes','Personal record']:internship?['Work & outcomes','Work process']:['Process notes','Project structure']};
}
writeFileSync('content/archive-exhibits.json',JSON.stringify(exhibits,null,2)+'\n');
writeFileSync('content/project-models.json',JSON.stringify(Object.fromEntries(zh.records.map(r=>[r.id,catalog[r.id]])),null,2)+'\n');
console.log('Prepared 29 documentary interiors plus two existing evidence models.');
