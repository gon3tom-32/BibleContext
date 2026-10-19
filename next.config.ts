import type { NextConfig } from "next";

// Static export: every page is built to plain HTML in `out/`.
// BASE_PATH is set when the site lives in a subfolder, e.g. "/BibleContext"
// on GitHub Pages. Leave it unset for local development.
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
