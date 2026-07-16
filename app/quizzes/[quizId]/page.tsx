import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import QuizPlayer from "@/components/quiz/QuizPlayer";

interface QuizPageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = await params;
  const { quizId } = resolvedParams;

  let quizData: Record<string, unknown> | null = null;
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "quizzes",
      `${quizId}.json`,
    );
    const fileContent = await fs.readFile(filePath, "utf8");
    quizData = JSON.parse(fileContent);
  } catch {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(quizId)) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("generations")
          .select("json_data")
          .eq("id", quizId)
          .single();

        if (data && !error) {
          quizData = data.json_data as Record<string, unknown>;
        }
      } catch (err) {
        console.error("Failed to load from DB:", err);
      }
    }
  }

  if (!quizData) {
    return notFound();
  }

  const questions = (quizData.questions as unknown[]) || [];
  const questionCount = questions.length;
  const timeLimitSec = Number(quizData.timeLimit) || 600;
  const timeLimitMin = Math.max(1, Math.round(timeLimitSec / 60));

  // Ensure player gets a stable shape
  const playerQuiz = {
    id: (quizData.id as string) || quizId,
    name: (quizData.name as string) || "Practice Quiz",
    description: (quizData.description as string) || "",
    course: (quizData.course as string) || "",
    level: (quizData.level as string) || "",
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
