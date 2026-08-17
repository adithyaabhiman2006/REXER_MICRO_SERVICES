import { create } from "zustand";

export type Theme = "light" | "dark";
export type ToolCategoryFilter = "all" | string;
export type PaletteProfile = "rexer" | "swiss" | "tokyo" | "kyoto" | "solar";
export type MotionMode = "overdrive" | "balanced" | "minimal";
export type DensityMode = "expansive" | "compact";
export type Canvas3DMode = "polyhedron" | "mesh" | "waves" | "matrix";

const THEME_STORAGE_KEY = "rexer-theme";
const PALETTE_STORAGE_KEY = "rexer-palette";
const SOUND_STORAGE_KEY = "rexer-sound";
const MOTION_STORAGE_KEY = "rexer-motion";
const DENSITY_STORAGE_KEY = "rexer-density";

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

function resolveInitialPalette(): PaletteProfile {
  if (typeof window === "undefined") return "rexer";
  try {
    const saved = window.localStorage.getItem(PALETTE_STORAGE_KEY) as PaletteProfile | null;
    if (saved && ["rexer", "swiss", "tokyo", "kyoto", "solar"].includes(saved)) return saved;
  } catch {}
  return "rexer";
}

function resolveInitialSound(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
    if (saved !== null) return saved === "true";
  } catch {}
  return true;
}

function resolveInitialMotion(): MotionMode {
  if (typeof window === "undefined") return "overdrive";
  try {
    const saved = window.localStorage.getItem(MOTION_STORAGE_KEY) as MotionMode | null;
    if (saved && ["overdrive", "balanced", "minimal"].includes(saved)) return saved;
  } catch {}
  return "overdrive";
}

function resolveInitialDensity(): DensityMode {
  if (typeof window === "undefined") return "expansive";
  try {
    const saved = window.localStorage.getItem(DENSITY_STORAGE_KEY) as DensityMode | null;
    if (saved && ["expansive", "compact"].includes(saved)) return saved;
  } catch {}
  return "expansive";
}

interface AppState {
  searchQuery: string;
  activeCategory: ToolCategoryFilter;
  theme: Theme;
  themeReady: boolean;
  commandOpen: boolean;
  personalizationOpen: boolean;
  shortcutsOpen: boolean;
  palette: PaletteProfile;
  soundEnabled: boolean;
  motionMode: MotionMode;
  density: DensityMode;
  canvas3DMode: Canvas3DMode;

  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: ToolCategoryFilter) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
  setCommandOpen: (open: boolean) => void;
  setPersonalizationOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  setPalette: (palette: PaletteProfile) => void;
  cyclePalette: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setMotionMode: (mode: MotionMode) => void;
  setDensity: (density: DensityMode) => void;
  setCanvas3DMode: (mode: Canvas3DMode) => void;
}

const PALETTES_LIST: PaletteProfile[] = ["rexer", "swiss", "tokyo", "kyoto", "solar"];

export const useAppStore = create<AppState>((set, get) => ({
  searchQuery: "",
  activeCategory: "all",
  theme: "dark",
  themeReady: false,
  commandOpen: false,
  personalizationOpen: false,
  shortcutsOpen: false,
  palette: "rexer",
  soundEnabled: true,
  motionMode: "overdrive",
  density: "expansive",
  canvas3DMode: "polyhedron",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        if (theme === "light") {
          document.documentElement.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
        }
      } catch {}
    }
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
  initTheme: () => {
    if (get().themeReady) return;
    const initialTheme = resolveInitialTheme();
    const initialPalette = resolveInitialPalette();
    const initialSound = resolveInitialSound();
    const initialMotion = resolveInitialMotion();
    const initialDensity = resolveInitialDensity();

    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-palette", initialPalette);
      document.documentElement.setAttribute("data-density", initialDensity);
      if (initialTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }

    set({
      theme: initialTheme,
      palette: initialPalette,
      soundEnabled: initialSound,
      motionMode: initialMotion,
      density: initialDensity,
      themeReady: true,
    });
  },
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setPersonalizationOpen: (personalizationOpen) => set({ personalizationOpen }),
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
  setPalette: (palette) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(PALETTE_STORAGE_KEY, palette);
        document.documentElement.setAttribute("data-palette", palette);
      } catch {}
    }
    set({ palette });
  },
  cyclePalette: () => {
    const currentIdx = PALETTES_LIST.indexOf(get().palette);
    const nextPalette = PALETTES_LIST[(currentIdx + 1) % PALETTES_LIST.length];
    get().setPalette(nextPalette);
  },
  setSoundEnabled: (soundEnabled) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
      } catch {}
    }
    set({ soundEnabled });
  },
  toggleSound: () => {
    get().setSoundEnabled(!get().soundEnabled);
  },
  setMotionMode: (motionMode) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(MOTION_STORAGE_KEY, motionMode);
      } catch {}
    }
    set({ motionMode });
  },
  setDensity: (density) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(DENSITY_STORAGE_KEY, density);
        document.documentElement.setAttribute("data-density", density);
      } catch {}
    }
    set({ density });
  },
  setCanvas3DMode: (canvas3DMode) => set({ canvas3DMode }),
}));
