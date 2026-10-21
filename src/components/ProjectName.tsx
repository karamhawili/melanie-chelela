import type { TitleLine } from "@/sanity/lib/types";
import styles from "./ProjectName.module.css";

const STYLE_CLASS: Record<TitleLine["style"], string> = {
  regular: "",
  italic: styles.italic,
  gold: styles.gold,
  goldItalic: styles.goldItalic,
};

const SIZE_CLASS: Record<TitleLine["size"], string> = {
  small: styles.small,
  regular: "",
  large: styles.large,
};

/**
 * A project's name as set in display type: one block-level span per line,
 * each in its own voice. Sizes are em factors of the heading it sits in, so
 * the same lines keep their proportions in the hero, on a card and in the
 * pager while each surface keeps its own scale.
 */
export default function ProjectName({ lines }: { lines: TitleLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`${styles.line} ${STYLE_CLASS[line.style]} ${SIZE_CLASS[line.size]}`}>
          {line.text}
        </span>
      ))}
    </>
  );
}
