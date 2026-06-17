"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorLabel.module.css";

export default function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const zones = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor-label]")
    );
    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      setLabel(target.getAttribute("data-cursor-label") ?? "");
      setActive(true);
    };
    const onLeave = () => setActive(false);

    zones.forEach((zone) => {
      zone.addEventListener("mouseenter", onEnter);
      zone.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      zones.forEach((zone) => {
        zone.removeEventListener("mouseenter", onEnter);
        zone.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`${styles.cursor} ${active ? styles.active : ""}`}>
      <span className={styles.dot} />
      <span className={styles.text}>{label}</span>
    </div>
  );
}
