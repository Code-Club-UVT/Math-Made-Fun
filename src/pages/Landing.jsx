import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import { LANDING_CONTENT } from "./landingContent.js";
import {
  VectorsArt,
  ProjectileArt,
  InclineArt,
  UnitCircleArt,
  GrapherArt,
  ProbabilityArt,
} from "./landingArt.jsx";

// Visual-only metadata for the 6 preview cards below (decorative mockups,
// not live sim data — the real gallery is SimsPage.jsx / src/sims/*)
const CARD_META = [
  { Art: VectorsArt, canvasBg: "linear-gradient(135deg,#eef0ff,#f6efff)", window: "vectors.sim", fills: ["62%", "30%"] },
  { Art: ProjectileArt, canvasBg: "linear-gradient(135deg,#eef4ff,#eef0ff)", window: "projectile.sim", fills: ["70%", "61%"] },
  { Art: InclineArt, canvasBg: "linear-gradient(135deg,#f2efff,#eaf0ff)", window: "inclined-plane.sim", fills: ["30%", "18%"] },
  { Art: UnitCircleArt, canvasBg: "linear-gradient(135deg,#eef0ff,#f7eeff)", window: "unit-circle.sim", fills: ["23%", "50%"] },
  { Art: GrapherArt, canvasBg: "linear-gradient(135deg,#edf1ff,#f1eeff)", window: "function-grapher.sim", fills: ["54%", "24%"] },
  { Art: ProbabilityArt, canvasBg: "linear-gradient(135deg,#f0efff,#ebf2ff)", window: "probability.sim", fills: ["78%", "40%"] },
];

function Reveal({ className, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${visible ? styles.in : ""}`}>
      {children}
    </div>
  );
}

export default function Landing() {
  const [lang, setLang] = useState("en");
  const t = LANDING_CONTENT[lang];

  return (
    <div className={styles.page}>
      {/* ambient gradient blobs behind the header/hero */}
      <div className={styles.blobWrap}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      {/* top nav bar: logo, section links, language toggle, sign in */}
      <header className={styles.header}>
        <Link to="/sims" className={styles.logo}>
          <span className={styles.logoMark}>∑</span>
          MathMadeFun
        </Link>
        <nav className={styles.nav}>
          <Link to="/sims" className={styles.navLink}>
            {t.navSims}
          </Link>
          <a href="#sims" className={styles.navLink}>
            {t.navHow}
          </a>
          <button
            type="button"
            onClick={() => setLang((l) => (l === "en" ? "ro" : "en"))}
            title={t.langTitle}
            className={styles.langBtn}
          >
            <span>🌐</span>
            {t.langLabel}
          </button>
          <button type="button" className={styles.signInBtn}>
            {t.signIn}
          </button>
        </nav>
      </header>

      {/* hero: badge, title, lead copy, primary/secondary CTAs */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          {t.badge}
        </div>
        <h1 className={styles.title}>MathMadeFun</h1>
        <p className={styles.lead}>{t.heroLead}</p>
        <p className={styles.sub}>{t.heroSub}</p>
        <div className={styles.ctaRow}>
          <Link to="/sims" className={styles.ctaPrimary}>
            {t.ctaPrimary}
            <span>→</span>
          </Link>
          <a href="#sims" className={styles.ctaSecondary}>
            {t.ctaSecondary}
          </a>
        </div>
        <div className={styles.heroNote}>{t.heroNote}</div>
      </section>

      {/* simulation library: section heading + one preview card per sim */}
      <section id="sims" className={styles.simsSection}>
        {/* section heading (eyebrow / title / subtitle) */}
        <Reveal className={styles.reveal}>
          <div className={styles.sectionHead}>
            <div className={styles.eyebrow}>{t.libEyebrow}</div>
            <h2 className={styles.sectionTitle}>{t.libTitle}</h2>
            <p className={styles.sectionSub}>{t.libSub}</p>
          </div>
        </Reveal>

        {t.cards.map((card, i) => {
          const meta = CARD_META[i];
          const Art = meta.Art;
          return (
            <Reveal key={card.title} className={`${styles.reveal} ${styles.cardWrap}`}>
              <div className={styles.card}>
                {/* window title bar: traffic-light dots + filename + decorative actions */}
                <div className={styles.cardTitlebar}>
                  <div className={styles.trafficLights}>
                    <span className={`${styles.dot} ${styles.dotRed}`} />
                    <span className={`${styles.dot} ${styles.dotYellow}`} />
                    <span className={`${styles.dot} ${styles.dotGreen}`} />
                    <span className={styles.windowName}>{meta.window}</span>
                  </div>
                  <div className={styles.cardActions}>
                    <span title="Play" className={styles.playBtn}>▶</span>
                    {/* Play button emoji which will later act as a play/pause toggle */}
                    <span title="Expand" className={styles.expandBtn}>⤢</span>
                  </div>

                </div>

                {/* card body: left = illustration pane, right = title/desc/control sliders */}
                <div className={styles.cardBody}>
                  <div className={styles.canvasPane} style={{ background: meta.canvasBg }}>
                    <div className={styles.artFloat}>
                      <Art />
                    </div>
                    <div className={styles.canvasLabel}>canvas · p5.js</div>
                  </div>
                  <div className={styles.detailsPane}>
                    <div className={styles.cardTag}>{card.tag}</div>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.desc}</p>
                    {/* fake slider readout per control (decorative, not interactive) */}
                    {card.controls.map(([label, value], j) => (
                      <div key={label} className={styles.controlRow}>
                        <div className={styles.controlLabelRow}>
                          <span>{label}</span>
                          <span className={styles.controlValue}>{value}</span>
                        </div>
                        <div className={styles.sliderTrack}>
                          <div className={styles.sliderFill} style={{ width: meta.fills[j] }} />
                          <div className={styles.sliderThumb} style={{ left: meta.fills[j] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>
    </div>
  );
}
