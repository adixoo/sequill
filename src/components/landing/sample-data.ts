/**
 * Real values from the built-in sample shop, shown on the landing page without
 * loading SQLite. Kept in step with SAMPLE_DB_SQL by sample-data.test.ts.
 */
import type { SqliteFileReport } from "@/lib/sqlite/file-header";

/** The first ten rows of the `order_totals` view, as the editor shows them, with each order's items. */
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface SampleOrder {
  id: number;
  customer: string;
  city: string | null;
  orderedAt: string;
  total: number;
  status: OrderStatus;
  lines: string;
}

export const SAMPLE_ORDERS: readonly SampleOrder[] = [
  {
    id: 1,
    customer: "Asha Costa",
    city: "Lagos",
    orderedAt: "2024-02-23 09:07",
    total: 464.75,
    status: "pending",
    lines: "3 × Midnight Mug, 4 × Velvet Lamp",
  },
  {
    id: 2,
    customer: "Chloé Kowalski",
    city: "Berlin",
    orderedAt: "2024-04-16 09:14",
    total: 202.75,
    status: "pending",
    lines: "2 × Soft Notebook, 4 × Pastel Planner, 1 × Ceramic Vase",
  },
  {
    id: 3,
    customer: "Asha Martin",
    city: null,
    orderedAt: "2024-06-08 09:21",
    total: 25.75,
    status: "paid",
    lines: "1 × Linen Pen set",
  },
  {
    id: 4,
    customer: "Asha Rao",
    city: "Lisbon",
    orderedAt: "2024-07-31 09:28",
    total: 245.75,
    status: "shipped",
    lines: "3 × Midnight Mug, 2 × Soft Notebook",
  },
  {
    id: 5,
    customer: "Lena Ito",
    city: "Lagos",
    orderedAt: "2024-09-22 09:35",
    total: 474.5,
    status: "shipped",
    lines: "3 × Copper Teapot, 4 × Pastel Planner, 1 × Ceramic Vase",
  },
  {
    id: 6,
    customer: "Kai Haddad",
    city: "Berlin",
    orderedAt: "2024-01-19 09:42",
    total: 172,
    status: "shipped",
    lines: "4 × Velvet Lamp",
  },
  {
    id: 7,
    customer: "Lena Silva",
    city: null,
    orderedAt: "2024-03-12 09:49",
    total: 278.75,
    status: "shipped",
    lines: "1 × Ceramic Vase, 2 × Soft Notebook",
  },
  {
    id: 8,
    customer: "Ivo Martin",
    city: "Lisbon",
    orderedAt: "2024-05-04 09:56",
    total: 245.75,
    status: "shipped",
    lines: "4 × Pastel Planner, 2 × Paper Throw, 3 × Copper Teapot",
  },
  {
    id: 9,
    customer: "Lena Berg",
    city: "Osaka",
    orderedAt: "2024-06-26 10:03",
    total: 300.75,
    status: "shipped",
    lines: "3 × Midnight Mug",
  },
  {
    id: 10,
    customer: "Lena Nakamura",
    city: "Toronto",
    orderedAt: "2024-08-18 10:10",
    total: 321.75,
    status: "cancelled",
    lines: "4 × Pastel Planner, 1 × Ceramic Vase",
  },
];

/** The query that produces SAMPLE_ORDERS from the sample database. */
export const SAMPLE_ORDERS_SQL = `
SELECT t.order_id AS id, t.customer, c.city, substr(t.ordered_at, 1, 16) AS orderedAt,
       t.total, t.status,
       (SELECT group_concat(i.quantity || ' × ' || p.name, ', ')
          FROM order_items i JOIN products p ON p.id = i.product_id
         WHERE i.order_id = t.order_id) AS lines
  FROM order_totals t
  JOIN orders o ON o.id = t.order_id
  JOIN customers c ON c.id = o.customer_id
 WHERE t.order_id <= 10
 ORDER BY t.order_id`;

/** What the landing page's file reader shows for the sample shop's file. */
export const SAMPLE_FILE: { name: string; size: number; report: SqliteFileReport } = {
  name: "Sample shop.sqlite",
  size: 73_728,
  report: {
    header: {
      pageSize: 8192,
      pageCount: 9,
      reservedBytes: 0,
      journal: "rollback",
      encoding: "UTF-8",
      freelistPages: 0,
      userVersion: 0,
      applicationId: 0,
      sqliteVersion: "3.54.1",
    },
    schema: [
      { kind: "table", name: "customers" },
      { kind: "table", name: "products" },
      { kind: "table", name: "orders" },
      { kind: "table", name: "order_items" },
      { kind: "index", name: "orders_customer" },
      { kind: "index", name: "products_category" },
      { kind: "view", name: "order_totals" },
      { kind: "trigger", name: "order_items_stock" },
    ],
  },
};
