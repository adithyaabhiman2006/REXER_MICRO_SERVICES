"use client";

import { useMemo, useState } from "react";
import { ExternalLink, MessageCircle, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Builds a WhatsApp "click to chat" link (https://wa.me/<number>?text=...).
 * All client-side — no data leaves the browser. Phone is validated and
 * normalized to international digits only.
 */
export default function WhatsAppGenerator() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Keep only digits (and an optional leading + from input), validate length.
  const normalized = useMemo(() => phone.replace(/[^\d]/g, ""), [phone]);
  const isValid = normalized.length >= 8 && normalized.length <= 15;

  const link = useMemo(() => {
    if (!isValid) return "";
    const base = `https://wa.me/${normalized}`;
    return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base;
  }, [normalized, isValid, message]);

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="wa-phone">Phone number (with country code)</Label>
        <Input
          id="wa-phone"
          inputMode="tel"
          placeholder="e.g. +94 77 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-describedby="wa-phone-help"
        />
        <p id="wa-phone-help" className="text-xs text-muted-foreground">
          {phone && !isValid
            ? "Enter a valid number with country code (8–15 digits)."
            : "Digits only are used; spaces and dashes are stripped automatically."}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wa-message">Prefilled message (optional)</Label>
        <Textarea
          id="wa-message"
          rows={4}
          placeholder="Hi! I found your profile and wanted to reach out…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Generated link</Label>
        <div className="glass flex items-center gap-2 rounded-md border-border px-3 py-2.5">
          <code className="flex-1 break-all font-mono text-xs text-foreground">
            {link || <span className="text-muted-foreground">Fill in a valid phone number…</span>}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyLink}
            disabled={!link}
            aria-label="Copy link"
          >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>

      <Button asChild variant="gradient" size="lg" className="w-full">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            Open in WhatsApp
            <ExternalLink className="size-3.5 opacity-70" />
          </a>
        ) : (
          <span className="cursor-not-allowed opacity-60">
            <MessageCircle className="size-4" />
            Enter a valid number
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Opens an official <code className="font-mono">wa.me</code> link. No data is uploaded — the
        link is generated entirely in your browser.
      </p>
    </div>
  );
}
