import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";
import type { LiveProject } from "@/lib/projectTypes";
import type { Direction } from "@/lib/review";

/**
 * A project's hero frame.
 *
 * Direction A pillarboxes the four all-square projects rather than cropping them —
 * Lantern House, The Pierre, 652 Hudson, 40 E 66th are 2048×2048 and are also the newest
 * and best work, so DESIGN §8 asks for a deliberate treatment instead of a centre crop.
 * B and C crop to the slot with `object-cover`.
 */
export function HeroSlot({
  project,
  direction,
  className = "h-full w-full",
  priority = false,
}: {
  project: LiveProject;
  direction: Direction;
  className?: string;
  priority?: boolean;
}) {
  const photo = project.hero;

  if (direction === "a" && project.square) {
    return (
      <div className={`flex items-center justify-center bg-sidebar ${className}`}>
        <div className="aspect-square h-full max-w-full">
          <ProjectImageSlot
            photo={photo}
            className="h-full w-full"
            width={project.featuredWidth}
            height={project.featuredHeight}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
          />
        </div>
      </div>
    );
  }

  return (
    <ProjectImageSlot
      photo={photo}
      className={className}
      sizes="100vw"
      priority={priority}
    />
  );
}
