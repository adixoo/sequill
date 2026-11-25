"use client";

import { useState } from "react";
import { QUESTIONS } from "@/components/landing/faq";
import { cn } from "@/lib/utils";

/**
 * Questions on the left, the chosen answer large on the right. On a phone the
 * answer opens under its question instead.
 */
export function FaqIndex() {
  const [selected, setSelected] = useState(0);
  const [, answer] = QUESTIONS[selected];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <ul className="flex flex-col gap-1 lg:col-span-5">
        {QUESTIONS.map(([question, text], i) => {
          const isSelected = i === selected;
          return (
            <li key={question}>
              <button
                type="button"
                aria-expanded={isSelected}
                onClick={() => setSelected(i)}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left text-base transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected ? "bg-raised font-medium text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 size-2 shrink-0 rounded-full",
                    isSelected ? "bg-sky-ink" : "bg-decor",
                  )}
                />
                {question}
              </button>
              {isSelected && <p className="px-3 pt-2 pb-4 pl-8 text-ink-soft lg:hidden">{text}</p>}
            </li>
          );
        })}
      </ul>
      <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
        <p
          key={selected}
          className="sticky top-32 max-w-[40ch] animate-in text-xl leading-relaxed duration-150 fade-in-0"
        >
          {answer}
        </p>
      </div>
    </div>
  );
}
