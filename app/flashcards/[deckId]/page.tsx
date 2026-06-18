import Link from "next/link";
import FlashcardsComponent from "@/components/layout/Flashcards";

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const resolvedParams = await params;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full bg-brand-lime/10 px-4 py-2 text-sm font-semibold text-brand-lime">
          Flashcard deck
        </div>
        <h1 className="text-4xl font-semibold text-brand-indigo">{resolvedParams.deckId.replace(/-/g, " ")}</h1>
        <p className="max-w-2xl text-base leading-7 text-brand-muted">
          This deck is ready to help you study the most important concepts. Tap through cards and build recall with practice.
        </p>
        
        <div className="my-8">
          <FlashcardsComponent deckId={resolvedParams.deckId} />
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/flashcards" className="rounded-full border border-brand-indigo/10 bg-white px-5 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5">
            Back to decks
          </Link>
          <Link href="/dashboard" className="rounded-full bg-brand-indigo px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo/90">
            Dashboard
          </Link>
        </div>
      </div >
    </div >
  );
}
