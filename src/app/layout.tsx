import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bahçelievler İmge VIP Kurs Merkezi",
    template: "%s | İmge VIP Kurs",
  },
  description:
    "Bahçelievler İmge VIP Kurs Merkezi - LGS, TYT, AYT hazırlık programları. Uzman kadro, VIP sınıflar, birebir takip.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={montserrat.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
