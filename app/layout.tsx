import type { Metadata } from "next";
import { BenchNine, Lato } from "next/font/google";
import { cookies, headers } from "next/headers";
import { ConsentBanner } from "@/components/seo/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewProvider } from "@/components/review/ReviewProvider";
import { parseReview, REVIEW_COOKIE } from "@/lib/review";
import { PAGE_DESCRIPTION, SITE_ORIGIN } from "@/lib/seo";
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
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: PAGE_DESCRIPTION["/"],
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const hdrs = await headers();
  const initial = parseReview(
    hdrs.get("x-sl-review") ?? jar.get(REVIEW_COOKIE)?.value,
  );
  const rawConsent = jar.get("sl-consent")?.value;
  const consent =
    rawConsent === "accept" || rawConsent === "decline" ? rawConsent : "unknown";

  return (
    <html lang="en" className={`${benchNine.variable} ${lato.variable}`}>
      <body className="font-body font-light antialiased">
        <JsonLd />
        <ReviewProvider initial={initial}>
          {children}
          <ConsentBanner initial={consent} />
        </ReviewProvider>
      </body>
    </html>
  );
}
