type Box = { x: number; y: number; width: number; height: number };

/** Bridge two fully redacted layouts before revealing the translated text. */
export class DocumentMorph {
  private cleanup: (() => void) | undefined;

  finish() { this.cleanup?.(); }

  replace(root: HTMLElement, render: () => void) {
    this.finish();
    const parent = root.parentElement!;
    const bounds = root.getBoundingClientRect();
    const parentBounds = parent.getBoundingClientRect();
    const scale = bounds.width / root.offsetWidth;
    if (!scale) { render(); return; }
    const measure = () => new Map(Array.from(root.querySelectorAll<HTMLElement>('.document-redaction-window')).map(el => {
      const rect = el.getBoundingClientRect();
      return [el.dataset.morphKey!, { x: (rect.left - bounds.left) / scale, y: (rect.top - bounds.top) / scale, width: rect.width / scale, height: rect.height / scale }];
    }));
    const before = measure();
    const old = root.cloneNode(true) as HTMLElement;
    old.removeAttribute('id');
    old.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    old.inert = true;
    old.setAttribute('aria-hidden', 'true');
    old.classList.add('document-morphing', 'document-morph-copy');
    old.style.height = `${root.offsetHeight}px`;
    parent.append(old);
    old.scrollTop = root.scrollTop;
    render();
    const after = measure();
    const layer = document.createElement('div');
    layer.className = 'document-morph-bars';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = `left:${(bounds.left - parentBounds.left) / scale}px;top:${(bounds.top - parentBounds.top) / scale}px;width:${root.offsetWidth}px;height:${Math.max(root.clientHeight, old.clientHeight)}px`;
    parent.append(layer);
    root.classList.add('document-morphing');
    const options: KeyframeAnimationOptions = { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' };
    const animations: Animation[] = [old.animate([{ opacity: 1 }, { opacity: 0 }], options), root.animate([{ opacity: 0 }, { opacity: 1 }], options)];
    for (const key of new Set([...before.keys(), ...after.keys()])) {
      const source = before.get(key), target = after.get(key);
      const box = target ?? source!;
      if (!box.width || !box.height) continue;
      const bar = document.createElement('span');
      bar.style.cssText = `left:${box.x}px;top:${box.y}px;width:${box.width}px;height:${box.height}px`;
      layer.append(bar);
      const transform = (from: Box) => `translate(${from.x - box.x}px,${from.y - box.y}px) scale(${from.width / box.width},${from.height / box.height})`;
      animations.push(bar.animate([
        { transform: source ? transform(source) : 'scaleX(0)', opacity: source ? 1 : 0 },
        { transform: target ? 'none' : 'scaleX(0)', opacity: target ? 1 : 0 },
      ], options));
    }
    const cleanup = () => {
      animations.forEach(animation => animation.cancel());
      root.classList.remove('document-morphing');
      old.remove();
      layer.remove();
      if (this.cleanup === cleanup) this.cleanup = undefined;
    };
    this.cleanup = cleanup;
    void Promise.all(animations.map(animation => animation.finished)).then(cleanup, () => {});
  }
}
