import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Clock, BarChart3, Zap } from "lucide-react";
import QuizPlayer from "@/components/quiz/QuizPlayer";

interface QuizPageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = await params;
  const { quizId } = resolvedParams;

  let quizData;
  try {
    const filePath = path.join(process.cwd(), "content", "quizzes", `${quizId}.json`);
    const fileContent = await fs.readFile(filePath, "utf8");
    quizData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load quiz content:", error);
    return notFound();
  }

  const questionCount = quizData?.questions?.length || 0;

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Mobile-first Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-brand-indigo/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between">
          <Link 
            href="/quizzes" 
            className="flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:text-brand-lime transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="text-xs uppercase tracking-wider font-bold text-brand-lime">
            {questionCount} questions
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-10 py-8 md:py-12 space-y-8">
        {/* Title Section - Mobile First */}
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-lime">
            <ClipboardList className="h-3.5 w-3.5" />
            Quiz
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-indigo font-heading leading-tight">
              {quizData.name}
            </h1>
            {quizData.course || quizData.level ? (
              <p className="text-xs sm:text-sm font-semibold text-brand-muted uppercase tracking-wider">
                {quizData.course && <span>{quizData.course}</span>}
                {quizData.course && quizData.level && <span> • </span>}
                {quizData.level && <span>{quizData.level}</span>}
              </p>
            ) : null}
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-brand-muted max-w-2xl">
            {quizData.description}
          </p>
          {quizData?.source && (
            <p className="text-xs text-brand-muted font-semibold">Source: {quizData.source}</p>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-brand-indigo/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-indigo">{questionCount}</div>
            <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Questions</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 border border-brand-indigo/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-lime">{quizData.timeLimit || '20'}m</div>
            <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Time Limit</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 border border-brand-indigo/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-success">✓</div>
            <p className="text-xs font-semibold text-brand-muted mt-1 uppercase tracking-wider">Timed</p>
          </div>
        </div>

        {/* Quiz Player - Mobile Responsive */}
        <div className="my-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <QuizPlayer quiz={quizData} />
        </div>

        {/* Study Tips */}
        <div className="rounded-2xl border border-brand-lime/20 bg-brand-lime/5 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-lime" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-lime">Pro Tips</h3>
          </div>
          <ul className="text-sm text-brand-muted leading-relaxed space-y-2">
            <li>• Read each question carefully before answering</li>
            <li>• Use the timer to manage your pace</li>
            <li>• Review explanations after completion to learn from mistakes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
