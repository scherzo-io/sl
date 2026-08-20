import type { RoleAtom } from "@/lib/roles";
import type { SkipField } from "@/lib/skipFields";

export type ProjectTile = {
  wpId: string;
  category: "commercial" | "residential";
  slug: string;
  featuredWidth: number;
  featuredHeight: number;
  heroCapable: boolean;
  imageCount: number;
};

export type LiveProject = ProjectTile & {
  title: string;
  location: string | null;
  sizeSqFt: number | null;
  roles: RoleAtom[] | null;
  roleDetail: string | null;
  designer: string | null;
  architect: string | null;
  description: string[];
  subCategory: string | null;
  square: boolean;
  skipped: readonly SkipField[];
};

export type ProjectSibling = Pick<LiveProject, "slug" | "category" | "title">;

export function projectHref(p: Pick<LiveProject, "category" | "slug">) {
  return `/${p.category}/${p.slug}`;
}

export function formatSqFt(n: number) {
  return `${n.toLocaleString("en-US")} sq ft`;
}

export function toSibling(p: LiveProject): ProjectSibling {
  return { slug: p.slug, category: p.category, title: p.title };
}
