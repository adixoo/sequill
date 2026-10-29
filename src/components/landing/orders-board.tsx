"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SAMPLE_ORDERS, type OrderStatus } from "./sample-data";

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-butter",
  paid: "bg-sky",
  shipped: "bg-mint",
  cancelled: "bg-rose",
};
const OPEN_FIRST = 3;
const money = new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * The sample shop's orders set as a board of rows, a real fragment of what the
 * editor shows. Rows are buttons; the open one shows the order's items.
 */
export function OrdersBoard() {
  const [open, setOpen] = useState(SAMPLE_ORDERS[OPEN_FIRST].id);
  return (
    <div
      data-ui
      className="-my-9 flex flex-col gap-1 overflow-hidden py-0 [clip-path:inset(36px_0)] max-lg:-my-8 max-lg:[clip-path:inset(32px_0)]"
    >
      <ul aria-label="Orders in the sample shop" className="flex flex-col gap-1">
        {SAMPLE_ORDERS.map((order) => {
          const isOpen = order.id === open;
          return (
            <li key={order.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(order.id)}
                className={cn(
                  "ln-press grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 rounded-(--ln-radius) px-5 text-left lg:grid-cols-12 lg:gap-x-(--ln-gap) lg:px-6",
                  isOpen
                    ? "h-[200px] content-center bg-sky text-(--on-accent) lg:h-[216px]"
                    : "h-16 bg-surface lg:h-[72px]",
                )}
              >
                <span
                  className={cn(
                    "truncate font-semibold tracking-[-0.02em] lg:col-span-5",
                    isOpen ? "ln-heading" : "ln-statement",
                  )}
                >
                  {order.customer}
                </span>
                <span className="text-right lg:hidden">
                  <Status status={order.status} />
                </span>
                <span
                  className={cn(
                    "pn-tnum ln-statement max-lg:hidden lg:col-span-2",
                    !order.city && "text-ink-muted",
                    isOpen && "text-(--on-accent)",
                  )}
                >
                  {order.city ?? "NULL"}
                </span>
                <span className="pn-tnum ln-statement max-lg:hidden lg:col-span-2">
                  {order.orderedAt.slice(0, 10)}
                </span>
                <span className="pn-tnum ln-statement text-right max-lg:hidden lg:col-span-2">
                  {money.format(order.total)}
                </span>
                <span className="text-right max-lg:hidden">
                  <Status status={order.status} />
                </span>
                {isOpen && (
                  <span className="col-span-full mt-3 flex flex-col gap-0.5 text-[17px] leading-snug">
                    <span>
                      Order {order.id}, {order.orderedAt}: {order.lines}
                    </span>
                    <span className="lg:hidden">
                      {order.city ?? "No city"} · {money.format(order.total)}
                    </span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Status({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-xs px-2.5 py-1 text-[17px] font-semibold text-(--on-accent)",
        STATUS_CLASS[status],
      )}
    >
      {status}
    </span>
  );
}
