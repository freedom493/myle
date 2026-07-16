"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Trophy,
  Flame,
  CheckCircle,
  Sparkles,
  Loader2,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { getStreak, getCompletedDeck } from "@/lib/localStorage";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

const tools = [
  {
    title: "Flashcards",
    description: "Review definitions and key concepts in minutes.",
    icon: BookOpen,
    href: "/flashcards",
    cta: "Study decks",
    accent: "bg-brand-indigo/8 text-brand-indigo",
  },
  {
    title: "Quizzes",
    description: "Timed practice with instant scoring.",
    icon: ClipboardList,
    href: "/quizzes",
    cta: "Take a quiz",
    accent: "bg-brand-lime/20 text-brand-indigo",
  },
  {
    title: "Create with AI",
    description: "Turn lecture notes into decks & quizzes.",
    icon: Wand2,
    href: "/create",
    cta: "Generate",
    accent: "bg-violet-100 text-violet-800",
  },
  {
    title: "Leaderboard",
    description: "See how you rank against peers.",
    icon: Trophy,
    href: "/leaderboard",
    cta: "View ranks",
    accent: "bg-amber-100 text-amber-800",
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
    setStreak(getStreak());
    setCompletedDecks(getCompletedDeck());

    async function fetchStats() {
      setLoadingStats(true);

      if (isAuthenticated && user) {
        const supabase = createClient();
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();

          if (profileData?.display_name) {
            setDisplayName(profileData.display_name);
          }

          const { data: scoresData } = await supabase
            .from("quiz_scores")
            .select("percentage")
            .eq("user_id", user.id);

          const { data: completedData } = await supabase
            .from("user_stats")
            .select("completed_decks")
            .eq("user_id", user.id)
            .single();

          if (completedData && typeof completedData.completed_decks === "number") {
            setCompletedDecks(completedData.completed_decks);
          }

          if (scoresData && scoresData.length > 0) {
            const total = scoresData.length;
            const passed = scoresData.filter((s) => Number(s.percentage) >= 50).length;
            const sum = scoresData.reduce(
              (acc, curr) => acc + Number(curr.percentage),
              0,
            );
            setQuizzesPassed(passed);
            setAverageScore(Math.round(sum / total));
          }
        } catch (err) {
          console.error("Error fetching live dashboard stats:", err);
        }
      } else {
        try {
          const scores = JSON.parse(
            localStorage.getItem("myle_best_scores") || "{}",
          );
          const percentages = Object.values(scores) as number[];
          if (percentages.length > 0) {
            const passed = percentages.filter((p) => p >= 50).length;
            const sum = percentages.reduce((acc, curr) => acc + curr, 0);
            setQuizzesPassed(passed);
            setAverageScore(Math.round(sum / percentages.length));
          }
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

  useEffect(() => {
    async function onCompleted(e: Event) {
      const detail = (e as CustomEvent).detail as number;
      setCompletedDecks(detail);

      if (isAuthenticated && user) {
        const supabase = createClient();
        try {
          await supabase
            .from("user_stats")
            .upsert(
              { user_id: user.id, completed_decks: detail },
              { onConflict: "user_id" },
            );
        } catch (err: unknown) {
          console.error("Failed to sync completed decks:", err);
        }
      }
    }

    window.addEventListener("myle:completed_decks", onCompleted as EventListener);
    return () => {
      window.removeEventListener(
        "myle:completed_decks",
        onCompleted as EventListener,
      );
    };
  }, [isAuthenticated, user]);

  if (authLoading || loadingStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-7 w-7 text-brand-indigo animate-spin" />
        <p className="text-sm text-brand-muted font-semibold">Loading dashboard…</p>
      </div>
    );
  }

  const firstName = displayName.split(" ")[0] || displayName;

  return (
    <div className="page-shell page-section space-y-8 sm:space-y-10">
      {/* Welcome */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-muted">
            {isAuthenticated ? "Welcome back" : "Guest mode"}
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo tracking-tight">
            Hey, {firstName} 👋
          </h1>
          <p className="text-sm sm:text-base text-brand-muted max-w-xl leading-relaxed">
            Pick a tool and keep your streak going. No account needed to study.
          </p>
        </div>
        <Link
          href="/quizzes/gst-101"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-indigo/15 hover:bg-brand-indigo/90 active:scale-[0.98] transition-all w-full sm:w-auto shrink-0"
        >
          Quick quiz
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Stats — 2x2 mobile, 4-col desktop */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="stat-tile flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Flame className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted truncate">
              Streak
            </p>
            <p className="text-xl sm:text-2xl font-black text-brand-indigo tabular-nums">
              {streak}
              <span className="text-sm font-bold text-brand-muted ml-0.5">d</span>
            </p>
          </div>
        </div>

        <div className="stat-tile flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted truncate">
              Decks done
            </p>
            <p className="text-xl sm:text-2xl font-black text-brand-indigo tabular-nums">
              {completedDecks}
            </p>
          </div>
        </div>

        <div className="stat-tile flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted truncate">
              Quizzes passed
            </p>
            <p className="text-xl sm:text-2xl font-black text-brand-indigo tabular-nums">
              {quizzesPassed}
            </p>
          </div>
        </div>

        <div className="stat-tile flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-brand-lime/25 text-brand-indigo">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted truncate">
              Avg score
            </p>
            <p className="text-xl sm:text-2xl font-black text-brand-indigo tabular-nums">
              {averageScore}
              <span className="text-sm font-bold text-brand-muted">%</span>
            </p>
          </div>
        </div>
      </section>

      {/* Study tools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-brand-indigo">
            Study tools
          </h2>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href} className="study-card group block">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tool.accent} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-brand-indigo text-base">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-brand-muted leading-snug">
                      {tool.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-indigo">
                      {tool.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-brand-indigo text-white p-5 sm:p-8 shadow-lg shadow-brand-indigo/15">
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-brand-lime/20 blur-[50px]" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5 min-w-0">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-brand-lime text-brand-indigo rounded-md">
              Recommended
            </span>
            <h2 className="font-heading text-lg sm:text-xl font-extrabold">
              GST 101 practice quiz
            </h2>
            <p className="text-white/75 text-sm max-w-md leading-relaxed">
              A short Use of English quiz to warm up and protect your streak.
            </p>
          </div>
          <Link
            href="/quizzes/gst-101"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-lime px-5 py-3 text-sm font-bold text-brand-indigo hover:bg-brand-lime/90 active:scale-[0.98] transition-all w-full sm:w-auto shrink-0"
          >
            Start quiz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
