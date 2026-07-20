"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Moon, Search, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const links = [
  { href: "/#tools-heading", label: "All tools" },
  { href: "/tools/image-converter", label: "Media lab" },
  { href: "/tools/pdf-merge", label: "PDF suite" },
  { href: "/tools/ai-text-rewriter", label: "AI studio" },
];

export function TopNav() {
  const pathname = usePathname();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="Rexer home">
          <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-foreground text-background">
            <span className="text-sm font-black tracking-[-0.12em]">RX</span>
            <span className="absolute inset-0 translate-y-full bg-rex-lime transition-transform duration-300 group-hover:translate-y-0" />
            <span className="absolute z-10 text-sm font-black tracking-[-0.12em] opacity-0 transition-opacity duration-300 group-hover:text-black group-hover:opacity-100">
              RX
            </span>
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black tracking-[-0.04em]">REXER</span>
            <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Digital utility lab
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-colors hover:bg-foreground hover:text-background",
                pathname === link.href ? "bg-foreground text-background" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#tool-search"
            className="hidden h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground sm:flex"
          >
            <Search className="size-3.5" /> Find a tool{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px]">/</kbd>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:rotate-12 hover:border-foreground/30 hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            href="/#tools-heading"
            className="hidden h-10 items-center gap-2 rounded-full bg-rex-lime px-5 text-xs font-black text-black transition-transform hover:-translate-y-0.5 md:flex"
          >
            Start creating <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
