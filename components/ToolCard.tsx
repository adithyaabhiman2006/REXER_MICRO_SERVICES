"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { CategoryGlyph } from "@/components/CategoryGlyph";
import { rememberTool } from "@/lib/recent-tools";
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

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const artSources = [
  "/images/tool-media.webp",
  "/images/tool-dev.webp",
  "/images/tool-paper.webp",
  "/images/tool-ai.webp",
];
const artPositions = [
  "object-center",
  "object-[32%_48%]",
  "object-[68%_38%]",
  "object-[48%_72%]",
];
const categoryOffset: Record<ToolCategory, number> = {
  media: 0,
  dev: 1,
  seo: 1,
  docs: 2,
  text: 2,
  finance: 2,
  generators: 3,
  ai: 3,
};

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const artIndex = (tool.id + categoryOffset[tool.category]) % artSources.length;
  const position = artPositions[
    (tool.id + Math.floor(tool.id / artSources.length)) % artPositions.length
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min((index % 8) * 0.025, 0.15) }}
      className="h-full bg-background"
    >
      <Link
        href={`/tools/${tool.slug}`}
        onClick={() => rememberTool(tool.slug)}
        aria-label={`Open ${tool.title}`}
        className="group flex h-full min-h-[360px] flex-col overflow-hidden bg-background transition-colors hover:bg-card"
      >
        <div className="relative h-44 overflow-hidden bg-[#0b0c0e]">
          <Image
            src={`${BASE_PATH}${artSources[artIndex]}`}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${position}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
          <span className="absolute bottom-3 right-4 font-mono text-5xl font-black tracking-[-.1em] text-white/20 transition-colors group-hover:text-white/40">
            {String(tool.id).padStart(3, "0")}
          </span>
          <span
            className={`absolute left-4 top-4 grid size-10 place-items-center rounded-full text-black shadow-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${categoryColor[tool.category]}`}
          >
            <CategoryGlyph category={tool.category} className="size-4" />
          </span>
          <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur transition-all group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted-foreground">
            {categoryName[tool.category]}
          </p>
          <h3 className="mt-3 text-xl font-black leading-[1.05] tracking-[-.045em] transition-transform duration-300 group-hover:translate-x-1">
            {tool.title}
          </h3>
          <p className="mt-auto line-clamp-2 pt-4 text-xs font-medium leading-relaxed text-muted-foreground">
            {tool.short}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
