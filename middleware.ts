import { NextResponse, type NextRequest } from "next/server";
import { lookupRedirect } from "@/lib/redirects";
import {
  REVIEW_COOKIE,
  parseReview,
  reviewFromSearchParams,
  serializeReview,
} from "@/lib/review";

/**
 * Query `?d=c&home=stills&nav=split&t=quotes` writes the review cookie
 * and forwards the resolved state so the layout can SSR the same values.
 * Public pathnames stay `/`, `/portfolio`, `/commercial/<slug>`, `/residential/<slug>`.
 *
 * Redirects: 111 × 301 (37 legacy rows + one cross-category path per live slug + the 16
 * resolved REVIEW paths) and 2 × 410 (PLAN §9). `lookupRedirect` normalises the trailing
 * slash before matching, so both URL forms hit the same rule. A live path is never
 * redirected — that is what keeps the SKIP slugs serving their own project.
 *
 * `trailingSlash: true` (next.config) makes the slashed form canonical, per PLAN §1 row 3.
 * Redirect targets are emitted slashed so a legacy hit lands in one hop, not two.
 */
function sameOrigin(request: NextRequest, pathname: string, search = "") {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = search;
  url.hash = "";
  return url;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hit = lookupRedirect(pathname);
  if (hit.kind === "gone") {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  if (hit.kind === "redirect") {
    // Land on the canonical slashed form so a legacy URL costs one hop, not two.
    const to = hit.to.endsWith("/") ? hit.to : `${hit.to}/`;
    return NextResponse.redirect(sameOrigin(request, to), 301);
  }

  const patch = reviewFromSearchParams(request.nextUrl.searchParams);
  const current = parseReview(request.cookies.get(REVIEW_COOKIE)?.value);
  const next = patch ? { ...current, ...patch } : current;
  const headers = new Headers(request.headers);
  headers.set("x-sl-review", serializeReview(next));
  const response = NextResponse.next({ request: { headers } });
  if (patch) {
    response.cookies.set(REVIEW_COOKIE, serializeReview(next), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|studio).*)"],
};
