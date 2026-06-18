'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/Badge";
import { Trophy, Award, Medal, Loader2, Sparkles, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardEntry {
  rank?: number;
  quiz_id?: string;
  quiz_name?: string;
  display_name: string;
  university: string;
  level: string;
  best_percentage: number;
  best_score?: number;
  total?: number;
  best_time?: number;
}

const mockLeaders: LeaderboardEntry[] = [
  { display_name: "Amina", best_percentage: 96, university: "UNEC ( Enugu Campus )", level: "200L" },
  { display_name: "Chidi", best_percentage: 92, university: "UNN ( Nsukka )", level: "300L" },
  { display_name: "Ify", best_percentage: 89, university: "ABU ( Zaria )", level: "100L" },
  { display_name: "Tunde", best_percentage: 86, university: "UNILAG", level: "400L" },
  { display_name: "Ngozi", best_percentage: 84, university: "UNIBEN", level: "200L" },
  { display_name: "Emeka", best_percentage: 81, university: "UI", level: "300L" },
  { display_name: "Kemi", best_percentage: 78, university: "OAU", level: "100L" },
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizFilter, setQuizFilter] = useState<string>("all");
  const [availableQuizzes, setAvailableQuizzes] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const supabase = createClient();
      
      try {
        // Query the leaderboard view
        let query = supabase.from('leaderboard').select('*');
        
        if (quizFilter !== 'all') {
          query = query.eq('quiz_id', quizFilter);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        if (data && data.length > 0) {
          // Add rank numbers to entries
          const ranked = data.map((entry: any, index: number) => ({
            ...entry,
            rank: index + 1,
          }));
          setLeaders(ranked);

          // Get unique quizzes for filter list
          const uniqueQuizzes = Array.from(new Set(data.map((item: any) => JSON.stringify({ id: item.quiz_id, name: item.quiz_name }))))
            .map((str: any) => JSON.parse(str));
          setAvailableQuizzes(uniqueQuizzes);
        } else {
          // If no entries in DB, use mock leaders
          const mockRanked = mockLeaders.map((item, index) => ({
            ...item,
            rank: index + 1,
            quiz_name: "GST 101 — Use of English"
          }));
          setLeaders(mockRanked);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard from Supabase:", error);
        // Graceful fallback to mock data
        const mockRanked = mockLeaders.map((item, index) => ({
          ...item,
          rank: index + 1,
          quiz_name: "GST 101 — Use of English"
        }));
        setLeaders(mockRanked);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [quizFilter]);

  const topThree = leaders.slice(0, 3);
  const otherLeaders = leaders.slice(3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16 space-y-12 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-indigo text-brand-lime rounded-md w-fit block">
            Competitive Board
          </span>
          <h1 className="font-heading text-4xl font-extrabold text-brand-indigo">Campus Top Learners</h1>
          <p className="max-w-2xl text-base leading-relaxed text-brand-muted">
            Real-time score submissions across universities. Keep studying, hit higher scores in quizzes, and climb to the top.
          </p>
        </div>

        {/* Quiz Filter Selector */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-brand-indigo/10 shadow-sm w-fit">
          <Filter className="h-4 w-4 text-brand-indigo shrink-0" />
          <select
            value={quizFilter}
            onChange={(e) => setQuizFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-brand-indigo focus:outline-none cursor-pointer"
          >
            <option value="all">All Quizzes</option>
            {availableQuizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>{quiz.name}</option>
            ))}
            <option value="gst-101">GST 101 — Use of English</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 text-brand-indigo animate-spin" />
          <p className="text-sm font-semibold text-brand-muted">Loading live leaderboard rankings...</p>
        </div>
      ) : (
        <>
          {/* Podium Visual Layout */}
          <section className="grid gap-6 md:grid-cols-3 md:items-end pt-4">
            
            {/* Second Place */}
            {topThree[1] && (
              <div className="order-2 md:order-1 glass-panel rounded-[24px] p-6 shadow-sm border border-brand-indigo/5 text-center flex flex-col items-center justify-between min-h-[240px] hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-4 ring-2 ring-slate-200">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rank #2</span>
                  <h3 className="font-heading text-xl font-extrabold text-brand-indigo mt-1">{topThree[1].display_name}</h3>
                  <p className="text-xs text-brand-muted mt-1">{topThree[1].university} • {topThree[1].level}</p>
                </div>
                <div className="mt-4">
                  <Badge variant="neutral">{topThree[1].best_percentage}% Score</Badge>
                </div>
              </div>
            )}

            {/* First Place (Gold) */}
            {topThree[0] && (
              <div className="order-1 md:order-2 glass-panel rounded-[32px] p-8 shadow-md border-2 border-brand-lime bg-white text-center flex flex-col items-center justify-between min-h-[280px] scale-105 relative hover:shadow-lg transition-shadow">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-indigo text-brand-lime text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Championship Rank
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4 ring-4 ring-amber-100 animate-bounce">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Rank #1</span>
                  <h3 className="font-heading text-2xl font-black text-brand-indigo mt-1">{topThree[0].display_name}</h3>
                  <p className="text-xs text-brand-muted mt-1">{topThree[0].university} • {topThree[0].level}</p>
                </div>
                <div className="mt-4">
                  <Badge variant="success">{topThree[0].best_percentage}% Score</Badge>
                </div>
              </div>
            )}

            {/* Third Place */}
            {topThree[2] && (
              <div className="order-3 glass-panel rounded-[24px] p-6 shadow-sm border border-brand-indigo/5 text-center flex flex-col items-center justify-between min-h-[240px] hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-4 ring-2 ring-amber-200">
                  <Medal className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Rank #3</span>
                  <h3 className="font-heading text-xl font-extrabold text-brand-indigo mt-1">{topThree[2].display_name}</h3>
                  <p className="text-xs text-brand-muted mt-1">{topThree[2].university} • {topThree[2].level}</p>
                </div>
                <div className="mt-4">
                  <Badge variant="neutral">{topThree[2].best_percentage}% Score</Badge>
                </div>
              </div>
            )}
          </section>

          {/* Other Rankings Table */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-brand-indigo">All Rankings</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-lime/20 text-brand-indigo flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Live
              </span>
            </div>
            
            <div className="overflow-hidden rounded-[24px] border border-brand-indigo/5 bg-white/70 backdrop-blur-md shadow-sm">
              <table className="min-w-full divide-y divide-brand-indigo/5 text-left text-sm">
                <thead className="bg-brand-indigo text-white font-heading">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Rank</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                    <th className="px-6 py-4 font-bold tracking-wider">University</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Level</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Best Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-indigo/5 text-brand-text">
                  {/* Table listings */}
                  {leaders.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-brand-indigo/5 transition-colors font-medium">
                      <td className="px-6 py-4 text-brand-indigo font-bold">#{lead.rank || idx + 1}</td>
                      <td className="px-6 py-4 font-heading">{lead.display_name}</td>
                      <td className="px-6 py-4 text-brand-muted">{lead.university}</td>
                      <td className="px-6 py-4 text-brand-muted">{lead.level}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center rounded-full bg-brand-indigo/5 px-2.5 py-0.5 text-xs font-bold text-brand-indigo">
                          {lead.best_percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      
    </div>
  );
}
