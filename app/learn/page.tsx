import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Learn",
  description: "Learn how to read Rubik's cube notation and practice on the 3D simulator.",
};

const topics = [
  {
    href: "/learn/notation",
    title: "Notation 101",
    description: "U, U', R, F2 — the alphabet of cube moves.",
    icon: Keyboard,
  },
];

export default function LearnPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-white">Learn</h1>
      <p className="mt-3 text-cube-muted">
        Start with notation, then practice on the interactive cube.
      </p>

      <ul className="mt-8 space-y-4">
        {topics.map((topic) => (
          <li key={topic.href}>
            <Link
              href={topic.href}
              className="group flex items-start gap-4 rounded-xl border border-cube-border bg-cube-surface p-5 transition-colors hover:border-cube-accent/50"
            >
              <div className="rounded-lg bg-cube-accent/10 p-3 text-cube-accent">
                <topic.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white group-hover:text-cube-accent-hover">
                  {topic.title}
                </h2>
                <p className="mt-1 text-sm text-cube-muted">{topic.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center gap-3 rounded-xl border border-dashed border-cube-border p-6 text-sm text-cube-muted">
        <BookOpen className="h-5 w-5 shrink-0 text-cube-accent" />
        More guides (beginner method, CFOP) ship in Phase 2.
      </div>

      <Button href="/play" variant="secondary" className="mt-6">
        Practice on 3D Cube
      </Button>
    </div>
  );
}
