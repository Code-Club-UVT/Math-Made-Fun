// sims/vectors.js — Vector Addition
// Plain JS, no JSX. Exports the frozen contract from CLAUDE.md; p5 runs in
// instance mode so its canvas can be torn down cleanly on route change.
import p5 from "p5";
import { drawArrow, drawLabel } from "./lib/draw.js";

const SIZE = 480;
const SCALE = 9; // pixels per unit, keeps the max sum vector (20,20) on-canvas
const GRID_MAJOR = 5; // heavier grid line every 5 units

function toScreen(x, y) {
  return { x: SIZE / 2 + x * SCALE, y: SIZE / 2 - y * SCALE };
}

function drawGrid(p) {
  const maxUnits = Math.floor(SIZE / 2 / SCALE);
  p.strokeWeight(1);
  for (let u = -maxUnits; u <= maxUnits; u++) {
    p.stroke(u % GRID_MAJOR === 0 ? 210 : 236);
    const { x } = toScreen(u, 0);
    p.line(x, 0, x, SIZE);
    const { y } = toScreen(0, u);
    p.line(0, y, SIZE, y);
  }
  p.stroke(150);
  p.strokeWeight(1.5);
  p.line(0, SIZE / 2, SIZE, SIZE / 2);
  p.line(SIZE / 2, 0, SIZE / 2, SIZE);
}

function drawVectors(p, values) {
  p.background(255);
  drawGrid(p);

  const origin = toScreen(0, 0);
  const v1 = { x: values.v1x, y: values.v1y };
  const v2 = { x: values.v2x, y: values.v2y };
  const sum = { x: v1.x + v2.x, y: v1.y + v2.y };

  const v1End = toScreen(v1.x, v1.y);
  const v2End = toScreen(v2.x, v2.y);
  const sumEnd = toScreen(sum.x, sum.y);

  drawArrow(p, origin, v1End, "#4361ee");
  drawArrow(p, origin, v2End, "#e63946");
  // v2 walked tip-to-tail from the end of v1 — shows why the sum lands where it does
  drawArrow(p, v1End, sumEnd, "#e63946", { dashed: true, weight: 1.5 });
  drawArrow(p, origin, sumEnd, "#2a9d8f", { weight: 3 });

  drawLabel(p, `v1 (${v1.x}, ${v1.y})`, v1End, "#4361ee");
  drawLabel(p, `v2 (${v2.x}, ${v2.y})`, v2End, "#e63946");
  drawLabel(p, `v1+v2 (${sum.x}, ${sum.y})`, sumEnd, "#2a9d8f");
}

export default {
  id: "vectors",
  title: "Vector Addition",
  thumbnail: "/assets/thumbs/vectors.svg",
  controls: [
    { id: "v1x", label: "Vector 1 X", type: "range", min: -10, max: 10, default: 4 },
    { id: "v1y", label: "Vector 1 Y", type: "range", min: -10, max: 10, default: 3 },
    { id: "v2x", label: "Vector 2 X", type: "range", min: -10, max: 10, default: -2 },
    { id: "v2y", label: "Vector 2 Y", type: "range", min: -10, max: 10, default: 5 },
  ],
  init(canvasNode, controlValues) {
    this._values = controlValues;
    this._instance = new p5((p) => {
      p.setup = () => {
        p.createCanvas(SIZE, SIZE);
        p.noLoop();
      };
      p.draw = () => drawVectors(p, this._values);
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
