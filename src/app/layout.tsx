import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { trip } from "@/lib/trip";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Keep search engines out. No Open Graph / social preview tags on purpose.
export const metadata: Metadata = {
  title: { default: trip.title, template: "%s · Vacanța 2027" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: { index: false, follow: false, noimageindex: true, nosnippet: true },
  },
  referrer: "no-referrer",
  manifest: `${basePath}/manifest.webmanifest`,
  icons: { icon: `${basePath}/icon.svg`, apple: `${basePath}/icon.svg` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#146864",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
        >
          Sari la conținut
        </a>
        <Nav />
        <main id="main" className="mx-auto max-w-5xl px-4 pb-16 pt-5 sm:px-6">
          {children}
        </main>
        <footer className="no-print mx-auto max-w-5xl px-4 pb-10 text-xs text-stone-500 sm:px-6">{trip.disclaimer}</footer>
        <ServiceWorkerRegister basePath={basePath} />
      </body>
    </html>
  );
}
