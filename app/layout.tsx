import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ThemeSync } from "@/components/ThemeSync";

// Offline-safe bundled Geist font (no build-time network fetch).
const font = GeistSans;

const APP_NAME = "Rexer Micro-Tools";
const APP_DESCRIPTION =
  "200 premium, privacy-first micro-tools. Process images, PDFs, audio, and text client-side — your files never leave the browser.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${APP_NAME} — 200 privacy-first micro-tools`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "micro tools",
    "privacy-first tools",
    "image converter",
    "pdf tools",
    "developer tools",
    "PWA tools",
  ],
  authors: [{ name: "Rexer" }],
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} — 200 privacy-first micro-tools`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — 200 privacy-first micro-tools`,
    description: APP_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${font.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeSync />
        <Sidebar />
        <div className="lg:pl-64">
          <main id="main" className="min-h-screen pb-16 lg:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
