import { notFound } from "next/navigation";
import { ProjectView } from "@/components/media/ProjectView";
import { Shell } from "@/components/shell/Shell";
import { loadLiveProjects, projectBySlug } from "@/lib/projects";
import { toSibling } from "@/lib/projectTypes";
import type { Metadata } from "next";

type Params = { slug: string };

export function generateStaticParams() {
  return loadLiveProjects()
    .filter((p) => p.category === "residential")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ResidentialProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || project.category !== "residential") notFound();
  const catalog = loadLiveProjects().map(toSibling);
  return (
    <Shell>
      <ProjectView project={project} catalog={catalog} />
    </Shell>
  );
}
