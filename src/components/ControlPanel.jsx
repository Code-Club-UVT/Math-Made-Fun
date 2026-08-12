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
        value={value}
        onChange={(e) => onChange(control.id, Number(e.target.value))}
        className={styles.slider}
      />
    </div>
  );
}

// Add new control-type renderers here as the contract grows; never edit
// the render loop below to special-case a type.
const CONTROL_RENDERERS = {
  range: RangeControl,
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
