export const LANDING_CONTENT = {
  en: {
    navSims: "Simulations",
    navHow: "How it works",
    signIn: "Sign in",
    langLabel: "RO",
    langTitle: "Switch to Romanian",
    badge: "Interactive math & physics, made visual",
    heroLead:
      "See the math move. Drag a slider, tilt a plane, launch a projectile — and watch the numbers, vectors, and graphs respond in real time.",
    heroSub:
      "A hands-on playground of physics and math simulations that turns abstract concepts into something you can actually touch, tweak, and understand.",
    ctaPrimary: "Explore Simulations",
    ctaSecondary: "Watch a demo",
    heroNote: "some simulations · aligned to the RO middle & high-school curriculum", //need to update this when we have the final set of sims
    libEyebrow: "The simulation library",
    libTitle: "Every card is a live experiment",
    libSub: "Open any window, grab the controls, and the visualization responds instantly.",
    cards: [
      {
        tag: "Vectors",
        title: "Vector Addition",
        desc: "Drag two vectors by magnitude and angle and watch the resultant redraw itself head-to-tail, instantly.",
        controls: [
          ["Vector 1 — magnitude", "7.4"], //need to update this when we have the final set of sims
          ["Vector 2 — angle", "48°"],
        ],
      },
      {
        tag: "Kinematics",
        title: "Projectile Motion",
        desc: "Set launch speed and angle, then trace the full parabolic arc, range, and peak height as they update.",
        controls: [
          ["Launch speed", "22 m/s"], //random values for now, need to update this when we have the final set of sims
          ["Angle", "55°"],
        ],
      },
      {
        tag: "Forces",
        title: "Inclined Plane",
        desc: "Tilt the ramp and adjust friction and mass to see how the component forces on a block change in real time.",
        controls: [
          ["Incline angle", "27°"],
          ["Friction μ", "0.18"],
          ["Mass", "2.0 kg"], 
        ],
      },
      {
        tag: "Trigonometry",
        title: "Unit Circle",
        desc: "Sweep the angle around the circle and watch sine, cosine, and tangent build up point by point.",
        controls: [
          ["Angle θ", "42°"],
          ["Sweep speed", "1.0×"],
        ],
      },
      {
        tag: "Functions",
        title: "Function Grapher",
        desc: "Type any function and slide its parameters to see the curve stretch, shift, and flip live.",
        controls: [
          ["Coefficient a", "1.6"],
          ["Shift c", "−2.0"],
        ],
      },
      {
        tag: "Statistics",
        title: "Probability Explorer",
        desc: "Run thousands of trials in a second and watch the histogram converge toward the theoretical distribution.",
        controls: [
          ["Trials", "5,000"],
          ["Bins", "24"],
        ],
      },
    ],
  },
  ro: {
    navSims: "Simulări",
    navHow: "Cum funcționează",
    signIn: "Autentificare",
    langLabel: "EN",
    langTitle: "Comută în engleză",
    badge: "Matematică și fizică interactivă, făcute vizuale",
    heroLead:
      "Vezi matematica în mișcare. Trage un cursor, înclină un plan, lansează un proiectil — și urmărește cum numerele, vectorii și graficele răspund în timp real.",
    heroSub:
      "Un teren de joacă practic cu simulări de fizică și matematică, care transformă conceptele abstracte în ceva ce poți atinge, ajusta și înțelege cu adevărat.",
    ctaPrimary: "Explorează simulările",
    ctaSecondary: "Vezi o demonstrație",
    heroNote: "N simulări · aliniate la programa școlară RO de gimnaziu și liceu", //need to update this when we have the final set of sims
    libEyebrow: "Biblioteca de simulări",
    libTitle: "Fiecare card este un experiment live",
    libSub: "Deschide orice fereastră, ia controalele în mână, iar vizualizarea răspunde instantaneu.",
    cards: [
      {
        tag: "Vectori",
        title: "Adunarea vectorilor",
        desc: "Trage doi vectori după mărime și direcție și urmărește cum rezultanta se redesenează cap-la-coadă, instantaneu.",
        controls: [
          ["Vector 1 — mărime", "7.4"],
          ["Vector 2 — unghi", "48°"],
        ],
      },
      {
        tag: "Cinematică",
        title: "Mișcarea proiectilului",
        desc: "Setează viteza și unghiul de lansare, apoi trasează întregul arc parabolic, bătaia și înălțimea maximă în timp real.",
        controls: [
          ["Viteză de lansare", "22 m/s"],
          ["Unghi", "55°"],
        ],
      },
      {
        tag: "Forțe",
        title: "Planul înclinat",
        desc: "Înclină rampa și reglează frecarea si masa pentru a vedea cum se schimbă componentele forțelor asupra unui corp în timp real.",
        controls: [
          ["Unghi de înclinare", "27°"],
          ["Frecare μ", "0.18"],
          ["Masa corpului", "2.0 kg"], //dont know yet if we will have mass as a control in the final version, but for now it is there
        ],
      },
      {
        tag: "Trigonometrie",
        title: "Cercul trigonometric",
        desc: "Rotește unghiul în jurul cercului și urmărește cum sinusul, cosinusul și tangenta se construiesc punct cu punct.",
        controls: [
          ["Unghi θ", "42°"],
          ["Viteză de rotire", "1.0×"],
        ],
      },
      {
        tag: "Funcții",
        title: "Reprezentare grafică",
        desc: "Scrie orice funcție și glisează parametrii pentru a vedea cum curba se întinde, se translatează și se răstoarnă live.",
        controls: [
          ["Coeficient a", "1.6"],
          ["Translație c", "−2.0"],
        ],
      },
      {
        tag: "Statistică",
        title: "Explorator de probabilități",
        desc: "Rulează mii de încercări într-o secundă și urmărește histograma convergând spre distribuția teoretică.",
        controls: [
          ["Încercări", "5.000"],
          ["Intervale", "24"],
        ],
      },
    ],
  },
};
