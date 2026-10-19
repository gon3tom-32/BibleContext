import type { NextConfig } from "next";

// Static export: every page is built to plain HTML in `out/`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
