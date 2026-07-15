import Link from "next/link";
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Zap } from 'lucide-react';
import FlashcardsComponent from "@/components/layout/FlashcardsComponent";

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const resolvedParams = await params;
  const { deckId } = resolvedParams;

  let deckData: any = null;
  try {
    const filePath = path.join(process.cwd(), 'content', 'flashcards', `${deckId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    deckData = JSON.parse(fileContent);
  } catch (err) {
    // If local file not found, try fetching from Supabase if it looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(deckId)) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('generations')
          .select('json_data')
          .eq('id', deckId)
          .single();
        
        if (data && !error) {
          deckData = data.json_data;
        }
      } catch (dbErr) {
        console.error('Failed to load from DB:', dbErr);
      }
    }
  }

  if (!deckData) {
    return notFound();
  }


  const cardCount = deckData?.cards?.length || 0;
  const formattedDeckName = resolvedParams.deckId
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Mobile-first Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-brand-indigo/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between">
          <Link 
            href="/flashcards" 
            className="flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:text-brand-lime transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="text-xs uppercase tracking-wider font-bold text-brand-lime">
            {cardCount} cards
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-10 py-8 md:py-12 space-y-8">
        {/* Title Section - Mobile First */}
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo">
            <BookOpen className="h-3.5 w-3.5" />
            Study Deck
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-indigo font-heading leading-tight">
              {formattedDeckName}
            </h1>
            {deckData?.source && (
              <p className="text-xs sm:text-sm font-semibold text-brand-muted uppercase tracking-wider">
                From: {deckData.source}
              </p>
            )}
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-brand-muted max-w-2xl">
            {deckData?.description || 'Master the most important concepts with interactive flashcards. Flip through at your own pace and build lasting recall.'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-brand-indigo/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-indigo">{cardCount}</div>
            <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Total Cards</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 border border-brand-indigo/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-lime">~{Math.ceil(cardCount * 2)}</div>
            <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Min Study</p>
          </div>
        </div>

        {/* Flashcard Player - Mobile Responsive */}
        <div className="my-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <FlashcardsComponent deckData={deckData} />
        </div>

        {/* Action Buttons - Mobile First Stack */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-brand-indigo/5">
          <Link 
            href="/flashcards" 
            className="flex items-center justify-center gap-2 rounded-full border border-brand-indigo/10 bg-white px-6 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5 hover:border-brand-indigo/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Decks</span>
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo/90 shadow-md shadow-brand-indigo/20"
          >
            <Zap className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Study Tips */}
        <div className="rounded-2xl border border-brand-lime/20 bg-brand-lime/5 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-lime" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-lime">Pro Study Tip</h3>
          </div>
          <p className="text-sm text-brand-muted leading-relaxed">
            Review each card at least 3 times to move concepts from short-term to long-term memory. Return to difficult cards multiple times.
          </p>
        </div>
      </div>
    </div>
  );
}
