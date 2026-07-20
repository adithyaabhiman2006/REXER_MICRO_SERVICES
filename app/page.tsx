import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { HeroStage } from "@/components/HeroStage";
import { FeaturedTools } from "@/components/FeaturedTools";
import { ToolExplorer } from "@/components/ToolExplorer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/10 bg-[#090a0c] text-white">
        <div
          className="hero-grid pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div
          className="absolute -left-40 top-32 size-[30rem] rounded-full bg-rex-violet/15 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1600px] items-center gap-0 px-4 py-10 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:px-10 lg:py-0">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <span className="rounded-full bg-rex-lime px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-black">
                Version 2.0
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">
                The browser’s creative utility system
              </span>
            </div>

            <h1 className="text-[clamp(3.65rem,7.5vw,7.8rem)] font-black leading-[.79] tracking-[-.085em]">
              ONE TAB.
              <br />
              <span className="text-rex-lime">200 WAYS</span>
              <br />
              FORWARD.
            </h1>
            <p className="mt-8 max-w-lg text-base font-medium leading-relaxed text-white/55 sm:text-lg">
              Stop jumping between random websites. Convert files, shape ideas and finish everyday
              work inside one focused creative system.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="h-14 rounded-full px-7 text-sm font-black"
              >
                <Link href="#tools-heading">
                  Explore all tools <ArrowDownRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-white/25 px-7 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/tools/image-converter">
                  Open image lab <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-[.12em] text-white/45">
              <span className="flex items-center gap-2">
                <Check className="size-3.5 text-rex-lime" />
                200 working tools
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-rex-lime" />
                Local-first privacy
              </span>
              <span className="flex items-center gap-2">
                <Zap className="size-3.5 text-rex-lime" />
                Zero sign-up
              </span>
            </div>
          </div>

          <HeroStage />
        </div>
        <div className="absolute bottom-5 right-5 hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/35 lg:flex">
          <span className="h-px w-12 bg-border" />
          Move your cursor
        </div>
      </section>

      <section
        className="overflow-hidden border-b border-border bg-foreground py-4 text-background"
        aria-label="Platform highlights"
      >
        <div className="marquee-track flex min-w-max items-center gap-10 whitespace-nowrap text-xs font-black uppercase tracking-[.22em]">
          {[
            "200 working tools",
            "Private by default",
            "Creative without limits",
            "Installable PWA",
            "Files stay local",
            "Built for speed",
            "200 working tools",
            "Private by default",
            "Creative without limits",
          ].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              <Sparkles className="size-3.5 text-rex-coral" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section
        className="mx-auto grid max-w-[1440px] border-x border-border lg:grid-cols-3"
        aria-label="Why Rexer"
      >
        {[
          {
            number: "01",
            title: "Your files stay yours",
            text: "Compatible conversions happen on your device—not in a mystery cloud.",
          },
          {
            number: "02",
            title: "Everything feels familiar",
            text: "Drop a file, adjust what matters, download. Every tool follows the same rhythm.",
          },
          {
            number: "03",
            title: "Power without the noise",
            text: "Serious browser engines, wrapped in an interface that gets out of your way.",
          },
        ].map((item) => (
          <article
            key={item.number}
            className="group border-b border-border p-7 transition-colors hover:bg-rex-lime hover:text-black lg:border-b-0 lg:border-r lg:p-10 lg:last:border-r-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs opacity-50">/{item.number}</span>
              <ArrowDownRight className="size-5 transition-transform group-hover:rotate-[-45deg]" />
            </div>
            <h2 className="mt-16 max-w-xs text-2xl font-black tracking-[-.045em]">{item.title}</h2>
            <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed opacity-60">
              {item.text}
            </p>
          </article>
        ))}
      </section>

      <FeaturedTools />
      <ToolExplorer />
    </>
  );
}
