const RECENT_TOOLS_KEY = "rexer-recent-tools";
const MAX_RECENT_TOOLS = 6;

export function getRecentToolSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(RECENT_TOOLS_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function rememberTool(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const next = [slug, ...getRecentToolSlugs().filter((item) => item !== slug)].slice(
      0,
      MAX_RECENT_TOOLS,
    );
    window.localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(next));
  } catch {
    // Browsing still works when storage is unavailable.
  }
}
