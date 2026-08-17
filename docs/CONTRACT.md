# Data contract — simulation module

Frozen after Week 1. `SimCard.jsx`, `ControlPanel.jsx`, and `SimPage.jsx` are
all generic against this shape. **If it needs to change, stop and confirm
before touching both sides** — see "Sim contract changes" in
`docs/CONVENTIONS.md` for why this matters more than it looks like it should.

```js
// sims/<id>.js  — plain JS, no JSX
export default {
  id: "vectors",
  title: "Vector Addition",
  thumbnail: "/assets/thumbs/vectors.png",
  controls: [
    // `step` is optional and defaults to 1 — omit it for whole-number controls.
    { id: "v1x", label: "Vector 1 X", type: "range", min: -10, max: 10, default: 3 },
    { id: "mu", label: "Friction μ", type: "range", min: 0, max: 0.8, step: 0.02, default: 0.18 },
    // type "toggle" is a boolean rendered as one button. Without `kind` it is
    // a playback control reading "Play <label>" / "Pause <label>"; animated
    // sims use it that way.
    { id: "playing", label: "animation", type: "toggle", default: true },
    // `kind: "switch"` marks an ordinary either/or setting instead, which
    // names the state it is in rather than saying "Play …". Additive and
    // backwards-compatible: a toggle with no `kind` behaves exactly as before.
    { id: "threeAngles", label: "three angles", type: "toggle", kind: "switch", default: false }
  ],
  init(canvasNode, controlValues) {},  // receives DOM node from ref
  update(controlValues) {},            // called on slider change
  destroy() {}                         // cleanup p5 instance on unmount
};
```

## Field notes

**There is no `unit` field** — put units in the `label` text ("Mass (kg)").

**`label` stays English** in the sim module — it's the math contributor's file
and the contract is frozen — but it is user-facing, so `ControlPanel` renders
a translation from `content.js` -> `controls.labels[simId][controlId]`
instead, falling back to the module's `label` when there is no entry. A newly
delivered sim therefore works immediately; add its labels to `content.js` to
localise it. A `kind: "switch"` toggle takes an object there instead of a
string — `{ on, off }`, one caption per state.

**A `range` control's value readout is an editable number field**, so a
student can drag for feel or type an exact value. That lives entirely in
`ControlPanel` — the contract above is unchanged, and every sim gets it for
free. A half-typed entry is held in local state and only pushed through once
it parses inside `min`/`max`, so clearing the box doesn't snap the value to
`min` mid-keystroke.

**`thumbnail` is vestigial.** No component reads it — cards render the inline
SVG figures from `pages/landingArt.jsx` instead (see `docs/CONVENTIONS.md`).
Left on the contract rather than breaking it; delete it only alongside a
deliberate contract revision.
