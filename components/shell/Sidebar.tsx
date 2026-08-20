import Link from "next/link";
import { ReviewControls } from "@/components/review/ReviewControls";
import { site } from "@/lib/site";
import { Nav } from "./Nav";

export function SidebarChrome({ onNavigate }: { onNavigate?: () => void }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto bg-sidebar px-3 py-8 text-center">
      <Link
        href="/"
        onClick={onNavigate}
        className="font-display text-lg font-light tracking-wide text-red"
      >
        {site.wordmark}
      </Link>

      <nav aria-label="Primary" className="mt-10 w-full">
        <Nav onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto flex w-full flex-col items-center gap-3 pt-8">
        <ReviewControls />
        <a
          href={`mailto:${site.email}`}
          className="break-all font-display text-sm font-light text-red-on-dark"
        >
          {site.email}
        </a>
        <p className="font-display text-xs font-light text-paper">
          © {year} {site.legalName}
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside
      className="hidden h-dvh w-sidebar shrink-0 border-r border-red lg:block"
      aria-label="Site"
    >
      <SidebarChrome />
    </aside>
  );
}
