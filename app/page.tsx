import Link from "next/link";
import { ArrowRight, Lock, Zap, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolExplorer } from "@/components/ToolExplorer";
import { tools } from "@/lib/registry/tools";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(0,87,255,0.18) 0%, rgba(0,229,255,0.06) 40%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-accent" />
            200 tools · privacy-first · client-side
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Every micro-tool you need,{" "}
            <span className="text-gradient-accent">in one fast place.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Convert, generate, and transform images, PDFs, audio, code, and text —
            right in your browser. Nothing is uploaded. Nothing is logged.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href="#tools-heading">
                Explore tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#tools-heading">Browse categories</Link>
            </Button>
          </div>

          {/* Trust row */}
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-accent" /> Files never leave your device
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5 text-accent" /> Instant, client-side processing
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent" /> {tools.length} sample tools live · 200 coming
            </li>
          </ul>
        </div>
      </section>

      {/* Searchable tool grid */}
      <ToolExplorer />
    </>
  );
}
