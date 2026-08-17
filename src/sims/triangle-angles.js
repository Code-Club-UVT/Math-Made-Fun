// sims/triangle-angles.js — Angles in a Triangle
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
//
// Static (noLoop) — there is no time dimension, and both quantities the
// student changes are sliders, so nothing may advance on its own.
//
// Two angles are chosen, the third follows from A + B + C = 180°. The sliders
// deliberately allow a sum of 180° or more: `min`/`max` in the contract are
// static, so the second slider cannot narrow itself to 180 − A, and hiding the
// case would waste the best lesson in the sim. When it happens the two sides
// are drawn visibly diverging, and the angle strip along the bottom overflows
// past the half-turn.
import p5 from "p5";

const W = 560;
const H = 340;

// Box the triangle is fitted into. Obtuse triangles push the apex well outside
// the base, so the drawing is rescaled every frame rather than fixed.
const TRI = { x: 40, y: 60, w: 480, h: 176 };

// The angle strip: three wedges hinged at one point, filling a straight line.
const STRIP = { cx: 280, cy: 316, r: 54, half: 74 };

const COLOR = {
  a: "#4361ee",
  b: "#e63946",
  c: "#2a9d8f",
  fill: "rgba(67, 97, 238, 0.07)",
  edge: "#4361ee",
  axis: "#9aa0a6",
  ink: "#1d1d1f",
  muted: "#6b6b70",
  warn: "#d93b47",
};

const rad = (deg) => (deg * Math.PI) / 180;

function solve({ angleA, angleB }) {
  const c = 180 - angleA - angleB;
  return { a: angleA, b: angleB, c, possible: c > 0 };
}

// Unit triangle with base AB = 1, apex found by the law of sines. Returned in
// maths coordinates (y up); the caller flips and scales it.
function unitTriangle(aDeg, bDeg, cDeg) {
  const A = rad(aDeg);
  const side = Math.sin(rad(bDeg)) / Math.sin(rad(cDeg)); // length of AC
  return {
    A: { x: 0, y: 0 },
    B: { x: 1, y: 0 },
    C: { x: side * Math.cos(A), y: side * Math.sin(A) },
  };
}

// Scale and centre the unit triangle inside TRI. A triangle with a nearly
// straight angle at C is enormously wide and flat; fitting per frame keeps it
// on canvas and lets the student watch it flatten.
function fitToBox(t) {
  const xs = [t.A.x, t.B.x, t.C.x];
  const minX = Math.min(...xs);
  const boxW = Math.max(...xs) - minX;
  const boxH = Math.max(t.C.y, 0.001);
  const s = Math.min(TRI.w / boxW, TRI.h / boxH);

  const ox = TRI.x + (TRI.w - boxW * s) / 2 - minX * s;
  const oy = TRI.y + TRI.h - (TRI.h - boxH * s) / 2;
  const put = (pt) => ({ x: ox + pt.x * s, y: oy - pt.y * s });
  return { A: put(t.A), B: put(t.B), C: put(t.C) };
}

// Interior arc at vertex V, between its two neighbours. Picks the sweep under
// 180° so the arc always sits inside the triangle.
function drawVertexArc(p, V, P, Q, label, color) {
  const toP = Math.atan2(P.y - V.y, P.x - V.x);
  const toQ = Math.atan2(Q.y - V.y, Q.x - V.x);
  let delta = toQ - toP;
  while (delta <= -Math.PI) delta += 2 * Math.PI;
  while (delta > Math.PI) delta -= 2 * Math.PI;

  // Keep the arc clear of the opposite corners on a thin triangle.
  const reach = Math.min(
    Math.hypot(P.x - V.x, P.y - V.y),
    Math.hypot(Q.x - V.x, Q.y - V.y)
  );
  const r = Math.min(26, reach * 0.3);
  if (r < 7) return; // too cramped to read — the readout still has the number

  p.noFill();
  p.stroke(color);
  p.strokeWeight(2);
  const from = delta >= 0 ? toP : toP + delta;
  p.arc(V.x, V.y, r * 2, r * 2, from, from + Math.abs(delta));

  const mid = toP + delta / 2;
  p.noStroke();
  p.fill(color);
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, V.x + Math.cos(mid) * (r + 15), V.y + Math.sin(mid) * (r + 15));
}

function drawTriangle(p, s) {
  const t = fitToBox(unitTriangle(s.a, s.b, s.c));

  p.stroke(COLOR.edge);
  p.strokeWeight(2.5);
  p.fill(COLOR.fill);
  p.triangle(t.A.x, t.A.y, t.B.x, t.B.y, t.C.x, t.C.y);

  drawVertexArc(p, t.A, t.B, t.C, `${s.a}°`, COLOR.a);
  drawVertexArc(p, t.B, t.C, t.A, `${s.b}°`, COLOR.b);
  drawVertexArc(p, t.C, t.A, t.B, `${s.c}°`, COLOR.c);

  // vertex names, nudged away from the triangle's middle
  const mid = {
    x: (t.A.x + t.B.x + t.C.x) / 3,
    y: (t.A.y + t.B.y + t.C.y) / 3,
  };
  p.noStroke();
  p.fill(COLOR.ink);
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  for (const [name, pt] of [["A", t.A], ["B", t.B], ["C", t.C]]) {
    const dx = pt.x - mid.x;
    const dy = pt.y - mid.y;
    const len = Math.hypot(dx, dy) || 1;
    p.text(name, pt.x + (dx / len) * 16, pt.y + (dy / len) * 16);
  }
}

// The impossible case: two rays that never meet. Drawn at a fixed scale, since
// there is no triangle to fit.
function drawOpenRays(p, s) {
  const y = TRI.y + TRI.h - 30;
  const A = { x: 150, y };
  const B = { x: 410, y };
  const reach = 250;

  p.stroke(COLOR.axis);
  p.strokeWeight(2.5);
  p.line(A.x, A.y, B.x, B.y);

  // interior rays: up-and-right from A, up-and-left from B
  p.strokeWeight(2.5);
  p.stroke(COLOR.a);
  p.line(A.x, A.y, A.x + Math.cos(rad(s.a)) * reach, A.y - Math.sin(rad(s.a)) * reach);
  p.stroke(COLOR.b);
  p.line(B.x, B.y, B.x - Math.cos(rad(s.b)) * reach, B.y - Math.sin(rad(s.b)) * reach);

  p.noStroke();
  p.fill(COLOR.ink);
  p.textSize(14);
  p.textAlign(p.CENTER, p.TOP);
  p.text("A", A.x, A.y + 8);
  p.text("B", B.x, B.y + 8);

  p.fill(COLOR.warn);
  p.textSize(15);
  p.textAlign(p.CENTER, p.TOP);
  p.text("The sides never meet — no such triangle", W / 2, TRI.y + 4);
  p.fill(COLOR.muted);
  p.textSize(13);
  // At exactly 180° the two sides are parallel rather than diverging, and
  // nothing has overflowed — it is just that no degrees are left for C.
  const sum = s.a + s.b;
  p.text(
    sum === 180
      ? `${s.a}° + ${s.b}° = 180°, leaving nothing for C`
      : `${s.a}° + ${s.b}° = ${sum}°, already past 180°`,
    W / 2,
    TRI.y + 26
  );
}

// Three wedges hinged at one point. Valid angles fill the straight line
// exactly; an impossible pair spills past its right-hand end, which is the
// failure explaining itself.
function drawStrip(p, s) {
  const { cx, cy, r, half } = STRIP;

  p.stroke(COLOR.axis);
  p.strokeWeight(1.5);
  p.line(cx - half, cy, cx + half, cy);

  const start = -Math.PI;
  const bounds = [start, start + rad(s.a), start + rad(s.a + s.b)];
  const wedges = [
    { from: bounds[0], to: bounds[1], color: COLOR.a, label: "A" },
    { from: bounds[1], to: bounds[2], color: COLOR.b, label: "B" },
  ];
  if (s.possible) {
    wedges.push({ from: bounds[2], to: 0, color: COLOR.c, label: "C" });
  }

  p.noStroke();
  for (const w of wedges) {
    if (Math.abs(w.to - w.from) < 0.001) continue;
    p.fill(p.color(w.color));
    p.drawingContext.globalAlpha = 0.22;
    p.arc(cx, cy, r * 2, r * 2, w.from, w.to, p.PIE);
    p.drawingContext.globalAlpha = 1;

    p.stroke(w.color);
    p.strokeWeight(1.5);
    p.noFill();
    p.arc(cx, cy, r * 2, r * 2, w.from, w.to);
    p.noStroke();

    // name the wedge only when it is wide enough to hold the letter
    if (w.to - w.from > 0.34) {
      const mid = (w.from + w.to) / 2;
      p.fill(w.color);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(w.label, cx + Math.cos(mid) * r * 0.62, cy + Math.sin(mid) * r * 0.62);
    }
  }

  p.noStroke();
  p.fill(s.possible ? COLOR.muted : COLOR.warn);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  let note = "the three angles fill a straight line — 180°";
  if (!s.possible) {
    note =
      s.a + s.b === 180
        ? "A and B already fill it — no room for C"
        : "A and B alone overflow the straight line";
  }
  p.text(note, cx, cy + 7);
}

// Acute / right / obtuse. English on the canvas like every other sim — the
// language toggle does not reach into the sketches; simTheory.js carries the
// Romanian.
function classify(s) {
  const angles = [s.a, s.b, s.c];
  if (angles.some((v) => v === 90)) return "Right";
  if (angles.some((v) => v > 90)) return "Obtuse";
  return "Acute";
}

function drawReadouts(p, s) {
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(15);

  p.fill(COLOR.a);
  p.text(`A = ${s.a}°`, 26, 12);
  p.fill(COLOR.b);
  p.text(`B = ${s.b}°`, 126, 12);

  if (s.possible) {
    p.fill(COLOR.c);
    p.text(`C = ${s.c}°`, 226, 12);
    p.fill(COLOR.muted);
    p.textSize(13);
    p.text(`${s.a}° + ${s.b}° + ${s.c}° = 180°`, 26, 36);
    p.fill(COLOR.ink);
    p.textAlign(p.RIGHT, p.TOP);
    p.textSize(14);
    p.text(classify(s), W - 26, 12);
  } else {
    p.fill(COLOR.warn);
    p.text(`C = ${s.c}°`, 226, 12);
    p.textSize(13);
    p.text("an angle cannot be zero or negative", 26, 36);
  }
}

function drawScene(p, sim) {
  const s = solve(sim._values);
  p.background(255);
  drawReadouts(p, s);
  if (s.possible) drawTriangle(p, s);
  else drawOpenRays(p, s);
  drawStrip(p, s);
}

export default {
  id: "triangle-angles",
  title: "Angles in a Triangle",
  thumbnail: "/assets/thumbs/triangle-angles.svg",
  controls: [
    // Ranges deliberately allow an impossible sum — see the note at the top.
    { id: "angleA", label: "Angle A (°)", type: "range", min: 1, max: 178, step: 1, default: 70 },
    { id: "angleB", label: "Angle B (°)", type: "range", min: 1, max: 178, step: 1, default: 45 },
  ],
  init(canvasNode, controlValues) {
    this._values = controlValues;
    this._instance = new p5((p) => {
      p.setup = () => {
        p.createCanvas(W, H);
        p.noLoop();
      };
      p.draw = () => drawScene(p, this);
    }, canvasNode);
  },
  update(controlValues) {
    this._values = controlValues;
    this._instance?.redraw();
  },
  destroy() {
    this._instance?.remove();
    this._instance = null;
    this._values = null;
  },
};
