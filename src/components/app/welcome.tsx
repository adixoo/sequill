"use client";

import {
  CommandLineIcon,
  FolderOpenIcon,
  PlusSignIcon,
  SparklesIcon,
  TableIcon,
} from "@hugeicons/core-free-icons";
import { m } from "motion/react";
import { Mark, Note } from "@/components/common/pastel/annotation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { useDbActions } from "@/hooks/use-db-actions";
import { DB_FILE_ACCEPT } from "@/lib/constants";
import { enter } from "@/lib/motion";
import type { Schema } from "@/lib/sqlite/types";
import { useDialogs } from "@/lib/store/dialogs";
import { useWorkspace } from "@/lib/store/workspace";

/** Shown when no database is open. */
export function NoDatabase() {
  const actions = useDbActions();
  const openDialog = useDialogs((s) => s.open);
  return (
    <div
      data-density="comfortable"
      className="flex flex-1 items-center justify-center overflow-y-auto bg-canvas p-6"
    >
      <m.div {...enter()} className="flex max-w-lg flex-col items-start gap-6">
        <h1 className="text-4xl leading-none font-bold tracking-[-0.035em] text-ink md:text-5xl">
          Open a database to begin
        </h1>
        <p className="text-base leading-relaxed text-ink-soft">
          Files stay in this browser&apos;s private storage. Nothing is uploaded, and it all keeps
          working offline.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" asChild>
            <label className="cursor-pointer">
              <Icon icon={FolderOpenIcon} /> Open a .sqlite file
              <input
                type="file"
                accept={DB_FILE_ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void actions.openFile(file);
                  e.target.value = "";
                }}
              />
            </label>
          </Button>
          <Button size="lg" variant="outline" onClick={() => openDialog({ kind: "newDatabase" })}>
            <Icon icon={PlusSignIcon} /> New empty
          </Button>
          <Button size="lg" variant="ghost" onClick={() => void actions.createSample()}>
            <Icon icon={SparklesIcon} /> Try the sample
          </Button>
        </div>
        {/*
          The arrow rises from the note and points up at "Open a .sqlite file". Dropping
          files is a mouse thing, so touch devices don't get the hint.
        */}
        <div className="relative -mt-4 flex items-end gap-1 pl-6 pointer-coarse:hidden">
          <Mark name="rise" className="w-8 shrink-0" delay={0.5} />
          {/* Lowered so the arrow's tail meets the middle of the text. */}
          <Note delay={1.1} size="sm" className="translate-y-2.5">
            or drop a file anywhere
          </Note>
        </div>
      </m.div>
    </div>
  );
}

/** Shown when a database is open but no tab is. */
export function NoTab({ schema }: { schema: Schema | undefined }) {
  const openTable = useWorkspace((s) => s.openTable);
  const openQuery = useWorkspace((s) => s.openQuery);
  const openDialog = useDialogs((s) => s.open);
  const first = schema?.tables[0] ?? schema?.views[0];
  return (
    <div
      data-density="comfortable"
      className="flex flex-1 items-center justify-center overflow-y-auto bg-canvas p-6"
    >
      <m.div {...enter()} className="flex max-w-md flex-col items-start gap-5">
        <h2 className="text-3xl leading-tight font-semibold tracking-[-0.025em] text-ink">
          Pick a table, or ask the data a question
        </h2>
        <div className="flex flex-wrap gap-2">
          {first && (
            <Button onClick={() => openTable(first.name)}>
              <Icon icon={TableIcon} /> Open {first.name}
            </Button>
          )}
          <Button variant="outline" onClick={() => openQuery()}>
            <Icon icon={CommandLineIcon} /> New query
          </Button>
          <Button variant="ghost" onClick={() => openDialog({ kind: "createTable" })}>
            <Icon icon={PlusSignIcon} /> New table
          </Button>
        </div>
        {/* A keyboard shortcut: not shown on touch devices, which usually have no keyboard. */}
        <p className="flex items-center gap-2 text-sm text-ink-muted pointer-coarse:hidden">
          <Kbd>Ctrl K</Kbd> jumps to any table or action.
        </p>
      </m.div>
    </div>
  );
}
