# MathMadeFun — Project Context

Interactive physics/math learning platform. Students manipulate live
simulation cards (vectors, motion, waves, algebra, probability) via sliders;
values and graphs update in real time. Pure frontend — no accounts, no
backend, just a gallery of simulations for Romanian middle/high school.

## Stack (do not deviate without flagging it)
- Frontend: React + Vite (JSX, ES modules, no class components — hooks only)
- Simulations: p5.js, instance mode, mounted via useEffect + ref
- Math rendering: none. Formulas are plain Unicode (`R = v₀² · sin 2θ / g`).
  KaTeX + react-katex were installed but never imported, and are now removed
- Type: Archivo (display), IBM Plex Sans (body), IBM Plex Mono (all numbers) —
  Plex is deliberate, for correct Romanian comma-below ș/ț
- Design tokens (palette, grid pitch, type roles) live in `src/index.css` as
  CSS custom properties; `--vector` is the only accent the UI chrome may use
- No backend — sim metadata is a static array, no persistence except a
  language preference in `localStorage`
- Styling: plain CSS modules per component (no Tailwind, no styled-components)
- No hosting yet — local dev only (`npm run dev`)

## Hard rules
- `src/sims/*` internals belong to the math contributor. Only touch the
  exported contract — see `docs/CONTRACT.md` — never the math/logic inside.
- No new dependencies without flagging it first.
- Hooks only — no class components.
- p5 sketches must use instance mode (not global) to avoid canvas conflicts
  when navigating between sims.
- Sim contract changes mid-project break both sides simultaneously — treat
  it as frozen. Stop and confirm before touching both sides of it.

## Where the rest of the documentation lives
This file only holds what's relevant to nearly every task. For anything more
specific:

| Doc | Read it when… |
|---|---|
| `docs/STRUCTURE.md` | you need the file tree / where something lives |
| `docs/CONTRACT.md` | touching a sim's `controls[]`, adding a control type, or anything about what a `src/sims/*.js` module exports |
| `docs/CONVENTIONS.md` | routing, animation rules, i18n, the sim catalogue/theory data shape, canvas responsiveness, or "why is this built this way" |
| `TASKS.md` | what's done, what's open, who owns it next |
| `HANDOFF.md` | onboarding — the fuller narrative for someone picking up the project cold |
