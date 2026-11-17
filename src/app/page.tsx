import Link from "next/link";
import { CapabilityShelf } from "@/components/landing/capability-shelf";
import { CloseUps } from "@/components/landing/close-ups";
import { Closing, Marquee, SiteFooter } from "@/components/landing/closing";
import { DesignStrip } from "@/components/landing/design-strip";
import { DesktopApp } from "@/components/landing/desktop-app";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { Intro } from "@/components/landing/intro";
import { OrdersBoard } from "@/components/landing/orders-board";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { Tile } from "@/components/landing/tile";
import { WarmEditor } from "@/components/landing/warm-editor";
import "@/components/landing/landing.css";
import "lenis/dist/lenis.css";

export default function Home() {
  return (
    <div id="top" className="ln flex min-h-dvh flex-col overflow-x-clip bg-canvas">
      <WarmEditor />
      <ScrollReveal />
      <SmoothScroll />
      <Hero />
      <main className="flex flex-1 flex-col gap-(--ln-gap) pt-(--ln-gap)">
        <Intro />

        <section id="editor" aria-labelledby="editor-title" className="scroll-mt-2">
          <div className="ln-board">
            <Tile tone="raised" className="col-span-2 lg:col-span-5" data-reveal>
              <h2 id="editor-title" className="ln-heading">
                The editor
              </h2>
            </Tile>
            <Tile className="col-span-2 flex flex-col gap-4 lg:col-span-7" data-reveal>
              <p className="ln-statement max-w-[40ch]">
                A grid on top of the real database. Sort, filter and search run in SQLite; type over
                a cell to change it, or write SQL with autocomplete for your own tables.
              </p>
              <Link href="/app" className="font-semibold underline underline-offset-4">
                Open the editor
              </Link>
            </Tile>
          </div>
          <div className="mt-(--ln-gap) px-(--ln-margin)">
            <OrdersBoard />
          </div>
        </section>

        <Marquee />
        <CapabilityShelf />
        <DesignStrip />
        <CloseUps />
        <DesktopApp />
        <Faq />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
