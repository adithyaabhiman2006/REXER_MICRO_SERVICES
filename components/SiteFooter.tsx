import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  const links = [
    ["All tools", "/#tools-heading"],
    ["Image lab", "/tools/image-converter"],
    ["PDF suite", "/tools/pdf-merge"],
    ["AI studio", "/tools/ai-text-rewriter"],
    ["Developer kit", "/tools/json-formatter"],
    ["Privacy", "/#tools-heading"],
  ];
  return (
    <footer className="border-t border-white/10 bg-[#090a0c] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-[clamp(4rem,11vw,10rem)] font-black leading-[.72] tracking-[-.1em]">
              MAKE IT
              <br />
              <span className="text-rex-lime">HAPPEN.</span>
            </p>
            <p className="mt-8 max-w-sm text-sm font-medium leading-relaxed text-white/50">
              Two hundred tools for the next thing on your list. Fast, focused and ready whenever
              you are.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm font-bold"
            aria-label="Footer navigation"
          >
            {links.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 text-white/60 transition-colors hover:text-rex-lime"
              >
                {label}
                <ArrowUpRight className="size-3" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[.22em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Rexer Digital Utility Lab</span>
          <span>Built for speed · Designed for humans</span>
        </div>
      </div>
    </footer>
  );
}
