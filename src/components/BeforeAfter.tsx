"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import CaptionChip from "./CaptionChip";
import styles from "./BeforeAfter.module.css";

interface BeforeAfterProps {
  beforeSrc: string;
  beforeAlt: string;
  beforeLabel?: string;
  afterSrc: string;
  afterAlt: string;
  afterLabel?: string;
  caption?: string;
}

export default function BeforeAfter({
  beforeSrc,
  beforeAlt,
  beforeLabel = "Closed",
  afterSrc,
  afterAlt,
  afterLabel = "Open",
  caption,
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current && innerRef.current) {
        innerRef.current.style.width = `${containerRef.current.clientWidth}px`;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const setPct = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !wrapRef.current || !handleRef.current) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    wrapRef.current.style.width = `${pct}%`;
    handleRef.current.style.left = `${pct}%`;
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    setPct(e.clientX);
    e.preventDefault();
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) setPct(e.clientX);
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={styles.split}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(min-width: 1340px) 1340px, 100vw"
        className={styles.afterImage}
      />

      <div ref={wrapRef} className={styles.beforeWrap} style={{ width: "50%" }}>
        <div ref={innerRef} className={styles.beforeInner}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1340px) 1340px, 100vw"
            className={styles.beforeImage}
          />
        </div>
      </div>

      <CaptionChip
        as="div"
        fontSize={9}
        letterSpacing="0.26em"
        style={{ bottom: 18, left: "clamp(16px, 2.4vw, 30px)", pointerEvents: "none" }}
      >
        {beforeLabel}
      </CaptionChip>
      <CaptionChip
        as="div"
        fontSize={9}
        letterSpacing="0.26em"
        style={{ bottom: 18, right: "clamp(16px, 2.4vw, 30px)", left: "auto", pointerEvents: "none" }}
      >
        {afterLabel}
      </CaptionChip>

      <div ref={handleRef} className={styles.handle} style={{ left: "50%" }}>
        <div className={styles.knob}>↔</div>
      </div>

      {caption && (
        <CaptionChip
          as="div"
          fontSize={9}
          style={{ top: 18, bottom: "auto", left: "clamp(16px, 2.4vw, 30px)", pointerEvents: "none" }}
        >
          {caption}
        </CaptionChip>
      )}
    </div>
  );
}
