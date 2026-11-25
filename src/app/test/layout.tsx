import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./quill.css";

export const metadata: Metadata = {
  title: "Pastel Quill preview",
  // A design preview, not a page to index.
  robots: { index: false },
};

/** Scopes the Pastel Quill tokens (quill.css) to the preview routes. */
export default function QuillPreviewLayout({ children }: { children: ReactNode }) {
  return <div className="quill flex min-h-dvh flex-1 flex-col font-sans">{children}</div>;
}
