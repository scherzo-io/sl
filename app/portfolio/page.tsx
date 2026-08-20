import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Portfolio", "/portfolio");

export default function PortfolioPage() {
  const projects = loadLiveProjects();
  return (
    <Shell>
      <h1 className="sr-only">Portfolio</h1>
      <PortfolioWall projects={projects} />
    </Shell>
  );
}
