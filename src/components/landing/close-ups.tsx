import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoopVideo } from "./loop-video";
import { Shot, Tile, type TileTone } from "./tile";

/** Tile placements on the 12-column board (rows of 104px) and the 2-column phone board. */
const BIG = "col-span-2 row-span-3 lg:row-span-4 lg:col-span-6";
const TALL = "col-span-1 row-span-3 lg:col-span-3 lg:row-span-4";
const WIDE = "col-span-2 row-span-2 lg:col-span-6";
const SMALL = "col-span-1 row-span-2 lg:col-span-3";

function Caption({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-(--ln-pad) pt-3 pb-(--ln-pad)">
      <h3 className="font-semibold">{title}</h3>
      <p className="max-w-[44ch] leading-snug">{children}</p>
    </div>
  );
}

function CloseUp({
  tone,
  className,
  title,
  caption,
  children,
}: {
  tone: TileTone;
  className: string;
  title: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <Tile as="li" tone={tone} className={cn("flex min-h-0 flex-col p-0", className)}>
      {/* Enlarged with the tile (cqw), and sized to stay whole so no text is ever cut off. */}
      <div aria-hidden data-ui className="@container relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute top-(--ln-pad) left-(--ln-pad)">
          {children}
        </div>
      </div>
      <Caption title={title}>{caption}</Caption>
    </Tile>
  );
}

function PictureTile({
  className,
  title,
  caption,
  children,
}: {
  className: string;
  title: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <Tile as="li" className={cn("flex min-h-0 flex-col p-0", className)}>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      <Caption title={title}>{caption}</Caption>
    </Tile>
  );
}

const key =
  "rounded-[0.18em] border-b-[0.08em] border-strong bg-raised px-[0.3em] py-[0.05em] text-ink";

/** Small parts of both tools, enlarged on a board of tiles. */
export function CloseUps() {
  return (
    <section aria-labelledby="close-ups-title">
      <ul className="ln-board auto-rows-[28vw] md:auto-rows-[17vw] lg:auto-rows-[104px]">
        <Tile as="li" tone="inverse" className={cn(WIDE, "flex flex-col justify-between")}>
          <h2 id="close-ups-title" className="ln-heading max-w-[12ch]">
            Both tools, up close
          </h2>
          <p className="max-w-[44ch]">
            The editor and the schema designer open the same databases. Switch between them from
            either header.
          </p>
        </Tile>

        <PictureTile
          className={cn(BIG, "lg:col-start-7 lg:row-start-1")}
          title="Lines follow the tables"
          caption="Drag a table and every foreign key picks the sides that face each other."
        >
          <LoopVideo
            src="vis-drag.webm"
            poster="vis-drag-poster.webp"
            label="The order_items table being dragged past products on the schema diagram while its foreign-key lines move to the facing sides."
            position="62% 40%"
          />
        </PictureTile>

        <CloseUp
          tone="sky"
          className={SMALL}
          title="Jump to anything"
          caption="Every table, view and action from one box."
        >
          <span className="flex gap-[0.25em] text-[15cqw] leading-none font-semibold">
            <kbd className={key}>Ctrl</kbd>
            <kbd className={key}>K</kbd>
          </span>
        </CloseUp>

        <CloseUp
          tone="surface"
          className={SMALL}
          title="Nothing changes until you save"
          caption="Pending edits wait behind one badge."
        >
          <span className="flex items-center gap-[0.35em] rounded-[0.2em] bg-rose-wash px-[0.4em] py-[0.15em] text-[14cqw] leading-tight font-medium whitespace-nowrap text-rose-ink">
            <span className="size-[0.3em] rounded-full bg-rose-ink" />
            Unsaved
          </span>
        </CloseUp>

        <PictureTile
          className={BIG}
          title="Ask in SQL"
          caption="Autocomplete knows your tables and columns. Ctrl+Enter runs the script or the selection."
        >
          <Shot
            src="editor-console.webp"
            alt="The SQL console: a query over the order_totals view and its eight result rows."
            position="20% 30%"
            zoom={1.5}
          />
        </PictureTile>

        <PictureTile
          className={TALL}
          title="Filters run in SQLite"
          caption="Fifteen conditions, joined with AND or OR."
        >
          <Shot
            src="editor-filter.webp"
            alt="The filter builder on the orders table: status equals shipped."
            position="72% 14%"
            zoom={1.9}
          />
        </PictureTile>

        <CloseUp
          tone="raised"
          className={SMALL}
          title="Set NULL, or any value"
          caption="Double-click, or just start typing."
        >
          <span className="text-[26cqw] leading-none text-ink-muted italic">NULL</span>
        </CloseUp>

        <CloseUp
          tone="surface"
          className={SMALL}
          title="Six colours, or any"
          caption="Group tables on the diagram by colour."
        >
          <span className="flex gap-[0.12em] text-[20cqw]">
            {["bg-peach", "bg-butter", "bg-mint", "bg-sky", "bg-rose"].map((c) => (
              <span key={c} className={cn("size-[0.8em] rounded-full", c)} />
            ))}
          </span>
        </CloseUp>

        <PictureTile
          className={WIDE}
          title="Draft in the open database"
          caption="A new table and its link wait in green until you save them."
        >
          <Shot
            src="vis-design.webp"
            alt="The schema designer with a new reviews table linked to products, drawn in green, and an Unsaved badge in the header."
            position="70% 28%"
          />
        </PictureTile>

        <CloseUp
          tone="peach"
          className={SMALL}
          title="Take it with you"
          caption="Any table, filter or result as a file."
        >
          <span className="flex gap-[0.2em] text-[10cqw] leading-none font-semibold">
            {["CSV", "JSON", "SQL"].map((f) => (
              <span key={f} className="rounded-[0.15em] bg-surface px-[0.25em] py-[0.1em] text-ink">
                {f}
              </span>
            ))}
          </span>
        </CloseUp>

        <CloseUp
          tone="raised"
          className={SMALL}
          title="Every query timed"
          caption="Row count and time under each grid."
        >
          <span className="pn-tnum text-[11cqw] leading-none whitespace-nowrap text-ink-soft">
            40 rows · 2 ms
          </span>
        </CloseUp>
      </ul>
    </section>
  );
}
