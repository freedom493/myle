import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Zap,
  Clock,
  BarChart3,
  Globe,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quizzes | MYLE',
  description: 'Take Quizzes to master materials and prepare for exams',
  openGraph: {
    title: 'MYLE | QUizzes',
    description: 'Take Quizzes to help you prepare for exams or create your own quiz from your material view our quiz builder',
    url: 'https://myle247.vercel.app/quizzes'
  }
}

const localQuizzes = [
  {
    id: "gst-101",
    title: "GST 101 — Use of English",
    description:
      "A short quiz to practice your writing and grammar fundamentals.",
    questions: 2,
    timeLimit: 2,
    difficulty: "Beginner",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description:
      "Review methodology terms and reasoning skills for law students.",
    questions: 10,
    timeLimit: 6,
    difficulty: "Intermediate",
  },
];

export default async function QuizzesPage() {
  const supabase = await createClient();
  const { data: publicQuizzes } = await supabase
    .from("generations")
    .select("id, title, description, json_data, created_at")
    .eq("visibility", "public")
    .eq("type", "quiz")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="page-shell page-section space-y-8 sm:space-y-10">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-indigo">
          <ClipboardList className="h-3.5 w-3.5" />
          Quizzes
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo font-heading tracking-tight">
          Practice quizzes
        </h1>
        <p className="max-w-xl text-sm sm:text-base text-brand-muted leading-relaxed">
          Test yourself, get instant scores, and build exam confidence.
        </p>
      </header>

      <section className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {localQuizzes.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/quizzes/${quiz.id}`}
            className="study-card group block"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-brand-lime transition-colors">
                <ClipboardList className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-brand-lime/15 text-brand-indigo">
                {quiz.difficulty}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-brand-indigo mb-1.5">
              {quiz.title}
            </h2>
            <p className="text-sm text-brand-muted line-clamp-2 mb-5 leading-snug">
              {quiz.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted mb-4 pb-4 border-b border-brand-indigo/5">
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                {quiz.questions} Qs
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-lime" />
                {quiz.timeLimit}m
              </span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold text-brand-indigo">
              <span>Start quiz</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </section>

      {publicQuizzes && publicQuizzes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-brand-indigo font-heading flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-lime" />
            Community quizzes
          </h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicQuizzes.map((quiz) => {
              const data = quiz.json_data as {
                questions?: unknown[];
                timeLimit?: number;
              };
              const qCount = data?.questions?.length || 0;
              const mins = data?.timeLimit
                ? Math.ceil(data.timeLimit / 60)
                : Math.ceil(qCount * 0.5);

              return (
                <Link
                  key={quiz.id}
                  href={`/quizzes/${quiz.id}`}
                  className="study-card group block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo">
                      <ClipboardList className="h-[18px] w-[18px]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      Community
                    </span>
                  </div>
                  <h3 className="font-bold text-brand-indigo text-base mb-1 line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2 mb-3">
                    {quiz.description || "No description provided."}
                  </p>
                  <p className="text-xs font-semibold text-brand-muted">
                    {qCount} questions · ~{mins}m
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-brand-indigo text-white p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-lime/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2">
            <Zap className="h-6 w-6 text-brand-lime" />
            <h3 className="text-lg font-bold font-heading">
              Create quizzes with AI
            </h3>
            <p className="text-sm text-white/70 max-w-md">
              Upload notes and generate practice questions instantly.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-lime px-5 py-3 font-bold text-sm text-brand-indigo hover:bg-brand-lime/90 transition-all w-full sm:w-auto shrink-0"
          >
            Generate <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
