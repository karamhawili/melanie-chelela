"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// translate3d multiplier from the source's parallax formula; constant across
// every usage in the design, so it isn't exposed as a prop.
const PARALLAX_STRENGTH = 54;

interface ParallaxProps {
  src: string;
  alt: string;
  enabled?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Image height as % of its container — oversized so it has room to translate. */
  oversizeHeight?: number;
  /** Negative top offset (%) that centers the oversized image in its container. */
  offsetTop?: number;
}

export default function Parallax({
  src,
  alt,
  enabled = true,
  priority = false,
  sizes = "100vw",
  oversizeHeight = 116,
  offsetTop = -8,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < -200 || rect.top > viewport + 200) return;
      const center = rect.top + rect.height / 2;
      const offset = ((center - viewport / 2) / viewport) * -PARALLAX_STRENGTH;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        top: `${offsetTop}%`,
        width: "100%",
        height: `${oversizeHeight}%`,
        willChange: "transform",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
