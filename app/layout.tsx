import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "CleanerPay. Pay your cleaners better. Built for STR hosts with dedicated cleaning teams.",
  description:
    "Automatic turnover payments. AI expense capture. Quarterly performance bonuses. Built by an STR host running three properties in Sedona. $49/month.",
  metadataBase: new URL("https://cleanerpay.ai"),
  openGraph: {
    title:
      "CleanerPay. Pay your cleaners better. Built for STR hosts with dedicated cleaning teams.",
    description:
      "Automatic turnover payments. AI expense capture. Quarterly performance bonuses. Built by an STR host running three properties in Sedona. $49/month.",
    url: "https://cleanerpay.ai",
    siteName: "CleanerPay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-stone-900 font-body">
        {children}
      </body>
    </html>
  );
}
