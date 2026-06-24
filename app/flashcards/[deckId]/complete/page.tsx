'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { updateCompletedDeck, getCompletedDeck } from '@/lib/localStorage';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface Props {
  params: { deckId: string };
}

export default function CompletionPage({ params }: Props) {
  const { deckId } = params;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);

  async function handleMarkCompleted() {
    setSaving(true);
    try {
      // update local counter (dispatches event)
      updateCompletedDeck();

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

      router.push('/profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <div className="rounded-2xl p-8 bg-brand-surface border border-brand-indigo/10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-lime" />
        <h2 className="mt-4 text-2xl font-bold text-brand-indigo">Nice work!</h2>
        <p className="mt-2 text-sm text-brand-muted">You've reached the end of this flashcard deck.</p>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => router.push(`/flashcards/${deckId}`)}
            className="px-4 py-2 rounded-xl border border-brand-indigo/10 text-sm font-bold"
          >
            Review Again
          </button>

          <button
            onClick={handleMarkCompleted}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-brand-lime text-brand-indigo font-bold text-sm"
          >
            {saving ? 'Saving...' : 'Mark Deck Completed'}
          </button>
        </div>

        <div className="mt-4">
          <Link href="/dashboard" className="text-xs text-brand-muted">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
