import type { MetadataRoute } from "next";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} · offline SQLite editor`,
    short_name: APP_NAME,
    description: `${APP_TAGLINE}. Works offline; nothing is uploaded.`,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#202020",
    theme_color: "#202020",
    categories: ["developer", "productivity", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    file_handlers: [
      {
        action: "/app",
        accept: { "application/vnd.sqlite3": [".sqlite", ".sqlite3", ".db", ".db3"] },
      },
    ],
  };
}
