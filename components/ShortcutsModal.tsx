"use client";

import { useEffect } from "react";
import { Command, Keyboard, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { playClick, playSwitch } from "@/lib/sound";

const shortcuts = [
  { key: "Ctrl + K", desc: "Open global command launcher & tool search" },
  { key: "/", desc: "Focus search bar immediately" },
  { key: "T", desc: "Cycle through color palettes dynamically" },
  { key: "S", desc: "Toggle procedural Web Audio sound FX" },
  { key: "P", desc: "Open Personalization & Aesthetics Studio" },
  { key: "?", desc: "Toggle this keyboard shortcuts sheet" },
  { key: "Esc", desc: "Close any active modal or clear filters" },
];

export function ShortcutsModal() {
  const open = useAppStore((state) => state.shortcutsOpen);
  const setOpen = useAppStore((state) => state.setShortcutsOpen);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const cyclePalette = useAppStore((state) => state.cyclePalette);
  const toggleSound = useAppStore((state) => state.toggleSound);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (isTyping) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        if (soundEnabled) playSwitch();
        setOpen(!open);
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        cyclePalette();
        if (soundEnabled) playSwitch();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        toggleSound();
        if (!soundEnabled) playSwitch();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen, soundEnabled, cyclePalette, toggleSound]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-2xl"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts Cheat Sheet"
        className="w-full max-w-lg rounded-[2rem] border border-white/15 bg-[#0e1013] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.8)] sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-rex-coral text-black">
              <Keyboard className="size-4" />
            </span>
            <div>
              <h2 className="text-lg font-black tracking-[-0.04em]">Keyboard Shortcuts</h2>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Speed shortcuts for power creators
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playClick();
              setOpen(false);
            }}
            className="grid size-8 place-items-center rounded-full border border-white/10 text-white/50 hover:bg-white hover:text-black"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="mt-5 divide-y divide-white/10">
          {shortcuts.map(({ key, desc }) => (
            <div key={key} className="flex items-center justify-between py-3">
              <span className="text-xs font-medium text-white/60">{desc}</span>
              <kbd className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-xs font-bold text-white shadow-inner">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <footer className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          <span>Rexer Shortcuts Engine</span>
          <span>Press ESC to dismiss</span>
        </footer>
      </div>
    </div>
  );
}
