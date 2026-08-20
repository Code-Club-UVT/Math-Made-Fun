import { useState } from "react";
import { CONTENT } from "../content.js";
import { useLang } from "../langContext.js";
import styles from "./ControlPanel.module.css";

// The value readout doubles as a number field: drag the handle for feel, or
// click the number and type an exact one. Nothing in the contract changed —
// this is still a plain `type: "range"` control, so every sim gets it.
function RangeControl({ control, label, value, onChange }) {
  // While the field is being typed into it holds its own text. Without this,
  // clearing the box to type "47" would clamp to `min` on the empty string and
  // fight the user for every keystroke. `null` means "just mirror the value".
  const [draft, setDraft] = useState(null);

  const inRange = (n) => n >= control.min && n <= control.max;

  // Push through only while the typed text is already a usable value, so the
  // canvas keeps up live; anything half-typed just sits in the box.
  function pushIfValid(raw) {
    const n = Number(raw);
    if (raw !== "" && Number.isFinite(n) && inRange(n)) onChange(control.id, n);
  }

  // On blur/Enter, salvage whatever was typed: clamp it into range, or drop
  // back to the current value if it was nonsense.
  function commit() {
    const n = Number(draft);
    if (draft !== null && draft !== "" && Number.isFinite(n)) {
      onChange(control.id, Math.min(control.max, Math.max(control.min, n)));
    }
    setDraft(null);
  }

  return (
    <div className={styles.controlRow}>
      <div className={styles.labelRow}>
        <label htmlFor={control.id}>{label}</label>
        <input
          type="number"
          className={styles.valueInput}
          value={draft ?? value}
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          aria-label={label}
          onChange={(e) => {
            setDraft(e.target.value);
            pushIfValid(e.target.value);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
              e.currentTarget.blur();
            }
          }}
        />
      </div>
      <input
        id={control.id}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step ?? 1}
        value={value}
        onChange={(e) => {
          setDraft(null); // dragging wins over anything half-typed
          onChange(control.id, Number(e.target.value));
        }}
        className={styles.slider}
      />
    </div>
  );
}

// Boolean control, rendered as a single toggling button.
//
// Two flavours. Without `kind`, it is a playback control and reads
// "Play <label>" / "Pause <label>" — that is what the animated sims use.
// With `kind: "switch"` it is an ordinary either/or setting and simply names
// the state it is in, taking its two captions from a `{ on, off }` entry in
// content.js. Before this existed, every boolean got the playback wording, so
// a "3 angles" switch would have read "Play 3 angles".
function ToggleControl({ control, label, value, onChange, t }) {
  const isSwitch = control.kind === "switch";

  // Normalise the dual-typed label once. A plain string stands in for both
  // states when no `{ on, off }` translation exists yet — wrong-ish, but
  // never nonsense.
  const on = typeof label === "object" ? label.on : label;
  const off = typeof label === "object" ? label.off : label;

  const text = isSwitch ? (value ? on : off) : value ? t.pause(on) : t.play(on);

  return (
    <button
      type="button"
      id={control.id}
      onClick={() => onChange(control.id, !value)}
      aria-pressed={value}
      className={`${styles.toggle} ${isSwitch ? styles.switch : ""}`}
    >
      {text}
    </button>
  );
}

// Add new control-type renderers here as the contract grows; never edit
// the render loop below to special-case a type.
const CONTROL_RENDERERS = {
  range: RangeControl,
  toggle: ToggleControl,
};

export default function ControlPanel({ simId, controls, values, onChange }) {
  const { lang } = useLang();
  const t = CONTENT[lang].controls;

  return (
    <div className={styles.panel}>
      {controls.map((control) => {
        const Renderer = CONTROL_RENDERERS[control.type];
        if (!Renderer) return null;
        // Falls back to the sim module's own label when there's no
        // translation yet — a sim delivered after this file was last touched
        // still renders, just in the contributor's English.
        const label = t.labels[simId]?.[control.id] ?? control.label;
        return (
          <Renderer
            key={control.id}
            control={control}
            label={label}
            value={values[control.id]}
            onChange={onChange}
            t={t}
          />
        );
      })}
    </div>
  );
}
