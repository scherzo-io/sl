import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { personBySlug } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Liam Treanor" };

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
