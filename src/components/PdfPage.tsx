"use client";

import { useEffect, useRef, useState } from "react";
import { fitCanvasScale, loadPdfDocument } from "@/lib/pdf";
import styles from "./PdfPage.module.css";

interface PdfPageProps {
  src: string;
  /** 1-based, as pdf.js counts them. */
  pageNumber?: number;
  className?: string;
  /** Reports width ÷ height of the page box once it is known. */
  onRatio?: (ratio: number) => void;
  onPageCount?: (count: number) => void;
  onError?: () => void;
  /** Kept off-screen readers when the page is decorative (lightbox). */
  ariaLabel?: string;
}

// A re-render is only worth its cost when the frame grew enough to show it.
const RESIZE_THRESHOLD = 1.15;

/**
 * Draws one page of a PDF into a canvas at the container's own size, on a
 * transparent ground so a line drawing sits on the ivory page exactly as a
 * transparent PNG would. The canvas keeps the page's intrinsic proportions
 * and is `contain`-fitted, so it is never stretched or cropped.
 */
export default function PdfPage({
  src,
  pageNumber = 1,
  className,
  onRatio,
  onPageCount,
  onError,
  ariaLabel,
}: PdfPageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [failed, setFailed] = useState(false);

  // Latest callbacks without making them render triggers — the render
  // effect below must not restart just because a parent passed a new
  // inline closure.
  const callbacks = useRef({ onRatio, onPageCount, onError });
  useEffect(() => {
    callbacks.current = { onRatio, onPageCount, onError };
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !src) return;

    let disposed = false;
    let renderedAtWidth = 0;
    let running: { cancel: () => void } | null = null;
    let queued: number | null = null;

    const draw = async (cssWidth: number) => {
      try {
        const doc = await loadPdfDocument(src);
        if (disposed) return;
        callbacks.current.onPageCount?.(doc.numPages);

        const page = await doc.getPage(Math.min(pageNumber, doc.numPages));
        if (disposed) return;

        const base = page.getViewport({ scale: 1 });
        callbacks.current.onRatio?.(base.width / base.height);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const scale = fitCanvasScale((cssWidth * dpr) / base.width, base.width, base.height);
        const viewport = page.getViewport({ scale });

        running?.cancel();
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        const context = canvas.getContext("2d");
        if (!context) return;

        const task = page.render({
          canvas,
          canvasContext: context,
          viewport,
          // pdf.js paints white by default; a plan has to keep the page behind it.
          background: "rgba(0, 0, 0, 0)",
        });
        running = task;
        await task.promise;
        if (disposed) return;

        renderedAtWidth = cssWidth;
        setDrawn(true);
      } catch (error) {
        // Cancelling a render to start a sharper one is not a failure.
        if (disposed || (error as { name?: string })?.name === "RenderingCancelledException") return;
        console.error(`Could not render PDF page ${pageNumber}`, error);
        setFailed(true);
        callbacks.current.onError?.();
      }
    };

    const measure = () => {
      const width = host.clientWidth;
      if (width < 1) return;
      if (renderedAtWidth && width <= renderedAtWidth * RESIZE_THRESHOLD) return;
      window.clearTimeout(queued ?? undefined);
      queued = window.setTimeout(() => void draw(width), renderedAtWidth ? 180 : 0);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(queued ?? undefined);
      running?.cancel();
    };
  }, [src, pageNumber]);

  return (
    <div ref={hostRef} className={`${styles.host} ${className ?? ""}`} data-state={failed ? "failed" : drawn ? "drawn" : "loading"}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role={ariaLabel ? "img" : "presentation"}
        aria-label={ariaLabel}
      />
      {!drawn && !failed && <span className={styles.shimmer} aria-hidden="true" />}
      {failed && <span className={styles.failed}>Drawing unavailable</span>}
    </div>
  );
}
