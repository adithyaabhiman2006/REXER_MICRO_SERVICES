import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { TopNav } from "@/components/navigation/TopNav";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ThemeSync } from "@/components/ThemeSync";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SiteFooter } from "@/components/SiteFooter";

// Offline-safe bundled Geist font (no build-time network fetch).
const font = GeistSans;

// basePath is empty locally, "/REXER_MICRO_SERVICES" on GitHub Pages.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const APP_NAME = "Rexer Micro-Tools";
const APP_DESCRIPTION =
  "200 premium, privacy-first micro-tools. Process images, PDFs, audio, and text client-side — your files never leave the browser.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: `${APP_NAME} — 200 privacy-first micro-tools`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  keywords: [
    "micro tools",
    "privacy-first tools",
    "image converter",
    "pdf tools",
    "developer tools",
    "PWA tools",
  ],
  authors: [{ name: "Rexer" }],
  icons: {
    icon: `${BASE_PATH}/icons/icon-192.png`,
    apple: `${BASE_PATH}/icons/icon-192.png`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} — 200 privacy-first micro-tools`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} — 200 privacy-first micro-tools`,
    description: APP_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#090A0C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Inline script runs before paint to apply the saved theme and avoid FOUC.
const themeInitScript = `
(function(){try{var t=localStorage.getItem('rexer-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${font.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeSync />
        <TopNav />
        <main id="main" className="min-h-screen pb-16 pt-16 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <BottomNav />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
