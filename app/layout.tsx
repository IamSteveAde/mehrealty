import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "MEH Realty | Considered Living",
    template: "%s | MEH Realty",
  },
  description:
    "Explore MEH Realty developments, residences and professional property services in Nigeria.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fraunces.variable}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}