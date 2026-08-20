import Link from "next/link";
import { DirectionProofPoints } from "@/components/review/DirectionProofPoints";
import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { about, people } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <Shell>
      <PatternC title="About us">
        {about.story.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        <h2 className="font-display text-md font-light">Mission</h2>
        {about.mission.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        <h2 className="font-display text-md font-light">Why work with us</h2>
        {about.whyWorkWithUs.map((item) => (
          <div key={item.title} className="space-y-2">
            <h3 className="font-display text-sm font-light">{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
        <DirectionProofPoints />
        <h2 id="team" className="font-display text-md font-light">
          Team
        </h2>
        {people.people.map((person) => (
          <div key={person.slug} className="space-y-2">
            <h3 className="font-display text-sm font-light">
              <Link href={`/about/${person.slug}`} className="text-red">
                {person.name}
              </Link>
            </h3>
            <p>{person.title}</p>
            <p>{person.short}</p>
          </div>
        ))}
      </PatternC>
    </Shell>
  );
}
