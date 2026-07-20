import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowLeft, Lock, ShieldCheck, Tag, Zap } from "lucide-react";

import { ToolActionPanel } from "@/components/ToolActionPanel";
import { CategoryGlyph } from "@/components/CategoryGlyph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateFaqs } from "@/lib/faq";
import { getToolBySlug, tools } from "@/lib/registry/tools";
import { CATEGORIES } from "@/types/tools";

interface PageProps {
  params: { slug: string };
}

/** Pre-render every tool page at build time (static export friendly). */
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: "Tool not found" };

  const title = `${tool.title} — Free Online Tool`;
  const description = tool.short;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const categoryLabel = CATEGORIES.find((c) => c.id === tool.category)?.label ?? tool.category;
  const faqs = generateFaqs(tool);

  // JSON-LD structured data for SEO (FAQ + SoftwareApplication).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    description: tool.short,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    mainEntityOfPage: "https://schema.org/FAQPage",
  };

  return (
    <article className="mx-auto w-full max-w-[1440px] px-4 py-7 pb-28 sm:px-6 lg:px-10 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb / back */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 mb-7 rounded-full text-muted-foreground"
      >
        <Link href="/#tools-heading">
          <ArrowLeft className="size-4" />
          All tools
        </Link>
      </Button>

      <header className="relative min-h-[430px] overflow-hidden rounded-[2rem] bg-[#090a0c] p-6 text-white sm:p-9 lg:min-h-[500px] lg:p-12">
        <span className="pointer-events-none absolute -bottom-16 right-0 select-none text-[15rem] font-black leading-none tracking-[-.1em] text-white/[.035] sm:text-[24rem]" aria-hidden="true">
          {String(tool.id).padStart(3, "0")}
        </span>
        <div className="absolute right-6 top-6 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-white/35 sm:right-9 sm:top-9">
          <span className="size-1.5 animate-pulse rounded-full bg-rex-lime" /> Live workspace
        </div>
        <div className="relative z-10 flex h-full min-h-[370px] flex-col justify-between lg:min-h-[405px]">
          <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="capitalize">
              <Tag className="size-3" />
              {categoryLabel}
            </Badge>
            {tool.category === "ai" && (
              <Badge variant="outline">
                <Lock className="size-3" /> Cloud · ephemeral
              </Badge>
            )}
          </div>
          <h1 className="mt-8 max-w-5xl text-[clamp(3.4rem,8.5vw,8.6rem)] font-black leading-[.78] tracking-[-.085em]">
            {tool.title}
          </h1>
          </div>
          <div className="grid gap-7 border-t border-white/15 pt-6 lg:grid-cols-[70px_1fr_280px] lg:items-end">
            <span className="flex size-14 items-center justify-center rounded-full bg-rex-lime text-black shadow-[inset_0_-4px_0_rgba(0,0,0,.16)]">
              <CategoryGlyph category={tool.category} className="size-6" />
            </span>
            <div>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-white/55 sm:text-base">{tool.short}</p>
              <div className="mt-3 flex flex-wrap gap-3 font-mono text-[9px] uppercase tracking-[.15em] text-white/30">
                {tool.tags.map((tag) => <span key={tag}>#{tag}</span>)}
              </div>
            </div>
            <div className="flex items-center justify-between lg:border-l lg:border-white/15 lg:pl-7">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-coral">Tool / {String(tool.id).padStart(3, "0")}</p>
                <p className="mt-2 text-xs font-semibold text-white/45">Simple in. Useful out.</p>
              </div>
              <ArrowDownRight className="size-7 text-white/35" />
            </div>
          </div>
        </div>
      </header>

      <section aria-label={`${tool.title} tool`} className="relative z-10 mx-auto -mt-5 mb-16 max-w-[1120px] sm:-mt-8">
        <ToolActionPanel slug={tool.slug} title={tool.title} category={tool.category} />
        <div className="mt-4 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[9px] font-bold uppercase tracking-[.14em] text-muted-foreground">
          <span className="flex items-center gap-1.5"><ShieldCheck className="size-3 text-rex-lime" /> Privacy first</span>
          <span className="flex items-center gap-1.5"><Zap className="size-3 text-rex-coral" /> Instant start</span>
          <span className="flex items-center gap-1.5"><Lock className="size-3 text-rex-violet" /> No account</span>
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-label="Frequently asked questions"
        className="grid gap-8 border-t border-border pt-16 lg:grid-cols-[320px_1fr]"
      >
        <div>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-coral">
            Good to know
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-[-.05em]">
            Questions,
            <br />
            answered.
          </h2>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-card p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-medium text-foreground marker:content-['']">
                {faq.q}
                <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <RelatedTools current={tool.slug} category={tool.category} />
    </article>
  );
}

function RelatedTools({ current, category }: { current: string; category: string }) {
  const related = tools.filter((t) => t.category === category && t.slug !== current).slice(0, 4);

  if (!related.length) return null;

  return (
    <section className="mt-10 space-y-3" aria-label="Related tools">
      <h2 className="text-2xl font-black tracking-[-.04em]">Keep creating</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {related.map((t) => (
          <Link
            key={t.id}
            href={`/tools/${t.slug}`}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-foreground/25"
          >
            <p className="text-sm font-medium text-foreground">{t.title}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{t.short}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
