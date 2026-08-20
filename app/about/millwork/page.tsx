import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { millworkLead, services } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("In-house millwork + cabinet shop", "/about/millwork");

const millwork = services.items.find((s) => s.name === "Millwork");
const carpentry = services.items.find((s) => s.name === "Carpentry");

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
