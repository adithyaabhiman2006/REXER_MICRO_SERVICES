/**
 * Tools registry schema.
 *
 * Each tool in the catalogue conforms to `Tool`. The full 200-item registry is
 * wired in Step 4; see `lib/registry/tools.ts` for the 5-item sample used here.
 */
export type ToolCategory =
  | "media"
  | "dev"
  | "seo"
  | "docs"
  | "text"
  | "finance"
  | "generators"
  | "ai";

export interface Tool {
  /** Stable numeric id (1–200 per the catalogue spec). */
  id: number;
  /** URL-safe kebab-case identifier, e.g. "json-formatter". */
  slug: string;
  /** Human-readable title, e.g. "JSON Formatter". */
  title: string;
  /** Primary category bucket. */
  category: ToolCategory;
  /** One-line description, max 90 characters. */
  short: string;
  /** Free-form tags for search and filtering. */
  tags: string[];
}

/** Display metadata for the eight primary categories. */
export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  /** Lucide icon name resolved at render time. */
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "media", label: "Media & Creators", icon: "Image" },
  { id: "dev", label: "Developers & UI/UX", icon: "Code2" },
  { id: "seo", label: "SEO & Marketing", icon: "TrendingUp" },
  { id: "docs", label: "Documents & Utilities", icon: "FileText" },
  { id: "text", label: "Text & Converters", icon: "Type" },
  { id: "finance", label: "Finance & Calculators", icon: "Calculator" },
  { id: "generators", label: "Generators & Productivity", icon: "Sparkles" },
  { id: "ai", label: "AI & Smart Tools", icon: "BrainCircuit" },
];
