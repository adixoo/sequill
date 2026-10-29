import Link from "next/link";
import { cn } from "@/lib/utils";

type Area = "editor" | "designer" | "files";

const AREA: Record<Area, { href: string; mark: string }> = {
  editor: { href: "/app", mark: "bg-sky" },
  designer: { href: "/vis", mark: "bg-mint" },
  files: { href: "/app", mark: "bg-peach" },
};

const CAPABILITIES: [string, Area][] = [
  ["Virtualised rows", "editor"],
  ["Multi-column sort", "editor"],
  ["Search every column", "editor"],
  ["Filters, 15 conditions", "editor"],
  ["Pin and hide columns", "editor"],
  ["Edit in place", "editor"],
  ["Paste from a spreadsheet", "editor"],
  ["Set NULL", "editor"],
  ["Row inspector", "editor"],
  ["BLOB preview", "editor"],
  ["JSON formatting", "editor"],
  ["Follow foreign keys", "editor"],
  ["SQL console", "editor"],
  ["Schema autocomplete", "editor"],
  ["Query plans", "editor"],
  ["Saved queries", "editor"],
  ["Diagram of every table", "designer"],
  ["Auto-arrange", "designer"],
  ["Focus one table", "designer"],
  ["Table colours", "designer"],
  ["Drag to link columns", "designer"],
  ["Safe table rebuilds", "designer"],
  ["Save as a new database", "designer"],
  ["Open .sqlite and .db", "files"],
  ["The sample shop", "files"],
  ["Import CSV and JSON", "files"],
  ["Export CSV, JSON, SQL", "files"],
  ["Full SQL dump", "files"],
  ["Works offline", "files"],
  ["Install as an app", "files"],
];

/** Every capability as a shelf of book spines, marked by which tool it lives in. */
export function CapabilityShelf() {
  return (
    <section aria-labelledby="shelf-title" className="ln-board">
      <div className="col-span-2 flex flex-col gap-6 rounded-(--ln-radius) bg-surface p-(--ln-pad) lg:col-span-12 lg:gap-8">
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <h2 id="shelf-title" className="ln-statement font-bold">
            Everything it does
          </h2>
          <p className="text-ink-soft">
            Thirty things across two tools that share one set of databases.{" "}
            <span className="whitespace-nowrap">
              <Swatch area="editor" /> editor <Swatch area="designer" /> schema designer{" "}
              <Swatch area="files" /> files
            </span>
          </p>
        </div>
        <ul className="ln-spines">
          {CAPABILITIES.map(([name, area]) => (
            <li key={name} className="ln-spine">
              <Link
                href={AREA[area].href}
                className="ln-press flex items-baseline gap-2 rounded-xs leading-tight lg:h-full lg:items-start lg:gap-3 lg:py-1"
              >
                <span>{name}</span>
                <span
                  className={cn(
                    "rounded-xs px-1 text-(--on-accent) lg:px-0 lg:py-1.5",
                    AREA[area].mark,
                  )}
                >
                  {area}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Swatch({ area }: { area: Area }) {
  return (
    <span
      aria-hidden
      className={cn("ml-2 inline-block size-3 rounded-xs align-[-1px]", AREA[area].mark)}
    />
  );
}
