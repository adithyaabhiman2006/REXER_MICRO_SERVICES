"use client";

import { useEffect } from "react";

import { useAppStore } from "@/store/useAppStore";

/**
 * Reflects the Zustand `theme` onto <html> by toggling the `dark` class and
 * the `color-scheme` CSS property. Kept tiny here; persistence + system
 * preference detection land in Step 2.
 */
export function ThemeSync() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}
