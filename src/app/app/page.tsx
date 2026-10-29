import type { Metadata } from "next";
import { EditorBoot } from "@/components/editor/editor-boot";

export const metadata: Metadata = {
  title: "Editor",
  description: "Browse and edit SQLite databases offline, right in your browser.",
};

export default function EditorPage() {
  return <EditorBoot />;
}
