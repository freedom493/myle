'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Share2, Copy, Check, Users, Shield, Zap, Sparkles, Loader2, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface Task {
  id: string;
  slug: string;
  title: string;
  description: string;
  credits_reward: number;
  icon: string;
  max_completions: number;
  times_completed: number;
  is_completed: boolean;
}

export default function TasksPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [daysUntilReset, setDaysUntilReset] = useState<number>(30);
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?next=/tasks');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch credits
        const credRes = await fetch('/api/credits');
        if (credRes.ok) {
          const credData = await credRes.json();
          setCredits(credData.credits_balance);
          setDaysUntilReset(credData.days_until_reset);
        }

        // Fetch referral code
        const refRes = await fetch('/api/referral');
        if (refRes.ok) {
          const refData = await refRes.json();
          setReferralCode(refData.code);
        }

        // Fetch tasks
        const taskRes = await fetch('/api/tasks');
        if (taskRes.ok) {
          const taskData = await taskRes.json();
          setTasks(taskData.tasks || []);
        }
      } catch (err) {
        console.error('Failed to load tasks data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authLoading, router]);

  const referralUrl = typeof window !== 'undefined' ? `${window.location.origin}/referral?code=${referralCode}` : '';

  const handleCopy = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteTask = async (slug: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state
        setCredits(prev => prev + data.reward);
        setTasks(tasks.map(t => {
          if (t.slug === slug) {
            const newTimes = t.times_completed + 1;
            return {
              ...t,
              times_completed: newTimes,
              is_completed: newTimes >= t.max_completions
            };
          }
          return t;
        }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to complete task');
      }
    } catch (error) {
      console.error('Failed to complete task', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm text-brand-muted font-semibold">Loading rewards...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-10 py-10 md:py-14 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-lime">
          <Gift className="h-3.5 w-3.5" />
          Rewards Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-indigo font-heading leading-tight">
          Earn Generation Credits
        </h1>
        <p className="text-brand-muted text-sm max-w-2xl">
          Complete tasks and invite friends to earn credits for AI deck and quiz generation. Every 30 days, your free allowance resets.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Credits Status Card */}
        <div className="md:col-span-1 rounded-3xl bg-brand-indigo text-white p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col h-full">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-lime/20 blur-[40px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lime text-brand-indigo shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-surface/80">Available Credits</p>
              <h2 className="text-3xl font-black font-heading">{credits}</h2>
            </div>
          </div>

          <div className="mt-auto relative z-10 space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-brand-surface/70">Next Free Reset</span>
              <span className="text-brand-lime">{daysUntilReset} days</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-lime transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, ((30 - daysUntilReset) / 30) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-brand-surface/60 leading-relaxed">
              You receive 15 free generation credits every 30 days. Credits earned from tasks do not expire.
            </p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-brand-indigo font-heading flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand-lime" />
            Available Tasks
          </h2>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="glass-panel rounded-3xl p-5 sm:p-6 border border-brand-indigo/10 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-brand-lime/30">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${task.is_completed ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-indigo/5 text-brand-indigo'}`}>
                  {task.icon === 'users' ? <Users className="h-6 w-6" /> : 
                   task.icon === 'share' ? <Share2 className="h-6 w-6" /> : 
                   <Shield className="h-6 w-6" />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-indigo text-lg">{task.title}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-lime/20 text-brand-indigo">
                      +{task.credits_reward} Credits
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {task.description}
                  </p>
                  <p className="text-[10px] font-bold text-brand-muted mt-1 uppercase tracking-wider">
                    Completed: {task.times_completed} / {task.max_completions}
                  </p>
                </div>

                <div className="sm:ml-auto pt-2 sm:pt-0 shrink-0">
                  {task.slug === 'invite_friend' ? (
                    <div className="w-full sm:w-auto">
                      <div className="flex items-center bg-white rounded-xl border border-brand-indigo/10 overflow-hidden shadow-sm">
                        <div className="px-3 py-2 text-xs font-mono text-brand-muted bg-gray-50 border-r border-brand-indigo/10 truncate max-w-[150px] sm:max-w-[120px]">
                          {referralCode}
                        </div>
                        <button 
                          onClick={handleCopy}
                          className="flex items-center justify-center w-10 h-full text-brand-indigo hover:bg-brand-indigo/5 transition-colors"
                          title="Copy Referral Link"
                        >
                          {copied ? <Check className="h-4 w-4 text-brand-success" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      {copied && <p className="text-[10px] text-brand-success font-bold text-right mt-1">Copied Link!</p>}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteTask(task.slug)}
                      disabled={task.is_completed}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        task.is_completed
                          ? 'bg-brand-success/10 text-brand-success cursor-not-allowed'
                          : 'bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-sm'
                      }`}
                    >
                      {task.is_completed ? (
                        <>
                          <Check className="h-3 w-3" /> Completed
                        </>
                      ) : (
                        'Complete Task'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="rounded-2xl border-2 border-dashed border-brand-indigo/10 bg-brand-indigo/5 p-6 text-center mt-6">
             <p className="text-sm font-semibold text-brand-indigo">More tasks coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
