// UI copy for every page, keyed by language. Romanian is the primary voice —
// the audience is Romanian gimnaziu/liceu students — and English is the
// translation. Per-simulation copy (tag/title/description) lives in
// src/simCatalog.js instead, since it is data about the sims rather than
// chrome around them.
//
// Grouped by where the strings appear: `nav` is the shared site header,
// the rest map one-to-one onto the three pages.
export const CONTENT = {
  ro: {
    nav: {
      sims: "Simulări",
      catalog: "Catalog",
      langLabel: "EN",
      langTitle: "Switch to English",
    },

    landing: {
      badge: "Fizică și matematică, desenate în timp real",
      title: "Trage de cursor.\nFormula se mișcă.",
      lead:
        "Fiecare simulare desenează formula în timp ce o schimbi, așa că vezi ce face fiecare mărime înainte să o înveți pe de rost.",
      ctaPrimary: "Deschide simulările",
      ctaSecondary: "Vezi catalogul",
      heroNote: "Pentru gimnaziu și liceu · fără cont, fără instalare",

      demoTitle: "Mișcarea proiectilului",
      demoHint: "Trage de unghi — bătaia se recalculează pe loc.",
      demoAngle: "Unghi de lansare",
      demoRange: "bătaie",
      demoOpen: "Deschide simularea",

      catalogEyebrow: "Catalog",
      catalogTitle: "Fiecare simulare are o formulă",
      catalogSub:
        "Formula stă lângă desen, iar cursoarele o controlează direct. Alege de unde începi.",
    },

    sims: {
      eyebrow: "Catalog",
      title: "Simulări",
      sub:
        "Deschide una și trage de cursoare. Formula de pe card este cea pe care o controlezi.",
      filterAll: "Toate",
      filterLabel: "Filtrează după materie",
      empty: "Nicio simulare în această categorie deocamdată.",
    },

    // Subject areas. A sim can belong to both — vectors are taught in maths
    // and used constantly in physics.
    categories: {
      math: "Matematică",
      physics: "Fizică",
    },

    sim: {
      back: "Simulări",
      loading: "Se încarcă…",
      missing: (id) => `Simularea „${id}” nu există încă.`,
      missingLink: "Vezi catalogul",
      theoryEyebrow: "Explicație",
      theoryTitle: "Ce vezi pe desen",
      tryTitle: "Încearcă acum",
    },

    controls: {
      play: (label) => `Pornește ${label}`,
      pause: (label) => `Oprește ${label}`,
      labels: {
        vectors: {
          v1x: "Vectorul 1 X",
          v1y: "Vectorul 1 Y",
          v2x: "Vectorul 2 X",
          v2y: "Vectorul 2 Y",
        },
        "inclined-plane": {
          playing: "animația",
          angle: "Unghiul rampei (°)",
          friction: "Frecare μ",
          mass: "Masă (kg)",
        },
        projectile: {
          playing: "animația",
          speed: "Viteza de lansare (m/s)",
          angle: "Unghi de lansare (°)",
          height: "Înălțime de lansare (m)",
        },
        // Written ahead of delivery — the control id is agreed in TASKS.md.
        // Harmless if the sim lands with a different id: the lookup falls
        // back to the module's own label.
        "unit-circle": {
          angle: "Unghiul θ (°)",
        },
        "triangle-angles": {
          angleA: "Unghiul A (°)",
          angleB: "Unghiul B (°)",
        },
        // A `{ on, off }` entry marks a switch-style toggle: it names its two
        // states instead of taking the "Pornește …"/"Oprește …" playback wording.
        "adjacent-angles": {
          solveMode: { on: "Află unghiul lipsă", off: "Adună unghiurile" },
          threeAngles: { on: "3 unghiuri", off: "2 unghiuri" },
          angleAOB: "Unghiul AOB (°)",
          angleAOC: "Unghiul AOC (°)",
          angleAOD: "Unghiul AOD (°) — doar la 3",
        },
        pulley: {
          playing: "animația",
          count: "Număr de scripeți",
          load: "Greutate (N)",
        },
        pendulum: {
          playing: "animația",
          length: "Lungimea firului (m)",
          angle: "Unghiul de pornire (°)",
          mass: "Masă (kg)",
        },
      },
    },

    soon: "în lucru",
  },

  en: {
    nav: {
      sims: "Simulations",
      catalog: "Catalogue",
      langLabel: "RO",
      langTitle: "Comută în română",
    },

    landing: {
      badge: "Physics and maths, drawn in real time",
      title: "Drag a slider.\nThe formula moves.",
      lead:
        "Every simulation draws the formula while you change it, so you can see what each quantity does before memorising it.",
      ctaPrimary: "Open the simulations",
      ctaSecondary: "See the catalogue",
      heroNote: "For secondary school · no account, no install",

      demoTitle: "Projectile motion",
      demoHint: "Drag the angle — the range recalculates as you go.",
      demoAngle: "Launch angle",
      demoRange: "range",
      demoOpen: "Open this simulation",

      catalogEyebrow: "Catalogue",
      catalogTitle: "Every simulation has a formula",
      catalogSub:
        "The formula sits next to the drawing, and the sliders drive it directly. Pick where to start.",
    },

    sims: {
      eyebrow: "Catalogue",
      title: "Simulations",
      sub:
        "Open one and drag the sliders. The formula on the card is the one you control.",
      filterAll: "All",
      filterLabel: "Filter by subject",
      empty: "No simulations in this category yet.",
    },

    categories: {
      math: "Maths",
      physics: "Physics",
    },

    sim: {
      back: "Simulations",
      loading: "Loading…",
      missing: (id) => `Simulation “${id}” doesn't exist yet.`,
      missingLink: "See the catalogue",
      theoryEyebrow: "Explanation",
      theoryTitle: "What you're looking at",
      tryTitle: "Try this now",
    },

    // Mirrors the `label` fields in src/sims/*.js. Kept here rather than read
    // from the sim modules because those are the math contributor's files and
    // the contract is frozen — but their labels are user-facing, so they have
    // to be translatable like everything else. Anything missing falls back to
    // the module's own `label`, so a newly delivered sim still renders.
    controls: {
      play: (label) => `Play ${label}`,
      pause: (label) => `Pause ${label}`,
      labels: {
        vectors: {
          v1x: "Vector 1 X",
          v1y: "Vector 1 Y",
          v2x: "Vector 2 X",
          v2y: "Vector 2 Y",
        },
        "inclined-plane": {
          playing: "animation",
          angle: "Incline angle (°)",
          friction: "Friction μ",
          mass: "Mass (kg)",
        },
        projectile: {
          playing: "animation",
          speed: "Launch speed (m/s)",
          angle: "Launch angle (°)",
          height: "Launch height (m)",
        },
        "unit-circle": {
          angle: "Angle θ (°)",
        },
        "triangle-angles": {
          angleA: "Angle A (°)",
          angleB: "Angle B (°)",
        },
        "adjacent-angles": {
          solveMode: { on: "Find the missing angle", off: "Add the angles" },
          threeAngles: { on: "3 angles", off: "2 angles" },
          angleAOB: "Angle AOB (°)",
          angleAOC: "Angle AOC (°)",
          angleAOD: "Angle AOD (°) — 3 only",
        },
        pulley: {
          playing: "animation",
          count: "Number of pulleys",
          load: "Load (N)",
        },
        pendulum: {
          playing: "animation",
          length: "String length (m)",
          angle: "Start angle (°)",
          mass: "Mass (kg)",
        },
      },
    },

    soon: "in progress",
  },
};
