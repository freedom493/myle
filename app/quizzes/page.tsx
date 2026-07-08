import Link from "next/link";
import { ArrowRight, ClipboardList, Zap, Clock, BarChart3 } from "lucide-react";

const quizzes = [
  {
    id: "gst-101",
    title: "GST 101 — Use of English",
    description: "A short quiz to practice your writing and grammar fundamentals.",
    questions: 15,
    timeLimit: 20,
    difficulty: "Beginner",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description: "Review methodology terms and reasoning skills for law students.",
    questions: 20,
    timeLimit: 30,
    difficulty: "Intermediate",
  }
];

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header - Mobile First */}
      <div className="bg-white dark:bg-white/5 border-b border-brand-indigo/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-10 md:py-14 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-lime">
            <ClipboardList className="h-3.5 w-3.5" />
            Assessment Tools
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-indigo dark:text-white font-heading leading-tight">
              Practice Quizzes
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-brand-muted dark:text-slate-400">
              Test yourself with curated quizzes designed to help you track your strongest topics, identify weak areas, and build exam confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Quizzes Grid - Mobile First */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-10 md:py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
              <article className="group h-full rounded-3xl border border-brand-indigo/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-brand-lime/40 hover:shadow-lg hover:shadow-brand-lime/10 hover:-translate-y-1">
                
                {/* Icon & Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/10 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-brand-lime transition-all duration-300">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-brand-lime/10 text-brand-lime">
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-brand-indigo mb-2 group-hover:text-brand-indigo transition-colors">
                  {quiz.title}
                </h2>

                {/* Description */}
                <p className="text-sm leading-relaxed text-brand-muted mb-6 line-clamp-2">
                  {quiz.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-brand-indigo/5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-brand-muted" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-brand-muted">Questions</p>
                      <p className="text-sm font-bold text-brand-indigo">{quiz.questions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-muted" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-brand-muted">Time Limit</p>
                      <p className="text-sm font-bold text-brand-lime">{quiz.timeLimit}m</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-brand-indigo group-hover:text-brand-lime transition-colors">
                    Start quiz
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand-indigo group-hover:translate-x-0.5 transition-transform" />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pro Features Section */}
        <div className="mt-12 rounded-3xl border-2 border-dashed border-brand-indigo/10 bg-gradient-to-br from-brand-indigo/5 to-brand-lime/5 p-8 sm:p-10 text-center space-y-4">
          <Zap className="mx-auto h-8 w-8 text-brand-lime" />
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-brand-indigo">Detailed Performance Analytics</h3>
            <p className="text-sm text-brand-muted">
              After each quiz, see your score breakdown, identify weak topics, and get personalized recommendations to improve.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/10 px-4 py-2 text-xs font-bold text-brand-lime uppercase tracking-wider">
            <BarChart3 className="h-3 w-3" />
            Real-time insights
          </div>
        </div>
      </div>
    </div>
  );
}
