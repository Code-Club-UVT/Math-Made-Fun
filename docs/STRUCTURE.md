# Project structure

```
mathmadefun/
├── src/
│   ├── main.jsx                       (Vite entry)
│   ├── App.jsx                        (router root)
│   ├── simCatalog.js                  (sim metadata, shared by all pages)
│   ├── simTheory.js                   (per-sim explanations, ro/en, SimPage only)
│   ├── content.js                     (UI copy, ro/en, all pages)
│   ├── langContext.js                 (LangContext + useLang hook)
│   ├── components/
│   │   ├── SimCard.jsx
│   │   ├── SiteHeader.jsx             (shared header, logo + nav + lang)
│   │   ├── LangProvider.jsx           (language state, persisted)
│   │   └── ControlPanel.jsx           (generic slider builder)
│   ├── pages/
│   │   ├── Landing.jsx                 (marketing/home page)
│   │   ├── SimsPage.jsx                 (sim gallery grid, /sims)
│   │   ├── SimPage.jsx                  (individual sim, /sims/:id)
│   │   ├── landingArt.jsx               (inline SVG figures used on cards)
│   │   └── simArt.js                    (sim id -> figure map)
│   └── sims/                          ← math contributor owns these
│       ├── lib/draw.js                 (shared p5 drawing helpers)
│       ├── lib/anim.js                 (stepSeconds, prefersReducedMotion)
│       ├── vectors.js
│       ├── inclined-plane.js
│       ├── projectile.js
│       ├── unit-circle.js
│       ├── triangle-angles.js
│       ├── adjacent-angles.js
│       ├── pulley.js
│       └── pendulum.js
├── public/assets/thumbs/              (dead — see docs/CONVENTIONS.md)
├── index.html
├── vite.config.js
└── package.json
```

See `docs/CONTRACT.md` for what a file under `src/sims/` must export, and
`docs/CONVENTIONS.md` for why each of the top-level `src/*.js` files is
shaped the way it is.
