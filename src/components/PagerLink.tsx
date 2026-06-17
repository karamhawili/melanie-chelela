import Link from "next/link";
import styles from "./PagerLink.module.css";

interface PagerLinkProps {
  href: string;
  label: string;
  title: string;
  arrow: "left" | "right";
  /** "row" = All Works' single full-width cell; "column" = Terra Mare's prev/next cells. */
  layout?: "row" | "column";
  align?: "start" | "end";
  /** Title font-size override — Terra Mare's prev/next cells use different sizes. */
  titleSize?: string;
  /** Adds the border-right separator between Terra Mare's prev/next cells. */
  bordered?: boolean;
  padding?: string;
  gap?: string;
}

export default function PagerLink({
  href,
  label,
  title,
  arrow,
  layout = "column",
  align = "start",
  titleSize,
  bordered = false,
  padding,
  gap,
}: PagerLinkProps) {
  return (
    <Link
      href={href}
      className={`${styles.pager} ${styles[layout]} ${styles[align]} ${
        bordered ? styles.bordered : ""
      }`}
      style={{ padding, gap }}
    >
      <span className={styles.label}>
        {arrow === "left" && <span className={styles.arrow}>←</span>}
        {label}
        {arrow === "right" && <span className={styles.arrow}>→</span>}
      </span>
      <span className={styles.title} style={titleSize ? { fontSize: titleSize } : undefined}>
        {title}
      </span>
    </Link>
  );
}
