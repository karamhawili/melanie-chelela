import type { TitleLine } from "@/sanity/lib/types";
import styles from "./ProjectName.module.css";

const STYLE_CLASS: Record<TitleLine["style"], string> = {
  regular: "",
  italic: styles.italic,
  gold: styles.gold,
  goldItalic: styles.goldItalic,
};

/**
 * A project's name as set in display type: one block-level span per line,
 * each in its own voice. It sets no size — the heading it sits in does — so
 * the same lines read correctly in the hero, on a card and in the pager.
 */
export default function ProjectName({ lines }: { lines: TitleLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`${styles.line} ${STYLE_CLASS[line.style]}`}>
          {line.text}
        </span>
      ))}
    </>
  );
}
