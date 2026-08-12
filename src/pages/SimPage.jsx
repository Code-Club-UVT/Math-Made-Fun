import { useEffect, useReducer, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ControlPanel from "../components/ControlPanel.jsx";
import styles from "./SimPage.module.css";

// Statically analyzable by Vite: a glob over a fixed directory, still
// code-split per file. Gives a plain path -> loader map we can check
// synchronously before awaiting anything (unknown id = no key, no promise).
const simModules = import.meta.glob("../sims/*.js");

function simReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { status: "loading", sim: null, controlValues: {} };
    case "ready":
      return { status: "ready", sim: action.sim, controlValues: action.controlValues };
    case "error":
      return { status: "error", sim: null, controlValues: {} };
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
      dispatch({ type: "error" });
      return () => {
        cancelled = true;
      };
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

  return (
    <div className={styles.page}>
      <Link to="/sims" className={styles.back}>
        ← Back to gallery
      </Link>

      <h1 className={styles.title}>{state.sim?.title ?? id}</h1>

      <div className={styles.layout}>
        <div className={styles.canvasWrap}>
          {/* always mounted, regardless of status, so canvasRef.current is
              guaranteed non-null the instant a sim module resolves */}
          <div ref={canvasRef} className={styles.canvas} />
          {state.status === "loading" && (
            <p className={styles.status}>Loading simulation…</p>
          )}
          {state.status === "error" && (
            <p className={styles.status}>Couldn't load simulation "{id}".</p>
          )}
        </div>

        {state.status === "ready" && state.sim && state.sim.controls.length > 0 && (
          <ControlPanel
            controls={state.sim.controls}
            values={state.controlValues}
            onChange={handleControlChange}
          />
        )}
      </div>
    </div>
  );
}
