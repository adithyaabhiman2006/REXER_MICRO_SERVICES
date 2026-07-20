import { create } from "zustand";

export type Theme = "light" | "dark";
export type ToolCategoryFilter = "all" | string;

const THEME_STORAGE_KEY = "rexer-theme";

/**
 * Resolve the initial theme from (1) saved preference, then (2) system
 * preference. Falls back to dark (dark-first per brand spec). Safe on SSR —
 * returns "dark" when `window` is unavailable.
 */
function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  } catch {
    return "dark";
  }
}

interface AppState {
  /** Live search query for the tools grid (fuzzy search in lib/search.ts). */
  searchQuery: string;
  /** Active category filter chip; "all" shows every category. */
  activeCategory: ToolCategoryFilter;
  /** Visual theme. Default is dark (dark-first per brand spec). */
  theme: Theme;
  /** True once the theme has been hydrated from storage/system. */
  themeReady: boolean;
  /** Global tool launcher visibility. */
  commandOpen: boolean;

  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: ToolCategoryFilter) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
  setCommandOpen: (open: boolean) => void;
}

function persistTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore quota / privacy mode */
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  searchQuery: "",
  activeCategory: "all",
  theme: "dark",
  themeReady: false,
  commandOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setTheme: (theme) => {
    persistTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    persistTheme(next);
    set({ theme: next });
  },
  initTheme: () => {
    if (get().themeReady) return;
    set({ theme: resolveInitialTheme(), themeReady: true });
  },
  setCommandOpen: (commandOpen) => set({ commandOpen }),
}));
