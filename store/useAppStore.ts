import { create } from "zustand";

export type Theme = "light" | "dark";
export type ToolCategoryFilter = "all" | string;

interface AppState {
  /** Live search query for the tools grid (fuzzy search lands in Step 3). */
  searchQuery: string;
  /** Active category filter chip; "all" shows every category. */
  activeCategory: ToolCategoryFilter;
  /** Visual theme. Default is dark (dark-first per brand spec). */
  theme: Theme;

  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: ToolCategoryFilter) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: "",
  activeCategory: "all",
  theme: "dark",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
