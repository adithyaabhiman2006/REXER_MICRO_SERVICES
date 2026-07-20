/** Rexer Micro-Tools — shared utilities (pure, no external packages). */

// ── Text utilities ─────────────────────────────────────────────────────────
export function wordCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, lines: 0, readTime: 0 };
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentences = trimmed.split(/[.!?]+(\s|$)/).filter((s) => s.trim().length > 0);
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  return { words: words.length, chars: text.length, charsNoSpaces: text.replace(/\s/g, "").length, sentences: sentences.length, paragraphs: paragraphs.length, lines: text.split(/\n/).length, readTime: Math.max(1, Math.ceil(words.length / 200)) };
}

export type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "constant" | "invert";
function toWords(text: string): string[] { return text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-\.]+/g, " ").trim().split(/\s+/).filter(Boolean); }
function cap(w: string) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }
export function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case "sentence": return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case "camel": return toWords(text).map((w, i) => i === 0 ? w.toLowerCase() : cap(w)).join("");
    case "pascal": return toWords(text).map(cap).join("");
    case "snake": return toWords(text).map((w) => w.toLowerCase()).join("_");
    case "kebab": return toWords(text).map((w) => w.toLowerCase()).join("-");
    case "constant": return toWords(text).map((w) => w.toUpperCase()).join("_");
    case "invert": return text.replace(/[a-zA-Z]/g, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()));
    default: return text;
  }
}

export function removeDuplicateLines(text: string, _keepOrder = true, caseSensitive = true): string {
  const lines = text.split("\n"); const seen = new Set<string>(); const out: string[] = [];
  for (const line of lines) { const key = caseSensitive ? line : line.toLowerCase(); if (!seen.has(key)) { seen.add(key); out.push(line); } }
  return out.join("\n");
}
export function sortLines(text: string, direction: "asc" | "desc" = "asc", numeric = false): string {
  const lines = text.split("\n");
  lines.sort((a, b) => { const cmp = numeric ? parseFloat(a) - parseFloat(b) : a.localeCompare(b); return direction === "asc" ? cmp : -cmp; });
  return lines.join("\n");
}
export function findReplace(text: string, find: string, replace: string, useRegex: boolean, flags: string): { result: string; count: number } {
  if (!find) return { result: text, count: 0 };
  try {
    let count = 0; let result: string;
    if (useRegex) { const re = new RegExp(find, flags.includes("g") ? flags : flags + "g"); result = text.replace(re, () => { count++; return replace; }); }
    else { const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const re = new RegExp(escaped, "g"); result = text.replace(re, () => { count++; return replace; }); }
    return { result, count };
  } catch { return { result: text, count: 0 }; }
}
export function trimWhitespace(text: string, mode: "lines" | "edges" | "multi" | "blank" | "all"): string {
  switch (mode) {
    case "edges": return text.split("\n").map((l) => l.trim()).join("\n").trim();
    case "multi": return text.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
    case "lines": return text.replace(/^[ \t]+|[ \t]+$/gm, "");
    case "blank": return text.split("\n").filter((l) => l.trim().length > 0).join("\n");
    case "all": return text.replace(/\s+/g, " ").trim();
    default: return text;
  }
}
export function reverseText(text: string, mode: "chars" | "words" | "lines"): string {
  switch (mode) { case "chars": return [...text].reverse().join(""); case "words": return text.split(/(\s+)/).reverse().join(""); case "lines": return text.split("\n").reverse().join("\n"); default: return text; }
}
export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
export const URL_REGEX = /https?:\/\/[^\s<>"']+/g;
export function slugify(text: string, separator = "-"): string {
  return text.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, separator).replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");
}
export function repeatText(text: string, count: number, separator: "newline" | "space" | "none" = "newline"): string {
  const n = Math.min(Math.max(1, count), 10000); const sep = separator === "newline" ? "\n" : separator === "space" ? " " : "";
  return Array(n).fill(text).join(sep);
}
const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat".split(" ");
export function loremIpsum(paragraphs: number, sentencesPerPara = 5): string {
  const out: string[] = [];
  for (let p = 0; p < paragraphs; p++) { const sents: string[] = [];
    for (let s = 0; s < sentencesPerPara; s++) { const len = 8 + Math.floor(Math.random() * 12); const words: string[] = [];
      for (let i = 0; i < len; i++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      let sent = words.join(" "); sent = sent.charAt(0).toUpperCase() + sent.slice(1) + "."; sents.push(sent); }
    out.push(sents.join(" ")); }
  return out.join("\n\n");
}

// ── Crypto + encoding (WebCrypto / TextEncoder) ────────────────────────────
export async function hash(data: string, algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  const buf = await crypto.subtle.digest(algorithm, new TextEncoder().encode(data));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function uuidv4(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  const buf = new Uint8Array(16); crypto.getRandomValues(buf); buf[6] = (buf[6] & 0x0f) | 0x40; buf[8] = (buf[8] & 0x3f) | 0x80;
  const h = [...buf].map((b) => b.toString(16).padStart(2, "0"));
  return `${h.slice(0,4).join("")}-${h.slice(4,6).join("")}-${h.slice(6,8).join("")}-${h.slice(8,10).join("")}-${h.slice(10,16).join("")}`;
}
export function shortId(length = 8): string { const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; const buf = new Uint32Array(length); crypto.getRandomValues(buf); return [...buf].map((n) => chars[n % chars.length]).join(""); }
export function base64Encode(str: string): string { try { return btoa(unescape(encodeURIComponent(str))); } catch { return ""; } }
export function base64Decode(str: string): string { try { return decodeURIComponent(escape(atob(str.trim()))); } catch { return ""; } }
export function hexEncode(str: string): string { return [...new TextEncoder().encode(str)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
export function hexDecode(str: string): string { try { const bytes = str.trim().match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? []; return new TextDecoder().decode(new Uint8Array(bytes)); } catch { return ""; } }
export function htmlEncode(str: string): string { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
export function htmlDecode(str: string): string { if (typeof document === "undefined") return str; const el = document.createElement("textarea"); el.innerHTML = str; return el.value; }
export function urlEncode(str: string): string { try { return encodeURIComponent(str); } catch { return ""; } }
export function urlDecode(str: string): string { try { return decodeURIComponent(str); } catch { return ""; } }
export function baseConvert(value: string, fromBase: number, toBase: number): string {
  const neg = value.trim().startsWith("-"); const clean = neg ? value.trim().slice(1) : value.trim();
  const big = BigInt(parseInt(clean, fromBase) || 0); if (big === 0n) return "0";
  let n = big; let out = ""; const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  while (n > 0n) { out = digits[Number(n % BigInt(toBase))] + out; n = n / BigInt(toBase); }
  return (neg ? "-" : "") + out;
}
export interface JwtParts { header: any; payload: any; signature: string; }
export function decodeJwt(token: string): JwtParts | null {
  const parts = token.trim().split("."); if (parts.length < 2) return null;
  try { const dec = (s: string) => JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/"))); return { header: dec(parts[0]), payload: dec(parts[1]), signature: parts[2] ?? "" }; } catch { return null; }
}
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null { const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i); if (!m) return null; return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }; }
export function rgbToHex(r: number, g: number, b: number): string { return "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join(""); }
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; } h /= 6; }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100; if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1/3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1/3) * 255)];
}
