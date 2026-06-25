# Cube Solver — Project State (Living Document)

> **Purpose:** Track what is **actually built** in the repo — structure, files, decisions, and progress. Update this after every meaningful coding session.  
> **Location:** `docs/PROJECT-STATE.md` — see [`README.md`](./README.md) for all documentation.
>
> **Last updated:** June 25, 2026

---

## Document Map

| File | Role |
|------|------|
| [`README.md`](./README.md) | Index — start here for doc navigation |
| [`CONTEXT.md`](./CONTEXT.md) | Full product research, competitors, OpenCV, phases 2–4, SEO strategy |
| [`PHASE-1.md`](./PHASE-1.md) | Short Phase 1 implementation guide (3D, gestures, sound targets) |
| [`PROJECT-STATE.md`](./PROJECT-STATE.md) | **Living build state** — current codebase reality |
| [`repo.md`](./repo.md) | Next.js 16 + Tailwind v4 boilerplate template |

---

## Current Status

| Area | Status |
|------|--------|
| **Phase** | Phase 1 — in progress (boilerplate + UI shell) |
| **Interactive 3D cube (Three.js)** | ❌ Not started |
| **Solver (cubejs)** | ❌ Not started |
| **Gestures / sound** | ❌ Not started (UI hints only) |
| **Next.js app shell** | ✅ Done |
| **Landing + routes** | ✅ Done |
| **Dark theme + responsive layout** | ✅ Done |
| **CSS cube preview (marketing)** | ✅ Done |
| **SEO basics** | ✅ Done (metadata, sitemap, robots, JSON-LD) |
| **Git** | ❌ Not initialized (by choice) |
| **Deploy** | ❌ Not yet |

---

## Tech Stack (Installed)

Matches `repo.md` boilerplate — **no Three.js / cubejs yet** (Phase 1 next step).

```
Next.js 16.2.9     App Router, static export (output: "export")
React 19.2.4
TypeScript 5
Tailwind CSS v4    @import "tailwindcss" in globals.css
lucide-react       Icons
@vercel/analytics  Page analytics in root layout
```

**Planned additions (Phase 1 — not in package.json yet):**

```
three, @react-three/fiber, @react-three/drei
cubejs, zustand, @use-gesture/react, howler.js
```

---

## How to Run

```bash
cd cube-solver
npm install          # already done once
npm run dev          # http://localhost:3000
npm run build        # static export → /out
npm run lint
```

---

## Application Structure

```
cube-solver/
├── docs/                         # All planning & context documents
│   ├── README.md                 # Doc index
│   ├── PROJECT-STATE.md          # This file
│   ├── PHASE-1.md
│   ├── CONTEXT.md
│   └── repo.md
├── app/                          # Next.js App Router (pages)
│   ├── globals.css               # Tailwind v4 + @theme colors + cube animations
│   ├── layout.tsx                # Root shell: Header, Footer, Analytics, metadata
│   ├── page.tsx                  # Landing: Hero + Features + JSON-LD
│   ├── play/page.tsx             # Cube playground (placeholder until Three.js)
│   ├── learn/page.tsx            # Learn hub (links to notation)
│   ├── learn/notation/page.tsx   # Notation 101 (static content)
│   ├── sitemap.ts                # Static sitemap (force-static for export)
│   └── robots.ts                 # robots.txt (force-static for export)
│
├── components/
│   ├── layout/
│   │   ├── header.tsx            # Sticky nav: Play, Learn, Open Cube CTA
│   │   └── footer.tsx            # Footer copy
│   ├── sections/
│   │   └── hero.tsx              # Hero + Features section (landing)
│   ├── ui/
│   │   └── button.tsx            # Link-styled Button (primary/secondary/ghost)
│   └── cube/
│       ├── cube-preview-graphic.tsx   # CSS 3D isometric scrambled cube (decorative)
│       ├── hero-preview-card.tsx      # Landing card wrapping preview + CTA
│       └── play-placeholder.tsx       # /play shell until R3F mounts
│
├── lib/
│   ├── site.ts                   # siteConfig: name, url, description, links
│   ├── utils.ts                  # cn() class name helper
│   └── schema.ts                 # webApplicationSchema() for JSON-LD
│
├── types/
│   └── index.ts                  # WCA_COLORS, MoveFace, CubeMove types
│
├── stores/                       # (empty) Zustand cube state — Phase 1
├── solver/                       # (empty) cubejs Web Worker — Phase 1
├── public/
│   └── sounds/                   # (empty) howler audio files — Phase 1
│
├── next.config.ts                # output: "export", images unoptimized
├── postcss.config.mjs            # @tailwindcss/postcss
├── tsconfig.json                 # strict, paths @/*
├── eslint.config.mjs             # eslint 9 + next config
└── package.json
```

---

## Routes & Pages

| Route | File | What the user sees |
|-------|------|-------------------|
| `/` | `app/page.tsx` | Landing: headline, CTAs, preview card, feature grid |
| `/play` | `app/play/page.tsx` | Cube Playground — preview cube + control shell |
| `/learn` | `app/learn/page.tsx` | Learn hub with link to notation |
| `/learn/notation` | `app/learn/notation/page.tsx` | U/R/F/L/D/B notation cards |
| `/sitemap.xml` | `app/sitemap.ts` | Auto-generated sitemap |
| `/robots.txt` | `app/robots.ts` | Crawler rules |

All pages are **static** (prerendered at build time).

---

## Component Responsibilities

### Layout layer

- **`Header`** — Brand link, nav (`/play`, `/learn`), desktop “Open Cube” CTA
- **`Footer`** — Copyright + phase note
- **`RootLayout`** — Inter font, dark `bg-cube-bg`, wraps all pages

### Landing (`/`)

- **`Hero`** — Headline “Scramble. Play. Solve.”, primary/secondary buttons
- **`HeroPreviewCard`** — Simulator-style card:
  - Green “3D Simulator” pulse + “Scrambled” badge
  - `CubePreviewGraphic` (isometric CSS cube)
  - Scramble / Auto-solve / Play hints
  - “Open interactive cube” CTA
- **`Features`** — 4 cards: WebGL, mobile gestures, sound, optimal solve

### Cube preview (decorative — not the game engine)

- **`CubePreviewGraphic`** — CSS `preserve-3d` isometric cube, 3 faces (U/F/R), WCA scramble colors, float animation. Used on landing + `/play`. **Not interactive.** Replaced on `/play` by Three.js in next build step.

### Play page (`/play`)

- **`PlayPlaceholder`** — Full app shell:
  - “Preview mode” badge + mute toggle (UI only)
  - Large `CubePreviewGraphic`
  - Explainer copy (“not a broken state”)
  - Disabled Scramble/Solve/Reset buttons
  - Move notation chips (U, R, F…)
  - “What’s coming” list (swipe, orbit, pinch, sound)

---

## Design System (`app/globals.css`)

Custom theme tokens in `@theme`:

| Token | Value | Use |
|-------|-------|-----|
| `--color-cube-bg` | `#0f1115` | Page background |
| `--color-cube-surface` | `#15181e` | Cards, panels |
| `--color-cube-border` | `#2d3139` | Borders |
| `--color-cube-muted` | `#9ca3af` | Secondary text |
| `--color-cube-accent` | `#6366f1` | Primary actions (indigo) |

Utility classes: `bg-cube-bg`, `text-cube-muted`, `border-cube-border`, etc.

**Animations:** `.cube-preview-float` — gentle vertical float on preview cube (respects `prefers-reduced-motion`).

**Touch:** `.cube-canvas { touch-action: none }` — ready for Three.js canvas (prevents scroll while dragging).

---

## Configuration Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Static export | `output: "export"` in `next.config.ts` | Same as user's proven boilerplate; deploy anywhere (Vercel, Cloudflare, etc.) |
| No git yet | User request | Init when ready |
| CSS preview vs Three.js on landing | CSS isometric for now | Fast, no bundle bloat; avoids “empty white cube” confusion |
| Site URL | `https://cube-solver.vercel.app` placeholder in `lib/site.ts` | Update when domain chosen |
| Font | Inter (Google) | Matches boilerplate |

---

## Build Changelog

### Session 1 — Research & planning
- Created `CONTEXT.md` — competitor analysis, OpenCV (qbr, cv-cube-solver), phased roadmap
- Created `PHASE-1.md` — Phase 1 scope, mobile-first 3D, gestures/sound checklist
- Analyzed Google AI Studio CUBIX app — decided Three.js over CSS for real 3D

### Session 2 — Boilerplate
- Scaffolded Next.js 16 + Tailwind v4 + TypeScript from `repo.md` pattern
- Added routes: `/`, `/play`, `/learn`, `/learn/notation`
- Added Header, Footer, Hero, Features, Button
- Added SEO: sitemap, robots, JSON-LD schema
- Reserved folders: `components/cube/`, `stores/`, `solver/`, `public/sounds/`
- Verified: `npm run build` + `npm run lint` pass

### Session 3 — Hero / preview redesign
- **Problem:** Landing showed 9 white squares — looked like broken empty cube
- **Fix:** `CubePreviewGraphic` — scrambled WCA colors, 3-face isometric CSS 3D
- **Fix:** `HeroPreviewCard` — simulator card UI with status, badges, CTA
- **Fix:** `PlayPlaceholder` — “Preview mode” label, mute toggle, clearer copy
- Added float animation in `globals.css`

---

## Phase 1 Checklist (from PHASE-1.md)

| Item | Done? |
|------|-------|
| Next.js scaffold + dark theme | ✅ |
| Landing page + SEO | ✅ |
| `/play` route shell | ✅ |
| `/learn/notation` | ✅ (static) |
| Decorative cube preview | ✅ |
| Three.js 3×3 interactive cube | ✅ |
| MoveEngine animation queue | ✅ |
| Scramble | ✅ |
| cubejs solver + Web Worker | ✅ |
| Step playback UI (working) | ✅ |
| Touch gestures | ✅ |
| Sound (Web Audio synth) | ✅ |
| Share URL state | ✅ |
| Deploy to Vercel | ❌ |


---

## Next Build Step (for agents)

Replace `PlayPlaceholder` on `/play` with real Three.js cube:

1. `npm install three @react-three/fiber @react-three/drei cubejs zustand @use-gesture/react howler`
2. `components/cube/CubeScene.tsx` — R3F Canvas, lights, Environment
3. `components/cube/CubeModel.tsx` — 27 cubies, RoundedBox
4. `components/cube/MoveEngine.ts` — animation queue
5. `stores/cube-store.ts` — Zustand state
6. `solver/solver.worker.ts` — cubejs
7. Wire Scramble / Solve / gesture handlers

**Agent prompt prefix:**
```
Read docs/PROJECT-STATE.md and docs/PHASE-1.md. Continue Phase 1 from current checklist.
Do not redo boilerplate. Mount Three.js on /play replacing PlayPlaceholder.
```

---

## Key Files to Edit by Task

| Task | Files |
|------|-------|
| Change site name / URL | `lib/site.ts` |
| Global colors / theme | `app/globals.css` `@theme` block |
| Navigation | `components/layout/header.tsx` |
| Landing copy | `components/sections/hero.tsx` |
| Preview cube look | `components/cube/cube-preview-graphic.tsx` |
| Play page layout | `app/play/page.tsx`, `play-placeholder.tsx` → later `CubeScene.tsx` |
| New route | `app/[route]/page.tsx` |
| SEO metadata per page | `export const metadata` in each `page.tsx` |
| WCA colors / move types | `types/index.ts` |

---

*Update this file whenever structure, dependencies, or shipped features change.*
