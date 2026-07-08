'use client';

import { useState } from "react";
import { Flame, Sparkles, Trophy, RotateCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    title: "Guest-First Study Tools",
    description: "Access flashcards and quizzes instantly without registration. Start learning on your own terms.",
    icon: Flame,
    href: "/dashboard",
  },
  {
    title: "Leaderboards & Streaks",
    description: "Compete with peers, save your high scores, and maintain your daily study streak to stay motivated.",
    icon: Trophy,
    href: "/leaderboard",
  },
  {
    title: "Local Progress Backup",
    description: "Your scores are saved automatically in your browser. Upgrade to a cloud account anytime.",
    icon: Sparkles,
    href: "/auth/signup",
  },
];

const sampleFlashcards = [
  {
    category: "NIGERIAN CONSTITUTION",
    question: "What is Section 1(1) of the 1999 Constitution of Nigeria?",
    answer: "It establishes the absolute supremacy of the Constitution over all other laws, persons, and authorities throughout the Federal Republic of Nigeria.",
  },
  {
    category: "GST 101 (USE OF ENGLISH)",
    question: "What is a transitive verb?",
    answer: "A transitive verb is a verb that requires a direct object to complete its meaning (e.g., 'Chidi passed the exam').",
  },
  {
    category: "STUDY TIP",
    question: "What is the Pomodoro Technique?",
    answer: "A time management method that uses a timer to break work down into intervals (usually 25 minutes), separated by short breaks.",
  },
];

export default function Home() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % sampleFlashcards.length);
    }, 180);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev - 1 + sampleFlashcards.length) % sampleFlashcards.length);
    }, 180);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] max-w-6xl flex-col gap-20 px-6 py-12 md:px-10 md:py-20">

      {/* Hero Section */}
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-brand-lime/30 bg-brand-lime/10 px-4.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-indigo dark:text-brand-lime">
            Built for Nigerian university students
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-indigo dark:text-white sm:text-6xl leading-[1.1]">
            Study smarter. <br />
            <span className="bg-gradient-to-r from-brand-indigo via-brand-indigo/80 to-brand-lime dark:from-white dark:via-indigo-300 dark:to-brand-lime bg-clip-text text-transparent">
              Excel on campus.
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-brand-muted dark:text-slate-400">
            Browse exam-ready flashcard decks, test your knowledge with auto-scored quizzes, and climb leaderboards—all in a friction-free guest-first experience.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/dashboard" className="h-fit">Start studying now</Button>
            <Button href="/leaderboard" variant="secondary" className="h-fit">View leaderboard</Button>
          </div>
        </div>

        {/* Hero Interactive Widget */}
        <div className="relative">
          {/* Visual glow backdrop */}
          <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-brand-lime/20 to-brand-indigo/5 dark:from-brand-lime/10 dark:to-transparent opacity-80 blur-lg" />

          <div className="relative rounded-[32px] border border-brand-indigo/10 dark:border-white/10 bg-white/95 dark:bg-[#0e0d16] p-6 md:p-8 shadow-xl shadow-brand-indigo/5 dark:shadow-brand-lime/5">
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-brand-indigo dark:bg-white/5 px-5 py-4 text-white shadow-md shadow-brand-indigo/15 dark:shadow-none border border-white/5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-lime font-bold">Try it out</p>
                <p className="text-lg font-bold text-white">Interactive Flashcard</p>
              </div>
              <BookOpen className="h-8 w-8 text-brand-lime" />
            </div>

            {/* Flashcard Body */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`group min-h-[220px] rounded-2xl border border-brand-indigo/10 dark:border-white/10 p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 ${isFlipped
                  ? 'bg-brand-indigo dark:bg-brand-lime text-white dark:text-[#0c0b14] shadow-inner'
                  : 'bg-brand-surface dark:bg-white/5 text-brand-text dark:text-white hover:border-brand-lime/45 hover:shadow-md'
                }`}
            >
              <div className="flex justify-between items-start gap-4">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${isFlipped 
                    ? (theme => 'bg-brand-lime dark:bg-brand-indigo text-brand-indigo dark:text-brand-lime')() // dynamically overridden by style values
                    : 'bg-brand-indigo dark:bg-white/10 text-brand-lime dark:text-white'
                  }`}>
                  {sampleFlashcards[currentCard].category}
                </span>
                <span className="text-[10px] text-brand-muted dark:text-slate-400 font-semibold group-hover:text-brand-indigo/80 dark:group-hover:text-white">
                  {isFlipped ? "Showing Answer" : "Click to Reveal"}
                </span>
              </div>

              <div className="my-6">
                {isFlipped ? (
                  <p className="text-sm font-medium leading-relaxed animate-fade-in">
                    {sampleFlashcards[currentCard].answer}
                  </p>
                ) : (
                  <p className="text-base font-bold leading-snug tracking-tight font-heading">
                    {sampleFlashcards[currentCard].question}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-xs font-semibold">
                <span className={isFlipped ? 'text-brand-lime dark:text-brand-indigo' : 'text-brand-indigo dark:text-brand-lime'}>
                  Card {currentCard + 1} of {sampleFlashcards.length}
                </span>
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <RotateCw className="h-3.5 w-3.5 animate-spin-slow" />
                  <span>Flip Card</span>
                </div>
              </div>
            </div>

            {/* Pagination controls */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={handlePrev}
                className="rounded-full border border-brand-indigo/10 dark:border-white/10 px-4 py-2 text-xs font-bold text-brand-indigo dark:text-white transition hover:bg-brand-indigo/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="rounded-full bg-brand-indigo dark:bg-brand-lime px-5 py-2 text-xs font-bold text-white dark:text-[#0c0b14] transition hover:bg-brand-indigo/90 dark:hover:opacity-90 shadow-sm cursor-pointer"
              >
                Next Card
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-brand-lime bg-brand-indigo dark:bg-white/5 px-3 py-1 rounded-full w-fit mx-auto border border-brand-indigo/5 dark:border-white/5">
            Why MYLE?
          </p>
          <h2 className="font-heading text-3xl font-extrabold text-brand-indigo dark:text-white sm:text-4xl">
            Designed for Campus Success
          </h2>
          <p className="text-brand-muted dark:text-slate-400">
            Skip the registration forms and jump straight into study sets created for Nigerian university curriculums.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              href={feature.href}
              title={feature.title}
              description={feature.description}
              Icon={feature.icon}
            />
          ))}
        </div>
      </section>

      {/* Ready for first quiz call-out */}
      <section className="grid gap-8 sm:grid-cols-2">
        <div className="glass-panel rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-lime/20 text-brand-indigo dark:text-brand-lime rounded-md w-fit block mb-4">
              Practice Quizzes
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-brand-indigo dark:text-white">Ready for your first quiz?</h2>
            <p className="mt-3 text-brand-muted dark:text-slate-400 leading-relaxed">
              Explore one of our starter quizzes and see how the leaderboard motivates every study session.
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-brand-surface dark:bg-white/5 p-5 border border-brand-indigo/5 dark:border-white/5 relative overflow-hidden">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-indigo/60 dark:text-slate-400">GST 101 PREVIEW</p>
                <p className="mt-2 font-bold text-brand-indigo dark:text-white text-lg">Use of English — 10 questions</p>
              </div>
            </div>
          </div>
          <Button href="/quizzes/gst-101" className="mt-6 w-full sm:w-fit">Open quiz player</Button>
        </div>

        <div className="glass-panel rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-indigo dark:bg-white/10 text-brand-lime dark:text-white rounded-md w-fit block mb-4 border border-brand-indigo/5 dark:border-white/5">
              Flashcard Library
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-brand-indigo dark:text-white">Bite-sized summaries</h2>
            <p className="mt-3 text-brand-muted dark:text-slate-400 leading-relaxed">
              Browse flashcards for Nigerian Law, University study skills, and exam prep outlines. Build recall quickly.
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-brand-surface dark:bg-white/5 p-5 border border-brand-indigo/5 dark:border-white/5 relative overflow-hidden">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-indigo/60 dark:text-slate-400">LAW STUDY PREVIEW</p>
                <p className="mt-2 font-bold text-brand-indigo dark:text-white text-lg">Nigerian Legal System — 25 cards</p>
              </div>
            </div>
          </div>
          <Button className="mt-6 w-full sm:w-fit" href="/flashcards">Browse library</Button>
        </div>
      </section>
    </div>
  );
}
