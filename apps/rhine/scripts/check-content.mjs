import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  loadContent,
  validateContent,
  archiveText,
} from "./archive-content.mjs";
import { escapeHtml } from "../src/html.ts";

const content = await loadContent();
test('education stays with personal details and technical notes stay inside their parent', () => {
  assert.equal(content.records.length, 31);
  assert.ok(content.records.filter(r=>r.clearance === 'EDUCATION').every(r=>r.category === '个人资料'));
  assert.equal(content.records.filter(r=>r.category === '实习经历').length, 3);
  assert.ok(content.records.every(r=>r.clearance !== 'ENGINEERING NOTE'));
  assert.equal(content.records.find(r=>r.id === 'A-001').sections.length, 2);
  assert.equal(content.records.find(r=>r.id === 'W-003').sections.length, 3);
  assert.equal(content.records.find(r=>r.id === 'I-002').sections[0].id, 'X-024');
});
test("English archives retain record identity and provide matching English downloads", async () => {
  const english = validateContent(JSON.parse(await readFile(new URL('../content/archives.en.json', import.meta.url), 'utf8')));
  assert.equal(english.records.length, content.records.length);
  for (const [index, record] of english.records.entries()) {
    const original = content.records[index];
    assert.equal(record.id, original.id);
    assert.equal(record.en, original.en);
    assert.equal(record.source, original.source);
    assert.ok(!/[\u3400-\u9fff]/u.test(JSON.stringify(record)), `Untranslated English record: ${record.id}`);
    const download = await readFile(new URL(`../public/archives/ZL-ARCHIVE-${record.id}-en.txt`, import.meta.url), 'utf8');
    for (const text of [record.title, record.abstract, ...record.findings, record.source, ...(record.sections ?? []).flatMap(s => [s.title, s.abstract, ...s.findings])]) assert.ok(download.includes(text), `${record.id}: missing exported content`);
    assert.ok(download.startsWith('\uFEFFZIZHEN LIU'));
  }
});
test("all downloads match the shared content, including the UTF-8 BOM", async () => {
  for (const record of content.records) {
    assert.equal(
      (
        await readFile(
          new URL(
            `../public/archives/ZL-ARCHIVE-${record.id}.txt`,
            import.meta.url,
          ),
          "utf8",
        )
      ).replace(/\r\n/g, "\n"),
      archiveText(record),
    );
  }
});

const invalidCases = [
  [
    "unsafe portfolio action URL",
    (c) => { c.records[0].links = [{ label: 'Source', href: 'javascript:alert(1)' }]; },
    /安全链接/,
  ],
  [
    "missing portfolio action label",
    (c) => { c.records[0].links = [{ href: 'https://github.com' }]; },
    /安全链接/,
  ],
  [
    "missing title",
    (c) => {
      delete c.records[0].title;
    },
    /records\[0\].title/,
  ],
  [
    "blank abstract",
    (c) => {
      c.records[0].abstract = "  ";
    },
    /abstract/,
  ],
  [
    "duplicate ID",
    (c) => {
      c.records[1].id = "P-001";
    },
    /重复编号/,
  ],
  [
    "reordered ID",
    (c) => {
      [c.records[0], c.records[1]] = [c.records[1], c.records[0]];
    },
    /分类编号/,
  ],
  [
    "unknown category",
    (c) => {
      c.records[0].category = "未知";
    },
    /未知分类/,
  ],
  [
    "empty column",
    (c) => {
      c.records.filter(r => r.category === c.columns[1]).forEach(r => r.category = c.columns[0]);
    },
    /至少一份档案/,
  ],
  [
    "empty archive",
    (c) => {
      c.records = [];
    },
    /必须包含档案/,
  ],
  [
    "null record",
    (c) => {
      c.records[0] = null;
    },
    /必须是档案对象/,
  ],
  [
    "empty findings",
    (c) => {
      c.records[0].findings = [];
    },
    /findings/,
  ],
  [
    "non-text findings",
    (c) => {
      c.records[0].findings = [42];
    },
    /findings/,
  ],
  [
    "unsafe URL",
    (c) => {
      c.records[0].source = "javascript:alert(1)";
    },
    /HTTPS/,
  ],
  [
    "invalid URL",
    (c) => {
      c.records[0].source = "example.com";
    },
    /HTTPS/,
  ],
  [
    "duplicate categories",
    (c) => {
      c.categories[1] = c.categories[0];
    },
    /不能重复/,
  ],
  [
    "reserved category",
    (c) => {
      c.categories[0] = "全部档案";
    },
    /全部档案/,
  ],
  [
    "mismatched columns",
    (c) => {
      c.columns[0] = "其他";
    },
    /相同的五个分类/,
  ],
];
for (const [name, mutate, error] of invalidCases) {
  test(`rejects ${name}`, () => {
    const invalid = structuredClone(content);
    mutate(invalid);
    assert.throws(() => validateContent(invalid), error);
  });
}
test("accepts independent filter and column order", () => {
  const edited = structuredClone(content);
  edited.categories.reverse();
  assert.equal(validateContent(edited), edited);
});
test("plain-text punctuation stays literal in HTML and downloadable text", () => {
  const title = `<玻璃> & "实验" 'A'`;
  const edited = structuredClone(content);
  edited.records[0].title = title;
  validateContent(edited);
  assert.equal(
    escapeHtml(title),
    "&lt;玻璃&gt; &amp; &quot;实验&quot; &#39;A&#39;",
  );
  assert.ok(archiveText(edited.records[0]).includes(title));
});
