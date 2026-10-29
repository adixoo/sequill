/**
 * Post-build step: bundles src/sw/sw.ts and injects the list of files in out/
 * to precache, writing out/sw.js. Run after `next build` (static export).
 */
import { injectManifest } from "@serwist/build";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const outDir = join(root, "out");
const tmpDir = join(root, ".next", "sw-build");

const bundle = await Bun.build({
  entrypoints: [join(root, "src", "sw", "sw.ts")],
  outdir: tmpDir,
  target: "browser",
  format: "iife",
  minify: true,
});
if (!bundle.success) {
  for (const log of bundle.logs) console.error(log);
  throw new Error("Service worker bundle failed");
}

const { count, size, warnings } = await injectManifest({
  swSrc: join(tmpDir, "sw.js"),
  swDest: join(outDir, "sw.js"),
  globDirectory: outDir,
  globPatterns: ["**/*.{html,txt,js,mjs,css,woff2,wasm,svg,png,ico,webmanifest,json}"],
  globIgnores: ["sw.js", "404.html"],
  // The SQLite wasm is ~0.9 MB; allow it with headroom.
  maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
  // Next.js already puts content hashes in these URLs.
  dontCacheBustURLsMatching: /^_next\/static\//,
});
for (const w of warnings) console.warn(w);
console.log(`Service worker: precaching ${count} files (${(size / 1024 / 1024).toFixed(2)} MB)`);
