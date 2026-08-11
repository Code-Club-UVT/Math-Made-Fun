import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import { CONTENT } from "../content.js";
import { useLang } from "../langContext.js";
import { SIM_CATALOG } from "../simCatalog.js";
import SimCard from "../components/SimCard.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { SIM_ART } from "./simArt.js";

// Fixed for the hero demo so a single slider tells the whole story; the full
// control set lives on /sims/projectile.
const DEMO_SPEED = 22;
const G = 9.81;

// Range for a launch from ground level. Mirrors solve() in sims/projectile.js,
// which is only valid as written here because the demo pins height to 0.
function demoRange(angle) {
  return (DEMO_SPEED ** 2 * Math.sin((2 * angle * Math.PI) / 180)) / G;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function Reveal({ className = "", children }) {
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
    <div ref={ref} className={`${styles.reveal} ${className} ${visible ? styles.in : ""}`}>
      {children}
    </div>
  );
}

// The thesis of the page: the real simulation, not a mockup of one. One slider
// drives the canvas and the live range readout at the same time, which is the
// entire product argument in a single gesture.
function HeroDemo({ t }) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const [angle, setAngle] = useState(55);
  const angleRef = useRef(angle);
  angleRef.current = angle;

  useEffect(() => {
    let cancelled = false;
    const node = canvasRef.current;

    import("../sims/projectile.js").then((mod) => {
      if (cancelled || !node) return;
      const sim = mod.default;
      try {
        sim.init(node, {
          playing: !prefersReducedMotion(),
          speed: DEMO_SPEED,
          angle: angleRef.current,
          height: 0,
        });
        simRef.current = sim;
      } catch {
        // A broken sim must not take the marketing page down with it.
      }
    });

    return () => {
      cancelled = true;
      try {
        simRef.current?.destroy();
      } catch {
        /* nothing useful to do if teardown throws */
      }
      simRef.current = null;
    };
  }, []);

  function handleAngle(next) {
    setAngle(next);
    try {
      simRef.current?.update({
        playing: !prefersReducedMotion(),
        speed: DEMO_SPEED,
        angle: next,
        height: 0,
      });
    } catch {
      /* ignore — the slider should stay usable regardless */
    }
  }

  const range = demoRange(angle);

  return (
    <figure className={styles.demo}>
      <figcaption className={styles.demoHead}>
        <span className={styles.demoTitle}>{t.demoTitle}</span>
        <span className={styles.demoHint}>{t.demoHint}</span>
      </figcaption>

      <div ref={canvasRef} className={styles.demoCanvas} />

      {/* The live result. This is the causation the hero is arguing for:
          move the slider below, watch this number move with it. */}
      <div className={styles.demoReadout}>
        <span className={styles.demoReadoutLabel}>{t.demoRange}</span>
        <span className={styles.demoReadoutValue}>{range.toFixed(1)} m</span>
      </div>

      <label className={styles.demoControl}>
        <span className={styles.demoLabel}>
          {t.demoAngle}
          <output className={styles.demoValue}>{angle}°</output>
        </span>
        <input
          type="range"
          min={5}
          max={85}
          step={1}
          value={angle}
          onChange={(e) => handleAngle(Number(e.target.value))}
          className={styles.demoSlider}
        />
      </label>

      <Link to="/sims/projectile" className={styles.demoOpen}>
        {t.demoOpen} →
      </Link>
    </figure>
  );
}

export default function Landing() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const t = c.landing;

  return (
    <div className={styles.page}>
      <SiteHeader
        links={[
          { href: "#catalog", label: c.nav.catalog },
          { to: "/sims", label: c.nav.sims },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.badge}>{t.badge}</p>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.ctaRow}>
            <Link to="/sims" className={styles.ctaPrimary}>
              {t.ctaPrimary}
            </Link>
            <a href="#catalog" className={styles.ctaSecondary}>
              {t.ctaSecondary}
            </a>
          </div>
          <p className={styles.heroNote}>{t.heroNote}</p>
        </div>

        <HeroDemo t={t} />
      </section>

      <section id="catalog" className={styles.catalog}>
        <Reveal>
          <p className={styles.eyebrow}>{t.catalogEyebrow}</p>
          <h2 className={styles.catalogTitle}>{t.catalogTitle}</h2>
          <p className={styles.catalogSub}>{t.catalogSub}</p>
        </Reveal>

        <div className={styles.cards}>
          {SIM_CATALOG.map((sim) => {
            const copy = sim[lang];
            return (
              <Reveal key={sim.id} className={styles.cardWrap}>
                <SimCard
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
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
