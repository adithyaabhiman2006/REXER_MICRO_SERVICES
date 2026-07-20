# Rexer Micro Services

> A premium, privacy-conscious toolbox for media, PDFs, code, text, finance,
> generators, and AI. Installable as a PWA and deployable as a static site.

## Current state

Rexer is no longer a three-tool shell. The catalog contains **200 unique,
prerendered routes**, with **all 200 catalog routes mapped to interactive tools**. That
includes image and media utilities, working `pdf-lib` workflows, developer and
SEO tools, calculators, generators, browser speech, and cloud-assisted AI
studios.

| Capability | Status |
| --- | --- |
| 200-tool registry and static routes | Complete |
| Fuzzy search and eight category filters | Complete |
| Interactive component mappings | 200 / 200 |
| PDF merge, split, watermark, resize, forms, signatures | Working locally with `pdf-lib` |
| AI writing, code, image, speech, and document studios | Working; cloud use is disclosed in-tool |
| Social media links | TOS-aware original-post assistant; no scraping or bypassing |
| Installable PWA | Versioned shell, route, and asset caches with bounded storage |
| Quality suite | TypeScript, ESLint, Vitest, and Playwright configured |
| GitHub Pages deployment | Automated through `.github/workflows/deploy.yml` |

Specialist routes use bundled browser engines for GIF, EXIF, DOCX, PDF, audio,
video, and image work. Smart-media fallbacks disclose when processing is local
and deterministic instead of presenting it as an undisclosed remote AI model.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run lint` | Run Next.js ESLint rules |
| `npm test` | Run fast Vitest checks |
| `npm run test:e2e` | Run Playwright browser journeys |
| `npm run check` | Run types, lint, and unit tests |
| `npm run format` | Format the repository with Prettier |

## Deploy to GitHub Pages

The deploy workflow is already installed at
`.github/workflows/deploy.yml`. In the GitHub repository, select **Settings →
Pages → Build and deployment → GitHub Actions**. A push to `main` runs the
quality suite, creates the static export, injects the project base path into the
service worker, and publishes `out/`.

Expected project URL:

```text
https://<your-username>.github.io/REXER_MICRO_SERVICES/
```

## Add a tool

On macOS, Linux, WSL, or Git Bash:

```bash
chmod +x gen-tool.sh
./gen-tool.sh my-new-tool
```

Then register the generated component in `components/tools/index.ts` and add
its metadata to `lib/registry/tools.ts`. The script validates kebab-case and
refuses to overwrite an existing component.

## Architecture

```text
app/                         Next.js App Router pages and metadata
components/tools/            Interactive tool components and shared engines
components/CategoryGlyph.tsx Custom category SVG system
lib/registry/tools.ts        Canonical 200-tool catalog
public/sw.js                 Bounded offline/runtime caching
tests/                       Vitest registry checks and Playwright journeys
.github/workflows/deploy.yml Quality-gated GitHub Pages deployment
```

## Privacy model

- Canvas, text, calculator, developer, and compatible PDF operations run in the
  browser without uploading the input.
- AI features require a cloud model. Each AI surface explains what is sent and
  users should not submit secrets or private documents.
- Social tools never scrape protected media or bypass creator/platform download
  controls.
- Third-party CDN engines used by legacy media tools are fetched on demand; the
  user’s source file remains in the browser.

## Next engineering milestones

1. Bundle the legacy CDN-based FFmpeg and PDF.js workers for fully offline first use.
2. Add OCR for scanned PDF-to-DOCX conversion and complex layout reconstruction.
3. Add optional provider-configurable generative media APIs behind explicit consent.
4. Expand Playwright coverage and add accessibility/Lighthouse CI budgets.
5. Replace category-level artwork with dedicated illustrations for every tool.
