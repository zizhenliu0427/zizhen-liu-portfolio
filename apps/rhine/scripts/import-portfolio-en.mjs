import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const origin = process.argv[2];
if (!origin) throw Error('Pass the original portfolio directory.');
const { profile, projects, archive, experience, education, capabilities } = await import(pathToFileURL(resolve(origin, 'src/data/portfolio.ts')));
const original = JSON.parse(await readFile(new URL('../content/archives.json', import.meta.url), 'utf8'));
const dictionary = JSON.parse(await readFile(new URL('../src/ui-messages.json', import.meta.url), 'utf8'));
const result = structuredClone(original);
result.categories = original.categories.map(c => dictionary[c]);
result.columns = original.columns.map(c => dictionary[c]);
for (const r of result.records) {
  r.category = dictionary[r.category]; r.title = r.en;
  r.sourceLabel = dictionary[r.sourceLabel] ?? r.sourceLabel;
  r.links?.forEach(l => l.label = dictionary[l.label] ?? l.label);
}
function set(n, abstract, findings, extra = {}) { Object.assign(result.records[n - 1], { abstract, findings }, extra); }
set(1, profile.statement, ['You can also call me Lance.', 'I work across web products, AI and data applications, and GPU systems engineering.', 'Open to software development opportunities.'], { title: 'Zizhen Liu · Full-stack Engineer' });
set(2, 'Get in touch about software roles, project collaboration or the products you are building.', [`Email: ${profile.email}`, `GitHub: ${profile.github}`, `LinkedIn: ${profile.linkedin}`], { title: 'Contact & collaboration' });
set(3, 'Follow the product’s actual needs from interfaces and APIs through data pipelines to C++ and CUDA.', capabilities.map(c => `${c.title}: ${c.items.join(' · ')}`));
for (const [n, id] of [[4, 'interface'], [5, 'server'], [6, 'delivery']]) {
  const c = capabilities.find(c => c.id === id);
  set(n, c.description, c.items.map(x => `Technology & tools: ${x}`));
}
set(7, 'Landscape and HDR photography, with an interest in the entire path from capture and processing to display.', ['The personal photo gallery is still being curated.', 'An interest in colour, dynamic range and displays also led to GPU video processing work.'], { title: 'Photography & observation' });
set(8, 'Beyond code: cars, Japanese culture and language learning.', ['Honda Civic Type R FK8, manual transmission.', 'ADVAN GT Beyond wheels and Neova AD09 tyres.', 'Native Mandarin, proficient English and beginner Japanese.'], { title: 'Driving & languages' });
for (const [n, id, short] of [
  [9,'cmo','CMO-DB'],[10,'novacart','Novacart'],[11,'mediajira','MediaJira'],[12,'lanely','Lanely'],[13,'whale-logistics','Whale Logistics'],[14,'breaktime','Breaktime Arcade'],[15,'good360','Good360'],[16,'hls-keeper','HLS Keeper'],
  [17,'sensor','Building Sensor AI'],[18,'isic2018','Skin Lesion Classification'],[19,'ctv','CTV Violence Detection'],[20,'av2text','Audio / Video Transcription'],
  [25,'sdr2hdr','SDR to HDR'],[26,'gpu-benchmark','GPU Compute Benchmark'],[27,'gdwg','C++20 Generic Graph'],[28,'kv260','FPGA Audio Pipeline'],[29,'bili-dns','CDN Node Probing'],[30,'home-lab','Home Lab']
]) {
  const p = projects.find(p => p.id === id) ?? archive.find(p => p.id === id);
  set(n, p.summary, p.highlights ? [...p.highlights] : [`Stack: ${p.stack.join(' · ')}`, result.records[n-1].clearance === 'CODE PRIVATE' ? 'Source code is not public. This record describes work I contributed to.' : 'Details carried over from the existing portfolio.'], { title: short });
}
const notes = [
  [21, 'RAG & natural-language queries', 'The conversational layer of the building-sensor project lets managers query data in natural language.', ['Qdrant provides vector retrieval; Ollama runs local language models.', 'RAG and NL2SQL connect document knowledge with structured sensor data.', 'An engineering note within the same capstone, not a separate project.']],
  [22, 'Forecasting & ingestion', 'The building-sensor project’s data pipeline and forecasting module.', ['FastAPI and Kafka ingest data; PostgreSQL UPSERT handles batch writes.', 'Temporal Fusion Transformer forecasting uses quantile regression.', 'Web Workers handle CSV and Excel parsing in the client.']],
  [23, 'Annotation & model training', 'CTV connects annotation, model training and real-time inference in one computer-vision application.', ['10,025 frames were annotated for training.', 'YOLOv8 was trained on an RTX 4090; the portfolio reports 85% mAP50.', 'Django REST and MJPEG deliver predictions to a multi-camera React dashboard.']],
  [31, 'GPU video processing', 'The end-to-end GPU processing path in sdr2hdr.', ['NVDEC → CUDA → RTX TrueHDR / VSR → NVENC.', 'Hand-written colour-space kernels and HDR10 metadata.', 'The portfolio reports approximately 120fps for real-time 4K HDR conversion; performance depends on hardware and input.']],
  [32, 'Cross-API performance', 'Compare consistent compute workloads across graphics APIs and GPU generations.', ['Five backends: Vulkan, DirectX 12, DirectX 11, OpenGL and Metal.', 'Tests cover more than ten GPUs and six AMD architecture generations.', 'Headless compute revealed throughput hidden by the rendering path; the technical report spans around 2,300 lines.']],
  [38, 'Reliable chat under load', 'Real-time chat improvements in MediaJira during the Codritium internship.', ['Idempotent sends, a transactional outbox and PgBouncer connection pooling.', 'At 100 concurrent users, delivery rose from 83–89% to 9,900 out of 9,900 messages.', 'WebSocket p95 fell from 47.5 seconds to 5.0 seconds.']],
  [39, 'Collaborative spreadsheets', 'Multi-user spreadsheet collaboration in MediaJira.', ['Django Channels supports live synchronisation.', 'Presence, remote cursors and collaborative edits.', 'The existing portfolio reports approximately 145ms peer updates.']],
  [40, 'Migrations, recovery & CI', 'Cross-module migration and delivery improvements during the Codritium internship.', ['A slug-URL migration spanning 373 files and 12 modules, alongside IDOR fixes.', 'CI fell from 57 to around 20 minutes, with 597 skipped tests recovered.', 'Restored 144 database migrations to recover a production 521 outage.']]
];
for (const [n, title, abstract, findings] of notes) {
  set(n, abstract, findings, { title, department: n >= 38 ? 'MediaJira' : n <= 22 ? 'Building Sensor AI' : n === 23 ? 'CTV Violence Detection' : n === 31 ? 'sdr2hdr' : 'GPU Compute Benchmark' });
}
set(24, 'Data collection and ETL work during the Intelli New Technologies internship.', [...experience.find(e=>e.id==='intelli').bullets], { title: 'Data collection & ETL' });
experience.forEach((e,i)=>set(33+i,e.bullets[0],[...e.bullets],{title:e.company,department:e.role}));
education.forEach((e,i)=>set(36+i,e.degree,[...e.courses],{title:e.school,department:e.degree}));
if (/[\u3400-\u9fff]/.test(JSON.stringify(result))) throw Error('English archive still contains untranslated Chinese.');
await writeFile(new URL('../content/archives.en.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log('Prepared 40 English records, matched by stable ID to Chinese content.');
