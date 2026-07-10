// Shared Aero Flip 3D stack geometry — used by both the real windows
// (Win7Window) and the Desktop card (Win7Desktop) so they line up.
//
// The tilt is an AFFINE parallelogram (scaleX foreshorten + skewY shear), NOT a
// perspective rotateY — perspective makes the far edge converge (a trapezoid);
// real Win7 Flip 3D keeps the windows as parallelograms. Cards are normalised to
// one width and aligned by their bottom-left corner.

// Aero Flip 3D "conveyor": cards march along a diagonal axis from the front
// (lower-right, large) to the back (upper-left, small); cycling advances each
// toward the front. Cards are normalised to one bounding box (so a maximised /
// tall window can't dwarf the stack), centre-aligned, only slightly tilted
// (affine scaleX + skewY — nearly face-on, no trapezoid).
export const FLIP_W = 560; // bounding-box width
export const FLIP_H = 380; // bounding-box height
export const FLIP_FORE = 0.82; // horizontal foreshorten (mild → nearly face-on)
export const FLIP_SKEW = -7; // vertical shear (skewY, degrees) — gentle
export const FLIP_DX = 96; // per-card step LEFT along the conveyor
export const FLIP_DY = 56; // per-card step UP along the conveyor
export const FLIP_DEPTH = 0.12; // per-card shrink (front big, back small)
export const FLIP_AX = 120; // front card CENTRE x offset from screen centre (right)
export const FLIP_AY = 70; // front card CENTRE y offset from screen centre (down)
