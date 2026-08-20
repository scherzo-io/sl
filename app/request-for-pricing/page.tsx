import { RfpForm } from "@/components/forms/RfpForm";
import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { rfp } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Request for pricing" };

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
