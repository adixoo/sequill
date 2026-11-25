import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mark, Note } from "@/components/common/pastel/annotation";
import { ASSISTANTS } from "@/components/landing/desktop-app";
import { FACTS } from "@/components/landing/hero";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { FaqIndex } from "@/components/quill/faq-index";
import {
  FormatsTable,
  SchemaDiagram,
  StorageCard,
  StructureSql,
} from "@/components/quill/feature-fragments";
import { HeroGrid } from "@/components/quill/hero-grid";
import { McpFragment } from "@/components/quill/mcp-fragment";
import { SiteFooter, SiteNav } from "@/components/quill/site-chrome";
import { Steps } from "@/components/quill/steps";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pastel Quill landing" };

/** A gray feature card holding a real fragment of the product instead of an icon. */
function FeatureCard({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      data-reveal
      className={cn("flex min-w-0 flex-col gap-6 rounded-xl bg-raised p-(--space-card)", className)}
    >
      <div className="flex flex-col gap-2">
        <h3 className="q-title-md">{title}</h3>
        <p className="max-w-[48ch] text-ink-soft">{body}</p>
      </div>
      <div className="mt-auto min-w-0">{children}</div>
    </article>
  );
}

export default function QuillLanding() {
  return (
    <div className="flex flex-1 flex-col bg-surface">
      <ScrollReveal />
      <SiteNav />

      <main className="flex flex-1 flex-col">
        <section
          aria-labelledby="hero-title"
          className="q-container pt-12 pb-(--space-section) lg:pt-20"
        >
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-6">
              <h1 id="hero-title" className="q-display-xl max-w-[12ch]">
                The offline SQLite editor
              </h1>
              <p className="max-w-[46ch] text-lg text-ink-soft">
                Open a .sqlite or .db file, then browse, filter, edit and query it in your browser
                or on your desktop. Nothing is uploaded: SQLite runs on your machine.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/test/app" className="q-btn q-btn-lg q-btn-primary">
                  Open the editor
                </Link>
                <Link href="/download" className="q-btn q-btn-lg q-btn-secondary">
                  Download for desktop
                </Link>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-6">
              <HeroGrid />
              <div aria-hidden className="relative mt-2 hidden h-20 lg:block">
                <Mark
                  name="rise"
                  className="absolute top-0 left-8 h-20 w-10"
                  delay={0.3}
                  strokeWidth={4}
                />
                <Note className="absolute top-9 left-24" delay={0.6}>
                  0 bytes leave your machine
                </Note>
              </div>
            </div>
          </div>

          <ul
            data-reveal
            aria-label="At a glance"
            className="mt-16 grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-medium text-ink-soft sm:grid-cols-3 lg:grid-cols-5"
          >
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </section>

        <section
          id="editor"
          aria-labelledby="editor-title"
          className="scroll-mt-4 bg-canvas py-(--space-section)"
        >
          <div className="q-container flex flex-col gap-12">
            <div data-reveal className="flex max-w-[40rem] flex-col gap-4">
              <h2 id="editor-title" className="q-display-lg">
                From file to answer
              </h2>
              <p className="text-lg text-ink-soft">
                A grid on top of the real database, with the SQL one click away.
              </p>
            </div>
            <Steps />
          </div>
        </section>

        <section
          id="features"
          aria-labelledby="features-title"
          className="q-container scroll-mt-4 py-(--space-section)"
        >
          <h2 id="features-title" data-reveal className="q-display-lg mb-12 max-w-[18ch]">
            All of SQLite, none of the setup
          </h2>
          <div className="grid gap-6 lg:grid-cols-12">
            <FeatureCard
              className="lg:col-span-8"
              title="Draw the schema"
              body="The schema designer lays out your tables and their keys. Change a column there and the editor sees it."
            >
              <SchemaDiagram />
            </FeatureCard>
            <FeatureCard
              className="lg:col-span-4"
              title="Bring data in, take it out"
              body="Import files into a table and export any result, or keep the whole database."
            >
              <FormatsTable />
            </FeatureCard>
            <FeatureCard
              className="lg:col-span-4"
              title="Yours, on this device"
              body="No account and no server. After the first visit it opens with no connection."
            >
              <StorageCard />
            </FeatureCard>
            <FeatureCard
              className="lg:col-span-8"
              title="Indexes, triggers and views"
              body="Every object in the file, with the SQL that made it. Create new ones from a form or by hand."
            >
              <StructureSql />
            </FeatureCard>
          </div>
        </section>

        <section
          id="desktop"
          aria-labelledby="desktop-title"
          className="scroll-mt-4 bg-canvas py-(--space-section)"
        >
          <div className="q-container grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div data-reveal className="flex min-w-0 flex-col gap-6 lg:col-span-6">
              <h2 id="desktop-title" className="q-display-lg">
                Also on your desktop
              </h2>
              <p className="max-w-[46ch] text-lg text-ink-soft">
                The same editor for Windows, macOS and Linux, on a native SQLite engine, so large
                databases stay real files on your disk.
              </p>
              <p className="max-w-[46ch] text-ink-soft">
                Its built-in MCP server lets {ASSISTANTS} read your databases and run queries.
                Changes need a second switch, and every call is kept in History.
              </p>
              <div>
                <Link href="/download" className="q-btn q-btn-lg q-btn-primary">
                  Download the desktop app
                </Link>
              </div>
            </div>
            <div data-reveal className="lg:col-span-5 lg:col-start-8">
              <McpFragment />
            </div>
          </div>
        </section>

        <section
          id="questions"
          aria-labelledby="questions-title"
          className="q-container scroll-mt-4 py-(--space-section)"
        >
          <h2 id="questions-title" data-reveal className="q-display-lg mb-12">
            Questions
          </h2>
          <FaqIndex />
        </section>

        <section aria-labelledby="cta-title" className="q-container pb-(--space-section)">
          <div
            data-reveal
            className="flex flex-col items-start gap-6 rounded-xl bg-raised p-8 md:flex-row md:items-center md:justify-between md:p-12"
          >
            <div className="flex flex-col gap-2">
              <h2 id="cta-title" className="q-display-sm">
                Open the sample shop in a second
              </h2>
              <p className="text-ink-soft">
                Four tables, a view and a trigger to try every part of the editor on.
              </p>
            </div>
            <Link href="/test/app" className="q-btn q-btn-lg q-btn-primary">
              Open the editor
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
