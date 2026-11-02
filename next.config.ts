import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Hostinger shared builds hit process/thread limits with default worker counts.
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  // Cookie-session dashboards need request-time auth; Cache Components
  // Insights overlays fire on every cookies()/Prisma access without Suspense.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
