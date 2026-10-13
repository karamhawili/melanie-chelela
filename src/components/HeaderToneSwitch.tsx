"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// Height of the strip under the fixed header that decides the tone.
const BAND_PX = 72;

/**
 * Flips `<html data-header-tone>` between "overlay" while the element marked
 * `data-header-sentinel` (a full-bleed hero) sits beneath the header, and
 * "page" once it has scrolled out. Header's `tone="overlay"` styles read it.
 * Renders nothing; mount it once on any page that uses the overlay header.
 *
 * The hero is looked up afresh on every check rather than captured once, so
 * the switch keeps working when the hero node is replaced (Fast Refresh, a
 * re-render with other content), and the first check runs before paint so
 * a route change never shows the previous page's tone. A page that changes
 * its content without changing pathname (details' `?slug=`) remounts it
 * with a `key`.
 */
export default function HeaderToneSwitch() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const check = () => {
      raf = 0;
      const sentinel = document.querySelector<HTMLElement>("[data-header-sentinel]");
      const underHeader = sentinel !== null && sentinel.getBoundingClientRect().bottom > BAND_PX;
      root.dataset.headerTone = underHeader ? "overlay" : "page";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      delete root.dataset.headerTone;
    };
    // Re-evaluate whenever the route changes.
  }, [pathname]);

  return null;
}
