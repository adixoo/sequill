import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { McpPanel } from "./mcp-panel";
import { Tile } from "./tile";

export const ASSISTANTS = "Claude, Cursor, VS Code, Windsurf, Zed, JetBrains, Codex and Gemini CLI";

/**
 * The desktop app: what it adds over the browser (large files on a native
 * engine, a built-in MCP server that can read and change them), with a working
 * copy of its MCP switches and a way to it.
 */
export function DesktopApp() {
  return (
    <section id="desktop" aria-labelledby="desktop-title" className="scroll-mt-2 max-lg:pt-10">
      <div className="ln-board">
        <Tile
          tone="inverse"
          className="col-span-2 flex min-h-[360px] flex-col justify-between gap-8 lg:col-span-8 lg:p-10"
          data-reveal
        >
          <h2 id="desktop-title" className="ln-display">
            Also on your desktop
          </h2>
          <div className="flex flex-col gap-6">
            <p className="ln-statement max-w-[38ch] font-normal">
              The same editor and schema designer as a Windows, macOS and Linux app, on a native
              SQLite engine, with an MCP server so your AI assistant can work in your databases.
            </p>
            <p>
              <Link
                href="/download"
                className="ln-press group inline-flex h-12 items-center gap-3 rounded-(--ln-radius) bg-mint px-6 font-semibold text-(--on-accent)"
              >
                Download the desktop app
                <Icon
                  icon={ArrowRight02Icon}
                  aria-hidden
                  className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </p>
          </div>
        </Tile>
        <Tile
          tone="peach"
          className="col-span-2 flex flex-col justify-end gap-4 lg:col-span-4"
          data-reveal
        >
          <h3 className="ln-heading">Large databases</h3>
          <p className="max-w-[40ch]">
            Your databases are real files on your computer, read from disk by SQLite itself, so a
            big one isn’t held to a browser’s storage quota.
          </p>
        </Tile>
      </div>

      <div className="ln-board mt-(--ln-gap)">
        <Tile
          tone="mint"
          className="col-span-2 flex flex-col justify-between gap-6 lg:col-span-5"
          data-reveal
        >
          <h3 className="ln-heading">An MCP server built in</h3>
          <div className="flex flex-col gap-4">
            <p>
              Let {ASSISTANTS} list your databases, read the schema, find rows, run queries and open
              a table or a query in the app for you to see.
            </p>
            <p>
              Turn on Allow changes and they can also add, edit and delete rows, create tables,
              indexes, triggers and views, and save queries.
            </p>
            <p>
              Both switches are off until you turn them on and take effect at once. Every call is
              kept in the app’s History, with its SQL and result.
            </p>
          </div>
        </Tile>
        <Tile
          tone="raised"
          className="col-span-2 flex flex-col justify-center gap-4 lg:col-span-7 lg:p-10"
          data-reveal
        >
          <McpPanel />
          <p className="max-w-[56ch]">
            To connect one, click MCP in the app’s top bar and pick your assistant. It shows the
            command or settings to copy, made for your computer. Keep Sequill open while the
            assistant works: it runs every call on the same databases you see.
          </p>
        </Tile>
      </div>
    </section>
  );
}
