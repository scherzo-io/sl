import navigation from "@/content/copy/navigation.json";
import type { Direction, NavVariant } from "@/lib/review";

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const nav: readonly NavItem[] = navigation.items;

const ABOUT: NavItem = nav[0]!;

const REFERENCE: NavItem[] = [...nav];

const PARTNERS: NavItem[] = [
  ABOUT,
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Partners", href: "/partners" },
  { label: "Testimonials", href: "/clients" },
  { label: "Videos", href: "/videos" },
  { label: "Property management", href: "/property-management" },
  { label: "Contact", href: "/contact" },
  { label: "Request for pricing", href: "/request-for-pricing" },
];

const SPLIT: NavItem[] = [
  ABOUT,
  { label: "Services", href: "/services" },
  { label: "Commercial", href: "/commercial-projects" },
  { label: "Residential", href: "/residential-projects" },
  { label: "Testimonials", href: "/clients" },
  { label: "Videos", href: "/videos" },
  { label: "Property management", href: "/property-management" },
  { label: "Contact", href: "/contact" },
  { label: "Request for pricing", href: "/request-for-pricing" },
];

const MINIMAL: NavItem[] = [
  ABOUT,
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Request for pricing", href: "/request-for-pricing" },
];

/** Direction C: the archive is the argument. Services demoted. */
const ARCHIVE: NavItem[] = [
  { label: "Work", href: "/portfolio" },
  ABOUT,
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Request for pricing", href: "/request-for-pricing" },
];

export function navFor(direction: Direction, variant: NavVariant): readonly NavItem[] {
  if (direction === "c") return ARCHIVE;
  switch (variant) {
    case "partners":
      return PARTNERS;
    case "split":
      return SPLIT;
    case "minimal":
      return MINIMAL;
    default:
      return REFERENCE;
  }
}

/** Where × on a project lightbox returns. Split nav keeps the category index. */
export function projectIndexHref(
  direction: Direction,
  variant: NavVariant,
  category: "commercial" | "residential",
) {
  if (direction !== "c" && variant === "split") {
    return category === "commercial" ? "/commercial-projects" : "/residential-projects";
  }
  return "/portfolio";
}
