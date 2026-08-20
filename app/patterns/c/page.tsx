import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { servicesIntro } from "@/lib/copy";
import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Pattern C");

export default function PatternCPage() {
  return (
    <Shell>
      <PatternC title="Content">
        <p>{servicesIntro}</p>
      </PatternC>
    </Shell>
  );
}
