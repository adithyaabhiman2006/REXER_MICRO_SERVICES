import type { Tool, ToolCategory } from "@/types/tools";

export interface FAQ {
  q: string;
  a: string;
}

/**
 * Generates 3–5 contextual FAQs per tool based on its category. These are
 * sensible defaults; individual tools can override with richer copy later.
 */
export function generateFaqs(tool: Tool): FAQ[] {
  const base: FAQ[] = [
    {
      q: "Is this tool free to use?",
      a: "Yes — every tool on Rexer Micro-Tools is completely free, with no sign-up, no watermarks, and no limits.",
    },
    {
      q: "Does it work offline?",
      a:
        tool.category === "ai"
          ? "AI tools require an internet connection to call cloud models, but your content is processed ephemerally and never stored."
          : "Most non-AI tools run entirely in your browser, so once the page loads they keep working even if you go offline.",
    },
    {
      q: "What about my privacy?",
      a:
        tool.category === "ai"
          ? "AI requests are processed in memory and discarded immediately. We log only anonymous usage counters — never your content."
          : "Files you open here are processed locally in your browser and are never uploaded to any server.",
    },
  ];

  const byCategory: Partial<Record<ToolCategory, FAQ>> = {
    media: {
      q: "What file formats are supported?",
      a: "Common image, audio and video formats are supported depending on your browser. Heavy conversions use WebAssembly and run locally.",
    },
    ai: {
      q: "Which AI model powers this?",
      a: "AI tools route to a configured provider (e.g. Claude or an image model) via serverless functions. Providers are selected through environment variables.",
    },
    docs: {
      q: "Will my document formatting be preserved?",
      a: "Client-side document tools preserve text and layout where possible. For complex layouts, results may vary by source file.",
    },
    finance: {
      q: "Is my financial data saved anywhere?",
      a: "No. Calculations run in your browser. Where a tool stores entries (like a budget), it keeps them locally on your device only.",
    },
    dev: {
      q: "Are the outputs safe to use in production?",
      a: "Always review generated code and schemas before use. The tools are helpers, not a substitute for your own validation.",
    },
    seo: {
      q: "Do these tools improve my search ranking?",
      a: "They help you produce correct, optimised tags and files. Ranking still depends on your content, site quality and many other factors.",
    },
    text: {
      q: "Is there a character or size limit?",
      a: "Limits are generous and set by your device's memory since everything runs locally. Very large inputs may be slower but still work.",
    },
    generators: {
      q: "Can I use the generated content commercially?",
      a: "Yes. Anything you generate is yours to use, including for commercial purposes.",
    },
  };

  const extra = byCategory[tool.category];
  return extra ? [base[0], extra, ...base.slice(1)] : base;
}
