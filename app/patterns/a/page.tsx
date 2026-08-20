import { PatternA } from "@/components/patterns/PatternA";
import { Shell } from "@/components/shell/Shell";
import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Pattern A");

export default function PatternAPage() {
  return (
    <Shell scroll="none">
      <PatternA />
    </Shell>
  );
}
