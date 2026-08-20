import { TestimonialsView } from "@/components/clients/TestimonialsView";
import { Shell } from "@/components/shell/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Testimonials" };

export default function ClientsPage() {
  return (
    <Shell>
      <TestimonialsView />
    </Shell>
  );
}
