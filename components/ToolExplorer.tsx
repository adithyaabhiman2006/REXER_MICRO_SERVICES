"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryGlyph } from "@/components/CategoryGlyph";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { searchTools } from "@/lib/search";
import { tools } from "@/lib/registry/tools";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/types/tools";

const PAGE_SIZE = 24;

export function ToolExplorer() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const activeCategory = useAppStore((state) => state.activeCategory);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const source =
      activeCategory === "all" ? tools : tools.filter((tool) => tool.category === activeCategory);
    return searchTools(searchQuery, source);
  }, [searchQuery, activeCategory]);
  const visible = filtered.slice(0, visibleCount);

  useEffect(() => setVisibleCount(PAGE_SIZE), [searchQuery, activeCategory]);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <section
      id="tools-heading"
      aria-labelledby="tools-title"
      className="mx-auto w-full max-w-[1440px] scroll-mt-20 border-x border-border px-4 py-20 pb-28 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="grid items-end gap-6 lg:grid-cols-[1fr_.8fr]">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-rex-coral">
            The full collection / 200
          </span>
          <h2
            id="tools-title"
            className="mt-4 max-w-3xl text-5xl font-black leading-[.88] tracking-[-.065em] sm:text-7xl lg:text-8xl"
          >
            FIND YOUR
            <br />
            <span className="text-rex-lime">NEXT MOVE.</span>
          </h2>
        </div>
        <p className="max-w-md text-sm font-medium leading-relaxed text-muted-foreground lg:justify-self-end lg:text-base">
          Search by what you want to accomplish. Every tool opens instantly and follows the same
          simple workflow.
        </p>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mt-12 border-y border-border bg-background/90 px-4 py-4 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div id="tool-search" className="group relative flex-1 scroll-mt-36">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-rex-lime" />
            <input
              ref={searchRef}
              type="search"
              inputMode="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="What do you want to make?"
              aria-label="Search tools"
              className="h-14 w-full rounded-full border border-border bg-card pl-14 pr-24 text-sm font-semibold shadow-sm transition-all placeholder:font-medium placeholder:text-muted-foreground focus-visible:border-foreground/30 focus-visible:outline-none focus-visible:ring-0 sm:h-16 sm:text-base"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground">
              {filtered.length} FOUND
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-20 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="scroll-thin flex gap-2 overflow-x-auto pb-1 lg:max-w-[58%] lg:pb-0">
            <CategoryChip
              label="All"
              count={tools.length}
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label.replace(/ &.*$/, "")}
                count={tools.filter((tool) => tool.category === category.id).length}
                icon={<CategoryGlyph category={category.id} className="size-4" />}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-7 flex items-center justify-between border-b border-border pb-4 text-xs font-bold uppercase tracking-[.15em] text-muted-foreground"
        aria-live="polite"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-3.5" />
          Showing {visible.length} of {filtered.length}
        </span>
        <span className="hidden sm:inline">Select a card to begin</span>
      </div>

      {visible.length > 0 ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
          {visible.length < filtered.length && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full px-8 font-bold"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load {Math.min(PAGE_SIZE, filtered.length - visible.length)} more{" "}
                <ArrowDown className="size-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-16 rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="text-xl font-black">Nothing matched “{searchQuery}”</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a shorter phrase or reset the filters.
          </p>
          <Button
            variant="outline"
            className="mt-5 rounded-full"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          >
            Reset search
          </Button>
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  label,
  count,
  icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-foreground px-5 text-xs font-black text-background sm:h-16"
          : "inline-flex h-14 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 text-xs font-bold text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground sm:h-16"
      }
    >
      {icon}
      {label}
      <span className="font-mono text-[9px] opacity-45">{count}</span>
    </button>
  );
}
