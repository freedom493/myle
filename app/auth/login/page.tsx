'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/profile");
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
    <div className="mx-auto max-w-md px-6 py-16 md:py-24 relative">
      {/* Glow backdrop behind the card */}
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-brand-lime/10 blur-[80px] z-0 animate-pulse-slow" />
      
      <div className="relative z-10 glass-panel rounded-[32px] p-8 shadow-xl shadow-brand-indigo/5 border border-brand-indigo/5 bg-white/90">
        <div className="space-y-3 text-center mb-8">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-indigo text-brand-lime shadow-md">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-lime bg-brand-indigo px-2.5 py-0.5 rounded-full w-fit mx-auto block">
            Welcome Back
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-brand-indigo">Sign In</h1>
          <p className="text-xs text-brand-muted leading-relaxed">
            Access study streaks, save leaderboard scores, and sync progress across devices.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={socialLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-indigo/10 bg-white px-4 py-3.5 text-sm font-semibold text-brand-indigo transition-all hover:bg-brand-indigo/5 disabled:opacity-70 shadow-sm"
          >
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width={20}
              height={20}
              unoptimized
            />
            {socialLoading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-indigo/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/90 px-2 text-brand-muted">or</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
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
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-2xl border border-brand-indigo/10 bg-brand-surface px-4 py-3.5 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
            />
          </div>

          {error ? (
            <p className="text-xs font-semibold text-brand-danger bg-brand-danger/10 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={loading} className="w-full mt-2 py-4">
            {loading ? "Signing in..." : "Sign in to MYLE"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-indigo/5 text-center text-xs">
          <span className="text-brand-muted">New to MYLE? </span>
          <Link href="/auth/signup" className="font-bold text-brand-indigo hover:text-brand-lime transition-colors">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
