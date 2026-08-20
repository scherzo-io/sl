/**
 * Default IA — DESIGN.md §5. Sentence case (DESIGN §3).
 * Property management stays (PLAN §5). No Press.
 * Testimonials keep the live URL /clients/ (PLAN §9).
 */
export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const nav: readonly NavItem[] = [
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "Company profile", href: "/about" },
      { label: "Team", href: "/about/eric-ortense" },
      { label: "In-house millwork + cabinet shop", href: "/about/millwork" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Testimonials", href: "/clients" },
  { label: "Videos", href: "/videos" },
  { label: "Property management", href: "/property-management" },
  { label: "Contact", href: "/contact" },
  { label: "Request for pricing", href: "/request-for-pricing" },
] as const;
