import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { contactLead } from "@/lib/copy";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Shell>
      <PatternC title="Contact">
        <p>{contactLead}</p>
        <p>{site.address.line}</p>
        <p>
          <a href={`mailto:${site.email}`} className="text-red">
            {site.email}
          </a>
        </p>
      </PatternC>
    </Shell>
  );
}
