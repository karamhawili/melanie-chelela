"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

// Window after mount during which an already-in-view reveal skips its
// transition, so first-paint content doesn't visibly animate in late.
const INITIAL_WINDOW_MS = 280;
// Forces a reveal if the observer never fires (e.g. zero-height ancestors).
const SAFETY_TIMEOUT_MS = 2800;

type ScrollRevealOwnProps<T extends ElementType> = {
  as?: T;
  /** Starting translateY offset in px. */
  y?: number;
  /** Transition duration in seconds. */
  duration?: number;
  /** Transition delay in seconds. */
  delay?: number;
  threshold?: number;
  rootMargin?: string;
};

type ScrollRevealProps<T extends ElementType> = ScrollRevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ScrollRevealOwnProps<T>>;

export default function ScrollReveal<T extends ElementType = "div">({
  as,
  y = 20,
  duration = 1,
  delay = 0,
  threshold = 0,
  rootMargin = "0px 0px -10% 0px",
  style,
  ...rest
}: ScrollRevealProps<T>) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const mountedAt = Date.now();
    const reveal = () => {
      setInstant(Date.now() - mountedAt < INITIAL_WINDOW_MS);
      setRevealed(true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);

    const safety = setTimeout(reveal, SAFETY_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, [threshold, rootMargin]);

  return (
    <Tag
      // Polymorphic `as` defeats TS's element-specific ref typing.
      ref={ref as never}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : `translateY(${y}px)`,
        transition: instant
          ? "none"
          : `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        ...style,
      }}
      {...rest}
    />
  );
}
