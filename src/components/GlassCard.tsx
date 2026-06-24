import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Blur strength of the frosted glass. Defaults to "md". */
  blur?: "sm" | "md" | "lg";
};

// Aero/Liquid-Glass uses a very LIGHT blur — the glassiness comes from edge
// refraction, not heavy frosting.
const BLUR_PX: Record<NonNullable<GlassCardProps["blur"]>, number> = {
  sm: 1,
  md: 2,
  lg: 4,
};

/**
 * A glass card in the Windows 7 "Aero" style.
 *
 * Built as three stacked layers rather than one element, on purpose:
 *   1. blur layer   — backdrop blur + edge refraction (#aero-refract).
 *   2. glass overlay (.aero-glass) — tint, reflections, and the diagonal
 *      striations that are pinned to the viewport (background-attachment: fixed)
 *      so they stay put on screen when the card is dragged, like real Aero.
 *   3. content.
 * The blur MUST be a sibling of the overlay, not its ancestor: an ancestor with
 * backdrop-filter would re-anchor the overlay's fixed striations to the card.
 * For the same reason there's no `overflow-hidden` here (it would break the blur
 * layer's backdrop-filter); each layer rounds its own corners instead.
 */
export default function GlassCard({
  children,
  blur = "md",
  className = "",
  ...props
}: GlassCardProps) {
  const px = BLUR_PX[blur];
  const filter = `url(#aero-refract) blur(${px}px) saturate(1.8) brightness(1.1)`;

  return (
    <div className={`aero-glass-frame relative rounded-xl ${className}`} {...props}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-xl"
        style={
          {
            backdropFilter: filter,
            WebkitBackdropFilter: `blur(${px}px) saturate(1.8) brightness(1.1)`,
          } as CSSProperties
        }
      />
      <div aria-hidden className="aero-glass absolute inset-0 rounded-xl" />
      <div className="relative">{children}</div>
    </div>
  );
}
