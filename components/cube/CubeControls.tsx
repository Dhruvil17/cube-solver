"use client";

import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Cpu,
  HelpCircle,
} from "lucide-react";
import { useCubeStore } from "@/stores/cube-store";
export function CubeControls() {
  const {
    playbackMoves,
    playbackIndex,
    isPlaybackActive,
    isSolving,
    isSolverReady,
    isMuted,
    playbackSpeed,
    reset,
    scramble,
    solve,
    setMuted,
    setSpeed,
    togglePlayback,
    stepForward,
    stepBackward,
    queueMoves,
  } = useCubeStore();

  const manualMoves: string[] = ["U", "D", "R", "L", "F", "B"];

  return (
    <div className="flex w-full flex-col gap-4 lg:w-96 lg:shrink-0">
      {/* 1. Core Actions Card */}
      <div className="rounded-2xl border border-cube-border bg-cube-surface/80 p-4 sm:p-5 backdrop-blur-md">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-cube-muted flex items-center justify-between">
          <span>Engine Controls</span>
          <span className="flex items-center gap-1.5 text-[10px] normal-case bg-cube-border/40 px-2 py-0.5 rounded-full text-slate-300">
            <span className={`h-1.5 w-1.5 rounded-full ${isSolverReady ? "bg-green-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
            {isSolverReady ? "Solver Ready" : "Solver Compiling"}
          </span>
        </h2>

        {/* Global Toolbar buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={scramble}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cube-border bg-cube-bg/85 py-3 text-xs font-medium text-white transition-all hover:bg-cube-border/30 active:scale-95"
          >
            <Shuffle className="h-4 w-4 text-purple-400" />
            <span>Scramble</span>
          </button>

          <button
            type="button"
            onClick={solve}
            disabled={isSolving}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cube-accent/40 bg-cube-accent/15 py-3 text-xs font-medium text-white transition-all hover:bg-cube-accent/25 active:scale-95 disabled:opacity-50"
          >
            {isSolving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cube-accent border-t-transparent" />
            ) : (
              <Cpu className="h-4 w-4 text-cube-accent" />
            )}
            <span>{isSolving ? "Solving..." : "Auto Solve"}</span>
          </button>

          <button
            type="button"
            onClick={reset}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cube-border bg-cube-bg/85 py-3 text-xs font-medium text-white transition-all hover:bg-cube-border/30 active:scale-95"
          >
            <RotateCcw className="h-4 w-4 text-emerald-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Playback Controls (Visible once solution exists) */}
        {playbackMoves.length > 0 && (
          <div className="mt-5 border-t border-cube-border/60 pt-5">
            <p className="text-xs font-medium text-slate-300">Solution Sequence Playback</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={stepBackward}
                disabled={playbackIndex <= 0}
                className="flex items-center justify-center rounded-lg border border-cube-border bg-cube-bg/60 p-2.5 text-cube-muted transition-colors hover:text-white disabled:opacity-40"
                aria-label="Previous step"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={togglePlayback}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cube-accent py-2.5 text-xs font-semibold text-white transition-all hover:bg-cube-accent/90 active:scale-95"
              >
                {isPlaybackActive ? (
                  <>
                    <Pause className="h-4 w-4 fill-current" />
                    <span>Pause Solver</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Animate Solution</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={stepForward}
                disabled={playbackIndex >= playbackMoves.length}
                className="flex items-center justify-center rounded-lg border border-cube-border bg-cube-bg/60 p-2.5 text-cube-muted transition-colors hover:text-white disabled:opacity-40"
                aria-label="Next step"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Playback Settings (Speed Slider + Mute) */}
            <div className="mt-4 flex items-center justify-between gap-4 border-b border-cube-border/30 pb-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-[10px] text-cube-muted">Animation Speed: {playbackSpeed}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.5"
                  value={playbackSpeed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-cube-border accent-cube-accent"
                />
              </div>

              <button
                type="button"
                onClick={() => setMuted(!isMuted)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-cube-border bg-cube-bg/60 text-cube-muted transition-colors hover:text-white"
                aria-label={isMuted ? "Unmute turn sounds" : "Mute turn sounds"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Scrollable Move Sheet list */}
            <div className="mt-4">
              <span className="text-[10px] uppercase tracking-wider text-cube-muted">
                Moves List ({playbackIndex === -1 ? 0 : playbackIndex}/{playbackMoves.length})
              </span>
              <div className="mt-2 flex max-h-20 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-cube-border/60 bg-cube-bg/40 p-2.5 font-mono text-xs">
                {playbackMoves.map((move, idx) => {
                  const isActive = idx === playbackIndex - 1;
                  const isCompleted = idx < playbackIndex - 1;
                  return (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded border transition-colors ${
                        isActive
                          ? "border-cube-accent bg-cube-accent/30 text-white font-bold animate-pulse"
                          : isCompleted
                          ? "border-transparent text-cube-muted/40 line-through"
                          : "border-cube-border bg-cube-bg text-slate-300"
                      }`}
                    >
                      {move}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Manual Inputs Panel */}
      <div className="rounded-2xl border border-cube-border bg-cube-surface/85 p-4 sm:p-5 backdrop-blur-md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cube-muted">
          Manual Twists
        </h3>
        <div className="mt-3 grid grid-cols-6 gap-1.5 font-mono">
          {manualMoves.map((move) => (
            <button
              key={move}
              type="button"
              onClick={() => queueMoves([move])}
              className="rounded-lg border border-cube-border bg-cube-bg py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-cube-border/40 active:scale-95"
            >
              {move}
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1.5 font-mono">
          {manualMoves.map((move) => {
            const primeMove = `${move}'`;
            return (
              <button
                key={primeMove}
                type="button"
                onClick={() => queueMoves([primeMove])}
                className="rounded-lg border border-cube-border bg-cube-bg py-2 text-xs font-semibold text-cube-muted transition-colors hover:bg-cube-border/40 active:scale-95"
              >
                {move}&apos;
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Keyboard Guide Panel */}
      <div className="hidden rounded-2xl border border-dashed border-cube-accent/30 bg-cube-accent/5 p-4 gap-3.5 sm:flex">
        <HelpCircle className="h-5 w-5 text-cube-accent shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-white">Keyboard Shortcuts</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-cube-muted">
            Press letters <span className="font-mono text-white">U, D, R, L, F, B</span> on your keyboard to rotate layers. Hold <span className="font-mono text-white">Shift</span> to spin in the reverse direction. Drag on empty space to orbit.
          </p>
        </div>
      </div>
    </div>
  );
}
