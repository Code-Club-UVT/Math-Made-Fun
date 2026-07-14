import SimCard from "../components/SimCard.jsx";
import styles from "./Dashboard.module.css";

// Static sim catalog for the gallery grid below (real per-sim logic lives in src/sims/*)
// Thumbnails are placeholder SVGs — swap for real art per the workflow in TASKS.md
const SIMS = [
  { id: "vectors", title: "Vector Addition", thumbnail: "/assets/thumbs/vectors.svg" }, 
  //used ai generated svg from the sim for now, but we will need to swap it for a proper thumbnail
  //
  { id: "inclined-plane", title: "Inclined Plane", thumbnail: "/assets/thumbs/inclined-plane.svg" }, 
  { id: "projectile", title: "Projectile Motion", thumbnail: "/assets/thumbs/projectile.svg" },
  { id: "unit-circle", title: "Unit Circle", thumbnail: "/assets/thumbs/unit-circle.svg" },
];

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <h1>Simulations</h1>
      {/* sim card grid */}
      <div className={styles.grid}>
        {SIMS.map((sim) => (
          <SimCard key={sim.id} {...sim} />
        ))}
      </div>
    </div>
  );
}
