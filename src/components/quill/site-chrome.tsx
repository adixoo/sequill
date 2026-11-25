import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { APP_NAME, APP_TAGLINE, LEARN_URL, WEB_REPO_URL } from "@/lib/constants";

const NAV: [string, string][] = [
  ["#editor", "Editor"],
  ["#features", "Features"],
  ["#desktop", "Desktop"],
  ["#questions", "Questions"],
];

/** The top bar: mark and name, a few plain links, one action. */
export function SiteNav() {
  return (
    <header className="bg-surface">
      <div className="q-container flex h-16 items-center gap-6">
        <Link href="/test" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo size={28} />
          {APP_NAME}
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1 text-sm font-medium text-ink-soft">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-md px-3 py-2 transition-colors duration-150 hover:bg-raised hover:text-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link href="/test/app" className="q-btn q-btn-lg q-btn-primary max-sm:px-4">
            Open the editor
          </Link>
        </div>
      </div>
    </header>
  );
}

const FOOTER: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["/app", "Editor"],
      ["/vis", "Schema designer"],
      ["/download", "Desktop app"],
    ],
  },
  {
    title: "Learn",
    links: [
      [LEARN_URL, "Learn SQL"],
      [WEB_REPO_URL, "Source on GitHub"],
    ],
  },
  {
    title: "This preview",
    links: [
      ["/test", "Landing page"],
      ["/test/app", "Desktop editor"],
    ],
  },
];

/** The dark page close, on Graphite Night rather than black. */
export function SiteFooter() {
  return (
    <footer className="bg-(--inverse) py-16 text-(--on-inverse-soft)">
      <div className="q-container grid gap-10 md:grid-cols-[2fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2.5 text-lg font-semibold text-(--on-inverse)">
            <Logo size={28} />
            {APP_NAME}
          </p>
          <p className="max-w-[32ch] text-sm">{APP_TAGLINE}.</p>
        </div>
        {FOOTER.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3 text-sm">
            <h2 className="font-semibold text-(--on-inverse)">{group.title}</h2>
            <ul className="flex flex-col gap-2">
              {group.links.map(([href, label]) => (
                <li key={href}>
                  {href.startsWith("http") ? (
                    <a
                      href={href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="hover:text-(--on-inverse)"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="hover:text-(--on-inverse)">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="q-container mt-12 text-sm">© 2026 {APP_NAME}</p>
    </footer>
  );
}
