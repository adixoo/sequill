"use client";

import Link from "next/link";
import { useId, useState, type DragEvent } from "react";
import { Mark, Note } from "@/components/common/pastel/annotation";
import { DB_FILE_ACCEPT } from "@/lib/constants";
import { formatBytes, formatCount } from "@/lib/data/format";
import {
  inspectSqliteFile,
  type SchemaKind,
  type SqliteFileReport,
} from "@/lib/sqlite/file-header";
import { cn } from "@/lib/utils";
import { SAMPLE_FILE } from "./sample-data";
import { Tile } from "./tile";

interface FileFacts {
  name: string;
  size: number;
  report: SqliteFileReport;
}

type State =
  | { kind: "example" }
  | { kind: "reading"; name: string }
  | ({ kind: "done" } & FileFacts)
  | { kind: "error"; name: string; message: string };

const KIND_LABEL: Record<SchemaKind, [string, string]> = {
  table: ["table", "tables"],
  view: ["view", "views"],
  index: ["index", "indexes"],
  trigger: ["trigger", "triggers"],
};
const NAMES_SHOWN = 18;

function countLabel(n: number, kind: SchemaKind): string {
  return `${formatCount(n)} ${KIND_LABEL[kind][n === 1 ? 0 : 1]}`;
}

/**
 * The page's live thing: choose or drop a SQLite file and read its header and
 * schema in this tab, with no engine and no upload.
 */
export function FileInspector() {
  const inputId = useId();
  const [state, setState] = useState<State>({ kind: "example" });
  const [dragging, setDragging] = useState(false);

  const read = async (file: File) => {
    setState({ kind: "reading", name: file.name });
    try {
      const report = await inspectSqliteFile(file);
      setState({ kind: "done", name: file.name, size: file.size, report });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The file couldn’t be read.";
      setState({ kind: "error", name: file.name, message });
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void read(file);
  };

  return (
    <Tile
      tone="raised"
      className={cn(
        "flex min-h-[420px] flex-col gap-6 transition-colors duration-200",
        dragging && "bg-mint-wash",
      )}
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="flex flex-col gap-2">
        <h3 className="ln-statement font-semibold">Try your own file</h3>
        <p className="text-ink-soft">
          Choose a .sqlite or .db file, or drop one here. This page reads its header and its list of
          tables in the tab.
        </p>
      </div>

      <div className="relative flex flex-wrap items-center gap-4">
        <label
          htmlFor={inputId}
          className="ln-press inline-flex h-12 cursor-pointer items-center rounded-(--ln-radius) bg-ink px-5 font-semibold text-canvas has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sky-ink"
        >
          Choose a database file
          <input
            id={inputId}
            type="file"
            accept={DB_FILE_ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void read(file);
              e.target.value = "";
            }}
          />
        </label>
        <span aria-hidden className="flex items-end gap-1 max-sm:hidden">
          <Mark name="curve" flip className="w-16 -translate-y-1" delay={0.4} />
          <Note delay={1} size="md">
            it stays on your device
          </Note>
        </span>
      </div>

      <div aria-live="polite" className="flex flex-1 flex-col justify-end">
        <Result state={state} />
      </div>
    </Tile>
  );
}

function Result({ state }: { state: State }) {
  if (state.kind === "reading") return <p>Reading {state.name}…</p>;
  if (state.kind === "error") {
    return (
      <p className="text-rose-ink">
        <span className="font-semibold">{state.name}:</span> {state.message}
      </p>
    );
  }
  return state.kind === "example" ? (
    <Facts file={SAMPLE_FILE} example />
  ) : (
    <Facts file={state} example={false} />
  );
}

/** What the reader found: counts, header facts and the table names. */
function Facts({ file, example }: { file: FileFacts; example: boolean }) {
  const { header, schema } = file.report;
  const kinds = (Object.keys(KIND_LABEL) as SchemaKind[])
    .map((kind) => [kind, schema.filter((e) => e.kind === kind).length] as const)
    .filter(([, n]) => n > 0);
  const tables = schema.filter((e) => e.kind === "table");
  const facts = [
    ["Size", formatBytes(file.size)],
    ["Pages", `${formatCount(header.pageCount)} × ${formatBytes(header.pageSize)}`],
    ["Journal", header.journal === "WAL" ? "Write-ahead log" : "Rollback"],
    ["Text", header.encoding],
    ["Last written by", `SQLite ${header.sqliteVersion}`],
    ["User version", String(header.userVersion)],
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold break-all">
        {example && <span className="font-normal text-ink-soft">For example: </span>}
        {file.name}
        <span className="font-normal text-ink-soft">
          {" "}
          {kinds.length > 0
            ? kinds.map(([kind, n]) => countLabel(n, kind)).join(", ")
            : "no tables yet"}
        </span>
      </p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-ink-soft">{label}</dt>
            <dd className="pn-tnum font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {tables.length > 0 && (
        <ul aria-label="Tables" className="flex flex-wrap gap-1.5">
          {tables.slice(0, NAMES_SHOWN).map((t) => (
            <li key={t.name} className="rounded-xs bg-surface px-2 py-0.5 break-all">
              {t.name}
            </li>
          ))}
          {tables.length > NAMES_SHOWN && (
            <li className="px-2 py-0.5 text-ink-soft">and {tables.length - NAMES_SHOWN} more</li>
          )}
        </ul>
      )}
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className={example ? "text-ink-soft" : "text-mint-ink"}>
          {example
            ? "The editor’s sample database. Choose a file to read yours."
            : "Read in this tab. Nothing was sent anywhere."}
        </span>
        <Link href="/app" className="font-semibold underline underline-offset-4">
          Open the editor
        </Link>
      </p>
    </div>
  );
}
