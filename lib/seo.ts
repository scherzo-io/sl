import type { Metadata } from "next";
import {
  about,
  contact,
  millworkLead,
  people,
  propertyManagement,
  rfp,
  services,
} from "@/lib/copy";
import { site } from "@/lib/site";

/** Live origin. PLAN §9 / the WordPress host. */
export const SITE_ORIGIN = "https://streamlineusa.com";

function clip(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${cut.slice(0, sp > 80 ? sp : max)}…`;
}

function canonical(path: string) {
  return `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
}

const eric = people.people.find((p) => p.slug === "eric-ortense");
const liam = people.people.find((p) => p.slug === "liam-treanor");
if (!eric || !liam) throw new Error("people.json: Eric and Liam required");

/**
 * Descriptions are cropped sourced copy, never invented.
 * Pages without a sourced body omit description.
 */
export const PAGE_DESCRIPTION: Record<string, string> = {
  "/": clip(about.story[0]!),
  "/about": clip(about.story[0]!),
  "/about/eric-ortense": clip(eric.short),
  "/about/liam-treanor": clip(liam.short),
  "/about/millwork": clip(millworkLead),
  "/services": clip(services.intro),
  "/contact": clip(contact.lead),
  "/property-management": clip(propertyManagement.lead),
  "/request-for-pricing": clip(rfp.intro),
};

export function pageMetadata(title: string, path: string): Metadata {
  return {
    title,
    description: PAGE_DESCRIPTION[path],
    alternates: { canonical: canonical(path) },
  };
}

export function projectMetadata(title: string, path: string, description?: string): Metadata {
  return {
    title,
    description: description ? clip(description) : undefined,
    alternates: { canonical: canonical(path) },
  };
}

export function projectPageMetadata(
  project:
    | {
        title: string;
        category: "commercial" | "residential";
        slug: string;
        description: string[];
      }
    | undefined,
  category: "commercial" | "residential",
): Metadata {
  if (!project || project.category !== category) {
    return { robots: { index: false, follow: false } };
  }
  return projectMetadata(
    project.title,
    `/${project.category}/${project.slug}`,
    project.description[0],
  );
}

export function noindexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}

/** telephone omitted until Eric answers Phase A item 8. No invented hours, logo, or sameAs. */
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GeneralContractor"],
  name: site.legalName,
  url: SITE_ORIGIN,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.suite}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postal,
    addressCountry: "US",
  },
} as const;
