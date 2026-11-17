import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Everything runs in the browser (SQLite WASM + OPFS), so the app ships as static files.
  output: "export",
  reactCompiler: true,
  experimental: {
    // Policy for `next upgrade --agent` and upgrade reminders: flag security advisories only.
    agentUpgrade: "security",
  },
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
