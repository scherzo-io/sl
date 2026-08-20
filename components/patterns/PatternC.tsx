import type { ReactNode } from "react";
import { ProjectImageSlot } from "@/components/media/ProjectImageSlot";

type Props = {
  title: string;
  children?: ReactNode;
};

/**
 * Content: ~400px white column + full-height photograph.
 * Desktop: column scrolls, photograph stays. Mobile: photo then column. DESIGN §4.
 */
export function PatternC({ title, children }: Props) {
  return (
    <div className="flex min-h-full flex-col lg:h-full lg:min-h-0 lg:flex-row">
      <div className="order-1 h-[42vh] w-full shrink-0 lg:order-2 lg:h-full lg:flex-1">
        <ProjectImageSlot className="h-full w-full" />
      </div>
      <article className="order-2 flex w-full shrink-0 flex-col bg-paper px-8 py-14 lg:order-1 lg:h-full lg:w-column lg:overflow-y-auto lg:px-10">
        <h1 className="mb-10 text-center font-display text-lg font-light text-ink">
          {title}
        </h1>
        <div className="space-y-6 text-center font-body text-sm font-light leading-relaxed text-ink">
          {children}
        </div>
      </article>
    </div>
  );
}
