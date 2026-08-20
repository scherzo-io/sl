import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";
import type { LiveProject } from "@/lib/projectTypes";
import type { Direction } from "@/lib/review";

/** Direction A pillarboxes the four 2048×2048 projects (DESIGN §8). */
export function HeroSlot({
  project,
  direction,
  className = "h-full w-full",
}: {
  project: LiveProject;
  direction: Direction;
  className?: string;
}) {
  if (direction === "a" && project.square) {
    return (
      <div className={`flex items-center justify-center bg-sidebar ${className}`}>
        <div className="aspect-square h-full max-w-full">
          <ProjectImageSlot
            className="h-full w-full"
            width={project.featuredWidth}
            height={project.featuredHeight}
          />
        </div>
      </div>
    );
  }
  return <ProjectImageSlot className={className} />;
}
