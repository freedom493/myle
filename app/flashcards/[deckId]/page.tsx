import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import FlashcardsComponent from "@/components/layout/FlashcardsComponent";
import { pageMetadata } from "@/lib/seo";
import { getDeck, humanizeSlug } from "@/lib/study-content";

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export async function generateMetadata({
  params,
}: DeckPageProps): Promise<Metadata> {
  const { deckId } = await params;
  const deck = await getDeck(deckId);

  if (!deck) {
    return pageMetadata({
      title: "Deck not found",
      description: "This flashcard deck could not be found on MYLE.",
      path: `/flashcards/${deckId}`,
      noIndex: true,
    });
  }

  const name = deck.name || humanizeSlug(deckId);
  const cardCount = Array.isArray(deck.cards) ? deck.cards.length : 0;
  const description =
    (typeof deck.description === "string" && deck.description) ||
    `Study the “${name}” flashcard deck on MYLE${cardCount ? ` — ${cardCount} cards` : ""}.`;

  return pageMetadata({
    title: name,
    description,
    path: `/flashcards/${deckId}`,
  });
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { deckId } = await params;
  const deckData = await getDeck(deckId);

  if (!deckData) {
    return notFound();
  }

  const cards = deckData.cards || [];
  const cardCount = cards.length;
  const deckName = deckData.name || humanizeSlug(deckId);

  return (
    <div className="page-shell page-section max-w-3xl !mx-auto space-y-5 sm:space-y-6">
      {/* Compact session bar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-indigo/10 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-brand-indigo hover:bg-brand-indigo/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Decks
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted tabular-nums">
          {cardCount} cards
        </span>
      </div>

      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-indigo/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-indigo">
          <BookOpen className="h-3 w-3" />
          Studying
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-indigo font-heading leading-tight">
          {deckName}
        </h1>
        {typeof deckData.description === "string" && deckData.description && (
          <p className="text-sm text-brand-muted leading-relaxed line-clamp-2">
            {deckData.description}
          </p>
        )}
      </header>

      <FlashcardsComponent 
        deckData={{
          ...deckData,
          cards: (deckData.cards as { term?: string; definition?: string }[]) || []
        }} 
      />
    </div>
  );
}
