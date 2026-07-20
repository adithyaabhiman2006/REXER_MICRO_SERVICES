"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { CategoryGlyph } from "@/components/CategoryGlyph";
import type { Tool, ToolCategory } from "@/types/tools";
import { CATEGORIES } from "@/types/tools";

const categoryColor: Record<ToolCategory, string> = {
  media: "bg-rex-coral",
  dev: "bg-rex-violet",
  seo: "bg-rex-lime",
  docs: "bg-rex-sky",
  text: "bg-[#FFD66B]",
  finance: "bg-[#72E6A5]",
  generators: "bg-[#FF9ED2]",
  ai: "bg-[#BBA7FF]",
};
const categoryName = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<ToolCategory, string>;

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min((index % 8) * 0.025, 0.15) }}
      className="h-full bg-background"
    >
      <Link
        href={`/tools/${tool.slug}`}
        aria-label={`Open ${tool.title}`}
        className="group flex h-full min-h-[290px] flex-col p-5 transition-colors hover:bg-card sm:p-6"
      >
        <div className="flex items-start justify-between">
          <span
            className={`grid size-12 place-items-center rounded-2xl text-black shadow-[inset_0_-3px_0_rgba(0,0,0,.16),0_10px_20px_-12px_rgba(0,0,0,.7)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${categoryColor[tool.category]}`}
          >
            <CategoryGlyph category={tool.category} className="size-5" />
          </span>
          <span className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-all group-hover:rotate-45 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="mt-auto pt-12">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted-foreground">
            {categoryName[tool.category]} / {String(tool.id).padStart(3, "0")}
          </p>
          <h3 className="mt-3 text-xl font-black leading-[1.05] tracking-[-.045em] transition-transform group-hover:translate-x-1">
            {tool.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground">
            {tool.short}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
