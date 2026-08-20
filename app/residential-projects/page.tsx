import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Residential projects" };

export default function ResidentialProjectsPage() {
  const projects = loadLiveProjects();
  return (
    <Shell>
      <h1 className="sr-only">Residential projects</h1>
      <PortfolioWall projects={projects} initialFilter="residential" />
    </Shell>
  );
}
