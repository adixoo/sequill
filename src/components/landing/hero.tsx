import { Download01Icon, GithubIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { APP_NAME, WEB_REPO_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LinkTile, Shot, Tile } from "./tile";

/** The two products, coloured as in the capability shelf's key (editor sky, designer mint). */
const PRODUCTS = [
  { href: "/app", label: "Open the editor", tone: "sky" },
  { href: "/vis", label: "Open the schema designer", tone: "mint" },
] as const;

const KINDS = [
  "Tables and views",
  "Indexes, triggers",
  "Filters and SQL",
  "A diagram of keys",
  "CSV, JSON, SQL",
];

/** Facts on the gray run, light to dark. */
export const FACTS = [
  "0 bytes uploaded",
  "Works with no connection",
  "SQLite 3.54, in WebAssembly",
  "No account, no server",
  "Opens .sqlite and .db files",
];
const RUN_TILE = [
  "bg-(--ln-run-1) text-(--on-accent)",
  "bg-(--ln-run-2) text-(--on-accent)",
  "bg-(--ln-run-3) text-(--gray-100)",
  "bg-(--ln-run-4) text-(--gray-100)",
  "bg-(--ln-run-5) text-(--gray-100)",
];

/**
 * First screen: the name with what it is, links to both products, the GitHub
 * repo and installing, the editor, and the two rails. It fills the screen and
 * grows past it when a short or zoomed window can't hold the rails' text.
 */
export function Hero() {
  return (
    <header className="ln-board pt-(--ln-margin) lg:min-h-[calc(100svh-var(--ln-margin))] lg:grid-rows-[auto_auto_1fr]">
      <Tile className="col-span-2 flex flex-col gap-4 overflow-hidden lg:col-span-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h1 className="ln-name whitespace-nowrap max-lg:text-[clamp(64px,24vw,180px)]">
          {APP_NAME}
        </h1>
        <p className="ln-statement max-w-[34ch]">
          Browse, edit, query and draw SQLite databases in this tab, with nothing uploaded. In the
          desktop app, your AI assistant can work in them too, over MCP.
        </p>
      </Tile>

      <nav
        aria-label="Main"
        className="col-span-2 grid grid-cols-subgrid gap-y-(--ln-gap) lg:col-span-12"
      >
        <ul className="contents">
          {PRODUCTS.map((item) => (
            <li key={item.href} className="col-span-2 lg:col-span-3">
              <LinkTile href={item.href} tone={item.tone}>
                {item.label}
              </LinkTile>
            </li>
          ))}
          <li className="lg:col-span-3">
            <Tile
              as="a"
              href={WEB_REPO_URL}
              rel="noopener noreferrer"
              target="_blank"
              className="ln-press flex h-full min-h-16 items-center justify-between gap-3 py-3"
            >
              Star it on GitHub
              <Icon icon={GithubIcon} aria-hidden className="size-5 shrink-0" />
            </Tile>
          </li>
          <li className="lg:col-span-3">
            <Tile
              as={Link}
              href="/download"
              className="ln-press flex h-full min-h-16 items-center justify-between gap-3 py-3"
            >
              Desktop app and MCP
              <Icon icon={Download01Icon} aria-hidden className="size-5 shrink-0" />
            </Tile>
          </li>
        </ul>
      </nav>

      <div className="col-span-2 grid grid-cols-subgrid gap-y-(--ln-gap) lg:col-span-12 lg:grid-rows-[repeat(5,minmax(min-content,1fr))]">
        <div className="relative col-span-2 lg:order-2 lg:col-span-8 lg:row-span-5">
          <Tile tone="picture" className="aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto">
            <Shot
              src="editor-grid.webp"
              phoneSrc="editor-phone.webp"
              alt="The editor with the sample shop open: the products table in a grid, with each column's type beside its name and every table, view, index and trigger in the sidebar."
              eager
            />
          </Tile>
        </div>

        <div className="col-span-1 grid gap-(--ln-gap) lg:order-1 lg:col-span-2 lg:row-span-5 lg:grid-rows-subgrid">
          <Tile
            as={Link}
            href="/vis"
            tone="picture"
            className="ln-press group relative aspect-[3/4] lg:row-span-3 lg:aspect-auto"
          >
            <Shot
              src="vis-diagram.webp"
              alt="The schema designer drawing the sample shop: products, orders, order_items and customers joined by their foreign keys."
              position="58% 38%"
              zoom={1.8}
            />
            <span className="absolute inset-x-0 bottom-0 bg-canvas px-(--ln-pad) pt-3 pb-(--ln-pad) text-ink">
              Open the schema designer
            </span>
          </Tile>
          <Tile as="ul" tone="raised" className="flex flex-col justify-end gap-1 lg:row-span-2">
            {KINDS.map((kind) => (
              <li key={kind} className="leading-snug">
                {kind}
              </li>
            ))}
          </Tile>
        </div>

        <ul className="col-span-1 grid grid-cols-1 gap-(--ln-gap) lg:order-3 lg:col-span-2 lg:row-span-5 lg:grid-rows-subgrid">
          {FACTS.map((fact, i) => (
            <li key={fact} className={cn("ln-tile leading-snug", RUN_TILE[i])}>
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
