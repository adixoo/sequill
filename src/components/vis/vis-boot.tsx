"use client";

import { AppBoot } from "@/components/common/app-boot";

const loadVisualizer = () => import("./vis-shell").then((m) => m.default);

export function VisBoot() {
  return <AppBoot load={loadVisualizer} name="the schema visualizer" />;
}
