"use client";

import { Download } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Registers the service worker in production builds (it only exists after `bun run build`). */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => console.warn("Service worker registration failed", error));
  }, []);
  return null;
}

const STANDALONE = "(display-mode: standalone)";
const subscribeStandalone = (onChange: () => void) => {
  const query = window.matchMedia(STANDALONE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The browser's install prompt, when it offers one (Chromium browsers, before
 * the app is installed). `install` shows it; `installed` is true once the app
 * runs installed or the user accepts.
 */
export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [accepted, setAccepted] = useState(false);
  const standalone = useSyncExternalStore(
    subscribeStandalone,
    () => window.matchMedia(STANDALONE).matches,
    () => false,
  );
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setPrompt(null);
      setAccepted(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  const install = prompt
    ? async () => {
        await prompt.prompt();
        await prompt.userChoice;
        setPrompt(null);
      }
    : null;
  return { install, installed: standalone || accepted };
}

/** "Install app" button, shown only when the browser offers installation. */
export function InstallButton({ className }: { className?: string }) {
  const { install } = useInstallPrompt();
  if (!install) return null;
  return (
    <Button variant="ghost" size="sm" className={className} onClick={install}>
      <Download /> Install app
    </Button>
  );
}
