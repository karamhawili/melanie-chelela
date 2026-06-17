import styles from "./FactItem.module.css";

interface FactItemProps {
  label: string;
  value: string;
  /** Gold value color, used for Year/Status-type highlighted facts. */
  accent?: boolean;
  // Defaults match Terra Mare's fact grids (Hero, Overview, Credits).
  // All Works' project meta rows use gap 6, labelSize 8.5, labelLetterSpacing
  // "0.24em", valueSize 12.5, valueLetterSpacing "normal" — pass explicitly.
  gap?: number;
  labelSize?: number;
  labelLetterSpacing?: string;
  valueSize?: number;
  valueLetterSpacing?: string;
}

export default function FactItem({
  label,
  value,
  accent = false,
  gap = 7,
  labelSize = 9,
  labelLetterSpacing = "0.26em",
  valueSize = 13,
  valueLetterSpacing = "0.02em",
}: FactItemProps) {
  return (
    <div className={styles.item} style={{ gap }}>
      <span
        className={styles.label}
        style={{ fontSize: labelSize, letterSpacing: labelLetterSpacing }}
      >
        {label}
      </span>
      <span
        className={`${styles.value} ${accent ? styles.accent : ""}`}
        style={{ fontSize: valueSize, letterSpacing: valueLetterSpacing }}
      >
        {value}
      </span>
    </div>
  );
}
