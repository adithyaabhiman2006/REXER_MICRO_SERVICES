"use client";

import { useMemo } from "react";

import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { tools } from "@/lib/registry/tools";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/types/tools";
import { Search, X } from "lucide-react";

/**
 * Client-side searchable + filterable tool grid.
 *
 * Step 1 uses a lightweight substring match. Step 3 upgrades this to a
 * dedicated fuzzy-search module (e.g. MiniSearch / Fuse) over the full
 * 200-item registry — no component API change required.
 */
export function ToolExplorer() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const activeCategory = useAppStore((s) => s.activeCategory);
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return [t.title, t.short, t.slug, t.category, ...t.tags].some((field) =>
        field.toLowerCase().includes(q),
      );
    });
  }, [searchQuery, activeCategory]);

  return (
    <section aria-labelledby="tools-heading" className="mx-auto w-full max-w-6xl px-4 pb-24">
      <h2 id="tools-heading" className="sr-only">
        Browse tools
      </h2>

      {/* Search */}
      <div className="relative mx-auto mt-2 max-w-xl">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          inputMode="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 200 tools… (sample: 5 loaded)"
          aria-label="Search tools"
          className="h-11 w-full rounded-lg border border-border bg-card/60 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent/10 hover:text-accent"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Category chips */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <CategoryChip
          id="all"
          label="All"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            id={c.id}
            label={c.label}
            active={activeCategory === c.id}
            onClick={() => setActiveCategory(c.id)}
          />
        ))}
      </div>

      {/* Results count */}
      <p className="mt-6 text-center text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {tools.length} tools
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">No tools match your search.</p>
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-muted-foreground/70">
        Sample registry (5 items) — the full 200-item catalogue is wired in Step 4.
      </p>
    </section>
  );
}

function CategoryChip({
  id,
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      key={id}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-full border border-transparent bg-gradient-accent px-3 py-1.5 text-xs font-medium text-white shadow-glow"
          : "rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-white/20 hover:text-foreground"
      }
    >
      {label}
    </button>
  );
}
