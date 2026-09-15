import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateContent } from './archive-content.mjs';

// Run explicitly to refresh content; the independent site needs no sibling repo at build time.
const origin = process.argv[2];
if (!origin) throw new Error('Usage: node --experimental-strip-types scripts/import-portfolio.mjs <original-portfolio-directory>');
const data = await import(pathToFileURL(resolve(origin, 'src/data/portfolio.ts')));
const { zh } = await import(pathToFileURL(resolve(origin, 'src/locales/zh.ts')));
const { profile, projects, archive, experience, education, capabilities, interests } = data;
const categories = ['个人档案', '产品工程', 'AI 与数据', '系统底层', '经历日志'];
const records = [];
const shortTitles = {
  cmo: 'CMO-DB · 装备数据库', novacart: 'Novacart · 电商平台', mediajira: 'MediaJira · 广告平台',
  lanely: 'Lanely · 协作看板', 'whale-logistics': 'Whale · 海运平台', breaktime: 'Breaktime · 派对游戏',
  good360: 'Good360 · 移动聊天', 'hls-keeper': 'HLS Keeper · 流媒体归档',
  sensor: '楼宇传感器 AI', isic2018: '皮肤镜图像分类', ctv: 'CTV · 视觉检测', av2text: '音视频 AI 转写',
  sdr2hdr: 'SDR → HDR', 'gpu-benchmark': '跨 API GPU 基准', gdwg: 'C++20 泛型图', kv260: 'FPGA 音频管线',
  'bili-dns': 'CDN 节点探测', 'home-lab': '家庭服务器实验室',
};
function add(category, title, en, abstract, findings, extra = {}) {
  records.push({ id: `X-${String(records.length + 1).padStart(3, '0')}`, title, en, department: 'WEB · AI · SYSTEMS',
    category, date: '2026', lead: 'Zizhen Liu / Lance', clearance: 'PROFILE', abstract, findings,
    source: profile.github, sourceLabel: '作者 GitHub', ...extra });
}
function project(id, category) {
  const p = projects.find(p => p.id === id) ?? archive.find(p => p.id === id);
  if (!p) throw new Error(`Unknown portfolio project: ${id}`);
  const t = zh.projectContent[id] ?? zh.archiveContent[id];
  const access = p.access;
  const href = p.href ?? (typeof access === 'object' && 'href' in access ? access.href : undefined);
  const source = p.github ?? (typeof access === 'object' && 'source' in access ? access.source : undefined);
  const links = [];
  if (href) links.push({ label: href.includes('github.com') ? '查看源码' : '打开项目', href });
  if (source && source !== href) links.push({ label: '查看源码', href: source });
  const privateProject = typeof access === 'string' ? access.includes('PRIVATE') : ['private', 'nda'].includes(access?.kind);
  add(category, shortTitles[id] ?? p.title, p.title, t.summary,
    t.highlights ?? [`技术栈：${p.stack.join(' · ')}`, privateProject ? '代码未公开；此档案介绍本人参与的实现。' : '项目内容整理自已有个人作品集。'],
    { date: p.year, department: p.stack.slice(0, 3).join(' / '), clearance: privateProject ? 'CODE PRIVATE' : id === 'novacart' ? 'IN DEVELOPMENT' : href || source ? 'PROJECT' : 'CASE STUDY',
      source: source ?? href ?? profile.github, sourceLabel: source ? '查看源码' : links[0]?.label ?? '作者 GitHub', stack: [...p.stack], links });
}
function note(category, title, en, parentId, abstract, findings) {
  const p = projects.find(p => p.id === parentId) ?? archive.find(p => p.id === parentId);
  const source = p?.github ?? p?.href ?? (typeof p?.access === 'object' ? p.access.href : undefined) ?? profile.github;
  add(category, title, en, abstract, findings, { clearance: 'ENGINEERING NOTE', date: p?.year ?? '2026',
    department: p?.title ?? 'Engineering practice', source, sourceLabel: source.includes('github.com') ? '相关源码 / 作者' : '相关项目',
    stack: p ? [...p.stack] : [], links: [{ label: '相关项目 / 作者', href: source }] });
}

add('个人档案', '刘子箴 · 全栈工程师', 'ZIZHEN LIU', zh.hero.statement,
  ['也可以叫我 Lance。', '关注 Web 产品、AI 数据应用，以及深入 GPU 的系统工程。', '目前寻求软件开发工作机会。'],
  { links: [{ label: 'GitHub', href: profile.github }, { label: 'LinkedIn', href: profile.linkedin }], stack: ['TypeScript', 'Python', 'C++', 'C#'] });
add('个人档案', '联系与合作', 'LET’S BUILD SOMETHING', '欢迎交流软件开发机会、项目合作，或聊聊正在做的产品。',
  [`Email：${profile.email}`, `GitHub：${profile.github}`, `LinkedIn：${profile.linkedin}`],
  { links: [{ label: '发送邮件', href: `mailto:${profile.email}` }, { label: 'LinkedIn', href: profile.linkedin }, { label: 'GitHub', href: profile.github }] });
add('个人档案', '从界面到 GPU', 'WEB · AI · SYSTEMS', '从交互界面、服务端和数据管线，到 C++ 与 CUDA，沿着产品的实际问题深入不同技术层。',
  capabilities.map(c => `${c.title}：${c.items.join(' · ')}`));
for (const [id, title, en, description] of [
  ['interface', '界面与交互', 'INTERFACE ENGINEERING', '构建面向真实用户的 Web 与移动端界面。'],
  ['server', '服务端与数据', 'SERVER & DATA', '实现 API、数据接入、检索与支撑产品的后端服务。'],
  ['delivery', '开发与交付', 'BUILD & SHIP', '将原型推进到可以部署、验证和持续维护的软件。'],
]) {
  const c = capabilities.find(c => c.id === id);
  add('个人档案', title, en, description, c.items.map(x => `技术与工具：${x}`), { stack: [...c.items] });
}
add('个人档案', '摄影与观察', 'BEYOND THE SCREEN', '喜欢风景与 HDR 摄影，也喜欢研究影像从采集、处理到显示的整个过程。',
  ['个人摄影作品集仍在整理。', '对色彩、动态范围和显示设备的兴趣，也延伸到了 GPU 视频处理项目。']);
add('个人档案', '驾驶与语言', 'OFFLINE / ONLINE', '代码之外，喜欢汽车、日本文化与语言学习。',
  ['Honda Civic Type R FK8，手动挡。', 'ADVAN GT Beyond 轮毂与 Neova AD09 轮胎。', '母语中文，熟练英语，正在学习日语。']);

for (const id of ['cmo', 'novacart', 'mediajira', 'lanely', 'whale-logistics', 'breaktime', 'good360', 'hls-keeper']) project(id, '产品工程');
for (const id of ['sensor', 'isic2018', 'ctv', 'av2text']) project(id, 'AI 与数据');
note('AI 与数据', 'RAG 与自然语言查询', 'RAG / NL2SQL', 'sensor', '楼宇传感器项目中的对话层：让管理者通过自然语言查询数据。',
  ['Qdrant 支持向量检索，Ollama 运行本地大模型。', '结合 RAG 与 NL2SQL 连接文档知识和结构化数据。', '本条是同一毕业项目的技术说明，不计为独立项目。']);
note('AI 与数据', '时序预测与数据接入', 'TIME SERIES / INGESTION', 'sensor', '楼宇传感器项目中的数据管线与预测模块。',
  ['FastAPI 与 Kafka 接入数据，PostgreSQL UPSERT 完成批量写入。', 'TFT 时序预测采用分位数回归。', '前端通过 Web Workers 处理 CSV / Excel 解析。']);
note('AI 与数据', '数据标注与模型训练', 'TRAIN / EVALUATE / SERVE', 'ctv', 'CTV 项目将数据标注、训练和实时推理连接成完整的视觉应用。',
  ['自行标注 10,025 帧训练数据。', 'YOLOv8 在 RTX 4090 上训练，作品集记录的结果为 85% mAP50。', 'Django REST 与 MJPEG 将推理结果送到 React 多路监控面板。']);
add('AI 与数据', '数据采集与 ETL', 'DATA COLLECTION / ETL', 'Intelli New Technologies 实习期间的数据工作。',
  zh.experienceContent.intelli.bullets, { date: '2023 — 2024', department: 'Python / Pandas', clearance: 'EXPERIENCE', source: 'https://intellinew.com.au/', sourceLabel: '公司网站' });

for (const id of ['sdr2hdr', 'gpu-benchmark', 'gdwg', 'kv260', 'bili-dns', 'home-lab']) project(id, '系统底层');
note('系统底层', 'GPU 视频处理路径', 'DECODE / CUDA / ENCODE', 'sdr2hdr', 'sdr2hdr 项目的端到端 GPU 视频处理路径。',
  ['NVDEC → CUDA → RTX TrueHDR / VSR → NVENC。', '手写色彩空间转换 kernel，支持 HDR10 元数据。', '作品集记录约 120fps 的实时 4K HDR 转换；具体性能取决于设备与输入。']);
note('系统底层', '跨图形 API 的性能观察', 'MEASURE THE HARDWARE', 'gpu-benchmark', '通过一致的计算任务理解不同 GPU 和图形 API 的性能行为。',
  ['五个后端：Vulkan、DirectX 12、DirectX 11、OpenGL、Metal。', '测试覆盖十余张显卡与六代 AMD 架构。', '无窗口计算路径揭示了被渲染路径掩盖的吞吐差异；技术报告约 2,300 行。']);

for (const e of experience) {
  const t = zh.experienceContent[e.id];
  const href = e.links.find(l => l.href.startsWith('https:'))?.href ?? profile.github;
  add('经历日志', `${e.company} · 实习`, e.company.toUpperCase(), t.bullets[0], t.bullets,
    { date: e.period, department: t.role, clearance: 'EXPERIENCE', source: href, sourceLabel: '公司 / 项目网站', links: [{ label: '相关网站', href }] });
}
for (const e of education) {
  const t = zh.educationContent[e.id];
  add('经历日志', t.school, e.id.toUpperCase(), t.degree, t.courses,
    { date: e.period, department: t.degree, clearance: 'EDUCATION', source: e.id === 'unsw' ? 'https://www.unsw.edu.au/' : 'https://www.uts.edu.au/', sourceLabel: '学校网站' });
}
note('经历日志', '百人并发聊天可靠性', 'REAL-TIME RELIABILITY', 'mediajira', 'Codritium 实习中的 MediaJira 实时聊天改进。',
  ['幂等发送、transactional outbox 与 PgBouncer 连接池。', '100 人并发测试，送达由 83–89% 提升至 9,900 / 9,900。', 'WebSocket p95 从 47.5 秒降至 5.0 秒。']);
note('经历日志', '多人表格协作', 'COLLABORATIVE SPREADSHEETS', 'mediajira', '在 MediaJira 中实现多人实时协作表格。',
  ['Django Channels 支撑实时同步。', '在线状态、其他用户的光标与协作编辑。', '作品集记录约 145ms 的协作更新延迟。']);
note('经历日志', '迁移、恢复与 CI', 'PLATFORM DELIVERY', 'mediajira', '跨模块迁移与交付流程改进，同属 Codritium 实习工作。',
  ['slug-URL 迁移涉及 373 个文件、12 个模块，并修复 IDOR 越权问题。', 'CI 由 57 分钟压缩至约 20 分钟，找回 597 个被跳过的测试。', '恢复 144 个数据库迁移，处理生产环境 521 故障。']);

const content = { categories, columns: ['产品工程', 'AI 与数据', '个人档案', '系统底层', '经历日志'], records };
validateContent(content);
await writeFile(new URL('../content/archives.json', import.meta.url), JSON.stringify(content, null, 2) + '\n');
console.log(`Imported ${records.length} portfolio records. Engineering notes remain identified as parts of their parent projects.`);
