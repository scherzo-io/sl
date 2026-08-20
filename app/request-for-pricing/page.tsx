import { RfpForm } from "@/components/forms/RfpForm";
import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { rfp } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Request for pricing", "/request-for-pricing");

export default function RfpPage() {
  return (
    <Shell>
      <PatternC title="Request for pricing">
        <p>{rfp.intro}</p>
        <RfpForm />
      </PatternC>
    </Shell>
  );
}
