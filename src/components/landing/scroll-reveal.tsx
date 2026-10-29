"use client";

import { useEffect } from "react";

/**
 * Marks [data-reveal] elements with .is-in the first time they scroll into view
 * (landing.css animates their children). The hidden state only applies once
 * this has marked the root, so content is never hidden without script.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => observer.observe(el));
    root.setAttribute("data-reveal-ready", "");
    return () => {
      observer.disconnect();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);
  return null;
}
