"use client";

import { useEffect, useState } from "react";
import {
  DIRECTIONS,
  DIRECTION_LABEL,
  HOME_HINT,
  HOME_LABEL,
  HOME_VARIANTS,
  NAV_LABEL,
  NAV_VARIANTS,
  REVIEW_DEFAULTS,
  TESTIMONIAL_LABEL,
  TESTIMONIAL_VARIANTS,
  VIDEO_HOME,
  type Direction,
  type HomeVariant,
  type NavVariant,
  type TestimonialVariant,
} from "@/lib/review";
import { useReview } from "./ReviewProvider";

/**
 * The variant switcher Eric uses to choose a direction.
 *
 * It used to be the word "Review" sitting in the sidebar footer among the nav links, opening
 * four unlabelled columns of identically-styled text. Three things made it read as broken:
 * it did not look like a control, the Home group is inert under direction C (Archive has no
 * hero), and picking a video variant produced a blank screen because no reel was staged.
 *
 * So: it is a real button that says what is currently selected; it opens a panel wide enough
 * to read over the content rather than inside the 200px sidebar; an option that cannot render
 * is disabled and says why; and there is a Reset, because the choice persists in localStorage
 * and a reviewer who lands on an empty variant otherwise has no way back.
 */

type Row<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  hints?: Partial<Record<T, string>>;
  onChange: (v: T) => void;
  /** Set when the whole group has no effect right now, with the reason. */
  inert?: string;
  /** Per-option reason for being unavailable. */
  unavailable?: Partial<Record<T, string>>;
};

function Group<T extends string>({
  label,
  value,
  options,
  labels,
  hints,
  onChange,
  inert,
  unavailable,
}: Row<T>) {
  return (
    <fieldset className="border-0 p-0" disabled={Boolean(inert)}>
      <legend className="mb-2 font-display text-sm font-light tracking-wide text-paper/60">
        {label}
        {inert ? <span className="ml-2 text-red-on-dark">· {inert}</span> : null}
      </legend>
      <div className="flex flex-col gap-px" role="group" aria-label={label}>
        {options.map((id) => {
          const selected = value === id;
          const why = unavailable?.[id];
          const blocked = Boolean(why) || Boolean(inert);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              disabled={Boolean(why)}
              title={why ?? hints?.[id] ?? undefined}
              onClick={() => onChange(id)}
              className={`flex items-baseline gap-2 px-2 py-1.5 text-left font-display text-sm font-light transition-colors ${
                selected
                  ? "bg-red/15 text-red-on-dark"
                  : blocked
                    ? "text-paper/25"
                    : "text-paper/80 hover:bg-paper/10 hover:text-paper"
              }`}
            >
              <span aria-hidden="true" className="w-3 shrink-0">
                {selected ? "●" : "○"}
              </span>
              <span className="flex-1">
                {labels[id]}
                {why ? <span className="block text-paper/25">{why}</span> : null}
                {!why && hints?.[id] ? (
                  <span className="block text-paper/40">{hints[id]}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ReviewControls() {
  const { state, setReview, reset, capabilities } = useReview();
  const [open, setOpen] = useState(false);

  // Esc closes it, like every other overlay in the build.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isDefault =
    state.direction === REVIEW_DEFAULTS.direction &&
    state.home === REVIEW_DEFAULTS.home &&
    state.nav === REVIEW_DEFAULTS.nav &&
    state.testimonials === REVIEW_DEFAULTS.testimonials;

  // Direction C is the archive: it renders an index, not a hero, so the Home group does nothing.
  const homeInert = state.direction === "c" ? "not used by Archive" : undefined;

  const videoUnavailable = capabilities.video
    ? undefined
    : "no reel staged — run npm run videos:prepare";
  const homeUnavailable = Object.fromEntries(
    HOME_VARIANTS.filter((v) => VIDEO_HOME.has(v) && videoUnavailable).map((v) => [
      v,
      videoUnavailable,
    ]),
  ) as Partial<Record<HomeVariant, string>>;

  return (
    <div className="mt-8 w-full border-t border-red pt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="review-panel"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-paper/25 px-2 py-1.5 text-center font-display text-sm font-light text-paper transition-colors hover:border-red hover:text-red-on-dark"
      >
        <span className="block tracking-wide">Review options {open ? "▾" : "▸"}</span>
        <span className="mt-0.5 block text-paper/45">
          {DIRECTION_LABEL[state.direction]} · {HOME_LABEL[state.home]}
        </span>
      </button>

      {open ? (
        <div
          id="review-panel"
          className="fixed bottom-4 left-4 z-50 max-h-[88vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto border border-red bg-sidebar p-4 text-left shadow-2xl lg:left-[13rem]"
        >
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="font-display text-md font-light text-paper">Review options</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close review options"
              className="font-display text-md font-light text-paper/60 hover:text-red-on-dark"
            >
              ×
            </button>
          </div>
          <p className="mb-4 text-paper/45">
            Switching is instant and remembered on this device. Nothing here is part of the
            public site.
          </p>

          <div className="flex flex-col gap-5">
            <Group<Direction>
              label="Direction"
              value={state.direction}
              options={DIRECTIONS}
              labels={DIRECTION_LABEL}
              onChange={(direction) => setReview({ direction })}
            />
            <Group<HomeVariant>
              label="Homepage"
              value={state.home}
              options={HOME_VARIANTS}
              labels={HOME_LABEL}
              hints={HOME_HINT}
              inert={homeInert}
              unavailable={homeUnavailable}
              onChange={(home) => setReview({ home })}
            />
            <Group<NavVariant>
              label="Navigation"
              value={state.nav}
              options={NAV_VARIANTS}
              labels={NAV_LABEL}
              onChange={(nav) => setReview({ nav })}
            />
            <Group<TestimonialVariant>
              label="Testimonials"
              value={state.testimonials}
              options={TESTIMONIAL_VARIANTS}
              labels={TESTIMONIAL_LABEL}
              onChange={(testimonials) => setReview({ testimonials })}
            />
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={isDefault}
            className={`mt-5 w-full border px-2 py-1.5 font-display text-sm font-light transition-colors ${
              isDefault
                ? "border-paper/15 text-paper/25"
                : "border-paper/25 text-paper hover:border-red hover:text-red-on-dark"
            }`}
          >
            {isDefault ? "Showing the defaults" : "Reset to defaults"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
