# Cube Solver — Project Context Document

> **Purpose:** Living reference for building a modern, SEO-friendly Rubik's Cube web application using AI-assisted ("vibe coding") development. Use this file as the single source of truth when prompting Cursor, Claude, Gemini, or other agents.  
> **Location:** `docs/CONTEXT.md` — see [`docs/README.md`](./README.md) for all documentation.
>
> **Last updated:** June 25, 2026 (expanded: qbr, cv-cube-solver, OpenCV ecosystem; **boilerplate + UI shell built** — see [`PROJECT-STATE.md`](./PROJECT-STATE.md))  
> **Author context:** Builder knows how to solve 2×2 and 3×3 physically; owns mirror cube, 4×4, 5×5 and other shape mods.

---

## Table of Contents

0. [Current Build State](#0-current-build-state) ← **start here for coding**
1. [Vision & North Star](#1-vision--north-star)
2. [Competitive Landscape](#2-competitive-landscape)
3. [Feature Comparison Matrix](#3-feature-comparison-matrix)
4. [Gap Analysis — What We Can Do Better](#4-gap-analysis--what-we-can-do-better)
5. [Technical Feasibility (AI/Vibe Coding)](#5-technical-feasibility-aivibe-coding)
6. [Recommended Tech Stack](#6-recommended-tech-stack)
7. [Phased Roadmap](#7-phased-roadmap)
8. [SEO & Multi-Device Strategy](#8-seo--multi-device-strategy)
9. [Open Source Building Blocks](#9-open-source-building-blocks)
10. [Algorithm & Solver Reference](#10-algorithm--solver-reference)
11. [Physical Cube Scanning (OpenCV) Deep Dive](#11-physical-cube-scanning-opencv-deep-dive)
12. [Multi-Cube Support Strategy](#12-multi-cube-support-strategy)
13. [AI Agent Workflow](#13-ai-agent-workflow)
14. [Risks, Constraints & Honest Limits](#14-risks-constraints--honest-limits)
15. [Success Metrics](#15-success-metrics)
16. [Glossary for New Users (Product Feature)](#16-glossary-for-new-users-product-feature)
17. [CV & OpenCV Reference Projects (Deep Dive)](#17-cv--opencv-reference-projects-deep-dive)

---

## 0. Current Build State

> **Full detail:** [`PROJECT-STATE.md`](./PROJECT-STATE.md) — update after every coding session.

### Quick summary (June 25, 2026)

| Done | Not yet |
|------|---------|
| Next.js 16 + Tailwind v4 + TS boilerplate | Three.js interactive cube |
| Routes: `/`, `/play`, `/learn`, `/learn/notation` | cubejs solver, gestures, sound |
| Dark theme, Header/Footer, landing Hero | Camera scan (Phase 2) |
| CSS isometric cube preview (scrambled colors) | Deploy to Vercel |
| SEO: sitemap, robots, JSON-LD | `git init` |

### Repo layout (actual)

```
app/           → pages & globals.css
components/    → layout/, sections/, ui/, cube/
lib/           → site.ts, utils.ts, schema.ts
types/         → WCA_COLORS, CubeMove
stores/        → (reserved) Zustand
solver/        → (reserved) Web Worker
public/sounds/ → (reserved) audio
```

### Run locally

```bash
npm install && npm run dev   # http://localhost:3000
```

### Agent instruction

Before coding, read **`docs/PROJECT-STATE.md`** + **`docs/PHASE-1.md`**. Do not rebuild boilerplate; continue from Phase 1 checklist.

---

## 1. Vision & North Star

### What we're building

A **browser-first Rubik's Cube platform** that combines:

- **3D interactive cube** — click/drag to rotate faces and orbit the cube
- **Scramble & play** — randomized legal scrambles every time
- **Solve modes** — show algorithms, auto-solve with animation, step-by-step playback
- **Physical cube scanning** — webcam/phone camera → detect colors → optimal move suggestions
- **Education layer** — notation (U, U', R, F2…), beginner guides, algorithm library
- **Multi-cube expansion** — 2×2, 3×3, 4×4, 5×5, mirror/shape mods (phased)

### Why this is achievable with vibe coding

Every major feature already has **proven open-source implementations**. We are not inventing cube theory — we are **composing, polishing and differentiating** existing primitives into a cohesive product. Recent projects (2024–2026) were built entirely with AI agents + modern JS stacks in weeks, not years.

### Differentiation thesis

Most competitors do **one thing well** (scan OR simulate OR teach). Few combine:

1. Beautiful 3D play + solver + learning in one cohesive UX
2. Multiple solve strategies exposed transparently (beginner LBL vs Kociemba optimal vs educational CFOP phases)
3. Honest multi-cube roadmap including shape mods the builder actually owns
4. SEO-optimized content hub around each cube type and notation topic

---

## 2. Competitive Landscape

### Tier 1 — Full-featured modern web apps (direct competitors)

| Site | URL | Core Value Prop | Standout Features | Weaknesses / Gaps |
|------|-----|-----------------|-------------------|-------------------|
| **CubeUnstuck** | cubeunstuck.com | Camera scan → visual 3D solve | Glowing halo turn cues (no notation required), ~22-move solutions, mobile browser scan, auto-recalc on wrong turn, broken-cube diagnostics | 3×3 only; heavy marketing; limited free-play simulator depth |
| **Cubzor** | cubzor.com | All-in-one: scan, practice, learn | No account, CFOP content, timer, practice mode, camera + manual entry | 3×3 solver only (explicitly no 2×2, 4×4, mirror); learning content is blog-style not interactive |
| **RubikSolver** | rubikssolver.pro | 3D control + AI solve | Photo solve, import image, manual + AI solve, share links, client-side only, state validation | Newer site; SEO still building; unclear multi-cube roadmap |
| **Ruwix Solver** | ruwix.com/cube-solver/ | OG cube resource + solver | Camera scan, color picker, scramble input, Kociemba ≤20 moves, step-by-step in new tab | Dated UI; solver UX split across pages; 3×3 focused |
| **OnlineCube** | onlinecube.com | Simulator + solver + timer + tutorial | Random scramble, full-screen, speedcube timer (spacebar hold), Kociemba solver | UI feels legacy; limited camera/scan; tutorial not deeply interactive |
| **CubeSolver.ai** | cubesolver.ai | Multi-size solver | **2×2, 3×3, 4×4** modes, timer, simulator, mobile-friendly, SEO-heavy landing pages | 4×4 solutions are reduction-based not true optimal; no camera scan; no mirror/shape mods |
| **8gwifi Cube Solver** | 8gwifi.org/math/rubiks-cube-solver.jsp | Power-user 3×3 tool | Paste/drop net image, CIE Lab color classification, interactive notation guide with ▶ animate, client-side JS, shareable URL hash state | Academic/utility UI; not a polished product brand; no camera guided flow |

### Tier 2 — Simulators & animation engines (integration targets, not competitors)

| Resource | URL | What it offers | Relevance to us |
|----------|-----|----------------|-----------------|
| **AnimCubeJS** | animcubejs.cubing.net | Gold-standard JS cube animator; supports 2×2–7×7, supercubes; touch + mouse layer twists; embeddable | Can embed for algorithm demos OR we build custom Three.js (more control, better brand) |
| **Grubiks** | grubiks.com | Online puzzles including mirror 4×4, 5×5 shape mods | Proves mirror cube sim is doable; we can reference their approach for shape-mod rendering |
| **csTimer** | cstimer.net | Professional speedcubing timer, WCA scrambles, stats | Benchmark for timer feature; we don't need to replicate full WCA tooling in v1 |

### Tier 3 — Learning & community (content competitors)

| Site | Focus | Notes |
|------|-------|-------|
| **J Perm** (jperm.net) | Best-in-class free tutorials, notation reference | Gold standard for notation UX; we should match clarity, not copy content |
| **CubeSkills** (cubeskills.com) | Feliks Zemdegs tutorials | No new content since ~2020; gap for fresh interactive learning |
| **SolveTheCube** (solvethecube.com) | SEO-heavy beginner guides | Ranks #1 for "how to solve a rubik's cube" (90K monthly searches); hub-and-spoke content model to emulate |
| **LearnCube** / **AICubeTrainer** | Notation guides, AI trainer concepts | Good SEO on long-tail notation keywords |

### Tier 4 — Hardware/smartcube ecosystem (future inspiration)

| Product | What it does | Phase for us |
|---------|--------------|--------------|
| **Cubeast** (cubeast.com) | Bluetooth smartcube analytics, solve breakdown, Academy drills | Phase 4+ if we add BLE smartcube support |
| **GiiKER app** | Manufacturer smartcube companion | Not our market initially |

### Tier 5 — Open-source reference implementations (build from these)

| Repo | Stack | Key learnings |
|------|-------|---------------|
| [jeffhuber/rubiks-solver](https://github.com/jeffhuber/rubiks-solver) | Vite, React 19, TS, R3F, cubejs, Web Worker | **Built with Claude Code**; image net upload → solve; ~332KB gzipped; production-ready patterns |
| [chenguangwei/rubiks-solver](https://github.com/chenguangwei/rubiks-solver) | Same stack + camera input | Guided 6-face camera flow; SVG net editor + 3D viewer |
| [shiarauzo/Rubik-cube-3d](https://github.com/shiarauzo/Rubik-cube-3d) | Vite, TS, Three.js, MediaPipe, cubejs | Hand-tracking gesture control; clean modular architecture |
| [black-leg-nameko/rubik-cube-solver](https://github.com/black-leg-nameko/rubik-cube-solver) | Three.js + cubejs, vanilla JS | Animation queue pattern for smooth layer turns |
| [dmachard/cube-solver-wasm](https://github.com/dmachard/cube-solver-wasm) | Rust → WASM + Three.js | High-performance solver in WASM |
| [FK-75/rubiks-cube-solver](https://github.com/FK-75/rubiks-cube-solver) | Python, OpenCV, Kociemba, PyOpenGL | Full pipeline: scan → solve → 3D visualize (desktop) |
| [Szostak21/Cube_Solver](https://github.com/Szostak21/Cube_Solver) | C++17, OpenCV, Python kociemba | HSV clustering with capacity-aware assignment (9 per color) |
| [JayPatel1309/CamCube](https://github.com/JayPatel1309/CamCube) | OpenCV + Teachable Machine AI | ML-based color detection alternative to HSV thresholds |
| **[kkoomen/qbr](https://github.com/kkoomen/qbr)** ⭐ | Python 3, OpenCV, kociemba, CIEDE2000 | **659★ — top Google result.** Best-in-class desktop webcam scanner; calibrate mode; multilingual; human-readable moves |
| **[raymondtruong/cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver)** ⭐ | Flask, OpenCV (CIELAB), kociemba, TwistySim JS | **Web app pattern we should study.** Browser captures 6 images → Python backend classifies → 3D solve UI. [Live demo](https://raymondtruong.pythonanywhere.com/) |
| [dwalton76/rubiks-color-resolver](https://github.com/dwalton76/rubiks-color-resolver) | Python, CIEDE2000, TSP | Color resolver used by qbr lineage; supports 2×2–7×7; edge/corner constraint matching |
| [dwalton76/rubiks-cube-tracker](https://github.com/dwalton76/rubiks-cube-tracker) | OpenCV contours | Locates cube in image/video; outputs RGB per square; pairs with color-resolver |
| [VinitKumarGupta/rubik-cube-solver](https://github.com/VinitKumarGupta/rubik-cube-solver) | OpenCV + Random Forest (LAB) + gTTS | ML color detection with voice-guided solve; 3900+ training samples |
| [HaginCodes/3x3x3-Rubiks-Cube-Solver](https://github.com/HaginCodes/3x3x3-Rubiks-Cube-Solver) | OpenCV | Inspiration source for qbr's improved color detection |

---

## 3. Feature Comparison Matrix

| Feature | CubeUnstuck | Cubzor | Ruwix | CubeSolver.ai | 8gwifi | **Our Target** |
|---------|:-----------:|:------:|:-----:|:-------------:|:------:|:--------------:|
| 3D interactive cube | ✅ | ✅ | ⚠️ basic | ✅ | ✅ | ✅ **v1** |
| Click/drag face rotation | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ **v1** |
| Random scramble | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **v1** |
| Auto-solve animation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **v1** |
| Step-by-step playback | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **v1** |
| Manual color entry | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **v1** |
| Camera scan (6 faces) | ✅ best | ✅ | ✅ | ❌ | ❌ | ✅ **v2** |
| Image/net import | ⚠️ | ⚠️ | ❌ | ❌ | ✅ best | ✅ **v2** |
| Visual turn cues (no notation) | ✅ unique | ⚠️ | ❌ | ❌ | ⚠️ | ✅ **v2** |
| Notation education | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ **v1** |
| Algorithm library | ❌ | ✅ CFOP | ⚠️ | ❌ | ✅ | ✅ **v2** |
| Speedcube timer | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ **v2** |
| 2×2 support | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ **v2** |
| 4×4 / 5×5 support | ❌ | ❌ | ❌ | ✅ 4×4 | ❌ | ✅ **v3** |
| Mirror / shape mods | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **v3** |
| Multiple solve algorithms exposed | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✅ **differentiator** |
| OpenCV physical scan | ❌ web | ❌ web | ⚠️ web | ❌ | ❌ | ✅ **v2–v3** |
| Shareable cube state URL | ⚠️ | ❌ | ❌ | ❌ | ✅ | ✅ **v1** |
| Mobile responsive | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ **v1** |
| No account required | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **v1** |
| SEO content hub | ⚠️ | ✅ | ✅ | ✅ strong | ❌ | ✅ **v1** |

---

## 4. Gap Analysis — What We Can Do Better

### Opportunities nobody owns fully

1. **Transparent solver modes** — Let users pick: "Beginner (layer-by-layer steps)", "Fast (Kociemba ~20 moves)", "Educational (show CFOP phases)". Competitors hide the algorithm choice.

2. **Multi-cube hub** — One brand covering 2×2 → 5×5 + mirror, with consistent UX. CubeSolver.ai is closest but lacks scan, polish and shape mods.

3. **Scan + Play + Learn trinity** — CubeUnstuck nails scan; Cubzor nails learn; nobody nails all three with modern design.

4. **Builder's authentic voice** — Content from someone who physically owns and solves mirror/4×4/5×5 cubes, not generic AI filler.

5. **Algorithm explorer** — Interactive "what does R U R' U' do?" with 3D animation per move. 8gwifi has seeds of this; we make it delightful.

6. **Vibe-coded velocity** — Ship Phase 1 in days using proven OSS, iterate publicly, SEO from day one.

---

## 5. Technical Feasibility (AI/Vibe Coding)

### Verdict: **120% achievable** for core product; **90% achievable** for full vision

| Feature Area | Feasibility | Confidence | Why |
|--------------|-------------|------------|-----|
| 3D cube rendering + interaction | ✅ High | 95% | Three.js / R3F patterns are mature; dozens of working repos |
| Scramble generation | ✅ High | 99% | WCA-compliant scrambles are standardized; libraries exist |
| 3×3 optimal solve (Kociemba) | ✅ High | 99% | `cubejs` npm package, battle-tested |
| 3×3 beginner solve (LBL) | ✅ High | 90% | Layer-by-layer is well-documented; more code to write but straightforward |
| Step-by-step animation playback | ✅ High | 95% | Animation queue + move engine pattern proven |
| Manual color input + validation | ✅ High | 95% | Color counts, parity, reachability checks are standard |
| Image/net import parsing | ✅ Medium-High | 85% | jeffhuber/rubiks-solver proves it; CIE Lab classification works |
| Browser camera 6-face scan | ✅ Medium | 80% | Harder than desktop OpenCV but CubeUnstuck/Cubzor prove it's doable in browser (likely TensorFlow.js or canvas sampling + HSV) |
| Python OpenCV desktop scan | ✅ High | 90% | Multiple GitHub repos; can be Phase 2b sidecar or future native app |
| 2×2 solver | ✅ High | 90% | Simpler state space; IDA* or dedicated 2×2 solver libs |
| 4×4/5×5 reduction solver | ✅ Medium | 75% | Reduction + 3×3 finish + parity algorithms; not optimal but functional |
| Mirror cube (3×3 shape mod) | ✅ Medium | 70% | Same mechanism as 3×3; UI shows shape/height instead of color; scan is hard |
| SEO static pages + interactive app | ✅ High | 95% | Next.js or Astro + React islands is proven pattern |
| Mobile responsive 3D | ✅ Medium-High | 85% | Touch gestures need tuning; AnimCubeJS proves it works |

### What AI agents are especially good at here

- Scaffolding React + Three.js projects from reference repos
- Implementing move notation parsers and animation queues
- Building responsive UI components and SEO page templates
- Wiring cubejs solver into Web Workers
- Writing layer-by-layer educational content with interactive demos
- Iterating on OpenCV HSV threshold tuning (with test images)

### What needs human judgment

- Color calibration for YOUR lighting and cube brands
- UX flow for camera scanning (which face first, orientation hints)
- Visual design / brand identity
- Correctness testing with physical cubes
- SEO keyword prioritization based on analytics

---

## 6. Recommended Tech Stack

### Frontend (primary — ship fast)

```
Framework:     Next.js 15 (App Router) — SSR/SSG for SEO + client interactivity
Language:      TypeScript (strict)
3D:            Three.js + @react-three/fiber + @react-three/drei
Solver:        cubejs (Kociemba two-phase) in Web Worker
State:         Zustand or Jotai (cube state, UI state)
Styling:       Tailwind CSS 4
Animation:     Custom move queue on Three.js groups (proven pattern)
Testing:       Vitest + Playwright (E2E for solve correctness)
Deploy:        Vercel (free tier → Pro when traffic grows)
Analytics:     Plausible or Umami (privacy-friendly, lightweight)
```

### Why Next.js over plain Vite SPA

- **SEO:** Server-rendered landing pages, per-cube-type routes, blog/learn section
- **Performance:** Static generation for content; hydrate only the 3D interactive island
- **Sharing:** URL hash or query param for cube state (like 8gwifi)

### Computer vision (Phase 2)

After analyzing [qbr](https://github.com/kkoomen/qbr) and [cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) (top Google results for OpenCV cube solving), we have three viable architectures:

**Option A — Browser-native (recommended for public web product):**
```
Camera:        navigator.mediaDevices.getUserMedia
Processing:    Canvas API crop + CIELAB/HSV sampling per facelet
               OR TensorFlow.js model (Teachable Machine approach)
Validation:    User confirms each face before proceeding
Solver:        cubejs in Web Worker (client-side)
```

**Option B — Hybrid web (cv-cube-solver pattern — best of both worlds):**
```
Frontend:      Next.js captures 6 face images via webcam (base64)
Backend:       FastAPI or Flask receives images
CV:            OpenCV CIELAB classification (port raymondtruong/main.py logic)
Solver:        kociemba (Python) OR return state to frontend for cubejs
3D UI:         React Three Fiber step-by-step playback
```
This is exactly what [cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) does — proven since 2018, [live demo](https://raymondtruong.pythonanywhere.com/) still running.

**Option C — Desktop OpenCV (qbr pattern — highest scan accuracy):**
```
Stack:         Python 3 + OpenCV + kociemba (see qbr requirements.txt)
Detection:     Canny edge + contour detection + CIEDE2000 color distance
Calibration:   Per-cube color calibration mode (99.9% accuracy claim)
UX:            OpenCV HighGUI window; 2D net preview; human-readable moves (-n flag)
Deploy:        Phase 2b local tool OR Electron wrapper; optional API for web app
```

**Recommendation (updated):**
1. **Phase 1:** Manual entry + image/net upload (jeffhuber pattern, CIELAB in browser)
2. **Phase 2a:** Guided 6-face browser scan (Canvas + CIELAB, no backend)
3. **Phase 2b:** FastAPI scan endpoint porting [cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) `main.py` if browser accuracy insufficient
4. **Phase 2c:** Study [qbr](https://github.com/kkoomen/qbr) calibrate mode + CIEDE2000 for the accuracy layer; port calibration UX to web

### Solver libraries by cube type

| Cube | Library / Approach |
|------|-------------------|
| 3×3 optimal | `cubejs` (JS) or `kociemba` (Python) |
| 3×3 beginner LBL | Custom implementation following known algorithms |
| 2×2 | `cubejs` 2×2 mode or `twox-two-solver` |
| 4×4 / 5×5 | Reduction method: solve centers → pair edges → solve as 3×3 + parity fixes |
| Mirror 3×3 | Same as 3×3; map shape heights to pseudo-colors internally |

---

## 7. Phased Roadmap

### Phase 1 — "Go Live" MVP (Target: 1–2 weeks vibe coding)

**Goal:** Deployable URL you can share on social media. Proves the core loop.

| Feature | Details |
|---------|---------|
| 3×3 3D cube | Drag to orbit, click/tap face to rotate layer |
| Scramble | WCA-style random legal scramble button |
| Free play | Manual moves via UI buttons + keyboard (U R F etc.) |
| Auto-solve | Kociemba via cubejs, animated playback |
| Step playback | Prev / Next / Play / Pause / speed control |
| Manual input | Color picker on 2D net OR click stickers on 3D |
| State validation | Reject impossible cube states with helpful errors |
| Share link | Encode cube state in URL |
| Learn: Notation 101 | Static + interactive page: U, U', R, F2, wide moves, slice moves |
| Landing page | SEO-optimized hero, feature highlights, CTA to simulator |
| Responsive | Works on phone (touch rotate), tablet, desktop |

**Not in Phase 1:** Camera scan, 2×2/4×4, timer, accounts.

**Deploy:** `cube-solver.vercel.app` or custom domain.

---

### Phase 2 — "Real Cube Helper" (Target: +2–3 weeks)

| Feature | Details |
|---------|---------|
| Camera scan flow | Guided 6-face capture with overlay grid; use **qbr scan protocol** with animated 3D orientation hints |
| Image upload | Flat net image → CIELAB auto-detect (jeffhuber/cv-cube-solver pattern) |
| 2D net confirmation | Live preview + snapshot panels (qbr UX) before solve |
| Calibrate mode | Per-cube color calibration saved to localStorage (port qbr `c` mode) |
| Hybrid scan API | Optional FastAPI endpoint porting [cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) `main.py` for harder lighting |
| Visual solve mode | Glowing face highlight + arrow (CubeUnstuck-style) for non-notation users |
| Human-readable mode | qbr `-n` style: "Turn the right side a quarter turn away from you" |
| Notation solve mode | Traditional R U R' display for advanced users |
| Beginner solver | Layer-by-layer algorithm with phase labels ("Step 3: Second Layer") |
| Algorithm explorer | Searchable library; click ▶ to animate on 3D cube |
| 2×2 cube | Full simulator + solver |
| Speedcube timer | Hold spacebar to start, WCA scramble integration |
| SEO expansion | Pages: `/learn/notation`, `/learn/beginner-method`, `/solver/2x2`, `/solver/3x3` |

---

### Phase 3 — "Multi-Cube Master" (Target: +3–4 weeks)

| Feature | Details |
|---------|---------|
| 4×4 simulator + reduction solver | Centers → edges → 3×3 + parity |
| 5×5 simulator + reduction solver | Same pattern, more centers |
| Mirror cube 3×3 | Shape-based rendering (RoundedBoxGeometry with varying scales) |
| Mirror 4×4 / 5×5 | Shape mod on big cube mechanics |
| Fancy shape mods | Pyraminx, Megaminx (stretch goal) |
| OpenCV Python tool | Optional desktop scanner with better accuracy than browser |
| Compare solve methods | Side-by-side: "Kociemba: 19 moves" vs "Beginner: 87 moves" |

---

### Phase 4 — "Platform" (Future)

- User accounts + save solve history
- Bluetooth smartcube integration (Cubeast-style analytics)
- Community scrambles / daily challenge
- Embeddable widget for bloggers (backlink SEO play)
- PWA / offline mode
- API for developers

---

## 8. SEO & Multi-Device Strategy

### High-value keywords (from competitor research)

| Keyword | Est. Monthly Volume | Intent | Our Page |
|---------|--------------------:|--------|----------|
| how to solve a rubik's cube | 90,500 | Learn | `/learn/beginner` |
| rubik's cube solver | 74,000 | Tool | `/solver` (homepage) |
| rubiks cube algorithm | 12,100 | Learn | `/learn/algorithms` |
| cube solver | 8,100 | Tool | `/solver` |
| rubik's cube solver 2x2 | 2,400+ | Tool | `/solver/2x2` |
| rubik's cube solver 4x4 | 1,600+ | Tool | `/solver/4x4` |
| rubik's cube notation | 5,000+ | Learn | `/learn/notation` |
| rubik's cube timer | 3,000+ | Tool | `/timer` |
| mirror cube how to solve | 1,000+ | Learn | `/learn/mirror-cube` |

### Site architecture (hub-and-spoke)

```
/                          → Landing + 3D demo
/solver                    → 3×3 solver (main tool)
/solver/2x2
/solver/4x4
/solver/5x5
/solver/mirror
/play                      → Free-play simulator (no solve)
/scan                      → Camera scan flow
/learn                     → Learning hub
/learn/notation
/learn/beginner-method
/learn/cfop
/learn/mirror-cube
/learn/4x4
/algorithms                → Searchable algorithm library
/timer                     → Speedcube timer
/blog                      → SEO articles (optional Phase 2)
```

### Technical SEO checklist

- [ ] SSR/SSG for all content pages (Next.js)
- [ ] Unique `<title>` and `<meta description>` per route
- [ ] JSON-LD `WebApplication` + `FAQPage` schema on solver pages
- [ ] Open Graph images (auto-generated cube state screenshots)
- [ ] `sitemap.xml` + `robots.txt`
- [ ] Core Web Vitals: LCP < 2.5s (lazy-load Three.js), CLS < 0.1
- [ ] Mobile-first responsive design
- [ ] Canonical URLs, clean slugs
- [ ] Internal linking between learn ↔ solver ↔ algorithms

### Responsive design requirements

| Breakpoint | UX |
|------------|-----|
| Mobile (< 640px) | Full-width 3D canvas, bottom toolbar for moves, swipe to orbit |
| Tablet (640–1024px) | Side panel for notation/controls, larger touch targets |
| Desktop (> 1024px) | Split view: 3D cube left, controls/algorithms right |

---

## 9. Open Source Building Blocks

### Must-study repos before coding

**Phase 1 (3D + solve):**
1. **jeffhuber/rubiks-solver** — Closest to our Phase 1–2 target. React + R3F + cubejs + CIELAB image parsing.
2. **black-leg-nameko/rubik-cube-solver** — Clean animation queue in vanilla Three.js. Port the `MoveEngine` pattern.

**Phase 2 (physical cube scanning):**
3. **kkoomen/qbr** — Run locally first. Gold standard for scan UX, calibrate mode, human-readable output. Clone and test with your physical cubes before building web version.
4. **raymondtruong/cv-cube-solver** — Study `main.py` (~200 lines). This is the FastAPI backend blueprint. Try the [live demo](https://raymondtruong.pythonanywhere.com/).
5. **dwalton76/rubiks-color-resolver** — When simple LAB distance fails, use constraint-based color assignment.

**Reference:**
6. **AnimCubeJS** — Gesture handling and multi-cube size support.
7. **chenguangwei/rubiks-solver** — Browser camera 6-face flow.

### Key npm packages

```json
{
  "three": "^0.170.0",
  "@react-three/fiber": "^8.17.0",
  "@react-three/drei": "^9.117.0",
  "cubejs": "^1.3.0",
  "zustand": "^5.0.0",
  "next": "^15.0.0",
  "tailwindcss": "^4.0.0"
}
```

### Architecture sketch (Phase 1)

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing
│   ├── solver/page.tsx     # Main 3×3 solver
│   └── learn/notation/     # Education pages
├── components/
│   ├── cube/
│   │   ├── CubeScene.tsx   # R3F canvas wrapper
│   │   ├── CubeModel.tsx   # 27 cubies, materials
│   │   ├── MoveEngine.ts   # Animation queue
│   │   └── FaceletMap.ts   # Sticker ↔ 3D mapping
│   ├── ui/                 # Buttons, color picker, playback controls
│   └── learn/              # Interactive notation demos
├── lib/
│   ├── notation.ts         # Parse "R U R' U'" → Move[]
│   ├── scrambler.ts        # WCA scramble generation
│   ├── validator.ts        # Cube state validation
│   └── url-state.ts        # Encode/decode cube in URL
├── solver/
│   ├── solver.worker.ts    # cubejs in Web Worker
│   └── solver-client.ts    # Worker proxy
└── stores/
    └── cube-store.ts       # Zustand: cube state, history, mode
```

---

## 10. Algorithm & Solver Reference

### Solve strategies to expose in the app

| Method | Type | Move Count | Best For | Implementation |
|--------|------|------------|----------|----------------|
| **Kociemba (Two-Phase)** | Optimal/near-optimal | ≤20 (HTM) | "Just solve it" | `cubejs` — Phase 1 |
| **Layer-by-Layer (LBL)** | Beginner intuitive | 80–120 | Learning how cubes work | Custom — Phase 2 |
| **CFOP** | Speedcubing | 50–60 | Intermediate speed | Phase library — Phase 2 |
| **IDA* / Brute force** | Educational demo | Optimal (slow) | "See how search works" | Optional demo — Phase 3 |
| **Reduction (4×4+)** | Big cube standard | Varies | 4×4, 5×5 | Custom — Phase 3 |

### Kociemba vs "optimal"

- **Kociemba two-phase:** Finds solutions in ≤20 moves (half-turn metric) in milliseconds. This is what all major online solvers use. "Optimal" in practice.
- **God's number:** 20 is proven maximum for 3×3 HTM. Kociemba usually finds 19–22.
- **True optimal (brute force / IDA*):** Can take seconds to minutes. Good for education ("watch the search") but not for UX.
- **Our approach:** Default to Kociemba. Optional "tighten search" button (jeffhuber pattern: iteratively reduce maxDepth). Optional "beginner mode" shows LBL.

### Standard notation (implement fully)

```
Face turns:     R L U D F B
Prime (CCW):    R' L' U' D' F' B'
Double:         R2 U2 etc.
Wide:           r l u d f b  (or Rw Lw etc.)
Slice:          M E S
Cube rotation:  x y z
```

---

## 11. Physical Cube Scanning (OpenCV) Deep Dive

### The problem

A single camera photo cannot see all 54 stickers. You must capture **6 faces sequentially** while maintaining cube orientation between shots. Both [qbr](https://github.com/kkoomen/qbr) and [cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) enforce strict orientation protocols — this is not optional.

### Proven pipeline (synthesized from qbr + cv-cube-solver + ecosystem)

```
1. GUIDE user through a fixed scan order (see qbr protocol below)
2. OVERLAY a 3×3 grid on the camera feed (live preview + snapshot)
3. SAMPLE color at center of each grid cell (not edges — lighting artifacts)
4. CLASSIFY using CIELAB/CIEDE2000 (best) or HSV (faster)
5. ANCHOR colors via center stickers (cv-cube-solver pattern)
6. ENFORCE constraints: exactly 9 stickers per color, valid centers
7. SHOW 2D net preview for user confirmation (qbr bottom-right panel)
8. LET USER retry any face (SPACE to resnap in qbr)
9. BUILD 54-char cube string in Kociemba order (URFDLB)
10. VALIDATE reachability (parity, corner orientation)
11. SOLVE with Kociemba
12. DISPLAY step-by-step: notation OR human-readable (qbr -n flag)
```

### qbr scan orientation protocol (copy this UX)

[qbr](https://github.com/kkoomen/qbr) uses a strict rotation sequence — **automatic side detection relies on this**:

1. Start: **green front**, **white top** → scan green
2. Rotate horizontally 90° → scan blue, red, orange (4 side faces)
3. Return to green front, white top
4. Tilt forward 90° → **white faces camera** → scan white
5. Return to start, tilt backward 90° → **yellow faces camera** → scan yellow
6. Press ESC → solution computed (~20 moves typical)

**Our web app should:** show animated 3D cube demonstrating exactly how to rotate between faces (major UX upgrade over qbr's text instructions).

### Color classification approaches (ranked by accuracy)

| Method | Used By | How It Works | Best For |
|--------|---------|--------------|----------|
| **CIELAB + Euclidean ΔE** | cv-cube-solver | Convert BGR→LAB; compare midpoint of each 48×48 cell to 6 center-anchor colors | Web backend; simple, fast |
| **CIEDE2000** | qbr, dwalton76/rubiks-color-resolver | Perceptually uniform color distance; industry standard | Highest accuracy; stickerless cubes |
| **HSV thresholds** | FK-75, Tarun-Nandi, Szostak21 | Fixed hue/sat/value ranges per color | Quick prototypes; controlled lighting |
| **Capacity-aware greedy** | Szostak21, dwalton76 | Assign closest color but enforce exactly 9 per face color | Fixing misreads after initial classification |
| **Random Forest on LAB** | VinitKumarGupta | ML classifier trained on 3900+ samples | Variable lighting; needs training phase |
| **Teachable Machine / TF** | CamCube, JayPatel1309 | Custom neural net per user environment | Mobile camera; highest flexibility |

**Recommended stack for us:** CIELAB center-anchor (cv-cube-solver) + CIEDE2000 fallback (qbr) + manual correction UI (always).

### cv-cube-solver technical breakdown (our hybrid backend blueprint)

[raymondtruong/cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) `main.py` is only ~200 lines and maps directly to a FastAPI endpoint:

```python
# Simplified flow from main.py:
1. Receive 6 base64 images from browser (Flask POST /preview)
2. decode_image() → cv2.imdecode → cv2.COLOR_BGR2LAB → crop to 144×144 (3×3 grid of 48×48 cells)
3. standardize_colour_scheme() → read center sticker LAB of each face → anchor g,o,b,r,y,w
4. identify_colour() → Euclidean distance in LAB space vs 6 anchors
5. generate_net() → map 6 face arrays to URFDLB 54-char string
6. kociemba.solve(state) → return solution string
7. visualize_net() → rearrange for TwistySim JS 3D renderer
```

**Key insight:** Color detection runs server-side OpenCV, but capture + 3D playback stays in the browser. This is the architecture to copy for Phase 2b.

**Dependencies:** `flask`, `kociemba`, `opencv-python`, `numpy` (see repo requirements.txt)

**Limitations to fix in our version:**
- Uses deprecated `np.fromstring` — use `np.frombuffer`
- No per-cube calibration mode (qbr has this)
- No live webcam — user uploads/captures 6 static images
- TwistySim is dated — replace with our React Three Fiber viewer
- Flask dev server only — use FastAPI + proper deployment

### qbr technical breakdown (our accuracy benchmark)

[kkoomen/qbr](https://github.com/kkoomen/qbr) is the most mature **desktop** scanner (659★, actively maintained through 2026):

| Feature | Implementation | Port to our app? |
|---------|----------------|------------------|
| Live webcam preview | OpenCV `VideoCapture` + 3×3 grid overlay | Phase 2a (browser getUserMedia) |
| Live + snapshot displays | Two 9-sticker panels (preview vs saved) | ✅ Yes — critical UX |
| 2D full cube state preview | Bottom-right net visualization | ✅ Yes — before solve |
| Calibrate mode (`c` key) | User shows each color; saves custom profile | ✅ Yes — Phase 2c killer feature |
| Auto side detection | Center piece color → which face is being scanned | ✅ Yes |
| CIEDE2000 color distance | `delta-e` / `ciede2000` topics on repo | Port to Python backend or JS lib |
| Canny edge cube detection | Contour-based face localization | Phase 3 (auto-align grid) |
| Human-readable output (`-n`) | "Turn the right side a quarter turn away from you" | ✅ Yes — matches CubeUnstuck visual mode |
| Multilingual UI | `python-i18n`, 10 languages | Phase 3 i18n |
| MIT license | Free to study and adapt | ✅ |

**qbr dependencies:** `kociemba==1.2.1`, `opencv-python==4.8.1.78`, `numpy`, `pillow`, `python-i18n`

### Browser vs Python vs Hybrid (updated decision matrix)

| Approach | Pros | Cons | When to use |
|----------|------|------|-------------|
| **Browser (Canvas + CIELAB)** | No install, phone camera, SEO-friendly | Less robust in bad lighting | Phase 2a default |
| **Browser (TensorFlow.js)** | Adaptable per user | Training overhead | If calibration isn't enough |
| **Python desktop (qbr)** | Best accuracy, calibrate mode, offline | Not a web product; OpenCV GUI | Phase 2c dev tool; accuracy reference |
| **Hybrid (cv-cube-solver)** | OpenCV accuracy + web UX + mobile camera | Needs backend hosting (~$5/mo) | Phase 2b if browser scan fails QA |
| **dwalton76 pipeline** | Supports up to 7×7 color resolution | Complex; robotics-oriented | Phase 3 big cube scanning |

### Color detection tips (critical for success)

- Use **CIELAB**, not raw RGB (cv-cube-solver, jeffhuber, VinitKumarGupta all converge on this)
- **Anchor from center stickers** of each scanned face — centers are fixed on real cubes
- Sample **center of facelet** (pixel 24,24 in a 48×48 cell), not edges
- Use **capacity-aware assignment**: exactly 9 stickers per color (Szostak21 + dwalton76)
- Offer **calibrate mode** like qbr — single biggest accuracy improvement
- Always show **2D net preview** before solving — let user fix misreads
- Support **human-readable moves** for beginners (qbr `-n` flag pattern)
- Test with: GAN, MoYu, Rubik's brand, stickerless cubes, your mirror cube (manual only)

### Reference implementations — priority order

| Priority | Repo | Use for |
|----------|------|---------|
| 1 | [jeffhuber/rubiks-solver](https://github.com/jeffhuber/rubiks-solver) | Browser image parsing (CIELAB), Phase 1–2a |
| 2 | [raymondtruong/cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) | Hybrid backend API design, Phase 2b |
| 3 | [kkoomen/qbr](https://github.com/kkoomen/qbr) | Scan UX, calibrate mode, CIEDE2000, human-readable moves |
| 4 | [dwalton76/rubiks-color-resolver](https://github.com/dwalton76/rubiks-color-resolver) | Robust color→face assignment with constraints |
| 5 | [FK-75/rubiks-cube-solver](https://github.com/FK-75/rubiks-cube-solver) | Python scan → 3D OpenGL playback reference |
| 6 | [chenguangwei/rubiks-solver](https://github.com/chenguangwei/rubiks-solver) | Browser camera 6-face flow |

---

## 12. Multi-Cube Support Strategy

### 2×2 (Phase 2)

- 8 corners, no edges/centers
- Simpler state space (~3.6M positions)
- Same 3D engine, fewer cubies
- Solver: dedicated 2×2 optimal solver

### 4×4 / 5×5 (Phase 3)

- **Reduction method:** Solve centers → pair edges → solve as 3×3
- **Parity cases:** 4×4 has 2 edge parity cases OLL parity + PLL parity
- 3D engine: inner slice moves (wide moves r, l, u, d, f, b)
- AnimCubeJS supports up to 7×7 — study its move notation for big cubes

### Mirror cube (Phase 3)

- **Mechanism:** Identical to 3×3; pieces differ by size not color
- **UI approach:** Render with `RoundedBoxGeometry` or varying cube scales; all stickers same metallic color; solve by mapping piece heights to pseudo-colors
- **Physical scan:** Very hard (no color). Manual shape assignment or user maps thinnest layer = "white"
- **Grubiks** has online mirror 4×4/5×5 — reference for rendering

### Other fancy cubes (Phase 4+)

| Cube | Mechanism | Priority |
|------|-----------|----------|
| Pyraminx | Tetrahedral | Medium |
| Megaminx | Dodecahedral | Low (complex 3D) |
| Skewb | Corner-turning | Low |
| Fisher cube | 3×3 shape mod | Medium |

---

## 13. AI Agent Workflow

### Recommended agent roles

| Agent | Tool | Responsibility |
|-------|------|----------------|
| **Architect** | Claude / Cursor | Read `docs/CONTEXT.md`, scaffold project, define interfaces |
| **3D Builder** | Cursor | Three.js cube rendering, MoveEngine, animations |
| **Solver Dev** | Cursor | cubejs integration, Web Worker, validation |
| **UI/UX** | Cursor + v0.dev | Responsive layout, controls, playback UI |
| **Content/SEO** | Claude / Gemini | Learn pages, meta tags, algorithm descriptions |
| **CV Engineer** | Cursor + Python | Camera scan, color detection (Phase 2) |
| **QA** | You + physical cubes | Test every solve against real cube |

### Prompting guidelines for agents

Always include in prompts:
```
Read docs/PROJECT-STATE.md and docs/PHASE-1.md first. Follow the phased roadmap. 
Match existing code style. Use TypeScript strict mode.
Reference jeffhuber/rubiks-solver patterns for cube logic.
Do not add features outside the current phase.
```

### Suggested Cursor prompt (Phase 1 — Three.js next)

```
Read docs/PROJECT-STATE.md and docs/PHASE-1.md.

Mount Three.js on /play replacing PlayPlaceholder:
1. Interactive 3×3 cube (drag orbit, click face to turn)
2. Scramble button (WCA-compliant)
3. Auto-solve with cubejs in a Web Worker
4. Animated step-by-step playback + touch gestures + sound
5. Keyboard shortcuts (U R F L D B with shift for prime)

Use the architecture in docs/CONTEXT.md section 9.
```

---

## 14. Risks, Constraints & Honest Limits

| Risk | Severity | Mitigation |
|------|----------|------------|
| Camera color detection accuracy | High | Manual fallback always; user confirmation per face |
| 4×4/5×5 solver quality | Medium | Set expectations: "reduction method, not optimal" |
| Mirror cube scanning | High | No scan in v1; pseudo-color mapping for simulator only |
| Three.js bundle size | Medium | Code-split 3D viewer; lazy load on interaction |
| SEO competition | Medium | Long-tail keywords first; interactive tools earn backlinks |
| Mobile 3D performance | Medium | Reduce cubie geometry complexity on mobile; cap pixel ratio |
| AI-generated code bugs | Medium | Physical cube testing after every solver change |
| Trademark "Rubik's" | Low | Use "twisty puzzle" / "speedcube" in SEO; avoid trademark in domain |

### Out of scope (be honest with users)

- Solving **physically impossible** cube states (detached pieces, swapped stickers)
- **Optimal** 4×4/5×5 solutions (computationally infeasible in browser)
- **Real-time** AR overlay on physical cube (Phase 4+ at earliest)
- Replacing **csTimer** for competition speedcubers (different audience)

---

## 15. Success Metrics

### Phase 1 launch

- [ ] Live URL accessible worldwide
- [ ] 3×3 scramble → solve → animated playback works correctly
- [ ] Passes 100 random scrambles (automated test)
- [ ] Lighthouse: Performance > 80, SEO > 90
- [ ] Works on iPhone Safari + Chrome Android + Desktop

### Phase 2

- [ ] Camera scan succeeds on builder's physical cube in normal lighting
- [ ] 2×2 solver live
- [ ] Indexed in Google for "rubik's cube solver online"
- [ ] 1,000+ monthly visitors (organic)

### Phase 3

- [ ] 4×4 + mirror cube playable
- [ ] Featured on at least one cubing community (Reddit r/Cubers, Discord)
- [ ] 10,000+ monthly visitors

---

## 16. Glossary for New Users (Product Feature)

> This section defines content to build into the `/learn/notation` page.

### Basic face moves

| Symbol | Name | Description |
|--------|------|-------------|
| **R** | Right | Turn the right face 90° clockwise (as if looking at it) |
| **L** | Left | Turn the left face 90° clockwise |
| **U** | Up | Turn the top face 90° clockwise |
| **D** | Down | Turn the bottom face 90° clockwise |
| **F** | Front | Turn the front face 90° clockwise |
| **B** | Back | Turn the back face 90° clockwise |

### Modifiers

| Symbol | Name | Description |
|--------|------|-------------|
| **'** (prime) | Counter-clockwise | Turn the face 90° the other way. Example: R' |
| **2** | Double | Turn the face 180°. Example: U2 |

### Advanced (Phase 2 content)

| Symbol | Name | Description |
|--------|------|-------------|
| **r** (lowercase) | Wide R | Turn right face + middle layer together |
| **M** | Middle slice | Turn the layer between L and R (follows L direction) |
| **x** | Cube rotation | Rotate entire cube following R axis |
| **y** | Cube rotation | Rotate entire cube following U axis |
| **z** | Cube rotation | Rotate entire cube following F axis |

### Common beginner algorithms

| Name | Moves | Use |
|------|-------|-----|
| Sexy move | R U R' U' | Corner insertion, OLL/PLL building block |
| Sledgehammer | R' F R F' | Corner insertion variant |
| F-cross | F R U R' U' F' | Making the yellow cross |
| T-perm | R U R' U' R' F R2 U' R' U' R U R' F' | PLL corner swap |

---

## 17. CV & OpenCV Reference Projects (Deep Dive)

> This section documents the two repos surfaced by Google AI search, plus the ecosystem they belong to. **Read this before implementing Phase 2 scanning.**

### 17.1 Head-to-head: qbr vs cv-cube-solver

| Dimension | [kkoomen/qbr](https://github.com/kkoomen/qbr) | [raymondtruong/cv-cube-solver](https://github.com/raymondtruong/cv-cube-solver) |
|-----------|-----------------------------------------------|--------------------------------------------------------------------------------|
| **Stars / maturity** | 659★, 157 commits, updated Feb 2026 | 8★, 19 commits, 2018-era but has live demo |
| **Platform** | Desktop Python (OpenCV window) | Web app (Flask + browser) |
| **Camera** | Live webcam stream | 6 static image captures from browser |
| **Color method** | CIEDE2000 + Canny edge detection | CIELAB Euclidean distance |
| **Calibration** | ✅ Full calibrate mode, saved per cube | ❌ Fixed center-anchor only |
| **Cube detection** | ✅ Automatic face/contour detection | ❌ Assumes pre-cropped 144×144 face images |
| **Solve output** | Notation + human-readable (`-n`) | Notation only |
| **3D visualization** | 2D net only | TwistySim JS 3D |
| **Multilingual** | ✅ 10 languages | ❌ English only |
| **License** | MIT | No explicit license in README |
| **Best for us** | Accuracy benchmark, scan UX, calibrate mode | Web architecture, backend API design |

**Conclusion:** Use **cv-cube-solver's architecture** (browser → API → solve → 3D UI) with **qbr's accuracy techniques** (CIEDE2000, calibrate mode, scan protocol, human-readable moves).

### 17.2 The dwalton76 ecosystem (supports big cubes)

The lineage behind qbr's color detection:

```
dwalton76/rubiks-cube-tracker  →  finds cube in image, outputs RGB per square
         ↓
dwalton76/rubiks-color-resolver  →  CIEDE2000 + edge/corner constraints → ULFRBD string
         ↓
dwalton76/rubiks-cube-NxNxN-solver  →  2×2 through 7×7 solvers
```

This is the **only open-source stack that supports scanning AND solving up to 7×7**. Relevant for our Phase 3 (4×4, 5×5). The [SpeedSolving forum thread](https://www.speedsolving.com/threads/rubiks-color-resolver-convert-rgb-values-of-each-square-to-u-l-f-r-b-or-d.64053/) explains the constraint-matching algorithm in detail.

### 17.3 ML-enhanced alternatives

| Repo | Approach | Training needed | Voice guidance |
|------|----------|-----------------|----------------|
| [VinitKumarGupta/rubik-cube-solver](https://github.com/VinitKumarGupta/rubik-cube-solver) | Random Forest on LAB values, 3900+ samples | Yes (or use pre-trained) | ✅ gTTS |
| [JayPatel1309/CamCube](https://github.com/JayPatel1309/CamCube) | Teachable Machine / TensorFlow | Yes (per environment) | ❌ |
| [Tarun-Nandi/Rubix-Cube-Solver-using-Open-CV](https://github.com/Tarun-Nandi/Rubix-Cube-Solver-using-Open-CV) | HSV + contour geometry + arrow overlays | No | ❌ |

**When to use ML:** If CIELAB + calibration still fails on stickerless cubes or extreme lighting. Collect training data from YOUR cubes using qbr's calibrate mode as the labeling tool.

### 17.4 Recommended scan feature spec (synthesized)

Based on all CV repos, our `/scan` page should have:

```
┌─────────────────────────────────────────────────────┐
│  [Live camera feed with 3×3 grid overlay]           │
│                                                     │
│  ┌─────────┐  Step 3/6: Show WHITE face             │
│  │ preview │  [Animated 3D cube showing rotation]   │
│  │ 9-grid  │                                         │
│  └─────────┘  [Calibrate] [Retry] [Confirm ✓]       │
├─────────────────────────────────────────────────────┤
│  Scanned: ██░░░░ 2/6    [2D net building...]        │
│                                                     │
│  ┌───┬───┬───┐                                      │
│  │   │ U │   │  ← full net fills in as faces scan  │
│  ├───┼───┼───┤                                      │
│  │ L │ F │ R │                                       │
│  └───┴───┴───┘                                      │
├─────────────────────────────────────────────────────┤
│  Solve mode: ○ Visual  ○ Notation  ○ Beginner LBL   │
│  [Solve Cube]                                       │
└─────────────────────────────────────────────────────┘
```

### 17.5 Action items before Phase 2 coding

1. **Clone and run qbr locally** with your physical cubes:
   ```bash
   git clone --depth 1 https://github.com/kkoomen/qbr.git
   cd qbr && python3 -m venv env && source env/bin/activate
   pip install -r requirements.txt
   ./src/qbr.py
   ```
2. **Try cv-cube-solver live demo:** https://raymondtruong.pythonanywhere.com/
3. **Document which cubes scan reliably** (your GAN/MoYu/mirror/etc.) and which need calibrate mode
4. **Decide:** browser-only scan vs hybrid API (recommend starting browser-only, add API if accuracy < 90%)

### 17.6 Feasibility update after CV research

| Feature | Previous rating | Updated rating | Reason |
|---------|----------------|----------------|--------|
| Physical cube scan (3×3) | Medium (80%) | **High (90%)** | qbr + cv-cube-solver prove end-to-end works; clear port path |
| Calibrate per cube | Not planned | **High (95%)** | qbr has full implementation to port |
| Human-readable solve | Phase 2 | **High (95%)** | qbr `-n` flag is a simple string template layer |
| 4×4/5×5 scan | Not assessed | **Medium (70%)** | dwalton76 stack supports up to 7×7 color resolution |
| Mirror cube scan | Very hard | **Still very hard** | No color to detect; manual/shape only |

---

## Appendix A: Immediate Next Steps

1. **Pick a project name and domain** (e.g., `cubevibe.com`, `twistysolve.com`, `cubesmith.dev`)
2. **Run qbr locally** with your physical cubes to validate scan feasibility (see Section 17.5)
3. **Run the Phase 1 Cursor prompt** (see Section 13)
4. **Test with your physical 3×3** after first working solve
5. **Deploy to Vercel** and share the link
6. **Submit to Google Search Console** on day 1
7. **Iterate** based on feedback; resist feature creep until Phase 1 is solid

---

## Appendix B: Reference Links

### Competitors
- https://cubeunstuck.com
- https://www.cubzor.com
- https://rubikssolver.pro
- https://ruwix.com/cube-solver/
- https://onlinecube.com
- https://cubesolver.ai
- https://8gwifi.org/math/rubiks-cube-solver.jsp
- https://animcubejs.cubing.net

### Learning
- https://www.jperm.net/3x3
- https://www.jperm.net/3x3/moves
- https://solvethecube.com

### Open Source — Web (Phase 1)
- https://github.com/jeffhuber/rubiks-solver
- https://github.com/chenguangwei/rubiks-solver
- https://github.com/black-leg-nameko/rubik-cube-solver
- https://www.npmjs.com/package/cubejs

### Open Source — CV / Scanning (Phase 2) ⭐
- https://github.com/kkoomen/qbr — **top Google result; run this first**
- https://github.com/raymondtruong/cv-cube-solver — **web hybrid blueprint; [live demo](https://raymondtruong.pythonanywhere.com/)**
- https://github.com/dwalton76/rubiks-color-resolver — CIEDE2000 color assignment
- https://github.com/dwalton76/rubiks-cube-tracker — cube face detection in images
- https://github.com/FK-75/rubiks-cube-solver — Python scan + PyOpenGL 3D
- https://github.com/VinitKumarGupta/rubik-cube-solver — ML + voice-guided solve
- https://github.com/HaginCodes/3x3x3-Rubiks-Cube-Solver — qbr inspiration source

---

*This document should be updated as each phase ships. Agents: always read the latest version before implementing.*
