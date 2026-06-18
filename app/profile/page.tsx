'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { getStreak } from '@/lib/localStorage';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Read local streak regardless of auth
    setLocalStreak(getStreak());
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

      } catch (err: any) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfileAndScores();
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
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 space-y-10 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-indigo/5 pb-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.28em] text-brand-lime font-bold">Student Hub</p>
          <h1 className="text-4xl font-extrabold text-brand-indigo font-heading">
            {isAuthenticated ? `Welcome, ${profile.display_name || 'Learner'}` : 'Guest Profile'}
          </h1>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => signOut()}
            className="px-5 py-2.5 rounded-full border border-brand-indigo/10 text-xs font-bold text-brand-indigo hover:bg-brand-indigo/5 transition-all w-fit"
          >
            Sign Out
          </button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Stats & Setup */}
        <div className="md:col-span-1 space-y-6">
          {/* Streak Card */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-brand-indigo/10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-lime/10 flex items-center justify-center text-brand-indigo animate-pulse">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-brand-muted uppercase tracking-wider">Study Streak</p>
              <h3 className="text-2xl font-black text-brand-indigo">{localStreak} Days</h3>
            </div>
          </div>

          {/* Guest Warning / Call to Action */}
          {!isAuthenticated && (
            <div className="rounded-3xl bg-brand-indigo text-white p-6 border border-brand-lime/25 space-y-4 shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/10 text-brand-lime border border-brand-lime/30">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg font-heading">Sync Your Progress</h3>
              <p className="text-xs text-brand-surface/80 leading-relaxed">
                You are currently studying as a Guest. Create an account to secure your study streaks, log quiz results, and compete on the leaderboard!
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/auth/signup" className="w-full text-center py-2.5 rounded-xl bg-brand-lime text-brand-indigo font-bold text-xs hover:bg-brand-lime/90 transition-all">
                  Sign Up Now
                </Link>
                <Link href="/auth/login" className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition-all">
                  Log In
                </Link>
              </div>
            </div>
          )}

          {/* Authenticated Profile Settings Form */}
          {isAuthenticated && (
            <form onSubmit={handleProfileUpdate} className="glass-panel rounded-3xl p-6 shadow-sm border border-brand-indigo/10 space-y-4">
              <h3 className="font-bold text-brand-indigo text-sm uppercase tracking-wider pb-2 border-b border-brand-indigo/5">
                Profile Settings
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
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-sm border border-brand-indigo/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-indigo/5">
              <h3 className="font-bold text-brand-indigo text-lg font-heading flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-lime" />
                Quiz Performance Logs
              </h3>
              {isAuthenticated && (
                <span className="text-xs font-semibold text-brand-muted">
                  {scores.length} total attempts
                </span>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-brand-indigo/20 mx-auto" />
                <h4 className="font-bold text-brand-indigo">No synced logs</h4>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Log in or register to upload your scores and review your full performance history here.
                </p>
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-brand-indigo/20 mx-auto" />
                <h4 className="font-bold text-brand-indigo">No quiz attempts yet</h4>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Take your first practice quiz from the dashboard to log your performance!
                </p>
                <Link href="/quizzes" className="inline-block px-4 py-2 bg-brand-indigo text-white rounded-full text-xs font-bold hover:bg-brand-indigo/90">
                  Browse Quizzes
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-brand-indigo/5">
                {scores.map((record) => (
                  <div key={record.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-brand-indigo text-sm md:text-base">{record.quiz_name}</h4>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {new Date(record.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-brand-muted">{record.score} / {record.total}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        record.percentage >= 70 
                          ? 'bg-brand-success/15 text-brand-success' 
                          : record.percentage >= 50 
                            ? 'bg-brand-indigo/5 text-brand-indigo' 
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
