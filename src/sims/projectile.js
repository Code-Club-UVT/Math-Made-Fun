// sims/projectile.js — Projectile Motion
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
import p5 from "p5";
import { drawArrow, drawLabel, niceStep } from "./lib/draw.js";
import { stepSeconds, prefersReducedMotion } from "./lib/anim.js";

const W = 560;
const H = 360;
const G = 9.81;

const PAD = { left: 46, right: 20, top: 30, bottom: 40 };
const SAMPLES = 120;
const SPEED_MAX = 40; // must match the speed control's max below
const V_ARROW_PX = 70; // launch-arrow length at SPEED_MAX; world scale swings too far to use it
const V_ARROW_MAX = 120; // falling from height can still exceed SPEED_MAX — keep it on-canvas
const HOLD_S = 0.7; // beat between landing and the next launch
// Every flight takes the same time on screen, regardless of launch speed.
// Real-time (phase advancing at dt/flightTime) makes faster launches look
// SLOWER: range grows ~speed^2 but flight time only grows ~speed, and the
// view auto-fits to range, so on-screen crossing rate is roughly ~1/speed.
// The "flight X.XXs" readout stays physically accurate either way — it's
// computed from flightTime directly, not from playback pacing.
const PLAYBACK_S = 2.5;

// Evaluated once at import. Anyone with the OS "reduce motion" setting gets
// the animation switched off to begin with; the toggle still lets them start
// it deliberately, and the full predicted arc is drawn either way.
const AUTOPLAY = !prefersReducedMotion();

const COLOR = {
  arc: "#4361ee",
  ghost: "#c3cdf7",
  velocity: "#2a9d8f",
  marker: "#e63946",
  grid: "#eef0f4",
  axis: "#9aa0a6",
  ink: "#1d1d1f",
  muted: "#6b6b70",
};

// Closed-form trajectory, no drag. Flight time is the positive root of
// h0 + vy t - g t^2 / 2 = 0.
function solve({ speed, angle, height }) {
  const theta = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(theta);
  const vy = speed * Math.sin(theta);
  const flightTime = (vy + Math.sqrt(vy * vy + 2 * G * height)) / G;
  return {
    theta,
    vx,
    vy,
    flightTime,
    range: vx * flightTime,
    apexY: height + (vy * vy) / (2 * G),
    apexX: (vx * vy) / G,
  };
}

// Position at time t. The ball and the drawn arc both go through here, so
// they can't drift apart.
function pointAt(s, height, t) {
  return { x: s.vx * t, y: height + s.vy * t - 0.5 * G * t * t };
}

function drawScene(p, sim) {
  const values = sim._values;
  const { height, playing } = values;
  const s = solve(values);

  // --- advance the flight ---------------------------------------------
  // Phase is normalised (0..1) rather than an absolute clock: update() fires
  // continuously while a slider is dragged, and keeping the *fraction* means
  // the arc morphs underneath a ball that holds its relative position,
  // instead of snapping or freezing at the launch point.
  //
  // Pausing stops time advancing but keeps the loop drawing, so the sliders
  // stay live while paused — freeze the ball mid-flight, then drag the angle
  // and watch the arc morph underneath it.
  if (playing) {
    const dt = stepSeconds(p);
    if (sim._hold > 0) {
      sim._hold = Math.max(0, sim._hold - dt);
      if (sim._hold === 0) sim._phase = 0;
    } else {
      sim._phase += dt / PLAYBACK_S;
      if (sim._phase >= 1) {
        sim._phase = 1;
        sim._hold = HOLD_S;
      }
    }
  }
  const phase = Math.min(Math.max(sim._phase, 0), 1);
  const t = phase * s.flightTime;

  // Uniform scale on both axes — picking them independently would stretch
  // the parabola into the wrong shape as the sliders move.
  const worldW = Math.max(s.range * 1.08, 0.5);
  const worldH = Math.max(s.apexY * 1.15, 0.5);
  const usableW = W - PAD.left - PAD.right;
  const usableH = H - PAD.top - PAD.bottom;
  const scale = Math.min(usableW / worldW, usableH / worldH);

  const originX = PAD.left;
  const originY = H - PAD.bottom;
  const sx = (x) => originX + x * scale;
  const sy = (y) => originY - y * scale;

  p.background(255);

  // --- grid + axis ticks ---
  const stepX = niceStep(worldW, 6);
  const stepY = niceStep(worldH, 4);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (let x = 0; x <= worldW; x += stepX) {
    p.stroke(COLOR.grid);
    p.strokeWeight(1);
    p.line(sx(x), originY, sx(x), PAD.top);
    p.noStroke();
    p.fill(COLOR.muted);
    p.text(`${+x.toFixed(2)}`, sx(x), originY + 8);
  }
  p.textAlign(p.RIGHT, p.CENTER);
  for (let y = 0; y <= worldH; y += stepY) {
    p.stroke(COLOR.grid);
    p.strokeWeight(1);
    p.line(originX, sy(y), W - PAD.right, sy(y));
    p.noStroke();
    p.fill(COLOR.muted);
    p.text(`${+y.toFixed(2)}`, originX - 8, sy(y));
  }

  p.stroke(COLOR.axis);
  p.strokeWeight(1.5);
  p.line(originX, originY, W - PAD.right, originY); // ground
  p.line(originX, originY, originX, PAD.top); // height axis

  // launch stand, when firing from above ground level
  if (height > 0) {
    p.stroke(COLOR.muted);
    p.strokeWeight(4);
    p.line(sx(0), originY, sx(0), sy(height));
  }

  // --- predicted arc (faint), then the part already flown (solid) ---
  p.noFill();
  p.stroke(COLOR.ghost);
  p.strokeWeight(2);
  p.beginShape();
  for (let i = 0; i <= SAMPLES; i++) {
    const pt = pointAt(s, height, (i / SAMPLES) * s.flightTime);
    p.vertex(sx(pt.x), sy(pt.y));
  }
  p.endShape();

  p.stroke(COLOR.arc);
  p.strokeWeight(2.5);
  p.beginShape();
  for (let i = 0; i <= SAMPLES; i++) {
    const pt = pointAt(s, height, (i / SAMPLES) * t);
    p.vertex(sx(pt.x), sy(pt.y));
  }
  p.endShape();

  // --- apex + landing markers ---
  const apex = { x: sx(s.apexX), y: sy(s.apexY) };
  p.stroke(COLOR.marker);
  p.strokeWeight(1.2);
  p.drawingContext.setLineDash([5, 4]);
  p.line(apex.x, apex.y, apex.x, originY);
  p.drawingContext.setLineDash([]);
  p.noStroke();
  p.fill(COLOR.marker);
  p.circle(apex.x, apex.y, 8);
  p.circle(sx(s.range), originY, 8);
  drawLabel(p, `peak ${s.apexY.toFixed(1)} m`, apex, COLOR.marker);
  drawLabel(p, `${s.range.toFixed(1)} m`, { x: sx(s.range), y: originY }, COLOR.marker, {
    dx: -18,
    dy: -14,
  });

  // --- the ball, and its velocity tangent to the path ---
  const now = pointAt(s, height, t);
  const ball = { x: sx(now.x), y: sy(now.y) };
  const vyNow = s.vy - G * t;
  const vNow = Math.hypot(s.vx, vyNow);
  // Scaled against SPEED_MAX (not this launch's own speed) so the arrow
  // actually grows as the Launch speed slider is dragged, then capped.
  const arrowLen = Math.min((vNow / SPEED_MAX) * V_ARROW_PX, V_ARROW_MAX);
  const ux = s.vx / vNow;
  const uy = -vyNow / vNow;
  const tipV = { x: ball.x + ux * arrowLen, y: ball.y + uy * arrowLen };
  const tipX = { x: ball.x + ux * arrowLen, y: ball.y };
  const tipY = { x: ball.x, y: ball.y + uy * arrowLen };
  drawArrow(p, ball, tipX, COLOR.muted, { dashed: true, weight: 1.2 });
  drawArrow(p, ball, tipY, COLOR.muted, { dashed: true, weight: 1.2 });
  drawArrow(p, ball, tipV, COLOR.velocity, { weight: 3 });

  p.noStroke();
  p.fill(COLOR.arc);
  p.circle(ball.x, ball.y, 12);

  // --- readouts ---
  p.push();
  p.noStroke();
  p.textAlign(p.RIGHT, p.TOP);
  p.fill(COLOR.ink);
  p.textSize(13);
  p.text(`range  ${s.range.toFixed(1)} m`, W - PAD.right, 8);
  p.text(`peak  ${s.apexY.toFixed(1)} m`, W - PAD.right, 26);
  p.text(`flight  ${s.flightTime.toFixed(2)} s`, W - PAD.right, 44);

  p.textAlign(p.LEFT, p.TOP);
  p.fill(COLOR.velocity);
  p.text(`t = ${t.toFixed(2)} s`, PAD.left + 6, 8);
  p.textSize(11);
  p.fill(COLOR.muted);
  p.text(`y ${now.y.toFixed(1)} m   |v| ${vNow.toFixed(1)} m/s`, PAD.left + 6, 28);
  p.text(`vx ${s.vx.toFixed(1)} constant   vy ${vyNow.toFixed(1)}`, PAD.left + 6, 42);
  p.pop();
}

export default {
  id: "projectile",
  title: "Projectile Motion",
  thumbnail: "/assets/thumbs/projectile.svg",
  controls: [
    { id: "playing", label: "animation", type: "toggle", default: AUTOPLAY },
    { id: "speed", label: "Launch speed (m/s)", type: "range", min: 5, max: 40, step: 1, default: 22 },
    { id: "angle", label: "Launch angle (°)", type: "range", min: 5, max: 85, step: 1, default: 55 },
    { id: "height", label: "Launch height (m)", type: "range", min: 0, max: 20, step: 1, default: 0 },
  ],
  init(canvasNode, controlValues) {
    this._values = controlValues;
    this._phase = 0;
    this._hold = 0;
    this._instance = new p5((p) => {
      p.setup = () => p.createCanvas(W, H);
      p.draw = () => drawScene(p, this);
    }, canvasNode);
  },
  update(controlValues) {
    // Deliberately leaves _phase alone: resetting here would pin the ball at
    // the launch point for the whole of a slider drag.
    this._values = controlValues;
  },
  destroy() {
    this._instance?.remove();
    this._instance = null;
    this._values = null;
    this._phase = 0;
    this._hold = 0;
  },
};
