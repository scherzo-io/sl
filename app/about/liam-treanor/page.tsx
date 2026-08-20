import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Liam Treanor" };

export default function LiamPage() {
  return (
    <Shell>
      <PatternC title="Liam Treanor">
        <p>Chief operating officer</p>
      </PatternC>
    </Shell>
  );
}
