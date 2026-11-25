import type { ReactNode } from "react";
import { TOKEN_CLASS } from "@/components/common/pastel/code-block";
import type { OrderStatus } from "@/components/landing/sample-data";
import { tokenizeSql } from "@/lib/sqlite/highlight";
import { cn } from "@/lib/utils";
import { money, STATUS_TONE, type OrderRow, type StatusTotal } from "./data";

export function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={cn("q-badge", STATUS_TONE[status])}>{status}</span>;
}

export type OrderColumn =
  "order_id" | "customer" | "city" | "status" | "ordered_at" | "total" | "items";

const COLUMNS: Record<
  OrderColumn,
  { type: string; numeric?: boolean; cell: (row: OrderRow) => ReactNode }
> = {
  order_id: { type: "integer", numeric: true, cell: (row) => row.id },
  customer: { type: "text", cell: (row) => row.customer },
  city: {
    type: "text",
    cell: (row) => row.city ?? <span className="q-cell-null">NULL</span>,
  },
  status: { type: "text", cell: (row) => <StatusPill status={row.status} /> },
  ordered_at: { type: "text", cell: (row) => row.orderedAt },
  total: { type: "real", numeric: true, cell: (row) => money.format(row.total) },
  items: { type: "integer", numeric: true, cell: (row) => row.items },
};

interface OrdersGridProps {
  rows: readonly OrderRow[];
  columns: readonly OrderColumn[];
  selectedId?: number;
  /** When given, rows are selectable buttons. */
  onSelect?: (id: number) => void;
  className?: string;
}

/**
 * The editor's data grid (q-table): sentence-case headers with their type,
 * mono values, right-aligned numbers, rules instead of zebra stripes. Row
 * height follows the surrounding density.
 */
export function OrdersGrid({ rows, columns, selectedId, onSelect, className }: OrdersGridProps) {
  return (
    <table data-ui className={cn("q-table q-table-data", onSelect && "q-table-hover", className)}>
      <thead>
        <tr>
          {columns.map((key) => (
            <th key={key} scope="col" className={cn(COLUMNS[key].numeric && "num")}>
              {key} <span className="ml-1 font-mono font-normal">{COLUMNS[key].type}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const selected = row.id === selectedId;
          return (
            <tr
              key={row.id}
              aria-selected={onSelect ? selected : undefined}
              onClick={onSelect && (() => onSelect(row.id))}
              className={cn(onSelect && "cursor-pointer")}
            >
              {columns.map((key, i) => (
                <td key={key} className={cn(COLUMNS[key].numeric && "num")}>
                  {i === 0 && onSelect ? (
                    <button
                      type="button"
                      aria-label={`Select order ${row.id}`}
                      aria-pressed={selected}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(row.id);
                      }}
                      className="rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {COLUMNS[key].cell(row)}
                    </button>
                  ) : (
                    COLUMNS[key].cell(row)
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** The "orders by status" query's result grid. */
export function StatusTotalsTable({ totals }: { totals: readonly StatusTotal[] }) {
  return (
    <table data-ui className="q-table q-table-data">
      <thead>
        <tr>
          <th scope="col">status</th>
          <th scope="col" className="num">
            orders
          </th>
          <th scope="col" className="num">
            revenue
          </th>
        </tr>
      </thead>
      <tbody>
        {totals.map((row) => (
          <tr key={row.status}>
            <td>
              <StatusPill status={row.status} />
            </td>
            <td className="num">{row.orders}</td>
            <td className="num">{money.format(row.revenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** SQL coloured with the Pastel tokens (keywords lilac, strings mint, numbers peach). */
export function SqlCode({ code, className }: { code: string; className?: string }) {
  return (
    <pre
      data-ui
      className={cn(
        "overflow-x-auto font-mono text-(length:--text-cell) leading-relaxed",
        className,
      )}
    >
      <code>
        {tokenizeSql(code).map((token, i) => (
          <span key={i} className={TOKEN_CLASS[token.type]}>
            {token.text}
          </span>
        ))}
      </code>
    </pre>
  );
}
