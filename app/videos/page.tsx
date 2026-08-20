import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Videos" };

export default function VideosPage() {
  return (
    <Shell>
      <PatternC title="Videos" />
    </Shell>
  );
}
