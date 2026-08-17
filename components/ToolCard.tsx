"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const cardRef = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <article className="h-full bg-background">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transform || undefined,
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative h-full transition-shadow duration-300 hover:z-20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(207,255,46,0.1)]"
      >
        <Link
          href={`/tools/${tool.slug}`}
          onClick={() => rememberTool(tool.slug)}
          aria-label={`Open ${tool.title}`}
          className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background transition-colors hover:border-foreground/30 hover:bg-card"
        >
          {/* Radial mouse glare overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 220px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.4), transparent 80%)`,
            }}
          />

          <div className="relative h-44 overflow-hidden bg-[#0b0c0e]">
            <Image
              src={`${BASE_PATH}${artSources[artIndex]}`}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${position}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
            <span className="absolute bottom-3 right-4 font-mono text-5xl font-black tracking-[-.1em] text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/40">
              {String(tool.id).padStart(3, "0")}
            </span>
            <span
              className={`absolute left-4 top-4 grid size-10 place-items-center rounded-full text-black shadow-xl transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 ${categoryColor[tool.category]}`}
            >
              <CategoryGlyph category={tool.category} className="size-4" />
            </span>
            <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:border-rex-lime group-hover:bg-rex-lime group-hover:text-black">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted-foreground">
                {categoryName[tool.category]}
              </p>
              <span className="size-1.5 rounded-full bg-rex-lime/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <h3 className="mt-3 text-xl font-black leading-[1.05] tracking-[-.045em] transition-transform duration-300 group-hover:translate-x-1">
              {tool.title}
            </h3>
            <p className="mt-auto line-clamp-2 pt-4 text-xs font-medium leading-relaxed text-muted-foreground">
              {tool.short}
            </p>
          </div>
        </Link>
      </div>
    </article>
  );
}
