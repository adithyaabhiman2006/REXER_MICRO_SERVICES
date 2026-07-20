"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Braces, FileText, ImageIcon, Sparkles } from "lucide-react";

const cards = [
  {
    title: "IMAGE LAB",
    note: "Compress · resize · convert",
    href: "/tools/image-converter",
    icon: ImageIcon,
    color: "bg-rex-coral",
    position: "left-[3%] top-[12%] -rotate-[9deg]",
  },
  {
    title: "PDF STUDIO",
    note: "Merge · sign · extract",
    href: "/tools/pdf-merge",
    icon: FileText,
    color: "bg-rex-lime",
    position: "right-[2%] top-[5%] rotate-[8deg]",
  },
  {
    title: "DEV KIT",
    note: "JSON · regex · tokens",
    href: "/tools/json-formatter",
    icon: Braces,
    color: "bg-rex-violet",
    position: "bottom-[3%] left-[8%] rotate-[7deg]",
  },
  {
    title: "AI WRITER",
    note: "Rewrite · ideate · polish",
    href: "/tools/ai-text-rewriter",
    icon: Sparkles,
    color: "bg-rex-sky",
    position: "bottom-[7%] right-[1%] -rotate-[8deg]",
  },
];

export function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  function move(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.current?.style.setProperty("--stage-rx", `${-y * 9}deg`);
    stage.current?.style.setProperty("--stage-ry", `${x * 12}deg`);
  }

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[590px] [perspective:1100px]"
      onPointerMove={move}
      onPointerLeave={() => {
        stage.current?.style.setProperty("--stage-rx", "0deg");
        stage.current?.style.setProperty("--stage-ry", "0deg");
      }}
    >
      <div
        ref={stage}
        className="hero-stage absolute inset-[12%] rounded-[30%] border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-[0_50px_100px_-30px_rgba(0,0,0,.75)] [transform-style:preserve-3d] [transform:rotateX(var(--stage-rx,0deg))_rotateY(var(--stage-ry,0deg))]"
      >
        <div className="absolute inset-[12%] rounded-full bg-rex-lime shadow-[0_0_100px_rgba(207,255,46,.32)] [transform:translateZ(30px)]" />
        <div className="absolute inset-[22%] grid place-items-center rounded-full border-[14px] border-background bg-foreground text-background shadow-2xl [transform:translateZ(85px)]">
          <div className="text-center">
            <span className="block text-[clamp(3rem,9vw,7rem)] font-black leading-none tracking-[-0.12em]">
              RX
            </span>
            <span className="mt-2 block text-[9px] font-bold uppercase tracking-[0.42em]">
              200 tools
            </span>
          </div>
        </div>
        <div className="absolute left-[47%] top-[-9%] h-[118%] w-[6%] rounded-full bg-rex-coral/90 blur-[1px] [transform:translateZ(5px)_rotate(34deg)]" />
      </div>

      {cards.map(({ title, note, href, icon: Icon, color, position }, index) => (
        <Link
          key={title}
          href={href}
          className={`hero-float-card absolute z-10 w-[44%] rounded-2xl border border-black/10 p-4 text-black shadow-[0_20px_50px_-18px_rgba(0,0,0,.65)] transition-transform hover:z-20 hover:scale-105 sm:p-5 ${color} ${position}`}
          style={{ animationDelay: `${index * -1.2}s` }}
        >
          <div className="flex items-start justify-between">
            <Icon className="size-5" />
            <ArrowUpRight className="size-4" />
          </div>
          <p className="mt-7 text-sm font-black tracking-[-0.03em] sm:text-base">{title}</p>
          <p className="mt-1 text-[9px] font-semibold opacity-65 sm:text-[11px]">{note}</p>
        </Link>
      ))}
    </div>
  );
}
