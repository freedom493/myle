'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Clock, RotateCcw, AlertTriangle, CheckCircle, ChevronRight, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface ResultsData {
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  quizId: string;
  quizName: string;
}

interface RatingStat {
  rating: string;
  count: number;
  percentage: number;
}

interface PageProps {
  params: Promise<{
    quizId: string;
  }>;
}

const ratingOptions = ['easy', 'moderate', 'hard', 'difficult'] as const;
type RatingOption = (typeof ratingOptions)[number];

export default function QuizResultsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated, signUp } = useAuth();
  
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [selectedRating, setSelectedRating] = useState<RatingOption | null>(null);
  const [ratingSaved, setRatingSaved] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<RatingStat[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  // Inline SignUp Form State for anonymous users
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const dataStr = sessionStorage.getItem(`myle_quiz_result_${resolvedParams.quizId}`);
    if (dataStr) {
      setResults(JSON.parse(dataStr));
    }
  }, [resolvedParams.quizId]);

  useEffect(() => {
    if (results) {
      fetchRatingDistribution(results.quizId);
    }
  }, [results]);

  if (!results) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-brand-lime mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-indigo">No Results Found</h2>
        <p className="text-brand-muted mt-2">Please start a quiz first from the dashboard.</p>
        <Link href="/quizzes" className="mt-6 inline-block rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRatingLabel = (rating: string) => rating.charAt(0).toUpperCase() + rating.slice(1);

  const fetchRatingDistribution = async (quizId: string) => {
    setLoadingRatings(true);
    setRatingError(null);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('quiz_rating_totals')
        .select('rating, rating_count, rating_percentage')
        .eq('quiz_id', quizId);

      if (error) throw error;

      if (data) {
        setRatingDistribution(
          data.map((item: any) => ({
            rating: item.rating,
            count: Number(item.rating_count ?? 0),
            percentage: Number(item.rating_percentage ?? 0),
          })),
        );
      }
    } catch (err: any) {
      console.error(err);
      setRatingError(err.message || 'Failed to load difficulty breakdown');
    } finally {
      setLoadingRatings(false);
    }
  };

  const handleSaveScore = async (userId: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.from('quiz_scores').insert({
        user_id: userId,
        quiz_id: results.quizId,
        quiz_name: results.quizName,
        score: results.score,
        total: results.total,
        percentage: results.percentage,
        time_taken_seconds: results.timeTaken,
      });

      if (error) throw error;
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to submit score');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRating = async () => {
    if (!selectedRating || !results) {
      setRatingError('Select a difficulty rating first.');
      return;
    }

    setIsSubmitting(true);
    setRatingError(null);
    const supabase = createClient();

    try {
      const payload = {
        user_id: user?.id ?? null,
        quiz_id: results.quizId,
        rating: selectedRating,
      };

      let query;
      if (user) {
        // For authenticated users: upsert to allow re-rating
        query = supabase.from('quiz_ratings').upsert(payload, {
          onConflict: 'user_id,quiz_id',
        });
      } else {
        // For anonymous users: just insert (no update needed)
        query = supabase.from('quiz_ratings').insert(payload);
      }

      const { error } = await query;
      if (error) throw error;

      setRatingSaved(true);
      await fetchRatingDistribution(results.quizId);
    } catch (err: any) {
      console.error(err);
      setRatingError(err.message || 'Failed to save rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setSubmitError('All fields are required');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await signUp(email, password, displayName);
      if (error) throw error;
      
      if (data.user) {
        // Success: Trigger score submission for the newly created user
        await handleSaveScore(data.user.id);
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to create account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-lime font-bold">Quiz Results</p>
        <h1 className="text-4xl font-extrabold text-brand-indigo font-heading">{results.quizName}</h1>
      </div>

      {/* Main Score Board */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Score Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2 border border-brand-indigo/10">
          <Trophy className="h-10 w-10 text-brand-lime animate-bounce" />
          <span className="text-xs uppercase tracking-wider font-extrabold text-brand-muted">Final Score</span>
          <span className="text-4xl font-black text-brand-indigo">{results.score} / {results.total}</span>
        </div>

        {/* Percentage Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2 border border-brand-indigo/10">
          <div className="text-4xl font-black text-brand-indigo">{results.percentage}%</div>
          <span className="text-xs uppercase tracking-wider font-extrabold text-brand-muted">Accuracy</span>
          <span className="text-[10px] text-brand-muted font-bold">
            {results.percentage >= 70 ? 'Excellent work!' : results.percentage >= 50 ? 'Good try, keep studying' : 'Need more practice'}
          </span>
        </div>

        {/* Time Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2 border border-brand-indigo/10">
          <Clock className="h-10 w-10 text-brand-indigo" />
          <span className="text-xs uppercase tracking-wider font-extrabold text-brand-muted">Time Taken</span>
          <span className="text-2xl font-bold text-brand-indigo">{formatTime(results.timeTaken)}</span>
        </div>
      </div>

      {/* Quiz Difficulty Rating */}
      <div className="rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-indigo font-heading">Rate the Quiz Difficulty</h2>
            <p className="text-sm text-brand-muted">Share your experience so future learners can judge how challenging this quiz is.</p>
          </div>
          {ratingSaved && (
            <div className="rounded-full bg-brand-success/10 px-4 py-2 text-sm font-semibold text-brand-success">
              Difficulty rating saved
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {ratingOptions.map((option) => {
            const active = selectedRating === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedRating(option)}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo shadow-sm'
                    : 'border-brand-indigo/10 bg-white text-brand-indigo/80 hover:border-brand-indigo/20 hover:bg-brand-indigo/5'
                }`}
              >
                {getRatingLabel(option)}
              </button>
            );
          })}
        </div>

        {ratingError && <p className="text-brand-danger text-xs font-bold">{ratingError}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSaveRating}
            disabled={!selectedRating || isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Rating...' : 'Submit Difficulty Rating'}
          </button>
        </div>

        <div className="space-y-3 pt-4 border-t border-brand-indigo/10">
          <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-brand-muted">Difficulty distribution</h3>
          {loadingRatings ? (
            <p className="text-sm text-brand-muted">Loading difficulty breakdown...</p>
          ) : (
            ratingOptions.map((option) => {
              const result = ratingDistribution.find((rating) => rating.rating === option);
              const percentage = result?.percentage ?? 0;
              return (
                <div key={option} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold text-brand-indigo">
                    <span>{getRatingLabel(option)}</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-brand-indigo/10">
                    <div
                      className="h-full rounded-full bg-brand-indigo"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Leaderboard Submission Prompt */}
      <div className="rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-brand-indigo font-heading">Leaderboard Rankings</h2>
        
        {submitSuccess ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-success/15 border border-brand-success/20 text-brand-success">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span className="font-semibold text-sm">Your score has been saved! Check out where you stand on the leaderboard.</span>
          </div>
        ) : (
          <>
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-brand-muted text-sm leading-relaxed">
                  You are signed in! Save your best score of <strong>{results.percentage}%</strong> to represent your university on the leaderboard.
                </p>
                {submitError && <p className="text-brand-danger text-xs font-bold">{submitError}</p>}
                <button
                  onClick={() => handleSaveScore(user!.id)}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full bg-brand-indigo text-white font-semibold text-sm hover:bg-brand-indigo/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit to Leaderboard'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-brand-muted text-sm leading-relaxed">
                  Study tools are guest-first, but appearing on the competitive campus leaderboard requires account verification. Create a profile now to post your score!
                </p>

                {showSignUpForm ? (
                  <form onSubmit={handleSignUpSubmit} className="space-y-4 max-w-md border-t border-brand-indigo/5 pt-4">
                    <h3 className="font-bold text-brand-indigo text-sm uppercase tracking-wider flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Create Student Profile
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-bold text-brand-muted mb-1">Display Name</label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Amina, Tunde"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-indigo/10 text-sm focus:outline-brand-indigo focus:ring-1 focus:ring-brand-indigo text-brand-text bg-brand-surface font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-muted mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-indigo/10 text-sm focus:outline-brand-indigo focus:ring-1 focus:ring-brand-indigo text-brand-text bg-brand-surface font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-muted mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-indigo/10 text-sm focus:outline-brand-indigo focus:ring-1 focus:ring-brand-indigo text-brand-text bg-brand-surface font-semibold"
                      />
                    </div>

                    {submitError && <p className="text-brand-danger text-xs font-bold">{submitError}</p>}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-full bg-brand-indigo text-white font-bold text-xs hover:bg-brand-indigo/90 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registering...' : 'Sign Up & Save Score'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSignUpForm(false)}
                        className="px-5 py-2.5 rounded-full border border-brand-indigo/10 font-bold text-xs text-brand-indigo hover:bg-brand-indigo/5 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowSignUpForm(true)}
                      className="px-6 py-3 rounded-full bg-brand-lime text-brand-indigo font-bold text-sm hover:bg-brand-lime/90 transition-all flex items-center gap-2 group shadow-lg shadow-brand-lime/10"
                    >
                      <span>Create Account to Save Score</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <Link href="/auth/login" className="px-6 py-3 rounded-full border border-brand-indigo/10 font-semibold text-sm text-brand-indigo hover:bg-brand-indigo/5 transition-all">
                      Already have an account? Log In
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Link href={`/quizzes/${results.quizId}`} className="flex items-center gap-2 rounded-full border border-brand-indigo/10 bg-white px-5 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/5 shadow-sm">
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </Link>
        <Link href="/leaderboard" className="rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo/90 shadow-md">
          Go to Leaderboard
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold text-brand-indigo hover:underline ml-auto">
          Back to Dashboard
        </Link>
      </div>

    </div>
  );
}
