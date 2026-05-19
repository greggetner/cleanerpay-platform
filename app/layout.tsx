import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanerPay. Pay your short-term rental cleaners better.",
  description:
    "Turnover pay, expense reimbursement, performance bonuses. All in one place. Built by an STR host running three properties in Sedona, Arizona.",
  metadataBase: new URL("https://cleanerpay.ai"),
  openGraph: {
    title: "CleanerPay. Pay your short-term rental cleaners better.",
    description:
      "Turnover pay, expense reimbursement, performance bonuses. All in one place.",
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
    <html lang="en">
      <body className="antialiased bg-white text-stone-900">{children}</body>
    </html>
  );
}
