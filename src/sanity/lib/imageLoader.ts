"use client";

import type { ImageLoaderProps } from "next/image";

// Wired in via next.config.ts `images.loaderFile`, so this runs for every
// <Image> in the site in place of Next's own optimizer.
//
// Why: Next's optimizer would otherwise fetch each Sanity image server-side
// before re-encoding it, with a hard-coded 7s limit (image-optimizer.js,
// `AbortSignal.timeout(7000)`). A cold Sanity transform of one of the
// 4096² plan PNGs takes 5–9s, so on any empty cache — a fresh dev server,
// every new Vercel deploy — whole pages came up as 500s. Sanity is already
// an image CDN with per-width transforms; handing it `w` directly removes
// the server-side fetch, and with it the timeout, entirely. The browser
// negotiates the format itself (`auto=format`), which is what Next's
// server-side fetch could never do.
//
// `src` is the bare asset URL from resolveImageUrl(), which already carries
// `rect=` for editor crops — it is extended, never rebuilt, so crops survive.

const SANITY_IMAGE_ORIGIN = "https://cdn.sanity.io/images/";

export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Anything not on Sanity's image CDN (a local /public asset, say) has no
  // transform API to talk to — serve it as-is.
  if (!src.startsWith(SANITY_IMAGE_ORIGIN)) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  // Never upscale a source narrower than the requested slot.
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", String(quality ?? 75));
  return url.href;
}
