import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Matches the trailing-slash URL structure of the previous site
  // (/toldos/, /pergolas/...) so old links keep working without redirects.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
