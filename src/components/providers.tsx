"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ServiceWorkerRegistrar } from "@/components/pwa";
import { ThemeMigration, THEMES } from "@/components/theme-toggle";

const loadMotionFeatures = () => import("@/lib/motion-features").then((m) => m.default);

/** App-wide providers. Kept minimal: the landing page ships with these only. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      themes={[...THEMES]}
      defaultTheme={THEMES[0]}
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeMigration />
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          {children}
          <ServiceWorkerRegistrar />
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
