import fs from "node:fs/promises";

const requiredFields = [
  "id",
  "title",
  "en",
  "department",
  "category",
  "date",
  "lead",
  "clearance",
  "abstract",
  "source",
];
const isText = (value) => typeof value === "string" && value.trim().length > 0;
export function categoryPrefix(name) {
  return ({'个人资料':'P','About me':'P','实习经历':'I','Internships':'I','Web 与应用':'W','Web & Apps':'W','AI 与数据':'A','AI & Data':'A','系统与硬件':'S','Systems & Hardware':'S','致谢':'C','Acknowledgements':'C'})[name];
}

export function validateContent(content) {
  const errors = [];
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("档案数据必须是 JSON 对象。");
  }
  for (const key of ["categories", "columns"]) {
    const names = content[key];
    if (!Array.isArray(names) || names.length !== 6 || !names.every(isText)) {
      errors.push(`${key}：必须包含六个非空分类名称`);
    } else if (new Set(names).size !== 6 || names.includes("全部档案")) {
      errors.push(`${key}：分类名称不能重复，也不能使用“全部档案”`);
    }
  }
  const categories = Array.isArray(content.categories)
    ? content.categories
    : [];
  const columns = Array.isArray(content.columns) ? content.columns : [];
  if (
    categories.some((name) => !columns.includes(name)) ||
    columns.some((name) => !categories.includes(name))
  ) {
    errors.push("categories 与 columns 必须包含相同的六个分类（顺序可以不同）");
  }
  const records = Array.isArray(content.records) ? content.records : [];
  if (!records.length) errors.push("records：必须包含档案");
  const ids = new Set();
  const counters = {};
  records.forEach((record, index) => {
    const label = `records[${index}]`;
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(`${label}：必须是档案对象`);
      return;
    }
    for (const key of requiredFields) {
      if (!isText(record[key])) errors.push(`${label}.${key}：必须是非空文本`);
    }
    const prefix = categoryPrefix(record.category);
    const sequence = counters[prefix] = (counters[prefix] ?? 0) + 1;
    if (record.id !== `${prefix}-${String(sequence).padStart(3,'0')}`)
      errors.push(`${label}.id：分类编号须使用 P/I/W/A/S/C 前缀并在分类内按顺序排列`);
    if (ids.has(record.id)) errors.push(`${label}.id：重复编号 ${record.id}`);
    ids.add(record.id);
    if (!categories.includes(record.category))
      errors.push(`${label}.category：未知分类 ${record.category}`);
    if (
      !Array.isArray(record.findings) ||
      record.findings.length === 0 ||
      !record.findings.every(isText)
    ) {
      errors.push(`${label}.findings：必须包含至少一条非空实现记录`);
    }
    try {
      const url = new URL(record.source);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error();
    } catch {
      errors.push(`${label}.source：必须是有效的 HTTP 或 HTTPS 链接`);
    }
  });
  for (const [index, record] of records.entries()) {
    if (!record || typeof record !== 'object') continue;
    const label = `records[${index}]`;
    if (record.sourceLabel !== undefined && !isText(record.sourceLabel)) errors.push(`${label}.sourceLabel：必须是非空文本`);
    if (record.stack !== undefined && (!Array.isArray(record.stack) || !record.stack.every(isText))) errors.push(`${label}.stack：必须是文本数组`);
    if (record.links !== undefined) {
      if (!Array.isArray(record.links)) errors.push(`${label}.links：必须是链接数组`);
      else for (const link of record.links) {
        try {
          if (!link || !isText(link.label) || !isText(link.href)) throw new Error();
          if (!['https:', 'http:', 'mailto:'].includes(new URL(link.href).protocol)) throw new Error();
        } catch { errors.push(`${label}.links：必须包含标签和安全链接`); }
      }
    }
  }
  for (const name of columns) {
    if (!records.some((record) => record?.category === name)) {
      errors.push(`分类“${name}”：必须包含至少一份档案`);
    }
  }
  for (const [from, to] of Object.entries(content.redirects ?? {})) {
    if (!/^X-\d{3}$/.test(from) || ids.has(from) || !ids.has(to)) errors.push('redirects：旧编号必须指向现有档案');
  }
  for (const record of records) {
    if (record?.sections !== undefined && (!Array.isArray(record.sections) || record.sections.some(section => !section || !isText(section.title) || !isText(section.abstract) || !Array.isArray(section.findings) || !section.findings.length || !section.findings.every(isText)))) errors.push('sections：技术说明必须包含标题、摘要与实现记录');
  }
  if (errors.length)
    throw new Error(`档案数据校验失败：\n- ${errors.join("\n- ")}`);
  return content;
}

export async function loadContent() {
  return validateContent(
    JSON.parse(
      await fs.readFile(
        new URL("../content/archives.json", import.meta.url),
        "utf8",
      ),
    ),
  );
}

export function sectionText(r) {
  return (r.sections ?? []).map(section => `\n\n${section.title}\n${section.abstract}\n${section.findings.map((finding, index) => `${index + 1}. ${finding}`).join('\n')}`).join('');
}
export function archiveText(r) {
  return `\uFEFFZIZHEN LIU · PERSONAL ARCHIVE\nFILE ${r.id} / ${r.title}\n${r.en}\n\n方向：${r.department}\n时间：${r.date}\n作者：${r.lead}\n访问范围：${r.clearance}\n\n${r.abstract}\n\n实现记录\n${r.findings.map((f, i) => `${i + 1}. ${f}`).join("\n")}${sectionText(r)}\n\n相关链接：${r.source}\n内容整理自 Zizhen Liu 的个人作品集；技术笔记归属于对应项目。\n`;
}
