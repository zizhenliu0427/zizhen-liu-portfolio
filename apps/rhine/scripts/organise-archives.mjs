import { readFile, writeFile } from 'node:fs/promises';
import { validateContent } from './archive-content.mjs';

const parents = { 'X-021':'X-017', 'X-022':'X-017', 'X-023':'X-019', 'X-024':'X-034', 'X-031':'X-025', 'X-032':'X-026', 'X-038':'X-011', 'X-039':'X-011', 'X-040':'X-011' };
for (const [file, names] of [
  ['archives.json', ['个人资料', '实习经历', 'Web 与应用', 'AI 与数据', '系统与硬件']],
  ['archives.en.json', ['About me', 'Internships', 'Web & Apps', 'AI & Data', 'Systems & Hardware']],
]) {
  const path = new URL(`../content/${file}`, import.meta.url);
  const content = JSON.parse(await readFile(path, 'utf8'));
  if (content.records.every(record => !record.id.startsWith('X-'))) {validateContent(content);continue;}
  const records = new Map(content.records.map(record => [record.id, record]));
  for (const [id, parent] of Object.entries(parents)) {
    if (!records.has(id)) continue;
    const note = records.get(id), target = records.get(parent);
    if (!target) throw Error(`Missing parent ${parent}`);
    (target.sections ??= []).push({ id, title: note.title, abstract: note.abstract, findings: note.findings });
    records.delete(id);
  }
  for (const record of records.values()) {
    const id = Number(record.id.slice(2));
    const group = id <= 8 || id === 36 || id === 37 ? 0 : id >= 33 && id <= 35 ? 1 : id <= 16 ? 2 : id <= 20 ? 3 : 4;
    record.category = names[group];
  }
  content.categories = names;
  // Keep the personal introduction centred in the existing opening composition.
  content.columns = [names[2], names[3], names[0], names[1], names[4]];
  content.records = [...records.values()];
  content.redirects = { ...content.redirects, ...parents };
  await writeFile(path, JSON.stringify(content, null, 2) + '\n');
  console.log(`${file}: ${content.records.length} archives; ${names.map(name => `${name} ${content.records.filter(r=>r.category===name).length}`).join(', ')}`);
}
await import('./migrate-archive-ids.mjs');
