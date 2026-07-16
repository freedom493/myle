import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Clock, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const localDecks = [
  {
    id: "nigerian-legal-system",
    title: "Nigerian legal system",
    description:
      "Core terms, institutions and case law for Nigerian law students.",
    cards: 3,
    difficulty: "Intermediate",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description:
      "Study common research methods, definitions, and exam-ready summaries.",
    cards: 22,
    difficulty: "Intermediate",
  },
];

export default async function FlashcardsPage() {
  const supabase = await createClient();
  const { data: publicDecks } = await supabase
    .from("generations")
    .select("id, title, description, json_data, created_at")
    .eq("visibility", "public")
    .eq("type", "flashcard")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="page-shell page-section space-y-8 sm:space-y-10">
      {/* Compact page header */}
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-indigo">
          <BookOpen className="h-3.5 w-3.5" />
          Flashcards
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo font-heading tracking-tight">
          Study decks
        </h1>
        <p className="max-w-xl text-sm sm:text-base text-brand-muted leading-relaxed">
          Bite-sized cards for quick recall. Tap a deck to start studying.
        </p>
      </header>

      {/* Decks grid */}
      <section className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {localDecks.map((deck) => (
          <Link key={deck.id} href={`/flashcards/${deck.id}`} className="study-card group block">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-brand-lime transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-brand-lime/15 text-brand-indigo">
                {deck.difficulty}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-brand-indigo mb-1.5">
              {deck.title}
            </h2>
            <p className="text-sm text-brand-muted line-clamp-2 mb-5 leading-snug">
              {deck.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted mb-4 pb-4 border-b border-brand-indigo/5">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-brand-lime" />
                {deck.cards} cards
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />~{Math.ceil(deck.cards * 0.5)}m
              </span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold text-brand-indigo">
              <span>Start studying</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </section>

      {publicDecks && publicDecks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-brand-indigo font-heading flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-lime" />
            Community decks
          </h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicDecks.map((deck) => {
              const data = deck.json_data as { cards?: unknown[] };
              const cardsCount = data?.cards?.length || 0;

              return (
                <Link
                  key={deck.id}
                  href={`/flashcards/${deck.id}`}
                  className="study-card group block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo">
                      <BookOpen className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      Community
                    </span>
                  </div>
                  <h3 className="font-bold text-brand-indigo text-base mb-1 line-clamp-1">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2 mb-3">
                    {deck.description || "No description provided."}
                  </p>
                  <p className="text-xs font-semibold text-brand-muted">
                    {cardsCount} cards · ~{Math.ceil(cardsCount * 0.5)}m
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* AI CTA */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-brand-indigo text-white p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-lime/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2">
            <Zap className="h-6 w-6 text-brand-lime" />
            <h3 className="text-lg font-bold font-heading">
              Create decks with AI
            </h3>
            <p className="text-sm text-white/70 max-w-md">
              Upload lecture notes and generate flashcards in seconds.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-lime px-5 py-3 font-bold text-sm text-brand-indigo hover:bg-brand-lime/90 transition-all w-full sm:w-auto shrink-0"
          >
            Generate <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
