import {
  VectorsArt,
  ProjectileArt,
  InclineArt,
  UnitCircleArt,
  TriangleAnglesArt,
  AdjacentAnglesArt,
  PulleyArt,
  PendulumArt,
} from "./landingArt.jsx";

// One place mapping sim id -> figure, read by SimCard. Landing and SimsPage
// used to keep separate copies of this; with eight sims that had become a
// real drift risk.
//
// Kept out of landingArt.jsx for the same reason LangProvider and langContext
// are split: a module that exports both components and a plain value can't be
// hot-replaced, so Vite would full-reload on every edit to the figures.
export const SIM_ART = {
  vectors: VectorsArt,
  "inclined-plane": InclineArt,
  projectile: ProjectileArt,
  "unit-circle": UnitCircleArt,
  "triangle-angles": TriangleAnglesArt,
  "adjacent-angles": AdjacentAnglesArt,
  pulley: PulleyArt,
  pendulum: PendulumArt,
};
