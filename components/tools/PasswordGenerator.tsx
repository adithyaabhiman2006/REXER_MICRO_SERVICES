"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, Check, RefreshCw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Options {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const AMBIGUOUS = new Set(["I", "l", "O", "0", "1", "|", "`"]);

/** Cryptographically-secure random integer in [0, max). */
function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

function generatePassword(opts: Options): string {
  let pool = "";
  if (opts.upper) pool += SETS.upper;
  if (opts.lower) pool += SETS.lower;
  if (opts.digits) pool += SETS.digits;
  if (opts.symbols) pool += SETS.symbols;
  if (opts.excludeAmbiguous) {
    pool = [...pool].filter((c) => !AMBIGUOUS.has(c)).join("");
  }
  if (!pool) return "";

  const chars = [...pool];
  const out: string[] = [];
  for (let i = 0; i < opts.length; i++) {
    out.push(chars[secureRandomInt(chars.length)]);
  }
  return out.join("");
}

/** Rough entropy-based strength estimate, 0–4. */
function estimateStrength(pw: string, poolSize: number): number {
  if (!pw || !poolSize) return 0;
  const entropy = pw.length * Math.log2(poolSize);
  if (entropy < 40) return 1;
  if (entropy < 60) return 2;
  if (entropy < 80) return 3;
  return 4;
}

const STRENGTH_LABELS = ["Empty", "Weak", "Fair", "Strong", "Very strong"];
const STRENGTH_COLORS = [
  "bg-muted",
  "bg-red-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
];

export default function PasswordGenerator() {
  const [opts, setOpts] = useState<Options>({
    length: 16,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const poolSize = useMemo(() => {
    let pool = "";
    if (opts.upper) pool += SETS.upper;
    if (opts.lower) pool += SETS.lower;
    if (opts.digits) pool += SETS.digits;
    if (opts.symbols) pool += SETS.symbols;
    if (opts.excludeAmbiguous) pool = [...pool].filter((c) => !AMBIGUOUS.has(c)).join("");
    return pool.length;
  }, [opts]);

  const regenerate = useCallback(() => {
    setPassword(generatePassword(opts));
    setCopied(false);
  }, [opts]);

  // Generate once on mount and whenever options change.
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const strength = estimateStrength(password, poolSize);

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  const noCharset = !opts.upper && !opts.lower && !opts.digits && !opts.symbols;

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="glass-strong flex items-center gap-3 rounded-xl p-4">
        <code
          className="flex-1 break-all font-mono text-lg tracking-wide text-foreground"
          aria-live="polite"
          aria-label="Generated password"
        >
          {password || <span className="text-muted-foreground">Select at least one character set</span>}
        </code>
        <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy password" disabled={!password}>
          {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={regenerate} aria-label="Generate new password" disabled={noCharset}>
          <RefreshCw className="size-4" />
        </Button>
      </div>

      {/* Strength meter */}
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Strength</span>
          <span className="font-medium" data-strength={strength}>
            {STRENGTH_LABELS[strength]}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                strength >= i ? STRENGTH_COLORS[strength] : "bg-muted",
              )}
            />
          ))}
        </div>
        {poolSize > 0 && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            ~{Math.round((password?.length || 0) * Math.log2(poolSize))} bits of entropy
          </p>
        )}
      </div>

      {/* Length */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="pw-length">Length</Label>
          <Input
            id="pw-length"
            type="number"
            min={4}
            max={128}
            value={opts.length}
            onChange={(e) =>
              setOpts((o) => ({ ...o, length: Math.min(128, Math.max(4, Number(e.target.value) || 4)) }))
            }
            className="h-8 w-20 text-center"
          />
        </div>
        <input
          type="range"
          min={4}
          max={64}
          value={Math.min(64, opts.length)}
          onChange={(e) => setOpts((o) => ({ ...o, length: Number(e.target.value) }))}
          className="w-full accent-[hsl(var(--ring))]"
          aria-label="Password length slider"
        />
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Toggle
          label="Uppercase (A-Z)"
          checked={opts.upper}
          onChange={(v) => setOpts((o) => ({ ...o, upper: v }))}
        />
        <Toggle
          label="Lowercase (a-z)"
          checked={opts.lower}
          onChange={(v) => setOpts((o) => ({ ...o, lower: v }))}
        />
        <Toggle
          label="Digits (0-9)"
          checked={opts.digits}
          onChange={(v) => setOpts((o) => ({ ...o, digits: v }))}
        />
        <Toggle
          label="Symbols (!@#)"
          checked={opts.symbols}
          onChange={(v) => setOpts((o) => ({ ...o, symbols: v }))}
        />
        <Toggle
          label="Exclude ambiguous"
          checked={opts.excludeAmbiguous}
          onChange={(v) => setOpts((o) => ({ ...o, excludeAmbiguous: v }))}
        />
      </div>

      {noCharset && (
        <p className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-500">
          Enable at least one character set to generate a password.
        </p>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-accent" />
        Generated locally with the Web Crypto API. Nothing is sent anywhere.
      </p>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-2 text-sm transition-colors hover:border-white/20">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[hsl(var(--ring))]"
      />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}
