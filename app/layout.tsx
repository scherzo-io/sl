import type { Metadata } from "next";
import { BenchNine, Lato } from "next/font/google";
import { aboutStory } from "@/lib/copy";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${benchNine.variable} ${lato.variable}`}>
      <body className="font-body font-light antialiased">{children}</body>
    </html>
  );
}
