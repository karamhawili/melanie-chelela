"use client";

import { useCallback, useEffect, useRef, useState, type AnimationEvent } from "react";
import styles from "./LoadingSignature.module.css";

interface LoadingSignatureProps {
  /** The name written in the signature face. */
  name: string;
  /** Optional small caption beneath the signature. */
  caption?: string;
}

// Forces the curtain away if `animationend` never arrives (an animation
// cancelled by a stylesheet swap, say) — the page must never stay covered.
const SAFETY_TIMEOUT_MS = 6500;

/**
 * First-load curtain: the signature is wiped in left-to-right over a faint
 * ghost of itself while a hairline fills along the bottom edge, then the
 * whole curtain lifts off the top of the viewport. The timeline is pure CSS
 * (see the module), so it starts at first paint rather than at hydration;
 * JS only unlocks scrolling and removes the node once the lift has ended.
 *
 * Timing is read from `--loader-*` custom properties on an ancestor so the
 * page can delay its own entrance to the moment the curtain clears
 * (`--intro-delay` in app/redesign/layout.module.css).
 */
export default function LoadingSignature({ name, caption }: LoadingSignatureProps) {
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    // Later client-side navigations shouldn't wait for a curtain that is
    // no longer there: zero the delay every intro animation reads.
    document.documentElement.style.setProperty("--intro-done", "0s");
    setDone(true);
  }, []);

  useEffect(() => {
    if (done) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const safety = window.setTimeout(finish, SAFETY_TIMEOUT_MS);
    return () => {
      root.style.overflow = previous;
      window.clearTimeout(safety);
    };
  }, [done, finish]);

  if (done) return null;

  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    // Children's animations bubble up too; only the curtain's own lift counts.
    if (event.target === event.currentTarget) finish();
  };

  return (
    <div className={styles.curtain} role="status" aria-label="Loading" onAnimationEnd={onAnimationEnd}>
      <div className={styles.stage}>
        <div className={styles.signature} aria-hidden="true">
          <span className={styles.ghost}>{name}</span>
          <span className={styles.ink}>{name}</span>
        </div>
        {caption && <span className={styles.caption}>{caption}</span>}
      </div>
      <div className={styles.bar} aria-hidden="true" />
    </div>
  );
}
