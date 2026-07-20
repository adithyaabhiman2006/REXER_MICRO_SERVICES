"use client";

import { ArrowDownRight, Braces, Calculator, FileStack, ImageIcon, WandSparkles } from "lucide-react";

import { useAppStore } from "@/store/useAppStore";

const intents = [
  { label: "Convert a file", detail: "Image · video · audio", category: "media", query: "convert", icon: ImageIcon, color: "group-hover:bg-rex-coral" },
  { label: "Work with a PDF", detail: "Merge · split · edit", category: "docs", query: "pdf", icon: FileStack, color: "group-hover:bg-rex-lime" },
  { label: "Build or debug", detail: "Code · data · interface", category: "dev", query: "", icon: Braces, color: "group-hover:bg-rex-violet" },
  { label: "Calculate something", detail: "Money · health · time", category: "finance", query: "", icon: Calculator, color: "group-hover:bg-rex-sky" },
  { label: "Create with AI", detail: "Write · plan · explore", category: "ai", query: "", icon: WandSparkles, color: "group-hover:bg-[#FF9ED2]" },
];

export function IntentLauncher() {
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);

  const chooseIntent = (category: string, query: string) => {
    setActiveCategory(category);
    setSearchQuery(query);
    document.getElementById("tools-heading")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#090a0c] text-white">
      <div className="mx-auto max-w-[1440px] border-x border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.55fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-rex-lime">Start from the outcome / 002</p>
            <h2 className="mt-4 text-[clamp(3rem,7vw,7.5rem)] font-black leading-[.8] tracking-[-.08em]">
              SAY WHAT
              <br />
              YOU NEED.
            </h2>
          </div>
          <p className="max-w-md text-sm font-medium leading-relaxed text-white/45 lg:justify-self-end">
            Forget product names. Pick the outcome in your head and we will take you to the right starting line.
          </p>
        </div>

        <div className="border-t border-white/15">
          {intents.map(({ label, detail, category, query, icon: Icon, color }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => chooseIntent(category, query)}
              className="group relative flex w-full items-center gap-4 overflow-hidden border-b border-white/15 py-5 text-left sm:gap-7 sm:py-7"
            >
              <span className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${color}`} />
              <span className="relative z-10 w-8 font-mono text-[9px] text-white/30 transition-colors group-hover:text-black/45">
                /0{index + 1}
              </span>
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-[-10deg] group-hover:border-black/20 group-hover:text-black">
                <Icon className="size-4" />
              </span>
              <span className="relative z-10 min-w-0 flex-1 text-[clamp(1.55rem,4.5vw,4.8rem)] font-black leading-none tracking-[-.06em] transition-colors group-hover:text-black">
                {label}
              </span>
              <span className="relative z-10 hidden w-44 text-[10px] font-bold uppercase tracking-[.12em] text-white/35 transition-colors group-hover:text-black/50 md:block">
                {detail}
              </span>
              <ArrowDownRight className="relative z-10 size-6 shrink-0 text-white/30 transition-all group-hover:-rotate-45 group-hover:text-black sm:size-9" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
