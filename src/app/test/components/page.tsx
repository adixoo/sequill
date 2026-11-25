import {
  ArrowDown01Icon,
  Delete02Icon,
  Download01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  PlusSignIcon,
  Search01Icon,
  TableIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { money, ORDER_ROWS, SAMPLE_COUNTS, SAMPLE_FILE } from "@/components/quill/data";
import { StatusPill } from "@/components/quill/fragments";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Pastel Quill components" };

type Density = "comfortable" | "compact";
const DENSITIES: Density[] = ["comfortable", "compact"];

/** One specimen drawn in both densities, side by side. */
function Pair({ children }: { children: (density: Density) => ReactNode }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {DENSITIES.map((density) => (
        <div
          key={density}
          data-ui
          data-density={density}
          className="flex min-w-0 flex-col gap-4 rounded-xl border border-hairline bg-surface p-5"
        >
          <p className="text-xs text-ink-muted capitalize">{density}</p>
          {children(density)}
        </div>
      ))}
    </div>
  );
}

function Section({
  id,
  title,
  use,
  children,
}: {
  id: string;
  title: string;
  use: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-6 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="q-title-md">
          {title}
        </h2>
        <p className="max-w-[70ch] text-sm text-ink-soft">{use}</p>
      </div>
      {children}
    </section>
  );
}

const Row = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-(--control-gap)">{children}</div>
);

const SECTIONS = [
  ["buttons", "Buttons"],
  ["controls", "Chips, segments, tabs"],
  ["fields", "Fields"],
  ["choices", "Choices"],
  ["badges", "Badges"],
  ["cards", "Cards"],
  ["tables", "Tables"],
  ["navigation", "Navigation"],
  ["overlays", "Overlays"],
  ["feedback", "Feedback"],
] as const;

const TOTAL_ROWS = SAMPLE_COUNTS.customers + SAMPLE_COUNTS.products + SAMPLE_COUNTS.orders;

export default function QuillComponents() {
  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <header className="border-b border-hairline bg-surface">
        <div className="q-container flex flex-wrap items-end justify-between gap-4 py-8">
          <div className="flex flex-col gap-2">
            <h1 className="q-display-md">Pastel Quill components</h1>
            <p className="max-w-[60ch] text-ink-soft">
              Every q-* component in both densities. Comfortable is the default for pages and forms;
              compact is for option-heavy desktop screens.
            </p>
          </div>
          <nav aria-label="Preview pages" className="flex items-center gap-2">
            <Link href="/test" className="q-btn q-btn-ghost">
              Landing
            </Link>
            <Link href="/test/app" className="q-btn q-btn-secondary">
              Desktop editor
            </Link>
            <ThemeToggle />
          </nav>
        </div>
        <nav aria-label="Sections" className="q-container pb-4">
          <ul className="flex flex-wrap gap-1">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="q-btn q-btn-ghost q-btn-sm">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="q-container flex flex-col gap-16 py-12">
        <Section
          id="buttons"
          title="Buttons"
          use="One primary per screen, in ink. Secondary for the other actions, soft for grouped commands, ghost for toolbars, danger for destructive ones, link inside text."
        >
          <Pair>
            {() => (
              <>
                <Row>
                  <button type="button" className="q-btn q-btn-primary">
                    Primary
                  </button>
                  <button type="button" className="q-btn q-btn-secondary">
                    Secondary
                  </button>
                  <button type="button" className="q-btn q-btn-soft">
                    Soft
                  </button>
                  <button type="button" className="q-btn q-btn-ghost">
                    Ghost
                  </button>
                  <button type="button" className="q-btn q-btn-danger">
                    Delete
                  </button>
                  <button type="button" className="q-btn q-btn-link">
                    Link
                  </button>
                </Row>
                <Row>
                  <button type="button" className="q-btn q-btn-primary q-btn-sm">
                    Small
                  </button>
                  <button type="button" className="q-btn q-btn-primary">
                    Default
                  </button>
                  <button type="button" className="q-btn q-btn-primary q-btn-lg">
                    Large
                  </button>
                  <button type="button" className="q-btn q-btn-secondary" disabled>
                    Disabled
                  </button>
                </Row>
                <Row>
                  <button type="button" className="q-btn q-btn-secondary">
                    <Icon icon={PlusSignIcon} />
                    Add row
                  </button>
                  <button type="button" className="q-btn q-btn-secondary">
                    <Icon icon={Download01Icon} />
                    Export
                  </button>
                  <button type="button" className="q-btn q-btn-ghost q-btn-icon" aria-label="Edit">
                    <Icon icon={PencilEdit01Icon} />
                  </button>
                  <button
                    type="button"
                    className="q-btn q-btn-secondary q-btn-icon"
                    aria-label="More options"
                  >
                    <Icon icon={MoreHorizontalIcon} />
                  </button>
                  <button
                    type="button"
                    className="q-btn q-btn-secondary q-btn-icon q-btn-round"
                    aria-label="Delete"
                  >
                    <Icon icon={Delete02Icon} />
                  </button>
                </Row>
                <Row>
                  <div className="q-btn-group" role="group" aria-label="Grid options">
                    <button type="button" className="q-btn q-btn-secondary">
                      Sort
                      <Icon icon={ArrowDown01Icon} />
                    </button>
                    <button type="button" className="q-btn q-btn-secondary" aria-pressed="true">
                      Filter 1
                    </button>
                    <button type="button" className="q-btn q-btn-secondary">
                      Columns 6
                    </button>
                  </div>
                </Row>
              </>
            )}
          </Pair>
        </Section>

        <Section
          id="controls"
          title="Chips, segments, tabs"
          use="Chips toggle filters (on is a sky wash). A segmented control switches one view per screen. Underline tabs switch open objects."
        >
          <Pair>
            {() => (
              <>
                <Row>
                  <button type="button" className="q-chip" aria-pressed="true">
                    All
                  </button>
                  <button type="button" className="q-chip" aria-pressed="false">
                    Pending
                  </button>
                  <button type="button" className="q-chip" aria-pressed="false">
                    Shipped
                  </button>
                  <button type="button" className="q-chip" aria-pressed="false">
                    Cancelled
                  </button>
                </Row>
                <div className="q-segmented self-start" role="group" aria-label="Show">
                  <button type="button" className="q-segment" aria-pressed="true">
                    Data
                  </button>
                  <button type="button" className="q-segment" aria-pressed="false">
                    Structure
                  </button>
                  <button type="button" className="q-segment" aria-pressed="false">
                    SQL
                  </button>
                </div>
                <div className="q-tabs" role="tablist" aria-label="Open objects">
                  <button type="button" role="tab" className="q-tab" aria-selected="true">
                    <Icon icon={ViewIcon} />
                    order_totals
                  </button>
                  <button type="button" role="tab" className="q-tab" aria-selected="false">
                    <Icon icon={TableIcon} />
                    customers
                  </button>
                </div>
              </>
            )}
          </Pair>
        </Section>

        <Section
          id="fields"
          title="Fields"
          use="Label above, hint or error below. Strong border, sky focus ring, raspberry when invalid. Text is 16px on phones in both densities."
        >
          <Pair>
            {() => (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="q-field">
                  <span className="q-label">Table name</span>
                  <input className="q-input" defaultValue="order_notes" />
                  <span className="q-hint">Letters, digits and underscores.</span>
                </label>
                <label className="q-field">
                  <span className="q-label">Search</span>
                  <span className="q-input-icon">
                    <Icon icon={Search01Icon} />
                    <input className="q-input" type="search" placeholder="Search 150 rows" />
                  </span>
                </label>
                <label className="q-field">
                  <span className="q-label">Column type</span>
                  <span className="q-select-wrap">
                    <select className="q-select" defaultValue="text">
                      <option value="integer">integer</option>
                      <option value="real">real</option>
                      <option value="text">text</option>
                      <option value="blob">blob</option>
                    </select>
                  </span>
                </label>
                <label className="q-field">
                  <span className="q-label">Price</span>
                  <input className="q-input" defaultValue="-4" aria-invalid="true" />
                  <span className="q-error">CHECK (price &gt;= 0) failed.</span>
                </label>
                <label className="q-field sm:col-span-2">
                  <span className="q-label">Note</span>
                  <textarea className="q-textarea" placeholder="Shown on the order" />
                </label>
                <label className="q-field">
                  <span className="q-label">Row id</span>
                  <input className="q-input" defaultValue="Generated by SQLite" disabled />
                </label>
              </div>
            )}
          </Pair>
        </Section>

        <Section
          id="choices"
          title="Choices"
          use="Native checkbox, radio and switch, filled with ink when on. A switch applies at once; a checkbox waits for Save."
        >
          <Pair>
            {(density) => (
              <div className="grid gap-4 sm:grid-cols-3">
                <fieldset className="flex flex-col gap-2 text-(length:--text-ui)">
                  <legend className="q-label mb-2">Columns</legend>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="q-check" defaultChecked />
                    NOT NULL
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="q-check" />
                    UNIQUE
                  </label>
                  <label className="flex items-center gap-2 text-ink-muted">
                    <input type="checkbox" className="q-check" disabled defaultChecked />
                    PRIMARY KEY
                  </label>
                </fieldset>
                <fieldset className="flex flex-col gap-2 text-(length:--text-ui)">
                  <legend className="q-label mb-2">Export as</legend>
                  {["CSV", "JSON", "SQL"].map((format, i) => (
                    <label key={format} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`format-${density}`}
                        className="q-radio"
                        defaultChecked={i === 0}
                      />
                      {format}
                    </label>
                  ))}
                </fieldset>
                <div className="flex flex-col gap-2 text-(length:--text-ui)">
                  <p className="q-label mb-2">MCP</p>
                  <label className="flex items-center justify-between gap-3">
                    Allow access
                    <input type="checkbox" role="switch" className="q-switch" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    Allow changes
                    <input type="checkbox" role="switch" className="q-switch" />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-ink-muted">
                    History
                    <input type="checkbox" role="switch" className="q-switch" disabled />
                  </label>
                </div>
              </div>
            )}
          </Pair>
        </Section>

        <Section
          id="badges"
          title="Badges, counts, avatars, keys"
          use="Badges sit inside rows or beside a value, never above a heading. Tones carry meaning: butter pending, sky selected or paid, mint done, rose cancelled or failing. A count only marks a queue that needs action."
        >
          <Pair>
            {() => (
              <>
                <Row>
                  <span className="q-badge">View</span>
                  <StatusPill status="pending" />
                  <StatusPill status="paid" />
                  <StatusPill status="shipped" />
                  <StatusPill status="cancelled" />
                  <span className="q-badge q-tone-peach">real</span>
                  <span className="q-badge q-badge-outline">Read-only</span>
                </Row>
                <Row>
                  <span className="q-badge">
                    <span className="q-dot text-mint-ink" />
                    MCP on
                  </span>
                  <span className="flex items-center gap-2 text-(length:--text-ui)">
                    Unsaved edits <span className="q-count">3</span>
                  </span>
                  <span className="q-avatar">AC</span>
                  <span className="q-avatar q-tone-mint">LI</span>
                  <span className="q-avatar q-tone-sky">KH</span>
                  <span className="flex items-center gap-1 text-(length:--text-ui) text-ink-muted">
                    <kbd className="q-kbd">Ctrl</kbd>
                    <kbd className="q-kbd">K</kbd>
                  </span>
                </Row>
              </>
            )}
          </Pair>
        </Section>

        <Section
          id="cards"
          title="Cards"
          use="Default for a panel with an edge, soft (gray, no edge) for marketing feature cards, elevated only for the one floating hero card, interactive for choices, inverse once per page. Peer figures share one stats strip."
        >
          <Pair>
            {() => (
              <>
                <div className="q-stats">
                  {(
                    [
                      ["Tables", "4"],
                      ["Rows", TOTAL_ROWS.toLocaleString("en")],
                      ["Indexes", "2"],
                      ["File", `${Math.round(SAMPLE_FILE.size / 1024)} KB`],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="q-stat">
                      <span className="q-stat-label">{label}</span>
                      <span className="q-stat-value">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="q-card">
                    <div className="q-card-head">
                      <div>
                        <h3 className="q-card-title">order_items</h3>
                        <p className="q-card-desc">Without rowid · 4 columns</p>
                      </div>
                      <span className="q-badge">Table</span>
                    </div>
                    <div className="q-card-foot">
                      <button type="button" className="q-btn q-btn-secondary q-btn-sm">
                        Open
                      </button>
                      <button type="button" className="q-btn q-btn-ghost q-btn-sm">
                        Structure
                      </button>
                    </div>
                  </article>
                  <article className="q-card q-card-soft">
                    <h3 className="q-card-title">Soft card</h3>
                    <p className="q-card-desc">
                      Gray fill, no edge. Holds a real product fragment.
                    </p>
                  </article>
                  <button type="button" className="q-card q-card-interactive" aria-pressed="true">
                    <span className="q-card-title">Native engine</span>
                    <span className="q-card-desc">Desktop app, files on disk</span>
                  </button>
                  <button type="button" className="q-card q-card-interactive" aria-pressed="false">
                    <span className="q-card-title">In this browser</span>
                    <span className="q-card-desc">Private storage, works offline</span>
                  </button>
                  <article className="q-card q-card-elevated">
                    <h3 className="q-card-title">Elevated</h3>
                    <p className="q-card-desc">The one resting shadow: the hero mockup.</p>
                  </article>
                  <article className="q-card q-card-inverse">
                    <h3 className="q-card-title">Inverse</h3>
                    <p className="q-card-desc">Once per page, for the footer close.</p>
                  </article>
                </div>
              </>
            )}
          </Pair>
        </Section>

        <Section
          id="tables"
          title="Tables"
          use="Rules, no zebra. Sentence-case headers with the type, mono values, numbers right-aligned. Selected row in ice, an unsaved edit in cornflower with a dot, an added row in spring green, NULL in muted."
        >
          <Pair>
            {() => (
              <div className="overflow-x-auto rounded-lg border border-hairline">
                <table className="q-table q-table-data q-table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="num">
                        order_id
                      </th>
                      <th scope="col">customer</th>
                      <th scope="col">city</th>
                      <th scope="col">status</th>
                      <th scope="col" className="num">
                        total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORDER_ROWS.slice(0, 3).map((row) => (
                      <tr key={row.id} aria-selected={row.id === 2}>
                        <td className="num">{row.id}</td>
                        <td>{row.customer}</td>
                        {row.id === 1 ? (
                          <td className="q-cell-edited" title="Edited: was Lagos">
                            Accra
                          </td>
                        ) : (
                          <td className={row.city ? undefined : "q-cell-null"}>
                            {row.city ?? "NULL"}
                          </td>
                        )}
                        <td>
                          <StatusPill status={row.status} />
                        </td>
                        <td className="num">{money.format(row.total)}</td>
                      </tr>
                    ))}
                    <tr className="q-row-added">
                      <td className="num q-cell-null">new</td>
                      <td className="q-cell-null">NULL</td>
                      <td className="q-cell-null">NULL</td>
                      <td>
                        <StatusPill status="pending" />
                      </td>
                      <td className="num">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </Pair>
        </Section>

        <Section
          id="navigation"
          title="Navigation"
          use="Sidebar rows with a neutral active pill (never a coloured bar), sentence-case group labels, a breadcrumb for depth."
        >
          <Pair>
            {() => (
              <div className="grid gap-4 sm:grid-cols-2">
                <nav aria-label="Specimen sidebar" className="flex flex-col gap-1">
                  <h3 className="q-nav-label">Tables</h3>
                  <a href="#navigation" className="q-nav-item" aria-current="page">
                    <Icon icon={TableIcon} />
                    customers
                    <span className="q-num ml-auto text-ink-muted">{SAMPLE_COUNTS.customers}</span>
                  </a>
                  <a href="#navigation" className="q-nav-item">
                    <Icon icon={TableIcon} />
                    products
                    <span className="q-num ml-auto text-ink-muted">{SAMPLE_COUNTS.products}</span>
                  </a>
                  <a href="#navigation" className="q-nav-item">
                    <Icon icon={ViewIcon} />
                    order_totals
                  </a>
                </nav>
                <nav aria-label="Breadcrumb" className="q-breadcrumb self-start">
                  <a href="#navigation">Sample shop</a>
                  <span aria-hidden>/</span>
                  <a href="#navigation">Views</a>
                  <span aria-hidden>/</span>
                  <span aria-current="page">order_totals</span>
                </nav>
              </div>
            )}
          </Pair>
        </Section>

        <Section
          id="overlays"
          title="Overlays"
          use="Menus, popovers, dialogs and toasts float: raised fill, hairline edge, the float shadow. Dialogs sit on the backdrop token; tooltips are ink."
        >
          <Pair>
            {() => (
              <div className="grid items-start gap-4 sm:grid-cols-2">
                <div className="q-menu" role="menu" aria-label="Row actions">
                  <p className="q-menu-label">Row 2</p>
                  <button type="button" role="menuitem" className="q-menu-item" data-highlighted>
                    <Icon icon={PencilEdit01Icon} />
                    Edit row
                    <span className="q-menu-kbd">Enter</span>
                  </button>
                  <button type="button" role="menuitem" className="q-menu-item">
                    <Icon icon={Download01Icon} />
                    Copy as JSON
                  </button>
                  <div className="q-menu-sep" role="separator" />
                  <button type="button" role="menuitem" className="q-menu-item q-menu-item-danger">
                    <Icon icon={Delete02Icon} />
                    Delete row
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="q-tooltip self-start">Sort descending</span>
                  <div className="q-toast" role="status">
                    <span className="q-dot mt-1.5 text-mint-ink" aria-hidden />
                    <div>
                      <p className="font-medium">Exported 10 rows</p>
                      <p className="q-toast-desc">order_totals.csv</p>
                    </div>
                  </div>
                </div>
                <div className="q-backdrop grid place-items-center rounded-xl p-4 sm:col-span-2">
                  <div
                    className="q-dialog"
                    role="dialog"
                    aria-modal="false"
                    aria-label="Delete table"
                  >
                    <p className="q-dialog-title">Delete the table order_items?</p>
                    <p className="q-dialog-body">
                      Its rows go with it. The order_items_stock trigger is dropped too.
                    </p>
                    <div className="q-dialog-foot">
                      <button type="button" className="q-btn q-btn-secondary">
                        Cancel
                      </button>
                      <button type="button" className="q-btn q-btn-danger">
                        Delete table
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Pair>
        </Section>

        <Section
          id="feedback"
          title="Feedback"
          use="Notices in the tone of their meaning, a progress bar at its true ratio, flat skeletons at the real size (no shimmer), and an empty state that keeps the frame."
        >
          <Pair>
            {() => (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <p className="q-notice">Views are read-only. Edit orders instead.</p>
                  <p className="q-notice q-tone-butter">3 edits not saved yet.</p>
                  <p className="q-notice q-tone-mint">Saved to Sample shop.sqlite.</p>
                  <p className="q-notice q-tone-rose">FOREIGN KEY constraint failed.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 text-(length:--text-ui)">
                    <div className="flex justify-between">
                      <span>Importing orders.csv</span>
                      <span className="q-num text-ink-muted">96 of 150 rows</span>
                    </div>
                    <div
                      className="q-progress"
                      role="progressbar"
                      aria-valuenow={96}
                      aria-valuemin={0}
                      aria-valuemax={150}
                      aria-label="Import progress"
                    >
                      <span style={{ width: `${(96 / 150) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2" aria-hidden>
                    <span className="q-skeleton w-3/4" />
                    <span className="q-skeleton w-1/2" />
                    <span className="q-skeleton w-2/3" />
                  </div>
                  <div className="q-empty">
                    <p className="font-medium text-ink">No rows match status = refunded</p>
                    <button type="button" className="q-btn q-btn-link self-start text-ink">
                      Clear the filter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Pair>
        </Section>
      </main>
    </div>
  );
}
