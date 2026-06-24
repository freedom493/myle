'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Trophy, Flame, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getStreak, getCompletedDeck } from "@/lib/localStorage";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

const tools = [
  {
    title: "Flashcard Decks",
    description: "Review bite-sized notes and definitions from campus-ready study sets.",
    icon: BookOpen,
    href: "/flashcards",
  },
  {
    title: "Practice Quizzes",
    description: "Test your comprehension with timed, auto-scored exam preparation quizzes.",
    icon: ClipboardList,
    href: "/quizzes",
  },
  {
    title: "Leaderboards",
    description: "Compete with other campus students and track your relative rank.",
    icon: Trophy,
    href: "/leaderboard",
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [displayName, setDisplayName] = useState<string>("Guest Learner");
  const [streak, setStreak] = useState<number>(0);
  const [quizzesPassed, setQuizzesPassed] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [completedDecks, setCompletedDecks] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // 1. Get streak from localStorage
    setStreak(getStreak());
    setCompletedDecks(getCompletedDeck());

    // 2. Fetch stats
    async function fetchStats() {
      setLoadingStats(true);
      
      if (isAuthenticated && user) {
        const supabase = createClient();
        try {
          // Fetch display name from profiles
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user.id)
            .single();
          
          if (profileData?.display_name) {
            setDisplayName(profileData.display_name);
          }

          // Fetch scores to compute dynamic stats
          const { data: scoresData } = await supabase
            .from('quiz_scores')
            .select('percentage');

          // Fetch completed decks count from cloud for authenticated users
          const { data: completedData } = await supabase
            .from('user_stats')
            .select('completed_decks')
            .eq('user_id', user.id)
            .single();

          if (completedData && typeof completedData.completed_decks === 'number') {
            setCompletedDecks(completedData.completed_decks);
          }

          if (scoresData && scoresData.length > 0) {
            const total = scoresData.length;
            const passed = scoresData.filter(s => Number(s.percentage) >= 50).length;
            const sum = scoresData.reduce((acc, curr) => acc + Number(curr.percentage), 0);
            
            setQuizzesPassed(passed);
            setAverageScore(Math.round(sum / total));
          }
        } catch (err) {
          console.error("Error fetching live dashboard stats:", err);
        }
      } else {
        // Guest user stats from localStorage
        try {
          const scores = JSON.parse(localStorage.getItem('myle_best_scores') || '{}');
          const percentages = Object.values(scores) as number[];
          if (percentages.length > 0) {
            const passed = percentages.filter(p => p >= 50).length;
            const sum = percentages.reduce((acc, curr) => acc + curr, 0);
            
            setQuizzesPassed(passed);
            setAverageScore(Math.round(sum / percentages.length));
          }
          // local completed decks for guest
          setCompletedDecks(getCompletedDeck());
        } catch (err) {
          console.error("Error parsing local best scores:", err);
        }
      }
      setLoadingStats(false);
    }

    if (!authLoading) {
      fetchStats();
    }
  }, [isAuthenticated, user, authLoading]);

  // Listen for completed deck updates (dispatched by localStorage helpers)
  useEffect(() => {
    async function onCompleted(e: Event) {
      const detail = (e as CustomEvent).detail as number;
      setCompletedDecks(detail);

      // push to cloud when authenticated
      if (isAuthenticated && user) {
        const supabase = createClient();
        try {
          await supabase
            .from('user_stats')
            .upsert({ user_id: user.id, completed_decks: detail }, { onConflict: 'user_id' });
        } catch (err: unknown) {
          console.error('Failed to sync completed decks:', err);
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('myle:completed_decks', onCompleted as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('myle:completed_decks', onCompleted as EventListener);
      }
    };
  }, [isAuthenticated, user]);

  if (authLoading || loadingStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm text-brand-muted font-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16 space-y-12">
      
      {/* Header and Welcome */}
      <div className="space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-lime/20 text-brand-indigo rounded-md w-fit block">
          Welcome back
        </span>
        <h1 className="font-heading text-4xl font-extrabold text-brand-indigo">
          Hello, {displayName}!
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-brand-muted">
          Access your study decks, practice exams, and track your campus rank. Work online or study as a guest without friction.
        </p>
      </div>

      {/* Stats Summary Panel */}
      <section className="grid gap-6 sm:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-brand-lime/30 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lime/10 text-brand-indigo">
            <Flame className="h-6 w-6 text-brand-indigo animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Study Streak</p>
            <p className="text-2xl font-black text-brand-indigo mt-0.5">{streak} Days</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-brand-lime/30 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/5 text-brand-indigo">
            <BookOpen className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Completed Decks</p>
            <p className="text-2xl font-black text-brand-indigo mt-0.5">{completedDecks}</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-brand-lime/30 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/5 text-brand-indigo">
            <CheckCircle className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Quizzes Passed</p>
            <p className="text-2xl font-black text-brand-indigo mt-0.5">{quizzesPassed}</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-brand-lime/30 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lime/15 text-brand-indigo">
            <Sparkles className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Average Score</p>
            <p className="text-2xl font-black text-brand-indigo mt-0.5">{averageScore}%</p>
          </div>
        </div>
      </section>

      {/* Main Study Tools Grid */}
      <section className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-brand-indigo">Choose your study routine</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.title} title={tool.title} description={tool.description} href={tool.href} Icon={tool.icon} />
          ))}
        </div>
      </section>

      {/* Action Banner */}
      <section className="relative overflow-hidden rounded-[32px] border border-brand-indigo/10 bg-brand-indigo text-white p-8 md:p-10 shadow-lg shadow-brand-indigo/15">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-brand-lime/20 blur-[60px]" />
        
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-lime text-brand-indigo rounded-md w-fit block">
              Quiz Challenge
            </span>
            <h2 className="font-heading text-2xl font-extrabold">Ready to turn study into a habit?</h2>
            <p className="text-brand-surface/80 max-w-xl text-sm leading-relaxed">
              Start with a GST 101 preparation quiz or review custom flashcard decks to earn ranking badges and maintain your streak.
            </p>
          </div>
          <Button href="/quizzes" className="bg-brand-lime text-brand-indigo border-none hover:bg-brand-lime/90 hover:scale-[1.02] shadow-md shadow-brand-lime/10">
            Open Quizzes
          </Button>
        </div>
      </section>
    </div>
  );
}
