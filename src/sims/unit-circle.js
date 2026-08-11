// sims/unit-circle.js — Unit Circle
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
//
// Stays on noLoop() deliberately. θ is the slider, so a self-advancing θ would
// leave ControlPanel showing a stale number beside a moving drawing — the
// contract pushes values down but has no channel to report them back up.
// See the convention note in CLAUDE.md.
import p5 from "p5";

const W = 560;
const H = 320;

// Left panel: the circle. R doubles as the wave's amplitude on the right, so a
// height measured on the circle lands at exactly the same pixel height on the
// wave — that visual equality is the whole point of the drawing.
//
// CX and R are tuned, not chosen freely. The "sin θ" caption sits outside the
// vertical leg, so on the circle's left half it needs ~44px of clear margin;
// on the right half it must still stop short of the wave's "1"/"−1" labels.
// Widening R or shifting CX either way breaks one end or the other.
const CX = 126;
const CY = 168;
const R = 74;

// Right panel: one full turn unrolled left to right.
const WAVE_X0 = 280;
const WAVE_X1 = 548;
const WAVE_W = WAVE_X1 - WAVE_X0;
const WAVE_SAMPLES = 180;

const LEG_LABEL_MIN = 26; // hide a leg's caption once it's too short to sit on

const COLOR = {
  radius: "#4361ee",
  cos: "#e63946",
  sin: "#2a9d8f",
  ghost: "#cfe6e2",
  circle: "#c9d2e0",
  axis: "#9aa0a6",
  grid: "#eef0f4",
  ink: "#1d1d1f",
  muted: "#6b6b70",
};

function solve(angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  return { theta, cos: Math.cos(theta), sin: Math.sin(theta) };
}

// Two decimals, with negative zero folded away: cos(270°) lands on -1.8e-16,
// which would otherwise print as "-0.00" and read as a mistake.
function fmt(value) {
  return (Math.abs(value) < 0.005 ? 0 : value).toFixed(2);
}

// Screen position of the point at angle θ. Screen y grows downward, so the
// sine term is subtracted rather than added.
function pointOnCircle(s) {
  return { x: CX + R * s.cos, y: CY - R * s.sin };
}

function drawCirclePanel(p, s, P, angle) {
  // axes through the centre, running a little past the circle
  const reach = R + 18;
  p.stroke(COLOR.axis);
  p.strokeWeight(1);
  p.line(CX - reach, CY, CX + reach, CY);
  p.line(CX, CY - reach, CX, CY + reach);

  p.noFill();
  p.stroke(COLOR.circle);
  p.strokeWeight(2);
  p.circle(CX, CY, R * 2);

  // swept angle, counter-clockwise from the positive x-axis. Skipped near
  // zero, where p5 would read start === stop as a whole revolution.
  if (angle > 0.5) {
    p.stroke(COLOR.muted);
    p.strokeWeight(1.5);
    p.arc(CX, CY, 52, 52, -s.theta, 0);
  }

  // --- the right triangle: cos along the bottom, sin standing up ---
  p.strokeWeight(3);
  p.stroke(COLOR.cos);
  p.line(CX, CY, P.x, CY);
  p.stroke(COLOR.sin);
  p.line(P.x, CY, P.x, P.y);

  // right-angle marker in the corner where the two legs meet
  const legX = Math.abs(P.x - CX);
  const legY = Math.abs(P.y - CY);
  if (legX > 14 && legY > 14) {
    const dirH = P.x > CX ? -1 : 1;
    const dirV = P.y > CY ? -1 : 1;
    const m = 9;
    p.stroke(COLOR.muted);
    p.strokeWeight(1);
    p.line(P.x + dirH * m, CY, P.x + dirH * m, CY + dirV * m);
    p.line(P.x, CY + dirV * m, P.x + dirH * m, CY + dirV * m);
  }

  // the radius — the hypotenuse, always exactly 1
  p.stroke(COLOR.radius);
  p.strokeWeight(2.5);
  p.line(CX, CY, P.x, P.y);
  p.noStroke();
  p.fill(COLOR.radius);
  p.circle(P.x, P.y, 11);

  // --- captions ---
  p.textSize(13);
  p.noStroke();

  if (angle > 8) {
    p.fill(COLOR.muted);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("θ", CX + 31, CY - 13);
  }

  if (legX >= LEG_LABEL_MIN) {
    p.fill(COLOR.cos);
    p.textAlign(p.CENTER, p.TOP);
    p.text("cos θ", (CX + P.x) / 2, CY + 6);
  }
  if (legY >= LEG_LABEL_MIN) {
    p.fill(COLOR.sin);
    p.textAlign(P.x > CX ? p.LEFT : p.RIGHT, p.CENTER);
    p.text("sin θ", P.x + (P.x > CX ? 8 : -8), (CY + P.y) / 2);
  }

  // Just the point's name here — its coordinates are spelled out in the
  // readout instead, where they can't collide with the wave panel. Pushed
  // radially outward so it never lands on the triangle.
  p.fill(COLOR.radius);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("P", P.x + 14 * s.cos, P.y - 14 * s.sin);
}

function drawWavePanel(p, s, angle, P) {
  const waveX = WAVE_X0 + (angle / 360) * WAVE_W;

  p.stroke(COLOR.grid);
  p.strokeWeight(1);
  for (let a = 90; a < 360; a += 90) {
    const x = WAVE_X0 + (a / 360) * WAVE_W;
    p.line(x, CY - R, x, CY + R);
  }

  p.stroke(COLOR.axis);
  p.strokeWeight(1);
  p.line(WAVE_X0, CY, WAVE_X1, CY);
  p.line(WAVE_X0, CY - R, WAVE_X0, CY + R);

  // full turn faint, then the part already swept solid — the same
  // ghost/traced treatment the projectile sim uses for its arc
  const curve = (toAngle, color, weight) => {
    p.noFill();
    p.stroke(color);
    p.strokeWeight(weight);
    p.beginShape();
    for (let i = 0; i <= WAVE_SAMPLES; i++) {
      const a = (i / WAVE_SAMPLES) * toAngle;
      p.vertex(
        WAVE_X0 + (a / 360) * WAVE_W,
        CY - R * Math.sin((a * Math.PI) / 180)
      );
    }
    p.endShape();
  };
  curve(360, COLOR.ghost, 2);
  if (angle > 0) curve(angle, COLOR.sin, 2.5);

  // the carry-across: the point's height on the circle IS its height here
  p.stroke(COLOR.sin);
  p.strokeWeight(1.2);
  p.drawingContext.setLineDash([5, 4]);
  p.line(P.x, P.y, waveX, P.y);
  p.drawingContext.setLineDash([]);

  p.noStroke();
  p.fill(COLOR.sin);
  p.circle(waveX, CY - R * s.sin, 9);

  // --- axis captions ---
  p.textSize(13);
  p.fill(COLOR.sin);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text("sin θ", WAVE_X0 + 6, CY - R - 4);

  p.fill(COLOR.muted);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text("1", WAVE_X0 - 6, CY - R);
  p.text("0", WAVE_X0 - 6, CY);
  p.text("−1", WAVE_X0 - 6, CY + R);

  p.textAlign(p.CENTER, p.TOP);
  for (let a = 0; a <= 360; a += 90) {
    p.text(`${a}°`, WAVE_X0 + (a / 360) * WAVE_W, CY + R + 9);
  }
}

function drawReadouts(p, s, angle) {
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);

  p.textSize(15);
  p.fill(COLOR.radius);
  p.text(`θ = ${angle}°`, 26, 12);
  p.fill(COLOR.sin);
  p.text(`sin θ = ${fmt(s.sin)}`, 126, 12);
  p.fill(COLOR.cos);
  p.text(`cos θ = ${fmt(s.cos)}`, 268, 12);

  p.textSize(13);
  p.fill(COLOR.ink);
  p.text(`P = (${fmt(s.cos)}, ${fmt(s.sin)})`, 26, 38);

  // Pythagoras on the triangle, parked in the free space under the circle.
  p.fill(COLOR.muted);
  p.text(
    `cos²θ + sin²θ = ${fmt(s.cos * s.cos + s.sin * s.sin)}`,
    26,
    H - 34
  );
}

function drawScene(p, sim) {
  const angle = sim._values.angle;
  const s = solve(angle);
  const P = pointOnCircle(s);

  p.background(255);
  drawReadouts(p, s, angle);
  drawWavePanel(p, s, angle, P);
  drawCirclePanel(p, s, P, angle);
}

export default {
  id: "unit-circle",
  title: "Unit Circle",
  thumbnail: "/assets/thumbs/unit-circle.svg",
  controls: [
    { id: "angle", label: "Angle θ (°)", type: "range", min: 0, max: 360, step: 1, default: 45 },
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
