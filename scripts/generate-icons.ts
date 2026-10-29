/** Renders the app icon SVG into the PNG sizes the web manifest needs. Run once: bun scripts/generate-icons.ts */
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dir, "..");
const svg = await Bun.file(join(root, "src", "app", "icon.svg")).arrayBuffer();

// Maskable icons need the artwork inside the central 80% safe zone.
const maskable = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><rect width="640" height="640" fill="#0a0a0b"/>` +
    `<image href="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" x="64" y="64" width="512" height="512"/></svg>`,
);

const jobs = [
  { src: Buffer.from(svg), size: 192, name: "icon-192.png" },
  { src: Buffer.from(svg), size: 512, name: "icon-512.png" },
  { src: maskable, size: 512, name: "maskable-512.png" },
  { src: Buffer.from(svg), size: 180, name: "apple-touch-icon.png" },
];
for (const job of jobs) {
  await sharp(job.src, { density: 384 })
    .resize(job.size, job.size)
    .png()
    .toFile(join(root, "public", "icons", job.name));
  console.log(`public/icons/${job.name}`);
}
