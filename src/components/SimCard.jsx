import { Link } from "react-router-dom";
import { CONTENT } from "../content.js";
import { useLang } from "../langContext.js";
import { SIM_ART } from "../pages/simArt.js";
import styles from "./SimCard.module.css";

// Gallery card. Takes a raw catalogue entry and does every lookup itself —
// language copy, category names, figure — so the landing page and the gallery
// stay one-liners and can't drift apart on how a card is built.
//
// An unready sim has no module under src/sims/ yet, so linking to it would
// land the student on SimPage's "doesn't exist" error. The card still renders
// — the catalogue is meant to show what's coming — but as a plain div rather
// than a link, so the "în lucru" badge is the whole story.
export default function SimCard({ sim }) {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const { tag, title, desc, formula, controls } = sim[lang];

  const ready = sim.ready !== false;
  const Art = SIM_ART[sim.id];

  // Subject first, then the narrower topic: "Fizică · Forțe". A sim in both
  // subjects lists both, which is why this is joined rather than a single chip.
  const label = [...(sim.categories ?? []).map((k) => c.categories[k]), tag].join(" · ");

  const body = (
    <>
      <div className={styles.top}>
        <span className={styles.tag}>{label}</span>
        {!ready && <span className={styles.soon}>{c.soon}</span>}
      </div>

      <div className={styles.art}>{Art && <Art />}</div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>

      {/* The law on top, then the sliders that drive it — the pairing the
          landing page's "formula sits next to the drawing" claim describes. */}
      <div className={styles.foot}>
        {formula && <p className={styles.formula}>{formula}</p>}
        <p className={styles.controls}>{controls}</p>
      </div>
    </>
  );

  if (!ready) {
    return (
      <div className={`${styles.card} ${styles.cardPending}`} aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link to={`/sims/${sim.id}`} className={styles.card}>
      {body}
    </Link>
  );
}
