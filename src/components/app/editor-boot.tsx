"use client";

import { AppBoot } from "@/components/common/app-boot";

const loadEditor = () => import("./editor-shell").then((m) => m.default);

export function EditorBoot() {
  return <AppBoot load={loadEditor} name="the editor" />;
}
