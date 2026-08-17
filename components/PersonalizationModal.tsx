"use client";

import { useEffect } from "react";
import {
  Check,
  Eye,
  Layers,
  Palette,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import {
  Canvas3DMode,
  DensityMode,
  MotionMode,
  PaletteProfile,
  useAppStore,
} from "@/store/useAppStore";
import { playClick, playSuccess, playSwitch } from "@/lib/sound";

const palettes: Array<{
  id: PaletteProfile;
  name: string;
  desc: string;
  colors: string[];
}> = [
  {
    id: "rexer",
    name: "Rexer Cyber",
    desc: "High-voltage electric lime & cyber coral",
    colors: ["#CFFF2E", "#FF6846", "#84F7FF"],
  },
  {
    id: "swiss",
    name: "Swiss Brutalism",
    desc: "Strict editorial monochrome & Bauhaus red",
    colors: ["#FFFFFF", "#FF2A2A", "#111111"],
  },
  {
    id: "tokyo",
    name: "Tokyo Synthwave",
    desc: "Neon magenta, electric violet & cyan glow",
    colors: ["#FF3388", "#9A86FF", "#00F0FF"],
  },
  {
    id: "kyoto",
    name: "Kyoto Forest",
    desc: "Matcha olive, warm bamboo & deep obsidian",
    colors: ["#9BC53D", "#F5EBE0", "#0D1A17"],
  },
  {
    id: "solar",
    name: "Solar Flare",
    desc: "Radiant tangerine, neon amber & basalt",
    colors: ["#FF5722", "#FFA500", "#FFD700"],
  },
];

const motionModes: Array<{ id: MotionMode; label: string; desc: string }> = [
  { id: "overdrive", label: "Overdrive (120Hz)", desc: "Full spring physics, 3D tilt & cursor magnetism" },
  { id: "balanced", label: "Balanced", desc: "Smooth standard transitions & optimal performance" },
  { id: "minimal", label: "Minimal (No Motion)", desc: "Instant transitions, zero canvas overhead" },
];

const canvasModes: Array<{ id: Canvas3DMode; label: string }> = [
  { id: "polyhedron", label: "3D Polyhedron" },
  { id: "mesh", label: "Particle Mesh" },
  { id: "waves", label: "Holo Waves" },
  { id: "matrix", label: "Matrix Flux" },
];

export function PersonalizationModal() {
  const open = useAppStore((state) => state.personalizationOpen);
  const setOpen = useAppStore((state) => state.setPersonalizationOpen);
  const palette = useAppStore((state) => state.palette);
  const setPalette = useAppStore((state) => state.setPalette);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const setSoundEnabled = useAppStore((state) => state.setSoundEnabled);
  const motionMode = useAppStore((state) => state.motionMode);
  const setMotionMode = useAppStore((state) => state.setMotionMode);
  const density = useAppStore((state) => state.density);
  const setDensity = useAppStore((state) => state.setDensity);
  const canvas3DMode = useAppStore((state) => state.canvas3DMode);
  const setCanvas3DMode = useAppStore((state) => state.setCanvas3DMode);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        if (!open) {
          if (soundEnabled) playSwitch();
          setOpen(true);
        }
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen, soundEnabled]);

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
        aria-label="Personalization & Aesthetics Studio"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/15 bg-[#0e1013] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.8)] sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-rex-lime text-black">
              <Sliders className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.04em]">Personalization Studio</h2>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Tailor your creative cockpit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playClick();
              setOpen(false);
            }}
            className="grid size-9 place-items-center rounded-full border border-white/10 text-white/50 transition-colors hover:bg-white hover:text-black"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-7 space-y-8">
          {/* 1. Color Palette Presets */}
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rex-lime">
              <Palette className="size-3.5" /> Color Palette Matrix
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {palettes.map((p) => {
                const isActive = palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPalette(p.id);
                      if (soundEnabled) playSwitch();
                    }}
                    className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      isActive
                        ? "border-rex-lime bg-white/10 text-white shadow-lg"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">{p.name}</span>
                        {isActive && <Check className="size-3.5 text-rex-lime" />}
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-white/40">{p.desc}</p>
                    </div>
                    <div className="flex gap-1">
                      {p.colors.map((c, i) => (
                        <span
                          key={i}
                          className="size-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 3D Procedural Canvas Stage */}
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rex-coral">
              <Layers className="size-3.5" /> Procedural 3D Stage Mode
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {canvasModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setCanvas3DMode(m.id);
                    if (soundEnabled) playClick();
                  }}
                  className={`rounded-xl border p-3 text-center text-xs font-black transition-all ${
                    canvas3DMode === m.id
                      ? "border-rex-coral bg-rex-coral text-black"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Audio & Haptics */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <span className={`grid size-9 place-items-center rounded-xl ${soundEnabled ? "bg-rex-sky text-black" : "bg-white/10 text-white/40"}`}>
                {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </span>
              <div>
                <p className="text-sm font-black">Synthesized Audio FX</p>
                <p className="text-[11px] font-medium text-white/40">
                  Micro-tones on hover, click, timer & type (Web Audio API)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSuccess();
              }}
              className={`h-9 rounded-full px-4 text-xs font-black transition-all ${
                soundEnabled
                  ? "bg-rex-lime text-black shadow-glow"
                  : "border border-white/20 bg-transparent text-white/50 hover:text-white"
              }`}
            >
              {soundEnabled ? "Enabled" : "Muted"}
            </button>
          </div>

          {/* 4. Motion Dynamics Engine */}
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rex-violet">
              <Zap className="size-3.5" /> Motion Dynamics
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {motionModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMotionMode(m.id);
                    if (soundEnabled) playClick();
                  }}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    motionMode === m.id
                      ? "border-rex-violet bg-rex-violet/20 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  <p className="text-xs font-black">{m.label}</p>
                  <p className="mt-1 text-[10px] text-white/40">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Interface Density */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="text-sm font-black">Grid Density</p>
              <p className="text-[11px] font-medium text-white/40">
                {density === "expansive" ? "Expansive editorial layout" : "High-density compact layout"}
              </p>
            </div>
            <div className="flex rounded-full border border-white/15 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setDensity("expansive");
                  if (soundEnabled) playClick();
                }}
                className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
                  density === "expansive" ? "bg-white text-black" : "text-white/40"
                }`}
              >
                Expansive
              </button>
              <button
                type="button"
                onClick={() => {
                  setDensity("compact");
                  if (soundEnabled) playClick();
                }}
                className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
                  density === "compact" ? "bg-white text-black" : "text-white/40"
                }`}
              >
                Compact
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
            Press <kbd className="rounded border border-white/20 px-1 py-0.5 font-mono text-[8px]">P</kbd> to reopen anytime
          </p>
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playSuccess();
              setOpen(false);
            }}
            className="h-10 rounded-full bg-rex-lime px-6 text-xs font-black text-black shadow-glow transition-transform hover:scale-105"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
