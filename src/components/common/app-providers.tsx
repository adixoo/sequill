"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { StorageHandoff } from "@/components/common/storage-handoff";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/** Providers for pages that talk to SQLite (editor, visualizer). */
export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false, staleTime: 5_000 },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <TooltipProvider delayDuration={300}>
        {children}
        <StorageHandoff />
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
