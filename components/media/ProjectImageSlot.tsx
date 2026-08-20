type Props = {
  /** Native aspect from featured_dims. Omit to fill the parent. */
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Photography plane with no pixels yet (Cursor's image lane).
 * Visible: empty. No stock, no generated art, no captions.
 * Ground is the sidebar token so an empty slot is a dark field, not a grey box.
 */
export function ProjectImageSlot({ width, height, className = "" }: Props) {
  const style =
    width && height
      ? { aspectRatio: `${width} / ${height}` }
      : { height: "100%" as const };

  return (
    <div
      role="img"
      aria-hidden="true"
      className={`bg-sidebar ${className}`}
      style={style}
    />
  );
}
