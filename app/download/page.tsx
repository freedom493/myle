import Link from "next/link";
import { Metadata } from "next";
import { Smartphone, Download, ArrowLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Get the App | MYLE",
  description: "Download the MYLE app for easier accessibility on the go.",
  openGraph: {
    title: "MYLE | Download the App",
    description:
      "Get the MYLE app today to study smarter and faster on campus.",
    url: "https://myle247.vercel.app/download",
  },
};

export default function AppDownloadPage() {
  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-2xl text-center space-y-6 sm:space-y-8">
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-brand-indigo text-brand-lime shadow-lg shadow-brand-indigo/15">
          <Smartphone className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-indigo">
            <Sparkles className="h-3.5 w-3.5" />
            Coming soon
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo tracking-tight">
            Get the MYLE app
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-lg mx-auto">
            We&apos;re building a native app for easier study on the go. In the
            meantime, use MYLE in your browser — install it as a PWA from your
            home screen for a near-native experience.
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-brand-indigo/8 bg-white p-5 sm:p-8 shadow-sm space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo">
              <Download className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-brand-indigo text-base">
                Install as a web app
              </h2>
              <p className="text-sm text-brand-muted mt-1 leading-relaxed">
                On mobile, open MYLE in Chrome or Safari, then use{" "}
                <strong className="text-brand-indigo">Add to Home Screen</strong>{" "}
                for offline-friendly access to decks and quizzes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-indigo/15 hover:bg-brand-indigo/90 transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            href="/flashcards"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-indigo/10 px-5 py-3 text-sm font-bold text-brand-indigo hover:bg-brand-indigo/5 transition-all w-full sm:w-auto"
          >
            Browse flashcards
          </Link>
        </div>
      </div>
    </div>
  );
}
