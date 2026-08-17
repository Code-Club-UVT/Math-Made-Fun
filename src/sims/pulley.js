// sims/pulley.js — The Pulley
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
//
// `count` is the number of rope strands supporting the load, not a literal
// wheel count — the standard classroom simplification, and it is exactly
// what makes F = G / count hold. Drawn as the textbook cartoon: a fixed bar
// at the ceiling, a movable bar carrying the load, and `count` vertical
// strands between them. One strand continues past the fixed bar as the
// "pull here" free end. At count = 1 this collapses to a single fixed
// pulley — direction changes, force does not — which is worth keeping as
// the low end precisely because it is the non-obvious baseline.
//
// Animated, unlike the static force diagram in inclined-plane, because the
// claim being taught ("you pull far more rope") is a claim about motion. It
// is safe to animate because the system is purely kinematic — rope speed and
// load speed are rigidly linked by count, so unlike an accelerating body
// there is no state to diverge or destabilise.
import p5 from "p5";
import { drawArrow, drawLabel } from "./lib/draw.js";
import { stepSeconds, prefersReducedMotion } from "./lib/anim.js";

const W = 560;
const H = 460;
const CX = 280;

const CEIL_Y = 26;
const FIXED_Y = 70; // fixed bar
const TOP_Y = 140; // movable bar at the top of its travel
const LOW_Y = 300; // movable bar at rest (load fully lowered)
const BAR_W = 140; // shared by both bars, independent of count
const BAR_H = 10;

const LOAD_W = 64;
const LOAD_H = 40;
const LOAD_GAP = 14; // rope length from movable bar down to the load box

const FREE_END_X = CX + BAR_W / 2 + 30; // where the pulled strand runs
const HAND_Y = 360; // where the force arrow on the free end is drawn from

const MAX_RISE_M = 1; // load travels this many metres per animation cycle
const RISE_TRAVEL_PX = LOW_Y - TOP_Y; // matching pixel span
const RISE_DURATION_S = 4; // fixed regardless of count — see file header
const HOLD_S = 0.8;
// Force-arrow scale, tuned so the weight arrow never overflows the canvas at
// the top of the load's range: verified against the full 20–300N slider.
const PX_PER_N = 0.2;
// A literal 0-length arrow at the smallest possible force (3.3N at n=6) would
// draw as a bare arrowhead with no shaft. Floor it so it always reads as an
// arrow — this slightly compresses the true ratio only below this floor.
const ARROW_MIN_PX = 12;
const arrowLen = (n) => Math.max(ARROW_MIN_PX, n * PX_PER_N);

const AUTOPLAY = !prefersReducedMotion();

const COLOR = {
  bar: "#6b6b70",
  strand: "#9aa0a6",
  strandFree: "#4361ee",
  load: "#a86bff",
  loadFill: "#efe7ff",
  weight: "#4361ee",
  force: "#e63946",
  ceiling: "#c9d2e0",
  ink: "#1d1d1f",
  muted: "#6b6b70",
};

// Everything the drawing needs, derived from the slider values alone.
function solve({ count, load }) {
  return { n: count, G: load, F: load / count };
}

// One integration step. Kept separate so the kinematics can be exercised
// without a canvas, same shape as advance() in inclined-plane.js.
export function advance(state, dt) {
  if (state.hold > 0) {
    state.hold = Math.max(0, state.hold - dt);
    if (state.hold === 0) state.pos = 0;
    return state;
  }
  state.pos += (MAX_RISE_M / RISE_DURATION_S) * dt;
  if (state.pos >= MAX_RISE_M) {
    state.pos = MAX_RISE_M;
    state.hold = HOLD_S;
  }
  return state;
}

function drawCeiling(p) {
  p.stroke(COLOR.ceiling);
  p.strokeWeight(3);
  p.line(CX - BAR_W / 2 - 20, CEIL_Y, CX + BAR_W / 2 + 20, CEIL_Y);
  for (let x = CX - BAR_W / 2 - 12; x <= CX + BAR_W / 2 + 12; x += 16) {
    p.line(x, CEIL_Y, x - 8, CEIL_Y + 12);
  }
}

function drawBar(p, y, color) {
  p.noStroke();
  p.fill(color);
  p.rectMode(p.CENTER);
  p.rect(CX, y, BAR_W, BAR_H, 3);
}

// n evenly spaced strands between the fixed bar and the movable bar. The
// last one is the free end and gets its own colour and continues upward past
// the fixed bar rather than terminating there.
function drawStrands(p, n, movableY) {
  const spacing = BAR_W / (n + 1);
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(CX - BAR_W / 2 + spacing * (i + 1));

  p.strokeWeight(2);
  for (let i = 0; i < n - 1; i++) {
    p.stroke(COLOR.strand);
    p.line(xs[i], FIXED_Y + BAR_H / 2, xs[i], movableY - BAR_H / 2);
  }

  // the free end: from the movable bar, up past the fixed bar, then out to
  // the side where it is "pulled"
  const fx = xs[n - 1];
  p.stroke(COLOR.strandFree);
  p.line(fx, FIXED_Y + BAR_H / 2, fx, movableY - BAR_H / 2);
  p.line(fx, FIXED_Y - BAR_H / 2, fx, CEIL_Y + 6);
  p.line(fx, CEIL_Y + 6, FREE_END_X, CEIL_Y + 6);
  p.line(FREE_END_X, CEIL_Y + 6, FREE_END_X, HAND_Y);
}

function drawScene(p, sim) {
  const s = solve(sim._values);
  const playing = sim._values.playing;

  // Pausing stops time advancing but keeps the loop drawing, so the sliders
  // stay live while paused.
  if (playing) advance(sim._state, stepSeconds(p));
  const risenM = sim._state.pos;
  const movableY = LOW_Y - risenM * RISE_TRAVEL_PX;
  const ropePulledM = risenM * s.n;

  p.background(255);
  drawCeiling(p);
  drawBar(p, FIXED_Y, COLOR.bar);
  drawStrands(p, s.n, movableY);
  drawBar(p, movableY, COLOR.load);

  // the load, hanging below the movable bar
  const loadTop = movableY + BAR_H / 2 + LOAD_GAP;
  p.stroke(COLOR.muted);
  p.strokeWeight(1.5);
  p.line(CX, movableY + BAR_H / 2, CX, loadTop);
  p.noStroke();
  p.fill(COLOR.loadFill);
  p.stroke(COLOR.load);
  p.strokeWeight(2);
  p.rectMode(p.CENTER);
  p.rect(CX, loadTop + LOAD_H / 2, LOAD_W, LOAD_H, 5);

  // force arrows, same px-per-N scale on both so their lengths are directly
  // comparable — the whole visual argument lives in that comparison
  const loadCenter = { x: CX, y: loadTop + LOAD_H / 2 };
  const weightTip = { x: loadCenter.x, y: loadCenter.y + arrowLen(s.G) };
  drawArrow(p, loadCenter, weightTip, COLOR.weight, { weight: 3 });
  drawLabel(p, `G = ${s.G} N`, weightTip, COLOR.weight);

  const handOrigin = { x: FREE_END_X, y: HAND_Y };
  const forceTip = { x: FREE_END_X, y: HAND_Y + arrowLen(s.F) };
  drawArrow(p, handOrigin, forceTip, COLOR.force, { weight: 3 });
  drawLabel(p, `F = ${s.F.toFixed(1)} N`, forceTip, COLOR.force, { dx: 10, dy: 4 });

  // readouts
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(15);
  p.fill(COLOR.ink);
  p.text(`n = ${s.n}  strands`, 26, 14);
  p.fill(COLOR.force);
  p.text(`F = G / n = ${s.G} / ${s.n} = ${s.F.toFixed(1)} N`, 26, 36);

  p.fill(COLOR.muted);
  p.textSize(13);
  p.text(`load risen: ${risenM.toFixed(2)} m`, 26, H - 40);
  p.text(`rope pulled: ${ropePulledM.toFixed(2)} m`, 26, H - 22);
}

export default {
  id: "pulley",
  title: "The Pulley",
  thumbnail: "/assets/thumbs/pulley.svg",
  controls: [
    { id: "playing", label: "animation", type: "toggle", default: AUTOPLAY },
    { id: "count", label: "Number of pulleys", type: "range", min: 1, max: 6, step: 1, default: 3 },
    { id: "load", label: "Load (N)", type: "range", min: 20, max: 300, step: 10, default: 120 },
  ],
  init(canvasNode, controlValues) {
    this._values = controlValues;
    this._state = { pos: 0, hold: 0 };
    this._instance = new p5((p) => {
      p.setup = () => p.createCanvas(W, H);
      p.draw = () => drawScene(p, this);
    }, canvasNode);
  },
  update(controlValues) {
    // Deliberately leaves _state alone: changing the pulley count or the load
    // mid-rise keeps the load's current height instead of restarting it —
    // same rule as inclined-plane's mass slider.
    this._values = controlValues;
  },
  destroy() {
    this._instance?.remove();
    this._instance = null;
    this._values = null;
    this._state = { pos: 0, hold: 0 };
  },
};
