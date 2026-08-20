import { PatternA } from "@/components/patterns/PatternA";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pattern A" };

export default function PatternAPage() {
  return (
    <Shell scroll="none">
      <PatternA />
    </Shell>
  );
}
