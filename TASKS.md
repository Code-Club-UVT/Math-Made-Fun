# Tasks — MathMadeFun (6 weeks)

CS column = Claude Code executes. Math column = tracked for sync awareness
only; don't generate sim internals, only integrate what's delivered.
One task at a time — stop and check off before moving on.

---

## Week 1 — Foundations
- [x] W1-1 (CS) Scaffold project: `npm create vite@latest` (React), install
      react-router-dom, react-katex, p5
- [x] W1-2 (CS) Folder structure per CLAUDE.md
- [x] W1-3 (CS) `SimsPage.jsx` shell — static card grid from hardcoded sim
      metadata array
- [x] W1-4 (CS) `SimCard.jsx` component
- [ ] SYNC freeze sim data contract with math student before Week 2

## Week 2 — Routing + Control Panel
- [x] W2-1 (CS) React Router v6 setup in `App.jsx`, all routes per CLAUDE.md
- [x] W2-2 (CS) `SimPage.jsx` — loads sim module via dynamic `import()` on
      `id` param, mounts canvas via ref, calls `sim.init`, calls `sim.destroy`
      on unmount
- [x] W2-3 (CS) `ControlPanel.jsx` — builds sliders from `controls` array,
      calls `sim.update(values)` on change
- [x] W2-4 (CS) Integrate `vectors` sim once math student delivers it —
      `src/sims/vectors.js` exists and loads via `/sims/vectors`
- [x] (Math) Build `vectors` — p5 instance mode, exports contract from CLAUDE.md
- [ ] (Math) Drop `public/assets/thumbs/vectors.png` — screenshot of the
      running sim at good default control values (see thumbnail workflow
      below); replaces the placeholder SVG, no code changes needed

## Week 3 — More Sims
- [ ] W3-1 (CS) Integrate `inclined-plane` and `projectile` as delivered
- [ ] (Math) Build `inclined-plane`, `projectile`
- [ ] (Math) Drop `inclined-plane.png` and `projectile.png` thumbnails in
      `public/assets/thumbs/`

## Week 4 — Unit Circle + Polish
- [ ] W4-1 (CS) Integrate `unit-circle` as delivered
- [ ] W4-2 (CS) Empty/error state UI for a bad `/sims/:id` (unknown sim id) —
      a plain text fallback already exists from W2-2; this is the polished
      version
- [ ] (Math) Build `unit-circle`
- [ ] (Math) Drop `unit-circle.png` thumbnail in `public/assets/thumbs/`

## Week 5 — Hardening + Backlog Sims
- [ ] W5-1 (CS) Responsive CSS pass, min width 768px, test all pages
- [ ] W5-2 (CS) Integrate 1–2 backlog sims math student delivers
- [ ] (Math) Pick + build 1–2 backlog sims, add tooltips, set good defaults,
      drop matching thumbnails in `public/assets/thumbs/`

## Thumbnail workflow (ongoing, owned by math student)
Each MVP/backlog sim currently has a placeholder SVG in
`public/assets/thumbs/<id>.svg` (generated, on-brand, clearly watermarked
"placeholder"). To replace one with real art:
1. Get the sim running well via `/sims/:id` with good default control values
   (the ones that make the visualization look its best at a glance).
2. Screenshot just the canvas — right-click → "Save image as" on the p5
   canvas, or crop a full-page screenshot. `p5.saveCanvas()` also works if
   called from the browser console while the sim is running.
3. Save it as `public/assets/thumbs/<id>.png`, 4:3 aspect ratio (matches
   `SimCard.module.css`'s `aspect-ratio: 4/3`), ~800×600 is plenty.
4. Update `SimsPage.jsx`'s `SIMS` array to point at `.png` instead of
   `.svg` for that id — the only code touch needed, and only because the
   file extension changes.
No new tooling required — this is just a file drop plus a one-line path
change, so it doesn't block on the CS side of the project.

## Week 6 — Bug Pass + Demo
- [ ] W6-1 (CS) Pair-test: each person walks through the other's work fresh,
      log all issues
- [ ] W6-2 (CS) Fix triaged bugs
- [ ] W6-3 (CS) README — `npm run dev`, sim catalog overview
- [ ] BOTH joint demo dry run
