import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Residential projects", "/residential-projects");

export default function ResidentialProjectsPage() {
  const projects = loadLiveProjects();
  return (
    <Shell>
      <h1 className="sr-only">Residential projects</h1>
      <PortfolioWall projects={projects} initialFilter="residential" />
    </Shell>
  );
}
