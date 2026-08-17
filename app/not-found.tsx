"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass, FileText, Home, Image as ImageIcon, KeyRound, QrCode, Search, Sparkles, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/types/tools";

const POPULAR_TOOLS = [
  {
    slug: "pdf-merge",
    title: "PDF Merge & Combine",
    category: "docs",
    desc: "Merge multiple PDF documents client-side with zero uploads.",
    icon: FileText,
    accent: "text-rex-sky",
  },
  {
    slug: "image-converter",
    title: "Image Format Converter",
    category: "media",
    desc: "Convert WebP, PNG, JPG, HEIC directly in your browser.",
    icon: ImageIcon,
    accent: "text-rex-coral",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    category: "dev",
    desc: "Prettify, minify, and inspect JSON payloads instantly.",
    icon: Terminal,
    accent: "text-rex-violet",
  },
  {
    slug: "password-generator",
    title: "Secure Password Generator",
    category: "generators",
    desc: "Generate cryptographically secure passwords locally.",
    icon: KeyRound,
    accent: "text-[#FF9ED2]",
  },
  {
    slug: "qr-generator",
    title: "Custom QR Code Studio",
    category: "generators",
    desc: "Generate customized high-resolution QR codes.",
    icon: QrCode,
    accent: "text-rex-lime",
  },
  {
    slug: "ai-text-rewriter",
    title: "AI Writing Assistant",
    category: "ai",
    desc: "Refine tone, summarize, and polish text effortlessly.",
    icon: Sparkles,
    accent: "text-[#BBA7FF]",
  },
];

export default function NotFound() {
  const setCommandOpen = useAppStore((state) => state.setCommandOpen);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);

  return (
    <article className="mx-auto w-full max-w-[1440px] px-4 py-10 pb-28 sm:px-6 lg:px-10 lg:py-16">
      {/* Top breadcrumb */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 mb-8 rounded-full text-muted-foreground hover:text-foreground"
      >
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </Button>

      {/* Hero 404 card */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#090a0c] p-8 text-white shadow-2xl sm:p-12 lg:p-16">
        {/* Background decorative watermark */}
        <span
          className="pointer-events-none absolute -bottom-12 -right-8 select-none text-[12rem] font-black leading-none tracking-[-.1em] text-white/[.03] sm:text-[20rem] lg:text-[24rem]"
          aria-hidden="true"
        >
          404
        </span>

        {/* Top status indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full border border-rex-coral/30 bg-rex-coral/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[.18em] text-rex-coral">
            <span className="size-2 animate-ping rounded-full bg-rex-coral" />
            404 &middot; Page Not Found
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-white/40">
            Rexer Micro-Tools Registry
          </span>
        </div>

        <div className="relative z-10 mt-10 max-w-3xl">
          <h1 className="text-[clamp(2.8rem,7vw,6.5rem)] font-black leading-[.88] tracking-[-.075em]">
            THIS ROUTE <br />
            <span className="text-rex-lime">DOESN’T EXIST.</span>
          </h1>

          <p className="mt-6 text-base font-medium leading-relaxed text-white/60 sm:text-lg">
            The tool or page you are looking for may have been renamed, moved, or is not part of the 200-tool catalog. Let’s get you back on track.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-13 rounded-full bg-rex-lime px-7 font-black text-black shadow-glow hover:bg-rex-sky hover:text-black hover:shadow-xl"
            >
              <Link href="/#tools-heading">
                <Compass className="size-4" />
                Browse All 200 Tools
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setCommandOpen(true)}
              className="h-13 rounded-full border-white/20 bg-white/5 px-7 font-bold text-white backdrop-blur hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <Search className="size-4" />
              Quick Search (Ctrl + K)
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-13 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Link href="/">
                <Home className="size-4" />
                Homepage
              </Link>
            </Button>
          </div>
        </div>

        {/* Category shortcuts bar inside header */}
        <div className="relative z-10 mt-12 border-t border-white/10 pt-6">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.22em] text-white/40">
            Jump to Category
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href="/#tools-heading"
                onClick={() => setActiveCategory(cat.id)}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition-all hover:border-white/40 hover:bg-white hover:text-black"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suggested popular tools section */}
      <section className="mt-14" aria-label="Suggested tools">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-coral">
              Looking for something popular?
            </span>
            <h2 className="mt-1 text-2xl font-black tracking-[-.04em]">Try these essential tools</h2>
          </div>
          <Link
            href="/#tools-heading"
            className="group hidden items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View all 200
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className={`size-5 ${tool.accent} group-hover:text-inherit`} />
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-black tracking-[-.03em] text-foreground">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-muted-foreground">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-3">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[.15em] text-muted-foreground">
                    Category: {tool.category}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </article>
  );
}
