import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const quizzes = [
  {
    id: "gst-101",
    title: "GST 101 — Use of English",
    description: "A short quiz to practice your writing and grammar fundamentals.",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description: "Review methodology terms and reasoning skills for law students.",
  }
];

export default function QuizzesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.32em] text-brand-lime">Quizzes</p>
        <h1 className="text-4xl font-semibold text-brand-indigo">Practice quizzes</h1>
        <p className="max-w-2xl text-base leading-7 text-brand-muted">
          Test yourself with quick quizzes designed to help you track your strongest topics and build confidence.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {quizzes.map((quiz) => (
          <article key={quiz.id} className="rounded-3xl border border-brand-indigo/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-indigo/5 text-brand-indigo">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-brand-indigo">{quiz.title}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-muted">{quiz.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <Link href={`/quizzes/${quiz.id}`} className="text-sm font-semibold text-brand-indigo transition hover:text-brand-lime">
                Start quiz
              </Link>
              <ArrowRight className="h-4 w-4 text-brand-indigo" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
