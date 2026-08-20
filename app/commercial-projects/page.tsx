import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Commercial projects", "/commercial-projects");

export default function CommercialProjectsPage() {
  const projects = loadLiveProjects();
  return (
    <Shell>
      <h1 className="sr-only">Commercial projects</h1>
      <PortfolioWall projects={projects} initialFilter="commercial" />
    </Shell>
  );
}
