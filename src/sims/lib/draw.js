// Shared p5 drawing helpers for the sims in src/sims/*.
// Deliberately nested one level down: SimPage globs "../sims/*.js" with a
// single-segment wildcard, so nothing in lib/ is ever mistaken for a sim.

// Arrow from `from` to `to`, both in screen coordinates.
export function drawArrow(p, from, to, color, { dashed = false, weight = 2.5 } = {}) {
  p.push();
  p.stroke(color);
  p.strokeWeight(weight);
  if (dashed) p.drawingContext.setLineDash([6, 5]);
  p.line(from.x, from.y, to.x, to.y);
  p.drawingContext.setLineDash([]);

  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const headLen = 10;
  p.noStroke();
  p.fill(color);
  p.translate(to.x, to.y);
  p.rotate(angle);
  p.triangle(0, 0, -headLen, headLen / 2.2, -headLen, -headLen / 2.2);
  p.pop();
}

// Small caption offset up-and-right of `pos` so it clears an arrowhead.
export function drawLabel(p, text, pos, color, { dx = 8, dy = -8, size = 13 } = {}) {
  p.push();
  p.noStroke();
  p.fill(color);
  p.textSize(size);
  p.text(text, pos.x + dx, pos.y + dy);
  p.pop();
}

// Round `span / targetTicks` up to the nearest 1/2/5 x 10^n, so auto-fitted
// axes land on readable intervals (1, 2, 5, 10, 20, 50, ...) instead of
// values like 13.7 m.
export function niceStep(span, targetTicks = 6) {
  const raw = Math.abs(span) / Math.max(1, targetTicks);
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * mag;
}
