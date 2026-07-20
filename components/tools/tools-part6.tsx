"use client";
/* eslint-disable @next/next/no-img-element -- user-selected and generated blob previews */

import { useMemo, useRef, useState } from "react";
import { Download, ExternalLink, FileJson, Loader2, Mic, Square } from "lucide-react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

import { CopyButton, OutputField } from "@/components/tools/_shared";
import { FilePicker } from "@/components/tools/tools-part5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const downloadBlob = (bytes: BlobPart, type: string, name: string) => {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

export function SocialMediaAssistant({ platform }: { platform: "TikTok / Instagram" | "YouTube Shorts" }) {
  const [value, setValue] = useState("");
  const parsed = useMemo(() => {
    try {
      const url = new URL(value.trim());
      const allowed = platform === "YouTube Shorts"
        ? ["youtube.com", "www.youtube.com", "youtu.be"]
        : ["tiktok.com", "www.tiktok.com", "instagram.com", "www.instagram.com"];
      return allowed.includes(url.hostname) ? url : null;
    } catch { return null; }
  }, [platform, value]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5"><Label>Public {platform} URL</Label><Input type="url" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Paste the original post URL" /></div>
      {value && !parsed && <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300">Enter a valid {platform} link.</p>}
      <Button asChild variant="gradient" className="w-full" disabled={!parsed}>
        <a href={parsed?.href ?? "#"} target="_blank" rel="noreferrer"><ExternalLink className="size-4" />Open original post</a>
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">Rexer does not proxy, scrape, or bypass protected media. Use the platform’s built-in download control when the creator has enabled it, and only save media you own or have permission to use.</p>
    </div>
  );
}

export function Base64ToImage() {
  const [value, setValue] = useState("");
  const src = value.trim().startsWith("data:image/") ? value.trim() : value.trim() ? `data:image/png;base64,${value.trim()}` : "";
  return <div className="space-y-4"><Textarea rows={8} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Paste an image data URI or raw Base64…" className="font-mono text-xs" />{src && <div className="space-y-3 rounded-xl border border-border bg-black/20 p-4"><img src={src} alt="Decoded preview" className="mx-auto max-h-72 max-w-full rounded-lg object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} /><Button asChild variant="outline" className="w-full"><a href={src} download="decoded-image.png"><Download className="size-4" />Download image</a></Button></div>}</div>;
}

async function fileImage(file: File) {
  const bitmap = await createImageBitmap(file);
  return bitmap;
}

export function ImageGridTool({ mode }: { mode: "collage" | "combine" | "split" }) {
  const [files, setFiles] = useState<File[]>([]); const [busy, setBusy] = useState(false); const [result, setResult] = useState("");
  async function run() {
    if (!files.length) return; setBusy(true);
    try {
      const images = await Promise.all(files.map(fileImage));
      if (mode === "split") {
        const image = images[0]; const width = Math.floor(image.width / 2); const height = Math.floor(image.height / 2);
        for (let row = 0; row < 2; row++) for (let column = 0; column < 2; column++) { const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; canvas.getContext("2d")?.drawImage(image, column * width, row * height, width, height, 0, 0, width, height); const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")); if (blob) downloadBlob(blob, "image/png", `tile-${row + 1}-${column + 1}.png`); }
        return;
      }
      const cellWidth = Math.max(...images.map((image) => image.width)); const cellHeight = Math.max(...images.map((image) => image.height)); const columns = mode === "collage" ? Math.ceil(Math.sqrt(images.length)) : images.length; const rows = mode === "collage" ? Math.ceil(images.length / columns) : 1;
      const canvas = document.createElement("canvas"); canvas.width = cellWidth * columns; canvas.height = cellHeight * rows; const context = canvas.getContext("2d")!; context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height);
      images.forEach((image, index) => { const column = index % columns; const row = Math.floor(index / columns); const scale = Math.min(cellWidth / image.width, cellHeight / image.height); const width = image.width * scale; const height = image.height * scale; context.drawImage(image, column * cellWidth + (cellWidth - width) / 2, row * cellHeight + (cellHeight - height) / 2, width, height); });
      canvas.toBlob((blob) => { if (!blob) return; if (result) URL.revokeObjectURL(result); setResult(URL.createObjectURL(blob)); }, "image/png");
    } finally { setBusy(false); }
  }
  const split = mode === "split";
  return <div className="space-y-4"><FilePicker files={files} onFiles={setFiles} accept="image/*" multiple={!split} /><Button variant="gradient" className="w-full" onClick={run} disabled={!files.length || busy}>{busy ? "Processing…" : split ? "Download four tiles" : mode === "collage" ? "Create collage" : "Combine horizontally"}</Button>{result && <div className="space-y-2"><img src={result} alt="Combined result" className="max-h-80 w-full rounded-lg bg-white object-contain" /><Button asChild variant="outline" className="w-full"><a href={result} download={`${mode}.png`}><Download className="size-4" />Download PNG</a></Button></div>}<p className="text-xs text-muted-foreground">Canvas processing stays on this device. Images are fitted without cropping.</p></div>;
}

export function CurlToCode() {
  const [curl, setCurl] = useState("curl -X POST https://api.example.com/items -H \"Content-Type: application/json\" -d '{\"name\":\"Rexer\"}'");
  const output = useMemo(() => {
    const url = curl.match(/https?:\/\/[^\s'\"]+/)?.[0] ?? "https://api.example.com";
    const method = curl.match(/(?:-X|--request)\s+(\w+)/i)?.[1]?.toUpperCase() ?? "GET";
    const body = curl.match(/(?:-d|--data(?:-raw)?)\s+(['\"])([\s\S]*?)\1/)?.[2];
    return `const response = await fetch(${JSON.stringify(url)}, {\n  method: ${JSON.stringify(method)},${body ? `\n  headers: { \"Content-Type\": \"application/json\" },\n  body: JSON.stringify(${body}),` : ""}\n});\n\nconst data = await response.json();`;
  }, [curl]);
  return <div className="space-y-4"><Textarea rows={6} value={curl} onChange={(event) => setCurl(event.target.value)} className="font-mono text-xs" /><OutputField value={output} rows={9} /></div>;
}

function inferZod(value: unknown, depth = 0): string {
  if (value === null) return "z.null()";
  if (Array.isArray(value)) return `z.array(${value.length ? inferZod(value[0], depth + 1) : "z.unknown()"})`;
  if (typeof value === "string") return "z.string()";
  if (typeof value === "number") return "z.number()";
  if (typeof value === "boolean") return "z.boolean()";
  if (typeof value === "object") {
    const indent = "  ".repeat(depth + 1);
    const entries = Object.entries(value).map(([key, item]) => `${indent}${JSON.stringify(key)}: ${inferZod(item, depth + 1)}`);
    return `z.object({\n${entries.join(",\n")}\n${"  ".repeat(depth)}})`;
  }
  return "z.unknown()";
}

export function JsonToZod() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "Rexer",\n  "active": true\n}');
  let output = ""; let error = "";
  try { output = `import { z } from \"zod\";\n\nexport const Schema = ${inferZod(JSON.parse(input))};`; } catch { error = "Enter valid JSON to generate a schema."; }
  return <div className="space-y-4"><Textarea rows={8} value={input} onChange={(event) => setInput(event.target.value)} className="font-mono text-xs" />{error ? <p className="text-sm text-red-400">{error}</p> : <OutputField value={output} rows={10} />}</div>;
}

export function JsonLinesViewer() {
  const [input, setInput] = useState('{"event":"start","ok":true}\n{"event":"finish","duration":42}');
  const rows = input.split(/\r?\n/).filter(Boolean).map((line, index) => { try { return { index, value: JSON.stringify(JSON.parse(line), null, 2), valid: true }; } catch { return { index, value: line, valid: false }; } });
  return <div className="space-y-4"><Textarea rows={7} value={input} onChange={(event) => setInput(event.target.value)} className="font-mono text-xs" /><div className="space-y-2">{rows.map((row) => <details key={row.index} className="rounded-lg border border-border bg-background/40 p-3" open={row.index < 3}><summary className="cursor-pointer text-sm"><span className={row.valid ? "text-emerald-400" : "text-red-400"}>Line {row.index + 1} · {row.valid ? "valid" : "invalid"}</span></summary><pre className="mt-2 overflow-auto text-xs text-muted-foreground">{row.value}</pre></details>)}</div></div>;
}

function inferJsonSchema(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) return { type: "array", items: value.length ? inferJsonSchema(value[0]) : {} };
  if (value === null) return { type: "null" };
  if (typeof value === "object") return { type: "object", properties: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, inferJsonSchema(item)])), required: Object.keys(value), additionalProperties: false };
  return { type: typeof value === "number" && Number.isInteger(value) ? "integer" : typeof value };
}

export function JsonSchemaBuilder() {
  const [input, setInput] = useState('{"name":"Rexer","tools":200}');
  let output = ""; try { output = JSON.stringify({ $schema: "https://json-schema.org/draft/2020-12/schema", ...inferJsonSchema(JSON.parse(input)) }, null, 2); } catch {}
  return <div className="space-y-4"><Textarea rows={7} value={input} onChange={(event) => setInput(event.target.value)} className="font-mono text-xs" />{output ? <OutputField value={output} rows={12} /> : <p className="text-sm text-red-400">Enter valid sample JSON.</p>}</div>;
}

export function SocialPreviewChecker() {
  const [title, setTitle] = useState("Build faster with Rexer"); const [description, setDescription] = useState("A privacy-first studio of useful browser tools."); const [image, setImage] = useState("");
  return <div className="space-y-4"><Input value={title} maxLength={70} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" /><Textarea rows={3} value={description} maxLength={200} onChange={(e) => setDescription(e.target.value)} placeholder="Description" /><Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Preview image URL (optional)" /><div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">{image ? <img src={image} alt="Social preview" className="aspect-[1.91/1] w-full object-cover" /> : <div className="flex aspect-[1.91/1] items-center justify-center bg-gradient-to-br from-blue-700/30 to-cyan-400/20 text-4xl font-bold text-gradient-accent">REXER</div>}<div className="space-y-1 p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">example.com</p><h3 className="font-semibold">{title || "Untitled page"}</h3><p className="line-clamp-2 text-sm text-muted-foreground">{description}</p></div></div></div>;
}

type PdfMode = "compress" | "sign" | "header-footer" | "resize" | "unlock" | "form";
export function PdfWorkshop({ mode }: { mode: PdfMode }) {
  const [file, setFile] = useState<File | null>(null); const [text, setText] = useState(mode === "sign" ? "Your signature" : "Rexer · {page}"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const label: Record<PdfMode, string> = { compress: "Optimize PDF", sign: "Sign PDF", "header-footer": "Add header & footer", resize: "Resize to A4", unlock: "Create unlocked copy", form: "Fill visible form fields" };
  async function run() {
    if (!file) return; setBusy(true); setError("");
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: mode === "unlock" });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      if (mode === "sign" || mode === "header-footer") doc.getPages().forEach((page, index) => { const { width, height } = page.getSize(); const shown = text.replace("{page}", String(index + 1)); page.drawText(shown, { x: mode === "sign" ? width - Math.min(220, width / 2) : 30, y: mode === "sign" ? 35 : height - 24, size: mode === "sign" ? 18 : 10, font, color: rgb(0.08, 0.35, 0.95), rotate: mode === "sign" ? degrees(-4) : undefined }); });
      if (mode === "resize") doc.getPages().forEach((page) => page.setSize(595.28, 841.89));
      if (mode === "form") { const form = doc.getForm(); form.getFields().forEach((field) => { if ("setText" in field && typeof field.setText === "function") field.setText(text); }); form.updateFieldAppearances(font); }
      const bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
      downloadBlob(bytes as BlobPart, "application/pdf", `${mode}.pdf`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "This PDF could not be processed."); } finally { setBusy(false); }
  }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(files) => setFile(files[0] ?? null)} accept="application/pdf" multiple={false} />{(["sign", "header-footer", "form"] as PdfMode[]).includes(mode) && <div className="space-y-1.5"><Label>{mode === "form" ? "Value for text fields" : "Text"}</Label><Input value={text} onChange={(event) => setText(event.target.value)} /></div>}{error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}<Button variant="gradient" className="w-full" onClick={run} disabled={!file || busy}>{busy ? <><Loader2 className="size-4 animate-spin" />Processing…</> : label[mode]}</Button><p className="text-xs text-muted-foreground">Processed locally with pdf-lib. “Optimize” rewrites PDF objects losslessly; image-heavy PDFs may only shrink slightly.</p></div>;
}

export function TextToPdf({ cv = false }: { cv?: boolean }) {
  const [title, setTitle] = useState(cv ? "Alex Morgan · Product Designer" : "My document"); const [body, setBody] = useState(cv ? "PROFILE\nDesigning useful products with clarity and care.\n\nEXPERIENCE\nLead Designer — Acme Studio (2022–present)\n\nSKILLS\nResearch · Prototyping · Design systems" : "Write or paste your document here.");
  async function generate() { const doc = await PDFDocument.create(); const font = await doc.embedFont(StandardFonts.Helvetica); const bold = await doc.embedFont(StandardFonts.HelveticaBold); let page = doc.addPage([595.28, 841.89]); let y = 790; page.drawText(title, { x: 48, y, size: 20, font: bold, color: rgb(0, .34, 1) }); y -= 38; const words = body.replace(/\r/g, "").split(/(\s+)/); let line = ""; const lines: string[] = []; for (const word of words) { if (font.widthOfTextAtSize(line + word, 11) > 495) { lines.push(line.trim()); line = word; } else line += word; } lines.push(line.trim()); for (const item of lines) { if (y < 48) { page = doc.addPage([595.28, 841.89]); y = 790; } page.drawText(item || " ", { x: 48, y, size: 11, font, color: rgb(.12, .15, .22) }); y -= item ? 17 : 10; } downloadBlob(await doc.save() as BlobPart, "application/pdf", cv ? "resume.pdf" : "document.pdf"); }
  return <div className="space-y-4"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" /><Textarea rows={14} value={body} onChange={(e) => setBody(e.target.value)} /><Button variant="gradient" className="w-full" onClick={generate}><Download className="size-4" />Export PDF</Button></div>;
}

export function QrScanner() {
  const [file, setFile] = useState<File | null>(null); const [result, setResult] = useState(""); const [error, setError] = useState("");
  async function scan() { if (!file) return; setError(""); try { const Detector = (window as any).BarcodeDetector; if (!Detector) throw new Error("QR scanning is not supported in this browser. Try current Chrome or Edge."); const bitmap = await createImageBitmap(file); const codes = await new Detector({ formats: ["qr_code"] }).detect(bitmap); setResult(codes[0]?.rawValue ?? "No QR code found."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not scan this image."); } }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(files) => setFile(files[0] ?? null)} accept="image/*" multiple={false} /><Button variant="gradient" className="w-full" onClick={scan} disabled={!file}>Scan QR code</Button>{error && <p className="text-sm text-amber-400">{error}</p>}{result && <OutputField value={result} />}</div>;
}

export function AiImageStudio({ style = "editorial" }: { style?: string }) {
  const [prompt, setPrompt] = useState(""); const [seed, setSeed] = useState(1); const [busy, setBusy] = useState(false); const [src, setSrc] = useState("");
  function generate() { if (!prompt.trim()) return; setBusy(true); const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${prompt}, ${style} style, polished, high detail`)}?width=1024&height=1024&seed=${seed}&nologo=true`; setSrc(url); setSeed((value) => value + 1); }
  return <div className="space-y-4"><Textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the image you want to create…" /><Button variant="gradient" className="w-full" onClick={generate} disabled={!prompt.trim() || busy}>{busy ? <><Loader2 className="size-4 animate-spin" />Creating…</> : "Generate image"}</Button>{src && <div className="overflow-hidden rounded-xl border border-border bg-black/20"><img src={src} alt="AI generated result" className="aspect-square w-full object-cover" onLoad={() => setBusy(false)} onError={() => setBusy(false)} /><div className="flex items-center justify-between gap-2 p-3"><span className="text-xs text-muted-foreground">Cloud-generated · review before use</span><Button asChild size="sm" variant="outline"><a href={src} target="_blank" rel="noreferrer"><ExternalLink className="size-4" />Open</a></Button></div></div>}<p className="text-xs text-muted-foreground">Your prompt is sent to Pollinations’ public generation service. Do not submit private data.</p></div>;
}

export function SpeechToText() {
  const [text, setText] = useState(""); const [listening, setListening] = useState(false); const recognition = useRef<any>(null);
  function toggle() { if (listening) { recognition.current?.stop(); return; } const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; if (!Recognition) { setText("Speech recognition is not available in this browser. Try current Chrome or Edge."); return; } const instance = new Recognition(); instance.continuous = true; instance.interimResults = true; instance.onresult = (event: any) => setText(Array.from(event.results).map((row: any) => row[0].transcript).join(" ")); instance.onend = () => setListening(false); recognition.current = instance; instance.start(); setListening(true); }
  return <div className="space-y-4"><Button variant={listening ? "outline" : "gradient"} className="w-full" onClick={toggle}>{listening ? <><Square className="size-4" />Stop listening</> : <><Mic className="size-4" />Start transcription</>}</Button><OutputField value={text} rows={10} /><p className="text-xs text-muted-foreground">Uses your browser’s speech recognition service; availability and data handling depend on the browser.</p></div>;
}

export function VoiceGenerator() {
  const [text, setText] = useState("Welcome to Rexer, your creative browser toolkit.");
  function speak() { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(text)); }
  return <div className="space-y-4"><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} /><div className="flex gap-2"><Button variant="gradient" className="flex-1" onClick={speak} disabled={!text.trim()}>Speak</Button><Button variant="outline" onClick={() => speechSynthesis.cancel()}>Stop</Button></div><p className="text-xs text-muted-foreground">Uses voices installed in your browser or operating system.</p></div>;
}

export function DataConverter({ label = "Chat export" }: { label?: string }) {
  const [input, setInput] = useState(""); const output = useMemo(() => { try { const parsed = JSON.parse(input); const rows = Array.isArray(parsed) ? parsed : [parsed]; return rows.map((row, i) => `${i + 1}. ${typeof row === "string" ? row : JSON.stringify(row)}`).join("\n"); } catch { return input.split(/\r?\n/).map((row, i) => `${i + 1}. ${row}`).join("\n"); } }, [input]);
  return <div className="space-y-4"><div className="flex items-center gap-2 text-sm font-medium"><FileJson className="size-4 text-accent" />{label}</div><Textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON or line-based data…" />{input && <><OutputField value={output} rows={10} /><CopyButton value={output} label="Copy normalized data" /></>}</div>;
}
