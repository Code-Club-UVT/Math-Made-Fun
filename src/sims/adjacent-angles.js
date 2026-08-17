// sims/adjacent-angles.js — Adding Adjacent Angles
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
//
// Static (noLoop) — no time dimension, and every quantity is slider-owned.
//
// The sliders set each ray's direction measured from OA, i.e. the *cumulative*
// angles ∠AOB, ∠AOC, ∠AOD — not the individual parts. That is what makes both
// modes work off one piece of state: in "solve" mode the whole (∠AOC) and the
// known part (∠AOB) are each directly settable, so the remaining part is
// genuinely derived rather than something the student already dialled in.
// Setting the parts instead would make the whole the derived value and there
// would be nothing left to solve for.
import p5 from "p5";

const W = 560;
const H = 360;

// Figure on the left, worked algebra on the right.
const O = { x: 186, y: 258 };
const RAY = 128;
const R_PART = 52; // parts share one radius — their sectors never overlap
const R_WHOLE = 104; // the whole is arced outside them, as in a textbook figure
const ALGEBRA_X = 348;

const COLOR = {
  parts: ["#4361ee", "#e63946", "#2a9d8f"],
  whole: "#7c5cff",
  ray: "#1d1d1f",
  axis: "#9aa0a6",
  ink: "#1d1d1f",
  muted: "#6b6b70",
  warn: "#d93b47",
};

const rad = (deg) => (deg * Math.PI) / 180;

// Screen point at `deg` from OA, `dist` out from the vertex. Screen y grows
// downward, so the angle is negated.
function ray(deg, dist) {
  return {
    x: O.x + Math.cos(rad(deg)) * dist,
    y: O.y - Math.sin(rad(deg)) * dist,
  };
}

function solve({ angleAOB, angleAOC, angleAOD, threeAngles, solveMode }) {
  const three = Boolean(threeAngles);
  // Cumulative ray directions, OA fixed at 0.
  const cuts = three ? [0, angleAOB, angleAOC, angleAOD] : [0, angleAOB, angleAOC];
  const names = three ? ["A", "B", "C", "D"] : ["A", "B", "C"];

  // Each ray must lie beyond the previous one, or "adjacent" means nothing.
  const ordered = cuts.every((v, i) => i === 0 || v > cuts[i - 1]);

  const parts = [];
  for (let i = 1; i < cuts.length; i++) {
    parts.push({
      name: `${names[i - 1]}O${names[i]}`,
      value: cuts[i] - cuts[i - 1],
      from: cuts[i - 1],
      to: cuts[i],
      color: COLOR.parts[i - 1],
    });
  }

  return {
    three,
    solveMode: Boolean(solveMode),
    cuts,
    names,
    ordered,
    parts,
    whole: { name: `AO${names[names.length - 1]}`, value: cuts[cuts.length - 1] },
  };
}

function drawFigure(p, s) {
  // rays
  p.stroke(COLOR.ray);
  p.strokeWeight(2.5);
  for (const deg of s.cuts) {
    const end = ray(deg, RAY);
    p.line(O.x, O.y, end.x, end.y);
  }

  // the whole, arced outside everything else
  p.noFill();
  p.stroke(COLOR.whole);
  p.strokeWeight(2.5);
  p.arc(O.x, O.y, R_WHOLE * 2, R_WHOLE * 2, -rad(s.whole.value), 0);

  // parts, each a shaded sector
  for (const part of s.parts) {
    if (part.value <= 0) continue;
    p.noStroke();
    p.fill(p.color(part.color));
    p.drawingContext.globalAlpha = 0.18;
    p.arc(O.x, O.y, R_PART * 2, R_PART * 2, -rad(part.to), -rad(part.from), p.PIE);
    p.drawingContext.globalAlpha = 1;

    p.noFill();
    p.stroke(part.color);
    p.strokeWeight(2);
    p.arc(O.x, O.y, R_PART * 2, R_PART * 2, -rad(part.to), -rad(part.from));
  }

  // measures: parts just outside their own arc, the whole outside its arc
  p.noStroke();
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  for (const part of s.parts) {
    if (part.value < 12) continue; // too thin a wedge to sit a number in
    const mid = (part.from + part.to) / 2;
    const at = ray(mid, R_PART + 17);
    p.fill(part.color);
    p.text(`${part.value}°`, at.x, at.y);
  }
  const wholeAt = ray(s.whole.value / 2, R_WHOLE + 18);
  p.fill(COLOR.whole);
  p.text(`${s.whole.value}°`, wholeAt.x, wholeAt.y);

  // ray names
  p.fill(COLOR.ink);
  p.textSize(14);
  for (let i = 0; i < s.cuts.length; i++) {
    const at = ray(s.cuts[i], RAY + 14);
    p.text(s.names[i], at.x, at.y);
  }
  p.fill(COLOR.muted);
  p.text("O", O.x - 14, O.y + 12);
}

// Complementary/supplementary describe a *pair*, so this is only stated when
// there are exactly two parts.
function pairNote(s) {
  if (s.three || !s.ordered) return null;
  if (s.whole.value === 90) return "The two angles are complementary — they make 90°";
  if (s.whole.value === 180) return "The two angles are supplementary — they make a straight line";
  return null;
}

function drawAlgebra(p, s) {
  const names = s.parts.map((part) => `m∠${part.name}`);
  const values = s.parts.map((part) => `${part.value}°`);
  const whole = `${s.whole.value}°`;

  const lines = [];
  if (s.solveMode) {
    // Everything but the last part is known; that last one is the unknown.
    const known = s.parts.slice(0, -1);
    const unknown = s.parts[s.parts.length - 1];
    const knownSum = known.reduce((sum, part) => sum + part.value, 0);

    lines.push({ text: `${names.join(" + ")} = m∠${s.whole.name}`, color: COLOR.muted });
    lines.push({
      text: `${known.map((k) => `${k.value}°`).join(" + ")} + m∠${unknown.name} = ${whole}`,
      color: COLOR.ink,
    });
    if (known.length > 1) {
      lines.push({ text: `${knownSum}° + m∠${unknown.name} = ${whole}`, color: COLOR.ink });
    }
    lines.push({ text: `−${knownSum}°  =  −${knownSum}°`, color: COLOR.muted });
    lines.push({ rule: true });
    lines.push({ text: `m∠${unknown.name} = ${unknown.value}°`, color: unknown.color, strong: true });
  } else {
    lines.push({ text: `${names.join(" + ")} = m∠${s.whole.name}`, color: COLOR.muted });
    lines.push({ text: `${values.join(" + ")} = ${whole}`, color: COLOR.ink, strong: true });
  }

  let y = 132;
  p.textAlign(p.LEFT, p.TOP);
  for (const line of lines) {
    if (line.rule) {
      p.stroke(COLOR.axis);
      p.strokeWeight(1);
      p.line(ALGEBRA_X, y + 6, W - 26, y + 6);
      y += 16;
      continue;
    }
    p.noStroke();
    p.fill(line.color);
    p.textSize(line.strong ? 15 : 13);
    p.text(line.text, ALGEBRA_X, y);
    y += line.strong ? 26 : 22;
  }
}

function drawReadouts(p, s) {
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(15);
  p.fill(COLOR.whole);
  p.text(`m∠${s.whole.name} = ${s.whole.value}°`, 26, 14);

  p.textSize(13);
  let x = 26;
  for (const part of s.parts) {
    p.fill(part.color);
    p.text(`m∠${part.name} = ${part.value}°`, x, 40);
    x += 118;
  }

  p.textAlign(p.LEFT, p.TOP);
  p.textSize(13);
  p.fill(COLOR.muted);
  p.text(s.solveMode ? "find the missing angle" : "add the parts", ALGEBRA_X, 110);

  const note = pairNote(s);
  if (note) {
    p.fill(COLOR.whole);
    p.textSize(13);
    p.textAlign(p.LEFT, p.TOP);
    p.text(note, 26, H - 28);
  }
}

function drawOutOfOrder(p, s) {
  p.stroke(COLOR.ray);
  p.strokeWeight(2.5);
  for (const deg of s.cuts) {
    const end = ray(deg, RAY);
    p.line(O.x, O.y, end.x, end.y);
  }
  p.noStroke();
  p.fill(COLOR.ink);
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  for (let i = 0; i < s.cuts.length; i++) {
    const at = ray(s.cuts[i], RAY + 14);
    p.text(s.names[i], at.x, at.y);
  }

  p.fill(COLOR.warn);
  p.textSize(15);
  p.textAlign(p.LEFT, p.TOP);
  p.text("The rays are out of order", ALGEBRA_X, 132);
  p.fill(COLOR.muted);
  p.textSize(13);
  p.text("Each ray must open further", ALGEBRA_X, 158);
  p.text("than the one before it, or the", ALGEBRA_X, 176);
  p.text("angles are not adjacent.", ALGEBRA_X, 194);
}

function drawScene(p, sim) {
  const s = solve(sim._values);
  p.background(255);

  if (!s.ordered) {
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(15);
    p.fill(COLOR.warn);
    p.text(`m∠${s.whole.name} = ${s.whole.value}°`, 26, 14);
    drawOutOfOrder(p, s);
    return;
  }

  drawReadouts(p, s);
  drawFigure(p, s);
  drawAlgebra(p, s);
}

export default {
  id: "adjacent-angles",
  title: "Adding Adjacent Angles",
  thumbnail: "/assets/thumbs/adjacent-angles.svg",
  controls: [
    // `kind: "switch"` marks a plain either/or toggle rather than playback,
    // so ControlPanel names the two states instead of saying "Play …".
    { id: "solveMode", label: "solve mode", type: "toggle", kind: "switch", default: false },
    { id: "threeAngles", label: "three angles", type: "toggle", kind: "switch", default: false },
    // Cumulative directions from OA. angleAOD is only read in three-angle mode.
    { id: "angleAOB", label: "Angle AOB (°)", type: "range", min: 5, max: 170, step: 1, default: 30 },
    { id: "angleAOC", label: "Angle AOC (°)", type: "range", min: 5, max: 175, step: 1, default: 142 },
    { id: "angleAOD", label: "Angle AOD (°)", type: "range", min: 5, max: 180, step: 1, default: 170 },
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
