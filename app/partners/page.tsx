import { PartnersWall } from "@/components/media/PartnersWall";
import { Shell } from "@/components/shell/Shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Partners", "/partners");

export default function PartnersPage() {
  return (
    <Shell>
      <h1 className="sr-only">Partners</h1>
      <PartnersWall />
    </Shell>
  );
}
