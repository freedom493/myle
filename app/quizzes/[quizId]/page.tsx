import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { pageMetadata } from "@/lib/seo";
import { getQuiz, humanizeSlug } from "@/lib/study-content";

interface QuizPageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = await getQuiz(quizId);

  if (!quiz) {
    return pageMetadata({
      title: "Quiz not found",
      description: "This quiz could not be found on MYLE.",
      path: `/quizzes/${quizId}`,
      noIndex: true,
    });
  }

  const name = quiz.name || humanizeSlug(quizId);
  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
  const description =
    (typeof quiz.description === "string" && quiz.description) ||
    `Take the “${name}” practice quiz on MYLE${questionCount ? ` — ${questionCount} questions` : ""}.`;

  return pageMetadata({
    title: name,
    description,
    path: `/quizzes/${quizId}`,
  });
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizId } = await params;
  const quizData = await getQuiz(quizId);

  if (!quizData) {
    return notFound();
  }

  const questions = quizData.questions || [];
  const questionCount = questions.length;
  const timeLimitSec = Number(quizData.timeLimit) || 600;
  const timeLimitMin = Math.max(1, Math.round(timeLimitSec / 60));

  const playerQuiz = {
    id: quizData.id || quizId,
    name: quizData.name || "Practice Quiz",
    description:
      typeof quizData.description === "string" ? quizData.description : "",
    course: typeof quizData.course === "string" ? quizData.course : "",
    level: typeof quizData.level === "string" ? quizData.level : "",
    timeLimit: timeLimitSec,
    questions: questions as {
      id: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }[],
  };

  return (
    <div className="page-shell page-section max-w-3xl !mx-auto space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-indigo/10 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-brand-indigo hover:bg-brand-indigo/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quizzes
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted tabular-nums">
          {questionCount} Q · {timeLimitMin}m
        </span>
      </div>

      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-indigo">
          <ClipboardList className="h-3 w-3" />
          Quiz
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-indigo font-heading leading-tight">
          {playerQuiz.name}
        </h1>
        {(playerQuiz.course || playerQuiz.level) && (
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            {[playerQuiz.course, playerQuiz.level].filter(Boolean).join(" · ")}
          </p>
        )}
      </header>

      <QuizPlayer quiz={playerQuiz} />
    </div>
  );
}
