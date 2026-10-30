import { ColumnIcon, ColumnName } from "@/components/common/change-marks";
import type { DiagramColumn } from "@/lib/vis/model";
import { cn } from "@/lib/utils";

const column = (name: string, type: string, extra: Partial<DiagramColumn> = {}): DiagramColumn => ({
  name,
  type,
  pk: false,
  notNull: false,
  fk: null,
  draft: true,
  key: `n:${name}`,
  ...extra,
});

const ID = column("id", "INTEGER", { pk: true });
const PRODUCT = column("product_id", "INTEGER");
const LINKED = { ...PRODUCT, fk: { table: "products", column: "id" } };
const RATING = column("rating", "INTEGER", { notNull: true });
const BODY = column("body", "TEXT");
const saved = (c: DiagramColumn): DiagramColumn => ({ ...c, draft: false });

interface Step {
  clause: string;
  columns: DiagramColumn[];
  draft: boolean;
  field: string;
  link?: boolean;
}

/** The same table, further along in each field: the designer's whole workflow. */
const STEPS: Step[] = [
  {
    clause: "First, add a table and give it a name.",
    columns: [ID],
    draft: true,
    field: "bg-surface",
  },
  {
    clause: "Then add its columns. New ones show in green.",
    columns: [ID, PRODUCT, RATING, BODY],
    draft: true,
    field: "bg-raised",
  },
  {
    clause: "Then drag from a column to link it to products.",
    columns: [ID, LINKED, RATING, BODY],
    draft: true,
    field: "bg-zebra",
    link: true,
  },
  {
    clause: "Last, save. It lands in one transaction.",
    columns: [ID, LINKED, RATING, BODY].map(saved),
    draft: false,
    field: "bg-mint text-(--on-accent)",
  },
];

/** A table card drawn like the designer's own, at a readable size. */
function TableCard({ columns, draft, link }: Omit<Step, "clause" | "field">) {
  return (
    <div
      data-ui
      className="ln-lift relative w-[280px] rounded-md border-2 border-hairline bg-surface text-[15px] text-ink"
    >
      <div className="flex h-11 items-center gap-2 rounded-t-[calc(var(--radius-md)-2px)] border-b-2 border-hairline bg-raised px-3.5">
        <span className={cn("font-semibold", draft ? "text-added-ink" : "text-ink")}>reviews</span>
        <span className="ml-auto flex items-center gap-2 text-sm text-ink-muted">
          {draft && (
            <span className="flex items-center gap-1.5 rounded-xs bg-rose-wash px-1.5 py-0.5 font-medium text-rose-ink">
              <span aria-hidden className="size-1.5 rounded-full bg-rose-ink" />
              Unsaved
            </span>
          )}
          <span className="pn-tnum">{columns.length}</span>
        </span>
      </div>
      <ul className="py-1.5">
        {columns.map((c) => (
          <li key={c.key} className="relative flex h-9 items-center gap-2 px-3.5">
            <span className="flex w-4 shrink-0 justify-center">
              <ColumnIcon column={c} />
            </span>
            <ColumnName column={c} className={cn((c.pk || c.fk) && "font-medium")} />
            <span className="ml-auto text-sm text-ink-muted">
              {c.type}
              {c.notNull && "*"}
            </span>
            {link && c.fk && (
              <span
                aria-hidden
                className="absolute top-1/2 left-full w-16 border-t-2 border-dashed border-added max-lg:hidden"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** How the schema designer works, as one card in four fields. */
export function DesignStrip() {
  return (
    <section id="designer" aria-labelledby="designer-title" className="ln-band scroll-mt-2">
      <ol className="mx-(--ln-margin) grid overflow-hidden rounded-(--ln-radius) lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li
            key={step.clause}
            className={cn(
              "relative flex flex-col gap-8 p-5 pb-10 md:max-lg:min-h-[44svh] md:max-lg:flex-row md:max-lg:items-center md:max-lg:justify-between lg:min-h-[76svh] lg:p-7",
              step.field,
            )}
            data-reveal
          >
            <div className="flex flex-col gap-4">
              {i === 0 && (
                <h2 id="designer-title" className="ln-statement font-bold">
                  The schema designer
                </h2>
              )}
              <p className="ln-statement max-w-[16ch]">{step.clause}</p>
            </div>
            <div className="lg:absolute lg:top-[40%] lg:left-1/2 lg:-translate-x-1/2">
              <TableCard columns={step.columns} draft={step.draft} link={step.link} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
