export const DIRECTIONS = ["a", "b", "c"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const HOME_VARIANTS = [
  "still",
  "stills",
  "video-loop",
  "video-tint",
  "video-scroll",
] as const;
export type HomeVariant = (typeof HOME_VARIANTS)[number];

export const NAV_VARIANTS = [
  "reference",
  "partners",
  "split",
  "minimal",
] as const;
export type NavVariant = (typeof NAV_VARIANTS)[number];

export const TESTIMONIAL_VARIANTS = [
  "quotes",
  "reconsent",
  "decks",
  "logos",
] as const;
export type TestimonialVariant = (typeof TESTIMONIAL_VARIANTS)[number];

export type ReviewState = {
  direction: Direction;
  home: HomeVariant;
  nav: NavVariant;
  testimonials: TestimonialVariant;
};

export const REVIEW_DEFAULTS: ReviewState = {
  direction: "a",
  home: "still",
  nav: "reference",
  testimonials: "quotes",
};

export const VIDEO_HOME = new Set<HomeVariant>(["video-loop", "video-tint", "video-scroll"]);

/** The variants that lay a transparent black over the footage to mute it (PLAN §1 row 40). */
export const TINTED_HOME = new Set<HomeVariant>(["video-tint"]);

export const DIRECTION_LABEL: Record<Direction, string> = {
  a: "Faithful",
  b: "Depth",
  c: "Archive",
};

export const HOME_LABEL: Record<HomeVariant, string> = {
  still: "One photograph",
  stills: "Rotating photographs",
  "video-loop": "Video, full strength",
  "video-tint": "Video, muted by a black tint",
  "video-scroll": "Video, scrolling hero",
};

/** Shown under each option in the review panel so a reviewer knows what they are choosing. */
export const HOME_HINT: Record<HomeVariant, string> = {
  still: "The single best hero frame. Does not scroll.",
  stills: "Hero frames drifting every 8s. Does not scroll.",
  "video-loop": "The reel at full strength, edge to edge.",
  "video-tint": "The same reel under a transparent black, so the wordmark and nav sit quieter.",
  "video-scroll": "The reel as a hero you scroll past.",
};

export const NAV_LABEL: Record<NavVariant, string> = {
  reference: "Reference",
  partners: "Partners",
  split: "Split",
  minimal: "Minimal",
};

export const TESTIMONIAL_LABEL: Record<TestimonialVariant, string> = {
  quotes: "Quotes",
  reconsent: "Re-consent",
  decks: "Decks",
  logos: "Logos",
};

/** Compact cookie / localStorage value. Public URLs stay unprefixed (PLAN §1 row 3). */
export const REVIEW_COOKIE = "sl-review";

function isDirection(v: string): v is Direction {
  return (DIRECTIONS as readonly string[]).includes(v);
}
function isHome(v: string): v is HomeVariant {
  return (HOME_VARIANTS as readonly string[]).includes(v);
}
function isNav(v: string): v is NavVariant {
  return (NAV_VARIANTS as readonly string[]).includes(v);
}
function isTestimonials(v: string): v is TestimonialVariant {
  return (TESTIMONIAL_VARIANTS as readonly string[]).includes(v);
}

export function serializeReview(s: ReviewState): string {
  return `${s.direction}.${s.home}.${s.nav}.${s.testimonials}`;
}

export function parseReview(raw: string | undefined | null): ReviewState {
  if (!raw) return { ...REVIEW_DEFAULTS };
  const [d, h, n, t] = raw.split(".");
  return {
    direction: d && isDirection(d) ? d : REVIEW_DEFAULTS.direction,
    home: h && isHome(h) ? h : REVIEW_DEFAULTS.home,
    nav: n && isNav(n) ? n : REVIEW_DEFAULTS.nav,
    testimonials: t && isTestimonials(t) ? t : REVIEW_DEFAULTS.testimonials,
  };
}

export function reviewFromSearchParams(sp: {
  get(name: string): string | null;
}): Partial<ReviewState> | null {
  const d = sp.get("d");
  const home = sp.get("home");
  const nav = sp.get("nav");
  const t = sp.get("t");
  if (!d && !home && !nav && !t) return null;
  const patch: Partial<ReviewState> = {};
  if (d && isDirection(d)) patch.direction = d;
  if (home && isHome(home)) patch.home = home;
  if (nav && isNav(nav)) patch.nav = nav;
  if (t && isTestimonials(t)) patch.testimonials = t;
  return Object.keys(patch).length ? patch : null;
}
