"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AudioLines,
  Braces,
  Check,
  FileText,
  FileUp,
  ImageIcon,
  Pin,
  Route,
  ShieldCheck,
  Sparkles,
  Video,
  X,
} from "lucide-react";

import { tools } from "@/lib/registry/tools";

const WORKFLOW_KEY = "rexer-pinned-workflow";

const detections = {
  image: {
    label: "Image detected",
    detail: "Resize, compress, or convert it locally.",
    color: "bg-rex-coral",
    icon: ImageIcon,
    slugs: ["image-resizer", "image-compressor", "image-converter"],
  },
  video: {
    label: "Video detected",
    detail: "Trim, compress, or change its format.",
    color: "bg-rex-violet",
    icon: Video,
    slugs: ["video-trimmer", "video-compressor", "video-converter"],
  },
  audio: {
    label: "Audio detected",
    detail: "Trim, normalize, or convert it in-browser.",
    color: "bg-rex-sky",
    icon: AudioLines,
    slugs: ["audio-trimmer", "audio-normalizer", "audio-converter"],
  },
  pdf: {
    label: "PDF detected",
    detail: "Merge, split, or compress the document.",
    color: "bg-rex-lime",
    icon: FileText,
    slugs: ["pdf-merge", "pdf-split", "pdf-compress"],
  },
  data: {
    label: "Structured data detected",
    detail: "Validate, format, or transform the data.",
    color: "bg-[#FF9ED2]",
    icon: Braces,
    slugs: ["json-validator", "json-formatter", "csv-json-converter"],
  },
  file: {
    label: "File ready",
    detail: "Start with universal inspection and conversion tools.",
    color: "bg-white",
    icon: FileUp,
    slugs: ["hash-generator", "base64-encode-decode", "text-encoder-decoder"],
  },
} as const;

type DetectionKey = keyof typeof detections;

const workflows = [
  {
    id: "image-delivery",
    number: "01",
    title: "SHIP AN IMAGE",
    copy: "Resize for the channel, compress the payload, then deliver the right format.",
    color: "bg-rex-coral",
    slugs: ["image-resizer", "image-compressor", "image-converter"],
  },
  {
    id: "pdf-handoff",
    number: "02",
    title: "CLOSE A PDF",
    copy: "Combine the pages, add your signature, then make the final file lighter.",
    color: "bg-rex-lime",
    slugs: ["pdf-merge", "pdf-sign", "pdf-compress"],
  },
  {
    id: "site-launch",
    number: "03",
    title: "LAUNCH A PAGE",
    copy: "Build metadata, check the social card, and prepare search-engine files.",
    color: "bg-rex-violet",
    slugs: ["meta-og-generator", "social-preview-checker", "sitemap-generator"],
  },
  {
    id: "data-handoff",
    number: "04",
    title: "CLEAN AN API",
    copy: "Validate a payload, format it for humans, then generate useful types.",
    color: "bg-rex-sky",
    slugs: ["json-validator", "json-formatter", "json-to-typescript"],
  },
] as const;

function detect(file: File): DetectionKey {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (file.type === "application/pdf" || extension === "pdf") return "pdf";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (["json", "jsonl", "csv", "xml", "yaml", "yml"].includes(extension)) return "data";
  return "file";
}

function readableSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function SmartStart() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<{ name: string; size: number; kind: DetectionKey } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pinned, setPinned] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPinned(window.localStorage.getItem(WORKFLOW_KEY));
    } catch {
      // Private mode can disable storage; workflows still remain usable.
    }
  }, []);

  const chooseFile = (file?: File) => {
    if (!file) return;
    setSelection({ name: file.name, size: file.size, kind: detect(file) });
  };

  const pinWorkflow = (id: string) => {
    const next = pinned === id ? null : id;
    setPinned(next);
    try {
      if (next) window.localStorage.setItem(WORKFLOW_KEY, next);
      else window.localStorage.removeItem(WORKFLOW_KEY);
    } catch {
      // The visual state still works for the current session.
    }
  };

  const result = selection ? detections[selection.kind] : null;
  const ResultIcon = result?.icon ?? FileUp;

  return (
    <section id="smart-start" className="scroll-mt-16 border-b border-border bg-[#090a0c] text-white">
      <div className="mx-auto max-w-[1440px] border-x border-white/10 px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
        <div className="grid gap-7 lg:grid-cols-[1fr_.55fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-rex-lime">
              Smart start / Your file chooses the door
            </p>
            <h2 className="mt-4 text-[clamp(3.2rem,7vw,7.5rem)] font-black leading-[.8] tracking-[-.08em]">
              DROP IT.
              <br />
              <span className="text-rex-coral">KNOW THE MOVE.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm font-medium leading-relaxed text-white/45 lg:justify-self-end">
            Rexer reads only the file name and browser-provided type to recommend the right tools. The file is not uploaded or processed at this step.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-white/15 lg:grid-cols-2">
          <div
            onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              chooseFile(event.dataTransfer.files[0]);
            }}
            className={`relative flex min-h-[360px] flex-col justify-between p-7 transition-colors sm:p-10 ${dragging ? "bg-rex-lime text-black" : "bg-white/[.035]"}`}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] opacity-45">01 / Smart detector</p>
              <ShieldCheck className="size-5 text-rex-lime" />
            </div>
            <div>
              <div className="grid size-20 place-items-center rounded-full border border-current/20">
                <FileUp className="size-7" />
              </div>
              <p className="mt-7 max-w-md text-3xl font-black leading-none tracking-[-.055em] sm:text-5xl">
                {dragging ? "RELEASE TO DETECT" : "BRING ANY FILE"}
              </p>
              <p className="mt-4 max-w-sm text-xs font-semibold leading-relaxed opacity-45">
                PDF, image, video, audio, JSON, CSV, and more. Nothing leaves this device.
              </p>
            </div>
            <div>
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                aria-label="Choose a file for smart recommendations"
                onChange={(event) => {
                  chooseFile(event.currentTarget.files?.[0]);
                  event.currentTarget.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="h-12 rounded-full bg-white px-6 text-xs font-black text-black transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rex-lime"
              >
                Browse this device
              </button>
            </div>
          </div>

          <div className={`relative min-h-[360px] p-7 text-black transition-colors sm:p-10 ${result?.color ?? "bg-[#E9E7DF]"}`} aria-live="polite">
            {selection && result ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-14 place-items-center rounded-full border border-black/20"><ResultIcon className="size-5" /></span>
                  <button type="button" onClick={() => setSelection(null)} className="grid size-9 place-items-center rounded-full border border-black/15" aria-label="Clear selected file"><X className="size-4" /></button>
                </div>
                <p className="mt-8 truncate font-mono text-[10px] font-bold uppercase tracking-[.16em] text-black/45">{selection.name} · {readableSize(selection.size)}</p>
                <h3 className="mt-3 text-4xl font-black tracking-[-.06em]">{result.label}</h3>
                <p className="mt-2 text-sm font-semibold text-black/50">{result.detail}</p>
                <div className="mt-8 divide-y divide-black/15 border-y border-black/15">
                  {result.slugs.map((slug, index) => {
                    const tool = tools.find((item) => item.slug === slug);
                    return tool ? (
                      <Link key={slug} href={`/tools/${slug}`} className="group flex items-center gap-4 py-4">
                        <span className="font-mono text-[9px] font-bold text-black/35">0{index + 1}</span>
                        <span className="flex-1 text-sm font-black">{tool.title}</span>
                        <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                      </Link>
                    ) : null;
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[290px] flex-col justify-between">
                <div className="flex items-center justify-between"><p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/40">02 / Recommendation</p><Sparkles className="size-5" /></div>
                <p className="max-w-md text-4xl font-black leading-[.92] tracking-[-.06em] sm:text-5xl">THE RIGHT TOOLS WILL APPEAR HERE.</p>
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] text-black/40"><Check className="size-3.5" /> Detection happens instantly</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 flex items-end justify-between gap-8 border-b border-white/15 pb-8">
          <div>
            <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-rex-violet"><Route className="size-3.5" /> Repeatable recipes</p>
            <h3 className="mt-3 text-4xl font-black tracking-[-.06em] sm:text-6xl">DON&apos;T STOP AT ONE TOOL.</h3>
          </div>
          <p className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-white/35 md:block">Follow a proven sequence. Pin the one you use most and it will be waiting next time.</p>
        </div>

        <div>
          {workflows.map((workflow) => (
            <article key={workflow.id} className={`group grid border-b border-white/15 py-7 transition-colors lg:grid-cols-[80px_1fr_1.1fr_auto] lg:items-center lg:gap-7 ${pinned === workflow.id ? "text-black " + workflow.color : "hover:bg-white/[.035]"}`}>
              <span className="px-2 font-mono text-[9px] font-bold opacity-40">/{workflow.number}</span>
              <div className="px-2">
                <h4 className="mt-2 text-3xl font-black tracking-[-.055em] lg:mt-0">{workflow.title}</h4>
                <p className="mt-2 max-w-md text-xs font-semibold leading-relaxed opacity-45">{workflow.copy}</p>
              </div>
              <ol className="mt-5 flex flex-wrap items-center gap-2 px-2 lg:mt-0">
                {workflow.slugs.map((slug, index) => {
                  const tool = tools.find((item) => item.slug === slug);
                  return tool ? (
                    <li key={slug} className="flex items-center gap-2">
                      {index > 0 && <ArrowUpRight className="size-3 rotate-45 opacity-30" />}
                      <Link href={`/tools/${slug}`} className="rounded-full border border-current/20 px-3 py-2 text-[10px] font-black transition-colors hover:bg-black hover:text-white">{tool.title}</Link>
                    </li>
                  ) : null;
                })}
              </ol>
              <button
                type="button"
                onClick={() => pinWorkflow(workflow.id)}
                aria-pressed={pinned === workflow.id}
                className="mx-2 mt-5 flex h-10 items-center justify-center gap-2 rounded-full border border-current/20 px-4 text-[9px] font-black uppercase tracking-[.12em] lg:mt-0"
              >
                <Pin className={`size-3.5 ${pinned === workflow.id ? "fill-current" : ""}`} /> {pinned === workflow.id ? "Pinned" : "Pin"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
