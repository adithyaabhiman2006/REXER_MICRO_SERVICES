/**
 * Rexer Micro-Tools — Next.js config.
 *
 * `output: "export"` produces a fully static site (no Node server needed),
 * which is what lets us host it on GitHub Pages, Vercel, Netlify, or any
 * static host. basePath is env-driven so the same code works locally
 * (basePath = "") and on a GitHub Pages project site
 * (basePath = "/REXER_MICRO_SERVICES").
 */
const isExport = process.env.EXPORT_STATIC === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — required for GitHub Pages / static hosting.
  ...(isExport ? { output: "export" } : {}),
  // Serve under a subpath on project Pages; nothing locally.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Static export can't run the image optimizer.
  images: { unoptimized: true },
  // Emit trailing slashes so Pages routing resolves cleanly.
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
