// Deterministic bubble configs (no Math.random) so server and client render the
// same markup and avoid React hydration mismatches.
const BUBBLES = [
  { left: "6%", size: 90, delay: "0s", duration: "16s" },
  { left: "18%", size: 50, delay: "3s", duration: "12s" },
  { left: "32%", size: 130, delay: "6s", duration: "20s" },
  { left: "47%", size: 40, delay: "1.5s", duration: "11s" },
  { left: "58%", size: 80, delay: "4.5s", duration: "15s" },
  { left: "70%", size: 60, delay: "2s", duration: "13s" },
  { left: "82%", size: 110, delay: "7s", duration: "19s" },
  { left: "92%", size: 45, delay: "5s", duration: "10s" },
];

/**
 * Full-viewport Frutiger Aero backdrop: a wallpaper with glassy refractive
 * bubbles drifting upward over it. Purely decorative.
 */
export default function AeroBackground({
  wallpaper = "/bg-hill1.jpg",
}: {
  wallpaper?: string;
}) {
  const isAurora = wallpaper === "aurora";

  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden">
      {isAurora ? (
        <div className="aurora">
          <div className="aurora__layer aurora__layer--1" />
          <div className="aurora__layer aurora__layer--2" />
          <div className="aurora__layer aurora__layer--3" />
          <div className="aurora__ribbon" />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${wallpaper}')` }}
        />
      )}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="aero-bubble absolute bottom-[-160px] rounded-full"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.duration,
            backdropFilter:
              "url(#aero-bubble) blur(0.25px) saturate(1.2) brightness(1.05)",
            WebkitBackdropFilter: "blur(0.25px) saturate(1.2) brightness(1.05)",
          }}
        >
          <span className="aero-bubble__rim" />
          <span className="aero-bubble__shine" />
        </span>
      ))}
    </div>
  );
}
