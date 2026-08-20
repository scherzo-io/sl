"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  applyFilters,
  ProjectFilters,
  type FilterState,
} from "@/components/patterns/ProjectFilters";
import type { LiveProject } from "@/lib/projectTypes";
import { projectHref } from "@/lib/projectTypes";

export function ArchiveIndex({ projects }: { projects: LiveProject[] }) {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    sub: "all",
    trade: "all",
    sort: "default",
  });
  const shown = useMemo(() => applyFilters(projects, filters), [projects, filters]);

  return (
    <div className="bg-paper px-8 py-14">
      <h1 className="mb-10 text-center font-display text-lg font-light text-ink">Work</h1>
      <ProjectFilters
        projects={projects}
        direction="c"
        state={filters}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />
      <ul className="mt-8 space-y-3">
        {shown.map((project) => (
          <li key={project.slug} className="text-center">
            <Link
              href={projectHref(project)}
              className="font-display text-md font-light text-ink hover:text-red"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
