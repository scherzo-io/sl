import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { services, servicesIntro } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <Shell>
      <PatternC title="Services">
        <p>{servicesIntro}</p>
        {services.map((s) => (
          <div key={s.name} className="space-y-2">
            <h2 className="font-display text-md font-light">{s.name}</h2>
            <p>{s.body}</p>
          </div>
        ))}
      </PatternC>
    </Shell>
  );
}
