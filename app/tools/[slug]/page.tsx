import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Tag } from "lucide-react";

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
    <article className="mx-auto w-full max-w-[1180px] px-4 py-7 pb-28 sm:px-6 lg:px-10 lg:py-12">
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

      {/* Header */}
      <header className="mb-10 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_280px] lg:items-end">
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
          <h1 className="mt-5 flex items-center gap-4 text-4xl font-black leading-[.9] tracking-[-.06em] sm:text-6xl">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-rex-lime text-black shadow-[inset_0_-4px_0_rgba(0,0,0,.16)]">
              <CategoryGlyph category={tool.category} className="size-6" />
            </span>
            {tool.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
            {tool.short}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <aside className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-coral">
            Tool / {String(tool.id).padStart(3, "0")}
          </p>
          <p className="mt-5 text-sm font-bold">Simple in. Useful out.</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            No account required. Your workspace resets when you leave.
          </p>
        </aside>
      </header>

      {/* Action panel (implemented tool or placeholder) */}
      <section aria-label={`${tool.title} tool`} className="mb-16">
        <ToolActionPanel slug={tool.slug} title={tool.title} category={tool.category} />
      </section>

      {/* FAQ */}
      <section
        aria-label="Frequently asked questions"
        className="grid gap-6 border-t border-border pt-12 lg:grid-cols-[280px_1fr]"
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
