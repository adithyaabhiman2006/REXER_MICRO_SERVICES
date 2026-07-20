"use client";

import { ArrowDownRight, Braces, Calculator, FileStack, ImageIcon, WandSparkles } from "lucide-react";

import { useAppStore } from "@/store/useAppStore";

const intents = [
  {
    label: "Convert a file",
    detail: "Images, video & audio",
    category: "media",
    query: "convert",
    icon: ImageIcon,
    color: "hover:bg-rex-coral",
  },
  {
    label: "Work with a PDF",
    detail: "Merge, split & edit",
    category: "docs",
    query: "pdf",
    icon: FileStack,
    color: "hover:bg-rex-lime",
  },
  {
    label: "Build or debug",
    detail: "Code, data & UI helpers",
    category: "dev",
    query: "",
    icon: Braces,
    color: "hover:bg-rex-violet",
  },
  {
    label: "Calculate something",
    detail: "Money, health & time",
    category: "finance",
    query: "",
    icon: Calculator,
    color: "hover:bg-rex-sky",
  },
  {
    label: "Create with AI",
    detail: "Write, plan & explore",
    category: "ai",
    query: "",
    icon: WandSparkles,
    color: "hover:bg-[#FF9ED2]",
  },
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
    <section className="mx-auto max-w-[1440px] border-x border-b border-border px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-rex-violet">
            Start with your goal
          </p>
          <h2 className="mt-4 text-4xl font-black leading-[.9] tracking-[-.06em] sm:text-6xl">
            WHAT ARE YOU
            <br />
            TRYING TO DO?
          </h2>
        </div>
        <p className="max-w-sm text-sm font-medium leading-relaxed text-muted-foreground">
          You do not need to know the tool name. Choose an outcome and Rexer narrows the workspace
          for you.
        </p>
      </div>

      <div className="scroll-thin -mx-4 mt-10 flex snap-x snap-mandatory gap-px overflow-x-auto border-y border-border bg-border px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-hidden sm:rounded-[2rem] sm:border sm:px-0 lg:grid-cols-5">
        {intents.map(({ label, detail, category, query, icon: Icon, color }) => (
          <button
            key={label}
            type="button"
            onClick={() => chooseIntent(category, query)}
            className={`group -mb-px -mr-px min-h-52 min-w-[78vw] snap-start border-b border-r border-border bg-background p-6 text-left transition-all duration-300 hover:text-black sm:min-w-0 ${color}`}
          >
            <span className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-full border border-current/15 bg-card/40 transition-transform group-hover:-rotate-6 group-hover:scale-110">
                <Icon className="size-4" />
              </span>
              <ArrowDownRight className="size-4 opacity-35 transition-transform group-hover:-rotate-45 group-hover:opacity-100" />
            </span>
            <span className="mt-14 block text-lg font-black tracking-[-.035em]">{label}</span>
            <span className="mt-1 block text-xs font-semibold opacity-45">{detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
