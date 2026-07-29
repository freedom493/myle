import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getQuiz, humanizeSlug } from "@/lib/study-content";

interface ResultsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ quizId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ quizId: string }>;
}): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = await getQuiz(quizId);
  const name = quiz?.name || humanizeSlug(quizId);

  return pageMetadata({
    title: `Results · ${name}`,
    description: `View your score for “${name}” on MYLE and save it to the leaderboard.`,
    path: `/quizzes/${quizId}/results`,
    noIndex: true,
  });
}

export default function ResultsLayout({ children }: ResultsLayoutProps) {
  return children;
}
