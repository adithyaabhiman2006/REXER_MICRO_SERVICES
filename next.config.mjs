/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tree-shake per-icon imports to keep the client bundle small.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
