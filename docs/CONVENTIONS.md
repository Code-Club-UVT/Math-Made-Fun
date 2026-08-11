# Conventions

Decision log. If you're wondering *why* something is built a particular way
rather than the obvious simpler way, it's probably here.

## Naming
camelCase JS, PascalCase components, kebab-case filenames under `/sims`. One
sim = one file in `/sims`, id matches the filename.

## Routing
React Router v7 (`react-router-dom` ^7). Routes:
- `/` — Landing page (marketing/home, no auth)
- `/sims` — sim gallery (collection)
- `/sims/:id` — individual simulation (member of the collection above)

`/sims` and `/sims/:id` are flat sibling routes, not nested React Router
routes with `<Outlet/>` — the two pages share no persistent UI, so there's
nothing for a shared layout to buy. The URL hierarchy alone reflects the
collection/member relationship. Keep this pairing (plural collection root +
`/:id` member) if new top-level resources are ever added.

All three pages render `<SiteHeader />` themselves. It is a plain shared
component, NOT a React Router layout route — the flat-sibling decision above
still holds. Its `links` prop is the page-specific nav slot; the sim pages
pass nothing and rely on their own breadcrumb.

## Animation
Sims may animate by leaving p5's draw loop running (`inclined-plane`,
`projectile`, `pulley`, `pendulum`); ones with no time dimension stay on
`noLoop()` (`vectors`, `unit-circle`, `triangle-angles`, `adjacent-angles`).

`pulley` is a useful edge case: it animates, but it is purely kinematic — the
rope and the load are rigidly linked by the pulley count, with no force being
integrated — so unlike a body under gravity, there is no accelerating state
that could diverge or overshoot. Worth remembering if a future sim has the
same shape (a fixed ratio driving two moving quantities, no dynamics): it is
safe to animate even though nothing is being solved frame to frame.

**A sim must never animate a quantity that a slider also owns.** The contract
is one-way: `init`/`update` push values down, and nothing reports back up, so
a self-advancing control would leave `ControlPanel` displaying a stale number
beside a moving drawing. This is why `unit-circle` sweeps θ by drag only.
Autoplaying it would need a deliberate contract change (an `onChange` passed
into `init`) affecting every sim — raise it, don't smuggle it in.

Animating sims must:
- advance physics with `stepSeconds(p)` from `/sims/lib/anim.js` rather than
  raw `deltaTime` — `requestAnimationFrame` stops firing in a hidden tab, so
  the first frame back reports the entire time away; unclamped, that single
  step teleports the simulation. `stepSeconds()` caps it — don't bypass it.
- keep animation state on the module and clear it in `destroy()`
- expose a `toggle` control for playback whose `default` is
  `!prefersReducedMotion()`
- **never reset that state from `update()`** — `update()` fires continuously
  while a slider is dragged, so resetting there freezes the animation for the
  whole drag

A sim that never resets needs a *symplectic* integrator, not just a clamped
step. `inclined-plane` and `pulley` run for a few seconds and start over, so
a little energy error never accumulates anywhere visible. `pendulum` swings
for as long as the tab is open, and plain explicit Euler pumps energy into an
oscillator: its amplitude would creep upward over a minute or two and quietly
falsify the very claim the sim exists to make. Updating the velocity first and
moving with the *new* velocity — one line's difference — has no such drift.
Verified: over 400 s at the maximum frame step, `pendulum`'s period readout is
unchanged to four decimals.

When a slider owns a quantity the animation also carries — `pendulum`'s
amplitude is both the "start angle" control and a property of the live motion
— remap the state in place rather than restarting it. `pendulum.retarget()`
rescales θ and re-solves ω from the energy equation, which pins the amplitude
to the slider exactly while preserving the phase, so the bob keeps swinging
through the whole drag. This is not the same thing as the rule above about
animating a quantity a slider owns: the slider owns the *amplitude*, the
animation owns the *live angle*, and nothing has to report back upward.

Pausing gates *time advancing*, not drawing — the loop keeps running so
sliders stay live while paused. Don't "optimise" this into `noLoop()`; that
would freeze the canvas against slider input too.

## File layout inside `src/sims/`
Shared drawing helpers live in `/sims/lib/` — nested on purpose, since
`SimPage.jsx` globs `../sims/*.js` with a single-segment wildcard that never
descends into subfolders. Never put a non-sim `.js` file directly in
`/sims`; it would be loaded as if it were a simulation.

## Sim metadata — `src/simCatalog.js`
Bilingual, consumed by `Landing.jsx`, `SimsPage.jsx` and `SimPage.jsx`. It
used to be duplicated across pages; don't re-fork it.

Top-level per sim: `id`, `categories` (one or more of `CATEGORY_IDS`,
exported from the same file) and optional `ready: false`. Subject labels are
translated in `content.js` -> `categories`. `/sims` filters on them with
chips rather than splitting into fixed sections: a sim may sit in both
subjects (`vectors` does), and sections would either duplicate its card or
force an arbitrary primary choice.

Each `ro`/`en` block carries `tag`, `title`, `desc`, `formula` and `controls`.
`formula` is the governing law in plain Unicode (`R = v₀² · sin 2θ / g`) —
the landing page copy promises every sim has one, so cards must show it.
`controls` names what the student can change **in words**, not symbols: it
read "θ · μ · m" before, which assumed the reader already knew the notation
the sim exists to teach.

Cards show the inline SVG figure, title, description and that controls
summary. A card whose catalogue entry has `ready: false` renders as a plain
div, not a `<Link>` — there is no module under `src/sims/` for it yet, so
linking would land on SimPage's error state.

## Per-sim explanations — `src/simTheory.js`
Keyed by sim id then `ro`/`en`, as `blocks` (heading + body) plus a `try`
list of things to do with the sliders. Rendered by `SimPage` below the canvas
and controls — the reader should meet the drawing first. Kept out of
`simCatalog.js` on purpose: that file is imported by all three pages, which
would make the landing page and gallery carry prose they never render. A sim
with no entry simply renders no panel. Pitch it at gimnaziu: short
paragraphs, each idea tied to something visible on the canvas.

**Canvas text inside `src/sims/*` is English and is NOT translated** — the
language toggle does not reach into the sketches. Keep drawn labels to short
symbolic text (`sin θ`, `cos θ`, `1`, `90°`) and let `simTheory.js` carry the
real explanation in both languages.

## UI chrome copy — `src/content.js`
Keyed `ro`/`en` then grouped by where it appears (`nav`, `landing`, `sims`,
`sim`). Romanian is the primary voice and the fallback. Every user-facing
string goes here — no hardcoded copy in a component, or the language toggle
silently skips it.

## Language state
`LangProvider` (above the router in `App.jsx`), read via `useLang()` from
`src/langContext.js`. Provider and hook are deliberately in separate files: a
module exporting both a component and plain functions can't be hot-replaced,
and Vite fast refresh would full-reload instead. Choice persists to
`localStorage` under `mmf-lang`.

## Card figures
Live in `pages/landingArt.jsx`; the id -> figure map is `pages/simArt.js`,
kept separate so the figures file exports only components and stays
hot-replaceable. A new sim needs an entry in both.

## Canvas responsiveness
p5 writes the canvas size onto the element's inline `style`, which outranks
any CSS module rule. The `max-width: 100% !important; height: auto !important`
on `.canvas canvas` / `.demoCanvas canvas` is what makes sims responsive —
without it the canvas keeps its fixed pixel width and overflows on mobile.
`max-width` (not `width`) so a 560px drawing is never upscaled and blurred.

## Styling
No inline styles; plain CSS modules per component (no Tailwind, no
styled-components).

## Known risk areas
1. **p5 instance cleanup** — always call `destroy()` in the `useEffect`
   return to prevent multiple sketches stacking on route change.
2. **Sim contract changes mid-project break both sides simultaneously** —
   freeze it. See `docs/CONTRACT.md`.
3. **Animated sims must clamp their frame delta** via `stepSeconds()` — see
   "Animation" above. Don't bypass it.
