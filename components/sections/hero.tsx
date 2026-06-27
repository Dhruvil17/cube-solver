import { Sparkles, Volume2, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const highlights = [
  {
    icon: Sparkles,
    title: "Real 3D WebGL",
    description: "Glossy speedcube look with smooth layer animations.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first gestures",
    description: "Swipe to turn, pinch to zoom, drag to orbit. Works on every screen.",
  },
  {
    icon: Volume2,
    title: "Sound & polish",
    description: "Satisfying turn clicks, scramble effects and a mute toggle.",
  },
  {
    icon: Zap,
    title: "Optimal solve",
    description: "Kociemba algorithm finds ~20-move solutions with step playback.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Scramble. Play.{" "}
            <span className="text-cube-accent">Solve.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cube-muted sm:text-xl">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href={siteConfig.links.play}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 font-bold shadow-lg shadow-cube-accent/20 hover:shadow-cube-accent/30 transition-all duration-200"
            >
              Start Solving
            </Button>
            <Button
              href={siteConfig.links.learn}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 font-medium transition-all duration-200"
            >
              Learn Notation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section className="border-t border-cube-border bg-cube-surface/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          Built to feel amazing on your phone
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-cube-muted">
          Three.js, touch gestures, sound and responsive layout
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-cube-border bg-cube-bg p-5"
            >
              <item.icon className="h-6 w-6 text-cube-accent" aria-hidden />
              <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-cube-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
