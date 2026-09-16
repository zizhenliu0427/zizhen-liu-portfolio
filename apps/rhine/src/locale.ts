import messages from './ui-messages.json';

export type LanguagePreference = 'auto' | 'zh' | 'en';
export function detectLanguage(languages: readonly string[]): 'zh' | 'en' {
  for (const language of languages) {
    if (/^zh(?:-|$)/i.test(language)) return 'zh';
    if (/^en(?:-|$)/i.test(language)) return 'en';
  }
  return 'en';
}
export function readLanguagePreference(): LanguagePreference {
  try {
    const shared = localStorage.getItem('zl-portfolio-locale');
    if (shared === 'en' || shared === 'zh') return shared;
    const value = localStorage.getItem('zl-archive-language');
    return value === 'en' || value === 'zh' ? value : 'auto';
  } catch { return 'auto'; }
}
export let languagePreference = readLanguagePreference();
export let language = languagePreference === 'auto' ? detectLanguage(navigator.languages) : languagePreference;
document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en-AU';

const english: Record<string, string> = messages;
const chinese: Record<string, string> = {
  'ACCESS FILE': '打开档案', 'ENTER SYSTEM': '跳过开场', 'ARCHIVE INDEX': '档案检索',
  'CONTACT': '联系', 'SAVED': '收藏', 'ARCHIVE OVERVIEW': '返回档案列表',
  'FILE NUMBER:': '档案编号：', 'SAVE ARCHIVE': '收藏档案', 'REMOVE FROM SAVED': '取消收藏',
  'EXPORT': '导出', 'CLOSE': '关闭', 'REINITIALIZE': '重播开场',
};
const matchers = new WeakMap<Record<string, string>, RegExp>();
function replacePhrases(value: string, dictionary: Record<string, string>): string {
  let matcher = matchers.get(dictionary);
  if (!matcher) {
    const keys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
    matcher = new RegExp(keys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    matchers.set(dictionary, matcher);
  }
  return value.replace(matcher, key => dictionary[key]);
}
/** Phrase catalog used at render boundaries; no DOM observer or per-frame traversal. */
export function t(value: string): string {
  return replacePhrases(value, language === 'en' ? english : chinese);
}
export function languageControl(id = 'language-toggle') {
  return `<button type="button" id="${id}" class="language-toggle" data-toggle-language aria-label="${language === 'zh' ? 'Switch to English' : '切换为中文'}" title="${language === 'zh' ? 'Switch to English' : '切换为中文'}"><span ${language === 'en' ? 'class="active"' : ''}>EN</span><i>/</i><span ${language === 'zh' ? 'class="active"' : ''}>中</span></button>`;
}
const languageAnimations = new WeakMap<HTMLElement, Animation>();
export function revealTranslation(element: HTMLElement) {
  languageAnimations.get(element)?.cancel();
  // Toast visibility belongs to its notification lifecycle, not translation.
  if (element.closest('#toast')) return;
  if (document.querySelector('#stage.reduce-motion') || !element.getClientRects().length) return;
  languageAnimations.set(element, element.animate(
    [{ opacity: .15, translate: '0 5px' }, { opacity: 1, translate: '0 0' }],
    { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' },
  ));
}
/** One pass on explicit language changes; existing canvas, focus and listeners survive. */
export function setLanguage(preference: LanguagePreference, root: HTMLElement) {
  const previous = language;
  languagePreference = preference;
  language = preference === 'auto' ? detectLanguage(navigator.languages) : preference;
  try { localStorage.setItem('zl-archive-language', preference); } catch {}
  try {
    if (preference === 'auto') localStorage.removeItem('zl-portfolio-locale');
    else localStorage.setItem('zl-portfolio-locale', preference);
  } catch {}
  document.querySelectorAll('portfolio-interface-switcher').forEach(element => element.setAttribute('lang', language));
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en-AU';
  if (language === previous) return;
  // Translate directly between displayed phrases in one pass. Reversing short
  // action labels first would split phrases such as “查看收藏档案”.
  const dictionary = previous === 'zh'
    ? { ...english, ...Object.fromEntries(Object.entries(chinese).map(([key, value]) => [value, english[key] ?? key])) }
    : { ...chinese, ...Object.fromEntries(Object.entries(english).map(([key, value]) => [value, chinese[key] ?? key])) };
  const translate = (value: string) => replacePhrases(value, dictionary);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const changed = new Set<HTMLElement>();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest('script, style, svg, .boot, [data-toggle-language], #detail-content, #hover-label, #selected-title, #archive-category, #selected-clearance, #column-name')) continue;
    if (node.textContent?.trim()) {
      const next = translate(node.textContent);
      if (next !== node.textContent && node.parentElement) changed.add(node.parentElement);
      node.textContent = next;
    }
  }
  for (const element of changed) {
    if (![...changed].some(parent => parent !== element && parent.contains(element))) revealTranslation(element);
  }
  for (const element of root.querySelectorAll<HTMLElement>('[aria-label], [title], [placeholder]')) {
    if (element.closest('[data-toggle-language]')) continue;
    for (const attribute of ['aria-label', 'title', 'placeholder']) {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translate(value));
    }
  }
}
