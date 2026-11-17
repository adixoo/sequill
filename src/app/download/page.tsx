import type { Metadata } from "next";
import Link from "next/link";
import { BrowserInstall } from "@/components/download/browser-install";
import { Platforms } from "@/components/download/platforms";
import { PrimaryDownload } from "@/components/download/primary-download";
import { ReleaseNotes } from "@/components/download/release-notes";
import { SameApp } from "@/components/download/same-app";
import { SiteFooter } from "@/components/landing/closing";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { Shot, Tile } from "@/components/landing/tile";
import { APP_NAME } from "@/lib/constants";
import { fetchLatestRelease } from "@/lib/releases";
import "@/components/landing/landing.css";
import "lenis/dist/lenis.css";

export const metadata: Metadata = {
  title: "Download",
  description: `Download ${APP_NAME} for Windows, macOS and Linux, or install it from the browser. Your databases stay on your computer.`,
};

const NAV: [string, string][] = [
  ["/app", "Editor"],
  ["/vis", "Schema designer"],
];

const PAGE_SECTIONS: [string, string][] = [
  ["#platforms", "Every system"],
  ["#browser", "Install from the browser"],
  ["#whats-new", "What’s new"],
];

/** Release dates read the same for every visitor: the build formats them, in UTC. */
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));

/**
 * The desktop app's downloads. Statically generated: the latest release is read
 * from GitHub once, when the site is built.
 */
export default async function DownloadPage() {
  const release = await fetchLatestRelease();
  const files = release?.files ?? [];
  const date = release && formatDate(release.publishedAt);
  return (
    <div id="top" className="ln flex min-h-dvh flex-col overflow-x-clip bg-canvas">
      <ScrollReveal />
      <SmoothScroll />
      <header className="ln-board pt-(--ln-margin)">
        <nav
          aria-label="Main"
          className="col-span-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-(--ln-pad) py-3 lg:col-span-12"
        >
          <Link href="/" className="text-xl font-bold tracking-tight">
            {APP_NAME}
          </Link>
          <ul className="flex gap-6">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="font-semibold underline-offset-4 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Tile className="col-span-2 flex flex-col gap-4 lg:col-span-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h1 className="ln-display">Download {APP_NAME}</h1>
          <p className="ln-statement max-w-[30ch]">
            The desktop app for Windows, macOS and Linux. Your databases stay on your computer.
          </p>
        </Tile>

        <div className="col-span-2 flex flex-col gap-(--ln-gap) lg:col-span-5">
          {release && (
            <Tile
              tone="inverse"
              className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2"
            >
              <p className="ln-heading pn-tnum">{release.version}</p>
              <p>
                Latest release, {date}.{" "}
                <a href="#whats-new" className="font-semibold underline underline-offset-4">
                  What’s new
                </a>
              </p>
            </Tile>
          )}
          <PrimaryDownload files={files} />
        </div>
        <Tile
          tone="picture"
          className="col-span-2 aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[560px]"
        >
          <Shot
            src="editor-grid.webp"
            alt="The editor with the sample shop open: the products table in a grid, with every table, view, index and trigger in the sidebar."
            eager
          />
        </Tile>
      </header>

      <main className="flex flex-1 flex-col gap-(--ln-gap) pt-(--ln-gap)">
        <Platforms files={files} />
        <BrowserInstall />
        {release && date && <ReleaseNotes release={release} date={date} />}
        <SameApp />
      </main>
      <SiteFooter sections={PAGE_SECTIONS} />
    </div>
  );
}
