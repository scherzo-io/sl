import { HomeHero } from "@/components/media/HomeHero";
import { HomeShell } from "@/components/shell/HomeShell";
import { loadLiveProjects } from "@/lib/projects";

export default function Home() {
  const projects = loadLiveProjects();
  const heroes = projects.filter((p) => p.heroCapable);
  return (
    <HomeShell>
      <HomeHero projects={projects} heroes={heroes} />
    </HomeShell>
  );
}
