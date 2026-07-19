# Rexer Micro-Tools

A premium, privacy-first micro-tools platform (200 tools) with client-side
processing wherever possible, a PWA-native feel, and a clean modern UI.

> **Status:** Step 1 of 12 — project scaffold, design foundation, navigation
> shell, and a searchable tool grid (sample 5-item registry) are in place.
> See the roadmap below.

## Principles

- **Privacy-first** — non-AI tools process everything client-side. No file uploads.
- **AI tools** use cloud APIs via env keys only; content is processed ephemerally and never stored or logged.
- **Accessibility (WCAG AA)** and keyboard-first UX.
- **SEO-friendly** with clean meta/OG. Targets: Lighthouse 95+, CLS < 0.1.
- **Legal/TOS** — social media downloaders respect platform TOS; disallowed tools degrade gracefully.

## Tech stack

- **Framework:** Next.js (App Router) + React 18, TypeScript strict
- **Styling:** Tailwind CSS + shadcn/ui (Radix) + Lucide + Framer Motion
- **State:** Zustand
- **PWA:** service worker + manifest (Step 8)
- **AI backends:** Vercel Edge/Serverless, env-driven routing (Step 9)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template (AI keys are optional until Step 9)
cp .env.example .env.local

# 3. Run the dev server
npm run dev          # http://localhost:3000
```

### Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server                 |
| `npm run build`    | Production build                     |
| `npm run start`    | Run the production build             |
| `npm run lint`     | ESLint (next/core-web-vitals)        |
| `npm run typecheck`| TypeScript strict, no-emit           |
| `npm run format`   | Prettier (with Tailwind class sort)  |

## Project structure (Step 1)

```
app/
  globals.css          Design tokens + base styles (dark-first)
  layout.tsx           Root layout, fonts, metadata/OG, theme shell
  page.tsx             Home: hero + searchable tool grid
components/
  navigation/
    Sidebar.tsx        Desktop sidebar (brand, nav, theme toggle)
    BottomNav.tsx      Mobile bottom navigation
  ui/
    button.tsx         Button primitive (incl. `gradient` brand variant)
    card.tsx           Card primitives
  ThemeSync.tsx        Reflects store theme onto <html>
  ToolCard.tsx         Accessible card with hover motion
  ToolExplorer.tsx     Searchable + filterable grid (client-side)
lib/
  utils.ts             cn() + helpers
  registry/tools.ts    Tools registry (5-item sample → 200 in Step 4)
store/
  useAppStore.ts       Zustand store (search, category, theme)
types/
  tools.ts             Tool/Category schema + CATEGORIES
```

## Roadmap

1. ✅ **Step 1** — Scaffold, navigation shell, searchable grid
2. ⏳ **Step 2** — Full design system (tokens, themes, polished ToolCard, light/dark)
3. ⏳ **Step 3** — Fuzzy search + master grid over the registry
4. ⏳ **Step 4** — Route scaffolding for all 200 tools (generator script)
5. ⏳ **Step 5** — MVP tools (image converter, WhatsApp link, password generator)
6. ⏳ **Step 6** — Media utilities infra (drag-drop, ffmpeg.wasm worker loader)
7. ⏳ **Step 7** — PDF utilities infra (pdf-lib, OCR via tesseract.js)
8. ⏳ **Step 8** — PWA (manifest, service worker, offline, iOS splash)
9. ⏳ **Step 9** — AI tools framework (rate-limited, provider-agnostic)
10. ⏳ **Step 10** — CI/CD & quality (ESLint, Vitest, Playwright, Lighthouse CI)
11. ⏳ **Step 11** — Deployment (Vercel, analytics, secrets)
12. ⏳ **Step 12** — Handover docs (README, CONTRIBUTING, tools-registry guide)
