import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import WarningCard from "@/components/layout/Warning";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWARegistration from "@/components/PWARegistration";

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
  maximumScale: 1,
  userScalable: false,
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
    title: 'MYLE | Study Smarter, Excel on Campus',
    description: 'Flashcards, quizzes, and leaderboards built specifically for Nigerian unversity students',
    url: 'https://myle247.vercel.app',
    siteName: 'MYLE',
    images: [
      {
        url: 'https://myle247.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MYLE Student OS Preview',
      },
    ],
    locale: 'en-NG',
    type: 'website'
  }
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
                  var theme = localStorage.getItem('myle-theme') || 'light';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-brand-surface dark:bg-[#08070d] text-brand-text dark:text-white bg-grid-pattern relative">
        <ThemeProvider>
          {/* Ambient background glows */}
          <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-lime/15 dark:bg-brand-lime/5 blur-[140px] z-0 animate-pulse-slow" />
          <div className="pointer-events-none fixed top-[35vh] -right-40 h-[600px] w-[600px] rounded-full bg-brand-indigo/10 dark:bg-brand-indigo/5 blur-[140px] z-0" />
          <div className="pointer-events-none fixed -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-lime/5 dark:bg-brand-lime/2 blur-[120px] z-0" />

          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Layout Container */}
          <div className="flex flex-1 flex-col md:pl-64 lg:pl-72 min-w-0 min-h-screen">
            {/* Mobile Header */}
            <MobileHeader />

            {/* Page Content */}
            <main className="flex-1 relative z-10 w-full">{children}</main>

            {/* Footer */}
            <Footer />
          </div>

          <Analytics />
          <WarningCard />
          <PWARegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}

