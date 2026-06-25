import { Hero, Features } from "@/components/sections/hero";
import { webApplicationSchema } from "@/lib/schema";

export default function HomePage() {
  const jsonLd = webApplicationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
    </>
  );
}
