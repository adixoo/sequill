import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Everything runs in the browser (SQLite WASM + OPFS), so the app ships as static files.
  output: "export",
  reactCompiler: true,
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
