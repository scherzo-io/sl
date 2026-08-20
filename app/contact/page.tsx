import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { contact } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata("Contact", "/contact");

export default function ContactPage() {
  return (
    <Shell>
      <PatternC title="Contact">
        <p>{contact.lead}</p>
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
