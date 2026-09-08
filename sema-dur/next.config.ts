import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Matches the trailing-slash URL structure of the previous WordPress site
  // (/contacto/, /tipos-de-herramientas-de-corte/…) so old links keep working.
  trailingSlash: true,
  images: {
    // Static export: images are pre-optimised by scripts/fetch-assets.mjs.
    unoptimized: true,
  },
};

export default nextConfig;
