'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, ChevronRight, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { updateStreak, saveBestScore } from '@/lib/localStorage';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizData {
  id: string;
  name: string;
  description: string;
  course: string;
  level: string;
  timeLimit: number;
  questions: Question[];
}

interface QuizPlayerProps {
  quiz: QuizData;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit);

  useEffect(() => {
    if (timeRemaining <= 0) {
      finishQuiz(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const currentQuestion = quiz.questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || hasSubmitted) return;

    const newAnswers = [...answers];
    newAnswers[currentIdx] = selectedOpt;
    setAnswers(newAnswers);

    const isCorrect = selectedOpt === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHasSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      const nextSavedAnswer = answers[currentIdx + 1];
      setSelectedOpt(nextSavedAnswer);
      setHasSubmitted(nextSavedAnswer !== null);
    } else {
      finishQuiz(false);
    }
  };

  const finishQuiz = (timedOut: boolean) => {
    const finalScore =
      score +
      (selectedOpt === currentQuestion.correctIndex && !hasSubmitted ? 1 : 0);
    const finalPercentage = Math.round(
      (finalScore / quiz.questions.length) * 100,
    );
    const remaining = timedOut ? 0 : Math.max(timeRemaining, 0);
    const timeTaken = quiz.timeLimit - remaining;

    updateStreak();
    saveBestScore(quiz.id, finalPercentage);

    const resultsData = {
      score: finalScore,
      total: quiz.questions.length,
      percentage: finalPercentage,
      timeTaken,
      quizId: quiz.id,
      quizName: quiz.name,
    };
    sessionStorage.setItem(
      `myle_quiz_result_${quiz.id}`,
      JSON.stringify(resultsData),
    );

    router.push(`/quizzes/${quiz.id}/results`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-5">
      {/* Progress & timer */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-indigo/8 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="shrink-0 bg-brand-indigo text-brand-lime text-[11px] font-bold px-2.5 py-1 rounded-lg tabular-nums">
            {currentIdx + 1}/{quiz.questions.length}
          </span>
          <div className="h-1.5 flex-1 max-w-[10rem] bg-brand-indigo/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-indigo to-brand-lime transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm tabular-nums shrink-0 ${
          timeRemaining < 60 ? 'text-brand-danger' : 'text-brand-indigo'
        }`}>
          <Timer className="h-4 w-4" />
          <span className={timeRemaining < 60 ? 'animate-pulse' : ''}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl sm:rounded-3xl border border-brand-indigo/8 bg-white p-4 sm:p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-brand-indigo leading-snug">
          {currentQuestion.question}
        </h2>

        <div className="grid gap-2.5 sm:gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === currentQuestion.correctIndex;

            let optionStyles =
              'border-brand-indigo/10 hover:border-brand-indigo/30 bg-brand-surface active:scale-[0.99]';
            if (isSelected && !hasSubmitted) {
              optionStyles =
                'border-brand-indigo bg-brand-indigo/5 text-brand-indigo font-semibold ring-1 ring-brand-indigo/20';
            }
            if (hasSubmitted) {
              if (isCorrect) {
                optionStyles =
                  'border-brand-success bg-brand-success/10 text-brand-success font-semibold';
              } else if (isSelected) {
                optionStyles =
                  'border-brand-danger bg-brand-danger/10 text-brand-danger font-semibold';
              } else {
                optionStyles = 'border-brand-indigo/5 bg-gray-50 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base transition-all duration-200 flex items-center gap-3 ${optionStyles}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  hasSubmitted && isCorrect
                    ? 'bg-brand-success/20 text-brand-success'
                    : hasSubmitted && isSelected
                      ? 'bg-brand-danger/20 text-brand-danger'
                      : isSelected
                        ? 'bg-brand-indigo text-white'
                        : 'bg-brand-indigo/8 text-brand-indigo'
                }`}>
                  {letters[idx] || idx + 1}
                </span>
                <span className="flex-1 min-w-0">{option}</span>
                {hasSubmitted && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-brand-success shrink-0" />
                )}
                {hasSubmitted && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-brand-danger shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {hasSubmitted && currentQuestion.explanation && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/8 space-y-1.5">
            <div className="flex items-center gap-2 text-brand-indigo font-bold text-sm">
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span>Explanation</span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Sticky-feeling action row on mobile */}
        <div className="flex justify-end pt-3 border-t border-brand-indigo/5">
          {!hasSubmitted ? (
            <button
              type="button"
              disabled={selectedOpt === null}
              onClick={handleSubmitAnswer}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-indigo text-white font-bold text-sm hover:bg-brand-indigo/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-lime text-brand-indigo font-bold text-sm hover:bg-brand-lime/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>
                {currentIdx < quiz.questions.length - 1
                  ? 'Next question'
                  : 'Finish quiz'}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
