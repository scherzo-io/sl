"use client";

import type { RoleAtom } from "@/lib/roles";
import { ROLE_ATOMS } from "@/lib/roles";
import { SUBCATEGORIES } from "@/lib/subCategories";
import type { Direction } from "@/lib/review";
import type { LiveProject } from "@/lib/projectTypes";

export type CategoryFilter = "all" | "commercial" | "residential";
export type SqftSort = "default" | "sqft-asc" | "sqft-desc";

export type FilterState = {
  category: CategoryFilter;
  sub: string | "all";
  trade: RoleAtom | "all";
  sort: SqftSort;
};

function assignedSubcategories(projects: LiveProject[]) {
  const present = new Set(
    projects.map((p) => p.subCategory).filter((v): v is string => Boolean(v)),
  );
  return SUBCATEGORIES.filter((s) => present.has(s));
}

function presentTrades(projects: LiveProject[]) {
  const present = new Set<RoleAtom>();
  for (const p of projects) {
    p.roles?.forEach((r) => present.add(r));
  }
  return ROLE_ATOMS.filter((a) => present.has(a));
}

function Chip<T extends string>({
  id,
  label,
  value,
  onChange,
}: {
  id: T;
  label: string;
  value: T;
  onChange: (v: T) => void;
}) {
  const selected = value === id;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onChange(id)}
      className={`font-display text-sm font-light ${
        selected ? "text-red" : "text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function ProjectFilters({
  projects,
  direction,
  state,
  onChange,
}: {
  projects: LiveProject[];
  direction: Direction;
  state: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
}) {
  const subs = assignedSubcategories(projects);
  const trades = presentTrades(projects);
  const showSub = direction !== "a" && subs.length > 0;
  const showTrade = direction === "c" && trades.length > 0;
  const showSort = direction === "c";

  return (
    <div className="flex shrink-0 flex-col gap-3 px-3 py-3">
      <div className="flex flex-wrap items-center gap-4">
        <p className="font-display text-sm font-light tracking-[0.28em] text-ink">
          Filter
        </p>
        <div className="flex flex-wrap gap-4" role="group" aria-label="Project category">
          <Chip id="all" label="All" value={state.category} onChange={(category) => onChange({ category })} />
          <Chip
            id="commercial"
            label="Commercial"
            value={state.category}
            onChange={(category) => onChange({ category })}
          />
          <Chip
            id="residential"
            label="Residential"
            value={state.category}
            onChange={(category) => onChange({ category })}
          />
        </div>
      </div>
      {showSub ? (
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-display text-sm font-light text-ink">Type</p>
          <div className="flex flex-wrap gap-4" role="group" aria-label="Sub-category">
            <Chip id="all" label="All" value={state.sub} onChange={(sub) => onChange({ sub })} />
            {subs.map((s) => (
              <Chip key={s} id={s} label={s} value={state.sub} onChange={(sub) => onChange({ sub })} />
            ))}
          </div>
        </div>
      ) : null}
      {showTrade ? (
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-display text-sm font-light text-ink">Trade</p>
          <div className="flex flex-wrap gap-4" role="group" aria-label="Self-performed trade">
            <Chip id="all" label="All" value={state.trade} onChange={(trade) => onChange({ trade })} />
            {trades.map((t) => (
              <Chip key={t} id={t} label={t} value={state.trade} onChange={(trade) => onChange({ trade })} />
            ))}
          </div>
        </div>
      ) : null}
      {showSort ? (
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-display text-sm font-light text-ink">Size</p>
          <div className="flex flex-wrap gap-4" role="group" aria-label="Sort by size">
            <Chip
              id="default"
              label="Listed"
              value={state.sort}
              onChange={(sort) => onChange({ sort })}
            />
            <Chip
              id="sqft-asc"
              label="Smallest"
              value={state.sort}
              onChange={(sort) => onChange({ sort })}
            />
            <Chip
              id="sqft-desc"
              label="Largest"
              value={state.sort}
              onChange={(sort) => onChange({ sort })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function applyFilters(projects: LiveProject[], state: FilterState): LiveProject[] {
  let list = projects;
  if (state.category !== "all") list = list.filter((p) => p.category === state.category);
  if (state.sub !== "all") list = list.filter((p) => p.subCategory === state.sub);
  if (state.trade !== "all") {
    list = list.filter((p) => p.roles?.includes(state.trade as RoleAtom));
  }
  if (state.sort === "sqft-asc") {
    list = [...list].sort(
      (a, b) => (a.sizeSqFt ?? Number.POSITIVE_INFINITY) - (b.sizeSqFt ?? Number.POSITIVE_INFINITY),
    );
  }
  if (state.sort === "sqft-desc") {
    list = [...list].sort((a, b) => (b.sizeSqFt ?? -1) - (a.sizeSqFt ?? -1));
  }
  return list;
}
