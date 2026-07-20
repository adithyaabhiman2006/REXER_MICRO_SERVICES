"use client";
import { useMemo, useState } from "react";
import { Eraser, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, OutputField } from "@/components/tools/_shared";
import { cn } from "@/lib/utils";
import * as U from "@/lib/tools-utils";

// ════════════════════════════ TEXT / DOCS ════════════════════════════
export function WordCounter() {
  const [text, setText] = useState(""); const s = useMemo(() => U.wordCount(text), [text]);
  const items = [["Words", s.words], ["Characters", s.chars], ["No spaces", s.charsNoSpaces], ["Sentences", s.sentences], ["Paragraphs", s.paragraphs], ["Lines", s.lines], ["Read time", `${s.readTime} min`]];
  return (<div className="space-y-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map(([l, v]) => <div key={l as string} className="glass rounded-lg p-3 text-center"><div className="text-2xl font-semibold text-gradient-accent">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}</div><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here…" autoFocus /><div className="flex justify-between"><Button variant="outline" size="sm" onClick={() => setText("")}><Eraser className="size-4" />Clear</Button><CopyButton value={text} label="Copy text" /></div></div>);
}

export function CaseConverter() {
  const [text, setText] = useState(""); const [type, setType] = useState<U.CaseType>("title");
  const OPTIONS: { id: U.CaseType; label: string }[] = [{id:"upper",label:"UPPER CASE"},{id:"lower",label:"lower case"},{id:"title",label:"Title Case"},{id:"sentence",label:"Sentence case"},{id:"camel",label:"camelCase"},{id:"pascal",label:"PascalCase"},{id:"snake",label:"snake_case"},{id:"kebab",label:"kebab-case"},{id:"constant",label:"CONSTANT_CASE"},{id:"invert",label:"iNVERT"}];
  const out = text ? U.convertCase(text, type) : "";
  return (<div className="space-y-4"><Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text…" /><div className="flex flex-wrap gap-2">{OPTIONS.map((o) => <button key={o.id} type="button" onClick={() => setType(o.id)} aria-pressed={type === o.id} className={cn("rounded-md border px-3 py-1.5 text-xs font-medium", type === o.id ? "border-transparent bg-gradient-accent text-white" : "border-border text-muted-foreground hover:text-foreground")}>{o.label}</button>)}</div><OutputField value={out} /></div>);
}

export function FindAndReplace() {
  const [text, setText] = useState(""); const [find, setFind] = useState(""); const [replace, setReplace] = useState(""); const [useRegex, setUseRegex] = useState(false); const [ci, setCi] = useState(true);
  const { result, count } = U.findReplace(text, find, replace, useRegex, ci ? "i" : "");
  return (<div className="space-y-4"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text…" /><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label>Find</Label><Input value={find} onChange={(e) => setFind(e.target.value)} placeholder={useRegex ? "Regex" : "Text"} /></div><div className="space-y-1.5"><Label>Replace with</Label><Input value={replace} onChange={(e) => setReplace(e.target.value)} /></div></div><div className="flex gap-4 text-sm"><label className="flex items-center gap-2"><input type="checkbox" className="accent-[hsl(var(--ring))]" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} /> Regex</label><label className="flex items-center gap-2"><input type="checkbox" className="accent-[hsl(var(--ring))]" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Case-insensitive</label></div><p className="text-sm text-muted-foreground">{count} replacement{count !== 1 ? "s" : ""}.</p><OutputField value={result} /></div>);
}

export function RemoveDuplicateLines() {
  const [text, setText] = useState(""); const [cs, setCs] = useState(true);
  return (<div className="space-y-4"><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[hsl(var(--ring))]" checked={cs} onChange={(e) => setCs(e.target.checked)} /> Case-sensitive</label><OutputField value={U.removeDuplicateLines(text, true, cs)} /></div>);
}

export function SortLines() {
  const [text, setText] = useState(""); const [dir, setDir] = useState<"asc"|"desc">("asc"); const [numeric, setNumeric] = useState(false);
  return (<div className="space-y-4"><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…" /><div className="flex flex-wrap gap-2">{([["asc","A→Z"],["desc","Z→A"]] as const).map(([d,l]) => <button key={d} type="button" onClick={() => setDir(d)} aria-pressed={dir===d} className={cn("rounded-md border px-3 py-1.5 text-xs", dir===d?"border-transparent bg-gradient-accent text-white":"border-border text-muted-foreground hover:text-foreground")}>{l}</button>)}<label className="flex items-center gap-2 px-3 py-1.5 text-xs"><input type="checkbox" className="accent-[hsl(var(--ring))]" checked={numeric} onChange={(e)=>setNumeric(e.target.checked)} /> Numeric</label></div><OutputField value={text ? U.sortLines(text, dir, numeric) : ""} /></div>);
}

export function TrimWhitespace() {
  const [text, setText] = useState(""); const [mode, setMode] = useState<"lines"|"edges"|"multi"|"blank"|"all">("edges");
  const MODES: {id: typeof mode; label: string}[] = [{id:"edges",label:"Trim edges"},{id:"multi",label:"Collapse spaces"},{id:"blank",label:"Remove blanks"},{id:"lines",label:"Trim inner"},{id:"all",label:"Single line"}];
  return (<div className="space-y-4"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Messy text…" /><div className="flex flex-wrap gap-2">{MODES.map((m) => <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode===m.id} className={cn("rounded-md border px-3 py-1.5 text-xs", mode===m.id?"border-transparent bg-gradient-accent text-white":"border-border text-muted-foreground hover:text-foreground")}>{m.label}</button>)}</div><OutputField value={text ? U.trimWhitespace(text, mode) : ""} /></div>);
}

export function RemoveLineBreaks() {
  const [text, setText] = useState("");
  return (<div className="space-y-4"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Text with line breaks…" /><OutputField value={text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim()} /></div>);
}

export function ExtractEmailsUrls() {
  const [text, setText] = useState("");
  const emails = useMemo(() => [...new Set(text.match(U.EMAIL_REGEX) ?? [])], [text]);
  const urls = useMemo(() => [...new Set(text.match(U.URL_REGEX) ?? [])], [text]);
  return (<div className="space-y-4"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text…" /><OutputField value={emails.join("\n")} /><p className="-mt-2 text-xs text-muted-foreground">{emails.length} emails.</p><OutputField value={urls.join("\n")} /><p className="-mt-2 text-xs text-muted-foreground">{urls.length} URLs.</p></div>);
}

export function Notepad() {
  const KEY = "rexer-notepad"; const [text, setText] = useState(""); const [saved, setSaved] = useState(false);
  useState(() => { if (typeof window !== "undefined") { const v = localStorage.getItem(KEY); if (v != null) setText(v); } });
  const save = () => { localStorage.setItem(KEY, text); setSaved(true); setTimeout(() => setSaved(false), 1000); };
  return (<div className="space-y-2"><Textarea rows={16} value={text} onChange={(e) => { setText(e.target.value); save(); }} placeholder="Auto-saving notes…" autoFocus /><p className="text-xs text-muted-foreground">{saved ? "Saved ✓" : "Auto-saves locally"} · {text.length} chars</p></div>);
}

// ════════════════════════════ DEVELOPER ════════════════════════════
function formatJson(json: string, indent: number): { out: string; error?: string } { try { return { out: JSON.stringify(JSON.parse(json), null, indent) }; } catch (e) { return { out: "", error: e instanceof Error ? e.message : "Invalid JSON" }; } }
export function JsonFormatter() {
  const [text, setText] = useState(""); const [indent, setIndent] = useState(2);
  const { out, error } = useMemo(() => (text ? formatJson(text, indent) : { out: "", error: undefined }), [text, indent]);
  return (<div className="space-y-4"><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder='{"hello":"world"}' className="font-mono" /><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setIndent(2)}>2 sp</Button><Button variant="outline" size="sm" onClick={() => setIndent(4)}>4 sp</Button><Button variant="outline" size="sm" onClick={() => setIndent(0)}>Tab</Button><Button variant="outline" size="sm" onClick={() => setText((t) => { try { return JSON.stringify(JSON.parse(t)); } catch { return t; } })}>Minify</Button></div>{error && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">⚠ {error}</p>}<OutputField value={out} rows={8} /></div>);
}

export function JsonValidator() {
  const [text, setText] = useState(""); let valid: boolean | null = null; let msg = ""; let count = 0;
  if (text.trim()) { try { const v = JSON.parse(text); valid = true; count = Array.isArray(v) ? v.length : typeof v === "object" ? Object.keys(v).length : 1; } catch (e) { valid = false; msg = e instanceof Error ? e.message : "Invalid"; } }
  return (<div className="space-y-4"><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste JSON…" className="font-mono" />{valid === true && <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">✓ Valid JSON{count > 0 && ` · ${count} items`}</p>}{valid === false && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">✗ {msg}</p>}</div>);
}

export function JsonToCsv() {
  const [text, setText] = useState("");
  const { out, error } = useMemo(() => { try { const data = JSON.parse(text); const arr = Array.isArray(data) ? data : [data]; if (!arr.length) return { out: "" }; const headers = Array.from(new Set(arr.flatMap((o: any) => Object.keys(o ?? {})))); const esc = (v: any) => { const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }; const lines = [headers.join(",")]; for (const row of arr) lines.push(headers.map((h) => esc((row as any)?.[h])).join(",")); return { out: lines.join("\n") }; } catch (e) { return { out: "", error: e instanceof Error ? e.message : "Invalid JSON" }; } }, [text]);
  return (<div className="space-y-4"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder='[{"name":"Ada"}]' className="font-mono" />{error && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">⚠ {error}</p>}<OutputField value={out} />{out && <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(out)}`} download="export.csv" className="inline-flex rounded-md bg-gradient-accent px-3 py-1.5 text-xs font-medium text-white">Download CSV</a>}</div>);
}

export function CsvToJson() {
  const [text, setText] = useState(""); const [delim, setDelim] = useState(",");
  const { out, error } = useMemo(() => { try { const lines = text.trim().split(/\r?\n/); if (!lines.length) return { out: "" }; const parse = (line: string) => { const o: string[] = []; let cur = ""; let q = false; for (let i = 0; i < line.length; i++) { const c = line[i]; if (c === '"') { if (q && line[i+1] === '"') { cur += '"'; i++; } else q = !q; } else if (c === delim && !q) { o.push(cur); cur = ""; } else cur += c; } o.push(cur); return o; }; const rows = lines.map(parse); const headers = rows[0]; const json = rows.slice(1).filter((r) => r.some((x) => x !== "")).map((r) => { const o: any = {}; headers.forEach((h, i) => (o[h] = r[i] ?? "")); return o; }); return { out: JSON.stringify(json, null, 2) }; } catch { return { out: "", error: "Invalid CSV" }; } }, [text, delim]);
  return (<div className="space-y-4"><div className="space-y-1.5 max-w-[8rem]"><Label>Delimiter</Label><Input value={delim} onChange={(e)=>setDelim(e.target.value)} maxLength={1} /></div><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={"name,city\nAda,London"} />{error && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">⚠ {error}</p>}<OutputField value={out} /></div>);
}

export function Base64EncodeDecode() {
  const [text, setText] = useState(""); const [out, setOut] = useState(""); const [error, setError] = useState("");
  return (<div className="space-y-4"><Textarea rows={5} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Enter text or Base64…" className="font-mono" /><div className="flex gap-2"><Button variant="gradient" onClick={() => { setOut(U.base64Encode(text)); setError(""); }}>Encode →</Button><Button variant="outline" onClick={() => { const d = U.base64Decode(text); if (text && !d) setError("Invalid Base64."); else { setOut(d); setError(""); } }}>← Decode</Button></div>{error && <p className="text-sm text-red-400">{error}</p>}<div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">Result</span><CopyButton value={out} /></div><Textarea rows={4} value={out} readOnly className="break-all font-mono" /></div></div>);
}

export function UrlEncodeDecode() {
  const [text, setText] = useState(""); const [out, setOut] = useState("");
  return (<div className="space-y-4"><Textarea rows={5} value={text} onChange={(e)=>setText(e.target.value)} placeholder="https://example.com/?q=hello world" className="font-mono" /><div className="flex gap-2"><Button variant="gradient" onClick={()=>setOut(U.urlEncode(text))}>Encode →</Button><Button variant="outline" onClick={()=>setOut(U.urlDecode(text))}>← Decode</Button></div><div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">Result</span><CopyButton value={out} /></div><Textarea rows={4} value={out} readOnly className="font-mono" /></div></div>);
}

export function HtmlEntityEncoder() {
  const [text, setText] = useState(""); const [out, setOut] = useState("");
  return (<div className="space-y-4"><Textarea rows={6} value={text} onChange={(e)=>setText(e.target.value)} placeholder="<div>Hello & welcome</div>" className="font-mono" /><div className="flex gap-2"><Button variant="gradient" onClick={()=>setOut(U.htmlEncode(text))}>Encode →</Button><Button variant="outline" onClick={()=>setOut(U.htmlDecode(text))}>← Decode</Button></div><div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">Result</span><CopyButton value={out} /></div><Textarea rows={4} value={out} readOnly className="font-mono" /></div></div>);
}

export function TextEncoderDecoder() {
  const [text, setText] = useState(""); const [mode, setMode] = useState<"base64"|"hex"|"url"|"html">("base64");
  const enc = (() => { switch(mode){case "base64":return U.base64Encode(text);case "hex":return U.hexEncode(text);case "url":return U.urlEncode(text);case "html":return U.htmlEncode(text);} })();
  return (<div className="space-y-4"><div className="flex flex-wrap gap-2">{(["base64","hex","url","html"] as const).map(m => <button key={m} type="button" onClick={()=>setMode(m)} aria-pressed={mode===m} className={cn("rounded-md border px-3 py-1.5 text-xs", mode===m?"border-transparent bg-gradient-accent text-white":"border-border text-muted-foreground hover:text-foreground")}>{m}</button>)}</div><Textarea rows={5} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Text to encode…" /><div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">Encoded ({mode})</span><CopyButton value={enc} /></div><Textarea rows={4} value={enc} readOnly className="break-all font-mono text-xs" /></div></div>);
}

type Lang = "css" | "js" | "html";
function minify(code: string, lang: Lang): string { if (lang === "css") return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").replace(/\s+/g, " ").trim(); if (lang === "js") return code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim(); return code.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s+/g, " ").trim(); }
function beautify(code: string, lang: Lang): string { if (lang === "css") return code.replace(/\s*([{}:;,])\s*/g, "$1").replace(/{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/}/g, "\n}\n").trim(); return code.replace(/([{};])/g, "$1\n").split("\n").map((l) => l.trim()).filter(Boolean).join("\n"); }
export function Minifier({ lang: langProp = "js", mode: modeProp = "minify" }: { lang?: Lang; mode?: "minify"|"beautify" }) {
  const [code, setCode] = useState(""); const [lang, setLang] = useState<Lang>(langProp); const [mode, setMode] = useState<"minify"|"beautify">(modeProp);
  const out = useMemo(() => code ? (mode==="minify"?minify(code,lang):beautify(code,lang)) : "", [code, lang, mode]);
  return (<div className="space-y-4"><div className="flex flex-wrap gap-2">{(["js","css","html"] as Lang[]).map(l => <button key={l} type="button" onClick={()=>setLang(l)} aria-pressed={lang===l} className={cn("rounded-md border px-3 py-1.5 text-xs uppercase", lang===l?"border-transparent bg-gradient-accent text-white":"border-border text-muted-foreground hover:text-foreground")}>{l}</button>)}<div className="mx-1 w-px self-stretch bg-border" />{(["minify","beautify"] as const).map(m => <button key={m} type="button" onClick={()=>setMode(m)} aria-pressed={mode===m} className={cn("rounded-md border px-3 py-1.5 text-xs capitalize", mode===m?"border-transparent bg-gradient-accent text-white":"border-border text-muted-foreground hover:text-foreground")}>{m}</button>)}</div><Textarea rows={8} value={code} onChange={(e)=>setCode(e.target.value)} placeholder={`Paste ${lang.toUpperCase()}…`} className="font-mono text-xs" /><OutputField value={out} rows={8} /></div>);
}

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b"); const [flags, setFlags] = useState("g"); const [text, setText] = useState("Contact ada@example.com or bob@test.io.");
  let matches: string[] = []; let error = ""; try { const re = new RegExp(pattern, flags); matches = text.match(re) ?? []; } catch (e) { error = e instanceof Error ? e.message : "Invalid"; }
  return (<div className="space-y-4"><div className="grid gap-3 sm:grid-cols-[1fr_8rem]"><div className="space-y-1.5"><Label>Pattern</Label><Input value={pattern} onChange={(e)=>setPattern(e.target.value)} className="font-mono" /></div><div className="space-y-1.5"><Label>Flags</Label><Input value={flags} onChange={(e)=>setFlags(e.target.value)} className="font-mono" /></div></div><Textarea rows={6} value={text} onChange={(e)=>setText(e.target.value)} />{error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">⚠ {error}</p> : <div className="rounded-md border border-border bg-background/50 p-3"><p className="text-sm text-muted-foreground">{matches.length} match{matches.length!==1?"es":""}:</p><div className="mt-2 flex flex-wrap gap-1.5">{matches.map((m,i)=><span key={i} className="rounded bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">{m}</span>)}</div></div>}</div>);
}

export function UuidGenerator() {
  const [ids, setIds] = useState<string[]>([]); const [count, setCount] = useState(5);
  return (<div className="space-y-4"><div className="flex items-center gap-3"><label className="text-sm text-muted-foreground">Count</label><input type="number" min={1} max={500} value={count} onChange={(e)=>setCount(Math.min(500,Math.max(1,+e.target.value)))} className="h-9 w-20 rounded-md border border-border bg-card/50 px-2 text-sm" /><Button variant="gradient" onClick={()=>setIds(Array.from({length: count}, () => U.uuidv4()))}>Generate</Button></div><div className="space-y-1.5">{ids.map((id, i) => <div key={i} className="flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-2 font-mono text-sm"><span>{id}</span><CopyButton value={id} /></div>)}</div>{ids.length===0 && <p className="text-sm text-muted-foreground">Click Generate.</p>}</div>);
}

export function HashGenerator() {
  const [text, setText] = useState(""); const [results, setResults] = useState<Record<string,string>>({});
  const ALGOS = ["SHA-1","SHA-256","SHA-384","SHA-512"] as const;
  return (<div className="space-y-4"><Textarea rows={4} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Text to hash…" /><Button variant="gradient" onClick={async () => { const out: Record<string,string> = {}; for (const a of ALGOS) out[a] = await U.hash(text, a); setResults(out); }}>Generate hashes</Button><div className="space-y-2">{ALGOS.map(a => results[a] && <div key={a} className="rounded-md border border-border bg-background/50 p-3"><div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">{a}</span><CopyButton value={results[a]} /></div><code className="mt-1 block break-all font-mono text-xs">{results[a]}</code></div>)}</div></div>);
}

export function JwtDecoder() {
  const [token, setToken] = useState(""); const decoded = token.trim() ? U.decodeJwt(token) : null;
  return (<div className="space-y-4"><Textarea rows={4} value={token} onChange={(e)=>setToken(e.target.value)} placeholder="eyJhbGciOi…" className="font-mono text-xs" />{decoded && <div className="space-y-3">{(["header","payload"] as const).map(part => <div key={part}><span className="text-xs font-medium uppercase text-muted-foreground">{part}</span><pre className="mt-1 overflow-auto rounded-md border border-border bg-background/50 p-3 font-mono text-xs"><code>{JSON.stringify(decoded[part], null, 2)}</code></pre></div>)}<div><span className="text-xs font-medium uppercase text-muted-foreground">Signature</span><code className="mt-1 block break-all rounded-md border border-border bg-background/50 p-3 font-mono text-xs">{decoded.signature || "(none)"}</code></div></div>}<p className="text-xs text-muted-foreground">Decoded locally. Signatures not verified.</p></div>);
}

export function TokenCounter() {
  const [text, setText] = useState("");
  const { tokens, chars, words } = useMemo(() => { const chars = text.length; const words = text.trim() ? text.trim().split(/\s+/).length : 0; return { tokens: Math.max(Math.ceil(chars/4), Math.ceil(words*1.3)), chars, words }; }, [text]);
  return (<div className="space-y-4"><div className="grid grid-cols-3 gap-3">{[["Tokens",tokens],["Words",words],["Chars",chars]].map(([l,v]) => <div key={l as string} className="glass rounded-lg p-4 text-center"><div className="text-2xl font-semibold text-gradient-accent">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}</div><Textarea rows={8} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste text…" /><p className="text-xs text-muted-foreground">Heuristic estimate (~4 chars/token).</p></div>);
}

export function CronBuilder() {
  const presets: [string,string,string][] = [["Every minute","* * * * *","Every minute, every day"],["Every hour","0 * * * *","At minute 0 of every hour"],["Daily midnight","0 0 * * *","Once a day at 00:00"],["Daily 9am","0 9 * * *","Daily at 09:00"],["Every Monday","0 0 * * 1","Mondays at 00:00"],["Weekdays 9am","0 9 * * 1-5","Weekdays at 09:00"],["Monthly","0 0 1 * *","1st of month at 00:00"]];
  const [expr, setExpr] = useState("0 9 * * 1-5");
  return (<div className="space-y-4"><div className="flex items-center gap-2"><code className="flex-1 break-all rounded-md border border-border bg-background/50 px-3 py-2 font-mono text-lg text-accent">{expr}</code><CopyButton value={expr} /></div><div className="space-y-1.5">{presets.map(([label,c,desc]) => <button key={c} type="button" onClick={()=>setExpr(c)} className="block w-full rounded-md border border-border bg-background/50 px-3 py-2 text-left hover:border-white/20"><span className="text-sm font-medium">{label}</span><span className="ml-2 font-mono text-xs text-accent">{c}</span><span className="block text-xs text-muted-foreground">{desc}</span></button>)}</div></div>);
}

export function ColorConverter() {
  const [hex, setHex] = useState("#0057ff"); const rgb = U.hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }; const [h, s, l] = U.rgbToHsl(rgb.r, rgb.g, rgb.b);
  const out: Record<string,string> = { HEX: U.rgbToHex(rgb.r,rgb.g,rgb.b), RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, HSL: `hsl(${h}, ${s}%, ${l}%)` };
  return (<div className="space-y-4"><div className="flex items-center gap-4"><input type="color" value={hex} onChange={(e)=>setHex(e.target.value)} className="size-16 cursor-pointer rounded-lg border border-border bg-transparent" /><div className="flex-1 space-y-1.5"><Label>HEX</Label><Input value={hex} onChange={(e)=>setHex(e.target.value)} className="font-mono" /></div></div><div className="h-20 rounded-lg border border-border" style={{ backgroundColor: hex }} /><div className="grid gap-2 sm:grid-cols-3">{Object.entries(out).map(([k,v]) => <div key={k} className="flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-2"><div><span className="text-xs text-muted-foreground">{k}</span><p className="font-mono text-sm">{v}</p></div><CopyButton value={v} /></div>)}</div></div>);
}
