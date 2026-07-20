"use client";

import { CheckCircle2, Lock, Wrench } from "lucide-react";

import { IMPLEMENTED_TOOLS } from "@/components/tools";

interface ToolActionPanelProps {
  slug: string;
  title: string;
  category: string;
}

/**
 * Renders the working tool component for implemented slugs, or a tasteful
 * "coming soon" placeholder for tools not yet built. Keeps the route file
 * a server component (this is the only client island needed).
 */
export function ToolActionPanel({ slug, title }: ToolActionPanelProps) {
  const ToolComponent = IMPLEMENTED_TOOLS[slug];

  if (ToolComponent) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_90px_-50px_rgba(0,0,0,.7)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-[9px] font-bold uppercase tracking-[.18em] text-muted-foreground sm:px-7">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-rex-lime" />
            Ready to use
          </span>
          <span>Local workspace</span>
        </div>
        <div className="p-5 sm:p-8">
          <ToolComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong flex flex-col items-center gap-3 rounded-xl p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Wrench className="size-6" />
      </span>
      <h3 className="text-lg font-semibold">{title} is coming soon</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        This tool is part of the 200-tool roadmap and will be built in an upcoming step.
        Privacy-first, client-side processing — your files will never be uploaded.
      </p>
      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground">
        <Lock className="size-3 text-accent" /> 100% client-side when ready
      </span>
    </div>
  );
}
