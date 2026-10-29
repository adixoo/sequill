import { FileInspector } from "./file-inspector";
import { Shot, Tile } from "./tile";

/** The privacy claim as a slogan board, then how it works beside the live file reader. */
export function Intro() {
  return (
    <section id="your-file" aria-labelledby="your-file-title" className="scroll-mt-2">
      <div className="ln-board lg:grid-rows-[38svh_38svh]">
        <Tile
          tone="inverse"
          className="col-span-2 flex min-h-[46svh] items-end lg:col-span-8 lg:row-span-2 lg:min-h-0"
          data-reveal
        >
          <h2 id="your-file-title" className="ln-display uppercase">
            Nothing
            <br />
            uploaded
          </h2>
        </Tile>
        <Tile
          tone="peach"
          className="flex aspect-square items-end lg:col-span-4 lg:aspect-auto"
          aria-label="Zero bytes leave your device"
          role="img"
        >
          <span aria-hidden className="ln-display pn-tnum whitespace-nowrap">
            0 B
          </span>
        </Tile>
        <Tile tone="picture" className="aspect-square lg:col-span-4 lg:aspect-auto">
          <Shot
            src="editor-phone.webp"
            alt="The editor on a phone, showing the sample shop’s customers table."
            position="center 18%"
          />
        </Tile>
      </div>

      <div className="ln-board mt-(--ln-gap)">
        <div className="col-span-2 lg:col-span-6">
          <FileInspector />
        </div>
        <Tile className="col-span-2 bg-canvas px-(--ln-margin) lg:col-span-6 lg:p-10" data-reveal>
          <p className="ln-statement max-w-[44ch] font-normal">
            Opening a file copies it into this browser’s private storage, where the official SQLite
            engine reads it. There is no server behind this page.
          </p>
          <p className="mt-6 max-w-[52ch]">
            The page is static files, and after your first visit it loads with no connection at all.
            Your databases stay on this device until you delete them or clear this site’s data, so
            download a copy of anything you can’t lose.
          </p>
          <p className="mt-4 max-w-[52ch] text-ink-soft">
            The reader beside this opens a file’s first page right here, without the engine, and
            lists its tables.
          </p>
        </Tile>
      </div>
    </section>
  );
}
