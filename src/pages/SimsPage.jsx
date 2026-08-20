import { useState } from "react";
import SimCard from "../components/SimCard.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { SIM_CATALOG, CATEGORY_IDS } from "../simCatalog.js";
import { CONTENT } from "../content.js";
import { useLang } from "../langContext.js";
import styles from "./SimsPage.module.css";

const ALL = "all";

// One definition of "this sim belongs to this chip", so the grid and the
// counts can't disagree.
const inSubject = (sim, key) => key === ALL || sim.categories?.includes(key);

// The catalogue is static, so the chip counts are too — no reason to re-filter
// it on every render.
const CHIP_KEYS = [ALL, ...CATEGORY_IDS];
const CHIP_COUNTS = Object.fromEntries(
  CHIP_KEYS.map((key) => [key, SIM_CATALOG.filter((sim) => inSubject(sim, key)).length])
);

export default function SimsPage() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const t = c.sims;

  // Filter rather than fixed sections: a sim can sit in two subjects, and
  // sections would either duplicate its card or force an arbitrary "primary"
  // choice. With a filter it simply appears under both.
  const [subject, setSubject] = useState(ALL);
  const shown = SIM_CATALOG.filter((sim) => inSubject(sim, subject));

  return (
    <div className={styles.page}>
      <SiteHeader />

      <header className={styles.head}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.sub}>{t.sub}</p>
      </header>

      <div className={styles.filters} role="group" aria-label={t.filterLabel}>
        {CHIP_KEYS.map((key) => {
          const active = subject === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSubject(key)}
              aria-pressed={active}
              className={`${styles.chip} ${active ? styles.chipOn : ""}`}
            >
              {key === ALL ? t.filterAll : c.categories[key]}
              <span className={styles.chipCount}>{CHIP_COUNTS[key]}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>{t.empty}</p>
      ) : (
        <div className={styles.grid}>
          {shown.map((sim) => (
            <SimCard key={sim.id} sim={sim} />
          ))}
        </div>
      )}
    </div>
  );
}
