"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

/** The only themes: Pastel Noir is dark-first, with a derived light theme. */
export const THEMES = ["dark", "light"] as const;
type ThemeName = (typeof THEMES)[number];

const NEXT = { dark: "light", light: "dark" } as const;
const ICONS = { dark: Moon, light: Sun } as const;

const subscribeNoop = () => () => {};
const isThemeName = (theme: string | undefined): theme is ThemeName =>
  theme === "dark" || theme === "light";

/** One button that switches between dark and light. No menu, so it adds almost nothing to the bundle. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known in the browser; render the default icon on the server.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const current: ThemeName = mounted && isThemeName(theme) ? theme : "dark";
  const Icon = ICONS[current];
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={`Theme: ${current}. Switch to ${NEXT[current]}`}
      title={`Theme: ${current}`}
      onClick={() => setTheme(NEXT[current])}
    >
      <Icon />
    </Button>
  );
}

/** Earlier versions could store "system"; move anything that isn't a theme to the default. */
export function ThemeMigration() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    if (theme !== undefined && !isThemeName(theme)) setTheme(THEMES[0]);
  }, [theme, setTheme]);
  return null;
}
