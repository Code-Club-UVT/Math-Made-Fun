# Tasks — MathMadeFun

**Who does what.** CS builds everything outside `src/sims/`. Math owns the sim
modules themselves. The four sims marked *(CS-built)* below are a deliberate
exception, made at the project owner's request.

**Where the reasoning lives.** Conventions and contract rules are in
`CLAUDE.md`; each sim's own design decisions are in its file header. This file
is only the checklist.

---

## Open now

### Blocking the demo
- [ ] **Look at the whole app in a browser** at 1280 / 768 / 390 px. Everything
      below is verified by lint, build, numeric checks and route smoke tests —
      but nothing has actually been *seen*. This is the biggest single gap.
- [ ] W5-1 Responsive pass. Breakpoints are written (880/768/560 Landing,
      860/768/560 SimPage, 768/560 SimsPage; ControlPanel reflows at 860).
      Only the browser check is left.
- [ ] W6-1 Pair-test: each person walks the other's work fresh, log issues
- [ ] W6-2 Fix triaged bugs
- [ ] W6-3 README — `npm run dev`, catalogue overview
- [ ] BOTH — joint demo dry run

### Needs the math contributor
- [ ] Review the five CS-built sims: `unit-circle`, `triangle-angles`,
      `adjacent-angles`, `pulley`, `pendulum`. Geometry and kinematics are
      verified numerically; the *teaching* is what needs your eye. Change or
      replace them freely.
- [ ] Review all eight theory entries in `simTheory.js` for accuracy and approach
- [ ] Confirm no PNG thumbnail work is in flight, so `public/assets/thumbs/`
      can be deleted (nothing reads it — the gallery uses inline SVG)

### Follow-ups
- [x] Reconcile the two backlog lists — the `example` scratch file (geometry
      ideas, scripete, pendul) vs the older one in `CLAUDE.md`
- [ ] Build emits a 1.17 MB chunk; p5 is not split per sim
- [x] KaTeX + react-katex removed. Nothing ever imported them, so this freed
      node_modules weight and **zero** bundle bytes — the old "~265 kB" note
      implied a shipping cost that never existed.
- [ ] `adjacent-angles` renders an inert `angleAOD` slider in 2-angle mode.
      Hiding it properly needs the sim to tell `ControlPanel` which controls are
      live, i.e. state flowing upward — a real contract change, not a tweak.

---

## Done

### Weeks 1–2 — Foundations, routing, controls
- [x] Vite + React scaffold, folder structure per `CLAUDE.md`
- [x] Routes `/`, `/sims`, `/sims/:id` (React Router v7, not the v6 planned)
- [x] `SimPage` — loads sims via `import.meta.glob`, mounts canvas, handles
      loading and error states
- [x] `ControlPanel` — builds controls from each sim's `controls[]`
- [x] `SimCard`, gallery grid
- [x] *(Math)* `vectors`

### Week 3 — More sims
- [x] *(Math)* `inclined-plane`, `projectile`; added optional `step` to the
      controls contract

### Week 4 — Unit circle, polish, explanations
- [x] *(CS-built)* `unit-circle`
- [x] Polished error state for an unknown `/sims/:id`
- [x] W4-3 `ToggleControl` supports `kind: "switch"` for non-playback booleans,
      captions from an `{ on, off }` entry in `content.js`. Additive — toggles
      without `kind` keep Play/Pause.
- [x] W4-4/5 `simTheory.js` + entries for every built sim, bilingual,
      6 blocks + 4 "try this" steps each. Every numeric claim checked against
      the sims' own maths.

### Redesign pass (unplanned)
- [x] Visual system rebuilt on design tokens in `src/index.css`
- [x] `simCatalog.js`, `content.js`, `simTheory.js`, `simArt.js` — single
      sources for data that had been duplicated across pages
- [x] Language toggle works on every page, persisted to `localStorage`
- [x] `SiteHeader` shared across all three pages
- [x] Control panel labels translated without touching `src/sims/*`
- [x] Fixed: p5 sets canvas size inline, so the responsive CSS never applied —
      canvases overflowed on mobile and the hero demo was cropped
- [x] Fixed: unready cards linked to sims that don't exist
- [x] Fixed: language button's `aria-label` hid its visible text (WCAG 2.5.3)

### Categories + new sims
- [x] Subject categories per sim; `/sims` filters with counted chips. Chips
      rather than sections because a sim can be in both — `vectors` is.
- [x] Cards show `Subject · Topic`, plus the governing formula
- [x] `pulley` and `pendulum` added as `ready: false` cards — visible with an
      "în lucru" badge, not clickable
- [x] *(CS-built)* `triangle-angles`, `adjacent-angles`
- [x] Every `range` control's value readout is now an editable number field —
      drag or type. No contract change; all sims gained it.
- [x] *(CS-built)* `pendulum` — `length` (0.4–1.6 m), `angle` (5–80°), `mass`
      (0.5–5 kg). Integrates the true θ'' = −(g/L)·sin θ rather than the
      small-angle form, and shows the measured period beside the formula's, so
      the formula is seen being excellent at 10° and 14% wrong at 80°. A θ(t)
      strip under the drawing turns the period into a visible length. The
      integrator is symplectic — this is the first sim that runs indefinitely
      instead of resetting, so energy drift would have been cumulative; see
      `docs/CONVENTIONS.md`. Period vs the exact elliptic-integral solution,
      mass independence, 400 s stability and every drawn bound verified
      numerically across the full length × angle × mass range before wiring up.
- [x] *(CS-built)* `pulley` — `count` (1–6 rope strands) and `load` (20–300 N),
      `F = G / count`. Animated: fixed load-rise duration (4s) regardless of
      count, so rope visibly pays out faster at higher counts — the trade-off
      is watched, not just read off a formula. Kinematic, not force-integrated,
      so it can't destabilise the way an accelerating body could. Kinematics
      and every arrow's on-canvas bounds verified numerically across the full
      count × load range before wiring up.

---

## House rules for any new sim

Every sim in the catalogue is now built; these are the constraints the last
few were held to, kept for whoever adds the next one.

Animated sims follow the animated-sim rules in `docs/CONVENTIONS.md`: advance
time with `stepSeconds`, expose a `playing` toggle defaulting to
`!prefersReducedMotion()`, never reset animation state from `update()`, and
use a symplectic integrator if the sim runs indefinitely rather than resetting.

Canvas ≤ 560 px wide, no text under 13 px (canvases scale down on phones), and
canvas copy stays short and symbolic — the sentences belong in `simTheory.js`,
which is the only layer that gets translated. No PNG thumbnail; add an inline
SVG figure to `pages/landingArt.jsx` and an entry in `pages/simArt.js`.
