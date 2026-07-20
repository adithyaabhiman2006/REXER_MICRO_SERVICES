"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Moon, Search, Sun } from "lucide-react";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

/**
 * Mobile bottom navigation — visible below `lg`. Keeps the most-used
 * destinations reachable with the thumb. Theme toggle is included as a tab.
 */
export function BottomNav() {
  const pathname = usePathname();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setCommandOpen = useAppStore((s) => s.setCommandOpen);

  const items = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    {
      href: "/#tools-heading",
      label: "Tools",
      icon: LayoutGrid,
      active: false,
    },
  ];

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-white/10 bg-[#111315]/90 text-white shadow-2xl backdrop-blur-2xl md:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map(({ href, label, icon: Icon, active }) => (
        <Link
          key={label}
          href={href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
            active ? "text-rex-lime" : "text-white/55",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </Link>
      ))}

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        aria-label="Find a tool"
        className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-white/55 transition-colors hover:text-rex-lime"
      >
        <Search className="size-5" />
        Search
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-white/55 transition-colors hover:text-rex-lime"
      >
        {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </nav>
  );
}
