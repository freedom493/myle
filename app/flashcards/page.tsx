import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

const decks = [
  {
    id: "nigerian-legal-system",
    title: "Nigerian legal system",
    description: "Core terms, institutions and case law for Nigerian law students.",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description: "Study common research methods, definitions, and exam-ready summaries.",
  },
];

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.32em] text-brand-lime">Flashcards</p>
        <h1 className="text-4xl font-semibold text-brand-indigo">Browse decks</h1>
        <p className="max-w-2xl text-base leading-7 text-brand-muted">
          Learn with bite-sized flashcards that help you memorize definitions, statutes, and key concepts.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {decks.map((deck) => (
          <article key={deck.id} className="rounded-3xl border border-brand-indigo/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-indigo/5 text-brand-indigo">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-brand-indigo">{deck.title}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-muted">{deck.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <Link href={`/flashcards/${deck.id}`} className="text-sm font-semibold text-brand-indigo transition hover:text-brand-lime">
                Open deck
              </Link>
              <ArrowRight className="h-4 w-4 text-brand-indigo" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-12 rounded-3xl border border-brand-indigo/10 bg-brand-surface p-6">
        <p className="text-sm text-brand-muted">
          Need a new deck? Add your own flashcards later when we wire the deck builder.
        </p>
      </div>
    </div>
  );
}
