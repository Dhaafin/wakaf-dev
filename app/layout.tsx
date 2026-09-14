import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { FlashMessageProvider } from "@/context/FlashMessageContext";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wakaf Digital — Yayasan Khazanah Berkah Mulia",
  description:
    "Platform wakaf digital: berwakaf mudah, transparan, dan tercatat. Demo interaktif.",
};

import Script from "next/script";
import { MIDTRANS_SNAP_URL } from "@/lib/midtrans";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  return (
    <html lang="id" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <FlashMessageProvider>
          <DemoBanner />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </FlashMessageProvider>
        {clientKey && (
          <Script
            src={MIDTRANS_SNAP_URL}
            data-client-key={clientKey}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
