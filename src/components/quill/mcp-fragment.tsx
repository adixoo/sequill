"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

/** Sample calls an assistant made, as the desktop app's History lists them. */
const HISTORY: [string, string, string][] = [
  ["10:42", "list_databases", "1 database"],
  ["10:42", "describe_table orders", "5 columns"],
  ["10:43", "query order_totals", "10 rows"],
];

/** The desktop app's MCP switches: access first, changes only on top of access. */
export function McpFragment() {
  const [access, setAccess] = useState(true);
  const [changes, setChanges] = useState(false);

  return (
    <div
      data-ui
      className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface"
    >
      <div className="flex flex-col gap-4 p-5">
        <p className="font-semibold">MCP server</p>
        <label className="flex items-start justify-between gap-6">
          <span className="flex flex-col">
            <span className="text-sm font-medium">Allow access</span>
            <span className="text-sm text-ink-muted">
              Assistants can read databases and run queries.
            </span>
          </span>
          <Switch
            checked={access}
            onCheckedChange={(on) => {
              setAccess(on);
              if (!on) setChanges(false);
            }}
          />
        </label>
        <label className="flex items-start justify-between gap-6">
          <span className="flex flex-col">
            <span className="text-sm font-medium">Allow changes</span>
            <span className="text-sm text-ink-muted">
              Rows, tables, indexes, views and saved queries.
            </span>
          </span>
          <Switch checked={changes} disabled={!access} onCheckedChange={setChanges} />
        </label>
      </div>
      <div className="border-t border-hairline bg-canvas px-5 py-4">
        <p className="mb-2 text-sm font-medium">History</p>
        <ul className="flex flex-col text-sm">
          {HISTORY.map(([time, call, result]) => (
            <li key={call} className="flex h-8 items-center gap-3">
              <span className="q-num font-mono text-ink-muted">{time}</span>
              <span className="truncate font-mono text-[0.8125rem]">{call}</span>
              <span className="ml-auto shrink-0 text-ink-muted">{result}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink-muted">
          {access
            ? changes
              ? "Assistants can read and change your databases."
              : "Assistants can read, not change."
            : "Assistants can’t reach your databases."}
        </p>
      </div>
    </div>
  );
}
