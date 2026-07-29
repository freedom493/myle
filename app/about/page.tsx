import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Learn about MYLE — the guest-first student OS with flashcards, quizzes, and leaderboards for Nigerian universities.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-lime font-bold">
            About MYLE
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo font-heading tracking-tight">
            Study tools built for campus life
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-2xl">
            MYLE is a guest-first student OS: flashcards, quizzes, AI study
            generation, and leaderboards designed for Nigerian university
            students. Start studying without an account, then sign up when you
            want scores and progress synced.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl bg-brand-indigo px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Open dashboard
          </Link>
          <Link
            href="/flashcards"
            className="inline-flex items-center rounded-xl border border-brand-indigo/15 bg-white px-4 py-2.5 text-sm font-semibold text-brand-indigo hover:bg-brand-indigo/5 transition-colors"
          >
            Browse flashcards
          </Link>
        </div>
      </div>
    </div>
  );
}
