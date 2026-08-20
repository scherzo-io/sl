"use client";

import { useEffect, useState } from "react";
import { ArchiveIndex } from "@/components/media/ArchiveIndex";
import { HeroSlot } from "@/components/media/HeroSlot";
import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";
import type { LiveProject } from "@/lib/projectTypes";
import { VIDEO_HOME } from "@/lib/review";
import { useReview } from "@/components/review/ReviewProvider";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function RotatingStills({
  heroes,
  direction,
}: {
  heroes: LiveProject[];
  direction: "a" | "b" | "c";
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || heroes.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % heroes.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [reduced, heroes.length]);

  const current = heroes[index];
  if (!current) return <ProjectImageSlot className="h-full w-full" />;

  return (
    <div className="h-full w-full">
      <HeroSlot project={current} direction={direction} priority />
      <p className="sr-only" aria-live="polite">
        {current.title}
      </p>
    </div>
  );
}

export function HomeHero({
  projects,
  heroes,
}: {
  projects: LiveProject[];
  heroes: LiveProject[];
}) {
  const { state } = useReview();
  const { direction, home } = state;

  if (direction === "c") {
    return (
      <div className="min-h-full bg-paper">
        <ArchiveIndex projects={projects} />
      </div>
    );
  }

  if (VIDEO_HOME.has(home)) {
    return (
      <div
        className={
          home === "video-scroll"
            ? "min-h-[160vh] w-full bg-sidebar"
            : "h-full w-full bg-sidebar"
        }
      >
        <h1 className="sr-only">Streamline USA</h1>
      </div>
    );
  }

  if (home === "stills") {
    return (
      <div className="h-full w-full overflow-hidden">
        <h1 className="sr-only">Streamline USA</h1>
        <RotatingStills heroes={heroes} direction={direction} />
      </div>
    );
  }

  const still = heroes[0];
  return (
    <div className="h-full w-full overflow-hidden">
      <h1 className="sr-only">Streamline USA</h1>
      {still ? (
        <HeroSlot project={still} direction={direction} priority />
      ) : (
        <ProjectImageSlot className="h-full w-full" />
      )}
    </div>
  );
}
