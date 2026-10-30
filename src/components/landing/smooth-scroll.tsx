"use client";

import { useEffect } from "react";
import { REDUCED_MOTION } from "@/lib/constants";

/** How quickly the page catches up with the wheel (0–1); lower is smoother. */
const LERP = 0.12;

/**
 * Lenis smooth scrolling for the landing page only. Lenis loads after first
 * paint, stays off for reduced motion (touch keeps native scrolling, its
 * default), and is torn down when the page unmounts, so /app and /vis never
 * scroll through it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    let lenis: import("lenis").default | null = null;
    let cancelled = false;

    const start = async () => {
      if (query.matches || lenis) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled || query.matches) return;
      lenis = new Lenis({ lerp: LERP, autoRaf: true, anchors: true, stopInertiaOnNavigate: true });
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };
    const onChange = () => (query.matches ? stop() : void start());

    void start();
    query.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      query.removeEventListener("change", onChange);
      stop();
    };
  }, []);
  return null;
}
