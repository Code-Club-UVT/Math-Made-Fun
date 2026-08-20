// Single source of truth for the sim catalogue: consumed by the landing page,
// the gallery and the individual sim page, which used to keep separate copies
// of the same titles.
//
// Top-level fields (not per-language):
//   id         — matches the filename in src/sims/
//   categories — one or more of CATEGORY_IDS below. Drives the filter on
//                /sims and the line at the top of each card. A sim may sit in
//                both: vector addition is taught in maths and used in physics.
//   ready      — omit for a live sim. `false` means there is no module under
//                src/sims/ yet, so the card renders un-clickable with an
//                "in progress" badge instead of linking to an error page.
//
// Each language block carries:
//   tag / title / desc — what the card says
//   formula            — the law the sim demonstrates, in plain Unicode.
//                        The landing page promises "fiecare simulare are o
//                        formulă", so the cards have to actually show one.
//                        No KaTeX: see the note in CLAUDE.md.
//   controls           — what the student gets to change, in WORDS. This used
//                        to read "θ · μ · m", which assumes the reader already
//                        knows the notation the sim is there to teach.

// Order here is the order the filter chips appear in.
export const CATEGORY_IDS = ["math", "physics"];

export const SIM_CATALOG = [
  {
    id: "vectors",
    categories: ["math", "physics"],
    ro: {
      tag: "Vectori",
      title: "Adunarea vectorilor",
      desc: "Compune doi vectori cap-la-coadă și vezi de unde vine rezultanta.",
      formula: "v₁ + v₂ = v",
      controls: "Vectorul 1 · Vectorul 2",
    },
    en: {
      tag: "Vectors",
      title: "Vector addition",
      desc: "Add two vectors tip-to-tail and see where the resultant comes from.",
      formula: "v₁ + v₂ = v",
      controls: "Vector 1 · Vector 2",
    },
  },
  {
    id: "inclined-plane",
    categories: ["physics"],
    ro: {
      tag: "Forțe",
      title: "Planul înclinat",
      desc: "Înclină rampa până corpul alunecă. Masa nu schimbă nimic — află de ce.",
      formula: "tan θ > μ → alunecă",
      controls: "Unghi · Frecare · Masă",
    },
    en: {
      tag: "Forces",
      title: "Inclined plane",
      desc: "Tilt the ramp until the block slides. Mass changes nothing — find out why.",
      formula: "tan θ > μ → slides",
      controls: "Angle · Friction · Mass",
    },
  },
  {
    id: "projectile",
    categories: ["physics"],
    ro: {
      tag: "Cinematică",
      title: "Mișcarea proiectilului",
      desc: "Reglează viteza și unghiul, urmărește arcul, bătaia și înălțimea maximă.",
      formula: "R = v₀² · sin 2θ / g",
      controls: "Viteză · Unghi · Înălțime",
    },
    en: {
      tag: "Kinematics",
      title: "Projectile motion",
      desc: "Set speed and angle, then follow the arc, the range and the peak height.",
      formula: "R = v₀² · sin 2θ / g",
      controls: "Speed · Angle · Height",
    },
  },
  {
    id: "unit-circle",
    categories: ["math"],
    ro: {
      tag: "Trigonometrie",
      title: "Cercul trigonometric",
      desc: "Rotește unghiul și vezi cum se construiesc sinusul și cosinusul.",
      formula: "sin²θ + cos²θ = 1",
      controls: "Unghiul θ",
    },
    en: {
      tag: "Trigonometry",
      title: "Unit circle",
      desc: "Sweep the angle and watch sine and cosine build up point by point.",
      formula: "sin²θ + cos²θ = 1",
      controls: "Angle θ",
    },
  },

  {
    id: "triangle-angles",
    categories: ["math"],
    ro: {
      tag: "Geometrie",
      title: "Suma unghiurilor în triunghi",
      desc: "Alege două unghiuri și află-l pe al treilea. Suma rămâne mereu 180°.",
      formula: "A + B + C = 180°",
      controls: "Unghiul A · Unghiul B",
    },
    en: {
      tag: "Geometry",
      title: "Angles in a triangle",
      desc: "Pick two angles and the third follows. The sum is always 180°.",
      formula: "A + B + C = 180°",
      controls: "Angle A · Angle B",
    },
  },
  {
    id: "adjacent-angles",
    categories: ["math"],
    ro: {
      tag: "Geometrie",
      title: "Unghiuri adiacente",
      desc: "Două sau trei unghiuri cu același vârf. Adună-le, sau află-l pe cel lipsă.",
      formula: "∠AOB + ∠BOC = ∠AOC",
      controls: "Unghiuri · 2 sau 3 · mod de lucru",
    },
    en: {
      tag: "Geometry",
      title: "Adjacent angles",
      desc: "Two or three angles sharing a vertex. Add them up, or find the missing one.",
      formula: "∠AOB + ∠BOC = ∠AOC",
      controls: "Angles · 2 or 3 · working mode",
    },
  },
  {
    id: "pulley",
    categories: ["physics"],
    ro: {
      tag: "Mecanică",
      title: "Scripetele",
      desc: "Mai mulți scripeți, forță mai mică — dar tragi de mult mai multă frânghie.",
      formula: "F = G / n",
      controls: "Număr de scripeți · Greutate",
    },
    en: {
      tag: "Mechanics",
      title: "The pulley",
      desc: "More pulleys, less force — but you pull far more rope.",
      formula: "F = G / n",
      controls: "Pulley count · Load",
    },
  },
  {
    id: "pendulum",
    categories: ["physics"],
    ro: {
      tag: "Oscilații",
      title: "Pendulul",
      desc: "Schimbă lungimea și vezi cum se schimbă perioada. Masa nu contează.",
      formula: "T = 2π · √(L / g)",
      controls: "Lungime · Unghi inițial · Masă",
    },
    en: {
      tag: "Oscillations",
      title: "The pendulum",
      desc: "Change the length and watch the period change. Mass makes no difference.",
      formula: "T = 2π · √(L / g)",
      controls: "Length · Start angle · Mass",
    },
  },
];
