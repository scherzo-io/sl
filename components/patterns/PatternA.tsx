import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";

/** Landing: sidebar + one full-bleed photograph. Does not scroll. DESIGN §4. */
export function PatternA() {
  return (
    <div className="h-full w-full">
      <h1 className="sr-only">Streamline USA</h1>
      <ProjectImageSlot className="h-full w-full" />
    </div>
  );
}
