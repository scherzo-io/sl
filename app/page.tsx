import { HomeHero } from "@/components/media/HomeHero";
import { HomeShell } from "@/components/shell/HomeShell";
import { loadLiveProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...pageMetadata(site.name, "/"),
  title: { absolute: site.name },
};

export default function Home() {
  const projects = loadLiveProjects();
  const heroes = projects.filter((p) => p.heroCapable);
  return (
    <HomeShell>
      <HomeHero projects={projects} heroes={heroes} />
    </HomeShell>
  );
}
