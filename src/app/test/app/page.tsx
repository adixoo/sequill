import type { Metadata } from "next";
import { EditorPreview } from "@/components/quill/editor-preview";

export const metadata: Metadata = { title: "Pastel Quill editor" };

export default function QuillEditorPage() {
  return <EditorPreview />;
}
