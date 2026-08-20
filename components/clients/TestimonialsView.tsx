"use client";

import { PatternC } from "@/components/patterns/PatternC";
import { PartnersWall } from "@/components/media/PartnersWall";
import { useReview } from "@/components/review/ReviewProvider";
import { publishedTestimonials } from "@/lib/copy";

function attribution(t: {
  name: string;
  title: string | null;
  company: string | null;
}) {
  const bits = [t.name, t.title, t.company].filter(Boolean);
  return bits.join(", ");
}

export function TestimonialsView() {
  const { state } = useReview();
  const variant = state.testimonials;

  if (variant === "reconsent") {
    return <PatternC title="Testimonials" />;
  }

  if (variant === "logos") {
    return (
      <PatternC title="Testimonials">
        <PartnersWall />
      </PatternC>
    );
  }

  const quotes = publishedTestimonials();
  return (
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
  );
}
