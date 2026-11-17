"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
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
      <Icon icon={Download01Icon} /> Install app
    </Button>
  );
}

/** Serwist names every cache it makes with this prefix. */
const SERWIST_CACHE_PREFIX = "serwist-";

/**
 * Development only: removes a service worker (and its precache) left on this
 * origin by a production build, so the dev server's pages are never answered
 * from an old build. It runs once the dev server serves the page, e.g. after a
 * hard reload, which bypasses the worker.
 */
export function RemoveServiceWorkers() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const remove = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      const names = (await caches.keys()).filter((name) => name.startsWith(SERWIST_CACHE_PREFIX));
      await Promise.all(names.map((name) => caches.delete(name)));
      if (registrations.length > 0 || names.length > 0) {
        console.info(
          `Removed ${registrations.length} service worker(s) and ${names.length} cache(s) left by a production build.`,
        );
      }
    };
    remove().catch((error: unknown) => {
      console.warn("Could not remove the production service worker:", error);
    });
  }, []);
  return null;
}
