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
 * Order matters.
 *
 * 1. The two PLAN §9 410s.
 * 2. A live (category, slug) path always falls through to its project page — this is what
 *    protects the SKIP slugs, and it is checked before any redirect so no live URL can be
 *    redirected away.
 * 3. PERMANENT, which now carries three kinds of 301: the 37 unambiguous legacy rows, one
 *    cross-category path per live slug, and the 16 ambiguous REVIEW paths resolved from
 *    `content/redirect-decisions.tsv`.
 *
 * The cross-category entries exist because WordPress resolves an old slug ignoring the
 * category segment: `/residential/mackage-soho` 301s to the commercial project on production
 * today. Matching on exact path alone 404s those (review claude-2026-08-20 §1b).
 */
export function lookupRedirect(pathname: string): RedirectHit {
  const path = normalizePath(pathname);
  if (GONE.has(path)) return { kind: "gone" };
  if (LIVE.has(path)) return { kind: "live" };
  const to = PERMANENT.get(path);
  if (to) return { kind: "redirect", to };
  return { kind: "none" };
}

/** Kept for the redirect checker's invariants: no SKIP slug may lose its live page. */
export const skipSlugs = SKIP_SLUGS;

export const redirectSeed = data;
