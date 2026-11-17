import Link from "next/link";
import { LoopVideo } from "@/components/landing/loop-video";
import { Shot, Tile } from "@/components/landing/tile";

/** What the download gets you: the schema designer moving, the SQL console beside it. */
export function SameApp() {
  return (
    <section aria-labelledby="same-app-title" className="ln-board lg:grid-rows-[auto_1fr]">
      <Tile
        tone="picture"
        className="col-span-2 aspect-[4/3] lg:col-span-8 lg:row-span-2 lg:aspect-auto lg:min-h-[560px]"
      >
        <LoopVideo
          src="vis-drag.webm"
          poster="vis-drag-poster.webp"
          label="The order_items table being dragged past products on the schema diagram while its foreign-key lines move to the facing sides."
          position="62% 40%"
        />
      </Tile>
      <Tile tone="raised" className="col-span-2 flex flex-col gap-4 lg:col-span-4" data-reveal>
        <h2 id="same-app-title" className="ln-heading">
          In a window of its own
        </h2>
        <p className="max-w-[44ch]">
          The same editor, SQL console and schema designer you can{" "}
          <Link href="/app" className="font-semibold underline underline-offset-4">
            try here first
          </Link>
          , with your databases on your computer.
        </p>
      </Tile>
      <Tile tone="picture" className="col-span-2 aspect-[4/3] lg:col-span-4 lg:aspect-auto">
        <Shot
          src="editor-console.webp"
          alt="The SQL console: a query over the order_totals view and its eight result rows."
          position="20% 30%"
        />
      </Tile>
    </section>
  );
}
