import Link from "next/link";

interface QuizResultsPageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function QuizResultsPage({ params }: QuizResultsPageProps) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-lime">Quiz results</p>
        <h1 className="text-4xl font-semibold text-brand-indigo">{resolvedParams.quizId.replace(/-/g, " ")} results</h1>
        <p className="max-w-2xl text-base leading-7 text-brand-muted">
          After quiz completion, this page will show your score, leaderboard entry prompt, and recommendations for next study sessions.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm">
        <p className="text-brand-muted">Your quiz result screen is ready to be connected to the scoring engine and leaderboard submission flow.</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/quizzes" className="rounded-full border border-brand-indigo/10 bg-white px-5 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5">
            Back to quizzes
          </Link>
          <Link href="/leaderboard" className="rounded-full bg-brand-indigo px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo/90">
            View current leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
