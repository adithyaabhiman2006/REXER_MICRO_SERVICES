import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Tag } from "lucide-react";

import { ToolActionPanel } from "@/components/ToolActionPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/lib/categories";
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

  const Icon = CATEGORY_ICONS[tool.category];
  const categoryLabel =
    CATEGORIES.find((c) => c.id === tool.category)?.label ?? tool.category;
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
    <article className="mx-auto w-full max-w-3xl px-4 py-8 pb-28 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb / back */}
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
        <Link href="/#tools-heading">
          <ArrowLeft className="size-4" />
          All tools
        </Link>
      </Button>

      {/* Header */}
      <header className="mb-6">
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
        <h1 className="mt-3 flex items-center gap-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-accent text-white shadow-glow">
            <Icon className="size-5" />
          </span>
          {tool.title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{tool.short}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Action panel (implemented tool or placeholder) */}
      <section aria-label={`${tool.title} tool`} className="mb-10">
        <ToolActionPanel slug={tool.slug} title={tool.title} category={tool.category} />
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions" className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-card/30 p-4 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-medium text-foreground marker:content-['']">
                {faq.q}
                <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">+</span>
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

function RelatedTools({
  current,
  category,
}: {
  current: string;
  category: string;
}) {
  const related = tools
    .filter((t) => t.category === category && t.slug !== current)
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <section className="mt-10 space-y-3" aria-label="Related tools">
      <h2 className="text-xl font-semibold tracking-tight">Related tools</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {related.map((t) => (
          <Link
            key={t.id}
            href={`/tools/${t.slug}`}
            className="glass rounded-lg p-4 transition-colors hover:border-white/20"
          >
            <p className="text-sm font-medium text-foreground">{t.title}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{t.short}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
