'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, ArrowRight, CheckCircle2, GraduationCap, School, Layers } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const [profile, setProfile] = useState({
    display_name: "",
    university: "",
    department: "",
    level: "100L"
  });

  // Check auth state and if profile already exists
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    async function checkProfile() {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('university, display_name')
        .eq('id', user!.id)
        .single();
        
      if (data?.university) {
        // Profile already complete
        router.push('/dashboard');
      } else {
        if (data?.display_name) {
          setProfile(p => ({ ...p, display_name: data.display_name }));
        }
        setChecking(false);
      }
    }

    checkProfile();
  }, [authLoading, isAuthenticated, user, router]);

  const handleNext = () => setStep(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: profile.display_name,
        university: profile.university,
        department: profile.department,
        level: profile.level,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    setLoading(false);

    if (!error) {
      setStep(3);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      console.error("Failed to save profile:", error);
    }
  };

  if (checking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-brand-indigo border-t-brand-lime rounded-full animate-spin mb-4" />
          <p className="text-brand-muted text-sm font-semibold">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface p-4 sm:p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-lime/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-brand-indigo/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-brand-indigo/5 border border-brand-indigo/10 p-6 sm:p-10 relative z-10 transition-all duration-500 transform">
        
        {step === 1 && (
          <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-indigo/5 text-brand-indigo shadow-inner">
              <Sparkles className="h-10 w-10 text-brand-lime animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <h1 className="font-heading text-3xl font-extrabold text-brand-indigo">
                Welcome to MYLE!
              </h1>
              <p className="text-sm text-brand-muted leading-relaxed max-w-sm mx-auto">
                We're excited to have you here. Let's quickly set up your profile so we can personalize your learning experience.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-4 py-4 text-sm font-bold text-white transition-all hover:bg-brand-indigo/90 shadow-md"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="text-center space-y-2 mb-6">
              <h2 className="font-heading text-2xl font-extrabold text-brand-indigo">About You</h2>
              <p className="text-xs text-brand-muted">Tell us a bit about your studies.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-brand-indigo/10 bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  <School className="h-3.5 w-3.5 text-brand-lime" /> University
                </label>
                <input
                  type="text"
                  required
                  value={profile.university}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                  placeholder="e.g. UNEC, UNN"
                  className="w-full rounded-xl border border-brand-indigo/10 bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  <GraduationCap className="h-3.5 w-3.5 text-brand-lime" /> Department
                </label>
                <input
                  type="text"
                  required
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="e.g. Law, Medicine"
                  className="w-full rounded-xl border border-brand-indigo/10 bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-indigo">
                  <Layers className="h-3.5 w-3.5 text-brand-lime" /> Level
                </label>
                <select
                  value={profile.level}
                  onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                  className="w-full rounded-xl border border-brand-indigo/10 bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/5"
                >
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                  <option value="600L">600L</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-4 py-4 text-sm font-bold text-white transition-all hover:bg-brand-indigo/90 shadow-md disabled:opacity-70"
            >
              {loading ? "Saving Profile..." : "Complete Setup"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center animate-in zoom-in duration-500 py-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-lime/20 text-brand-lime shadow-inner">
              <CheckCircle2 className="h-10 w-10 text-brand-lime" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-extrabold text-brand-indigo">
                You're all set!
              </h2>
              <p className="text-sm text-brand-muted">
                Redirecting you to the dashboard...
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
