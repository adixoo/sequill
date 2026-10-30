// @ts-check
/**
 * Service worker build for `serwist build` (Serwist's Next.js configurator mode),
 * run after `next build`. It bundles src/sw/sw.ts with the precache list and
 * writes it straight into the static export as out/sw.js.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { serwist } from "@serwist/next/config";

/** Files Next.js generates from src/app (manifest.ts, icons); revisioned by content. */
const generated = ["manifest.webmanifest", "favicon.ico", "icon.ico", "apple-icon.png"];
const revisionOf = (file) =>
  createHash("md5")
    .update(readFileSync(`.next/server/app/${file}.body`))
    .digest("hex");

export default serwist({
  swSrc: "src/sw/sw.ts",
  swDest: "out/sw.js",
  // Prerendered pages (/, /app, /vis) are added by Serwist from .next/server/app.
  globPatterns: [
    // Chunks, styles and fonts; Next.js already puts content hashes in these URLs.
    ".next/static/**/*.{js,css,woff2}",
    // The SQLite runtime and the icons.
    "public/**/*.{js,mjs,wasm,svg,png,ico}",
  ],
  additionalPrecacheEntries: generated.map((file) => ({
    url: `/${file}`,
    revision: revisionOf(file),
  })),
  // The SQLite wasm is ~0.9 MB; allow it with headroom.
  maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
});
