import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { personBySlug } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Eric Ortense", "/about/eric-ortense");

export default function EricPage() {
  const person = personBySlug("eric-ortense");
  if (!person) return null;
  return (
    <Shell>
      <PatternC title={person.name}>
        <p>{person.title}</p>
        {person.bio.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </PatternC>
    </Shell>
  );
}
