import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { publishedTestimonials } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Testimonials" };

function attribution(t: {
  name: string;
  title: string | null;
  company: string | null;
}) {
  const bits = [t.name, t.title, t.company].filter(Boolean);
  return bits.join(", ");
}

export default function ClientsPage() {
  const quotes = publishedTestimonials();
  return (
    <Shell>
      <PatternC title="Testimonials">
        <p>What our clients say</p>
        {quotes.map((t) => (
          <blockquote key={t.id} className="space-y-3">
            <p>{t.quote}</p>
            <footer className="font-display text-sm font-light text-ink-soft">
              {attribution(t)}
            </footer>
          </blockquote>
        ))}
      </PatternC>
    </Shell>
  );
}
