import partners from "@/content/copy/partners.json";
import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";

/**
 * Type + empty artwork slot per verified name.
 * names is [] until Cursor's manifest lands — render zero slots, never OCR.
 */
export function PartnersWall() {
  const names: readonly string[] = partners.names;
  if (names.length === 0) {
    return <div className="h-full min-h-64 w-full bg-paper" />;
  }
  return (
    <div className="flex flex-wrap content-start items-start gap-gutter p-gutter">
      {names.map((name) => (
        <div key={name} className="w-tile">
          <ProjectImageSlot className="h-24 w-full" />
          <p className="mt-2 text-center font-display text-sm font-light text-ink">{name}</p>
        </div>
      ))}
    </div>
  );
}
