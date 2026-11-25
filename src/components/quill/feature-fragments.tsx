import { cn } from "@/lib/utils";
import { SAMPLE_FILE } from "./data";
import { SqlCode } from "./fragments";

/** The sample shop's tables and keys, laid out as the schema designer draws them. */
const TABLES: { name: string; columns: [string, string, "pk" | "fk" | ""][] }[] = [
  {
    name: "customers",
    columns: [
      ["id", "integer", "pk"],
      ["name", "text", ""],
      ["email", "text", ""],
      ["city", "text", ""],
    ],
  },
  {
    name: "orders",
    columns: [
      ["id", "integer", "pk"],
      ["customer_id", "integer", "fk"],
      ["ordered_at", "text", ""],
      ["status", "text", ""],
    ],
  },
  {
    name: "order_items",
    columns: [
      ["order_id", "integer", "fk"],
      ["product_id", "integer", "fk"],
      ["quantity", "integer", ""],
      ["unit_price", "real", ""],
    ],
  },
  {
    name: "products",
    columns: [
      ["id", "integer", "pk"],
      ["name", "text", ""],
      ["category", "text", ""],
      ["price", "real", ""],
    ],
  },
];

// Geometry the connector paths are drawn on: 4 boxes of 150px, 34px gaps, 34px heads, 26px rows.
const BOX = 150;
const GAP = 34;
const HEAD = 34;
const ROW = 26;
const rowY = (row: number) => HEAD + row * ROW + ROW / 2;
const left = (box: number) => box * (BOX + GAP);
const right = (box: number) => left(box) + BOX;
const link = (fromBox: number, fromRow: number, toBox: number, toRow: number) => {
  const [x1, y1, x2, y2] = [right(fromBox), rowY(fromRow), left(toBox), rowY(toRow)];
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
};
// customers.id → orders.customer_id; orders.id → order_items.order_id; products.id → order_items.product_id
const LINKS = [
  link(0, 0, 1, 1),
  link(1, 0, 2, 0),
  `M${left(3)} ${rowY(0)} C${right(2) + GAP / 2} ${rowY(0)} ${right(2) + GAP / 2} ${rowY(1)} ${right(2)} ${rowY(1)}`,
];
const WIDTH = 4 * BOX + 3 * GAP;
const HEIGHT = HEAD + 4 * ROW + 2;

export function SchemaDiagram() {
  return (
    <div data-ui className="overflow-x-auto rounded-lg bg-surface p-4">
      <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
        <svg
          aria-hidden
          width={WIDTH}
          height={HEIGHT}
          className="absolute inset-0 fill-none stroke-sky-ink"
          strokeWidth={1.5}
        >
          {LINKS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <ul className="flex" style={{ gap: GAP }} aria-label="Tables and keys">
          {TABLES.map((table) => (
            <li
              key={table.name}
              className="relative overflow-hidden rounded-md border border-hairline bg-surface"
              style={{ width: BOX }}
            >
              <p className="flex h-[34px] items-center border-b border-hairline bg-raised px-2.5 text-sm font-semibold">
                {table.name}
              </p>
              <ul className="font-mono text-xs">
                {table.columns.map(([name, type, key]) => (
                  <li key={name} className="flex h-[26px] items-center gap-1.5 px-2.5">
                    <span className={cn("truncate", key && "font-semibold")}>{name}</span>
                    <span className="ml-auto text-ink-muted">{key || type}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const FORMATS: [string, string][] = [
  ["CSV, TSV", "Import into a table, export rows"],
  ["JSON", "Import into a table, export rows"],
  ["SQL", "Export INSERTs or a full dump"],
  [".sqlite, .db", "Open, then download any time"],
];

export function FormatsTable() {
  return (
    <table data-ui className="w-full rounded-lg bg-surface text-left text-sm">
      <thead>
        <tr className="border-b border-hairline text-xs text-ink-muted">
          <th scope="col" className="h-9 pl-4 font-medium">
            Format
          </th>
          <th scope="col" className="pr-4 font-medium">
            What you can do
          </th>
        </tr>
      </thead>
      <tbody>
        {FORMATS.map(([format, what]) => (
          <tr key={format} className="border-rule h-11 border-b last:border-b-0">
            <td className="pr-3 pl-4 font-mono text-[0.8125rem] whitespace-nowrap">{format}</td>
            <td className="py-2 pr-4">{what}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function StorageCard() {
  return (
    <dl data-ui className="flex flex-col gap-3 rounded-lg bg-surface p-4 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-muted">Database</dt>
        <dd className="font-medium">{SAMPLE_FILE.name}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-muted">Kept in</dt>
        <dd>This browser’s private storage</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-muted">Uploaded</dt>
        <dd className="q-num font-mono">0 bytes</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-muted">Offline</dt>
        <dd className="text-mint-ink">Ready after the first visit</dd>
      </div>
    </dl>
  );
}

const STRUCTURE_SQL = `CREATE INDEX products_category
  ON products(category, price DESC);

CREATE TRIGGER order_items_stock
  AFTER INSERT ON order_items BEGIN
  UPDATE products SET stock = max(stock - new.quantity, 0)
   WHERE id = new.product_id;
END;`;

export function StructureSql() {
  return <SqlCode code={STRUCTURE_SQL} className="rounded-lg bg-surface p-4" />;
}
