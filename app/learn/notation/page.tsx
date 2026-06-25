import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Notation",
  description:
    "Learn Rubik's cube notation — U, R, F, prime moves, and doubles explained for beginners.",
};

const basicMoves = [
  { symbol: "U", name: "Up", desc: "Turn the top face clockwise" },
  { symbol: "D", name: "Down", desc: "Turn the bottom face clockwise" },
  { symbol: "R", name: "Right", desc: "Turn the right face clockwise" },
  { symbol: "L", name: "Left", desc: "Turn the left face clockwise" },
  { symbol: "F", name: "Front", desc: "Turn the front face clockwise" },
  { symbol: "B", name: "Back", desc: "Turn the back face clockwise" },
];

export default function NotationPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/learn"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cube-muted transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Learn
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-white">
        Cube Notation
      </h1>
      <p className="mt-3 text-cube-muted">
        Letters name faces. A prime (<code className="text-cube-accent">&apos;</code>)
        means counter-clockwise. A 2 means turn 180°.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {basicMoves.map((move) => (
          <div
            key={move.symbol}
            className="rounded-xl border border-cube-border bg-cube-surface p-4"
          >
            <span className="font-mono text-2xl font-bold text-cube-accent">
              {move.symbol}
            </span>
            <p className="mt-1 font-medium text-white">{move.name}</p>
            <p className="mt-1 text-sm text-cube-muted">{move.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-cube-border bg-cube-surface p-6">
        <h2 className="text-lg font-semibold text-white">Try it live</h2>
        <p className="mt-2 text-sm text-cube-muted">
          Interactive notation demos will animate on the 3D cube in the next build step.
        </p>
        <Button href="/play" className="mt-4">
          Open Cube Playground
        </Button>
      </div>
    </div>
  );
}
