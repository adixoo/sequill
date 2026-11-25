"use client";

import { useState } from "react";
import type { OrderStatus } from "@/components/landing/sample-data";
import { money, ORDER_ROWS, SAMPLE_COUNTS, STATUSES, sumTotals } from "./data";
import { OrdersGrid } from "./fragments";

type Filter = OrderStatus | "all";
const FILTERS: Filter[] = ["all", ...STATUSES];

/**
 * The hero's live fragment: the sample shop's orders with a status filter,
 * the way the editor filters a view, with the total of what is shown.
 */
export function HeroGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const rows = filter === "all" ? ORDER_ROWS : ORDER_ROWS.filter((row) => row.status === filter);

  return (
    <div
      data-ui
      data-density="compact"
      className="overflow-hidden rounded-(--radius-frame) border border-hairline bg-surface shadow-(--shadow-md)"
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-4 text-sm">
        <p className="truncate">
          <span className="text-ink-muted">Sample shop.sqlite / </span>
          <span className="font-semibold">order_totals</span>
        </p>
        <p className="q-num shrink-0 text-ink-muted">
          {ORDER_ROWS.length} of {SAMPLE_COUNTS.order_totals} rows
        </p>
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <div className="q-segmented" role="group" aria-label="Filter by status">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className="q-segment capitalize"
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto border-t border-hairline">
        <OrdersGrid rows={rows} columns={["order_id", "customer", "status", "total"]} />
      </div>
      <p className="q-num flex justify-between border-t border-hairline bg-canvas px-4 py-3 text-sm text-ink-muted">
        <span>
          {rows.length} {rows.length === 1 ? "order" : "orders"}
        </span>
        <span>
          Total <span className="font-mono text-ink">{money.format(sumTotals(rows))}</span>
        </span>
      </p>
    </div>
  );
}
