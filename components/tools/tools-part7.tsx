"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { Download, Loader2, Play, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { applyPalette, GIFEncoder, quantize } from "gifenc";
import * as exifr from "exifr";
import { Document, HeadingLevel, Packer, Paragraph } from "docx";

import { CopyButton, OutputField } from "@/components/tools/_shared";
import { FilePicker } from "@/components/tools/tools-part5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { esm, loadCDN } from "@/lib/cdn";

function saveBlob(value: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

async function bitmap(file: File) {
  return createImageBitmap(file);
}

export function GifMaker() {
  const [files, setFiles] = useState<File[]>([]);
  const [delay, setDelay] = useState(650);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function createGif() {
    if (files.length < 2) return;
    setBusy(true); setError("");
    try {
      const images = await Promise.all(files.map(bitmap));
      const width = Math.min(800, Math.max(...images.map((image) => image.width)));
      const height = Math.min(800, Math.max(...images.map((image) => image.height)));
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true })!;
      const encoder = GIFEncoder();
      for (const image of images) {
        context.fillStyle = "#ffffff"; context.fillRect(0, 0, width, height);
        const scale = Math.min(width / image.width, height / image.height);
        const drawWidth = image.width * scale; const drawHeight = image.height * scale;
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
        const data = context.getImageData(0, 0, width, height).data;
        const palette = quantize(data, 256);
        encoder.writeFrame(applyPalette(data, palette), width, height, { palette, delay });
      }
      encoder.finish();
      const blob = new Blob([encoder.bytes() as BlobPart], { type: "image/gif" });
      if (url) URL.revokeObjectURL(url);
      setUrl(URL.createObjectURL(blob));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "GIF encoding failed."); }
    finally { setBusy(false); }
  }

  return <div className="space-y-4"><FilePicker files={files} onFiles={setFiles} accept="image/*" /><div className="space-y-1.5"><Label>Frame duration · {delay} ms</Label><input type="range" min={100} max={2000} step={50} value={delay} onChange={(event) => setDelay(Number(event.target.value))} className="w-full accent-cyan-400" /></div><Button variant="gradient" className="w-full" disabled={files.length < 2 || busy} onClick={createGif}>{busy ? <><Loader2 className="size-4 animate-spin" />Encoding GIF…</> : `Create GIF from ${files.length} frames`}</Button>{error && <p className="text-sm text-red-400">{error}</p>}{url && <div className="space-y-2"><img src={url} alt="Animated GIF preview" className="mx-auto max-h-80 rounded-lg bg-white object-contain" /><Button asChild variant="outline" className="w-full"><a href={url} download="rexer-animation.gif"><Download className="size-4" />Download GIF</a></Button></div>}<p className="text-xs text-muted-foreground">Frames are scaled and encoded locally. Reorder files before selecting them if sequence matters.</p></div>;
}

export function ExifViewer() {
  const [file, setFile] = useState<File | null>(null); const [data, setData] = useState<Record<string, unknown> | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function inspect() { if (!file) return; setBusy(true); setError(""); try { const parsed = await exifr.parse(file, true); setData(parsed ?? { message: "No EXIF metadata found", name: file.name, type: file.type, bytes: file.size }); } catch (reason) { setError(reason instanceof Error ? reason.message : "Metadata could not be read."); } finally { setBusy(false); } }
  const output = data ? JSON.stringify(data, (_key, value) => value instanceof Date ? value.toISOString() : value, 2) : "";
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(items) => { setFile(items[0] ?? null); setData(null); }} accept="image/*" multiple={false} /><Button variant="gradient" className="w-full" disabled={!file || busy} onClick={inspect}>{busy ? "Reading metadata…" : "Inspect EXIF"}</Button>{error && <p className="text-sm text-red-400">{error}</p>}{output && <OutputField value={output} rows={16} />}<p className="text-xs text-muted-foreground">Camera and GPS metadata is parsed entirely in this browser.</p></div>;
}

export function ImageMetadataEditor() {
  const [file, setFile] = useState<File | null>(null); const [artist, setArtist] = useState(""); const [description, setDescription] = useState(""); const [copyright, setCopyright] = useState(""); const [error, setError] = useState("");
  async function write() {
    if (!file) return; setError("");
    try {
      const image = await bitmap(file); const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height; canvas.getContext("2d")!.drawImage(image, 0, 0);
      const jpeg = canvas.toDataURL("image/jpeg", .94);
      const piexifModule = await import("piexifjs"); const piexif: any = piexifModule.default ?? piexifModule;
      const zeroth: Record<number, string> = { [piexif.ImageIFD.Software]: "Rexer Micro Services" };
      if (artist.trim()) zeroth[piexif.ImageIFD.Artist] = artist.trim();
      if (description.trim()) zeroth[piexif.ImageIFD.ImageDescription] = description.trim();
      if (copyright.trim()) zeroth[piexif.ImageIFD.Copyright] = copyright.trim();
      const output = piexif.insert(piexif.dump({ "0th": zeroth, Exif: {}, GPS: {}, "1st": {}, thumbnail: null }), jpeg);
      const bytes = Uint8Array.from(atob(output.split(",")[1]), (character) => character.charCodeAt(0));
      saveBlob(bytes, "image/jpeg", "metadata-edited.jpg");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Metadata could not be written."); }
  }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(items) => setFile(items[0] ?? null)} accept="image/*" multiple={false} /><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label>Artist</Label><Input value={artist} onChange={(event) => setArtist(event.target.value)} /></div><div className="space-y-1.5"><Label>Copyright</Label><Input value={copyright} onChange={(event) => setCopyright(event.target.value)} /></div></div><div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></div><Button variant="gradient" className="w-full" onClick={write} disabled={!file}>Write metadata to JPEG</Button>{error && <p className="text-sm text-red-400">{error}</p>}<p className="text-xs text-muted-foreground">The output is re-encoded as JPEG and receives only the metadata entered above, removing hidden GPS/camera fields.</p></div>;
}

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function convert() {
    if (!file) return; setBusy(true); setError("");
    try {
      const pdfjs = await loadCDN(esm("pdfjs-dist", "4.7.76")); pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise; const children: Paragraph[] = [];
      for (let index = 1; index <= pdf.numPages; index++) { const page = await pdf.getPage(index); const content = await page.getTextContent(); const text = content.items.map((item: any) => item.str).join(" ").replace(/\s+/g, " ").trim(); children.push(new Paragraph({ text: `Page ${index}`, heading: HeadingLevel.HEADING_1 })); if (text) children.push(new Paragraph(text)); }
      const document = new Document({ sections: [{ children }] }); saveBlob(await Packer.toBlob(document), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", `${file.name.replace(/\.pdf$/i, "")}.docx`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "PDF conversion failed."); } finally { setBusy(false); }
  }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(items) => setFile(items[0] ?? null)} accept="application/pdf" multiple={false} /><Button variant="gradient" className="w-full" disabled={!file || busy} onClick={convert}>{busy ? <><Loader2 className="size-4 animate-spin" />Building DOCX…</> : "Convert to editable DOCX"}</Button>{error && <p className="text-sm text-red-400">{error}</p>}<p className="text-xs text-muted-foreground">Extracts selectable text into a real DOCX locally. Complex columns and scanned pages need OCR and may not preserve their original layout.</p></div>;
}

type SmartImageMode = "background" | "enhance" | "retouch" | "colorize" | "remove";
const smartLabels: Record<SmartImageMode, string> = { background: "Remove sampled background", enhance: "Enhance image", retouch: "Apply gentle retouch", colorize: "Create duotone color", remove: "Remove center object" };

export function SmartImageLab({ mode }: { mode: SmartImageMode }) {
  const [file, setFile] = useState<File | null>(null); const [strength, setStrength] = useState(35); const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false);
  async function run() {
    if (!file) return; setBusy(true);
    try {
      const image = await bitmap(file); const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height; const context = canvas.getContext("2d", { willReadFrequently: true })!;
      if (mode === "enhance") context.filter = `contrast(${110 + strength / 2}%) saturate(${110 + strength}%) brightness(103%)`;
      if (mode === "retouch") context.filter = `contrast(104%) saturate(108%) blur(${Math.max(.15, strength / 100)}px)`;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height); const data = pixels.data;
      if (mode === "background") { const sample = [data[0], data[1], data[2]]; const tolerance = 20 + strength * 1.8; for (let i = 0; i < data.length; i += 4) { const distance = Math.hypot(data[i] - sample[0], data[i + 1] - sample[1], data[i + 2] - sample[2]); if (distance < tolerance) data[i + 3] = Math.round(255 * distance / tolerance); } context.putImageData(pixels, 0, 0); }
      if (mode === "colorize") { for (let i = 0; i < data.length; i += 4) { const light = (data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722) / 255; data[i] = 15 + light * 30; data[i + 1] = 45 + light * 190; data[i + 2] = 105 + light * 145; } context.putImageData(pixels, 0, 0); }
      if (mode === "remove") { const width = Math.round(canvas.width * (.15 + strength / 400)); const height = Math.round(canvas.height * (.15 + strength / 400)); const x = Math.round((canvas.width - width) / 2); const y = Math.round((canvas.height - height) / 2); const sample = context.getImageData(Math.max(0, x - 4), Math.max(0, y - 4), 1, 1).data; context.fillStyle = `rgb(${sample[0]},${sample[1]},${sample[2]})`; context.fillRect(x, y, width, height); }
      canvas.toBlob((blob) => { if (!blob) return; if (url) URL.revokeObjectURL(url); setUrl(URL.createObjectURL(blob)); }, "image/png");
    } finally { setBusy(false); }
  }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(items) => { setFile(items[0] ?? null); setUrl(""); }} accept="image/*" multiple={false} /><div className="space-y-1.5"><Label>Effect strength · {strength}%</Label><input type="range" min={5} max={95} value={strength} onChange={(event) => setStrength(Number(event.target.value))} className="w-full accent-cyan-400" /></div><Button variant="gradient" className="w-full" disabled={!file || busy} onClick={run}>{busy ? "Processing locally…" : smartLabels[mode]}</Button>{url && <div className="space-y-2"><div className="rounded-lg bg-[linear-gradient(45deg,#bbb_25%,transparent_25%),linear-gradient(-45deg,#bbb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#bbb_75%),linear-gradient(-45deg,transparent_75%,#bbb_75%)] bg-[length:20px_20px] p-2"><img src={url} alt="Processed result" className="mx-auto max-h-80 object-contain" /></div><Button asChild variant="outline" className="w-full"><a href={url} download={`${mode}.png`}><Download className="size-4" />Download PNG</a></Button></div>}<p className="flex gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />This smart fallback uses deterministic Canvas processing locally. It does not upload your photo or pretend to use a remote AI model.</p></div>;
}

export function SmartVideoGenerator() {
  const [file, setFile] = useState<File | null>(null); const [caption, setCaption] = useState("Made with Rexer"); const [busy, setBusy] = useState(false); const [url, setUrl] = useState("");
  async function generate() {
    if (!file || !("MediaRecorder" in window)) return; setBusy(true);
    const image = await bitmap(file); const canvas = document.createElement("canvas"); canvas.width = 720; canvas.height = 720; const context = canvas.getContext("2d")!; const stream = canvas.captureStream(30); const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm" }); const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data); recorder.onstop = () => { if (url) URL.revokeObjectURL(url); setUrl(URL.createObjectURL(new Blob(chunks, { type: "video/webm" }))); setBusy(false); }; recorder.start(); const started = performance.now();
    const draw = (now: number) => { const progress = Math.min(1, (now - started) / 5000); context.fillStyle = "#020617"; context.fillRect(0, 0, 720, 720); const scale = Math.max(720 / image.width, 720 / image.height) * (1 + progress * .12); const width = image.width * scale; const height = image.height * scale; context.globalAlpha = .88; context.drawImage(image, (720 - width) / 2 - progress * 20, (720 - height) / 2, width, height); context.globalAlpha = 1; const gradient = context.createLinearGradient(0, 430, 0, 720); gradient.addColorStop(0, "transparent"); gradient.addColorStop(1, "rgba(2,6,23,.95)"); context.fillStyle = gradient; context.fillRect(0, 400, 720, 320); context.fillStyle = "white"; context.font = "600 42px system-ui"; context.textAlign = "center"; context.fillText(caption.slice(0, 34), 360, 635); if (progress < 1) requestAnimationFrame(draw); else recorder.stop(); }; requestAnimationFrame(draw);
  }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(items) => setFile(items[0] ?? null)} accept="image/*" multiple={false} /><div className="space-y-1.5"><Label>Video caption</Label><Input maxLength={34} value={caption} onChange={(event) => setCaption(event.target.value)} /></div><Button variant="gradient" className="w-full" onClick={generate} disabled={!file || busy}>{busy ? <><Loader2 className="size-4 animate-spin" />Rendering 5-second video…</> : <><Sparkles className="size-4" />Generate motion video</>}</Button>{url && <div className="space-y-2"><video src={url} controls loop className="w-full rounded-lg" /><Button asChild variant="outline" className="w-full"><a href={url} download="rexer-motion.webm"><Download className="size-4" />Download WebM</a></Button></div>}<p className="text-xs text-muted-foreground">Creates a five-second pan-and-zoom composition locally with Canvas and MediaRecorder.</p></div>;
}

export function VoiceStyleStudio() {
  const [text, setText] = useState("Welcome to Rexer, a creative toolkit built for the browser."); const [pitch, setPitch] = useState(1); const [rate, setRate] = useState(1);
  const voices = typeof window === "undefined" ? [] : speechSynthesis.getVoices(); const [voiceIndex, setVoiceIndex] = useState(0);
  function play() { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.pitch = pitch; utterance.rate = rate; if (voices[voiceIndex]) utterance.voice = voices[voiceIndex]; speechSynthesis.speak(utterance); }
  return <div className="space-y-4"><div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">Ethical mode: creates a synthetic voice style from installed system voices. It does not impersonate or clone a real person.</div><Textarea rows={7} value={text} onChange={(event) => setText(event.target.value)} /><select value={voiceIndex} onChange={(event) => setVoiceIndex(Number(event.target.value))} className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm">{voices.length ? voices.map((voice, index) => <option key={`${voice.name}-${index}`} value={index}>{voice.name} · {voice.lang}</option>) : <option>System default voice</option>}</select><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Pitch · {pitch.toFixed(1)}<input type="range" min={.5} max={2} step={.1} value={pitch} onChange={(event) => setPitch(Number(event.target.value))} className="block w-full" /></label><label className="text-xs text-muted-foreground">Rate · {rate.toFixed(1)}<input type="range" min={.5} max={2} step={.1} value={rate} onChange={(event) => setRate(Number(event.target.value))} className="block w-full" /></label></div><div className="flex gap-2"><Button variant="gradient" className="flex-1" onClick={play}><Volume2 className="size-4" />Preview voice style</Button><Button variant="outline" onClick={() => speechSynthesis.cancel()}>Stop</Button></div></div>;
}

function audioBufferToWav(buffer: AudioBuffer) {
  const channels = buffer.numberOfChannels; const length = buffer.length * channels * 2 + 44; const bytes = new ArrayBuffer(length); const view = new DataView(bytes); let offset = 0;
  const string = (value: string) => { for (const character of value) view.setUint8(offset++, character.charCodeAt(0)); }; const u32 = (value: number) => { view.setUint32(offset, value, true); offset += 4; }; const u16 = (value: number) => { view.setUint16(offset, value, true); offset += 2; };
  string("RIFF"); u32(length - 8); string("WAVEfmt "); u32(16); u16(1); u16(channels); u32(buffer.sampleRate); u32(buffer.sampleRate * channels * 2); u16(channels * 2); u16(16); string("data"); u32(length - 44);
  for (let index = 0; index < buffer.length; index++) for (let channel = 0; channel < channels; channel++) { const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[index])); view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true); offset += 2; }
  return bytes;
}

export function SmartAudioStudio({ podcast = false }: { podcast?: boolean }) {
  const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false); const [url, setUrl] = useState(""); const [error, setError] = useState("");
  async function process() {
    if (!file) return; setBusy(true); setError("");
    try { const context = new AudioContext(); const decoded = await context.decodeAudioData(await file.arrayBuffer()); await context.close(); const offline = new OfflineAudioContext(decoded.numberOfChannels, decoded.length, decoded.sampleRate); const source = offline.createBufferSource(); source.buffer = decoded; const high = offline.createBiquadFilter(); high.type = "highpass"; high.frequency.value = podcast ? 80 : 100; const low = offline.createBiquadFilter(); low.type = "lowpass"; low.frequency.value = podcast ? 15000 : 12000; const compressor = offline.createDynamicsCompressor(); compressor.threshold.value = podcast ? -24 : -18; compressor.ratio.value = podcast ? 4 : 2.5; source.connect(high).connect(low).connect(compressor).connect(offline.destination); source.start(); const rendered = await offline.startRendering(); const blob = new Blob([audioBufferToWav(rendered)], { type: "audio/wav" }); if (url) URL.revokeObjectURL(url); setUrl(URL.createObjectURL(blob)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Audio processing failed."); } finally { setBusy(false); }
  }
  return <div className="space-y-4"><FilePicker files={file ? [file] : []} onFiles={(items) => setFile(items[0] ?? null)} accept="audio/*" multiple={false} /><Button variant="gradient" className="w-full" onClick={process} disabled={!file || busy}>{busy ? "Rendering clean audio…" : podcast ? "Polish podcast voice" : "Reduce noise and rumble"}</Button>{error && <p className="text-sm text-red-400">{error}</p>}{url && <div className="space-y-2"><audio src={url} controls className="w-full" /><Button asChild variant="outline" className="w-full"><a href={url} download={podcast ? "podcast-polished.wav" : "noise-reduced.wav"}><Download className="size-4" />Download WAV</a></Button></div>}<p className="text-xs text-muted-foreground">Local Web Audio filters remove low-frequency rumble and hiss, then apply voice-friendly dynamics. No audio is uploaded.</p></div>;
}

const mouthFor = (word: string) => /[bmp]/i.test(word[0] ?? "") ? "closed" : /[aeiou]/i.test(word[0] ?? "") ? "open" : /[fv]/i.test(word[0] ?? "") ? "teeth" : "neutral";
export function LipSyncStudio() {
  const [text, setText] = useState("Welcome to the Rexer creative studio"); const [wordsPerMinute, setWordsPerMinute] = useState(145);
  const cues = useMemo(() => { const duration = 60 / Math.max(60, wordsPerMinute); return text.trim().split(/\s+/).filter(Boolean).map((word, index) => ({ start: +(index * duration).toFixed(3), end: +((index + 1) * duration).toFixed(3), word, mouth: mouthFor(word) })); }, [text, wordsPerMinute]); const output = JSON.stringify({ version: 1, unit: "seconds", cues }, null, 2);
  return <div className="space-y-4"><Textarea rows={6} value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste the exact spoken transcript…" /><div className="space-y-1.5"><Label>Speaking speed · {wordsPerMinute} WPM</Label><input type="range" min={80} max={220} value={wordsPerMinute} onChange={(event) => setWordsPerMinute(Number(event.target.value))} className="w-full" /></div><div className="flex items-center justify-center gap-4 rounded-xl border border-border bg-background/40 p-5"><div className="relative size-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-300"><span className="absolute left-5 top-7 size-2 rounded-full bg-slate-900" /><span className="absolute right-5 top-7 size-2 rounded-full bg-slate-900" /><span className="absolute bottom-6 left-1/2 h-3 w-8 -translate-x-1/2 rounded-[50%] bg-slate-900" /></div><div><p className="font-semibold">{cues.length} mouth cues</p><p className="text-sm text-muted-foreground">Estimated duration {cues.at(-1)?.end ?? 0}s</p></div></div><OutputField value={output} rows={10} /><Button variant="outline" className="w-full" onClick={() => saveBlob(output, "application/json", "lip-sync-cues.json")}><Download className="size-4" />Download cue timeline</Button><p className="text-xs text-muted-foreground">Creates an editable mouth-cue timeline from the supplied transcript. It does not fabricate speech or alter a person’s identity.</p></div>;
}
