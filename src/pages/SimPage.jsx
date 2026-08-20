import { useEffect, useReducer, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ControlPanel from "../components/ControlPanel.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { SIM_CATALOG } from "../simCatalog.js";
import { SIM_THEORY } from "../simTheory.js";
import { CONTENT } from "../content.js";
import { useLang } from "../langContext.js";
import styles from "./SimPage.module.css";

// Statically analyzable by Vite: a glob over a fixed directory, still
// code-split per file. Gives a plain path -> loader map we can check
// synchronously before awaiting anything (unknown id = no key, no promise).
const simModules = import.meta.glob("../sims/*.js");

function simReducer(state, action) {
  switch (action.type) {
    case "loading":
    case "error":
      return { status: action.type, sim: null, controlValues: {} };
    case "ready":
      return { status: "ready", sim: action.sim, controlValues: action.controlValues };
    case "control":
      return {
        ...state,
        controlValues: { ...state.controlValues, [action.id]: action.value },
      };
    default:
      return state;
  }
}

export default function SimPage() {
  const { id } = useParams();
  const { lang } = useLang();
  const t = CONTENT[lang].sim;
  const canvasRef = useRef(null);
  const simRef = useRef(null);

  const [state, dispatch] = useReducer(simReducer, {
    status: "loading",
    sim: null,
    controlValues: {},
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });

    const loader = simModules[`../sims/${id}.js`];
    if (!loader) {
      // No promise was started, so there is nothing to cancel or tear down.
      dispatch({ type: "error" });
      return;
    }

    loader()
      .then((mod) => {
        if (cancelled) return;
        const loadedSim = mod.default;
        const defaults = Object.fromEntries(
          loadedSim.controls.map((c) => [c.id, c.default])
        );
        try {
          loadedSim.init(canvasRef.current, defaults);
        } catch {
          dispatch({ type: "error" });
          return;
        }
        simRef.current = loadedSim;
        dispatch({ type: "ready", sim: loadedSim, controlValues: defaults });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "error" });
      });

    return () => {
      cancelled = true;
      if (simRef.current) {
        try {
          simRef.current.destroy();
        } catch {
          // third-party sim code — don't let a bad destroy() block navigation
        }
        simRef.current = null;
      }
    };
  }, [id]);

  function handleControlChange(controlId, value) {
    dispatch({ type: "control", id: controlId, value });
    try {
      simRef.current?.update({ ...state.controlValues, [controlId]: value });
    } catch {
      // third-party sim code — a bad update() shouldn't break the panel
    }
  }

  // Catalogue copy is keyed by id and available before the module resolves,
  // so the header can render immediately instead of flashing the raw slug.
  const meta = SIM_CATALOG.find((s) => s.id === id);
  const copy = meta?.[lang];
  // Optional: only some sims have written explanations so far, and a sim that
  // fails to load shouldn't show theory for a canvas that isn't there.
  const theory = state.status === "ready" ? SIM_THEORY[id]?.[lang] : null;

  return (
    <div className={styles.page}>
      <SiteHeader />

      {/* Breadcrumb rather than a header nav link: this page is a member of
          the /sims collection, and that hierarchy is worth showing in place. */}
      <Link to="/sims" className={styles.back}>
        ← {t.back}
      </Link>

      <header className={styles.head}>
        <div>
          {copy && <p className={styles.tag}>{copy.tag}</p>}
          <h1 className={styles.title}>{copy?.title ?? state.sim?.title ?? id}</h1>
        </div>
        {copy && <p className={styles.headDesc}>{copy.desc}</p>}
      </header>

      <div className={styles.layout}>
        <div className={styles.canvasWrap}>
          {/* always mounted, regardless of status, so canvasRef.current is
              guaranteed non-null the instant a sim module resolves */}
          <div ref={canvasRef} className={styles.canvas} />
          {state.status === "loading" && (
            <p className={styles.status}>{t.loading}</p>
          )}
          {state.status === "error" && (
            <div className={styles.status}>
              <p className={styles.statusTitle}>{t.missing(id)}</p>
              <Link to="/sims" className={styles.statusLink}>
                {t.missingLink}
              </Link>
            </div>
          )}
        </div>

        {state.status === "ready" && state.sim.controls.length > 0 && (
          <ControlPanel
            simId={id}
            controls={state.sim.controls}
            values={state.controlValues}
            onChange={handleControlChange}
          />
        )}
      </div>

      {/* Sits below both the canvas and the controls on purpose: the reader
          should meet the drawing first and reach for the explanation after
          having moved something. */}
      {theory && (
        <section className={styles.theory}>
          <p className={styles.theoryEyebrow}>{t.theoryEyebrow}</p>
          <h2 className={styles.theoryTitle}>{t.theoryTitle}</h2>

          <div className={styles.theoryGrid}>
            {theory.blocks.map((block) => (
              <article key={block.heading} className={styles.theoryBlock}>
                <h3 className={styles.theoryHeading}>{block.heading}</h3>
                <p className={styles.theoryBody}>{block.body}</p>
              </article>
            ))}
          </div>

          <div className={styles.tryBox}>
            <h3 className={styles.tryTitle}>{t.tryTitle}</h3>
            <ol className={styles.tryList}>
              {theory.try.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}
