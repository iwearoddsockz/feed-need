import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Feed Need by Beneath the Surface AU",
    template: "%s | Feed Need",
  },
  description:
    "Find free meals in the Perth metro area. A project by Beneath the Surface AU. Search by suburb or postcode, view on a map, and plan your week.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Feed Need",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t===null&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <div className="flex min-h-dvh flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <OfflineBanner />
          <Header />
          <main id="main-content" className="flex flex-1 flex-col pb-16 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
