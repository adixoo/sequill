"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { SerwistProvider } from "@serwist/next/react";
import type { ReactNode } from "react";
import { ThemeMigration, THEMES } from "@/components/common/theme-toggle";
import { SERVICE_WORKER_URL } from "@/lib/constants";

const loadMotionFeatures = () => import("@/lib/motion-features").then((m) => m.default);

/** App-wide providers. Kept minimal: the landing page ships with these only. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    // The worker only exists in production builds. Everything is precached, so
    // pages don't need caching as they're visited, and coming back online must
    // not reload the page over unsaved work. The worker bundle has no imports,
    // so it registers as a classic script, which every browser supports.
    <SerwistProvider
      swUrl={SERVICE_WORKER_URL}
      disable={process.env.NODE_ENV !== "production"}
      cacheOnNavigation={false}
      reloadOnOnline={false}
      options={{ type: "classic" }}
    >
      <ThemeProvider
        attribute="class"
        themes={[...THEMES]}
        defaultTheme={THEMES[0]}
        enableSystem={false}
        disableTransitionOnChange
      >
        <ThemeMigration />
        <LazyMotion features={loadMotionFeatures} strict>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LazyMotion>
      </ThemeProvider>
    </SerwistProvider>
  );
}
