import type { Metadata } from "next";
import { PlayClient } from "@/components/cube/PlayClient";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Interactive 3×3 Rubik's cube simulator — scramble, solve and practice moves in your browser.",
};

export default function PlayPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-3 pb-4 pt-3 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
      <div className="mb-3 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Cube Playground
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-cube-muted sm:mt-2 sm:text-sm md:text-base">
          Vibe-coded 3D Rubik&apos;s cube simulator with smooth touch gestures, sound synth and Kociemba auto-solver.
        </p>
      </div>
      <PlayClient />
    </div>
  );
}
