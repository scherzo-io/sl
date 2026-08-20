import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pattern B" };

export default function PatternBPage() {
  const projects = loadLiveProjects();
  return (
    <Shell>
      <h1 className="sr-only">Pattern B</h1>
      <PortfolioWall projects={projects} />
    </Shell>
  );
}
