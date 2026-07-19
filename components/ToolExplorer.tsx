"use client";

import { useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/lib/categories";
import { searchTools } from "@/lib/search";
import { tools } from "@/lib/registry/tools";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/types/tools";

/**
 * Client-side fuzzy search + category filter over the full 200-item registry.
 * All processing happens in the browser — privacy-first.
 */
export function ToolExplorer() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const activeCategory = useAppStore((s) => s.activeCategory);
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);

  const filtered = useMemo(() => {
    const inCategory =
      activeCategory === "all"
        ? tools
        : tools.filter((t) => t.category === activeCategory);
    return searchTools(searchQuery, inCategory);
  }, [searchQuery, activeCategory]);

  return (
    <section aria-labelledby="tools-heading" className="mx-auto w-full max-w-6xl px-4 pb-28 lg:pb-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="tools-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Browse all <span className="text-gradient-accent">200 tools</span>
        </h2>
        <p className="max-w-lg text-sm text-muted-foreground">
          Every tool runs in your browser. Your files and data never leave your device.
        </p>
      </div>

      {/* Search */}
      <div className="relative mx-auto mt-6 max-w-xl">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          inputMode="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tools, e.g. 'pdf', 'qr', 'password'…"
          aria-label="Search tools"
          className="glass h-12 w-full rounded-xl border-border pl-11 pr-10 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent/10 hover:text-accent"
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
          count={tools.length}
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.id];
          const count = tools.filter((t) => t.category === c.id).length;
          return (
            <CategoryChip
              key={c.id}
              id={c.id}
              label={c.label}
              count={count}
              icon={<Icon className="size-3.5" />}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
            />
          );
        })}
      </div>

      {/* Results count */}
      <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground" aria-live="polite">
        <SlidersHorizontal className="size-3.5" />
        Showing <strong className="font-semibold text-foreground">{filtered.length}</strong> of{" "}
        {activeCategory === "all" ? tools.length : tools.filter((t) => t.category === activeCategory).length} tools
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">No tools match “{searchQuery}”.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  id,
  label,
  count,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  count: number;
  icon?: React.ReactNode;
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
          ? "inline-flex items-center gap-1.5 rounded-full border border-transparent bg-gradient-accent px-3.5 py-1.5 text-xs font-medium text-white shadow-glow"
          : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
      }
    >
      {icon}
      {label}
      <span className={active ? "opacity-80" : "text-muted-foreground/50"}>· {count}</span>
    </button>
  );
}
