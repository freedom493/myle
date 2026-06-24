import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6 mb-8">
        <div className="inline-flex items-center gap-3 rounded-full bg-brand-lime/10 px-4 py-2 text-sm font-semibold text-brand-lime">
          {quizData.course || "General Quiz"} • {quizData.level || "All Levels"}
        </div>
        <h1 className="text-4xl font-extrabold text-brand-indigo font-heading">{quizData.name}</h1>
        {quizData?.source && (
          <p className="text-sm text-brand-muted font-medium">Source: {quizData.source}</p>
        )}
        <p className="max-w-2xl text-base leading-relaxed text-brand-muted">
          {quizData.description}
        </p>
      </div>

      <QuizPlayer quiz={quizData} />
    </div>
  );
}
