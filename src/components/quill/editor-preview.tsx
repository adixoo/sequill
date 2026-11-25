"use client";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CommandLineIcon,
  Delete02Icon,
  Download01Icon,
  FlashIcon,
  HierarchySquare02Icon,
  ListTreeIcon,
  Menu01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
  TableIcon,
  Upload01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import type { OrderStatus } from "@/components/landing/sample-data";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  money,
  ORDER_ROWS,
  SAMPLE_COUNTS,
  SAMPLE_FILE,
  STATUS_QUERY,
  STATUSES,
  sumTotals,
  totalsByStatus,
  VIEW_COLUMNS,
  VIEW_SQL,
} from "./data";
import { OrdersGrid, SqlCode, StatusPill, StatusTotalsTable } from "./fragments";

const SCHEMA_GROUPS: { label: string; kind: string; icon: IconSvgElement }[] = [
  { label: "Tables", kind: "table", icon: TableIcon },
  { label: "Views", kind: "view", icon: ViewIcon },
  { label: "Indexes", kind: "index", icon: ListTreeIcon },
  { label: "Triggers", kind: "trigger", icon: FlashIcon },
];
const ACTIVE_OBJECT = "order_totals";
const PAGE_SIZE = ORDER_ROWS.length;

type Density = "compact" | "comfortable";
type View = "data" | "structure" | "sql";
type Tab = "view" | "query";
type Filter = OrderStatus | "all";

/** The sidebar: product, open database, then its objects by kind. */
function Navigation() {
  return (
    <div className="flex h-full flex-col gap-(--gap) px-3 py-4">
      <div className="flex flex-col gap-3">
        <Link href="/test" className="flex items-center gap-2.5 px-2 font-semibold tracking-tight">
          <Logo size={24} />
          {APP_NAME}
        </Link>
        <button type="button" className="q-btn q-btn-secondary justify-between">
          <span className="truncate">{SAMPLE_FILE.name}</span>
          <span className="q-num font-normal text-ink-muted">
            {Math.round(SAMPLE_FILE.size / 1024)} KB
          </span>
        </button>
      </div>
      <nav aria-label="Database objects" className="flex flex-col gap-(--gap) overflow-y-auto">
        {SCHEMA_GROUPS.map((group) => (
          <div key={group.kind} className="flex flex-col gap-1">
            <h2 className="q-nav-label">{group.label}</h2>
            <ul className="flex flex-col gap-px">
              {SAMPLE_FILE.report.schema
                .filter((item) => item.kind === group.kind)
                .map((item) => {
                  const count = SAMPLE_COUNTS[item.name as keyof typeof SAMPLE_COUNTS];
                  return (
                    <li key={item.name}>
                      <a
                        href="#"
                        aria-current={item.name === ACTIVE_OBJECT ? "page" : undefined}
                        className="q-nav-item"
                      >
                        <Icon icon={group.icon} />
                        <span className="truncate font-mono text-(length:--text-cell)">
                          {item.name}
                        </span>
                        {count !== undefined && (
                          <span className="q-num ml-auto text-(length:--text-small) text-ink-muted">
                            {count}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-px">
        <a href="#" className="q-nav-item">
          <Icon icon={HierarchySquare02Icon} />
          Schema designer
        </a>
        <a href="#" className="q-nav-item">
          <Icon icon={CommandLineIcon} />
          SQL console
        </a>
      </div>
    </div>
  );
}

function DataView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(5);
  const rows = filter === "all" ? ORDER_ROWS : ORDER_ROWS.filter((row) => row.status === filter);
  const selected = ORDER_ROWS.find((row) => row.id === selectedId) ?? ORDER_ROWS[0];

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-h-0 min-w-0 flex-col">
        {/* The option-heavy toolbar compact density exists for. */}
        <div className="q-toolbar border-t border-hairline">
          <label className="q-input-icon w-full sm:w-48 2xl:w-60">
            <Icon icon={Search01Icon} />
            <input
              type="search"
              aria-label="Search rows"
              placeholder={`Search ${SAMPLE_COUNTS.order_totals} rows`}
              className="q-input"
            />
          </label>
          <div
            role="group"
            aria-label="Status"
            className="flex gap-(--control-gap) overflow-x-auto"
          >
            {(["all", ...STATUSES] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className="q-chip capitalize"
              >
                {value}
              </button>
            ))}
          </div>
          <span aria-hidden className="q-toolbar-sep max-md:hidden" />
          <div className="q-btn-group max-md:hidden">
            <button type="button" className="q-btn q-btn-secondary">
              Sort
              <Icon icon={ArrowDown01Icon} />
            </button>
            <button type="button" className="q-btn q-btn-secondary">
              Columns 6
            </button>
          </div>
          <div className="ml-auto flex items-center gap-(--control-gap)">
            <button type="button" className="q-btn q-btn-ghost max-sm:hidden">
              <Icon icon={Upload01Icon} />
              Import
            </button>
            <button
              type="button"
              className="q-btn q-btn-ghost q-btn-icon"
              aria-label="Delete selected rows"
              title="order_totals is a view: its rows are read-only"
              disabled
            >
              <Icon icon={Delete02Icon} />
            </button>
            <button
              type="button"
              className="q-btn q-btn-ghost q-btn-icon"
              aria-label="More options"
            >
              <Icon icon={MoreHorizontalIcon} />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto border-t border-hairline">
          {rows.length > 0 ? (
            <OrdersGrid
              rows={rows}
              columns={["order_id", "customer", "status", "ordered_at", "total", "items"]}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <p className="q-empty m-(--pad-panel)">No orders with this status on this page.</p>
          )}
        </div>
        <div className="q-toolbar border-t border-hairline text-(length:--text-ui) text-ink-muted">
          <span className="q-num">
            {rows.length} of {SAMPLE_COUNTS.order_totals} rows · total{" "}
            <span className="font-mono text-ink">{money.format(sumTotals(rows))}</span>
          </span>
          <span className="q-num ml-auto max-sm:hidden">
            Page 1 of {Math.ceil(SAMPLE_COUNTS.order_totals / PAGE_SIZE)}
          </span>
          <button
            type="button"
            className="q-btn q-btn-ghost q-btn-icon q-btn-sm"
            aria-label="Previous page"
            disabled
          >
            <Icon icon={ArrowLeft01Icon} />
          </button>
          <button
            type="button"
            className="q-btn q-btn-ghost q-btn-icon q-btn-sm"
            aria-label="Next page"
            title="The preview holds one page"
            disabled
          >
            <Icon icon={ArrowRight01Icon} />
          </button>
        </div>
      </div>

      <aside
        aria-label={`Order ${selected.id}`}
        className="flex flex-col gap-(--gap) border-t border-hairline p-(--pad-panel) lg:border-l"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="q-card-title">Order {selected.id}</h2>
          <StatusPill status={selected.status} />
        </div>
        <dl className="flex flex-col gap-2 text-(length:--text-ui)">
          {(
            [
              ["Customer", selected.customer],
              ["City", selected.city],
              ["Ordered", selected.orderedAt],
              ["Total", money.format(selected.total)],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-ink-muted">{label}</dt>
              <dd
                className={cn(
                  "q-num text-right font-mono text-(length:--text-cell)",
                  value === null && "q-cell-null",
                )}
              >
                {value ?? "NULL"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-2">
          <h3 className="text-(length:--text-ui) font-medium">
            Items <span className="q-num text-ink-muted">{selected.items}</span>
          </h3>
          <ul className="flex flex-col rounded-lg bg-canvas px-3 py-1 font-mono text-(length:--text-cell)">
            {selected.lines.split(", ").map((line) => (
              <li key={line} className="flex h-(--row) items-center">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <button type="button" className="q-btn q-btn-secondary self-start">
          Open in orders
        </button>
      </aside>
    </div>
  );
}

function StructureView() {
  return (
    <div className="min-h-0 flex-1 overflow-auto border-t border-hairline">
      <table data-ui className="q-table q-table-data">
        <thead>
          <tr>
            <th scope="col">Column</th>
            <th scope="col">Type</th>
            <th scope="col">From</th>
          </tr>
        </thead>
        <tbody>
          {VIEW_COLUMNS.map((column) => (
            <tr key={column.name}>
              <td className="font-medium">{column.name}</td>
              <td className="text-ink-muted">{column.type}</td>
              <td>{column.from}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QueryView() {
  const results = totalsByStatus(ORDER_ROWS);
  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-hairline">
      <div className="flex items-start gap-(--gap) p-(--pad-panel)">
        <SqlCode code={STATUS_QUERY} className="flex-1" />
        <button type="button" className="q-btn q-btn-primary">
          Run
        </button>
      </div>
      <p className="q-toolbar q-num border-t border-hairline text-(length:--text-ui) text-ink-muted">
        {results.length} rows
      </p>
      <div className="min-h-0 flex-1 overflow-auto border-t border-hairline">
        <StatusTotalsTable totals={results} />
      </div>
    </div>
  );
}

const VIEWS: [View, string][] = [
  ["data", "Data"],
  ["structure", "Structure"],
  ["sql", "SQL"],
];
const TABS = [
  ["view", ACTIVE_OBJECT, ViewIcon],
  ["query", "Orders by status", CommandLineIcon],
] as const;

/**
 * The desktop editor in Pastel Quill: a canvas-tinted L-frame (sidebar and
 * top bar) around one working sheet. Compact density by default, since the
 * desktop app carries the most options per screen; the top bar switches it.
 */
export function EditorPreview() {
  const [density, setDensity] = useState<Density>("compact");
  const [tab, setTab] = useState<Tab>("view");
  const [view, setView] = useState<View>("data");

  return (
    <div
      data-density={density}
      className="flex min-h-dvh bg-canvas text-ink lg:h-dvh lg:overflow-hidden"
    >
      <aside className="hidden w-60 shrink-0 lg:block">
        <Navigation />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[calc(var(--control)+12px)] shrink-0 items-center gap-3 px-3 lg:pl-0">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="q-btn q-btn-ghost q-btn-icon lg:hidden"
                aria-label="Open navigation"
              >
                <Icon icon={Menu01Icon} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(18rem,88vw)] p-0" data-density={density}>
              <SheetTitle className="sr-only">Database navigation</SheetTitle>
              <Navigation />
            </SheetContent>
          </Sheet>
          <button
            type="button"
            className="q-input mx-auto flex max-w-[548px] items-center gap-2 text-left text-ink-muted"
          >
            <Icon icon={Search01Icon} className="size-(--icon) shrink-0" />
            <span className="truncate">
              Search<span className="max-sm:hidden"> tables, columns and saved queries</span>
            </span>
            <kbd className="q-kbd ml-auto max-sm:hidden">Ctrl K</kbd>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="q-btn q-btn-ghost max-sm:hidden"
              aria-label={`Density: ${density}. Switch`}
              onClick={() => setDensity((d) => (d === "compact" ? "comfortable" : "compact"))}
            >
              {density === "compact" ? "Compact" : "Comfortable"}
            </button>
            <button type="button" className="q-btn q-btn-ghost max-sm:hidden">
              <span aria-hidden className="q-dot text-decor" />
              MCP off
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col border-hairline bg-surface lg:mr-2 lg:mb-2 lg:overflow-hidden lg:rounded-(--radius-frame) lg:border">
          <div role="tablist" aria-label="Open objects" className="q-tabs px-(--pad-panel)">
            {TABS.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className="q-tab"
              >
                <Icon icon={icon} />
                <span className={cn(id === "view" && "font-mono")}>{label}</span>
              </button>
            ))}
            <button
              type="button"
              className="q-btn q-btn-ghost q-btn-icon q-btn-sm mb-1.5"
              aria-label="New query"
            >
              <Icon icon={PlusSignIcon} />
            </button>
          </div>

          {tab === "view" ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-(--gap) px-(--pad-panel) py-(--gap)">
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h1 className="q-title-app font-mono">{ACTIVE_OBJECT}</h1>
                    <span className="q-badge">View</span>
                  </div>
                  <p className="text-(length:--text-ui) text-ink-muted">
                    Each order’s total and item count, from orders, customers and order_items
                  </p>
                </div>
                <div className="flex items-center gap-(--control-gap)">
                  <div className="q-segmented" role="group" aria-label="Show">
                    {VIEWS.map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={view === id}
                        onClick={() => setView(id)}
                        className="q-segment"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="q-btn q-btn-secondary">
                    <Icon icon={Download01Icon} />
                    Export
                  </button>
                </div>
              </div>
              {view === "data" && <DataView />}
              {view === "structure" && <StructureView />}
              {view === "sql" && (
                <div className="min-h-0 flex-1 overflow-auto border-t border-hairline p-(--pad-panel)">
                  <SqlCode code={VIEW_SQL} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="px-(--pad-panel) py-(--gap)">
                <h1 className="q-title-app">Orders by status</h1>
                <p className="text-(length:--text-ui) text-ink-muted">
                  Saved query over the first page of order_totals
                </p>
              </div>
              <QueryView />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
