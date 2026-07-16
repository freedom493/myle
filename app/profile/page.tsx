'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { getStreak, getCompletedDeck, setCompletedDeck } from '@/lib/localStorage';
import { Flame, BookOpen, GraduationCap, School, Layers, CheckCircle2, Trophy, Loader2 } from 'lucide-react';

interface ProfileData {
  display_name: string;
  university: string;
  department: string;
  level: string;
}

interface ScoreRecord {
  id: string;
  quiz_name: string;
  score: number;
  total: number;
  percentage: number;
  created_at: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData>({
    display_name: '',
    university: 'UNEC',
    department: 'Law',
    level: '100L',
  });
  
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localStreak, setLocalStreak] = useState(0);
  const [completedDecks, setCompletedDecks] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Read local streak regardless of auth
    setLocalStreak(getStreak());
    setCompletedDecks(getCompletedDeck());
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const userId = user.id;

    async function fetchProfileAndScores() {
      setLoadingProfile(true);
      const supabase = createClient();
      
      try {
        // Fetch profile
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('display_name, university, department, level')
          .eq('id', userId)
          .single();

        if (profileErr && profileErr.code !== 'PGRST116') {
          throw profileErr;
        }

        if (profileData) {
          setProfile({
            display_name: profileData.display_name || '',
            university: profileData.university || 'UNEC',
            department: profileData.department || 'Law',
            level: profileData.level || '100L',
          });
        }

        // Fetch scores
        const { data: scoresData, error: scoresErr } = await supabase
          .from('quiz_scores')
          .select('id, quiz_name, score, total, percentage, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (scoresErr) throw scoresErr;
        if (scoresData) setScores(scoresData);

        // fetch cloud completed decks
        const { data: statsData, error: statsErr } = await supabase
          .from('user_stats')
          .select('completed_decks')
          .eq('user_id', userId)
          .single();

        if (!statsErr && statsData && typeof statsData.completed_decks === 'number') {
          // reconcile local vs cloud: prefer the higher count and sync both sides
          const local = getCompletedDeck();
          const cloud = statsData.completed_decks || 0;
          const finalCount = Math.max(local, cloud);

          if (finalCount !== cloud) {
            // update cloud
            await supabase
              .from('user_stats')
              .upsert({ user_id: userId, completed_decks: finalCount }, { onConflict: 'user_id' });
          }

          if (finalCount !== local) {
            setCompletedDeck(finalCount);
          }

          setCompletedDecks(finalCount);
        }

      } catch (err: any) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfileAndScores();
  }, [isAuthenticated, user]);

  // Listen for completed deck updates and sync to cloud when authenticated
  useEffect(() => {
    async function onCompleted(e: Event) {
      const detail = (e as CustomEvent).detail as number;
      setCompletedDecks(detail);

      if (isAuthenticated && user) {
        const supabase = createClient();
        try {
          await supabase
            .from('user_stats')
            .upsert({ user_id: user.id, completed_decks: detail }, { onConflict: 'user_id' });
        } catch (err: unknown) {
          console.error('Failed to sync completed decks:', err);
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('myle:completed_decks', onCompleted as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('myle:completed_decks', onCompleted as EventListener);
      }
    };
  }, [isAuthenticated, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          university: profile.university,
          department: profile.department,
          level: profile.level,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm text-brand-muted font-semibold">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="page-shell page-section space-y-6 sm:space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-brand-muted font-bold">Profile</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-indigo font-heading tracking-tight truncate">
            {isAuthenticated ? (profile.display_name || 'Learner') : 'Guest profile'}
          </h1>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => signOut()}
            className="px-4 py-2.5 rounded-xl border border-brand-indigo/10 text-xs font-bold text-brand-indigo hover:bg-brand-indigo/5 transition-all w-fit shrink-0"
          >
            Sign out
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {/* Left Column: Stats & Setup */}
        <div className="md:col-span-1 space-y-3 sm:space-y-4">
          {/* Streak Card */}
          <div className="stat-tile flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-brand-muted uppercase tracking-wider">Study streak</p>
              <h3 className="text-xl font-black text-brand-indigo tabular-nums">{localStreak} days</h3>
            </div>
          </div>

          <div className="stat-tile flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-brand-indigo/8 flex items-center justify-center text-brand-indigo shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-brand-muted uppercase tracking-wider">Completed decks</p>
              <h3 className="text-xl font-black text-brand-indigo tabular-nums">{completedDecks}</h3>
            </div>
          </div>

          {/* Guest Warning / Call to Action */}
          {!isAuthenticated && (
            <div className="rounded-2xl bg-brand-indigo text-white p-5 space-y-3 shadow-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-lime/15 text-brand-lime">
                <Trophy className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              </div>
              <h3 className="font-bold text-base font-heading">Sync your progress</h3>
              <p className="text-xs text-white/75 leading-relaxed">
                Create a free account to save streaks, quiz history, and leaderboard ranks.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/auth/signup" className="w-full text-center py-2.5 rounded-xl bg-brand-lime text-brand-indigo font-bold text-xs hover:bg-brand-lime/90 transition-all">
                  Sign up free
                </Link>
                <Link href="/auth/login" className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition-all">
                  Log in
                </Link>
              </div>
            </div>
          )}

          {/* Authenticated Profile Settings Form */}
          {isAuthenticated && (
            <form onSubmit={handleProfileUpdate} className="stat-tile space-y-3.5">
              <h3 className="font-bold text-brand-indigo text-xs uppercase tracking-wider pb-2 border-b border-brand-indigo/5">
                Settings
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-brand-muted mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-indigo/10 text-xs text-brand-text bg-brand-surface font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted mb-1 flex items-center gap-1">
                  <School className="h-3 w-3 text-brand-lime" /> University
                </label>
                <input
                  type="text"
                  required
                  value={profile.university}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                  placeholder="e.g. UNEC, UNN"
                  className="w-full px-3 py-2 rounded-xl border border-brand-indigo/10 text-xs text-brand-text bg-brand-surface font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted mb-1 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3 text-brand-lime" /> Department
                </label>
                <input
                  type="text"
                  required
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="e.g. Law"
                  className="w-full px-3 py-2 rounded-xl border border-brand-indigo/10 text-xs text-brand-text bg-brand-surface font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted mb-1 flex items-center gap-1">
                  <Layers className="h-3 w-3 text-brand-lime" /> Level
                </label>
                <select
                  value={profile.level}
                  onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-indigo/10 text-xs text-brand-text bg-brand-surface font-semibold focus:outline-none"
                >
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                </select>
              </div>

              {message && (
                <p className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg ${message.type === 'success' ? 'text-brand-success bg-brand-success/10' : 'text-brand-danger bg-brand-danger/10'}`}>
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-brand-indigo text-white font-bold text-xs hover:bg-brand-indigo/90 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Update Details'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Quiz history */}
        <div className="md:col-span-2">
          <div className="stat-tile space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-brand-indigo/5">
              <h3 className="font-bold text-brand-indigo text-base font-heading flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 h-[18px] w-[18px] text-brand-lime" />
                Quiz history
              </h3>
              {isAuthenticated && (
                <span className="text-xs font-semibold text-brand-muted shrink-0">
                  {scores.length} attempts
                </span>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-10 space-y-2">
                <CheckCircle2 className="h-9 w-9 text-brand-indigo/15 mx-auto" />
                <h4 className="font-bold text-brand-indigo text-sm">No synced logs</h4>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Log in to save scores and review performance history.
                </p>
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="h-9 w-9 text-brand-indigo/15 mx-auto" />
                <h4 className="font-bold text-brand-indigo text-sm">No quizzes yet</h4>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Take a practice quiz to start logging results.
                </p>
                <Link href="/quizzes" className="inline-flex px-4 py-2 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo/90">
                  Browse quizzes
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-brand-indigo/5">
                {scores.map((record) => (
                  <div key={record.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <h4 className="font-bold text-brand-indigo text-sm truncate">{record.quiz_name}</h4>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        {new Date(record.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-brand-muted tabular-nums">{record.score}/{record.total}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                        record.percentage >= 70 
                          ? 'bg-brand-success/15 text-brand-success' 
                          : record.percentage >= 50 
                            ? 'bg-brand-indigo/8 text-brand-indigo' 
                            : 'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {record.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
