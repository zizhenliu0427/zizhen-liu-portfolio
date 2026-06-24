// Displacement map for the rectangular glass cards. Red drives horizontal
// displacement and green drives vertical displacement. Neutral red/green values
// through the middle keep the centre calm while the edge bends the backdrop.
const DISPLACEMENT_MAP = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
<defs>
<linearGradient id='rx' x1='0' y1='0' x2='1' y2='0'>
<stop offset='0' stop-color='#000'/>
<stop offset='0.35' stop-color='#800000'/>
<stop offset='0.65' stop-color='#800000'/>
<stop offset='1' stop-color='#f00'/>
</linearGradient>
<linearGradient id='gy' x1='0' y1='0' x2='0' y2='1'>
<stop offset='0' stop-color='#000'/>
<stop offset='0.35' stop-color='#008000'/>
<stop offset='0.65' stop-color='#008000'/>
<stop offset='1' stop-color='#0f0'/>
</linearGradient>
</defs>
<rect width='100' height='100' fill='#000'/>
<rect width='100' height='100' fill='url(#rx)' style='mix-blend-mode:screen'/>
<rect width='100' height='100' fill='url(#gy)' style='mix-blend-mode:screen'/>
</svg>`;

// Convex-lens map for bubbles. It scales the wallpaper inside the bubble instead
// of showing a second translucent backdrop layer, so there is no double image.
const BUBBLE_MAP = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
<defs>
<linearGradient id='brx' x1='0' y1='0' x2='1' y2='0'>
<stop offset='0' stop-color='#120000'/>
<stop offset='0.18' stop-color='#460000'/>
<stop offset='0.38' stop-color='#720000'/>
<stop offset='0.5' stop-color='#800000'/>
<stop offset='0.62' stop-color='#8e0000'/>
<stop offset='0.82' stop-color='#ba0000'/>
<stop offset='1' stop-color='#ee0000'/>
</linearGradient>
<linearGradient id='bgy' x1='0' y1='0' x2='0' y2='1'>
<stop offset='0' stop-color='#001200'/>
<stop offset='0.18' stop-color='#004600'/>
<stop offset='0.38' stop-color='#007200'/>
<stop offset='0.5' stop-color='#008000'/>
<stop offset='0.62' stop-color='#008e00'/>
<stop offset='0.82' stop-color='#00ba00'/>
<stop offset='1' stop-color='#00ee00'/>
</linearGradient>
</defs>
<rect width='100' height='100' fill='#000'/>
<rect width='100' height='100' fill='url(#brx)' style='mix-blend-mode:screen'/>
<rect width='100' height='100' fill='url(#bgy)' style='mix-blend-mode:screen'/>
</svg>`;

/**
 * Hidden SVG filters. Render once on the page; glass layers reference these ids.
 */
export default function GlassFilter() {
  const refractHref = `data:image/svg+xml,${encodeURIComponent(DISPLACEMENT_MAP)}`;
  const bubbleHref = `data:image/svg+xml,${encodeURIComponent(BUBBLE_MAP)}`;

  return (
    <svg
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0 }}
      colorInterpolationFilters="sRGB"
    >
      <filter id="aero-refract" x="0" y="0" width="100%" height="100%">
        <feImage
          href={refractHref}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          result="map"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="12"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter id="aero-bubble" x="-20%" y="-20%" width="140%" height="140%">
        <feImage
          href={bubbleHref}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          result="bubblemap"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="bubblemap"
          scale="28"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
