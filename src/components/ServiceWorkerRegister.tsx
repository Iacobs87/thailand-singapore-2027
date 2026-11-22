"use client";
import { useEffect } from "react";

/** Registers a small service worker so pages already visited keep working offline. */
export function ServiceWorkerRegister({ basePath }: { basePath: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: `${basePath}/` }).catch(() => {});
  }, [basePath]);
  return null;
}
