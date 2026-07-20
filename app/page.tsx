import Link from "next/link";
import { ArrowRight, BrainCircuit, Lock, Orbit, Sparkles, Zap } from "lucide-react";

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
          <div aria-hidden="true" className="hero-orbit absolute left-[8%] top-20 hidden size-20 rounded-full border border-blue-400/20 lg:block" />
          <div aria-hidden="true" className="hero-orbit-reverse absolute right-[9%] top-32 hidden size-28 rounded-full border border-cyan-300/20 lg:block" />
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
              <Sparkles className="size-3.5 text-accent" /> {tools.length} tools · installable PWA
            </li>
          </ul>

          <div className="mt-12 grid w-full max-w-3xl grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-card/40 shadow-2xl backdrop-blur-xl">
            {[{ value: "200", label: "curated routes" }, { value: "200", label: "interactive tools" }, { value: "8", label: "creative studios" }].map((stat) => (
              <div key={stat.label} className="border-r border-border px-3 py-4 last:border-r-0 sm:py-5"><p className="text-2xl font-semibold text-gradient-accent sm:text-3xl">{stat.value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">{stat.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-10 sm:grid-cols-3" aria-label="Platform advantages">
        {[{ icon: Lock, eyebrow: "LOCAL CORE", title: "Private by design", text: "Every compatible file transformation stays inside your browser." }, { icon: Orbit, eyebrow: "PWA READY", title: "A toolkit that travels", text: "Install it once, revisit routes offline, and work from any screen." }, { icon: BrainCircuit, eyebrow: "AI ON DEMAND", title: "Cloud only when needed", text: "AI studios clearly disclose when prompts leave your device." }].map(({ icon: Icon, eyebrow, title, text }) => (
          <div key={title} className="glass group rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-glow"><div className="mb-5 flex items-center justify-between"><Icon className="size-5 text-accent" /><span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{eyebrow}</span></div><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
        ))}
      </section>

      {/* Searchable tool grid */}
      <ToolExplorer />
    </>
  );
}
