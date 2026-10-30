import Link from "next/link";
import { InstallButton } from "@/components/common/pwa";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { APP_NAME, APP_TAGLINE, LEARN_URL, MAKER } from "@/lib/constants";
import { WORDMARK_HEIGHTS, WORDMARK_TONES } from "@/lib/logo";
import { Shot, Tile } from "./tile";

/** One slow line of the tagline across the full width; the page's signature move. */
export function Marquee() {
  const line = <span className="ln-display pr-[0.6em] whitespace-nowrap">{APP_TAGLINE}.</span>;
  return (
    <div className="ln-band ln-marquee py-6 lg:py-10">
      <div className="ln-marquee-track">
        {line}
        <span aria-hidden className="contents">
          {line}
        </span>
      </div>
    </div>
  );
}

/** The close: the action tile between two cropped flanks. */
export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="ln-board">
      <Tile
        tone="picture"
        className="h-[120px] lg:col-span-2 lg:-ml-6 lg:h-[360px] lg:rounded-l-none"
      >
        <Shot
          src="vis-design.webp"
          alt="A corner of the schema designer’s diagram."
          position="62% 30%"
        />
      </Tile>
      <Tile
        tone="mint"
        className="col-span-2 flex min-h-[300px] flex-col justify-center gap-5 max-lg:order-first lg:col-span-8 lg:h-[360px] lg:p-10"
      >
        <h2 id="closing-title" className="ln-heading">
          Open a database now
        </h2>
        <p className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/app"
            className="ln-press inline-flex h-12 items-center rounded-(--ln-radius) bg-gray-950 px-6 font-semibold text-gray-100 hover:bg-gray-800"
          >
            Open the editor
          </Link>
          <Link href="/vis" className="font-semibold underline underline-offset-4">
            or the schema designer
          </Link>
        </p>
        <p className="max-w-[52ch]">
          Pick a file, start an empty one or try the sample shop. There is nothing to install and no
          account to make. New to databases, or going further?{" "}
          <a
            href={LEARN_URL}
            rel="noreferrer"
            target="_blank"
            className="font-semibold underline underline-offset-4"
          >
            Learn them from beginner to advanced
          </a>
          .
        </p>
      </Tile>
      <Tile
        tone="sky"
        className="h-[120px] lg:col-span-2 lg:-mr-6 lg:h-[360px] lg:rounded-r-none"
      />
    </section>
  );
}

const WORDMARK = APP_NAME.toUpperCase().split(" ");

/** The links and the credit line, then the name built from blocks as the page's last word. */
export function SiteFooter() {
  let n = 0;
  return (
    <footer className="ln-board mt-(--ln-gap) pb-(--ln-margin)">
      <nav
        aria-label="Footer"
        className="col-span-2 mt-12 grid grid-cols-2 gap-8 px-(--ln-pad) lg:col-span-12 lg:grid-cols-12 lg:gap-(--ln-gap)"
      >
        <FooterColumn
          title="The tools"
          links={[
            ["/app", "Editor"],
            ["/vis", "Schema designer"],
          ]}
        />
        <FooterColumn
          title="This page"
          links={[
            ["#your-file", "Try your own file"],
            ["#questions", "Questions"],
          ]}
        />
        <FooterColumn title="Learn" links={[[LEARN_URL, "Databases, beginner to advanced"]]} />
        <FooterColumn
          title="Built on"
          links={[
            ["https://sqlite.org/wasm/doc/trunk/index.md", "SQLite WASM"],
            [
              "https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system",
              "Origin Private File System",
            ],
          ]}
        />
        <div className="col-span-2 flex flex-col gap-2 lg:col-span-4 lg:col-start-9">
          <p className="font-semibold">Runs in your browser</p>
          <p className="text-ink-soft">No server, no account. Works offline once loaded.</p>
          <span className="-ml-2.5 flex items-center">
            <ThemeToggle />
            <InstallButton />
          </span>
        </div>
      </nav>

      <div className="col-span-2 mt-10 flex flex-wrap items-center justify-between gap-4 px-(--ln-pad) pb-(--ln-pad) lg:col-span-12">
        <p className="text-ink-soft">
          {APP_NAME}, built and maintained by{" "}
          <a
            href={MAKER.url}
            rel="noreferrer"
            target="_blank"
            className="font-semibold text-ink underline underline-offset-4"
          >
            {MAKER.name}
          </a>
        </p>
        <a
          href="#top"
          className="ln-press inline-flex h-10 items-center rounded-(--ln-radius) bg-raised px-4 font-semibold"
        >
          Back to top
        </a>
      </div>
      <div
        role="img"
        aria-label={APP_NAME}
        className="col-span-2 flex flex-col gap-1 lg:col-span-12 lg:flex-row"
      >
        {WORDMARK.map((word) => (
          <div key={word} className="flex h-[15svh] items-end gap-1 lg:h-[34svh] lg:flex-1">
            {word.split("").map((letter) => {
              const i = n++;
              return (
                <span
                  key={i}
                  aria-hidden
                  className="ln-display flex flex-1 items-end justify-center overflow-hidden rounded-(--ln-radius) pb-[0.08em] text-(--on-accent) max-lg:text-[min(12vw,9svh)]"
                  style={{
                    background: `var(--${WORDMARK_TONES[i % WORDMARK_TONES.length]})`,
                    height: `${WORDMARK_HEIGHTS[i % WORDMARK_HEIGHTS.length] * 100}%`,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="flex flex-col gap-2 lg:col-span-2">
      <p className="font-semibold">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {links.map(([href, label]) => (
          <li key={href}>
            {href.startsWith("http") ? (
              <a
                href={href}
                rel="noreferrer"
                target="_blank"
                className="text-ink-soft hover:text-ink"
              >
                {label}
              </a>
            ) : (
              <Link href={href} className="text-ink-soft hover:text-ink">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
