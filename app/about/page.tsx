import { PatternC } from "@/components/patterns/PatternC";
import { Shell } from "@/components/shell/Shell";
import { aboutMission, aboutStory } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <Shell>
      <PatternC title="About us">
        {aboutStory.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        {aboutMission.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </PatternC>
    </Shell>
  );
}
