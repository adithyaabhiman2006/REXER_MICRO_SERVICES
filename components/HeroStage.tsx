"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function HeroStage() {
  const visual = useRef<HTMLDivElement>(null);
  function move(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    visual.current?.style.setProperty("--art-x", `${x * 14}px`);
    visual.current?.style.setProperty("--art-y", `${y * 10}px`);
  }

  return (
    <div className="relative min-h-[460px] w-full lg:min-h-[700px]" onPointerMove={move}>
      <div
        ref={visual}
        className="hero-art absolute -inset-8 [transform:translate3d(var(--art-x,0),var(--art-y,0),0)_scale(1.04)]"
      >
        <Image
          src={`${BASE_PATH}/images/rexer-tool-universe.png`}
          alt="A luminous three-dimensional universe of connected creative tools"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover object-center"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#090a0c_0%,transparent_18%,transparent_75%,#090a0c_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090a0c] to-transparent" />
      <Link
        href="/tools/image-converter"
        className="absolute bottom-[13%] left-[3%] flex items-center gap-3 rounded-full border border-white/15 bg-black/60 px-4 py-3 text-white shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1"
      >
        <span className="grid size-8 place-items-center rounded-full bg-rex-lime text-black">
          <Check className="size-4" />
        </span>
        <span>
          <span className="block text-[9px] font-bold uppercase tracking-[.18em] text-white/45">
            Most popular
          </span>
          <span className="block text-xs font-black">Image Converter</span>
        </span>
        <ArrowUpRight className="ml-3 size-4" />
      </Link>
      <div className="absolute right-[3%] top-[10%] rounded-2xl border border-white/15 bg-black/55 p-4 text-white shadow-2xl backdrop-blur-xl">
        <p className="font-mono text-[9px] uppercase tracking-[.18em] text-rex-lime">Live system</p>
        <p className="mt-1 text-2xl font-black">200/200</p>
        <p className="text-[9px] font-semibold text-white/45">tools ready</p>
      </div>
    </div>
  );
}
