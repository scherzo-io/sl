import { NextResponse, type NextRequest } from "next/server";
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
 */
export function middleware(request: NextRequest) {
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
