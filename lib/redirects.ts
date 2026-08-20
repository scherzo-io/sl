import data from "@/content/copy/redirects.json";

export function normalizePath(pathname: string) {
  let s = pathname.trim();
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

const GONE = new Set(data.gone);
const LIVE = new Set(data.live.map((p) => p.path));
const SKIP_SLUGS = new Set(data.skipSlugs);
const PERMANENT = new Map(data.permanent.map((r) => [r.from, r.to]));

export type RedirectHit =
  | { kind: "gone" }
  | { kind: "redirect"; to: string }
  | { kind: "live" }
  | { kind: "none" };

/**
 * SKIP slugs are never redirected in either category prefix.
 * Live (category, slug) pairs always fall through to the project page.
 * REVIEW rows are not in PERMANENT — they 404.
 */
export function lookupRedirect(pathname: string): RedirectHit {
  const path = normalizePath(pathname);
  if (GONE.has(path)) return { kind: "gone" };
  if (LIVE.has(path)) return { kind: "live" };
  const parts = path.split("/").filter(Boolean);
  const slug = parts.length === 2 ? parts[1] : undefined;
  if (slug && SKIP_SLUGS.has(slug)) return { kind: "none" };
  const to = PERMANENT.get(path);
  if (to) return { kind: "redirect", to };
  return { kind: "none" };
}

export const redirectSeed = data;
