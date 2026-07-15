'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, Sparkles, ArrowRight, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function ReferralContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have a code, save it to session storage so we can apply it after signup
    if (code) {
      sessionStorage.setItem('myle_referral_code', code);
    }
  }, [code]);

  const handleSignup = () => {
    router.push('/auth/signup?next=/tasks/apply-referral');
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-lime/20 text-brand-lime shadow-xl shadow-brand-lime/10 mb-8 relative">
        <Gift className="h-12 w-12" />
        <div className="absolute -top-2 -right-2 bg-brand-indigo text-brand-lime text-xs font-black px-2 py-1 rounded-lg shadow-md transform rotate-12">
          +4 Credits
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-indigo font-heading leading-tight">
          You've Been Invited to <span className="text-brand-lime">MYLE</span>!
        </h1>
        <p className="text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Sign up now using this exclusive invitation link to unlock <strong className="text-brand-indigo">4 free AI Generation Credits</strong> instantly. Create powerful flashcards and quizzes from your notes in seconds.
        </p>
      </div>

      {code ? (
        <div className="bg-white/50 border border-brand-indigo/10 p-4 rounded-2xl inline-flex items-center gap-3 backdrop-blur-sm">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">Invite Code</span>
          <span className="text-xl font-mono font-black text-brand-indigo tracking-widest bg-brand-indigo/5 px-3 py-1 rounded-xl">
            {code}
          </span>
        </div>
      ) : (
        <div className="bg-brand-danger/10 text-brand-danger p-4 rounded-2xl border border-brand-danger/20 max-w-md mx-auto">
          <p className="text-sm font-semibold">No referral code found in URL.</p>
        </div>
      )}

      {error && (
        <div className="text-sm font-bold text-brand-danger">
          {error}
        </div>
      )}

      <div className="pt-8">
        <Button 
          onClick={handleSignup} 
          disabled={!code || loading}
          className="text-lg px-10 py-5 rounded-2xl bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-xl shadow-brand-indigo/20 flex items-center gap-3 mx-auto"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              Claim Your Free Credits <ArrowRight className="h-6 w-6" />
            </>
          )}
        </Button>
        <p className="text-xs text-brand-muted mt-4 font-semibold">
          Already have an account? <a href="/auth/login" className="text-brand-indigo hover:underline">Log in here</a>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-16 border-t border-brand-indigo/10 mt-16 text-left">
        <div className="space-y-2">
          <div className="h-10 w-10 bg-brand-indigo/5 text-brand-indigo rounded-xl flex items-center justify-center mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-brand-indigo text-lg">Join the Community</h3>
          <p className="text-sm text-brand-muted leading-relaxed">Join thousands of students mastering their courses faster.</p>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-10 bg-brand-lime/20 text-brand-indigo rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-brand-indigo text-lg">AI-Powered Study</h3>
          <p className="text-sm text-brand-muted leading-relaxed">Generate complete decks and quizzes from any document automatically.</p>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-10 bg-brand-indigo/5 text-brand-indigo rounded-xl flex items-center justify-center mb-4">
            <Gift className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-brand-indigo text-lg">Earn More Credits</h3>
          <p className="text-sm text-brand-muted leading-relaxed">Invite your own friends later and earn unlimited creation credits.</p>
        </div>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-8 w-8 text-brand-indigo animate-spin" /></div>}>
      <ReferralContent />
    </Suspense>
  );
}
