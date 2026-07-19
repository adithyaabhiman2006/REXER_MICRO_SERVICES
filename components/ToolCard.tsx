"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { CATEGORY_GRADIENTS, CATEGORY_ICONS } from "@/lib/categories";
import { CATEGORIES } from "@/types/tools";
import type { Tool, ToolCategory } from "@/types/tools";

interface ToolCardProps {
  tool: Tool;
  /** Stagger index for entrance animation. */
  index?: number;
}

const CATEGORY_LABEL: Record<ToolCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
) as Record<ToolCategory, string>;

/**
 * Accessible tool card with category icon, gradient accent and hover motion.
 */
export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = CATEGORY_ICONS[tool.category];
  const gradient = CATEGORY_GRADIENTS[tool.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut", delay: Math.min(index * 0.015, 0.18) }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group block focus-visible:outline-none"
        aria-label={`Open ${tool.title}`}
      >
        <Card className="glass relative h-full overflow-hidden p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-glow focus-visible:ring-2 focus-visible:ring-ring">
          {/* Hover sheen */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
          />

          <div className="flex items-start justify-between gap-3">
            <span
              className={`flex size-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}
            >
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </div>

          <h3 className="mt-3.5 text-base font-semibold leading-snug text-foreground">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{tool.short}</p>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
              {CATEGORY_LABEL[tool.category]}
            </span>
            <span className="text-[11px] text-muted-foreground/50">#{tool.id}</span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
