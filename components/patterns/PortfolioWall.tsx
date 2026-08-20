"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";
import { useReview } from "@/components/review/ReviewProvider";
import {
  applyFilters,
  ProjectFilters,
  type CategoryFilter,
  type FilterState,
} from "@/components/patterns/ProjectFilters";
import type { LiveProject } from "@/lib/projectTypes";
import { projectHref } from "@/lib/projectTypes";

export function PortfolioWall({
  projects,
  initialFilter = "all",
}: {
  projects: LiveProject[];
  initialFilter?: CategoryFilter;
}) {
  const { state: review } = useReview();
  const [filters, setFilters] = useState<FilterState>({
    category: initialFilter,
    sub: "all",
    trade: "all",
    sort: "default",
  });

  const shown = useMemo(
    () => applyFilters(projects, filters),
    [projects, filters],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper">
      <ProjectFilters
        projects={projects}
        direction={review.direction}
        state={filters}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-gutter">
        <div className="flex flex-wrap content-start items-start gap-gutter">
          {shown.map((project) => (
            <Link
              key={project.wpId}
              href={projectHref(project)}
              aria-label={project.title}
              className="w-full shrink-0 md:w-tile"
              style={{
                // Native aspect from the measured original, so rows stay ragged
                // (DESIGN §4 B) instead of being forced to a common ratio.
                aspectRatio: project.hero
                  ? `${project.hero.width} / ${project.hero.height}`
                  : `${project.featuredWidth} / ${project.featuredHeight}`,
              }}
            >
              <ProjectImageSlot
                photo={project.hero}
                className="h-full w-full"
                sizes="(max-width: 768px) 100vw, 332px"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
