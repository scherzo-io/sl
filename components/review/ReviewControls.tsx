"use client";

import { useState } from "react";
import {
  DIRECTIONS,
  DIRECTION_LABEL,
  HOME_LABEL,
  HOME_VARIANTS,
  NAV_LABEL,
  NAV_VARIANTS,
  TESTIMONIAL_LABEL,
  TESTIMONIAL_VARIANTS,
  type Direction,
  type HomeVariant,
  type NavVariant,
  type TestimonialVariant,
} from "@/lib/review";
import { useReview } from "./ReviewProvider";

function Choice<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="w-full">
      <p className="mb-1 font-display text-sm font-light text-paper">{label}</p>
      <div className="flex flex-col items-center gap-1" role="group" aria-label={label}>
        {options.map((id) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={`w-full font-display text-sm font-light ${
                selected ? "text-red-on-dark" : "text-paper hover:text-red-on-dark"
              }`}
            >
              {labels[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewControls() {
  const { state, setReview } = useReview();
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 w-full border-t border-red pt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full font-display text-sm font-light text-paper hover:text-red-on-dark"
      >
        Review
      </button>
      {open ? (
        <div className="mt-4 flex flex-col items-center gap-5">
          <Choice
            label="Direction"
            value={state.direction}
            options={DIRECTIONS}
            labels={DIRECTION_LABEL}
            onChange={(direction: Direction) => setReview({ direction })}
          />
          <Choice
            label="Home"
            value={state.home}
            options={HOME_VARIANTS}
            labels={HOME_LABEL}
            onChange={(home: HomeVariant) => setReview({ home })}
          />
          <Choice
            label="Nav"
            value={state.nav}
            options={NAV_VARIANTS}
            labels={NAV_LABEL}
            onChange={(nav: NavVariant) => setReview({ nav })}
          />
          <Choice
            label="Testimonials"
            value={state.testimonials}
            options={TESTIMONIAL_VARIANTS}
            labels={TESTIMONIAL_LABEL}
            onChange={(testimonials: TestimonialVariant) => setReview({ testimonials })}
          />
        </div>
      ) : null}
    </div>
  );
}
