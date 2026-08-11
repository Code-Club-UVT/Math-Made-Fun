import { useState } from "react";
import SimCard from "../components/SimCard.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { SIM_CATALOG, CATEGORY_IDS } from "../simCatalog.js";
import { CONTENT } from "../content.js";
import { useLang } from "../langContext.js";
import { SIM_ART } from "./simArt.js";
import styles from "./SimsPage.module.css";

const ALL = "all";

export default function SimsPage() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const t = c.sims;

  // Filter rather than fixed sections: a sim can sit in two subjects, and
  // sections would either duplicate its card or force an arbitrary "primary"
  // choice. With a filter it simply appears under both.
  const [subject, setSubject] = useState(ALL);
  const shown =
    subject === ALL
      ? SIM_CATALOG
      : SIM_CATALOG.filter((sim) => sim.categories?.includes(subject));

  return (
    <div className={styles.page}>
      <SiteHeader />

      <header className={styles.head}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.sub}>{t.sub}</p>
      </header>

      <div className={styles.filters} role="group" aria-label={t.filterLabel}>
        {[ALL, ...CATEGORY_IDS].map((key) => {
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
              <span className={styles.chipCount}>
                {key === ALL
                  ? SIM_CATALOG.length
                  : SIM_CATALOG.filter((s) => s.categories?.includes(key)).length}
              </span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>{t.empty}</p>
      ) : (
        <div className={styles.grid}>
          {shown.map((sim) => {
            const copy = sim[lang];
            return (
              <SimCard
                key={sim.id}
                id={sim.id}
                tag={copy.tag}
                title={copy.title}
                desc={copy.desc}
                formula={copy.formula}
                controls={copy.controls}
                categories={(sim.categories ?? []).map((k) => c.categories[k])}
                ready={sim.ready !== false}
                Art={SIM_ART[sim.id]}
                soonLabel={c.soon}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
