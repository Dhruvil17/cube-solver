# Cube Solver

A modern high-performance 3D Rubik's Cube simulator, notation tutorial and optimal solver built with Next.js, Three.js and TailwindCSS.

Live Site: [https://cube-vibe.vercel.app](https://cube-vibe.vercel.app)

## Features

*   **Interactive 3D Simulator:** Premium WebGL graphics featuring natural drag-to-turn gestures, pinch-to-zoom and smooth orbital rotation controls.
*   **Kociemba Auto-Solver:** Offloads solver calculations to a background Web Worker to find optimal solutions without freezing the browser UI.
*   **Dynamic Sound Synth:** Custom synthesizer leveraging the browser's native Web Audio API to play turn clicks, scramble effects and solve chimes without external assets.
*   **Clean Toon-Shaded Aesthetics:** Sleek 3D speedcube rendering with amazing outlines and a solid premium look.
*   **Minimalist & SEO Optimized:** Centered layout landing page with semantic structure and dynamic sitemaps.

## Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **3D Engine:** Three.js via React Three Fiber (R3F) & `@react-three/drei`
*   **State Management:** Zustand
*   **Styling:** TailwindCSS 4
*   **Icons:** Lucide React

## Getting Started

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the hot-reloading development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Production Build
Verify code types and compile the optimized production bundle:
```bash
npm run build
```
