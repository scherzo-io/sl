"use client";

import { useMemo, useState } from "react";
import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";
import type { ProjectTile } from "@/lib/projects";

export type Filter = "all" | "commercial" | "residential";

export function PortfolioWall({
  tiles,
  initialFilter = "all",
}: {
  tiles: ProjectTile[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const shown = useMemo(
    () => (filter === "all" ? tiles : tiles.filter((t) => t.category === filter)),
    [filter, tiles],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper">
      <div className="flex shrink-0 flex-wrap items-center gap-4 px-3 py-3">
        <p className="font-display text-sm font-light tracking-[0.28em] text-ink">
          Filter
        </p>
        <div className="flex flex-wrap gap-4" role="group" aria-label="Project category">
          {(
            [
              ["all", "All"],
              ["commercial", "Commercial"],
              ["residential", "Residential"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`font-display text-sm font-light ${
                filter === id ? "text-red" : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-gutter">
        <div className="flex flex-wrap content-start items-start gap-gutter">
          {shown.map((tile) => (
            <div
              key={tile.wpId}
              className="w-full shrink-0 md:w-tile"
              style={{
                aspectRatio: `${tile.featuredWidth} / ${tile.featuredHeight}`,
              }}
            >
              <ProjectImageSlot className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
