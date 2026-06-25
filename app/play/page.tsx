import type { Metadata } from "next";
import { PlayClient } from "@/components/cube/PlayClient";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Interactive 3×3 Rubik's cube simulator — scramble, solve, and practice moves in your browser.",
};

export default function PlayPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Cube Playground
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-cube-muted sm:text-base">
          Vibe-coded 3D Rubik&apos;s cube simulator with smooth touch gestures, sound synth, and Kociemba auto-solver.
        </p>
      </div>
      <PlayClient />
    </div>
  );
}


