import chineseContent from "../content/archives.json" with { type: "json" };
import englishContent from "../content/archives.en.json" with { type: "json" };
import { language, t } from './locale';
const content = language === 'zh' ? chineseContent : englishContent;

export interface ArchiveRecord {
  id: string;
  legacyId?: string;
  title: string;
  en: string;
  department: string;
  category: string;
  date: string;
  lead: string;
  clearance: string;
  abstract: string;
  findings: string[];
  sections?: { id: string; title: string; abstract: string; findings: string[] }[];
  source: string;
  sourceLabel?: string;
  stack?: string[];
  links?: { label: string; href: string }[];
  relatedArchives?: { id: string; label: string }[];
}

export let records: ArchiveRecord[] = content.records;
export const archiveRedirects: Record<string, string> = content.redirects;
export let categories = [t("全部档案"), ...content.categories];
export let archiveColumns = content.columns;
export function refreshLanguageData() {
  const translated = language === 'zh' ? chineseContent : englishContent;
  records = translated.records;
  categories = [t('全部档案'), ...translated.categories];
  archiveColumns = translated.columns;
}
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
// Rebase by a multiple of every column length so wrapped files retain identity.
export const archiveRowPeriod = archiveColumns.map((_, lane) => columnFiles(lane).length).reduce((a, b) => a * b / gcd(a, b), 1);

export function columnFiles(lane: number) {
  return records
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => record.category === archiveColumns[lane])
    .map(({ index }) => index);
}
export function fileLocation(index: number) {
  const lane = archiveColumns.indexOf(records[index].category);
  const row = 12 + columnFiles(lane).indexOf(index);
  return { lane, row, slot: lane * 32 + row };
}
export function fileAtSlot(slot: number) {
  const files = columnFiles(Math.floor(slot / 32));
  return files[Math.max(0, Math.min(files.length - 1, (slot % 32) - 12))];
}
