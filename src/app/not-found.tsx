import type { Metadata } from "next";
import { Rise } from "@/components/common/pastel/rise";
import { LinkTile, Tile } from "@/components/landing/tile";
import "@/components/landing/landing.css";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Where a lost visitor can go next, coloured as on the landing page (editor sky, designer mint). */
const WAYS_BACK = [
  { href: "/", label: "Go to the home page", tone: "surface" },
  { href: "/app", label: "Open the editor", tone: "sky" },
  { href: "/vis", label: "Open the schema designer", tone: "mint" },
  { href: "/download", label: "Download the desktop app", tone: "surface" },
] as const;

/**
 * The 404 for every unmatched address (exported as 404.html): the landing
 * page's tile board, with the code as its one big thing and the ways back.
 */
export default function NotFound() {
  return (
    <main className="ln ln-board min-h-dvh flex-1 bg-canvas py-(--ln-margin) lg:grid-rows-[auto_1fr]">
      <Tile className="col-span-2 flex flex-col justify-end gap-4 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:min-h-64">
        <Rise className="flex flex-col gap-4">
          <h1 className="ln-heading">Page not found</h1>
          <p className="ln-statement font-normal">
            Nothing lives at this address. It may be mistyped, or the page has moved.
          </p>
          <p className="text-ink-soft">
            Your databases are safe: they are kept in this browser, not at an address.
          </p>
        </Rise>
      </Tile>

      <Tile
        tone="rose"
        className="col-span-2 flex min-h-[40svh] items-end lg:col-span-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-0"
      >
        {/* Sized to fill its tile: three figures are about 1.7em wide. */}
        <Rise index={1}>
          <p className="ln-name pn-tnum -mb-[0.06em] text-[44vw] leading-[0.8] lg:text-[min(31vw,66svh)]">
            404
          </p>
        </Rise>
      </Tile>

      <nav
        aria-label="Ways back"
        className="col-span-2 lg:col-span-4 lg:col-start-9 lg:row-start-2"
      >
        <ul className="flex h-full flex-col gap-(--ln-gap)">
          {WAYS_BACK.map((way, i) => (
            <li key={way.href} className="flex-1">
              <Rise index={i + 2} className="h-full">
                <LinkTile href={way.href} tone={way.tone}>
                  {way.label}
                </LinkTile>
              </Rise>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
