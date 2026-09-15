// Original ZL monogram, retaining the upstream two-path/text animation contract.
const paths = `<path d="M30 30H140L30 115H140M180 30V115H280" fill="none" stroke="currentColor" stroke-width="19" stroke-linejoin="bevel"/><path d="M20 8H55M255 137H290" fill="none" stroke="currentColor" stroke-width="8"/>`;
export const labelMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 145" color="#171713">${paths}</svg>`;
export const logo = `<svg viewBox="0 0 310 185" aria-label="Zizhen Liu" role="img">${paths}<text x="155" y="174" text-anchor="middle" font-family="MiSans,sans-serif" font-size="16" font-weight="700" letter-spacing="12">ZL·ARCHIVE</text></svg>`;
// The same Bezier contour, continuous for the opening's moving draw/erase ends.
// Its small printed gap is animated with stroke dashes, not baked into the path.
export const bootMarkContour =
  "M30 30H140L30 115H140M180 30V115H280";

// Optical spacing for this fixed wordmark, measured from the reference glyphs.
const analysisPositions = [2, 28, 55, 81, 103, 129, 154, 166];
export const brandHeading = `<h1>ZL ARCHIVE</h1><div>SOFTWARE ENGINEERING</div><p><span class="brand-analysis" role="img" aria-label="ANALYSIS">${[..."ANALYSIS"].map((letter, i) => `<span aria-hidden="true" style="left:${analysisPositions[i]}px">${letter}</span>`).join("")}</span> <b>OS</b></p>`;
