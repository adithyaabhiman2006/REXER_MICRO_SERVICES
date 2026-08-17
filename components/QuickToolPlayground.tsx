"use client";

import { useState } from "react";
import {
  Braces,
  Check,
  Code2,
  Copy,
  Cpu,
  Palette,
  RefreshCw,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { playClick, playSuccess, playType } from "@/lib/sound";

export function QuickToolPlayground() {
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const [tab, setTab] = useState<"text" | "palette" | "regex" | "units">("text");

  // 1. Text Transformer State
  const [inputText, setInputText] = useState("Make anything move.");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 2. Palette Generator State
  const [colors, setColors] = useState(["#CFFF2E", "#FF6846", "#84F7FF", "#9A86FF", "#090A0C"]);

  // 3. Regex Tester State
  const [regexPattern, setRegexPattern] = useState("\\b[A-Za-z]{4}\\b");
  const [regexText, setRegexText] = useState("Make move fast with zero code lag");

  // 4. Units Converter State
  const [pxValue, setPxValue] = useState(16);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (soundEnabled) playSuccess();
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {}
  };

  const generateNewPalette = () => {
    const randomHex = () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
    setColors([randomHex(), randomHex(), randomHex(), randomHex(), "#090A0C"]);
    if (soundEnabled) playClick();
  };

  // Base64 calculation
  const base64Out = typeof window !== "undefined" ? btoa(inputText || " ") : "";
  const byteSize = new Blob([inputText]).size;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  // Regex matches
  let regexMatches: string[] = [];
  try {
    const re = new RegExp(regexPattern, "g");
    regexMatches = regexText.match(re) || [];
  } catch {}

  return (
    <section className="border-b border-border bg-[#090a0c] text-white">
      <div className="mx-auto max-w-[1440px] border-x border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_.55fr] lg:items-end">
          <div>
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-rex-lime">
              <Cpu className="size-3.5" /> Instant In-Browser Sandbox
            </span>
            <h2 className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.82] tracking-[-0.08em]">
              TEST BEFORE
              <br />
              <span className="text-rex-coral">YOU DEPLOY.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm font-medium leading-relaxed text-white/45 lg:justify-self-end">
            Run micro-calculations directly on this page. Pure local client memory — zero roundtrips, zero latency.
          </p>
        </div>

        {/* Interactive Workbench Container */}
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/15 bg-[#111316] shadow-2xl">
          {/* Tabs bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/40 p-3 sm:px-6">
            <div className="flex gap-1 sm:gap-2">
              {[
                { id: "text", label: "Text & Base64", icon: Terminal },
                { id: "palette", label: "Color Harmonizer", icon: Palette },
                { id: "regex", label: "Regex Sandbox", icon: Code2 },
                { id: "units", label: "Unit Converter", icon: Zap },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id as typeof tab);
                    if (soundEnabled) playClick();
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition-all ${
                    tab === id
                      ? "bg-white text-black shadow-md"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-rex-lime sm:inline">
              ● 0ms Local Execution
            </span>
          </div>

          {/* Workbench Body */}
          <div className="p-6 sm:p-8">
            {tab === "text" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Input String
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (soundEnabled) playType();
                    }}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-sm text-white placeholder-white/20 outline-none focus:border-rex-lime/60"
                    placeholder="Type or paste any text..."
                  />
                  <div className="mt-3 flex gap-4 font-mono text-[10px] text-white/40">
                    <span>{inputText.length} characters</span>
                    <span>{wordCount} words</span>
                    <span>{byteSize} bytes</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rex-coral">
                        Base64 Output
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(base64Out, "b64")}
                        className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold transition-all hover:bg-white hover:text-black"
                      >
                        {copiedKey === "b64" ? <Check className="size-3 text-rex-lime" /> : <Copy className="size-3" />}
                        {copiedKey === "b64" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-2 truncate font-mono text-xs text-white/80">{base64Out || "—"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rex-sky">
                        URL Encoded
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(encodeURIComponent(inputText), "url")}
                        className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold transition-all hover:bg-white hover:text-black"
                      >
                        {copiedKey === "url" ? <Check className="size-3 text-rex-lime" /> : <Copy className="size-3" />}
                        {copiedKey === "url" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-2 truncate font-mono text-xs text-white/80">{encodeURIComponent(inputText)}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "palette" && (
              <div>
                <div className="flex items-center justify-between pb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Generative Harmonized Palette
                  </span>
                  <button
                    type="button"
                    onClick={generateNewPalette}
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-black transition-transform hover:scale-105"
                  >
                    <RefreshCw className="size-3.5" /> Harmonize New
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => copyToClipboard(c, `color-${i}`)}
                      className="group relative flex h-36 flex-col justify-between rounded-2xl p-4 text-left transition-transform hover:-translate-y-1"
                      style={{ backgroundColor: c }}
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold uppercase mix-blend-difference text-white">
                          0{i + 1}
                        </span>
                        <Copy className="size-3.5 opacity-0 mix-blend-difference text-white transition-opacity group-hover:opacity-100" />
                      </span>
                      <div>
                        <p className="font-mono text-sm font-black mix-blend-difference text-white">{c}</p>
                        <p className="text-[10px] font-semibold mix-blend-difference text-white/80">
                          {copiedKey === `color-${i}` ? "Copied!" : "Click to copy"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "regex" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Regular Expression Pattern
                  </label>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-sm text-rex-lime outline-none focus:border-rex-lime"
                  />
                  <label className="mb-2 mt-4 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Test Target Text
                  </label>
                  <textarea
                    value={regexText}
                    onChange={(e) => setRegexText(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-sm text-white outline-none focus:border-rex-lime"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rex-violet">
                    Matches ({regexMatches.length})
                  </span>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {regexMatches.length ? (
                      regexMatches.map((m, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-rex-lime/40 bg-rex-lime/15 px-3 py-1 font-mono text-xs font-bold text-rex-lime"
                        >
                          {m}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-white/40">No pattern matches found in target text.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "units" && (
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rex-lime">
                    Pixels to REM
                  </span>
                  <input
                    type="number"
                    value={pxValue}
                    onChange={(e) => setPxValue(Number(e.target.value) || 0)}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-base font-bold text-white outline-none"
                  />
                  <div className="mt-4 font-mono text-xl font-black text-rex-lime">
                    {(pxValue / 16).toFixed(3)} rem
                  </div>
                  <p className="mt-1 text-[10px] text-white/40">Based on 16px base font size</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rex-coral">
                    Unix Epoch Now
                  </span>
                  <div className="mt-4 font-mono text-xl font-black text-rex-coral">
                    {Math.floor(Date.now() / 1000)}
                  </div>
                  <p className="mt-1 truncate font-mono text-[10px] text-white/40">
                    {new Date().toISOString()}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rex-sky">
                    Quick Byte Math
                  </span>
                  <div className="mt-4 font-mono text-xl font-black text-rex-sky">
                    1 MB = 1,048,576 B
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-white/40">
                    1 GB = 1,024 MB = 1,073,741,824 B
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
