import Link from "next/link";
import { Box } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Learn" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cube-border/80 bg-cube-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Box className="h-5 w-5 text-cube-accent" aria-hidden />
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-cube-muted transition-colors",
                "hover:bg-cube-surface hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={siteConfig.links.play}
            className="ml-1 hidden rounded-lg bg-cube-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cube-accent-hover sm:inline-flex"
          >
            Open Cube
          </Link>
        </nav>
      </div>
    </header>
  );
}
