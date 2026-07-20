"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, OutputField } from "@/components/tools/_shared";
import { loadCDN, esm, loadScript, waitForGlobal } from "@/lib/cdn";

export function FilePicker({ files, onFiles, accept, multiple = true }: { files: File[]; onFiles: (f: File[]) => void; accept: string; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-white/30">
        <UploadCloud className="size-8 text-muted-foreground" />
        <span className="text-sm font-medium">Drop files here or click to browse</span>
        <input ref={ref} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => { const arr = Array.from(e.target.files || []); onFiles(multiple ? [...files, ...arr] : arr.slice(0, 1)); }} />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">{files.map((f, i) => (
          <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-2 text-sm"><span className="flex-1 truncate">{f.name}</span><span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span><button onClick={() => onFiles(files.filter((_, idx) => idx !== i))} aria-label="Remove"><X className="size-4 text-muted-foreground hover:text-red-400" /></button></li>
        ))}</ul>
      )}
    </div>
  );
}

function Busy({ msg }: { msg: string }) { return <p className="flex items-center justify-center gap-2 rounded-md bg-accent/10 px-3 py-2 text-sm text-accent"><Loader2 className="size-4 animate-spin" />{msg}</p>; }

let ffmpegPromise: Promise<{ ffmpeg: any; fetchFile: any }> | null = null;
async function loadFFmpeg(): Promise<{ ffmpeg: any; fetchFile: any }> {
  if (ffmpegPromise) return ffmpegPromise;
  ffmpegPromise = (async () => {
    await loadScript("https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js");
    await loadScript("https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js");
    const FFmpegWASM: any = await waitForGlobal("FFmpegWASM");
    const FFmpegUtil: any = await waitForGlobal("FFmpegUtil");
    const { FFmpeg } = FFmpegWASM;
    const { fetchFile, toBlobURL } = FFmpegUtil;
    const ffmpeg = new FFmpeg();
    const ffmpegBase = "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd";
    const coreBase = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      classWorkerURL: await toBlobURL(`${ffmpegBase}/814.ffmpeg.js`, "text/javascript"),
      coreURL: await toBlobURL(`${coreBase}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${coreBase}/ffmpeg-core.wasm`, "application/wasm"),
    });
    return { ffmpeg, fetchFile };
  })();
  return ffmpegPromise;
}

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  async function merge() {
    if (files.length < 2) return;
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await loadCDN(esm("pdf-lib", "1.17.1"));
      const out = await PDFDocument.create();
      for (const f of files) { const src = await PDFDocument.load(await f.arrayBuffer()); const pages = await out.copyPages(src, src.getPageIndices()); pages.forEach((p: any) => out.addPage(p)); }
      const bytes = await out.save();
      setUrl(URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" })));
    } catch (e) { setErr("Merge failed: " + (e instanceof Error ? e.message : "unknown")); } finally { setBusy(false); }
  }
  return (<div className="space-y-4"><FilePicker files={files} onFiles={(f) => { setFiles(f); setUrl(""); }} accept="application/pdf" />{busy && <Busy msg="Merging PDFs…" />}{err && <p className="text-sm text-red-400">{err}</p>}{files.length >= 2 && !busy && <Button variant="gradient" className="w-full" onClick={merge}>Merge {files.length} PDFs</Button>}{url && <Button asChild variant="outline" className="w-full"><a href={url} download="merged.pdf"><Download className="size-4" />Download merged.pdf</a></Button>}<p className="text-xs text-muted-foreground">Combined locally via pdf-lib. First use loads it from CDN.</p></div>);
}

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [urls, setUrls] = useState<{ name: string; url: string }[]>([]);
  const [err, setErr] = useState("");
  async function split() {
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await loadCDN(esm("pdf-lib", "1.17.1"));
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out: { name: string; url: string }[] = [];
      for (let i = 0; i < src.getPageCount(); i++) { const doc = await PDFDocument.create(); const [page] = await doc.copyPages(src, [i]); doc.addPage(page); const bytes = await doc.save(); out.push({ name: `${file.name.replace(/\.pdf$/i, "")}-page-${i + 1}.pdf`, url: URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" })) }); }
      setUrls(out);
    } catch (e) { setErr("Split failed."); } finally { setBusy(false); }
  }
  return (<div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(f) => { setFile(f[0] || null); setUrls([]); }} accept="application/pdf" multiple={false} />{busy && <Busy msg="Splitting…" />}{err && <p className="text-sm text-red-400">{err}</p>}{file && !busy && <Button variant="gradient" className="w-full" onClick={split}>Split into pages</Button>}{urls.length > 0 && <div className="space-y-2">{urls.map(u => <Button key={u.name} asChild variant="outline" className="w-full justify-start"><a href={u.url} download={u.name}><Download className="size-4" />{u.name}</a></Button>)}</div>}</div>);
}

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  async function stamp() {
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const lib = await loadCDN(esm("pdf-lib", "1.17.1"));
      const doc = await lib.PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(lib.StandardFonts.HelveticaBold);
      for (const page of doc.getPages()) { const { width, height } = page.getSize(); const size = 48; const w = font.widthOfTextAtSize(text, size); page.drawText(text, { x: width / 2 - w / 2, y: height / 2, size, font, color: lib.rgb(0.5, 0.5, 0.5), opacity: 0.3, rotate: lib.degrees(45) }); }
      const bytes = await doc.save();
      setUrl(URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" })));
    } catch (e) { setErr("Watermark failed."); } finally { setBusy(false); }
  }
  return (<div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(f) => { setFile(f[0] || null); setUrl(""); }} accept="application/pdf" multiple={false} /><div className="space-y-1.5"><Label>Watermark text</Label><Input value={text} onChange={(e) => setText(e.target.value)} /></div>{busy && <Busy msg="Stamping…" />}{err && <p className="text-sm text-red-400">{err}</p>}{file && !busy && <Button variant="gradient" className="w-full" onClick={stamp}>Add watermark</Button>}{url && <Button asChild variant="outline" className="w-full"><a href={url} download="watermarked.pdf"><Download className="size-4" />Download</a></Button>}</div>);
}

export function PdfExtractText() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  async function extract() {
    if (!file) return;
    setBusy(true); setText(""); setErr("");
    try {
      const pdfjs = await loadCDN(esm("pdfjs-dist", "4.7.76"));
      pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      let out = "";
      for (let i = 1; i <= doc.numPages; i++) { const page = await doc.getPage(i); const content = await page.getTextContent(); out += content.items.map((it: any) => it.str).join(" ") + "\n\n"; }
      setText(out.trim() || "(No selectable text — this may be a scanned PDF.)");
    } catch (e) { setErr("Extraction failed."); } finally { setBusy(false); }
  }
  return (<div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(f) => { setFile(f[0] || null); setText(""); }} accept="application/pdf" multiple={false} />{busy && <Busy msg="Extracting text…" />}{err && <p className="text-sm text-red-400">{err}</p>}{file && !busy && <Button variant="gradient" className="w-full" onClick={extract}>Extract text</Button>}{text && <OutputField value={text} rows={10} />}</div>);
}

export function MarkdownToHtml() {
  const [md, setMd] = useState("# Hello\n\nThis is **markdown**.\n\n- item 1\n- item 2");
  const [html, setHtml] = useState("");
  const [err, setErr] = useState("");
  async function go() {
    try { const marked = await loadCDN(esm("marked", "12.0.2")); setHtml(marked.parse(md)); setErr(""); }
    catch { setErr("Failed to load markdown parser."); }
  }
  useEffect(() => { go(); }, []);
  useEffect(() => { const t = setTimeout(go, 300); return () => clearTimeout(t); }, [md]);
  return (<div className="space-y-4"><Textarea rows={8} value={md} onChange={(e) => setMd(e.target.value)} className="font-mono" />{err && <p className="text-sm text-red-400">{err}</p>}<div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">HTML</span><CopyButton value={html} /></div><pre className="max-h-40 overflow-auto rounded-md border border-border bg-background/50 p-3 font-mono text-xs"><code>{html}</code></pre></div><div className="space-y-2"><span className="text-sm font-medium">Preview</span><div className="prose-invert max-w-none rounded-md border border-border bg-background/50 p-4 [&_a]:text-accent [&_a]:underline [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:my-2 [&_ul]:my-2" dangerouslySetInnerHTML={{ __html: html }} /></div></div>);
}

export function TextDiff() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [parts, setParts] = useState<any[]>([]);
  const [err, setErr] = useState("");
  async function go() {
    try { const Diff = await loadCDN(esm("diff", "5.2.0")); setParts(Diff.diffLines(a, b)); setErr(""); }
    catch { setErr("Failed to load diff engine."); }
  }
  useEffect(() => { if (a || b) go(); }, [a, b]);
  const added = parts.filter((p) => p.added).reduce((n, p) => n + p.value.split("\n").filter(Boolean).length, 0);
  const removed = parts.filter((p) => p.removed).reduce((n, p) => n + p.value.split("\n").filter(Boolean).length, 0);
  return (<div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label>Original</Label><Textarea rows={6} value={a} onChange={(e) => setA(e.target.value)} /></div><div className="space-y-1.5"><Label>Changed</Label><Textarea rows={6} value={b} onChange={(e) => setB(e.target.value)} /></div></div>{err && <p className="text-sm text-red-400">{err}</p>}{parts.length > 0 && <p className="text-sm text-muted-foreground"><span className="text-emerald-400">+{added}</span> · <span className="text-red-400">−{removed}</span></p>}<div className="rounded-md border border-border bg-background/50 p-3 font-mono text-sm">{parts.map((p, i) => <span key={i} className={p.added ? "bg-emerald-500/20 text-emerald-300" : p.removed ? "bg-red-500/20 text-red-300 line-through opacity-70" : ""}>{p.value}</span>)}</div></div>);
}

export function HeicToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function go() {
    if (!file) return;
    setBusy(true); setErr("");
    try { const heic2any = await loadCDN(esm("heic2any", "0.0.4")); const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 }); setUrl(URL.createObjectURL(Array.isArray(blob) ? blob[0] : blob)); }
    catch { setErr("Not a valid HEIC file."); } finally { setBusy(false); }
  }
  return (<div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(f) => { setFile(f[0] || null); setUrl(""); }} accept="image/heic,image/heif,.heic,.heif" multiple={false} />{busy && <Busy msg="Converting HEIC…" />}{err && <p className="text-sm text-red-400">{err}</p>}{file && !busy && <Button variant="gradient" className="w-full" onClick={go}>Convert to JPG</Button>}{url && <div className="space-y-2"><div className="flex justify-center rounded-lg bg-white p-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={url} alt="result" className="max-h-64 object-contain" /></div><Button asChild variant="outline" className="w-full"><a href={url} download="converted.jpg"><Download className="size-4" />Download</a></Button></div>}</div>);
}

function FFmpegTool({ inputAccept, outputExt, outputMime, ffmpegArgs, outputName, ffmpegLabel }: { inputAccept: string; outputExt: string; outputMime: string; ffmpegArgs: (inName: string, outName: string) => string[]; outputName: string; ffmpegLabel: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [err, setErr] = useState("");
  async function go() {
    if (!file) return;
    setBusy(true); setErr(""); setProgress(0); setUrl(""); setStage("Loading ffmpeg engine (~30MB first use)…");
    try {
      const { ffmpeg, fetchFile } = await loadFFmpeg();
      const inName = "in" + (file.name.match(/\.[^.]+$/)?.[0] || ".mp4");
      const outName = "out." + outputExt;
      const onProg = ({ progress: p }: any) => { if (p && p > 0) setProgress(Math.round(p * 100)); setStage("Processing…"); };
      ffmpeg.on("progress", onProg);
      await ffmpeg.writeFile(inName, await fetchFile(file));
      await ffmpeg.exec(ffmpegArgs(inName, outName));
      ffmpeg.off("progress", onProg);
      const data = await ffmpeg.readFile(outName);
      setUrl(URL.createObjectURL(new Blob([data as BlobPart], { type: outputMime })));
    } catch (e) {
      setErr("Processing failed: " + (e instanceof Error ? e.message : "unknown") + ". The ffmpeg engine (~30MB) loads on first use — check your connection and try again.");
    } finally { setBusy(false); setStage(""); }
  }
  return (<div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(f) => { setFile(f[0] || null); setUrl(""); }} accept={inputAccept} multiple={false} />{busy && <div className="space-y-1"><Busy msg={stage || "Working…"} />{progress > 0 && <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-gradient-accent transition-all" style={{ width: `${progress}%` }} /></div>}</div>}{err && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">{err}</p>}{file && !busy && <Button variant="gradient" className="w-full" onClick={go}>{ffmpegLabel}</Button>}{url && <div className="space-y-2">{outputMime.startsWith("video") ? <video src={url} controls className="w-full rounded-md border border-border" /> : outputMime.startsWith("audio") ? <audio src={url} controls className="w-full" /> : <div className="flex justify-center rounded-lg bg-white p-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={url} alt="result" className="max-h-64 object-contain" /></div>}<Button asChild variant="outline" className="w-full"><a href={url} download={outputName}><Download className="size-4" />Download {outputName}</a></Button></div>}<p className="text-xs text-muted-foreground">First use downloads the ffmpeg engine (~30MB) and caches it. All processing happens locally in your browser — nothing is uploaded.</p></div>);
}

export const AudioConverter = () => <FFmpegTool inputAccept="audio/*" outputExt="mp3" outputMime="audio/mpeg" outputName="converted.mp3" ffmpegLabel="Convert to MP3" ffmpegArgs={(i, o) => ["-i", i, "-codec:a", "libmp3lame", "-qscale:a", "2", o]} />;
export const AudioTrimmer = () => <FFmpegTool inputAccept="audio/*" outputExt="mp3" outputMime="audio/mpeg" outputName="trimmed.mp3" ffmpegLabel="Trim first 30s" ffmpegArgs={(i, o) => ["-i", i, "-t", "30", "-codec:a", "libmp3lame", o]} />;
export const VideoConverter = () => <FFmpegTool inputAccept="video/*" outputExt="mp4" outputMime="video/mp4" outputName="converted.mp4" ffmpegLabel="Convert to MP4" ffmpegArgs={(i, o) => ["-i", i, "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", o]} />;
export const VideoCompressor = () => <FFmpegTool inputAccept="video/*" outputExt="mp4" outputMime="video/mp4" outputName="compressed.mp4" ffmpegLabel="Compress video" ffmpegArgs={(i, o) => ["-i", i, "-c:v", "libx264", "-preset", "veryfast", "-crf", "30", "-c:a", "aac", "-b:a", "96k", o]} />;
export const VideoMute = () => <FFmpegTool inputAccept="video/*" outputExt="mp4" outputMime="video/mp4" outputName="muted.mp4" ffmpegLabel="Mute audio" ffmpegArgs={(i, o) => ["-i", i, "-c", "copy", "-an", o]} />;
export const VideoToAudio = () => <FFmpegTool inputAccept="video/*" outputExt="mp3" outputMime="audio/mpeg" outputName="audio.mp3" ffmpegLabel="Extract audio" ffmpegArgs={(i, o) => ["-i", i, "-codec:a", "libmp3lame", "-qscale:a", "2", o]} />;
export const VideoToGif = () => <FFmpegTool inputAccept="video/*" outputExt="gif" outputMime="image/gif" outputName="animation.gif" ffmpegLabel="Create GIF" ffmpegArgs={(i, o) => ["-i", i, "-vf", "fps=10,scale=480:-1", o]} />;
export const AudioReverse = () => <FFmpegTool inputAccept="audio/*" outputExt="mp3" outputMime="audio/mpeg" outputName="reversed.mp3" ffmpegLabel="Reverse audio" ffmpegArgs={(i, o) => ["-i", i, "-map", "0:a", "-af", "areverse", "-codec:a", "libmp3lame", o]} />;

async function aiGenerate(systemTask: string, userInput: string, signal?: AbortSignal): Promise<string> {
  const fullPrompt = `${systemTask}\n\n--- INPUT ---\n${userInput}\n\n--- OUTPUT ---`;
  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: "You are a helpful writing assistant. Be concise and follow instructions exactly." },
          { role: "user", content: fullPrompt },
        ],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const txt = data?.choices?.[0]?.message?.content;
      if (txt) return txt.trim();
    }
  } catch { /* fall through to GET */ }
  const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`, { signal });
  const txt = await res.text();
  return txt.trim();
}

function AITextWriter({ task, placeholder, label }: { task: string; placeholder: string; label: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  async function run() {
    if (!input.trim()) return;
    setBusy(true); setErr(""); setOutput("");
    const ac = new AbortController(); abortRef.current = ac;
    try {
      const out = await aiGenerate(task, input, ac.signal);
      setOutput(out || "(no output)");
    } catch (e) {
      setErr("The AI service didn't respond. Please try again in a moment. (" + (e instanceof Error ? e.message : "network") + ")");
    } finally { setBusy(false); abortRef.current = null; }
  }
  return (<div className="space-y-4"><Textarea rows={6} value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} /><Button variant="gradient" onClick={run} disabled={busy || !input.trim()}>{busy ? "Generating…" : label}</Button>{busy && <Busy msg="Thinking…" />}{err && <p className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-400">{err}</p>}{output && <OutputField value={output} rows={8} />}<p className="text-xs text-muted-foreground">Powered by a free cloud AI (GPT-OSS). Works on every device. Your text is sent to generate a response but is not stored.</p></div>);
}

export const AiTextRewriter = () => <AITextWriter task="Rewrite the following text clearly and naturally. Keep the meaning but improve flow." placeholder="Paste text to rewrite…" label="Rewrite" />;
export const AiParaphraser = () => <AITextWriter task="Paraphrase the following text, keeping the meaning but using different wording." placeholder="Paste text to paraphrase…" label="Paraphrase" />;
export const AiGrammarChecker = () => <AITextWriter task="Fix grammar and spelling in the following text. Output ONLY the corrected version, nothing else." placeholder="Paste text to check…" label="Fix grammar" />;
export const AiEmailWriter = () => <AITextWriter task="Write a professional, friendly email based on these notes. Start with a subject line." placeholder="e.g. meeting Tuesday, need Q3 report, polite reminder" label="Write email" />;
export const AiHeadlineGenerator = () => <AITextWriter task="Generate 5 catchy headlines for this topic, one per line, numbered 1-5." placeholder="Describe your topic or content…" label="Generate headlines" />;
export const AiTranslator = () => <AITextWriter task="Translate the following text. Detect the language and translate to English unless the text specifies another target language." placeholder="Paste text to translate…" label="Translate" />;
