// sims/inclined-plane.js — Inclined Plane
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
import p5 from "p5";
import { drawArrow, drawLabel } from "./lib/draw.js";
import { stepSeconds, prefersReducedMotion } from "./lib/anim.js";

const W = 520;
const H = 440;
const G = 9.81;

const MARGIN_X = 60;
const GROUND_Y = 340;
const RAMP_LEN = 300; // constant hypotenuse: the ramp pivots rather than growing
const RAMP_METERS = 5; // what that hypotenuse is worth in metres
const START_FRAC = 0.88; // where the block is released, as a fraction up the ramp
const END_FRAC = 0.15; // stops short of the bottom so the weight arrow stays on-canvas
const TRAVEL_M = (START_FRAC - END_FRAC) * RAMP_METERS;
const BLOCK_W = 46;
const BLOCK_H = 30;
const PX_PER_N = 0.9; // arrow scale; 10 kg maxes out around 88 px
const HOLD_S = 0.8; // beat at the bottom before it resets

// Evaluated once at import. Anyone with the OS "reduce motion" setting gets
// the animation switched off to begin with; the toggle still lets them start
// it deliberately, and the force diagram is fully drawn either way.
const AUTOPLAY = !prefersReducedMotion();

const COLOR = {
  weight: "#4361ee",
  normal: "#2a9d8f",
  friction: "#e63946",
  component: "#9aa0a6",
  ramp: "#b8bcc4",
  rampFill: "#eef0f4",
  blockFill: "#dbe3ff",
  ink: "#1d1d1f",
  muted: "#6b6b70",
};

// Everything the drawing needs, derived from the slider values alone.
function solve({ angle, friction, mass }) {
  const theta = (angle * Math.PI) / 180;
  const weight = mass * G;
  const normal = weight * Math.cos(theta);
  const alongSlope = weight * Math.sin(theta); // gravity pulling it down the ramp
  const maxStatic = friction * normal;
  // Once gravity along the slope beats what friction can hold, it lets go.
  const sliding = alongSlope > maxStatic;
  return {
    theta,
    weight,
    normal,
    alongSlope,
    sliding,
    friction: sliding ? maxStatic : alongSlope,
    // Kinetic value only — meaningless at rest, where friction exactly
    // cancels gravity by definition. Callers must gate on `sliding`
    // themselves (advance()'s "already moving" branch is the one exception:
    // once in motion, kinetic friction applies regardless of what the
    // static-rest verdict would have said).
    kineticAccel: G * (Math.sin(theta) - friction * Math.cos(theta)),
  };
}

// One integration step. Kept separate so the physics can be exercised
// without a canvas.
export function advance(state, s, dt) {
  if (state.hold > 0) {
    state.hold = Math.max(0, state.hold - dt);
    if (state.hold === 0) {
      state.pos = 0;
      state.vel = 0;
    }
    return state;
  }
  if (state.vel > 0) {
    // Already moving: kinetic friction can out-pull gravity and bring it
    // to a stop part-way down, which is exactly what raising mu mid-slide
    // should look like.
    state.vel = Math.max(0, state.vel + s.kineticAccel * dt);
  } else if (s.sliding) {
    // At rest: static friction decides whether it lets go at all.
    state.vel = Math.max(0, s.kineticAccel * dt);
  }
  state.pos += state.vel * dt;
  if (state.pos >= TRAVEL_M) {
    state.pos = TRAVEL_M;
    state.vel = 0;
    state.hold = HOLD_S;
  }
  return state;
}

function drawScene(p, sim) {
  const values = sim._values;
  const { angle, friction: mu, mass, playing } = values;
  const s = solve(values);

  // Pausing stops time advancing but keeps the loop drawing, so the sliders
  // stay live while paused — freeze the block mid-slide, then change the
  // angle and watch the force vectors redraw around it.
  if (playing) advance(sim._state, s, stepSeconds(p));
  const frac = START_FRAC - sim._state.pos / RAMP_METERS;

  // Screen-space ramp geometry: A is the pivot, C the raised corner,
  // B the foot of the vertical drop from C.
  const up = { x: Math.cos(s.theta), y: -Math.sin(s.theta) }; // up the slope
  const out = { x: -Math.sin(s.theta), y: -Math.cos(s.theta) }; // off the surface
  const A = { x: MARGIN_X, y: GROUND_Y };
  const C = { x: A.x + RAMP_LEN * up.x, y: A.y + RAMP_LEN * up.y };
  const B = { x: C.x, y: GROUND_Y };

  p.background(255);

  // ground line
  p.stroke(COLOR.component);
  p.strokeWeight(1.5);
  p.line(20, GROUND_Y, W - 20, GROUND_Y);

  // ramp body
  p.stroke(COLOR.ramp);
  p.strokeWeight(2);
  p.fill(COLOR.rampFill);
  p.triangle(A.x, A.y, B.x, B.y, C.x, C.y);

  // angle arc at the pivot
  p.noFill();
  p.stroke(COLOR.muted);
  p.strokeWeight(1.5);
  p.arc(A.x, A.y, 90, 90, -s.theta, 0);
  drawLabel(p, `${angle}°`, { x: A.x + 50, y: A.y - 14 }, COLOR.muted, { dx: 0, dy: 0 });

  // release point, so the distance travelled is visible
  const startPt = {
    x: A.x + RAMP_LEN * START_FRAC * up.x,
    y: A.y + RAMP_LEN * START_FRAC * up.y,
  };
  p.stroke(COLOR.component);
  p.strokeWeight(1.5);
  p.line(startPt.x + out.x * 4, startPt.y + out.y * 4, startPt.x + out.x * 16, startPt.y + out.y * 16);

  // block, rotated to sit flat on the surface
  const contact = {
    x: A.x + RAMP_LEN * frac * up.x,
    y: A.y + RAMP_LEN * frac * up.y,
  };
  const center = {
    x: contact.x + out.x * (BLOCK_H / 2),
    y: contact.y + out.y * (BLOCK_H / 2),
  };
  p.push();
  p.translate(center.x, center.y);
  p.rotate(-s.theta);
  p.rectMode(p.CENTER);
  p.stroke(COLOR.weight);
  p.strokeWeight(2);
  p.fill(COLOR.blockFill);
  p.rect(0, 0, BLOCK_W, BLOCK_H, 4);
  p.pop();

  // --- force arrows, all anchored at the block's centre ---
  const tip = (dir, magnitude) => ({
    x: center.x + dir.x * magnitude * PX_PER_N,
    y: center.y + dir.y * magnitude * PX_PER_N,
  });

  // dashed decomposition of the weight, drawn under the real vectors
  const alongTip = tip({ x: -up.x, y: -up.y }, s.alongSlope);
  const perpTip = tip({ x: -out.x, y: -out.y }, s.normal);
  drawArrow(p, center, alongTip, COLOR.component, { dashed: true, weight: 1.5 });
  drawArrow(p, center, perpTip, COLOR.component, { dashed: true, weight: 1.5 });

  const weightTip = tip({ x: 0, y: 1 }, s.weight);
  const normalTip = tip(out, s.normal);
  const frictionTip = tip(up, s.friction);

  drawArrow(p, center, weightTip, COLOR.weight, { weight: 3 });
  drawArrow(p, center, normalTip, COLOR.normal);
  if (s.friction > 0.05) drawArrow(p, center, frictionTip, COLOR.friction);

  drawLabel(p, `mg = ${s.weight.toFixed(1)} N`, weightTip, COLOR.weight);
  drawLabel(p, `N = ${s.normal.toFixed(1)} N`, normalTip, COLOR.normal);
  if (s.friction > 0.05) {
    drawLabel(p, `f = ${s.friction.toFixed(1)} N`, frictionTip, COLOR.friction);
  }

  // --- readout, on its own panel so it stays legible over a steep ramp ---
  const moving = sim._state.vel > 0;
  p.push();
  p.noStroke();
  p.fill(255, 232);
  p.rect(12, 12, 208, 116, 6);

  p.textAlign(p.LEFT, p.TOP);
  p.fill(s.sliding ? COLOR.friction : COLOR.normal);
  p.textSize(15);
  p.text(s.sliding ? "Sliding" : "Static — friction holds it", 22, 22);

  p.fill(COLOR.ink);
  p.textSize(13);
  p.text(`a = ${(s.sliding ? s.kineticAccel : 0).toFixed(2)} m/s²`, 22, 46);
  p.text(`v = ${sim._state.vel.toFixed(2)} m/s`, 22, 64);
  p.text(`tan θ = ${Math.tan(s.theta).toFixed(2)}  vs  μ = ${mu.toFixed(2)}`, 22, 82);

  p.fill(COLOR.muted);
  p.textSize(11);
  p.text(
    moving ? `travelled ${sim._state.pos.toFixed(2)} m of ${TRAVEL_M.toFixed(2)}` : `m = ${mass.toFixed(1)} kg scales arrows only —`,
    22,
    104
  );
  p.text(moving ? `mass changes neither a nor the verdict` : `it cancels out of a and the slide test.`, 22, 116);
  p.pop();
}

export default {
  id: "inclined-plane",
  title: "Inclined Plane",
  thumbnail: "/assets/thumbs/inclined-plane.svg",
  controls: [
    { id: "playing", label: "animation", type: "toggle", default: AUTOPLAY },
    { id: "angle", label: "Incline angle (°)", type: "range", min: 0, max: 60, step: 1, default: 27 },
    { id: "friction", label: "Friction μ", type: "range", min: 0, max: 0.8, step: 0.02, default: 0.18 },
    { id: "mass", label: "Mass (kg)", type: "range", min: 1, max: 10, step: 0.5, default: 2 },
  ],
  init(canvasNode, controlValues) {
    this._values = controlValues;
    this._state = { pos: 0, vel: 0, hold: 0 };
    this._instance = new p5((p) => {
      p.setup = () => p.createCanvas(W, H);
      p.draw = () => drawScene(p, this);
    }, canvasNode);
  },
  update(controlValues) {
    // Deliberately leaves _state alone: the block keeps its momentum, so
    // steepening the ramp mid-slide speeds it up instead of restarting it.
    this._values = controlValues;
  },
  destroy() {
    this._instance?.remove();
    this._instance = null;
    this._values = null;
    this._state = { pos: 0, vel: 0, hold: 0 };
  },
};
