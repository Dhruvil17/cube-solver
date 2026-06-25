# Phase 1 — Go Live MVP

> Short implementation guide for Phase 1 only. Full research lives in [`CONTEXT.md`](./CONTEXT.md). Build status: [`PROJECT-STATE.md`](./PROJECT-STATE.md).

**Goal:** Ship a live URL with a beautiful 3×3 cube you can play with, scramble, and auto-solve — good enough to share online.

**Timeline:** ~1–2 weeks (vibe coding with Cursor / Claude)

---

## What We're Building

| Feature           | What the user gets                                        |
| ----------------- | --------------------------------------------------------- |
| **3D cube**       | Real-looking cube, smooth spins, easy to rotate and twist |
| **Gestures**      | Mobile + desktop — swipe, drag, pinch, click (see below)  |
| **Sound & effects** | Turn clicks, scramble whoosh, solve chime, face glow, mute toggle |
| **Animations**    | Smooth eased turns, solve playback, speed control — all devices |
| **Scramble**      | One click → random legal scramble                         |
| **Free play**     | Click faces or use keyboard (U R F L D B)                 |
| **Auto-solve**    | Computes ~20-move solution and animates it                |
| **Step controls** | Prev / Next / Play / Pause / speed slider                 |
| **Share link**    | URL remembers the cube state                              |
| **Notation page** | Simple learn page (U, U', R, F2…) with live demo          |
| **Landing page**  | Clean hero + “Try the cube” CTA, mobile-friendly          |

### Gestures, sound & effects — included in Phase 1 ✅

| | **Mobile** | **Desktop** |
|---|:---:|:---:|
| Tap / click face + drag to turn | ✅ | ✅ |
| Drag to orbit whole cube | ✅ | ✅ |
| Pinch / scroll to zoom | ✅ | ✅ |
| Double-tap / double-click reset view | ✅ | ✅ |
| Face buttons (U R F L D B) | ✅ | ✅ |
| Keyboard shortcuts | — | ✅ |
| Turn sound (plastic click) | ✅ | ✅ |
| Scramble / solve sounds | ✅ | ✅ |
| Mute toggle | ✅ | ✅ |
| Smooth layer animation + easing | ✅ | ✅ |
| Face glow on active turn | ✅ | ✅ |
| Auto-solve step playback | ✅ | ✅ |
| Glossy cube + shadows + lighting | ✅ | ✅ |
| Responsive layout | ✅ | ✅ |

**Not in Phase 1:** camera scan, 2×2/4×4, speedcube timer, login, OpenCV.

---

## Tech Stack

```
Next.js 15      → pages, SEO, deploy
TypeScript      → type-safe cube logic
Tailwind CSS    → UI (dark theme, modern look)
Three.js        → 3D rendering
React Three Fiber + drei  → React-friendly 3D
cubejs          → Kociemba solver (in Web Worker)
Zustand         → cube state + move history
Vercel          → hosting
```

**Why this stack:** Proven by open-source cube apps; SEO from Next.js; solver runs off main thread so animations stay smooth.

### Mobile-first premium add-ons (Phase 1)

```
@react-three/drei     → RoundedBox cubies, Environment, CameraControls
@use-gesture/react    → smooth touch swipe-to-turn on faces
howler.js             → turn / scramble / solve sounds (with mute toggle)
```

**Do NOT use CSS 3D** (like the Google AI Studio CUBIX app). It feels flat on phones. **WebGL via Three.js** is the only way to get real depth, lighting, and glossy stickers on mobile browsers.

---

## Mobile-First Premium 3D (Priority #1)

Most users will be on **phone**. The cube must feel physical — not a flat diagram.

### Why Three.js beats everything else for us

| Option | Mobile feel | Verdict |
|--------|-------------|---------|
| **Three.js + R3F** | Real lighting, shadows, glossy plastic, smooth 60fps | ✅ **Use this** |
| CSS 3D transforms | Lightweight but flat, no real depth | ❌ Competitor uses this — we beat them here |
| Unity WebGL | Heavy load, bad SEO, huge bundle | ❌ Overkill |
| Native app | Best feel but not a web app | ❌ Wrong product |

### Touch gestures (mobile)

| Gesture | Action |
|---------|--------|
| **Tap face + swipe** | Turn that layer (direction = swipe) |
| **Drag on empty area** | Orbit / spin whole cube |
| **Pinch** | Zoom in/out |
| **Double-tap** | Reset camera angle |
| **Bottom face buttons** | U R F L D B for users who prefer taps over swipes |

- Use **raycasting** to know which face was touched
- **Lock scroll** on the canvas (`touch-action: none`) so the page doesn’t jump while playing
- **44px minimum** tap targets on all buttons

### Sound (classy, not annoying)

| Event | Sound |
|-------|-------|
| Layer turn | Short plastic *click* (~50ms) |
| Scramble | Quick *whoosh* sequence |
| Solve complete | Soft *success* chime |
| Button tap | Subtle UI tick |

- **howler.js** + small `.mp3` / `.ogg` files in `/public/sounds`
- **Mute toggle** in toolbar (default ON for first visit — respect mobile silent mode)
- No sound during fast auto-solve playback (or very quiet)

### Animation rules

- **150–250ms** per turn at 1× with ease-in-out
- **One move at a time** — queue, never overlap
- **Brief face glow** on the layer turning (emissive pulse)
- Optional: tiny **screen shake** on hard scrambles (desktop only, skip on mobile)

### Look that reads “premium” on a phone screen

- Dark gradient background (`#0f1115` → `#1a1d24`)
- **RoundedBoxGeometry** cubies with 0.08–0.12 gap between stickers
- **MeshStandardMaterial** — metalness 0.1, roughness 0.15 on stickers
- **Environment map** from drei (`<Environment preset="city" />`) for reflections
- Subtle **contact shadows** under the cube
- **Cap DPR** at 1.5 on mobile to keep 60fps

### Responsive layout

| Screen | Cube | Controls |
|--------|------|----------|
| **Phone** | Full width, `min-height: 55vh`, cube centered | Bottom sheet (Scramble / Solve / moves) |
| **Tablet** | 60% width | Side panel or bottom bar |
| **Desktop** | Left 65% | Right panel with keyboard hints |

- `env(safe-area-inset-*)` padding for notched iPhones
- Test: **iPhone Safari**, **Chrome Android**, iPad, 1440p desktop

---

## 3D Experience — The Main Focus

Phase 1 wins or loses on how the cube **feels**. Target: premium simulator, not a flat demo.

### Look & feel

- **Rounded cubies** — slight bevel/gap between stickers (speedcube look)
- **Real WCA colors** — white, yellow, green, blue, red, orange
- **Soft lighting** — ambient + directional light, subtle shadows
- **Dark background** — cube pops; optional soft gradient
- **Sticker sheen** — low roughness on face materials so it looks plastic/glossy

### Rotation & controls

| Action           | Desktop                                    | Mobile                        |
| ---------------- | ------------------------------------------ | ----------------------------- |
| Orbit whole cube | Drag with right-click or drag outside cube | One-finger drag on empty area |
| Twist a face     | Click face + drag in turn direction        | Tap face + swipe              |
| Zoom             | Scroll wheel                               | Pinch                         |
| Reset view       | Double-click canvas                        | Two-finger tap or button      |

- **Natural drag direction** — layer follows finger/mouse (not inverted)
- **Snap at 90°** — turns always land clean; no half-stuck faces
- **Orbit while idle** — optional very slow auto-rotate on landing page only

### Animation quality

- **Move queue** — one turn finishes before the next starts (no overlapping chaos)
- **Easing** — ease-in-out on each 90°/180° turn (~150–250ms at 1× speed)
- **Pivot correct** — rotate around face center, not cube center
- **Speed control** — 0.5× / 1× / 2× / 4× for solve playback
- **Highlight active face** — brief glow on the layer being turned during solve

### Performance

- Cap pixel ratio on mobile (`dpr={Math.min(2, window.devicePixelRatio)}`)
- 27 cubies only — keep geometry simple
- Lazy-load 3D canvas (don’t block landing page LCP)

---

## How We Implement It (High Level)

```
┌─────────────────────────────────────────────────────────┐
│  Landing (/)          →  hero + embedded mini cube      │
│  Play (/play)         →  full 3D simulator             │
│  Learn (/learn/notation) →  notation + small demo      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CubeStore (Zustand)     ← single source of truth       │
│  CubeModel (cubejs)      ← legal moves + state string   │
└─────────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────┐          ┌──────────────────────┐
│  CubeScene (R3F) │          │  Solver Worker       │
│  27 cubie meshes │          │  cubejs → move list  │
│  MoveEngine      │          └──────────────────────┘
│  animation queue │
└──────────────────┘
```

### Build order (do in this sequence)

1. **Scaffold** — Next.js + Tailwind + R3F canvas on `/play`
2. **Render cube** — 27 cubies, colors, orbit controls
3. **Move engine** — queue U/R/F… turns with smooth animation
4. **Input** — face click-drag + keyboard shortcuts
5. **Scramble** — random WCA scramble → animate or snap
6. **Solver** — Web Worker + Solve button + step playback UI
7. **Share URL** — encode/decode state in hash
8. **Landing + notation page** — polish and deploy

### Key modules (keep it simple)

| File / folder                   | Job                         |
| ------------------------------- | --------------------------- |
| `components/cube/CubeScene.tsx` | Canvas, lights, camera      |
| `components/cube/CubeModel.tsx` | 27 meshes, materials        |
| `components/cube/MoveEngine.ts` | Queue + animate layer turns |
| `lib/notation.ts`               | Parse `R U R' U'` → moves   |
| `lib/scrambler.ts`              | Generate scramble           |
| `solver/solver.worker.ts`       | Run cubejs off main thread  |
| `stores/cube-store.ts`          | State, history, solve mode  |

---

## Pages

```
/                    Landing — headline, feature bullets, “Open Cube” button
/play                Main app — 3D cube + toolbar
/learn/notation      Beginner notation cheat sheet + animated examples
```

### `/play` toolbar (minimal)

```
[Scramble]  [Solve]  [Reset]     ◀  ▶  ⏸  [1x ▼]     Move: R U R' ...
     Face buttons:  U  U'  D  D'  L  L'  R  R'  F  F'  B  B'
```

---

## Responsive Layout

| Screen      | Layout                                           |
| ----------- | ------------------------------------------------ |
| **Phone**   | Full-width cube on top; controls in bottom sheet |
| **Tablet**  | Cube ~60% width; controls beside or below        |
| **Desktop** | Cube left (65%); controls + move list right      |

Touch targets ≥ 44px. Test on iPhone Safari and Chrome Android.

---

## SEO (minimal for Phase 1)

- Unique title/description on `/` and `/play`
- `WebApplication` schema on homepage
- Fast load: static pages + client-only 3D island
- Submit sitemap after deploy

---

## Done When

- [x] Next.js scaffold + dark theme
- [x] Landing page + SEO basics
- [x] `/play` route shell (preview UI)
- [x] Decorative scrambled cube preview (not empty white grid)
- [ ] Cube looks 3D and satisfying to spin (Three.js)
- [ ] Scramble → solve → playback works on real scrambles
- [ ] Keyboard + touch both work
- [ ] Share link restores exact cube state
- [ ] Works on phone and desktop
- [ ] Live on Vercel with a URL you can share

---

## First Cursor Prompt (copy-paste)

```
Read docs/PROJECT-STATE.md and docs/PHASE-1.md (Phase 1 sections only).

Scaffold Phase 1:
- Next.js 15 + TypeScript + Tailwind (dark theme)
- /play page with React Three Fiber 3×3 cube
- Rounded cubies, WCA colors, smooth layer animations via MoveEngine queue
- OrbitControls + face click-drag to turn layers
- Scramble, Solve (cubejs in Web Worker), step playback with speed control
- Keyboard: U R F L D B and Shift for prime
- / landing page with CTA to /play
- /learn/notation basic page

Prioritize 3D feel: easing, correct pivots, no janky overlaps.
Deploy-ready for Vercel.
```

---

_Phase 2 (camera scan, 2×2, timer) comes after this ships._
