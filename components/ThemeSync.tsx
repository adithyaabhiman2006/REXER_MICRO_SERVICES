"use client";

import { useEffect } from "react";

import { useAppStore } from "@/store/useAppStore";

/**
 * Hydrates the persisted/system theme on mount and keeps <html> in sync.
 * An inline script in the layout applies the saved theme before paint to
 * avoid a flash of the wrong theme (FOUC).
 */
export function ThemeSync() {
  const theme = useAppStore((s) => s.theme);
  const themeReady = useAppStore((s) => s.themeReady);
  const initTheme = useAppStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme, themeReady]);

  return null;
}
