import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Study tips, product updates, and campus learning guides from the MYLE team.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8 text-center sm:text-left">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-lime font-bold">
            Blog
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo font-heading tracking-tight">
            Stories &amp; study tips
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-2xl mx-auto sm:mx-0">
            We&apos;re preparing articles on exam prep, flashcard workflows, and
            product updates. Check back soon — or jump into the study tools
            now.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-xl bg-brand-indigo px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
