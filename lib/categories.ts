import type { ToolCategory } from "@/types/tools";

/**
 * Map each category to a Lucide icon component.
 * Centralised so cards, sidebar and chips stay in sync.
 */
import {
  Image,
  Code2,
  TrendingUp,
  FileText,
  Type,
  Calculator,
  Sparkles,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<ToolCategory, LucideIcon> = {
  media: Image,
  dev: Code2,
  seo: TrendingUp,
  docs: FileText,
  text: Type,
  finance: Calculator,
  generators: Sparkles,
  ai: BrainCircuit,
};

/** Tailwind gradient classes per category for cards & chips. */
export const CATEGORY_GRADIENTS: Record<ToolCategory, string> = {
  media: "from-fuchsia-500 to-pink-500",
  dev: "from-blue-500 to-cyan-500",
  seo: "from-emerald-500 to-teal-500",
  docs: "from-orange-500 to-amber-500",
  text: "from-violet-500 to-purple-500",
  finance: "from-green-500 to-emerald-500",
  generators: "from-rose-500 to-red-500",
  ai: "from-indigo-500 to-blue-500",
};
