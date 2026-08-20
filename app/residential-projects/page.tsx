import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadProjectTiles } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Residential projects" };

export default function ResidentialProjectsPage() {
  const tiles = loadProjectTiles();
  return (
    <Shell>
      <h1 className="sr-only">Residential projects</h1>
      <PortfolioWall tiles={tiles} initialFilter="residential" />
    </Shell>
  );
}
