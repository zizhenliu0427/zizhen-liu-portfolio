/** Shared by React and the standalone archive; no 3D application is preloaded. */
export const interfaceRoutes = {
  rhine: '/rhine/index.html',
  matrix: '/matrix',
  aero: '/desktop',
} as const;
export type PortfolioInterface = keyof typeof interfaceRoutes;

export function registerInterfaceSwitcher() {
  if (customElements.get('portfolio-interface-switcher')) return;
  class InterfaceSwitcher extends HTMLElement {
    static observedAttributes = ['current', 'lang'];
    private root = this.attachShadow({ mode: 'open' });
    private expanded = false;
    constructor() {
      super();
      // Keep archive keyboard shortcuts out of the switcher's shadow tree.
      this.addEventListener('keydown', event => event.stopPropagation());
    }
    private outside = (event: Event) => {
      if (!event.composedPath().includes(this)) this.close();
    };
    private escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !this.expanded) return;
      event.preventDefault();
      event.stopPropagation();
      this.close();
      this.focus();
    };
    connectedCallback() {
      this.render();
      document.addEventListener('pointerdown', this.outside, true);
      document.addEventListener('keydown', this.escape, true);
    }
    disconnectedCallback() {
      document.removeEventListener('pointerdown', this.outside, true);
      document.removeEventListener('keydown', this.escape, true);
    }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    focus(options?: FocusOptions) { this.root.querySelector('button')?.focus(options); }
    private close() {
      this.expanded = false;
      this.root.querySelector('button')?.setAttribute('aria-expanded', 'false');
      const nav = this.root.querySelector('nav');
      if (nav) nav.hidden = true;
    }
    private render() {
      const zh = (this.getAttribute('lang') || document.documentElement.lang).startsWith('zh');
      const current = this.getAttribute('current') as PortfolioInterface;
      const label = zh ? '切换界面' : 'Switch interface';
      const names = { rhine: 'Rhine', matrix: zh ? '黑客帝国' : 'Matrix', aero: 'Aero' };
      const descriptions = zh
        ? { rhine: '三维档案', matrix: '终端作品集', aero: '玻璃桌面' }
        : { rhine: '3D archive', matrix: 'Terminal portfolio', aero: 'Glass desktop' };
      this.root.innerHTML = `<style>
        :host{display:inline-block;position:relative;z-index:100;font:12px/1.4 system-ui,sans-serif;--panel:#08130e;--ink:#bffbd5;--edge:#39604a;--muted:#8ab59a;color:var(--ink);text-align:left;letter-spacing:0}
        :host([current="aero"]){--panel:#e9f4f9;--ink:#183a50;--edge:#668da5;--muted:#456274}
        :host([current="rhine"]){--panel:var(--theme-panel,#edebe4);--ink:var(--theme-ink,#080a08);--edge:var(--theme-line,#aaa59a);--muted:var(--theme-muted,#606159)}
        :host([floating]){position:fixed;top:max(16px,env(safe-area-inset-top));right:max(20px,env(safe-area-inset-right));z-index:1000000}
        :host([floating][current="rhine"]){right:max(112px,calc(env(safe-area-inset-right) + 100px));z-index:60}
        :host([integrated]){align-self:center;flex:none}
        :host([integrated]) button{min-height:40px;padding:0 9px;background:transparent;border-color:var(--edge);font-size:11px}
        *{box-sizing:border-box}button{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;border:1px solid var(--edge);border-radius:3px;background:var(--panel);color:var(--ink);font:inherit;cursor:pointer;white-space:nowrap}
        button span{font-size:16px}button:hover,a:hover{filter:brightness(1.1)}
        nav{position:absolute;right:0;top:calc(100% + 8px);width:220px;max-width:calc(100vw - 32px);padding:6px;background:var(--panel);border:1px solid var(--edge);border-radius:4px;box-shadow:0 12px 36px #0004}
        nav[hidden]{display:none}a{display:grid;grid-template-columns:1fr auto;gap:4px;padding:12px;min-height:56px;border-radius:2px;color:var(--ink);text-decoration:none}
        a[aria-current="page"]{outline:1px solid var(--edge);outline-offset:-1px}small{grid-column:1/-1;color:var(--muted);font-size:11px}
        button:focus-visible,a:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
        @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
      </style><button type="button" aria-label="${label}" aria-expanded="${this.expanded}" aria-controls="interfaces"><span aria-hidden="true">⇄</span>${zh ? '界面' : 'View'}</button>
      <nav id="interfaces" aria-label="${label}" ${this.expanded ? '' : 'hidden'}>${Object.entries(interfaceRoutes).map(([key, href]) => {
        const id = key as PortfolioInterface;
        return `<a href="${href}" ${id === current ? 'aria-current="page"' : ''}><b>${names[id]}</b><span aria-hidden="true">${id === current ? '✓' : '↗'}</span><small>${descriptions[id]}</small></a>`;
      }).join('')}</nav>`;
      this.root.querySelector('button')!.onclick = () => {
        this.expanded = !this.expanded;
        this.root.querySelector('nav')!.hidden = !this.expanded;
        this.root.querySelector('button')!.setAttribute('aria-expanded', String(this.expanded));
      };
      this.root.querySelector('nav')!.onclick = (event) => {
        const anchor = (event.target as Element).closest('a');
        if (!anchor) return;
        // Keep native links usable with blocked storage, keyboard and new tabs.
        try {
          localStorage.setItem('zl-portfolio-locale', zh ? 'zh' : 'en');
          localStorage.setItem('zl-archive-language', zh ? 'zh' : 'en');
        } catch { /* Language falls back to the browser when storage is unavailable. */ }
        if (anchor.getAttribute('aria-current') === 'page' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          this.close();
          this.focus();
        }
      };
    }
  }
  customElements.define('portfolio-interface-switcher', InterfaceSwitcher);
}
