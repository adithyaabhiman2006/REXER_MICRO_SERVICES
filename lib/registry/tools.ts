import type { Tool } from "@/types/tools";

/**
 * SAMPLE TOOLS REGISTRY (5 items).
 *
 * This is intentionally small for the Step 1 scaffold so the searchable grid,
 * navigation, and routing can be wired end-to-end. The complete 200-item
 * registry (generated from the catalogue spec in Step 4) will REPLACE this
 * array — the consuming components already read from this single source of
 * truth, so swapping it in requires no other changes.
 */
export const tools: Tool[] = [
  {
    id: 1,
    slug: "tiktok-ig-reels-downloader",
    title: "TikTok & IG Reels Downloader",
    category: "media",
    short: "Download permitted videos via public URLs; respects platform TOS.",
    tags: ["video", "social", "downloader"],
  },
  {
    id: 48,
    slug: "json-formatter",
    title: "JSON Formatter",
    category: "dev",
    short: "Beautify, minify and validate JSON entirely in your browser.",
    tags: ["json", "formatter", "developer"],
  },
  {
    id: 83,
    slug: "pdf-merge",
    title: "PDF Merge",
    category: "docs",
    short: "Combine multiple PDFs into one file client-side with pdf-lib.",
    tags: ["pdf", "merge", "documents"],
  },
  {
    id: 151,
    slug: "qr-code-generator",
    title: "QR Code Generator",
    category: "generators",
    short: "Create scannable QR codes for links, text and Wi-Fi instantly.",
    tags: ["qr", "generator", "productivity"],
  },
  {
    id: 161,
    slug: "ai-text-rewriter",
    title: "AI Text Rewriter",
    category: "ai",
    short: "Rewrite or paraphrase text with cloud AI; no content is stored.",
    tags: ["ai", "writing", "rewriter"],
  },
];

/** Look up a single tool by its slug. */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

/** All unique categories that currently have at least one tool. */
export function getActiveCategories(): Tool["category"][] {
  return Array.from(new Set(tools.map((t) => t.category)));
}
