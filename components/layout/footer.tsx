import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-cube-border bg-cube-surface/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-sm text-cube-muted sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {year} {siteConfig.name}. Built for everyone by vibe coding.
        </p>
      </div>
    </footer>
  );
}
