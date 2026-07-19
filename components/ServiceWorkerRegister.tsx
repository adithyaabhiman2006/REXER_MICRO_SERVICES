"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for offline support. Only runs in production
 * builds (not in `next dev`) and only in browsers that support SW + the
 * public path is known at runtime via NEXT_PUBLIC_BASE_PATH.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const onLoad = () => {
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
        /* registration failed — site still works online */
      });
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
