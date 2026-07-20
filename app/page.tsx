import { ArrowDownRight, Sparkles } from "lucide-react";

import { CampaignHero } from "@/components/CampaignHero";
import { FeaturedTools } from "@/components/FeaturedTools";
import { IntentLauncher } from "@/components/IntentLauncher";
import { ToolExplorer } from "@/components/ToolExplorer";

export default function HomePage() {
  return (
    <>
      <CampaignHero />

      <section className="overflow-hidden border-y border-black bg-rex-lime py-4 text-black" aria-label="Platform highlights">
        <div className="marquee-track flex min-w-max items-center gap-10 whitespace-nowrap text-xs font-black uppercase tracking-[.22em]">
          {[
            "200 tools in motion",
            "Files stay local",
            "Make without friction",
            "No account needed",
            "Built for the browser",
            "200 tools in motion",
            "Files stay local",
            "Make without friction",
          ].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              <Sparkles className="size-3.5 fill-black" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-border px-4 py-24 sm:px-6 lg:py-40">
        <span className="absolute -right-10 top-0 select-none text-[22rem] font-black leading-none tracking-[-.1em] text-foreground/[.025]" aria-hidden="true">
          RX
        </span>
        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-rex-coral">
                The Rexer idea / 001
              </p>
              <p className="mt-5 max-w-[180px] text-xs font-semibold leading-relaxed text-muted-foreground">
                The useful internet should feel fast, clear and completely yours.
              </p>
            </div>
            <div>
              <h2 className="max-w-6xl text-[clamp(3.3rem,8vw,8.5rem)] font-black leading-[.82] tracking-[-.085em]">
                LESS CLICKING.
                <br />
                <span className="text-rex-violet">MORE MAKING.</span>
                <br />
                KEEP MOVING.
              </h2>
              <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
                {[
                  ["200", "Working tools, one familiar rhythm"],
                  ["0", "Accounts, subscriptions or unnecessary gates"],
                  ["1", "Focused browser tab from start to finish"],
                ].map(([value, label]) => (
                  <div key={value} className="bg-background p-6 sm:p-8">
                    <p className="text-5xl font-black tracking-[-.07em]">{value}</p>
                    <p className="mt-8 max-w-[180px] text-xs font-semibold leading-relaxed text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <IntentLauncher />
      <FeaturedTools />

      <section className="overflow-hidden border-y border-border bg-rex-coral py-8 text-black sm:py-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-10">
          <p className="text-[clamp(2.4rem,6vw,6rem)] font-black leading-[.82] tracking-[-.075em]">
            YOUR NEXT MOVE
            <br />
            IS ALREADY HERE.
          </p>
          <ArrowDownRight className="size-12 shrink-0 sm:size-20" strokeWidth={1.25} />
        </div>
      </section>

      <ToolExplorer />
    </>
  );
}
