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
 * Redirects: 37 × 301 from legacy-slugs.tsv, 2 × 410 (PLAN §9).
 * SKIP slugs never redirect. REVIEW rows fall through to 404.
 * Use the WHATWG URL constructor — NextURL.clone() re-applies a trailing slash
 * and would 308 `/commercial/<slug>/` onto itself.
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
    return NextResponse.redirect(sameOrigin(request, hit.to), 301);
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    const stripped = pathname.replace(/\/+$/, "") || "/";
    return NextResponse.redirect(sameOrigin(request, stripped, request.nextUrl.search), 308);
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
