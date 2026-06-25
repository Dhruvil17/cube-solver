import Link from "next/link";
import { ArrowRight, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { CubePreviewGraphic } from "@/components/cube/cube-preview-graphic";
import { siteConfig } from "@/lib/site";

/**
 * Landing hero visual — preview card, not an empty placeholder.
 */
export function HeroPreviewCard() {
  return (
    <div className="relative mx-auto mt-16 max-w-md">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-cube-accent/30 via-transparent to-transparent opacity-80" />
      <div className="relative overflow-hidden rounded-2xl border border-cube-border bg-[radial-gradient(circle_at_center,_#1e222b_0%,_#0f1115_100%)] shadow-2xl shadow-black/50">
        {/* Status bar */}
        <div className="flex items-center justify-between border-b border-cube-border/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-slate-300">3D Simulator</span>
          </div>
          <span className="rounded-full bg-cube-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cube-accent">
            Scrambled
          </span>
        </div>

        {/* Cube preview */}
        <div className="flex min-h-[220px] items-center justify-center px-6 py-10 sm:min-h-[260px]">
          <CubePreviewGraphic size="sm" />
        </div>

        {/* Quick actions hint */}
        <div className="border-t border-cube-border/80 bg-cube-surface/40 px-4 py-3">
          <div className="flex items-center justify-center gap-6 text-cube-muted">
            <span className="flex items-center gap-1.5 text-xs">
              <Shuffle className="h-3.5 w-3.5" />
              Scramble
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Auto-solve
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              Play
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-cube-border/80 p-4">
          <Link
            href={siteConfig.links.play}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cube-accent px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cube-accent-hover"
          >
            Open interactive cube
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-3 text-center text-xs text-cube-muted">
            Swipe to turn · Pinch to zoom · Works on mobile
          </p>
        </div>
      </div>
    </div>
  );
}
