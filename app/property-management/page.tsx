import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { propertyManagement } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Property management", "/property-management");

export default function PropertyManagementPage() {
  return (
    <Shell>
      <PatternC title="Property management">
        <p>{propertyManagement.lead}</p>
        {propertyManagement.highlights.map((h) => (
          <div key={h.title} className="space-y-2">
            <h2 className="font-display text-md font-light">{h.title}</h2>
            <p>{h.body}</p>
          </div>
        ))}
        <h2 className="font-display text-md font-light">Service plans</h2>
        {propertyManagement.plans.map((plan) => (
          <p key={plan.name}>
            {plan.name} — {plan.cadence}
          </p>
        ))}
        <h2 className="font-display text-md font-light">Property management services</h2>
        {propertyManagement.services.map((s) => (
          <div key={s.name} className="space-y-2">
            <h3 className="font-display text-sm font-light">{s.name}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </PatternC>
    </Shell>
  );
}
