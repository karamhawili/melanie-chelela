import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Every page here is static, so Next keeps prefetched pages in the
    // browser's router cache and navigates to them without touching the
    // server. Default is 5 minutes, during which a guest whose invite was
    // just revoked can keep clicking between already-loaded pages. 30s
    // keeps instant prefetched navigation for normal browsing while letting
    // the gate (src/proxy.ts) get a say again soon after revocation.
    staleTimes: {
      static: 30,
    },
  },
  images: {
    // Sanity's CDN does the resizing; see src/sanity/lib/imageLoader.ts for
    // why Next's own optimizer is bypassed. (remotePatterns only governs
    // that optimizer, so it has nothing to allow here any more.)
    loader: "custom",
    loaderFile: "./src/sanity/lib/imageLoader.ts",
  },
};

export default nextConfig;
