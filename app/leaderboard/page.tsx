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
        let query = supabase.from('leaderboard').select('*');
        
        if (quizFilter !== 'all') {
          query = query.eq('quiz_id', quizFilter);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        if (data && data.length > 0) {
          const ranked = data.map((entry: LeaderboardEntry, index: number) => ({
            ...entry,
            rank: index + 1,
          }));
          setLeaders(ranked);

          const uniqueQuizzes = Array.from(
            new Set(
              data.map((item: LeaderboardEntry) =>
                JSON.stringify({ id: item.quiz_id, name: item.quiz_name }),
              ),
            ),
          ).map((str) => JSON.parse(str as string));
          setAvailableQuizzes(uniqueQuizzes);
        } else {
          const mockRanked = mockLeaders.map((item, index) => ({
            ...item,
            rank: index + 1,
            quiz_name: "GST 101 — Use of English"
          }));
          setLeaders(mockRanked);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard from Supabase:", error);
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

  return (
    <div className="page-shell page-section space-y-8 sm:space-y-10 md:space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3 sm:space-y-4 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-indigo text-brand-lime rounded-md w-fit block">
            Competitive Board
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo tracking-tight">
            Campus Top Learners
          </h1>
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-brand-muted">
            Real-time score submissions across universities. Keep studying, hit higher scores in quizzes, and climb to the top.
          </p>
        </div>

        {/* Quiz Filter Selector */}
        <div className="flex items-center gap-3 bg-white px-3 sm:px-4 py-2.5 rounded-2xl border border-brand-indigo/10 shadow-sm w-full sm:w-fit min-w-0">
          <Filter className="h-4 w-4 text-brand-indigo shrink-0" />
          <select
            value={quizFilter}
            onChange={(e) => setQuizFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-brand-indigo focus:outline-none cursor-pointer min-w-0 flex-1 sm:flex-none"
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
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3">
          <Loader2 className="h-10 w-10 text-brand-indigo animate-spin" />
          <p className="text-sm font-semibold text-brand-muted text-center px-4">
            Loading live leaderboard rankings...
          </p>
        </div>
      ) : (
        <>
          {/* Podium Visual Layout */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 sm:items-end pt-2 sm:pt-4">
            
            {/* Second Place */}
            {topThree[1] && (
              <div className="order-2 sm:order-1 glass-panel rounded-2xl sm:rounded-[24px] p-5 sm:p-6 shadow-sm border border-brand-indigo/5 text-center flex flex-col items-center justify-between min-h-[200px] sm:min-h-[240px] hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-3 sm:mb-4 ring-2 ring-slate-200">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 w-full px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rank #2</span>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-brand-indigo mt-1 truncate">
                    {topThree[1].display_name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 line-clamp-2">
                    {topThree[1].university} • {topThree[1].level}
                  </p>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Badge variant="neutral">{topThree[1].best_percentage}% Score</Badge>
                </div>
              </div>
            )}

            {/* First Place (Gold) */}
            {topThree[0] && (
              <div className="order-1 sm:order-2 glass-panel rounded-2xl sm:rounded-[32px] p-6 sm:p-8 shadow-md border-2 border-brand-lime bg-white text-center flex flex-col items-center justify-between min-h-[220px] sm:min-h-[280px] sm:scale-105 relative hover:shadow-lg transition-shadow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-indigo text-brand-lime text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  Championship Rank
                </div>
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-3 sm:mb-4 ring-4 ring-amber-100">
                  <Trophy className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <div className="min-w-0 w-full px-1">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Rank #1</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-brand-indigo mt-1 truncate">
                    {topThree[0].display_name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 line-clamp-2">
                    {topThree[0].university} • {topThree[0].level}
                  </p>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Badge variant="success">{topThree[0].best_percentage}% Score</Badge>
                </div>
              </div>
            )}

            {/* Third Place */}
            {topThree[2] && (
              <div className="order-3 glass-panel rounded-2xl sm:rounded-[24px] p-5 sm:p-6 shadow-sm border border-brand-indigo/5 text-center flex flex-col items-center justify-between min-h-[200px] sm:min-h-[240px] hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-3 sm:mb-4 ring-2 ring-amber-200">
                  <Medal className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 w-full px-1">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Rank #3</span>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-brand-indigo mt-1 truncate">
                    {topThree[2].display_name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 line-clamp-2">
                    {topThree[2].university} • {topThree[2].level}
                  </p>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Badge variant="neutral">{topThree[2].best_percentage}% Score</Badge>
                </div>
              </div>
            )}
          </section>

          {/* Rankings — cards on mobile, table on md+ */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-base sm:text-lg font-bold text-brand-indigo">All Rankings</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-lime/20 text-brand-indigo flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Live
              </span>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-2.5">
              {leaders.map((lead, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-brand-indigo/8 bg-white p-3.5 shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-indigo/8 text-sm font-black text-brand-indigo tabular-nums">
                    #{lead.rank || idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-brand-indigo text-sm truncate font-heading">
                      {lead.display_name}
                    </p>
                    <p className="text-[11px] text-brand-muted truncate">
                      {lead.university} · {lead.level}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-brand-indigo/5 px-2.5 py-1 text-xs font-bold text-brand-indigo tabular-nums shrink-0">
                    {lead.best_percentage}%
                  </span>
                </div>
              ))}
            </div>
            
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-[24px] border border-brand-indigo/5 bg-white/70 backdrop-blur-md shadow-sm">
              <table className="min-w-full divide-y divide-brand-indigo/5 text-left text-sm">
                <thead className="bg-brand-indigo text-white font-heading">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 font-bold tracking-wider">Rank</th>
                    <th className="px-4 lg:px-6 py-4 font-bold tracking-wider">Name</th>
                    <th className="px-4 lg:px-6 py-4 font-bold tracking-wider">University</th>
                    <th className="px-4 lg:px-6 py-4 font-bold tracking-wider">Level</th>
                    <th className="px-4 lg:px-6 py-4 font-bold tracking-wider text-right">Best Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-indigo/5 text-brand-text">
                  {leaders.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-brand-indigo/5 transition-colors font-medium">
                      <td className="px-4 lg:px-6 py-4 text-brand-indigo font-bold tabular-nums">
                        #{lead.rank || idx + 1}
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-heading">{lead.display_name}</td>
                      <td className="px-4 lg:px-6 py-4 text-brand-muted">{lead.university}</td>
                      <td className="px-4 lg:px-6 py-4 text-brand-muted">{lead.level}</td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <span className="inline-flex items-center rounded-full bg-brand-indigo/5 px-2.5 py-0.5 text-xs font-bold text-brand-indigo tabular-nums">
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
