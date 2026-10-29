import type { Metadata } from "next";
import { VisBoot } from "@/components/vis/vis-boot";

export const metadata: Metadata = {
  title: "Schema",
  description:
    "See a SQLite database as a diagram of tables and relationships, and design new ones visually.",
};

export default function VisPage() {
  return <VisBoot />;
}
