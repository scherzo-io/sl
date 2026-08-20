import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { proofPoints, services } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <Shell>
      <PatternC title="Services">
        <p>{services.intro}</p>
        {services.items.map((s) => (
          <div key={s.name} className="space-y-2">
            <h2 className="font-display text-md font-light">{s.name}</h2>
            <p>{s.body}</p>
          </div>
        ))}
        <h2 className="font-display text-md font-light">Why work with us</h2>
        {services.whyWorkWithUs.map((item) => (
          <div key={item.title} className="space-y-2">
            <h3 className="font-display text-sm font-light">{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
        {proofPoints.items.map((item) => (
          <p key={item.id}>{item.text}</p>
        ))}
      </PatternC>
    </Shell>
  );
}
