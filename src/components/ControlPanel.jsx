import styles from "./ControlPanel.module.css";

function RangeControl({ control, value, onChange }) {
  return (
    <div className={styles.controlRow}>
      <div className={styles.labelRow}>
        <label htmlFor={control.id}>{control.label}</label>
        <span className={styles.value}>{value}</span>
      </div>
      <input
        id={control.id}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step ?? 1}
        value={value}
        onChange={(e) => onChange(control.id, Number(e.target.value))}
        className={styles.slider}
      />
    </div>
  );
}

// Boolean control, rendered as a single toggling button. Used for playback
// (play/pause) on the animated sims; `value` is true when running.
function ToggleControl({ control, value, onChange }) {
  return (
    <button
      type="button"
      id={control.id}
      onClick={() => onChange(control.id, !value)}
      aria-pressed={value}
      className={styles.toggle}
    >
      {value ? `Pause ${control.label}` : `Play ${control.label}`}
    </button>
  );
}

// Add new control-type renderers here as the contract grows; never edit
// the render loop below to special-case a type.
const CONTROL_RENDERERS = {
  range: RangeControl,
  toggle: ToggleControl,
};

export default function ControlPanel({ controls, values, onChange }) {
  return (
    <div className={styles.panel}>
      {controls.map((control) => {
        const Renderer = CONTROL_RENDERERS[control.type];
        if (!Renderer) return null;
        return (
          <Renderer
            key={control.id}
            control={control}
            value={values[control.id]}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}
