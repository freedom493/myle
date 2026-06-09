import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    title: "Guest-first study tools",
    description: "Access flashcards and quizzes without signing in. Study anytime, anywhere.",
    icon: Flame,
    href: "/dashboard",
  },
  {
    title: "Leaderboards and streaks",
    description: "Save your best scores and track study streaks when you create an account.",
    icon: Trophy,
    href: "/leaderboard",
  },
  {
    title: "Local progress backup",
    description: "Keep progress in your browser and upgrade to an account later.",
    icon: Sparkles,
    href: "/auth/signup",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] max-w-6xl flex-col gap-12 px-6 py-10 md:px-10">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-brand-lime/25 bg-brand-lime/10 px-4 py-1 text-sm font-medium text-brand-indigo">
            Built for Nigerian university students
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-indigo sm:text-5xl">
            Study smarter with MYLE.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-brand-muted">
            Browse flashcards, take quizzes, and track progress in a guest-first experience designed for campus study routines.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/dashboard">Start studying</Button>
            <Button href="/leaderboard" variant="secondary">View leaderboard</Button>
          </div>
        </div>

        <div className="rounded-[32px] border border-brand-indigo/10 bg-white/90 p-8 shadow-lg shadow-brand-indigo/5">
          <div className="mb-6 flex items-center justify-between rounded-3xl bg-brand-indigo px-5 py-4 text-white shadow-brand-indigo/10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-lime">Daily study boost</p>
              <p className="text-xl font-semibold">Quiz streak: 4 days</p>
            </div>
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.title} href={feature.href} title={feature.title} description={feature.description} Icon={feature.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-indigo">Ready for your first quiz?</h2>
          <p className="mt-3 text-brand-muted">
            Explore one of our starter quizzes and see how the leaderboard motivates every study session.
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-3xl bg-brand-surface p-4 text-brand-text shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-brand-lime">GST 101</p>
              <p className="mt-2 font-semibold">Use of English — 10 questions</p>
            </div>
            <Button href="/quizzes/gst-101">Open quiz</Button>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-indigo">Flashcard decks</h2>
          <p className="mt-3 text-brand-muted">
            Browse flashcards for Nigerian law, university study skills, and exam-ready summaries.
          </p>
          <Button className="mt-6" href="/flashcards">Browse deck library</Button>
        </div>
      </section>
    </div>
  );
}
