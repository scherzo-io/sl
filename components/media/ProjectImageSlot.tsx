import Image from "next/image";
import type { ProjectPhoto } from "@/lib/photos";

type Props = {
  /** The photograph. Omit for the empty field (no dump, or no photo for this slot). */
  photo?: ProjectPhoto | null;
  /** Native aspect when there is no photo. Omit to fill the parent. */
  width?: number;
  height?: number;
  className?: string;
  /** Sizes hint for the optimizer. Full-bleed slots should pass a viewport-width value. */
  sizes?: string;
  priority?: boolean;
  /** Keep the frame's own aspect instead of cropping to the parent. Index tiles do this. */
  native?: boolean;
};

/**
 * One photography slot.
 *
 * With a photo: `next/image` over the git-ignored dump (symlinked at `public/photos`),
 * `object-cover` so nothing is ever distorted — the reference site's `object-fit: fill`
 * stretch is one of the faults this rebuild exists to fix.
 *
 * Without one: an empty dark field on the sidebar token. No stock, no generated art, no
 * grey placeholder box, no caption.
 *
 * `alt` comes from `lib/photos` and is `""` until `content/images/alt-text.tsv` is written.
 * An empty alt on a photograph whose accessible name comes from adjacent text is correct;
 * inventing 887 descriptions would not be.
 */
export function ProjectImageSlot({
  photo,
  width,
  height,
  className = "",
  sizes = "100vw",
  priority = false,
  native = false,
}: Props) {
  if (!photo) {
    const style =
      width && height
        ? { aspectRatio: `${width} / ${height}` }
        : { height: "100%" as const };
    return (
      <div role="img" aria-hidden="true" className={`bg-sidebar ${className}`} style={style} />
    );
  }

  if (native) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt ?? ""}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className={`h-auto w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-sidebar ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
