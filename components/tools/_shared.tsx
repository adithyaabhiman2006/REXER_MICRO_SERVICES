"use client";
import { useRef, useState } from "react";
import { Check, Copy, Download, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** A "copy to clipboard" button that shows a check on success. */
export function CopyButton({ value, className, label }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { if (!value) return; try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }
  return (
    <button type="button" onClick={copy} disabled={!value} aria-label={label ?? "Copy to clipboard"}
      className={cn("inline-flex items-center gap-1.5 rounded-md border border-border bg-card/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground disabled:opacity-40", className)}>
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}{label ?? (copied ? "Copied" : "Copy")}
    </button>
  );
}

/** A read-only output field with a copy button. */
export function OutputField({ value, mono = true, rows = 4 }: { value: string; mono?: boolean; rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><span className="text-sm font-medium text-foreground">Output</span><CopyButton value={value} /></div>
      <textarea readOnly rows={rows} value={value} onFocus={(e) => e.currentTarget.select()} className={cn("w-full resize-y rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-foreground", mono && "font-mono")} />
    </div>
  );
}

/** Shared drag/drop file input used by canvas image tools. */
export function ImageDropZone({ onFile, file }: { onFile: (f: File | null) => void; file: File | null }) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div>
      {file ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-2 text-sm"><span className="flex-1 truncate">{file.name}</span><button onClick={() => onFile(null as any)} aria-label="Remove" className="text-muted-foreground hover:text-red-400"><X className="size-4" /></button></div>
      ) : (
        <div role="button" tabIndex={0} onClick={() => ref.current?.click()} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
          className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors", over ? "border-accent bg-accent/5" : "border-border hover:border-white/30")}>
          <UploadCloud className="size-8 text-muted-foreground" /><p className="text-sm font-medium">Drop an image here, or click to browse</p>
          <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </div>
      )}
    </div>
  );
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => { const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { URL.revokeObjectURL(url); resolve(img); }; img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not load image")); }; img.src = url; });
}

export function ResultImage({ url, filename }: { url: string; filename: string }) {
  if (!url) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center rounded-lg bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Result preview" className="max-h-64 object-contain" />
      </div>
      <a href={url} download={filename} className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-gradient-accent px-3 py-2 text-sm font-medium text-white"><Download className="size-4" />Download {filename}</a>
    </div>
  );
}
