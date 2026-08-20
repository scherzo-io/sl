import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadProjectTiles } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Commercial projects" };

export default function CommercialProjectsPage() {
  const tiles = loadProjectTiles();
  return (
    <Shell>
      <h1 className="sr-only">Commercial projects</h1>
      <PortfolioWall tiles={tiles} initialFilter="commercial" />
    </Shell>
  );
}
