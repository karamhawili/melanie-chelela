import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  /** Section number, e.g. "01". Omit for unnumbered eyebrows (masthead, closing). */
  number?: string;
  label: string;
  /** Hairline rule placement. Studio's Direction B sections have none. */
  rule?: "left" | "right" | "both";
  gap?: number;
  ruleWidth?: number;
  letterSpacing?: string;
}

export default function Eyebrow({
  number,
  label,
  rule,
  gap = 13,
  ruleWidth = 40,
  letterSpacing = "0.3em",
}: EyebrowProps) {
  const ruleEl = <span className={styles.rule} style={{ width: ruleWidth }} />;

  return (
    <div className={styles.eyebrow} style={{ gap }}>
      {number && <span className={styles.number}>{number}</span>}
      {(rule === "left" || rule === "both") && ruleEl}
      <span className={styles.label} style={{ letterSpacing }}>
        {label}
      </span>
      {(rule === "right" || rule === "both") && ruleEl}
    </div>
  );
}
