# Rexer — Architecture, Tech Stack & Design Craft Guidelines

> Designed to eliminate generic AI aesthetic tropes and deliver an editorial, responsive, tactile, and high-performance product experience.

---

## 🛠️ Official Tech Stack & Infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| **AI & Coding Partner** | Claude (Anthropic) / Antigravity | Code architecture, refactoring, and deterministic micro-tool implementation |
| **Hosting & Edge** | Vercel / Netlify / GitHub Pages | Multi-target deployability with static export (`output: "export"`) and edge routing |
| **Source Control** | GitHub | Git workflows, branch protection, CI/CD automated deployment |
| **Backend & Database** | Supabase | Optional PostgreSQL, Auth, Edge Functions, and real-time syncing |
| **Code Review** | CodeRabbit | Automated AI pull request reviews and lint validations |
| **Monetization** | Stripe | Pro tier checkouts, customer billing, and credit bundles |
| **Marketing & Growth** | Sideshift / Social Automations | Content distribution, SEO canonical mapping, and creator workflows |

---

## 🎨 Human-Crafted Design Philosophy (Anti-AI Aesthetic)

This project strictly adheres to craft guidelines benchmarked against **Taste-skill**, **Google Stitch / Impeccable**, **Awesome Design MD**, and **Refero Design Systems**:

### 1. Zero Generic Tropes
- ❌ **No generic purple/blue gradients** across random cards.
- ❌ **No floating vague orb illustrations**.
- ❌ **No flat, lifeless MVP styling** with default browser focus rings or generic card borders.
- ✅ **Bespoke Editorial Color Tokens**: HSL high-contrast dark palette (`#070809` dark background, `#CFFF2E` Rexer Lime, `#FF5A36` Rexer Coral, `#7C5CFF` Rexer Violet, `#38BDF8` Rexer Sky).
- ✅ **Tactile Micro-interactions**: Real-time 3D perspective tilts with dynamic mouse-following radial glare (`perspective(800px) rotateX(...) rotateY(...)`).
- ✅ **Interactive 3D Particle Mesh**: Connected ambient particle mesh overlay that reacts organically to mouse position without bogging down CPU/GPU.

### 2. High-Precision Micro-Animations & Physics
- **Spring Curves**: Smooth, non-linear easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Physical Feedback**: Tactile click states with `active:scale-[0.97]` and dynamic glow elevation on hover (`shadow-glow`, neon border highlights).
- **Smooth 60fps Marquees**: Seamless infinite ticker loops that cleanly pause on user hover.

### 3. Privacy-First Local Execution
- **Zero Uploads**: Image compression, format conversion, PDF manipulation, audio/video slicing, text analysis, and developer utilities operate entirely within the browser memory using Web APIs, canvas, and WebAssembly.
- **Clear Cloud Disclosure**: AI features explicitly disclose cloud execution before use.

---

## 🧪 Quality Suite & E2E Testing

- **Vitest**: Sub-second unit tests validating tool registry integrity.
- **TypeScript**: Strict type-checking (`tsc --noEmit`).
- **ESLint**: Next.js standards and accessibility validation.
- **Playwright CLI & Suite**: Cross-browser automated user journeys and 404 boundary regression tests.
