"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Command, Search, Sparkles, X } from "lucide-react";

import { CategoryGlyph } from "@/components/CategoryGlyph";
import { getRecentToolSlugs, rememberTool } from "@/lib/recent-tools";
import { tools } from "@/lib/registry/tools";
import { searchTools } from "@/lib/search";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/types/tools";

const suggestedSlugs = [
  "image-converter",
  "pdf-merge",
  "json-formatter",
  "qr-code-generator",
  "ai-text-rewriter",
  "percentage-calculator",
];

export function CommandPalette() {
  const router = useRouter();
  const open = useAppStore((state) => state.commandOpen);
  const setOpen = useAppStore((state) => state.setCommandOpen);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.trim()) return searchTools(query, tools).slice(0, 8);
    const preferred = recentSlugs.length > 0 ? recentSlugs : suggestedSlugs;
    return preferred
      .map((slug) => tools.find((tool) => tool.slug === slug))
      .filter((tool): tool is (typeof tools)[number] => Boolean(tool));
  }, [query, recentSlugs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      } else if (event.key === "/" && !isTyping && !open) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    setRecentSlugs(getRecentToolSlugs());
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  const openTool = (slug: string) => {
    rememberTool(slug);
    setOpen(false);
    router.push(`/tools/${slug}`);
  };

  const openCategory = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    setOpen(false);
    router.push("/#tools-heading");
    window.setTimeout(() => document.getElementById("tools-heading")?.scrollIntoView(), 120);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-3 pt-[8vh] backdrop-blur-xl sm:px-6 sm:pt-[12vh]"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Find a Rexer tool"
        className="w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#111316] text-white shadow-[0_40px_120px_rgba(0,0,0,.65)]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 sm:px-7">
          <Search className="size-5 shrink-0 text-rex-lime" />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelected((value) => Math.min(value + 1, results.length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelected((value) => Math.max(value - 1, 0));
              }
              if (event.key === "Enter" && results[selected]) openTool(results[selected].slug);
            }}
            placeholder="What do you need to do?"
            aria-label="Search all 200 tools"
            className="h-20 min-w-0 flex-1 appearance-none border-0 bg-transparent text-lg font-bold outline-none ring-0 placeholder:text-white/30 focus:border-0 focus:outline-none focus:ring-0 sm:text-xl"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close tool search"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/45 transition-colors hover:bg-white hover:text-black"
          >
            <X className="size-4" />
          </button>
        </div>

        {!query && (
          <div className="border-b border-white/10 px-5 py-5 sm:px-7">
            <p className="mb-3 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-white/35">
              <Sparkles className="size-3 text-rex-coral" /> Jump to a studio
            </p>
            <div className="scroll-thin flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => openCategory(category.id)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-bold text-white/60 transition-all hover:border-rex-lime/60 hover:bg-rex-lime hover:text-black"
                >
                  <CategoryGlyph category={category.id} className="size-3.5" />
                  {category.label.replace(/ &.*$/, "")}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-h-[52vh] overflow-y-auto p-2 sm:p-3">
          <p className="flex items-center gap-2 px-3 pb-2 pt-1 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-white/35">
            {query ? <Search className="size-3" /> : <Clock3 className="size-3" />}
            {query ? `${results.length} best matches` : recentSlugs.length ? "Recently opened" : "Good starting points"}
          </p>
          {results.length ? (
            results.map((tool, index) => (
              <button
                key={tool.slug}
                type="button"
                onMouseEnter={() => setSelected(index)}
                onClick={() => openTool(tool.slug)}
                className={`group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors sm:p-4 ${
                  index === selected ? "bg-white text-black" : "text-white hover:bg-white/10"
                }`}
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${index === selected ? "bg-rex-lime" : "bg-white/10"}`}>
                  <CategoryGlyph category={tool.category} className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black sm:text-base">{tool.title}</span>
                  <span className={`mt-1 block truncate text-xs ${index === selected ? "text-black/50" : "text-white/35"}`}>
                    {tool.short}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 opacity-40 transition-transform group-hover:translate-x-1" />
              </button>
            ))
          ) : (
            <div className="px-4 py-14 text-center">
              <p className="text-lg font-black">No tool found</p>
              <p className="mt-1 text-sm text-white/40">Try a simpler word like image, PDF, text or calculator.</p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-white/10 bg-black/20 px-5 py-3 font-mono text-[9px] uppercase tracking-[.14em] text-white/30 sm:px-7">
          <span className="flex items-center gap-2"><Command className="size-3" /> 200 tools. One search.</span>
          <span className="hidden gap-4 sm:flex"><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></span>
        </footer>
      </section>
    </div>
  );
}
