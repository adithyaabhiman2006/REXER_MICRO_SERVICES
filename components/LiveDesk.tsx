"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Clipboard,
  CloudSun,
  Copy,
  HardDrive,
  Pause,
  Play,
  RotateCcw,
  StickyNote,
  TimerReset,
  Wifi,
  WifiOff,
} from "lucide-react";

import { getRecentToolSlugs } from "@/lib/recent-tools";
import { tools } from "@/lib/registry/tools";

const NOTE_KEY = "rexer-desk-note";
const FOCUS_SECONDS = 25 * 60;

interface WeatherData {
  current?: { temperature_2m?: number; weather_code?: number; wind_speed_10m?: number };
  current_units?: { temperature_2m?: string; wind_speed_10m?: string };
}

interface RateRow {
  quote: string;
  rate: number;
}

function weatherLabel(code = 0) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Misty";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Showers";
  if (code <= 82) return "Heavy showers";
  return "Thunder possible";
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  return bytes > 1024 ** 3
    ? `${(bytes / 1024 ** 3).toFixed(1)} GB`
    : `${Math.max(1, Math.round(bytes / 1024 ** 2))} MB`;
}

export function LiveDesk() {
  const [now, setNow] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [noteReady, setNoteReady] = useState(false);
  const [clipboardStatus, setClipboardStatus] = useState("Local autosave");
  const [seconds, setSeconds] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [online, setOnline] = useState(true);
  const [storage, setStorage] = useState({ usage: 0, quota: 0 });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [rates, setRates] = useState<RateRow[]>([]);
  const [remoteStatus, setRemoteStatus] = useState<"loading" | "ready" | "offline">("loading");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    try {
      setNote(window.localStorage.getItem(NOTE_KEY) ?? "");
    } catch {
      setClipboardStatus("Private storage unavailable");
    } finally {
      setNoteReady(true);
    }
    setRecentSlugs(getRecentToolSlugs());
    navigator.storage?.estimate().then(({ usage = 0, quota = 0 }) => setStorage({ usage, quota }));
  }, []);

  useEffect(() => {
    if (!noteReady) return;
    try {
      window.localStorage.setItem(NOTE_KEY, note);
    } catch {
      setClipboardStatus("Private storage unavailable");
    }
  }, [note, noteReady]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          return FOCUS_SECONDS;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FColombo",
        { signal: controller.signal },
      ).then((response) => {
        if (!response.ok) throw new Error("Weather unavailable");
        return response.json() as Promise<WeatherData>;
      }),
      fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=LKR,EUR,GBP,JPY", {
        signal: controller.signal,
      }).then((response) => {
        if (!response.ok) throw new Error("Rates unavailable");
        return response.json() as Promise<RateRow[]>;
      }),
    ])
      .then(([weatherData, rateData]) => {
        setWeather(weatherData);
        setRates(rateData);
        setRemoteStatus("ready");
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setRemoteStatus("offline");
      });
    return () => controller.abort();
  }, []);

  const recentTools = useMemo(
    () => recentSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean),
    [recentSlugs],
  );
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remaining = String(seconds % 60).padStart(2, "0");
  const time = now
    ? new Intl.DateTimeFormat("en-LK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Colombo",
      }).format(now)
    : "--:--";
  const date = now
    ? new Intl.DateTimeFormat("en-LK", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Colombo",
      }).format(now)
    : "Local time loading";

  const copyNote = async () => {
    try {
      await navigator.clipboard.writeText(note);
      setClipboardStatus("Copied to clipboard");
    } catch {
      setClipboardStatus("Clipboard permission blocked");
    }
  };

  const pasteNote = async () => {
    try {
      setNote(await navigator.clipboard.readText());
      setClipboardStatus("Pasted locally");
    } catch {
      setClipboardStatus("Allow clipboard access to paste");
    }
  };

  return (
    <section id="desk" className="scroll-mt-16 border-b border-border bg-[#E9E7DF] text-black">
      <div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-[1fr_.55fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-[#7C62FF]">Your returning workspace / Live</p>
            <h2 className="mt-4 text-[clamp(3.2rem,7vw,7.5rem)] font-black leading-[.8] tracking-[-.08em]">
              YOUR LIVE
              <br />
              DESK.
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-relaxed text-black/50 lg:justify-self-end">
            Small things you need every day. Notes and preferences stay in this browser; live data is fetched only when the desk is open.
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-12">
          <article className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#090a0c] p-7 text-white lg:col-span-7 lg:p-9">
            <div className="absolute -right-14 -top-20 size-72 rounded-full border-[55px] border-rex-lime/90" />
            <div className="absolute right-28 top-36 size-24 rounded-full bg-rex-coral blur-[1px]" />
            <p className="relative z-10 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-white/40">
              <CloudSun className="size-3.5 text-rex-lime" /> Colombo right now
            </p>
            <div className="relative z-10 mt-14 flex items-end gap-4">
              <p className="text-[clamp(5rem,12vw,9.5rem)] font-black leading-[.68] tracking-[-.1em]">{time}</p>
              <span className="mb-1 size-3 animate-pulse rounded-full bg-rex-lime" />
            </div>
            <div className="relative z-10 mt-9 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-5">
              <div>
                <p className="text-sm font-bold">{date}</p>
                <p className="mt-1 text-xs text-white/40">Asia / Colombo</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black tracking-[-.05em]">
                  {weather?.current?.temperature_2m ?? "—"}{weather?.current_units?.temperature_2m ?? "°C"}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  {remoteStatus === "loading" ? "Loading weather…" : remoteStatus === "offline" ? "Live data unavailable" : weatherLabel(weather?.current?.weather_code)}
                </p>
              </div>
            </div>
          </article>

          <article className="flex min-h-[360px] flex-col rounded-[2rem] bg-rex-lime p-7 lg:col-span-5 lg:p-9">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/45"><StickyNote className="size-3.5" /> Local note</p>
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-black/40"><Check className="size-3" /> {clipboardStatus}</span>
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Hold a thought here…"
              aria-label="Local desk note"
              className="mt-8 min-h-40 flex-1 resize-none border-0 bg-transparent text-2xl font-black leading-tight tracking-[-.04em] outline-none placeholder:text-black/25 focus:ring-0"
            />
            <div className="flex gap-2 border-t border-black/15 pt-4">
              <button type="button" onClick={pasteNote} className="flex h-10 items-center gap-2 rounded-full border border-black/20 px-4 text-[10px] font-black uppercase tracking-[.12em] hover:bg-black hover:text-white">
                <Clipboard className="size-3.5" /> Paste
              </button>
              <button type="button" onClick={copyNote} disabled={!note} className="flex h-10 items-center gap-2 rounded-full bg-black px-4 text-[10px] font-black uppercase tracking-[.12em] text-white disabled:opacity-30">
                <Copy className="size-3.5" /> Copy
              </button>
            </div>
          </article>

          <article className="min-h-[300px] rounded-[2rem] bg-rex-coral p-7 lg:col-span-4">
            <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/45"><TimerReset className="size-3.5" /> Focus sprint</p>
            <p className="mt-14 text-[5.5rem] font-black leading-none tracking-[-.09em]">{minutes}:{remaining}</p>
            <div className="mt-10 flex gap-2">
              <button type="button" onClick={() => setRunning((value) => !value)} className="grid size-12 place-items-center rounded-full bg-black text-white" aria-label={running ? "Pause focus timer" : "Start focus timer"}>
                {running ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
              </button>
              <button type="button" onClick={() => { setRunning(false); setSeconds(FOCUS_SECONDS); }} className="grid size-12 place-items-center rounded-full border border-black/20" aria-label="Reset focus timer">
                <RotateCcw className="size-4" />
              </button>
            </div>
          </article>

          <article className="min-h-[300px] rounded-[2rem] bg-white p-7 lg:col-span-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/40">USD live rates</p>
              <span className={`size-2 rounded-full ${remoteStatus === "ready" ? "bg-rex-lime" : "bg-black/15"}`} />
            </div>
            <div className="mt-9 divide-y divide-black/10">
              {rates.length ? rates.slice(0, 4).map((row) => (
                <div key={row.quote} className="flex items-baseline justify-between py-3">
                  <span className="text-xs font-black">{row.quote}</span>
                  <span className="font-mono text-lg font-bold">{row.rate < 10 ? row.rate.toFixed(3) : row.rate.toFixed(2)}</span>
                </div>
              )) : ["LKR", "EUR", "GBP", "JPY"].map((quote) => (
                <div key={quote} className="flex items-baseline justify-between py-3 text-black/25"><span className="text-xs font-black">{quote}</span><span>—</span></div>
              ))}
            </div>
            <p className="mt-3 text-[9px] font-semibold text-black/35">Reference rates · Frankfurter open API</p>
          </article>

          <article className="min-h-[300px] rounded-[2rem] bg-rex-violet p-7 lg:col-span-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/45"><HardDrive className="size-3.5" /> This browser</p>
              {online ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
            </div>
            <p className="mt-14 text-4xl font-black tracking-[-.06em]">{online ? "ONLINE" : "OFFLINE READY"}</p>
            <div className="mt-9 border-t border-black/15 pt-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[.12em] text-black/45">
                <span>Rexer storage</span><span>{formatBytes(storage.usage)}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/15">
                <span className="block h-full min-w-1 rounded-full bg-black" style={{ width: `${Math.min((storage.usage / Math.max(storage.quota, 1)) * 100, 100)}%` }} />
              </div>
              <p className="mt-3 text-[9px] font-semibold text-black/35">Available quota: {formatBytes(storage.quota)}</p>
            </div>
          </article>

          <article className="flex min-h-32 flex-col justify-between gap-6 rounded-[2rem] border border-black/15 bg-transparent p-7 sm:flex-row sm:items-center lg:col-span-12">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/40">Continue where you left off</p>
              <p className="mt-2 text-xl font-black tracking-[-.04em]">Recent moves stay on this device.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentTools.length ? recentTools.slice(0, 4).map((tool) => tool && (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center gap-2 rounded-full bg-black px-4 py-3 text-[10px] font-black text-white transition-transform hover:-translate-y-0.5">
                  {tool.title}<ArrowUpRight className="size-3" />
                </Link>
              )) : (
                <Link href="#tools-heading" className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-[10px] font-black uppercase tracking-[.12em] text-white">
                  Open your first tool <ArrowUpRight className="size-3" />
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
