import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { APP_NAME, APP_TAGLINE, CLOUDFLARE_ANALYTICS } from "@/lib/constants";
import { resolveSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Only the weights the UI uses (font-normal/medium/semibold/bold and the CSS in
// globals.css and landing.css); Google then serves each file trimmed to them.
// Add a weight here before using it, or the browser fakes it from the nearest one.
const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  subsets: ["latin"],
});
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
const caveat = Caveat({ weight: "400", variable: "--font-caveat", subsets: ["latin"] });

const TITLE = `${APP_NAME} · offline SQLite editor`;
const DESCRIPTION = `${APP_TAGLINE}. Open, browse and edit SQLite databases with nothing uploaded: SQLite runs in your browser and works offline.`;

const SITE_URL = resolveSiteUrl(process.env);

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: SITE_URL }),
  title: { default: TITLE, template: `%s · ${APP_NAME}` },
  description: DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "black-translucent" },
  // The share image itself comes from app/opengraph-image.tsx.
  openGraph: { type: "website", siteName: APP_NAME, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  // The on-screen keyboard shrinks the page instead of covering it, so drawer fields stay in view.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${caveat.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Script
          src={CLOUDFLARE_ANALYTICS.scriptUrl}
          data-cf-beacon={JSON.stringify({ token: CLOUDFLARE_ANALYTICS.token })}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
