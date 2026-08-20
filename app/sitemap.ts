import type { MetadataRoute } from "next";
import { loadLiveProjects } from "@/lib/projects";
import { SITE_ORIGIN } from "@/lib/seo";

const PAGES = [
  "/",
  "/about",
  "/about/eric-ortense",
  "/about/liam-treanor",
  "/about/millwork",
  "/services",
  "/portfolio",
  "/commercial-projects",
  "/residential-projects",
  "/clients",
  "/videos",
  "/property-management",
  "/contact",
  "/request-for-pricing",
  "/partners",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.map((path) => ({
    url: path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`,
  }));
  const projects = loadLiveProjects().map((p) => ({
    url: `${SITE_ORIGIN}/${p.category}/${p.slug}`,
  }));
  return [...pages, ...projects];
}
