"use client";

import { useCallback, useRef, useState } from "react";
import { Download, ImageIcon, Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type OutFormat = "image/jpeg" | "image/png" | "image/webp";

const FORMAT_LABEL: Record<OutFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

const FORMAT_EXT: Record<OutFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

interface ConvertedImage {
  name: string;
  url: string;
  size: number;
}

const ACCEPTED =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/heic,image/heif,.heic,.heif";

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<OutFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.heic$/i.test(f.name));
    setFiles((prev) => [...prev, ...arr]);
    setResults([]);
    setError(null);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  /** Decode a File into an HTMLImageElement, handling HEIC via heic2any. */
  async function fileToImage(file: File): Promise<HTMLImageElement> {
    const isHeic =
      /image\/hei[c f]/i.test(file.type) || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);

    let blobToDecode: Blob = file;
    if (isHeic) {
      // Lazy-load heic2any only when needed (keeps the main bundle light).
      const heic2any = (await import("heic2any")).default;
      const converted = (await heic2any({ blob: file, toType: "image/png", quality })) as Blob;
      blobToDecode = Array.isArray(converted) ? converted[0] : converted;
    }

    const url = URL.createObjectURL(blobToDecode);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Could not decode image."));
        el.src = url;
      });
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function convert() {
    if (!files.length) return;
    setBusy(true);
    setError(null);
    setResults([]);
    try {
      const out: ConvertedImage[] = [];
      for (const file of files) {
        const img = await fileToImage(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported.");
        // White background for JPG (no alpha).
        if (format === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, format, format === "image/png" ? undefined : quality),
        );
        if (!blob) throw new Error(`Conversion failed for ${file.name}.`);

        const baseName = file.name.replace(/\.[^.]+$/, "");
        out.push({
          name: `${baseName}.${FORMAT_EXT[format]}`,
          url: URL.createObjectURL(blob),
          size: blob.size,
        });
      }
      setResults(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        aria-label="Upload images by clicking or dropping files"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          dragOver ? "border-accent bg-accent/5" : "border-border hover:border-white/30 hover:bg-card/40",
        )}
      >
        <UploadCloud className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">Drop images here, or click to browse</p>
        <p className="text-xs text-muted-foreground">PNG · JPG · WebP · GIF · BMP · HEIC</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="glass flex items-center gap-2 rounded-md px-3 py-2 text-sm">
              <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${f.name}`}
                className="rounded p-1 text-muted-foreground hover:bg-accent/10 hover:text-accent"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Options */}
      {files.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Convert to</Label>
            <div className="flex gap-2">
              {(Object.keys(FORMAT_LABEL) as OutFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  aria-pressed={format === f}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    format === f
                      ? "border-transparent bg-gradient-accent text-white"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {FORMAT_LABEL[f]}
                </button>
              ))}
            </div>
          </div>
          {format !== "image/png" && (
            <div className="space-y-2">
              <Label htmlFor="img-quality">Quality: {Math.round(quality * 100)}%</Label>
              <input
                id="img-quality"
                type="range"
                min={0.3}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[hsl(var(--ring))]"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      )}

      <Button onClick={convert} disabled={!files.length || busy} size="lg" variant="gradient" className="w-full">
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Converting…
          </>
        ) : (
          <>Convert {files.length > 0 && `(${files.length})`}</>
        )}
      </Button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Converted files</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {results.map((r) => (
              <a
                key={r.name}
                href={r.url}
                download={r.name}
                className="glass group flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:border-white/20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.url}
                  alt={r.name}
                  className="max-h-28 w-full rounded object-contain"
                />
                <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                  <Download className="size-3.5 text-accent" />
                  <span className="truncate">{r.name}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">{(r.size / 1024).toFixed(0)} KB</span>
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Click any image to download. All processing happened locally in your browser.
          </p>
        </div>
      )}
    </div>
  );
}
