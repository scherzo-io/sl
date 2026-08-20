import { PartnersWall } from "@/components/media/PartnersWall";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <Shell>
      <h1 className="sr-only">Partners</h1>
      <PartnersWall />
    </Shell>
  );
}
