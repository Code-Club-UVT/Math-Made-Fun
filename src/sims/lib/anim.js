// Animation helpers shared by the sims that run p5's draw loop.
// Same nesting rationale as ./draw.js: SimPage globs "../sims/*.js" with a
// single-segment wildcard, so nothing in lib/ is mistaken for a sim.

// Longest step any single frame may advance the physics by, in seconds.
// ~3 frames at 60 fps.
export const MAX_STEP = 0.05;

// Seconds elapsed since the previous frame, clamped.
//
// The clamp matters: requestAnimationFrame stops firing while a tab is
// hidden, so the first frame after the user comes back reports the whole
// time they were away. Unclamped, that single step would skip a projectile
// through several flights, or shove the block clean off the ramp.
export function stepSeconds(p) {
  const dt = (p.deltaTime ?? 1000 / 60) / 1000;
  if (!Number.isFinite(dt) || dt <= 0) return 0;
  return Math.min(dt, MAX_STEP);
}

// Honours the OS-level "reduce motion" setting. Sims that see `true` should
// render their finished state once and skip the animation entirely.
export function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
