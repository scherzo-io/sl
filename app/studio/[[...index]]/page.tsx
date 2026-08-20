import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Studio");

/**
 * Embedded Studio route — reserved. next-sanity mounts here in Phase C
 * once a Sanity project id exists (workorders/README §5). Do not deploy schema.
 */
export default function StudioStubPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-sidebar px-8">
      <p className="max-w-sm text-center font-display text-md font-light text-paper">
        Studio
      </p>
    </main>
  );
}
