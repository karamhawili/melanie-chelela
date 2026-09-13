"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PdfPage from "./PdfPage";
import styles from "./PdfLightbox.module.css";

interface PdfLightboxProps {
  src: string;
  label: string;
  fig?: string;
  alt: string;
  onClose: () => void;
}

// Kept in step with the overlay transition in PdfLightbox.module.css.
const EXIT_MS = 260;

export default function PdfLightbox({ src, label, fig, alt, onClose }: PdfLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [ratios, setRatios] = useState<Record<number, number>>({});

  const exitTimer = useRef(0);
  const requestClose = useCallback(() => {
    setVisible(false);
    exitTimer.current = window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  // Anywhere that isn't the drawing itself or the bar dismisses the viewer.
  const onSurfaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const hit = event.target as HTMLElement;
    if (hit.closest(`.${styles.page}`) || hit.closest(`.${styles.bar}`)) return;
    requestClose();
  };

  // Play in on the frame after mount so the transition has a start value.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Hold the page still behind the overlay, padding out the width the
  // scrollbar gives back so the layout underneath doesn't jump.
  useEffect(() => {
    const root = document.documentElement;
    const gutter = window.innerWidth - root.clientWidth;
    const { overflow, paddingRight } = root.style;
    root.style.overflow = "hidden";
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
    };
  }, []);

  // Escape closes; Tab stays inside the dialog; focus returns to whatever
  // opened it (the plan's expand button).
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>("button, [href], [tabindex]") ?? []
      ).filter((el) => el.tabIndex >= 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      // Clicking the drawing blurs the close button onto <body>; without
      // this, the next Tab would escape to the page behind the overlay.
      if (!active || !overlayRef.current?.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [requestClose]);

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-visible={visible || undefined}
      role="dialog"
      aria-modal="true"
      aria-label={label || alt}
      onClick={onSurfaceClick}
    >
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.bar}>
        <div className={styles.meta}>
          <span className={styles.metaLabel}>{label}</span>
          {fig && <span className={styles.metaFig}>{fig}</span>}
          {pageCount > 1 && <span className={styles.metaFig}>{pageCount} pages</span>}
        </div>
        <button ref={closeRef} type="button" className={styles.close} onClick={requestClose}>
          <span className={styles.closeText}>Close</span>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path
              d="M6 6 L18 18 M18 6 L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.pages}>
          {pages.map((pageNumber) => (
            <div
              key={pageNumber}
              className={styles.page}
              style={{ "--page-ratio": ratios[pageNumber] ?? 1.414 } as React.CSSProperties}
            >
              <PdfPage
                src={src}
                pageNumber={pageNumber}
                ariaLabel={pageNumber === 1 ? alt : `${alt} — page ${pageNumber}`}
                onPageCount={setPageCount}
                onRatio={(ratio) =>
                  setRatios((current) =>
                    current[pageNumber] === ratio ? current : { ...current, [pageNumber]: ratio }
                  )
                }
              />
              <span className={styles.pageInset} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
