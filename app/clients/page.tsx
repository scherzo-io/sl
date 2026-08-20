import { TestimonialsView } from "@/components/clients/TestimonialsView";
import { Shell } from "@/components/shell/Shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Testimonials", "/clients");

export default function ClientsPage() {
  return (
    <Shell>
      <TestimonialsView />
    </Shell>
  );
}
