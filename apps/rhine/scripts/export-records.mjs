import fs from 'node:fs/promises';
import { loadContent, archiveText, validateContent, sectionText } from './archive-content.mjs';
const chinese = await loadContent();
const english = validateContent(JSON.parse(await fs.readFile(new URL('../content/archives.en.json', import.meta.url), 'utf8')));
for (const [index, record] of english.records.entries()) {
  const source = chinese.records[index];
  if (!source || source.id !== record.id || source.en !== record.en || source.source !== record.source) throw Error(`Locale mismatch: ${record.id}`);
}
if (english.records.length !== chinese.records.length) throw Error('Locale record counts differ');
const output = new URL('../public/archives/', import.meta.url);
await fs.mkdir(output, { recursive: true });
for (const [content, suffix] of [[chinese, ''], [english, '-en']]) {
  for (const record of content.records) {
    const text = suffix ? `\uFEFFZIZHEN LIU · PERSONAL ARCHIVE\nFILE ${record.id} / ${record.title}\n${record.en}\n\nFocus: ${record.department}\nPeriod: ${record.date}\nAuthor: ${record.lead}\nAccess: ${record.clearance}\n\n${record.abstract}\n\nEngineering notes\n${record.findings.map((f,i)=>`${i+1}. ${f}`).join('\n')}${sectionText(record)}\n\nRelated link: ${record.source}\n` : archiveText(record);
    await fs.writeFile(new URL(`ZL-ARCHIVE-${record.id}${suffix}.txt`, output), text, 'utf8');
    // Preserve previously shared download URLs after merging notes.
    for (const [oldId, parent] of Object.entries(content.redirects ?? {})) {
      if (parent === record.id) await fs.writeFile(new URL(`ZL-ARCHIVE-${oldId}${suffix}.txt`, output), text, 'utf8');
    }
  }
}
console.log(`Prepared ${chinese.records.length} bilingual archives with legacy download aliases.`);
