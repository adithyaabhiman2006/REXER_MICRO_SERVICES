"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Cpu,
  Layers,
  MousePointer2,
  Sparkles,
  Zap,
} from "lucide-react";

import { CommandTrigger } from "@/components/CommandTrigger";
import { Procedural3DCanvas } from "@/components/Procedural3DCanvas";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { playClick, playHover } from "@/lib/sound";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CampaignHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [btnMagnet, setBtnMagnet] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLAnchorElement>(null);

  const canvas3DMode = useAppStore((state) => state.canvas3DMode);
  const setCanvas3DMode = useAppStore((state) => state.setCanvas3DMode);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const setPersonalizationOpen = useAppStore((state) => state.setPersonalizationOpen);

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setBtnMagnet({ x: x * 0.35, y: y * 0.35 });
  };

  const handleBtnMouseLeave = () => {
    setBtnMagnet({ x: 0, y: 0 });
  };

  const nextCanvasMode = () => {
    const modes: Array<typeof canvas3DMode> = ["polyhedron", "mesh", "waves", "matrix"];
    const nextIdx = (modes.indexOf(canvas3DMode) + 1) % modes.length;
    setCanvas3DMode(modes[nextIdx]);
    if (soundEnabled) playClick();
  };

  return (
    <section
      className="group relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#070809] text-white"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * -16,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * -10,
        });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* Background artwork with 3D mouse parallax */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `scale(1.04) translate3d(${tilt.x}px, ${tilt.y}px, 0)` }}
      >
        <Image
          src={`${BASE_PATH}/images/rexer-motion-v3.png`}
          alt="A creator moving through sculptural digital forms"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[67%_center] sm:object-[62%_center]"
        />
      </div>

      {/* Interactive Procedural 3D WebGL / Canvas stage */}
      <Procedural3DCanvas />

      {/* Gradient ambient shades */}
      <div className="absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(6,7,8,.97)_0%,rgba(6,7,8,.84)_36%,rgba(6,7,8,.2)_68%,rgba(6,7,8,.32)_100%)]" />
      <div className="absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(0,0,0,.08)_55%,rgba(0,0,0,.92)_100%)]" />

      {/* 3D Mode Live Switcher Badge */}
      <button
        type="button"
        onClick={nextCanvasMode}
        onMouseEnter={() => soundEnabled && playHover()}
        className="hero-float-card absolute right-[10%] top-[18%] z-20 hidden rounded-2xl border border-white/15 bg-black/60 p-4 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-105 hover:border-rex-lime/60 xl:block"
      >
        <div className="flex items-center gap-2">
          <Layers className="size-3.5 text-rex-lime" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-rex-lime">
            3D Canvas: {canvas3DMode}
          </p>
        </div>
        <p className="mt-1 text-xs font-black text-white/90">Click to switch procedural visual</p>
        <p className="text-[9px] font-semibold text-white/40">Polyhedron · Mesh · Waves · Matrix</p>
      </button>

      {/* Floating interactive highlight badge */}
      <div className="hero-float-card pointer-events-none absolute bottom-[20%] right-[18%] z-10 hidden rounded-2xl border border-white/15 bg-black/55 p-4 text-white shadow-2xl backdrop-blur-xl xl:block [animation-delay:-2.5s]">
        <div className="flex items-center gap-2">
          <Zap className="size-3.5 text-rex-coral" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-coral">
            Instant Start
          </p>
        </div>
        <p className="mt-1 text-sm font-black">Zero File Uploads</p>
        <p className="text-[10px] font-semibold text-white/50">100% local browser memory</p>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1600px] flex-col justify-between px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
        <div className="flex items-start justify-between">
          <p className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.22em] text-white/70 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-rex-lime shadow-[0_0_14px_#CFFF2E]" />
            Creative utility / Colombo
          </p>
          <button
            type="button"
            onClick={() => setPersonalizationOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-md transition-all hover:bg-white hover:text-black sm:flex"
          >
            <Cpu className="size-3" /> Customize Cockpit (P)
          </button>
        </div>

        <div className="max-w-[880px] py-16 lg:py-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rex-lime/25 bg-rex-lime/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[.25em] text-rex-lime">
            <Sparkles className="size-3.5" /> One creative system · 200 working tools
          </div>
          <h1 className="text-reveal text-[clamp(4rem,10.6vw,10.5rem)] font-black leading-[.73] tracking-[-.095em]">
            MAKE
            <br />
            ANYTHING
            <br />
            <span className="inline-flex items-center gap-[.08em] text-rex-lime">
              MOVE<span className="text-rex-coral">.</span>
            </span>
          </h1>
          <div className="mt-8 flex max-w-2xl flex-col gap-6 border-l border-white/25 pl-5 sm:flex-row sm:items-end sm:justify-between lg:ml-[32%]">
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/70 sm:text-base">
              A fast, private workspace for the small tasks between an idea and the finished thing.
              No sign-up. No friction.
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-rex-lime px-7 font-black text-black shadow-glow transition-all hover:bg-white hover:text-black active:scale-95"
              >
                <Link
                  ref={btnRef}
                  href="#tools-heading"
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                  onClick={() => soundEnabled && playClick()}
                  style={{
                    transform: `translate3d(${btnMagnet.x}px, ${btnMagnet.y}px, 0)`,
                    transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  Enter the lab <ArrowDown className="size-4" />
                </Link>
              </Button>
              <CommandTrigger />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-white/15 pt-5">
          <div className="flex gap-5 text-[9px] font-bold uppercase tracking-[.16em] text-white/55 sm:gap-8">
            <span className="flex items-center gap-2">
              <Check className="size-3 text-rex-lime" /> Local first
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-3 text-rex-lime" /> Zero account
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <Check className="size-3 text-rex-lime" /> Installable PWA
            </span>
          </div>
          <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-white/40 lg:flex">
            <MousePointer2 className="size-3" /> Move cursor to interact <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </section>
  );
}
