'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trophy, Mail } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await signUp(email, password, displayName);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSignUpSuccess(true);
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading(true);
    setError(null);

    const { error: authError, data } = await signInWithGoogle();

    if (authError) {
      setError(authError.message);
      setSocialLoading(false);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
    } else {
      setSocialLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16 md:py-24 relative animate-in fade-in duration-300">
      {/* Glow backdrop behind the card */}
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-brand-lime/10 blur-[80px] z-0 animate-pulse-slow" />
      
      <div className="relative z-10 glass-panel rounded-[32px] p-8 shadow-xl shadow-brand-indigo/5 border border-brand-indigo/5 bg-white/90">
        
        {signUpSuccess ? (
          <div className="space-y-6 text-center py-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-lime/20 text-brand-indigo shadow-md border border-brand-lime/40">
              <Mail className="h-7 w-7 text-brand-indigo animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-heading text-2xl font-extrabold text-brand-indigo">Verify Your Email</h1>
              <p className="text-sm text-brand-muted leading-relaxed">
                We've sent a verification link to <strong className="text-brand-indigo">{email}</strong>. Please check your inbox and verify your email to activate your account.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Link 
                href="/auth/login" 
                className="block w-full py-3 rounded-full bg-brand-indigo text-white font-semibold text-sm hover:bg-brand-indigo/90 transition-all text-center"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-center mb-8">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-indigo text-brand-lime shadow-md">
                <Trophy className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-lime bg-brand-indigo px-2.5 py-0.5 rounded-full w-fit mx-auto block">
                Join the Community
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-brand-indigo">Create Account</h1>
              <p className="text-xs text-brand-muted leading-relaxed">
                Appear on the public leaderboard, track your performance, and study on multiple devices.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  placeholder="e.g. Amina"
                  className="w-full rounded-2xl border border-brand-indigo/10 bg-brand-surface px-4 py-3.5 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="e.g. amina@university.edu.ng"
                  className="w-full rounded-2xl border border-brand-indigo/10 bg-brand-surface px-4 py-3.5 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full rounded-2xl border border-brand-indigo/10 bg-brand-surface px-4 py-3.5 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                />
              </div>

              {error ? (
                <p className="text-xs font-semibold text-brand-danger bg-brand-danger/10 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              ) : null}

              <Button type="submit" disabled={loading} className="w-full mt-2 py-4">
                {loading ? "Creating account..." : "Join MYLE"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-indigo/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/90 px-2 text-brand-muted">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={socialLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-indigo/10 bg-white px-4 py-3.5 text-sm font-semibold text-brand-indigo transition-all hover:bg-brand-indigo/5 disabled:opacity-70"
              >
                <span className="text-base">G</span>
                {socialLoading ? "Redirecting to Google..." : "Continue with Google"}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-indigo/5 text-center text-xs">
              <span className="text-brand-muted">Already have an account? </span>
              <Link href="/auth/login" className="font-bold text-brand-indigo hover:text-brand-lime transition-colors">
                Sign In Instead
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
