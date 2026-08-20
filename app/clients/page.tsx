import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Testimonials" };

export default function ClientsPage() {
  return (
    <Shell>
      <PatternC title="Testimonials" />
    </Shell>
  );
}
