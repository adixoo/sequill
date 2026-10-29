"use client";

import { useEffect, useRef } from "react";

interface LoopVideoProps {
  /** Files in public/landing, from scripts/capture-landing.ts. */
  src: string;
  poster: string;
  label: string;
  position?: string;
}

/** A muted, looping clip that covers its tile; it holds on the poster for reduced motion. */
export function LoopVideo({ src, poster, label, position = "center" }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return (
    <video
      ref={ref}
      src={`/landing/${src}`}
      poster={`/landing/${poster}`}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 size-full object-cover"
      style={{ objectPosition: position }}
    />
  );
}
