import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  const projects = loadLiveProjects();
  return (
    <Shell>
      <h1 className="sr-only">Portfolio</h1>
      <PortfolioWall projects={projects} />
    </Shell>
  );
}
