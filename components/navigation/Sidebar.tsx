"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Sparkles, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/types/tools";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

/**
 * Desktop sidebar — brand mark, primary nav, category shortcuts, and the
 * theme toggle. Hidden below `lg`. The mobile equivalent is `BottomNav`.
 */
export function Sidebar() {
  const pathname = usePathname();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/40 backdrop-blur-xl lg:flex"
      aria-label="Primary navigation"
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Rexer Micro-Tools home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-accent text-white shadow-glow">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Rexer Micro-Tools</span>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Sections">
        <NavLink href="/" label="Home" icon={<Home className="size-4" />} active={pathname === "/"} />
        <NavLink
          href="/#tools-heading"
          label="All Tools"
          icon={<LayoutGrid className="size-4" />}
          active={false}
        />

        <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </p>
        <ul className="space-y-0.5">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/#tools-heading`}
                className="block truncate rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "mb-0.5 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-accent/10 text-accent"
          : "text-muted-foreground hover:bg-accent/10 hover:text-accent",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
