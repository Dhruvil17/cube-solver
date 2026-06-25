"use client";

import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { CubePreviewGraphic } from "@/components/cube/cube-preview-graphic";
import { siteConfig } from "@/lib/site";

const MOVE_FACES = ["U", "U'", "R", "R'", "F", "F'"] as const;

/**
 * Play page shell — polished UI frame until the Three.js cube mounts.
 */
export function PlayPlaceholder() {
  const [muted, setMuted] = useState(true);

  return (
    <div className="flex flex-1 flex-col gap-4 lg:flex-row">
      <div
        className="cube-canvas relative flex min-h-[55vh] flex-1 flex-col overflow-hidden rounded-2xl border border-cube-border bg-[radial-gradient(circle_at_center,_#1e222b_0%,_#0f1115_100%)] lg:min-h-[520px]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-cube-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-slate-300">Preview mode</span>
          </div>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="flex items-center gap-1.5 rounded-lg border border-cube-border bg-cube-surface/80 px-2.5 py-1.5 text-xs text-cube-muted transition-colors hover:text-white"
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {muted ? "Muted" : "Sound on"}
          </button>
        </div>

        {/* Cube area */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-8">
          <CubePreviewGraphic size="lg" />
          <p className="mt-8 max-w-xs text-center text-sm font-medium text-white">
            Interactive 3D cube is next
          </p>
          <p className="mt-2 max-w-sm text-center text-xs leading-relaxed text-cube-muted">
            You&apos;ll be able to swipe faces, scramble and watch optimal solves
            animate here. The colorful cube above is a preview — not a broken state.
          </p>
        </div>

        {/* Mobile bottom toolbar */}
        <div className="border-t border-cube-border/60 bg-cube-surface/50 p-4 lg:hidden">
          <div className="grid grid-cols-3 gap-2">
            {["Scramble", "Solve", "Reset"].map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="rounded-lg border border-cube-border bg-cube-bg py-3 text-xs font-medium text-cube-muted"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
        <div className="rounded-xl border border-cube-border bg-cube-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cube-muted">
            Controls
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Scramble", "Solve", "Reset"].map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="hidden rounded-lg border border-cube-border bg-cube-bg py-2.5 text-xs font-medium text-cube-muted lg:block"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {MOVE_FACES.map((move) => (
              <span
                key={move}
                className="rounded-md border border-cube-border bg-cube-bg px-2 py-1 font-mono text-xs text-cube-muted"
              >
                {move}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-cube-muted">
            Buttons activate when the 3D engine ships.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-cube-accent/30 bg-cube-accent/5 p-4">
          <p className="text-sm font-medium text-white">What&apos;s coming</p>
          <ul className="mt-2 space-y-1.5 text-xs text-cube-muted">
            <li>· Tap + swipe to turn layers</li>
            <li>· Drag to orbit the cube</li>
            <li>· Pinch to zoom</li>
            <li>· Turn sounds + solve playback</li>
          </ul>
          <Link
            href={siteConfig.links.learn}
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cube-accent hover:text-cube-accent-hover"
          >
            Learn notation first
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
