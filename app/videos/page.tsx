import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Videos", "/videos");

export default function VideosPage() {
  return (
    <Shell>
      <PatternC title="Videos" />
    </Shell>
  );
}
