export const QUESTIONS: [string, string][] = [
  [
    "Where are my databases kept?",
    "In this browser’s Origin Private File System: private storage that belongs to this site, on this device. Opening a file copies it there, so your original file is never changed. Download the database or a SQL dump whenever you want a copy outside the browser.",
  ],
  [
    "What happens if I clear this site’s data?",
    "Your databases are deleted with it, because that is where they live. The app asks the browser for persistent storage to make automatic clean-ups less likely, but keep a downloaded copy of anything you can’t lose.",
  ],
  [
    "Does it work without a connection?",
    "Yes. After your first visit the whole app is cached, engine included. You can also install it from the browser and open it like any other app.",
  ],
  [
    "Is it the real SQLite?",
    "Yes: the official SQLite build for WebAssembly, version 3.54, running in a background worker. Files it writes open in any other SQLite tool, and files from any other tool open here.",
  ],
  [
    "What do the editor and the schema designer share?",
    "The same databases and the same database menu. Open a file in either one and it is there in the other. A design you haven’t saved yet is kept as a draft for its database.",
  ],
  [
    "Can I open it in two tabs at once?",
    "Not at the same time. The browser lets one tab hold the database storage, so a second tab shows a message until the first one closes.",
  ],
  [
    "How big can a database be?",
    "As big as this browser’s storage quota for the site allows, which is usually a large share of free disk space. Very large exports are limited by memory. The desktop app has no browser quota: it keeps databases as files on your computer.",
  ],
  [
    "Can an AI assistant use my databases?",
    "Yes, in the desktop app. Its built-in MCP server lets Claude, Cursor, VS Code and other assistants read your databases, run queries and show you a table, and edit rows and schema once you allow changes. Access is off until you turn it on, Sequill must be open while the assistant works, and every call is listed in its History.",
  ],
  [
    "Does it work on a phone?",
    "Yes. The editor has its own phone layout, with the list of tables in a drawer.",
  ],
];

/** Questions as filled tiles; one answer open at a time. */
export function Faq() {
  return (
    <section
      id="questions"
      aria-labelledby="questions-title"
      className="ln-board ln-faq scroll-mt-2 items-start"
    >
      <h2
        id="questions-title"
        className="ln-heading col-span-2 px-(--ln-pad) pt-(--ln-pad) pb-4 lg:sticky lg:top-24 lg:col-span-4 lg:pb-0"
      >
        Questions
      </h2>
      <div className="col-span-2 flex flex-col gap-(--ln-gap) lg:col-span-8">
        {QUESTIONS.map(([question, answer], i) => (
          <details
            key={question}
            name="faq"
            open={i === 0}
            className="group rounded-(--ln-radius) bg-surface open:bg-mint open:text-(--on-accent)"
          >
            <summary className="ln-press flex min-h-16 cursor-pointer items-center justify-between gap-6 rounded-(--ln-radius) px-5 py-4 font-semibold group-open:bg-transparent lg:min-h-[72px] lg:px-6">
              {question}
              <span aria-hidden className="relative size-4 shrink-0">
                <span className="ln-plus-bar absolute top-[6.5px] left-0 h-[3px] w-4 rounded-full bg-current" />
                <span className="ln-plus-bar absolute top-[6.5px] left-0 h-[3px] w-4 rounded-full bg-current" />
              </span>
            </summary>
            <p className="max-w-[52ch] px-5 pb-6 lg:px-6">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
