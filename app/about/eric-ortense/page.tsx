import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eric Ortense" };

export default function EricPage() {
  return (
    <Shell>
      <PatternC title="Eric Ortense">
        <p>Chief executive officer</p>
      </PatternC>
    </Shell>
  );
}
