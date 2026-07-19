import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Registry of FULLY IMPLEMENTED tool components, keyed by slug.
 *
 * Each entry is loaded lazily so the tool detail page stays light — only the
 * specific tool the user opens is shipped. Slugs not listed here render a
 * "coming soon" placeholder (see ToolActionPanel).
 *
 * Add new tools here once implemented. The dynamic import keeps heavy
 * dependencies (e.g. wasm) out of the shared bundle.
 */
export const IMPLEMENTED_TOOLS: Record<string, ComponentType> = {
  "image-converter": dynamic(() => import("@/components/tools/ImageConverter")),
  "whatsapp-dm-generator": dynamic(() => import("@/components/tools/WhatsAppGenerator")),
  "password-generator": dynamic(() => import("@/components/tools/PasswordGenerator")),
};

/** Slugs that have a working implementation. */
export const IMPLEMENTED_SLUGS = new Set(Object.keys(IMPLEMENTED_TOOLS));
