"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Plan } from "@/sanity/lib/types";
import PdfPage from "./PdfPage";
import styles from "./PlanFigure.module.css";

// The viewer is only ever needed after a click, so it stays out of the
// page's bundle until then.
const PdfLightbox = dynamic(() => import("./PdfLightbox"));

interface PlanFigureProps {
  plan: Plan;
  /** next/image `sizes` for the column this plan occupies. */
  sizes: string;
  /** Width ÷ height resolved from the block override, the plan, or the count default. */
  ratio: number;
  /**
   * True when that ratio is only a fallback — no override anywhere — so a
   * PDF may replace it with the real page proportions once measured.
   */
  measurable: boolean;
}

/**
 * One plan in a technical-plans set. An image plan and a PDF plan get the
 * same frame, the same contain-fit, the same caption and the same gold
 * inset rule; the PDF additionally offers a full-screen viewer.
 */
export default function PlanFigure({ plan, sizes, ratio, measurable }: PlanFigureProps) {
  const [measured, setMeasured] = useState(0);
  const [open, setOpen] = useState(false);

  const isPdf = plan.kind === "pdf";
  const effectiveRatio = measurable && measured > 0 ? measured : ratio;

  return (
    <>
      <figure
        data-cursor-label={plan.label}
        className={styles.figure}
        style={{ "--plan-ratio": effectiveRatio } as React.CSSProperties}
      >
        <div className={styles.drawing}>
          {isPdf ? (
            <>
              <PdfPage src={plan.src} ariaLabel={plan.alt} onRatio={setMeasured} />
              <button
                type="button"
                className={styles.expand}
                onClick={() => setOpen(true)}
                aria-label={`View ${plan.label || plan.alt} full screen`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                  <path
                    d="M3.5 9V3.5H9 M15 3.5h5.5V9 M20.5 15v5.5H15 M9 20.5H3.5V15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </>
          ) : (
            <Image src={plan.src} alt={plan.alt} fill sizes={sizes} className={styles.image} />
          )}
          <div className={styles.inset} />
        </div>
        {(plan.fig || plan.label) && (
          <figcaption className={styles.caption}>
            <span>{plan.label}</span>
            {plan.fig && <span className={styles.captionFig}>{plan.fig}</span>}
          </figcaption>
        )}
      </figure>

      {open && (
        <PdfLightbox
          src={plan.src}
          label={plan.label}
          fig={plan.fig}
          alt={plan.alt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
