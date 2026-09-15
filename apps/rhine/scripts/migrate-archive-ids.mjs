import {readFileSync,writeFileSync} from 'node:fs';
import {categoryPrefix} from './archive-content.mjs';
const chinese=JSON.parse(readFileSync('content/archives.json','utf8'));
const counters={};
const mapping=Object.fromEntries(chinese.records.map(record=>{
  const group=categoryPrefix(record.category);
  const next=`${group}-${String(counters[group]=(counters[group]??0)+1).padStart(3,'0')}`;
  return [record.id,next];
}));
for(const file of ['content/archives.json','content/archives.en.json']) {
  const content=JSON.parse(readFileSync(file,'utf8'));
  content.redirects=Object.fromEntries(Object.entries(content.redirects??{}).map(([old,parent])=>[old,mapping[parent]??parent]));
  for(const record of content.records) {
    const old=record.id;record.id=mapping[old];
    if(old!==record.id) {record.legacyId??=old;content.redirects[old]=record.id;}
  }
  writeFileSync(file,JSON.stringify(content,null,2)+'\n');
}
const catalog=JSON.parse(readFileSync('content/project-models.json','utf8'));
writeFileSync('content/project-models.json',JSON.stringify(Object.fromEntries(Object.entries(catalog).map(([id,spec])=>[mapping[id]??id,spec])),null,2)+'\n');
writeFileSync('content/archive-id-migration.json',JSON.stringify(Object.fromEntries(chinese.records.map(record=>[record.legacyId??record.id,mapping[record.id]])),null,2)+'\n');
console.log('Assigned category prefixes and preserved legacy aliases.');
