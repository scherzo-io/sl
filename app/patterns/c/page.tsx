import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { servicesIntro } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pattern C" };

export default function PatternCPage() {
  return (
    <Shell>
      <PatternC title="Content">
        <p>{servicesIntro}</p>
      </PatternC>
    </Shell>
  );
}
