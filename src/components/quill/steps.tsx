"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ORDER_ROWS, SAMPLE_FILE, STATUS_QUERY, totalsByStatus } from "./data";
import { OrdersGrid, SqlCode, StatusTotalsTable } from "./fragments";

const STEPS = [
  {
    title: "Open a file.",
    body: "It is copied into this browser’s private storage, so the original never changes. Its header and schema are read first.",
  },
  {
    title: "Then filter it.",
    body: "Sort, filter and search run inside SQLite on every row of the table, not on the page you happen to see.",
  },
  {
    title: "Or ask in SQL.",
    body: "Write a query with autocomplete for your own tables and columns, and read the answer as a grid.",
  },
];

const SHIPPED = ORDER_ROWS.filter((row) => row.status === "shipped");
const BY_STATUS = totalsByStatus(ORDER_ROWS);
const { header, schema } = SAMPLE_FILE.report;
const KIND_LABEL = {
  table: "Tables",
  index: "Indexes",
  view: "Views",
  trigger: "Triggers",
} as const;

function FileStage() {
  const facts: [string, string][] = [
    ["Size", `${Math.round(SAMPLE_FILE.size / 1024)} KB`],
    ["SQLite", header.sqliteVersion],
    ["Page size", `${header.pageSize.toLocaleString("en")} bytes`],
    ["Pages", String(header.pageCount)],
    ["Encoding", header.encoding],
    ["Journal", header.journal],
  ];
  return (
    <div className="flex flex-col gap-5 p-5">
      <p className="font-semibold">{SAMPLE_FILE.name}</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-ink-muted">{label}</dt>
            <dd className="q-num font-mono">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-canvas p-4 text-sm">
        {(Object.keys(KIND_LABEL) as (keyof typeof KIND_LABEL)[]).map((kind) => {
          const items = schema.filter((item) => item.kind === kind);
          return (
            <div key={kind}>
              <p className="text-ink-muted">
                {KIND_LABEL[kind]} <span className="q-num">{items.length}</span>
              </p>
              <ul className="mt-1 font-mono text-[0.8125rem]">
                {items.map((item) => (
                  <li key={item.name}>{item.name}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterStage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 p-4 text-sm">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-sky-wash px-3 font-medium text-sky-ink">
          status = <span className="font-mono">shipped</span>
        </span>
        <span className="q-num ml-auto text-ink-muted">
          {SHIPPED.length} of {ORDER_ROWS.length} rows
        </span>
      </div>
      <div className="overflow-x-auto border-t border-hairline">
        <OrdersGrid rows={SHIPPED} columns={["order_id", "customer", "ordered_at", "total"]} />
      </div>
    </div>
  );
}

function SqlStage() {
  return (
    <div className="flex flex-col">
      <SqlCode code={STATUS_QUERY} className="p-5" />
      <div className="overflow-x-auto border-t border-hairline">
        <StatusTotalsTable totals={BY_STATUS} />
      </div>
    </div>
  );
}

const STAGES = [FileStage, FilterStage, SqlStage];

function Stage({ index }: { index: number }) {
  const Content = STAGES[index];
  return (
    <div
      data-ui
      data-density="compact"
      className="overflow-hidden rounded-xl border border-hairline bg-surface"
    >
      <Content />
    </div>
  );
}

/** Three statements on the left; the fragment on the right follows the one in view. */
export function Steps() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <ol className="flex min-w-0 flex-col gap-16 lg:col-span-5 lg:gap-0">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-step={i}
            className="flex flex-col gap-6 lg:min-h-[45vh] lg:justify-center"
          >
            <div className="flex flex-col gap-3">
              <h3
                className={cn(
                  "q-display-sm transition-colors duration-200",
                  i === active ? "text-ink" : "lg:text-ink-muted",
                )}
              >
                {step.title}
              </h3>
              <p className="max-w-[44ch] text-ink-soft">{step.body}</p>
            </div>
            <div className="lg:hidden">
              <Stage index={i} />
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[18vh]">
          <Stage index={active} />
        </div>
      </div>
    </div>
  );
}
