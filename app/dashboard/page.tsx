import Link from "next/link";
import { BookOpen, ClipboardList, Trophy, Flame, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16 space-y-12">
      
      {/* Header and Welcome */}
      <div className="space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-lime/20 text-brand-indigo rounded-md w-fit block">
          Welcome back
        </span>
        <h1 className="font-heading text-4xl font-extrabold text-brand-indigo">Your Study Dashboard</h1>
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
            <p className="text-2xl font-black text-brand-indigo mt-0.5">4 Days</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-brand-lime/30 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/5 text-brand-indigo">
            <CheckCircle className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Quizzes Passed</p>
            <p className="text-2xl font-black text-brand-indigo mt-0.5">6 / 8</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-brand-lime/30 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lime/15 text-brand-indigo">
            <Sparkles className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Average Score</p>
            <p className="text-2xl font-black text-brand-indigo mt-0.5">88%</p>
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
