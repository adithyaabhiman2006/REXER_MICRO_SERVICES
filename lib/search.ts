import type { Tool } from "@/types/tools";

/**
 * Lightweight client-side fuzzy search — no external deps.
 *
 * Subword matching with bonus scoring for:
 *   - consecutive characters,
 *   - matches at word/start-of-string boundaries,
 *   - title matches weighted above tags/short.
 *
 * Good enough for 200 items; swappable for MiniSearch/Fuse later.
 */
export interface ScoredTool {
  tool: Tool;
  score: number;
}

const FIELD_WEIGHTS: Record<"title" | "short" | "slug" | "tags", number> = {
  title: 1,
  slug: 0.6,
  tags: 0.5,
  short: 0.3,
};

function fuzzyMatch(query: string, text: string): number {
  if (!text) return 0;
  const t = text.toLowerCase();
  const q = query.toLowerCase();

  // Exact substring is a strong signal.
  if (t.includes(q)) return 100 + (t.startsWith(q) ? 50 : 0);

  // Subsequence fuzzy match.
  let qi = 0;
  let score = 0;
  let consecutive = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      consecutive++;
      score += 1 + (consecutive > 1 ? consecutive : 0);
      // Boundary bonus: previous char is space/start/hyphen.
      const prev = t[ti - 1];
      if (ti === 0 || prev === " " || prev === "-" || prev === "/") score += 4;
      qi++;
    } else {
      consecutive = 0;
    }
  }
  // Penalize queries that didn't fully match.
  return qi === q.length ? score : 0;
}

export function searchTools(query: string, source: Tool[] = []): Tool[] {
  const q = query.trim();
  if (!q) return source;

  const scored: ScoredTool[] = [];
  for (const tool of source) {
    const titleScore = fuzzyMatch(q, tool.title) * FIELD_WEIGHTS.title;
    const slugScore = fuzzyMatch(q, tool.slug) * FIELD_WEIGHTS.slug;
    const tagsScore =
      Math.max(0, ...tool.tags.map((tag) => fuzzyMatch(q, tag))) *
      FIELD_WEIGHTS.tags;
    const shortScore = fuzzyMatch(q, tool.short) * FIELD_WEIGHTS.short;

    const total = titleScore + slugScore + tagsScore + shortScore;
    if (total > 0) scored.push({ tool, score: total });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.tool);
}
