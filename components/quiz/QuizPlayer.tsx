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
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsTimeUp(true);
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
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
      handleFinish();
    }
  };

  const handleFinish = () => {
    const finalScore = score + (selectedOpt === currentQuestion.correctIndex && !hasSubmitted ? 1 : 0);
    const finalPercentage = Math.round((finalScore / quiz.questions.length) * 100);
    const timeTaken = quiz.timeLimit - timeRemaining;

    // Update streak and save best score to localStorage
    updateStreak();
    saveBestScore(quiz.id, finalPercentage);

    // Save results to session storage for results page to read
    const resultsData = {
      score: finalScore,
      total: quiz.questions.length,
      percentage: finalPercentage,
      timeTaken: timeTaken,
      quizId: quiz.id,
      quizName: quiz.name
    };
    sessionStorage.setItem(`myle_quiz_result_${quiz.id}`, JSON.stringify(resultsData));

    router.push(`/quizzes/${quiz.id}/results`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress & Timer Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-brand-indigo/10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="bg-brand-indigo text-brand-lime text-xs font-bold px-3 py-1.5 rounded-lg">
            Question {currentIdx + 1} of {quiz.questions.length}
          </span>
          <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-lime transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-brand-indigo font-mono font-bold">
          <Timer className="h-5 w-5 text-brand-indigo" />
          <span className={timeRemaining < 60 ? 'text-brand-danger animate-pulse' : ''}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-brand-indigo/10 p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-xl md:text-2xl font-bold font-heading text-brand-indigo leading-snug">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="grid gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            
            let optionStyles = 'border-brand-indigo/10 hover:border-brand-indigo/30 bg-brand-surface';
            if (isSelected) {
              optionStyles = 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo font-semibold';
            }
            if (hasSubmitted) {
              if (isCorrect) {
                optionStyles = 'border-brand-success bg-brand-success/10 text-brand-success font-semibold';
              } else if (isSelected) {
                optionStyles = 'border-brand-danger bg-brand-danger/10 text-brand-danger font-semibold';
              } else {
                optionStyles = 'border-brand-indigo/5 bg-gray-50 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm md:text-base transition-all duration-200 flex items-center justify-between gap-4 ${optionStyles}`}
              >
                <span>{option}</span>
                {hasSubmitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-brand-success shrink-0" />}
                {hasSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-brand-danger shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Alert */}
        {hasSubmitted && currentQuestion.explanation && (
          <div className="p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/10 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 text-brand-indigo font-bold text-sm">
              <HelpCircle className="h-4 w-4" />
              <span>Explanation</span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-end pt-4 border-t border-brand-indigo/5">
          {!hasSubmitted ? (
            <button
              disabled={selectedOpt === null}
              onClick={handleSubmitAnswer}
              className="px-6 py-3 rounded-full bg-brand-indigo text-white font-semibold text-sm hover:bg-brand-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-full bg-brand-lime text-brand-indigo font-bold text-sm hover:bg-brand-lime/90 transition-all flex items-center gap-2 group"
            >
              <span>{currentIdx < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
