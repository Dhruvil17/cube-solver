"use client";

import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { CubeScene } from "./CubeScene";
import { CubeControls } from "./CubeControls";
import { useCubeStore } from "@/stores/cube-store";

export function PlayView() {
  const { isMuted, setMuted, loadPersistedState } = useCubeStore();

  // Load persisted state on mount
  useEffect(() => {
    loadPersistedState();
  }, [loadPersistedState]);

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      {/* 3D Canvas Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-cube-border bg-[radial-gradient(circle_at_center,_#1e222b_0%,_#0f1115_100%)] min-h-[38vh] sm:min-h-[55vh] lg:min-h-[550px]">
        
        {/* Render scene Canvas */}
        <div className="absolute inset-0 z-0">
          <CubeScene />
        </div>

        {/* Top Floating bar overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 rounded-full border border-cube-border/80 bg-cube-surface/90 px-3 py-1.5 backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase">
              Simulator Live
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMuted(!isMuted)}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-cube-border bg-cube-surface/90 px-3 py-1.5 text-xs text-cube-muted transition-colors hover:text-white backdrop-blur-md active:scale-95"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-cube-accent" />
                <span>Sound On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Controls Area */}
      <CubeControls />
    </div>
  );
}
