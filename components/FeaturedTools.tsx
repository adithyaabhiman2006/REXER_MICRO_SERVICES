import Link from "next/link";
import { ArrowUpRight, Braces, FileStack, ImageIcon, Sparkles } from "lucide-react";

const studios = [
  { title: "IMAGE LAB", copy: "Resize, compress, convert and finish images without handing them to a server.", href: "/tools/image-converter", icon: ImageIcon, count: "47", accent: "hover:bg-rex-coral", tone: "bg-rex-coral", code: "IMG" },
  { title: "PDF STUDIO", copy: "Merge, split, sign, watermark and reshape documents in one focused workspace.", href: "/tools/pdf-merge", icon: FileStack, count: "27", accent: "hover:bg-rex-lime", tone: "bg-rex-lime", code: "PDF" },
  { title: "AI WORKSHOP", copy: "Move from rough thought to a useful first draft with clearly disclosed cloud assistance.", href: "/tools/ai-text-rewriter", icon: Sparkles, count: "40", accent: "hover:bg-rex-violet", tone: "bg-rex-violet", code: "AI" },
  { title: "DEVELOPER KIT", copy: "Format, inspect, generate and debug the small things that slow good work down.", href: "/tools/json-formatter", icon: Braces, count: "27", accent: "hover:bg-rex-sky", tone: "bg-rex-sky", code: "DEV" },
];

export function FeaturedTools() {
  return (
    <section className="mx-auto max-w-[1440px] border-x border-border px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
      <div className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[1fr_.6fr] lg:items-end">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-rex-coral">Four places to begin / 003</p>
          <h2 className="mt-4 text-[clamp(3.2rem,7vw,7.4rem)] font-black leading-[.8] tracking-[-.08em]">
            ENTER A
            <br />
            WORKSPACE.
          </h2>
        </div>
        <p className="max-w-sm text-sm font-medium leading-relaxed text-muted-foreground lg:justify-self-end">
          Not categories. Purpose-built studios with one shared rhythm: bring something in, shape it, take the result with you.
        </p>
      </div>

      <div>
        {studios.map(({ title, copy, href, icon: Icon, count, accent, tone, code }, index) => (
          <Link
            key={title}
            href={href}
            className={`group relative grid min-h-[250px] overflow-hidden border-b border-border transition-colors duration-500 hover:text-black sm:grid-cols-[120px_1fr_280px] lg:min-h-[290px] ${accent}`}
          >
            <div className="relative z-10 flex items-start justify-between px-2 py-7 sm:block sm:px-5 sm:py-9">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.18em] opacity-40">/0{index + 1}</span>
              <span className="mt-0 grid size-12 place-items-center rounded-full border border-current/15 sm:mt-20">
                <Icon className="size-5" />
              </span>
            </div>
            <div className="relative z-10 flex flex-col justify-center px-2 pb-8 sm:px-5 sm:py-10">
              <h3 className="text-[clamp(2.8rem,7vw,7rem)] font-black leading-[.78] tracking-[-.08em]">{title}</h3>
              <div className="mt-7 flex items-end justify-between gap-4 sm:max-w-2xl">
                <p className="max-w-md text-xs font-semibold leading-relaxed opacity-50 sm:text-sm">{copy}</p>
                <span className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] sm:flex">
                  Open studio <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                </span>
              </div>
            </div>
            <div className="relative hidden overflow-hidden sm:block">
              <span className="absolute right-4 top-5 font-mono text-[9px] font-bold uppercase tracking-[.18em] opacity-40">{count} tools</span>
              <span className={`absolute bottom-[-40px] right-5 grid size-48 rotate-6 place-items-center rounded-[2.5rem] text-5xl font-black text-black shadow-[0_25px_60px_-25px_rgba(0,0,0,.7)] transition-all duration-500 group-hover:bottom-5 group-hover:rotate-[-5deg] ${tone}`}>
                {code}
              </span>
              <span className="absolute bottom-10 right-44 size-20 rounded-full border-[18px] border-current opacity-10 transition-transform duration-700 group-hover:rotate-180 group-hover:scale-125" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
