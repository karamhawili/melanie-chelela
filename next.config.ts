import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's CDN does the resizing; see src/sanity/lib/imageLoader.ts for
    // why Next's own optimizer is bypassed. (remotePatterns only governs
    // that optimizer, so it has nothing to allow here any more.)
    loader: "custom",
    loaderFile: "./src/sanity/lib/imageLoader.ts",
  },
};

export default nextConfig;
