"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { HeroSlot } from "@/components/media/HeroSlot";
import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";
import type { ProjectPhoto } from "@/lib/photos";
import { useReview } from "@/components/review/ReviewProvider";
import { projectIndexHref } from "@/lib/nav";
import type { LiveProject, ProjectSibling } from "@/lib/projectTypes";
import { formatSqFt, projectHref } from "@/lib/projectTypes";

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 12 28"
      className="h-8 w-3 stroke-paper"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={dir === "prev" ? "M10 2 L2 14 L10 26" : "M2 2 L10 14 L2 26"}
        strokeWidth="1"
      />
    </svg>
  );
}

function MetaLines({ project }: { project: LiveProject }) {
  return (
    <div className="space-y-3 font-body text-sm font-light leading-relaxed text-ink">
      {project.location ? <p>{project.location}</p> : null}
      {project.sizeSqFt != null ? <p>{formatSqFt(project.sizeSqFt)}</p> : null}
      {project.roles?.length ? <p>{project.roles.join(" · ")}</p> : null}
      {project.designer ? <p>Designer · {project.designer}</p> : null}
      {project.architect ? <p>Architect · {project.architect}</p> : null}
      {project.description.map((para) => (
        <p key={para.slice(0, 48)}>{para}</p>
      ))}
    </div>
  );
}

function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

    const items = focusables();
    items[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [active, ref]);
}

export function ProjectView({
  project,
  catalog,
  photos = [],
}: {
  project: LiveProject;
  catalog: ProjectSibling[];
  /** The project's full gallery, in WordPress order. Empty when the dump is absent. */
  photos?: ProjectPhoto[];
}) {
  const { state } = useReview();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(state.direction === "b");

  useEffect(() => {
    setExpanded(state.direction === "b");
  }, [state.direction, project.slug]);

  const list = useMemo(() => {
    if (state.direction === "c") return catalog;
    return catalog.filter((p) => p.category === project.category);
  }, [catalog, project.category, state.direction]);

  const index = list.findIndex((p) => p.slug === project.slug);
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const closeHref = projectIndexHref(state.direction, state.nav, project.category);

  const go = useCallback(
    (target: ProjectSibling | undefined) => {
      if (target) router.push(projectHref(target));
    },
    [router],
  );

  const close = useCallback(() => {
    router.push(closeHref);
  }, [closeHref, router]);

  useFocusTrap(rootRef, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(prev);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(next);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [close, go, next, prev]);

  const onDialogKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (state.direction === "c") {
    // Direction C is the editorial case study: the hero sits beside the copy column and the
    // rest of the gallery runs full-bleed beneath it, each frame at its own measured aspect.
    const sequence = photos.filter((p) => p.id !== project.hero?.id);
    return (
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        tabIndex={-1}
        onKeyDown={onDialogKey}
        className="min-h-full bg-paper"
      >
        <div className="flex min-h-full flex-col lg:min-h-dvh lg:flex-row">
          <div className="order-1 h-[42vh] w-full shrink-0 lg:order-2 lg:h-auto lg:min-h-dvh lg:flex-1">
            <HeroSlot
              project={project}
              direction="c"
              priority
              className="h-full min-h-[42vh] w-full lg:min-h-dvh"
            />
          </div>
          <article className="order-2 w-full shrink-0 bg-paper px-8 py-14 lg:order-1 lg:w-column lg:overflow-y-auto lg:px-10">
            <div className="mb-8 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => go(prev)}
                className="flex h-11 w-11 items-center justify-center font-display text-lg font-light text-ink"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="font-display text-lg font-light text-ink"
              >
                ×
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => go(next)}
                className="flex h-11 w-11 items-center justify-center font-display text-lg font-light text-ink"
              >
                ›
              </button>
            </div>
            <h1
              id="project-title"
              className="mb-10 text-center font-display text-lg font-light text-ink"
            >
              {project.title}
            </h1>
            <div className="text-center">
              <MetaLines project={project} />
            </div>
          </article>
        </div>
        {sequence.length > 0 ? (
          <div className="flex flex-col">
            {sequence.map((photo) => (
              <div
                key={photo.id}
                className="w-full"
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
              >
                <ProjectImageSlot
                  photo={photo}
                  className="h-full w-full"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      tabIndex={-1}
      onKeyDown={onDialogKey}
      className="relative h-full w-full overflow-hidden bg-sidebar"
    >
      <HeroSlot project={project} direction={state.direction} priority className="h-full w-full" />

      <button
        type="button"
        aria-label="Previous project"
        onClick={() => go(prev)}
        className="absolute left-3 top-1/2 z-30 flex h-12 w-10 -translate-y-1/2 items-center justify-center"
      >
        <Chevron dir="prev" />
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => go(next)}
        className={`absolute top-1/2 z-30 flex h-12 w-10 -translate-y-1/2 items-center justify-center ${
          expanded
            ? "right-3 lg:right-[calc(var(--spacing-column)+0.75rem)]"
            : "right-3"
        }`}
      >
        <Chevron dir="next" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5">
        <h1
          id="project-title"
          className="font-display text-md font-light text-paper"
          aria-live="polite"
        >
          {project.title}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? "Hide details" : "Show details"}
            onClick={() => setExpanded((v) => !v)}
            className="font-display text-lg font-light text-paper"
          >
            ⌃
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="font-display text-lg font-light text-paper"
          >
            ×
          </button>
        </div>
      </div>

      {expanded ? (
        <aside className="absolute inset-x-0 bottom-0 z-20 max-h-[70%] overflow-y-auto bg-paper px-8 py-8 lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-column">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-md font-light text-ink">{project.title}</p>
            <button
              type="button"
              aria-label="Hide details"
              onClick={() => setExpanded(false)}
              className="font-display text-lg font-light text-ink"
            >
              ×
            </button>
          </div>
          <MetaLines project={project} />
        </aside>
      ) : null}
    </div>
  );
}
