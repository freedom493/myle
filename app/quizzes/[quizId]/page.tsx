import Link from "next/link";

interface QuizPageProps {
  params: Promise<{
    quizId?: string;
  }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = await params;
  const quizTitle = resolvedParams?.quizId ? resolvedParams.quizId.replace(/-/g, " ") : "Quiz";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full bg-brand-lime/10 px-4 py-2 text-sm font-semibold text-brand-lime">
          Quiz preview
        </div>
        <h1 className="text-4xl font-semibold text-brand-indigo">{quizTitle}</h1>
        <p className="max-w-2xl text-base leading-7 text-brand-muted">
          This quiz page will host the quiz player and results flow. For now, you can begin with a sample quiz and save your progress later.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/quizzes" className="rounded-full border border-brand-indigo/10 bg-white px-5 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5">
            Back to quizzes
          </Link>
          <Link href="/leaderboard" className="rounded-full bg-brand-indigo px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo/90">
            View leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
