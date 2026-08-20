import { PortfolioWall } from "@/components/patterns/PortfolioWall";
import { Shell } from "@/components/shell/Shell";
import { loadProjectTiles } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  const tiles = loadProjectTiles();
  return (
    <Shell>
      <h1 className="sr-only">Portfolio</h1>
      <PortfolioWall tiles={tiles} />
    </Shell>
  );
}
