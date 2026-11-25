/**
 * Sample-shop data for the Pastel Quill preview (/test), derived from the
 * landing page's real rows so every figure on screen comes from them.
 */
import {
  SAMPLE_FILE,
  SAMPLE_ORDERS,
  type OrderStatus,
  type SampleOrder,
} from "@/components/landing/sample-data";

/** Rows in the sample shop's tables (see SAMPLE_DB_SQL); order_totals has one row per order. */
export const SAMPLE_COUNTS = { customers: 60, products: 40, orders: 150, order_totals: 150 };

export interface OrderRow extends SampleOrder {
  /** Distinct products on the order: order_totals' `items` column. */
  items: number;
}

export const ORDER_ROWS: readonly OrderRow[] = SAMPLE_ORDERS.map((order) => ({
  ...order,
  items: order.lines.split(", ").length,
}));

export const STATUSES: readonly OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

/** Each status as a pastel tone (DESIGN.md: badges). */
export const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "q-tone-butter",
  paid: "q-tone-sky",
  shipped: "q-tone-mint",
  cancelled: "q-tone-rose",
};

export const money = new Intl.NumberFormat("en", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Sum of the rows' totals, added in cents so the displayed figure is exact. */
export function sumTotals(rows: readonly OrderRow[]): number {
  return rows.reduce((cents, row) => cents + Math.round(row.total * 100), 0) / 100;
}

export interface StatusTotal {
  status: OrderStatus;
  orders: number;
  revenue: number;
}

/** GROUP BY status over the given rows, in STATUSES order, skipping empty groups. */
export function totalsByStatus(rows: readonly OrderRow[]): StatusTotal[] {
  return STATUSES.map((status) => {
    const group = rows.filter((row) => row.status === status);
    return { status, orders: group.length, revenue: sumTotals(group) };
  }).filter((total) => total.orders > 0);
}

export const STATUS_QUERY = `SELECT status,
       count(*) AS orders,
       round(sum(total), 2) AS revenue
  FROM order_totals
 WHERE order_id <= 10
 GROUP BY status;`;

export const VIEW_SQL = `CREATE VIEW order_totals AS
  SELECT o.id AS order_id, c.name AS customer, o.status, o.ordered_at,
         round(sum(i.quantity * i.unit_price), 2) AS total, count(*) AS items
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    JOIN order_items i ON i.order_id = o.id
   GROUP BY o.id;`;

/** order_totals' columns as the Structure view lists them. */
export const VIEW_COLUMNS: readonly { name: string; type: string; from: string }[] = [
  { name: "order_id", type: "integer", from: "orders.id" },
  { name: "customer", type: "text", from: "customers.name" },
  { name: "status", type: "text", from: "orders.status" },
  { name: "ordered_at", type: "text", from: "orders.ordered_at" },
  { name: "total", type: "real", from: "sum(quantity × unit_price)" },
  { name: "items", type: "integer", from: "count(order_items)" },
];

export { SAMPLE_FILE };
