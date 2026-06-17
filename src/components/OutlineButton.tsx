import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./OutlineButton.module.css";

interface OutlineButtonProps {
  href: string;
  children: ReactNode;
  /** Trailing de-emphasized text, e.g. "/ 6" in "View All Projects / 6". */
  suffix?: string;
  /** Padding varies slightly per usage in source (15px 26-30px / 16px 32-34px). */
  padding?: string;
}

export default function OutlineButton({
  href,
  children,
  suffix,
  padding,
}: OutlineButtonProps) {
  return (
    <Link href={href} className={styles.button} style={padding ? { padding } : undefined}>
      <span className={styles.label}>{children}</span>
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </Link>
  );
}
