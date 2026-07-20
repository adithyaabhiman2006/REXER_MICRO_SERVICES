import Link from "next/link";
import { ArrowUpRight, Braces, FileStack, ImageIcon, Sparkles } from "lucide-react";

const featured = [
  {
    title: "Image Lab",
    copy: "Resize, compress, convert and finish images without handing them to a server.",
    href: "/tools/image-converter",
    icon: ImageIcon,
    className: "bg-rex-coral text-black lg:col-span-7",
    number: "47 MEDIA TOOLS",
    visual: "images",
  },
  {
    title: "PDF Studio",
    copy: "Merge, split, sign, watermark and reshape documents in one focused workspace.",
    href: "/tools/pdf-merge",
    icon: FileStack,
    className: "bg-rex-lime text-black lg:col-span-5",
    number: "27 DOC TOOLS",
    visual: "pdf",
  },
  {
    title: "AI Workshop",
    copy: "Move from rough thought to useful first draft with clearly disclosed cloud assistance.",
    href: "/tools/ai-text-rewriter",
    icon: Sparkles,
    className: "bg-rex-violet text-black lg:col-span-5",
    number: "40 SMART TOOLS",
    visual: "ai",
  },
  {
    title: "Developer Kit",
    copy: "Format, inspect, generate and debug the small things that slow good work down.",
    href: "/tools/json-formatter",
    icon: Braces,
    className: "bg-[#15171a] text-white lg:col-span-7",
    number: "27 DEV TOOLS",
    visual: "code",
  },
];

export function FeaturedTools() {
  return (
    <section className="mx-auto max-w-[1440px] border-x border-t border-border px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-rex-coral">
            Curated starting points
          </p>
          <h2 className="mt-4 text-5xl font-black leading-[.9] tracking-[-.065em] sm:text-7xl">
            START WITH
            <br />
            WHAT MATTERS.
          </h2>
        </div>
        <p className="max-w-sm text-sm font-medium leading-relaxed text-muted-foreground">
          Four studios cover most everyday creative work. Pick one and be productive in seconds.
        </p>
      </div>
      <div className="mt-12 grid gap-3 lg:grid-cols-12">
        {featured.map(({ title, copy, href, icon: Icon, className, number, visual }) => (
          <Link
            key={title}
            href={href}
            className={`group relative min-h-[380px] overflow-hidden rounded-[2rem] p-7 shadow-[inset_0_0_0_1px_rgba(0,0,0,.1)] transition-transform duration-300 hover:-translate-y-1 ${className}`}
          >
            <div className="relative z-10 flex items-start justify-between">
              <span className="border-current/15 grid size-12 place-items-center rounded-2xl border bg-white/20 backdrop-blur">
                <Icon className="size-5" />
              </span>
              <span className="border-current/20 grid size-11 place-items-center rounded-full border transition-transform group-hover:rotate-45 group-hover:bg-black group-hover:text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="absolute inset-x-7 bottom-7 z-10 max-w-md">
              <p className="font-mono text-[9px] font-bold tracking-[.18em] opacity-50">{number}</p>
              <h3 className="mt-2 text-4xl font-black tracking-[-.06em]">{title}</h3>
              <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed opacity-60">
                {copy}
              </p>
            </div>
            <FeaturedVisual type={visual} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedVisual({ type }: { type: string }) {
  if (type === "images")
    return (
      <div className="absolute right-[-3%] top-[23%] h-44 w-[52%] [perspective:700px]">
        <span className="absolute inset-0 rotate-6 rounded-2xl bg-[#FFD66B] shadow-2xl [transform:rotateY(-18deg)_rotateZ(8deg)]" />
        <span className="absolute inset-4 -rotate-3 rounded-2xl bg-rex-sky shadow-2xl [transform:translateZ(30px)_rotateY(-10deg)]" />
        <span className="absolute inset-8 grid place-items-center rounded-2xl bg-black text-3xl font-black text-white shadow-2xl">
          JPG → WEBP
        </span>
      </div>
    );
  if (type === "pdf")
    return (
      <div className="absolute right-8 top-24 flex items-end gap-2">
        <span className="h-36 w-24 -rotate-6 rounded-lg bg-white p-3 shadow-xl">
          <span className="block h-2 w-10 bg-black/15" />
          <span className="mt-3 block h-1 w-full bg-black/10" />
          <span className="mt-2 block h-1 w-3/4 bg-black/10" />
        </span>
        <span className="h-44 w-28 rotate-6 rounded-lg bg-black p-3 text-xs font-black text-white shadow-2xl">
          PDF
          <br />
          <span className="text-rex-lime">READY</span>
        </span>
      </div>
    );
  if (type === "ai")
    return (
      <div className="absolute right-5 top-24 size-40 rounded-full border-[20px] border-black/80 shadow-[0_0_0_18px_rgba(255,255,255,.16),0_30px_50px_-20px_rgba(0,0,0,.5)]">
        <span className="absolute inset-5 animate-pulse rounded-full bg-rex-lime" />
      </div>
    );
  return (
    <div className="absolute right-[-2%] top-[24%] w-[55%] rotate-3 rounded-2xl border border-white/15 bg-black p-5 font-mono text-[10px] leading-6 text-white/45 shadow-2xl">
      <p>
        <span className="text-rex-violet">const</span> toolkit = &#123;
      </p>
      <p className="pl-4">
        <span className="text-rex-sky">fast</span>: true,
      </p>
      <p className="pl-4">
        <span className="text-rex-lime">private</span>: true,
      </p>
      <p className="pl-4">
        <span className="text-rex-coral">tools</span>: 200
      </p>
      <p>&#125;;</p>
    </div>
  );
}
