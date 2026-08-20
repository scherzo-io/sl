import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { millworkLead, services } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "In-house millwork + cabinet shop" };

const millwork = services.find((s) => s.name === "Millwork");
const carpentry = services.find((s) => s.name === "Carpentry");

export default function MillworkPage() {
  return (
    <Shell>
      <PatternC title="In-house millwork + cabinet shop">
        <p>{millworkLead}</p>
        {millwork ? <p>{millwork.body}</p> : null}
        {carpentry ? <p>{carpentry.body}</p> : null}
      </PatternC>
    </Shell>
  );
}
