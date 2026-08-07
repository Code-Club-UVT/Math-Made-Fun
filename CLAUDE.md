# MathMadeFun — Project Context

Interactive physics/math learning platform. Students manipulate live
simulation cards (vectors, motion, waves, algebra, probability) via sliders;
values and graphs update in real time. Pure frontend — no accounts, no
backend, just a gallery of simulations for Romanian middle/high school.

## Stack (do not deviate without flagging it)
- Frontend: React + Vite (JSX, ES modules, no class components — hooks only)
- Simulations: p5.js, instance mode, mounted via useEffect + ref
- Math rendering: KaTeX (react-katex wrapper)
- No backend — sim metadata is a static array, no persistence, no accounts
- Styling: plain CSS modules per component (no Tailwind, no styled-components)
- No hosting yet — local dev only (`npm run dev`)

## Structure
```
mathmadefun/
├── src/
│   ├── main.jsx                       (Vite entry)
│   ├── App.jsx                        (router root)
│   ├── components/
│   │   ├── SimCard.jsx
│   │   └── ControlPanel.jsx           (generic slider builder)
│   ├── pages/
│   │   ├── Landing.jsx                 (marketing/home page)
│   │   ├── SimsPage.jsx                 (sim gallery grid, /sims)
│   │   └── SimPage.jsx                  (individual sim, /sims/:id)
│   └── sims/                          ← math student owns these
│       ├── lib/draw.js                 (shared p5 drawing helpers)
│       ├── vectors.js
│       ├── inclined-plane.js
│       ├── projectile.js
│       └── unit-circle.js
├── public/assets/thumbs/
├── index.html
├── vite.config.js
└── package.json
```

## Hard rules
- `src/sims/*` internals belong to the math contributor. Only touch the
  exported contract (below), never the math/logic inside.
- No new dependencies without flagging it first.
- Hooks only — no class components.
- p5 sketches must use instance mode (not global) to avoid canvas conflicts
  when navigating between sims.

## Data contract — simulation module (frozen after Week 1)
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
    // type "toggle" is a boolean, rendered as one button reading
    // "Play <label>" / "Pause <label>". Animated sims use it for playback.
    { id: "playing", label: "animation", type: "toggle", default: true }
  ],
  init(canvasNode, controlValues) {},  // receives DOM node from ref
  update(controlValues) {},            // called on slider change
  destroy() {}                         // cleanup p5 instance on unmount
};
```
`SimCard.jsx`, `ControlPanel.jsx`, and `SimPage.jsx` are generic against this
shape. If it needs to change, stop and confirm before touching both sides.

There is no `unit` field — put units in the `label` text ("Mass (kg)").

## Routing
React Router v6. Routes:
- `/` — Landing page (marketing/home, no auth)
- `/sims` — sim gallery (collection)
- `/sims/:id` — individual simulation (member of the collection above)

`/sims` and `/sims/:id` are flat sibling routes, not nested React Router
routes with `<Outlet/>` — the two pages share no persistent UI, so there's
nothing for a shared layout to buy. The URL hierarchy alone reflects the
collection/member relationship. Keep this pairing (plural collection root +
`/:id` member) if new top-level resources are ever added.

## Simulation catalog
MVP (Weeks 2–4, in this order):
1. `vectors` — Vector Addition
2. `inclined-plane` — Inclined Plane
3. `projectile` — Projectile Motion
4. `unit-circle` — Unit Circle

Backlog (Week 5+, math student picks):
5. `function-grapher`
6. `pendulum`
7. `spring-mass`
8. `function-transform`
9. `quadratic-roots`
10. `derivative-slope`
11. `wave-interference`
12. `probability-dist`
13. `circular-motion`
14. `lever-torque`
15. `linear-systems`

## Conventions
- camelCase JS, PascalCase components, kebab-case filenames under `/sims`
- One sim = one file in `/sims`, id matches catalog above
- Sims may animate by leaving p5's draw loop running (`inclined-plane`,
  `projectile`); ones with no time dimension stay on `noLoop()` (`vectors`).
  Animating sims must: advance physics with `stepSeconds(p)` from
  `/sims/lib/anim.js` rather than raw `deltaTime`, keep animation state on
  the module and clear it in `destroy()`, expose a `toggle` control for
  playback whose `default` is `!prefersReducedMotion()`, and **never reset
  that state from `update()`** — `update()` fires continuously while a
  slider is dragged, so resetting there freezes the animation for the whole
  drag.
- Pausing gates *time advancing*, not drawing — the loop keeps running so
  sliders stay live while paused. Don't "optimise" this into `noLoop()`;
  that would freeze the canvas against slider input too.
- Shared drawing helpers live in `/sims/lib/` — nested on purpose, since
  `SimPage.jsx` globs `../sims/*.js` with a single-segment wildcard that
  never descends into subfolders. Never put a non-sim `.js` file directly
  in `/sims`; it would be loaded as if it were a simulation.
- No inline styles; use CSS modules
- Sim metadata (id, title, thumbnail) lives as a static array in SimsPage.jsx

## Known risk areas
1. p5 instance cleanup — always call `destroy()` in useEffect return to
   prevent multiple sketches stacking on route change.
2. Sim contract changes mid-project break both sides simultaneously — freeze it.
3. Animated sims must clamp their frame delta. requestAnimationFrame stops
   firing in a hidden tab, so the first frame back reports the entire time
   away; unclamped that single step teleports the simulation. `stepSeconds()`
   caps it — don't bypass it.
