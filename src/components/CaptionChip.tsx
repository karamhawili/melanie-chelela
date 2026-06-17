import type { CSSProperties, ElementType, ReactNode } from "react";
import styles from "./CaptionChip.module.css";

interface CaptionChipProps {
  /** Root element — "figcaption" inside a <figure>, "div" elsewhere (e.g. BeforeAfter). */
  as?: ElementType;
  children?: ReactNode;
  /** When given together with `label`, renders the two-part "Fig. 01 — Label" layout. */
  fig?: string;
  label?: string;
  fontSize?: number;
  letterSpacing?: string;
  style?: CSSProperties;
  className?: string;
}

export default function CaptionChip({
  as: Tag = "figcaption",
  children,
  fig,
  label,
  fontSize,
  letterSpacing = "0.24em",
  style,
  className,
}: CaptionChipProps) {
  const isTwoPart = Boolean(fig && label);

  return (
    <Tag
      className={`${styles.chip} ${className ?? ""}`}
      style={{
        fontSize: fontSize ?? (isTwoPart ? 9 : 8.5),
        letterSpacing,
        ...style,
      }}
    >
      {isTwoPart ? (
        <span className={styles.twoPart}>
          <span>{fig}</span>
          <span className={styles.divider} />
          <span>{label}</span>
        </span>
      ) : (
        children
      )}
    </Tag>
  );
}
