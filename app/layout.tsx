import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import WarningCard from "@/components/layout/Warning";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MYLE — Study hub for Nigerian university students",
  description:
    "Guest-first study tools, quizzes, flashcards, and leaderboard for Nigerian university students.",
  verification: {
    google: "oTzkE0PYdRbIsuuNLDmshQafwLhaFPoUHc_QJpZF_oY",
  },
  alternates: {
    canonical: "https://myle.vercel.app",
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
    >
      <body className="min-h-full flex min-h-screen flex-col bg-brand-surface text-brand-text bg-grid-pattern relative">
        {/* Ambient background glows */}
        <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-lime/15 blur-[140px] z-0 animate-pulse-slow" />
        <div className="pointer-events-none fixed top-[35vh] -right-40 h-[600px] w-[600px] rounded-full bg-brand-indigo/10 blur-[140px] z-0" />
        <div className="pointer-events-none fixed -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-lime/5 blur-[120px] z-0" />

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />

        <Analytics />
        <WarningCard />
      </body>
    </html>
  );
}
