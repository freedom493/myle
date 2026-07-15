'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { updateCompletedDeck, getCompletedDeck } from '@/lib/localStorage';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface Props {
  params: Promise<{ deckId: string }>;
}

export default function CompletionPage({ params }: Props) {
  const { deckId } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleMarkCompleted() {
    setSaving(true);
    try {
      // update local counter (dispatches event)
      updateCompletedDeck();
      setSaved(true);

      // also persist immediately to cloud if authenticated
      if (isAuthenticated && user) {
        const supabase = createClient();
        try {
          const localCount = getCompletedDeck();
          await supabase
            .from('user_stats')
            .upsert({ user_id: user.id, completed_decks: localCount }, { onConflict: 'user_id' });
        } catch (err: unknown) {
          console.error('Failed to upsert completed decks:', err);
        }
      }

      // Redirect after a short delay for celebration effect
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } finally {
      setSaving(false);
    }
  }

  const formattedDeckName = deckId
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-surface via-white to-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Celebration Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-brand-lime/20 rounded-full blur-2xl" />
            <CheckCircle2 className="relative h-20 w-20 text-brand-lime animate-bounce" />
          </div>
        </div>

        {/* Success Message */}
        <div className="rounded-3xl border border-brand-indigo/10 bg-white p-8 sm:p-10 shadow-sm space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-brand-indigo font-heading">
              Congratulations!
            </h1>
            <p className="text-base text-brand-muted leading-relaxed">
              You've completed the <span className="font-bold text-brand-indigo">{formattedDeckName}</span> deck. Great study session! 🎉
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="glass-panel rounded-2xl p-4 border border-brand-indigo/10">
              <div className="text-2xl font-black text-brand-indigo">100%</div>
              <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Complete</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-brand-lime/20">
              <div className="text-2xl font-black text-brand-lime">✓</div>
              <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Reviewed</p>
            </div>
          </div>

          {/* Mark Completed Button */}
          <button
            onClick={handleMarkCompleted}
            disabled={saving || saved}
            className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition-all duration-300 transform ${
              saved
                ? 'bg-brand-success text-white shadow-lg shadow-brand-success/30'
                : 'bg-brand-lime text-brand-indigo shadow-md shadow-brand-lime/30 hover:shadow-lg hover:shadow-brand-lime/40 hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>
              {saving ? 'Saving Achievement...' : saved ? 'Deck Completed! ✓' : 'Mark Deck as Completed'}
            </span>
          </button>

          {/* Additional Actions */}
          <div className="space-y-2 pt-4 border-t border-brand-indigo/5">
            <button
              onClick={() => router.push(`/flashcards/${deckId}`)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-brand-indigo/10 bg-white px-6 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5 hover:border-brand-indigo/20 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Review Again</span>
            </button>

            <Link 
              href="/flashcards"
              className="w-full flex items-center justify-center gap-2 rounded-full border border-brand-indigo/10 bg-white px-6 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5 hover:border-brand-indigo/20 active:scale-95"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Browse Other Decks</span>
            </Link>

            <Link 
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-indigo/10 px-6 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/20 active:scale-95"
            >
              <Home className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Motivation Text */}
        <div className="text-center text-sm text-brand-muted space-y-2">
          <p>
            <span className="font-bold text-brand-indigo">Pro Tip:</span> Return to this deck in a few days for spaced repetition to cement your knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}
