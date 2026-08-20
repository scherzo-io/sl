import type { Metadata } from "next";
import { BenchNine, Lato } from "next/font/google";
import { cookies, headers } from "next/headers";
import { ReviewProvider } from "@/components/review/ReviewProvider";
import { aboutStory } from "@/lib/copy";
import { parseReview, REVIEW_COOKIE } from "@/lib/review";
import { site } from "@/lib/site";
import "./globals.css";

const benchNine = BenchNine({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-benchnine",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: aboutStory[0],
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const hdrs = await headers();
  const initial = parseReview(
    hdrs.get("x-sl-review") ?? jar.get(REVIEW_COOKIE)?.value,
  );

  return (
    <html lang="en" className={`${benchNine.variable} ${lato.variable}`}>
      <body className="font-body font-light antialiased">
        <ReviewProvider initial={initial}>{children}</ReviewProvider>
      </body>
    </html>
  );
}
