"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, MousePointer2 } from "lucide-react";

import { CommandTrigger } from "@/components/CommandTrigger";
import { Button } from "@/components/ui/button";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CampaignHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <section
      className="group relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#070809] text-white"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * -12,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * -8,
        });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `scale(1.035) translate3d(${tilt.x}px, ${tilt.y}px, 0)` }}
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,7,8,.98)_0%,rgba(6,7,8,.86)_34%,rgba(6,7,8,.16)_68%,rgba(6,7,8,.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.1)_55%,rgba(0,0,0,.92)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1600px] flex-col justify-between px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
        <div className="flex items-start justify-between">
          <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.22em] text-white/45">
            <span className="size-1.5 rounded-full bg-rex-lime shadow-[0_0_14px_#CFFF2E]" />
            Creative utility / Colombo
          </p>
          <p className="hidden max-w-[170px] text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[.14em] text-white/35 sm:block">
            Built for people who would rather make than wait
          </p>
        </div>

        <div className="max-w-[850px] py-16 lg:py-10">
          <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[.25em] text-rex-lime">
            One creative system · 200 working tools
          </p>
          <h1 className="text-[clamp(4rem,10.6vw,10.5rem)] font-black leading-[.73] tracking-[-.095em]">
            MAKE
            <br />
            ANYTHING
            <br />
            <span className="inline-flex items-center gap-[.08em] text-rex-lime">
              MOVE<span className="text-rex-coral">.</span>
            </span>
          </h1>
          <div className="mt-8 flex max-w-2xl flex-col gap-6 border-l border-white/25 pl-5 sm:flex-row sm:items-end sm:justify-between lg:ml-[32%]">
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/60 sm:text-base">
              A fast, private workspace for the small tasks between an idea and the finished thing.
              No sign-up. No friction.
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button asChild size="lg" className="h-14 rounded-full bg-rex-lime px-7 font-black text-black hover:bg-white">
                <Link href="#tools-heading">Enter the lab <ArrowDown className="size-4" /></Link>
              </Button>
              <CommandTrigger />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-white/15 pt-5">
          <div className="flex gap-5 text-[9px] font-bold uppercase tracking-[.16em] text-white/45 sm:gap-8">
            <span className="flex items-center gap-2"><Check className="size-3 text-rex-lime" /> Local first</span>
            <span className="flex items-center gap-2"><Check className="size-3 text-rex-lime" /> Zero account</span>
            <span className="hidden items-center gap-2 sm:flex"><Check className="size-3 text-rex-lime" /> Installable</span>
          </div>
          <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-white/35 lg:flex">
            <MousePointer2 className="size-3" /> Move to explore <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </section>
  );
}
