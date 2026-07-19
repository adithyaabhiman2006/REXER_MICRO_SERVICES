# Rexer Micro-Tools

> **200 premium, privacy-first micro-tools.** Convert, generate, and transform
> images, PDFs, audio, code, and text — right in your browser. Installable PWA.
> Nothing is uploaded. Nothing is logged.

**Live demo:** once GitHub Pages is enabled (see below) the site is at
`https://adithyaabhiman2006.github.io/REXER_MICRO_SERVICES/`

---

## ✨ What's built so far

| Area | Status |
| --- | --- |
| **200-tool catalog** | ✅ Full registry (media, dev, seo, docs, text, finance, generators, ai) with a dedicated, prerendered page each |
| **Fuzzy search + filters** | ✅ Client-side fuzzy search, category chips with counts |
| **Design system** | ✅ Dark-first glassmorphism, brand gradient (`#0057FF → #00E5FF`), light/dark toggle with persistence |
| **Navigation** | ✅ Desktop sidebar + mobile bottom nav |
| **Working MVP tools** | ✅ **Image Converter** (WebP/HEIC/PNG/JPG), **WhatsApp DM Generator**, **Secure Password Generator** |
| **PWA** | ✅ Manifest, icons, service worker, offline page — installable |
| **SEO** | ✅ Per-page metadata/OG, JSON-LD, sitemap-friendly |
| **Deployment** | ✅ Static export + GitHub Actions workflow |

The remaining tools (197 of 200) render a polished "coming soon" panel and are
on the roadmap below. Adding a new working tool is a single file + one line in
`components/tools/index.ts`.

---

## 🚀 Get your live link (GitHub Pages)

The repo includes a ready-to-use deploy workflow at
[`docs/github-pages-workflow.yml`](./docs/github-pages-workflow.yml). (It lives
in `docs/` because the automation that pushed this code can't write to
`.github/workflows/` directly — see step 1.)

**Setup:**

1. Copy the workflow into place:
   ```bash
   mkdir -p .github/workflows
   cp docs/github-pages-workflow.yml .github/workflows/deploy.yml
   git add .github/workflows/deploy.yml && git commit -m "ci: pages deploy" && git push
   ```
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. The workflow builds the static site and deploys automatically. Your URL:
   `https://<your-username>.github.io/REXER_MICRO_SERVICES/`

> Prefer Vercel/Netlify? Import the repo — it's a zero-config Next.js static
> export. No env vars are required for non-AI tools.

---

## 🧑‍💻 Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (SSG) |
| `npm run start` | Run the production build (server) |
| `npm run typecheck` | TypeScript strict, no-emit |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run format` | Prettier (+ Tailwind class sort) |

### Build a static export locally

```bash
EXPORT_STATIC=1 \
NEXT_PUBLIC_BASE_PATH="" \
NEXT_PUBLIC_APP_URL="https://example.com" \
  npm run build      # → ./out  (serve with: npx serve out)
```

---

## 🗂️ Project structure

```
app/
  layout.tsx              Root layout, fonts, metadata/OG, theme, SW, PWA
  page.tsx                Home: hero + searchable grid
  tools/[slug]/page.tsx   Dynamic tool page (200 prerendered)
components/
  navigation/             Sidebar (desktop) + BottomNav (mobile)
  ui/                     Button, Card, Input, Textarea, Label, Badge
  tools/                  Implemented tools (ImageConverter, WhatsApp, Password…)
  ToolCard, ToolExplorer  Grid + fuzzy search
  ThemeSync, ServiceWorkerRegister
lib/
  registry/tools.ts       ← THE 200-tool registry (edit here)
  search.ts               Dependency-free fuzzy search
  categories.ts           Category → icon + gradient
  faq.ts                  Per-tool FAQ generator
store/useAppStore.ts      Zustand (search, category, theme)
.github/workflows/deploy.yml   Build + deploy to Pages
```

## ➕ Add a new working tool

1. Create `components/tools/MyTool.tsx` (a default-exported React component).
2. Register it in `components/tools/index.ts`:
   ```ts
   "my-tool-slug": dynamic(() => import("@/components/tools/MyTool")),
   ```
3. Ensure the slug exists in `lib/registry/tools.ts`. Done — the page renders it.

## 🔒 Privacy & principles

- Non-AI tools process everything **client-side**. No file uploads.
- AI tools (roadmap) use cloud APIs via env keys only; content is processed
  ephemerally and never stored or logged.
- WCAG AA-minded, keyboard-first, reduced-motion aware.

## 🗺️ Roadmap

1. ✅ Scaffold + navigation + searchable grid
2. ✅ Design system (tokens, themes, polished cards, light/dark)
3. ✅ Fuzzy search over the full registry
4. ✅ All 200 tool routes prerendered
5. ✅ MVP tools: image converter, WhatsApp link, password generator
6. ⏳ Media utilities infra (drag-drop, ffmpeg.wasm worker)
7. ⏳ PDF utilities infra (pdf-lib, OCR via tesseract.js)
8. ✅ PWA (manifest, service worker, offline, icons)
9. ⏳ AI tools framework (rate-limited, provider-agnostic)
10. ⏳ CI/CD quality (Vitest, Playwright, Lighthouse CI)
11. ⏳ Deployment polish (Vercel config, analytics, secrets)
12. ⏳ Handover docs (CONTRIBUTING, tools-registry guide)
