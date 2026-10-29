"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SQLITE_RUNTIME_URL, SQLITE_WASM_URL } from "@/lib/constants";

/**
 * Once the landing page is idle, prefetch the editor route and the SQLite
 * runtime so "Open the editor" starts fast. Nothing runs before idle.
 */
export function WarmEditor() {
  const router = useRouter();
  useEffect(() => {
    const warm = () => {
      router.prefetch("/app");
      for (const href of [SQLITE_RUNTIME_URL, SQLITE_WASM_URL]) {
        if (document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) continue;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        document.head.appendChild(link);
      }
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 2000);
    return () => clearTimeout(t);
  }, [router]);
  return null;
}
