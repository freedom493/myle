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
    if (code) {
      sessionStorage.setItem('myle_referral_code', code);
    }
  }, [code]);

  const handleSignup = () => {
    router.push('/auth/signup?next=/tasks/apply-referral');
  };

  return (
    <div className="page-shell page-section max-w-4xl text-center space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-brand-lime/20 text-brand-lime shadow-xl shadow-brand-lime/10 relative">
        <Gift className="h-10 w-10 sm:h-12 sm:w-12" />
        <div className="absolute -top-2 -right-2 bg-brand-indigo text-brand-lime text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg shadow-md transform rotate-12">
          +4 Credits
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-indigo font-heading leading-tight tracking-tight">
          You&apos;ve Been Invited to <span className="text-brand-lime">MYLE</span>!
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Sign up now using this exclusive invitation link to unlock{" "}
          <strong className="text-brand-indigo">4 free AI Generation Credits</strong>{" "}
          instantly. Create powerful flashcards and quizzes from your notes in seconds.
        </p>
      </div>

      {code ? (
        <div className="bg-white/50 border border-brand-indigo/10 p-3 sm:p-4 rounded-2xl inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 backdrop-blur-sm max-w-full">
          <span className="text-[10px] sm:text-xs font-bold text-brand-muted uppercase tracking-widest shrink-0">
            Invite Code
          </span>
          <span className="text-base sm:text-xl font-mono font-black text-brand-indigo tracking-widest bg-brand-indigo/5 px-3 py-1 rounded-xl break-all">
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

      <div className="pt-4 sm:pt-6">
        <Button 
          onClick={handleSignup} 
          disabled={!code || loading}
          className="text-sm sm:text-base md:text-lg px-6 sm:px-10 py-3.5 sm:py-5 rounded-2xl bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-xl shadow-brand-indigo/20 flex items-center justify-center gap-2 sm:gap-3 mx-auto w-full sm:w-auto max-w-sm"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
          ) : (
            <>
              Claim Your Free Credits <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </>
          )}
        </Button>
        <p className="text-xs text-brand-muted mt-4 font-semibold">
          Already have an account?{" "}
          <a href="/auth/login" className="text-brand-indigo hover:underline">
            Log in here
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 sm:pt-16 border-t border-brand-indigo/10 mt-8 sm:mt-16 text-left">
        <div className="space-y-2 p-1">
          <div className="h-10 w-10 bg-brand-indigo/5 text-brand-indigo rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-brand-indigo text-base sm:text-lg">Join the Community</h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            Join thousands of students mastering their courses faster.
          </p>
        </div>
        <div className="space-y-2 p-1">
          <div className="h-10 w-10 bg-brand-lime/20 text-brand-indigo rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-brand-indigo text-base sm:text-lg">AI-Powered Study</h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            Generate complete decks and quizzes from any document automatically.
          </p>
        </div>
        <div className="space-y-2 p-1">
          <div className="h-10 w-10 bg-brand-indigo/5 text-brand-indigo rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Gift className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-brand-indigo text-base sm:text-lg">Earn More Credits</h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            Invite your own friends later and earn unlimited creation credits.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12 sm:p-20">
          <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        </div>
      }
    >
      <ReferralContent />
    </Suspense>
  );
}
