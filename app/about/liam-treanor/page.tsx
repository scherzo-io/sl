import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { personBySlug } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Liam Treanor", "/about/liam-treanor");

export default function LiamPage() {
  const person = personBySlug("liam-treanor");
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
