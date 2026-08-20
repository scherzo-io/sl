import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { propertyManagement } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Property management" };

export default function PropertyManagementPage() {
  return (
    <Shell>
      <PatternC title="Property management">
        {propertyManagement.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </PatternC>
    </Shell>
  );
}
