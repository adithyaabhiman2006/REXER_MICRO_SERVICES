"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, MousePointer2, Sparkles, Zap } from "lucide-react";

import { CommandTrigger } from "@/components/CommandTrigger";
import { Button } from "@/components/ui/button";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CampaignHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interactive 3D particle mesh background on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ["#CFFF2E", "#38BDF8", "#FF5A36", "#7C5CFF", "#FFFFFF"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connective lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

      {/* Interactive canvas overlay for particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full opacity-60"
      />

      {/* Gradient ambient shades */}
      <div className="absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(6,7,8,.97)_0%,rgba(6,7,8,.84)_36%,rgba(6,7,8,.2)_68%,rgba(6,7,8,.32)_100%)]" />
      <div className="absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(0,0,0,.08)_55%,rgba(0,0,0,.92)_100%)]" />

      {/* Floating interactive highlight badges */}
      <div className="hero-float-card pointer-events-none absolute right-[10%] top-[24%] z-10 hidden rounded-2xl border border-white/15 bg-black/55 p-4 text-white shadow-2xl backdrop-blur-xl xl:block">
        <div className="flex items-center gap-2">
          <span className="size-2 animate-ping rounded-full bg-rex-lime" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-lime">
            Live System
          </p>
        </div>
        <p className="mt-1 text-2xl font-black">200 / 200</p>
        <p className="text-[10px] font-semibold text-white/50">client-side tools active</p>
      </div>

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
          <p className="hidden max-w-[170px] text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[.14em] text-white/40 sm:block">
            Built for people who would rather make than wait
          </p>
        </div>

        <div className="max-w-[850px] py-16 lg:py-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rex-lime/25 bg-rex-lime/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[.25em] text-rex-lime">
            <Sparkles className="size-3.5" /> One creative system · 200 working tools
          </div>
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
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/70 sm:text-base">
              A fast, private workspace for the small tasks between an idea and the finished thing.
              No sign-up. No friction.
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-rex-lime px-7 font-black text-black shadow-glow transition-all hover:scale-105 hover:bg-white hover:text-black active:scale-95"
              >
                <Link href="#tools-heading">
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
