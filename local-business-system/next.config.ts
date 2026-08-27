import type { NextConfig } from "next";

// STATIC_EXPORT_BASE_PATH is only set for the one-off static export used to
// publish the demo pages under leadsclaude.netlify.app/plantillas/ — normal
// `next dev` / `next build` runs are unaffected (basePath stays "").
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.STATIC_EXPORT_BASE_PATH || "",
};

export default nextConfig;
