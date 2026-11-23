"use client";

import { useId, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** The desktop app's MCP tools, in plain words, as its README groups them. */
const READS = [
  "List databases",
  "Read the schema",
  "Describe a table",
  "Find rows",
  "Run a read-only query",
  "Explain a query plan",
  "List saved queries",
  "Show a table in the app",
];
const CHANGES = [
  "Add, edit and delete rows",
  "Create and change tables",
  "Create indexes, triggers and views",
  "Create, rename and delete databases",
  "Save and delete queries",
  "Run any SQL script",
];
const TOTAL = READS.length + CHANGES.length;

/**
 * A working copy of the app's MCP switches: flip them to see which tools an
 * assistant gets. Server-rendered with access on and changes off, so it reads
 * the same without script.
 */
export function McpPanel() {
  const [access, setAccess] = useState(true);
  const [changes, setChanges] = useState(false);
  const canChange = access && changes;
  const on = (access ? READS.length : 0) + (canChange ? CHANGES.length : 0);

  return (
    <div data-ui className="flex flex-col gap-6 rounded-md bg-surface p-5 lg:p-6">
      <div className="flex flex-col gap-4">
        <SwitchRow
          label="Let assistants use Sequill"
          detail="Assistants can read your databases and show you what they find."
          checked={access}
          onChange={setAccess}
        />
        <SwitchRow
          label="Allow changes"
          detail="Assistants can also change rows, schema and databases."
          checked={changes}
          onChange={setChanges}
          disabled={!access}
        />
      </div>

      <p className="font-semibold" aria-live="polite">
        {on} of {TOTAL} tools on
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <ToolList title="Read and show" tools={READS} on={access} />
        <ToolList title="Change" tools={CHANGES} on={canChange} />
      </div>

      <p className="rounded-md bg-raised px-4 py-3">
        Try it: ask your assistant to “list my Sequill databases”.
      </p>
    </div>
  );
}

function SwitchRow({
  label,
  detail,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-start justify-between gap-6", disabled && "opacity-60")}>
      <label htmlFor={id} className="flex flex-col gap-1">
        <span className="font-semibold">{label}</span>
        <span className="text-ink-soft">{detail}</span>
      </label>
      <Switch
        id={id}
        checked={checked && !disabled}
        onCheckedChange={onChange}
        disabled={disabled}
        className="mt-1 data-checked:bg-mint data-unchecked:bg-strong dark:data-unchecked:bg-strong"
      />
    </div>
  );
}

function ToolList({ title, tools, on }: { title: string; tools: string[]; on: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-semibold">{title}</h4>
      <ul className="flex flex-col gap-1">
        {tools.map((tool) => (
          <li
            key={tool}
            className={cn(
              "flex items-baseline justify-between gap-4 transition-colors duration-150",
              on ? "text-ink" : "text-ink-muted",
            )}
          >
            {tool}
            <span className="shrink-0 text-sm">{on ? "On" : "Off"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
