// sims/pendulum.js — The Pendulum
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
//
// Integrates the real equation, θ'' = -(g/L)·sin θ, not the small-angle
// version. That is deliberate: the card promises T = 2π√(L/g), and the gap
// between that promise and the measured swing IS the lesson. At 10° the two
// numbers agree to a hundredth of a second; at 80° the real pendulum is a
// tenth of a second per swing slower, and the readout says so.
//
// The integrator is semi-implicit (symplectic) Euler — ω is updated first,
// then θ moves with the NEW ω. Ordinary explicit Euler pumps energy into an
// oscillator, and unlike inclined-plane (which resets every four seconds)
// this sim runs for as long as the tab is open: the amplitude would visibly
// creep upward over a minute and quietly falsify the whole "amplitude barely
// matters" claim. Symplectic Euler has no such drift. See docs/CONVENTIONS.md.
//
// Nothing below reads `mass` except the arrow lengths and the bob's radius —
// it is absent from advance() by construction, which is the sim's punchline.
import p5 from "p5";
import { drawArrow, drawLabel } from "./lib/draw.js";
import { stepSeconds, prefersReducedMotion } from "./lib/anim.js";

const W = 560;
const H = 470;
const G = 9.81;

const deg2rad = (deg) => (deg * Math.PI) / 180;

// Slider bounds, named rather than left inline in `controls[]` because most
// of the layout below is tuned against them: PX_PER_M is sized so the longest
// rod plus its weight arrow clears the readout, TRACE_WINDOW_S so the widest
// period still fits twice on the strip, SUB_STEP against the shortest period,
// and TRACE_FULL_SCALE with headroom over the widest swing. Widening either
// range means re-checking all four.
const LENGTH_MIN = 0.4;
const LENGTH_MAX = 1.6;
const ANGLE_MAX = 80;

const CEIL_Y = 22;
const PIVOT = { x: W / 2, y: 28 };
// Drawn honestly to scale: length is the quantity the sim is about, so a
// 1.6 m pendulum has to *look* four times the 0.4 m one. That range gives
// periods of 1.27 s to 2.54 s — and 0.4 → 1.6 is exactly the ×4 length that
// doubles the period, which is why those are the endpoints.
const PX_PER_M = 100;
const CEIL_HALF_W = 44;
const READOUT_TOP = 238;

const PX_PER_N = 0.75;
// A 0.5 kg bob weighs 4.9 N, which would draw as a bare arrowhead. Floor it
// so it still reads as an arrow — same compromise, and same reasoning, as
// ARROW_MIN_PX in pulley.js.
const ARROW_MIN_PX = 12;
// Below this the restoring arrow is too short to mean anything, so it and its
// label both drop out — one constant so they can never disagree.
const RESTORE_MIN_N = 0.4;
const arrowLen = (n) => Math.max(ARROW_MIN_PX, n * PX_PER_N);

// θ(t) strip under the drawing.
const TRACE = { x1: 52, x2: W - 20, top: 300, bottom: 434, cy: 372, half: 50 };
const TRACE_W = TRACE.x2 - TRACE.x1;
const TRACE_WINDOW_S = 6; // visible history; > 2 full periods at any length
const TRACE_GRID_S = 1;
const TRACE_FULL_SCALE = Math.PI / 2; // ±90° spans the strip's half-height
const BRACKET_Y = 453; // the measured-period span, drawn below the strip

// Only ever the last two are read — one interval is one period.
const CROSSINGS_KEPT = 2;

// Physics substep. Frames can be up to MAX_STEP (50 ms) long, and at the
// short end of the length slider that is a big enough bite to shift the
// period by a few tenths of a percent — visible against the formula readout,
// and an integration artefact rather than the real large-angle effect the
// sim is trying to show. Substepping puts the error two orders down.
const SUB_STEP = 0.004;

const AUTOPLAY = !prefersReducedMotion();

const COLOR = {
  rod: "#1d1d1f",
  bob: "#6b6bff",
  bobFill: "#dbe3ff",
  weight: "#4361ee",
  restore: "#e63946",
  component: "#9aa0a6",
  guide: "#c9d2e0",
  trace: "#a86bff",
  ink: "#1d1d1f",
  muted: "#6b6b70",
};

// Everything the drawing needs, derived from the slider values alone.
function solve({ length, angle, mass }) {
  return {
    L: length,
    amp: deg2rad(angle),
    mass,
    weight: mass * G,
    period: 2 * Math.PI * Math.sqrt(length / G), // the small-angle formula
    rodPx: length * PX_PER_M,
  };
}

// The amplitude the current motion actually has, from its energy:
//   1 - cos A = (1 - cos θ) + ω²L / 2g
// Exact for the nonlinear pendulum, not a small-angle approximation.
// Exported for the same reason as advance(): so the swing can be measured
// without a canvas.
export function amplitudeOf(state, L) {
  const c = Math.cos(state.theta) - (state.omega * state.omega * L) / (2 * G);
  return Math.acos(Math.max(-1, Math.min(1, c)));
}

// Rebuild (θ, ω) so the swing has exactly amplitude `amp` at length `L`,
// keeping the phase it already had.
//
// This is what lets the length and start-angle sliders be live during a drag.
// `update()` fires on every frame of a drag, so it must never restart the
// motion (docs/CONVENTIONS.md), and the amplitude must not wander away from
// the number on the slider either — shortening the rod would otherwise hand
// the bob its old speed at a new length and swing it wider than the control
// claims. Scaling θ preserves the phase; solving ω from the energy equation
// pins the amplitude to the slider exactly.
export function retarget(state, prevL, L, amp) {
  const prev = amplitudeOf(state, prevL);
  if (!(prev > 1e-6)) {
    state.theta = amp;
    state.omega = 0;
    return state;
  }
  const dir = Math.sign(state.omega) || 1;
  state.theta = (state.theta / prev) * amp;
  const inside = ((2 * G) / L) * (Math.cos(state.theta) - Math.cos(amp));
  state.omega = dir * Math.sqrt(Math.max(0, inside));
  return state;
}

// The three forces the drawing names, at a given angle. Split out of the
// drawing for the same reason as advance(): these are the numbers actually
// printed on the canvas, so they should be checkable without rendering.
// `restoring` is signed — negative pulls back toward the low point — and the
// drawing takes the magnitude rather than the physics pre-flattening it.
export function forcesAt(s, theta) {
  return {
    weight: s.weight,
    alongRod: s.weight * Math.cos(theta), // the part the string cancels
    restoring: -s.weight * Math.sin(theta),
  };
}

// One integration step, substepped. Kept separate and exported so the
// physics can be exercised without a canvas, same as advance() in
// inclined-plane.js and pulley.js.
//
// Upward zero crossings are timestamped here rather than in the draw loop:
// the crossing is found between substeps and interpolated, so the measured
// period is accurate to well under a millisecond instead of to a frame.
export function advance(state, s, dt) {
  if (!(dt > 0)) return state;
  const n = Math.max(1, Math.ceil(dt / SUB_STEP));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    const before = state.theta;
    state.omega -= ((G / s.L) * Math.sin(state.theta)) * h;
    state.theta += state.omega * h;
    state.t += h;
    if (before < 0 && state.theta >= 0) {
      state.crossings.push(state.t - h + (-before / (state.theta - before)) * h);
      if (state.crossings.length > CROSSINGS_KEPT) state.crossings.shift();
    }
  }
  return state;
}

// The last complete swing as [from, to] seconds, or null before two upward
// crossings have been seen. Both the readout (which wants its duration) and
// the bracket (which wants its endpoints) work from this, so there is only
// one definition of "one period".
function lastSwing(state) {
  const c = state.crossings;
  return c.length >= 2 ? [c[c.length - 2], c[c.length - 1]] : null;
}

// Where the bob is and how big it is, for a given angle. Computed once per
// frame and shared by the drawing functions, so the rod geometry has exactly
// one definition.
function layout(s, theta) {
  const along = { x: Math.sin(theta), y: Math.cos(theta) }; // pivot -> bob
  return {
    along,
    bob: {
      x: PIVOT.x + along.x * s.rodPx,
      y: PIVOT.y + along.y * s.rodPx,
    },
    // Area tracks mass, so a 5 kg bob looks five times a 1 kg one rather than
    // five times as wide. Capped against the rod so a short pendulum with a
    // heavy bob doesn't swallow its own pivot.
    r: Math.min(7 + 6 * Math.sqrt(s.mass), s.rodPx * 0.4),
  };
}

function dashed(p, on) {
  p.drawingContext.setLineDash(on ? [5, 5] : []);
}

function drawCeiling(p) {
  p.stroke(COLOR.guide);
  p.strokeWeight(3);
  p.line(PIVOT.x - CEIL_HALF_W, CEIL_Y, PIVOT.x + CEIL_HALF_W, CEIL_Y);
  for (let x = PIVOT.x - CEIL_HALF_W + 6; x <= PIVOT.x + CEIL_HALF_W; x += 15) {
    p.line(x, CEIL_Y, x - 8, CEIL_Y + 12);
  }
}

// Equilibrium line, the arc the bob is confined to, and ticks at ±θ₀ — so
// the release angle stays visible on the drawing while the bob is elsewhere.
function drawGuides(p, s) {
  p.noFill();
  p.stroke(COLOR.guide);
  p.strokeWeight(1.5);
  dashed(p, true);
  p.line(PIVOT.x, PIVOT.y, PIVOT.x, PIVOT.y + s.rodPx + 34);
  // p5 measures angles from +x with y pointing down, so a rod leaning by θ
  // from the vertical sits at π/2 - θ.
  p.arc(PIVOT.x, PIVOT.y, s.rodPx * 2, s.rodPx * 2, Math.PI / 2 - s.amp, Math.PI / 2 + s.amp);
  dashed(p, false);

  p.stroke(COLOR.muted);
  for (const sign of [1, -1]) {
    const dir = { x: Math.sin(s.amp) * sign, y: Math.cos(s.amp) };
    p.line(
      PIVOT.x + dir.x * (s.rodPx - 7),
      PIVOT.y + dir.y * (s.rodPx - 7),
      PIVOT.x + dir.x * (s.rodPx + 9),
      PIVOT.y + dir.y * (s.rodPx + 9)
    );
  }
}

// Small arc at the pivot reading the live angle. No slider owns θ — the
// sliders own the amplitude — so animating it is fine.
function drawAngle(p, theta) {
  if (Math.abs(theta) < 0.05) return;
  p.noFill();
  p.stroke(COLOR.muted);
  p.strokeWeight(1.5);
  p.arc(PIVOT.x, PIVOT.y, 68, 68, Math.PI / 2 - Math.max(theta, 0), Math.PI / 2 - Math.min(theta, 0));

  const mid = theta / 2;
  p.textAlign(p.CENTER, p.CENTER);
  drawLabel(
    p,
    `${((theta * 180) / Math.PI).toFixed(0)}°`,
    { x: PIVOT.x + Math.sin(mid) * 48, y: PIVOT.y + Math.cos(mid) * 48 },
    COLOR.muted,
    { dx: 0, dy: 0 }
  );
}

function drawPendulum(p, { bob, r }) {
  p.stroke(COLOR.rod);
  p.strokeWeight(2.5);
  p.line(PIVOT.x, PIVOT.y, bob.x, bob.y);

  p.noStroke();
  p.fill(COLOR.muted);
  p.circle(PIVOT.x, PIVOT.y, 9);

  p.fill(COLOR.bobFill);
  p.stroke(COLOR.bob);
  p.strokeWeight(2.5);
  p.circle(bob.x, bob.y, r * 2);
}

// mg straight down, split into the part the rod cancels and the part that
// actually drives the swing. Same decomposition, same colours and the same
// dashed-component convention as inclined-plane, on purpose: the second sim
// should reuse the vocabulary the first one taught.
function drawForces(p, s, theta, { along, bob }) {
  const f = forcesAt(s, theta);
  const restoring = Math.abs(f.restoring);
  const showRestore = restoring > RESTORE_MIN_N;
  // Unit vector along the arc pointing back toward the lowest point. Zero at
  // the bottom of the swing, where there is no restoring force to draw.
  const sgn = Math.sign(theta);
  const towardLow = { x: -along.y * sgn, y: along.x * sgn };

  const tip = (dir, magnitude) => ({
    x: bob.x + dir.x * arrowLen(magnitude),
    y: bob.y + dir.y * arrowLen(magnitude),
  });

  const weightTip = tip({ x: 0, y: 1 }, f.weight);
  const restoreTip = tip(towardLow, restoring);

  drawArrow(p, bob, tip(along, f.alongRod), COLOR.component, { dashed: true, weight: 1.5 });
  drawArrow(p, bob, weightTip, COLOR.weight, { weight: 3 });
  if (showRestore) drawArrow(p, bob, restoreTip, COLOR.restore, { weight: 2.5 });

  // Labels flip to the inner side once the bob swings out far enough that a
  // left-aligned caption would run off the canvas.
  const left = bob.x > PIVOT.x;
  p.textAlign(left ? p.RIGHT : p.LEFT, p.BASELINE);
  const dx = left ? -8 : 8;
  drawLabel(p, `mg = ${f.weight.toFixed(1)} N`, weightTip, COLOR.weight, { dx, dy: 14 });
  if (showRestore) {
    drawLabel(p, `mg·sin θ = ${restoring.toFixed(1)} N`, restoreTip, COLOR.restore, { dx, dy: -6 });
  }
}

// Kept to short symbolic text per docs/CONVENTIONS.md — canvas copy is not
// translated, so the sentences explaining any of this belong in simTheory.js.
function drawReadout(p, s, swing) {
  const measured = swing && swing[1] - swing[0];
  const drift = measured ? (measured / s.period - 1) * 100 : 0;

  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);

  p.fill(COLOR.ink);
  p.textSize(15);
  p.text(`T = 2π√(L/g) = ${s.period.toFixed(2)} s`, TRACE.x1, READOUT_TOP);

  p.textSize(13);
  if (!measured) {
    p.fill(COLOR.muted);
    p.text("T measured = …", TRACE.x1, READOUT_TOP + 22);
  } else {
    // The formula is the small-angle one, so past ~20° the real swing is
    // measurably slower. Flagging that is the point, not an error.
    p.fill(Math.abs(drift) >= 1 ? COLOR.restore : COLOR.muted);
    p.text(
      `T measured = ${measured.toFixed(2)} s  (${drift >= 0 ? "+" : ""}${drift.toFixed(1)}%)`,
      TRACE.x1,
      READOUT_TOP + 22
    );
  }

  p.fill(COLOR.muted);
  p.text(`m = ${s.mass.toFixed(1)} kg · not in T`, TRACE.x1, READOUT_TOP + 42);
}

const traceX = (t, now) => TRACE.x1 + ((t - (now - TRACE_WINDOW_S)) / TRACE_WINDOW_S) * TRACE_W;
const traceY = (theta) => TRACE.cy - (theta / TRACE_FULL_SCALE) * TRACE.half;

// The θ(t) strip. This is what turns the period from a number into a length
// you can see: drag the length slider mid-swing and the wave visibly stretches
// inside one continuous trace, with the amplitude pinned by retarget().
function drawTrace(p, s, state, swing) {
  const now = state.t;

  p.noStroke();
  p.fill(250);
  p.rect(TRACE.x1 - 8, TRACE.top, TRACE_W + 16, TRACE.bottom - TRACE.top, 6);

  p.fill(COLOR.muted);
  p.textSize(13);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`θ(t) · last ${TRACE_WINDOW_S} s · grid ${TRACE_GRID_S} s`, TRACE.x1, TRACE.top + 6);

  // gridlines anchored to whole seconds, so they scroll with the wave
  p.stroke(COLOR.guide);
  p.strokeWeight(1);
  for (let t = Math.ceil(now - TRACE_WINDOW_S); t <= now; t += TRACE_GRID_S) {
    const x = traceX(t, now);
    p.line(x, TRACE.cy - TRACE.half, x, TRACE.cy + TRACE.half);
  }

  p.stroke(COLOR.component);
  p.strokeWeight(1.5);
  p.line(TRACE.x1, TRACE.cy, TRACE.x2, TRACE.cy);

  dashed(p, true);
  p.stroke(COLOR.guide);
  p.strokeWeight(1.5);
  p.line(TRACE.x1, traceY(s.amp), TRACE.x2, traceY(s.amp));
  p.line(TRACE.x1, traceY(-s.amp), TRACE.x2, traceY(-s.amp));
  dashed(p, false);

  p.noFill();
  p.stroke(COLOR.trace);
  p.strokeWeight(2.5);
  p.beginShape();
  for (const sample of state.samples) {
    p.vertex(traceX(sample.t, now), traceY(sample.theta));
  }
  p.endShape();

  drawBracket(p, swing, now);
}

// Spans the last full period on the strip's time axis — the same duration the
// readout gives as a number, drawn as a distance.
function drawBracket(p, swing, now) {
  if (!swing || swing[0] < now - TRACE_WINDOW_S) return;
  const x1 = traceX(swing[0], now);
  const x2 = traceX(swing[1], now);

  p.stroke(COLOR.trace);
  p.strokeWeight(1.5);
  p.line(x1, BRACKET_Y, x2, BRACKET_Y);
  p.line(x1, BRACKET_Y - 6, x1, BRACKET_Y + 4);
  p.line(x2, BRACKET_Y - 6, x2, BRACKET_Y + 4);

  p.textAlign(p.CENTER, p.BASELINE);
  drawLabel(p, `T = ${(swing[1] - swing[0]).toFixed(2)} s`, { x: (x1 + x2) / 2, y: BRACKET_Y - 10 }, COLOR.trace, {
    dx: 0,
    dy: 0,
  });
}

function drawScene(p, sim) {
  const s = solve(sim._values);
  const state = sim._state;

  // Pausing stops time advancing but keeps the loop drawing, so the sliders
  // stay live while paused — freeze the bob mid-swing, then change the mass
  // and watch only the arrows respond.
  //
  // `samples` is a display buffer and is filled here, while `crossings` is a
  // physics result and is filled in advance() — they look alike but belong to
  // different layers, and only one of them should exist headlessly.
  if (sim._values.playing) {
    advance(state, s, stepSeconds(p));
    state.samples.push({ t: state.t, theta: state.theta });
    while (state.samples.length && state.samples[0].t < state.t - TRACE_WINDOW_S) {
      state.samples.shift();
    }
  }

  const swing = lastSwing(state);
  const geom = layout(s, state.theta);

  p.background(255);
  drawCeiling(p);
  drawGuides(p, s);
  drawAngle(p, state.theta);
  drawPendulum(p, geom);
  drawForces(p, s, state.theta, geom);
  drawReadout(p, s, swing);
  drawTrace(p, s, state, swing);
}

const freshState = (values) => ({
  theta: deg2rad(values.angle), // released from rest at the extreme
  omega: 0,
  t: 0,
  crossings: [],
  samples: [],
});

export default {
  id: "pendulum",
  title: "The Pendulum",
  thumbnail: "/assets/thumbs/pendulum.svg",
  controls: [
    { id: "playing", label: "animation", type: "toggle", default: AUTOPLAY },
    { id: "length", label: "Length (m)", type: "range", min: LENGTH_MIN, max: LENGTH_MAX, step: 0.05, default: 1 },
    { id: "angle", label: "Start angle (°)", type: "range", min: 5, max: ANGLE_MAX, step: 1, default: 30 },
    { id: "mass", label: "Mass (kg)", type: "range", min: 0.5, max: 5, step: 0.5, default: 1 },
  ],
  init(canvasNode, controlValues) {
    this._values = controlValues;
    this._state = freshState(controlValues);
    this._instance = new p5((p) => {
      p.setup = () => p.createCanvas(W, H);
      p.draw = () => drawScene(p, this);
    }, canvasNode);
  },
  update(controlValues) {
    const prev = this._values;
    this._values = controlValues;
    // Never a reset — update() fires on every frame of a slider drag, and
    // restarting here would freeze the swing for the whole drag. retarget()
    // remaps the motion in place instead, so the bob keeps swinging while the
    // rod grows under it. Mass alone changes nothing: it isn't in the physics.
    if (prev.length !== controlValues.length || prev.angle !== controlValues.angle) {
      retarget(this._state, prev.length, controlValues.length, deg2rad(controlValues.angle));
    }
  },
  destroy() {
    this._instance?.remove();
    this._instance = null;
    this._values = null;
    this._state = null;
  },
};
