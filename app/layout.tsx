import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppShell } from "@/components/layout/AppShell";
import WarningCard from "@/components/layout/Warning";
import AuthPrompt from "@/components/layout/AuthPrompt";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWARegistration from "@/components/PWARegistration";
import PWAInstallBanner from "@/components/PWAInstallBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  themeColor: "#1e1b4b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MYLE | Your Student OS",
  description:
    "Guest-first study tools, quizzes, flashcards, and leaderboard for Nigerian university students.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MYLE",
  },
  verification: {
    google: "oTzkE0PYdRbIsuuNLDmshQafwLhaFPoUHc_QJpZF_oY",
  },
  alternates: {
    canonical: "https://myle247.vercel.app",
  },
  openGraph: {
    title: "MYLE | Study Smarter, Excel on Campus",
    description:
      "Flashcards, quizzes, and leaderboards built specifically for Nigerian university students",
    url: "https://myle247.vercel.app",
    siteName: "MYLE",
    images: [
      {
        url: "https://myle247.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "MYLE Student OS Preview",
      },
    ],
    locale: "en-NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-NG"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-brand-surface dark:bg-brand-surface text-brand-text dark:text-brand-text bg-grid-pattern relative">
        <ThemeProvider>
          {/* Soft ambient glows — lighter on app screens for focus */}
          <div className="pointer-events-none fixed -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-lime/10 dark:bg-brand-lime/5 blur-[120px] z-0" />
          <div className="pointer-events-none fixed top-[40vh] -right-40 h-[420px] w-[420px] rounded-full bg-brand-indigo/8 dark:bg-brand-indigo/5 blur-[120px] z-0" />

          <Sidebar />
          <AppShell>{children}</AppShell>

          <Analytics />
          <WarningCard />
          <AuthPrompt />
          <PWAInstallBanner />
          <PWARegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
