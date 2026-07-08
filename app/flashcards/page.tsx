import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Clock } from "lucide-react";

const decks = [
  {
    id: "nigerian-legal-system",
    title: "Nigerian legal system",
    description: "Core terms, institutions and case law for Nigerian law students.",
    cards: 10,
    difficulty: "Intermediate",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description: "Study common research methods, definitions, and exam-ready summaries.",
    cards: 22,
    difficulty: "Intermediate",
  },
];

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header - Mobile First */}
      <div className="bg-white dark:bg-white/5 border-b border-brand-indigo/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-10 md:py-14 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/10 dark:bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo dark:text-brand-lime">
            <BookOpen className="h-3.5 w-3.5" />
            Study Tools
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-indigo dark:text-white font-heading leading-tight">
              Flashcard Decks
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-brand-muted dark:text-slate-400">
              Learn with bite-sized flashcards that help you memorize definitions, statutes, and key concepts. Study at your own pace and track your progress.
            </p>
          </div>
        </div>
      </div>

      {/* Decks Grid - Mobile First */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-10 md:py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {decks.map((deck) => (
            <Link key={deck.id} href={`/flashcards/${deck.id}`}>
              <article className="group h-full rounded-3xl border border-brand-indigo/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-brand-lime/40 hover:shadow-lg hover:shadow-brand-lime/10 hover:-translate-y-1">

                {/* Icon & Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/10 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-brand-lime transition-all duration-300">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-brand-lime/10 text-brand-lime">
                    {deck.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-brand-indigo mb-2 group-hover:text-brand-indigo transition-colors">
                  {deck.title}
                </h2>

                {/* Description */}
                <p className="text-sm leading-relaxed text-brand-muted mb-6 line-clamp-2">
                  {deck.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-brand-indigo/5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-muted" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-brand-muted">Study Time</p>
                      <p className="text-sm font-bold text-brand-indigo">~{Math.ceil(deck.cards * 0.5)}m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-brand-muted" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-brand-muted">Cards</p>
                      <p className="text-sm font-bold text-brand-lime">{deck.cards}</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-brand-indigo group-hover:text-brand-lime transition-colors">
                    Start studying
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand-indigo group-hover:translate-x-0.5 transition-transform" />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 rounded-3xl border-2 border-dashed border-brand-indigo/10 bg-gradient-to-br from-brand-indigo/5 to-brand-lime/5 p-8 sm:p-10 text-center space-y-4">
          <Zap className="mx-auto h-8 w-8 text-brand-lime" />
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-brand-indigo">Create Your Own Decks</h3>
            <p className="text-sm text-brand-muted">
              Coming soon! Build custom flashcard decks tailored to your specific study needs and share them with classmates.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/10 px-4 py-2 text-xs font-bold text-brand-lime uppercase tracking-wider">
            <Zap className="h-3 w-3" />
            Feature in progress
          </div>
        </div>
      </div>
    </div>
  );
}
