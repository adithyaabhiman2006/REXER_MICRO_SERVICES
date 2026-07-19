"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Tool } from "@/types/tools";

interface ToolCardProps {
  tool: Tool;
  /** Stagger index for entrance animation. */
  index?: number;
}

/**
 * Lightweight, accessible tool card with a subtle hover/press motion.
 * The polished version (category icon, gradient accents, motion presets) is
 * finalized in Step 2; this keeps the Step 1 grid clean and reusable.
 */
export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut", delay: Math.min(index * 0.02, 0.2) }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group block focus-visible:outline-none"
        aria-label={`Open ${tool.title}`}
      >
        <Card className="glass h-full p-5 transition-colors duration-200 ease-out hover:border-white/20 focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {tool.category}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </div>

          <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{tool.short}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary/40 px-1.5 py-0.5 text-[11px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
