"use client";
/* eslint-disable @next/next/no-img-element -- generated data URL preview */
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadCDN, esm } from "@/lib/cdn";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://adithyaabhiman2006.github.io/REXER_MICRO_SERVICES/");
  const [size] = useState(320);
  const [dark, setDark] = useState("#0B0F19");
  const [light, setLight] = useState("#FFFFFF");
  const [dataUrl, setDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    let active = true;
    if (!text) { setDataUrl(""); return; }
    setLoading(true); setErr("");
    loadCDN(esm("qrcode", "1.5.4"))
      .then((QR) => QR.toDataURL(text, { width: size, margin: 2, color: { dark, light }, errorCorrectionLevel: "M" }))
      .then((url: string) => { if (active) { setDataUrl(url); setLoading(false); } })
      .catch(() => { if (active) { setErr("Failed to load QR generator."); setLoading(false); } });
    return () => { active = false; };
  }, [text, size, dark, light]);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="qr-text">Text or URL</Label><Input id="qr-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://…" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Foreground</Label><input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border bg-card/50" /></div>
        <div className="space-y-1.5"><Label>Background</Label><input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border bg-card/50" /></div>
      </div>
      <div className="flex justify-center rounded-lg bg-white p-4">{dataUrl ? <img src={dataUrl} alt="Generated QR code" width={240} height={240} /> : <div className="h-60 w-60 animate-pulse bg-muted" />}</div>
      {loading && <p className="text-center text-xs text-muted-foreground">Loading generator…</p>}
      {err && <p className="text-center text-xs text-red-400">{err}</p>}
      {dataUrl && <a href={dataUrl} download="qr-code.png" className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-gradient-accent px-3 py-2 text-sm font-medium text-white"><Download className="size-4" />Download PNG</a>}
      <p className="text-xs text-muted-foreground">First use downloads the generator (~50 KB) from a CDN, then it&rsquo;s cached.</p>
    </div>
  );
}
