import { Badge } from "@/components/ui/Badge";
import { Trophy, Award, Medal } from "lucide-react";

const topThree = [
  { rank: 1, name: "Amina", score: 96, uni: "UNEC ( Enugu Campus )", level: "200L", medal: Trophy, color: "text-amber-500", glow: "border-amber-400 shadow-amber-400/10" },
  { rank: 2, name: "Chidi", score: 92, uni: "UNN ( Nsukka )", level: "300L", medal: Award, color: "text-slate-400", glow: "border-slate-300" },
  { rank: 3, name: "Ify", score: 89, uni: "ABU ( Zaria )", level: "100L", medal: Medal, color: "text-amber-700", glow: "border-amber-600" },
];

const otherLeaders = [
  { rank: 4, name: "Tunde", score: 86, uni: "UNILAG", level: "400L" },
  { rank: 5, name: "Ngozi", score: 84, uni: "UNIBEN", level: "200L" },
  { rank: 6, name: "Emeka", score: 81, uni: "UI", level: "300L" },
  { rank: 7, name: "Kemi", score: 78, uni: "OAU", level: "100L" },
];

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-brand-indigo text-brand-lime rounded-md w-fit block">
          Competitive Board
        </span>
        <h1 className="font-heading text-4xl font-extrabold text-brand-indigo">Campus Top Learners</h1>
        <p className="max-w-2xl text-base leading-relaxed text-brand-muted">
          Real-time score submissions across universities. Keep studying, hit higher scores in quizzes, and climb to the top.
        </p>
      </div>

      {/* Podium Visual Layout */}
      <section className="grid gap-6 md:grid-cols-3 md:items-end pt-4">
        {/* Second Place */}
        <div className="order-2 md:order-1 glass-panel rounded-[24px] p-6 shadow-sm border border-brand-indigo/5 text-center flex flex-col items-center justify-between min-h-[240px] hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-4 ring-2 ring-slate-200">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rank #2</span>
            <h3 className="font-heading text-xl font-extrabold text-brand-indigo mt-1">{topThree[1].name}</h3>
            <p className="text-xs text-brand-muted mt-1">{topThree[1].uni} • {topThree[1].level}</p>
          </div>
          <div className="mt-4">
            <Badge variant="neutral">{topThree[1].score}% Score</Badge>
          </div>
        </div>

        {/* First Place (Gold) */}
        <div className="order-1 md:order-2 glass-panel rounded-[32px] p-8 shadow-md border-2 border-brand-lime bg-white text-center flex flex-col items-center justify-between min-h-[280px] scale-105 relative hover:shadow-lg transition-shadow">
          {/* Visual glow indicator */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-indigo text-brand-lime text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
            Championship Rank
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4 ring-4 ring-amber-100 animate-bounce">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Rank #1</span>
            <h3 className="font-heading text-2xl font-black text-brand-indigo mt-1">{topThree[0].name}</h3>
            <p className="text-xs text-brand-muted mt-1">{topThree[0].uni} • {topThree[0].level}</p>
          </div>
          <div className="mt-4">
            <Badge variant="success">{topThree[0].score}% Score</Badge>
          </div>
        </div>

        {/* Third Place */}
        <div className="order-3 glass-panel rounded-[24px] p-6 shadow-sm border border-brand-indigo/5 text-center flex flex-col items-center justify-between min-h-[240px] hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-4 ring-2 ring-amber-200">
            <Medal className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Rank #3</span>
            <h3 className="font-heading text-xl font-extrabold text-brand-indigo mt-1">{topThree[2].name}</h3>
            <p className="text-xs text-brand-muted mt-1">{topThree[2].uni} • {topThree[2].level}</p>
          </div>
          <div className="mt-4">
            <Badge variant="neutral">{topThree[2].score}% Score</Badge>
          </div>
        </div>
      </section>

      {/* Other Rankings Table */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-brand-indigo">All Rankings</h2>
        <div className="overflow-hidden rounded-[24px] border border-brand-indigo/5 bg-white/70 backdrop-blur-md shadow-sm">
          <table className="min-w-full divide-y divide-brand-indigo/5 text-left text-sm">
            <thead className="bg-brand-indigo text-white font-heading">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Rank</th>
                <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">University</th>
                <th className="px-6 py-4 font-bold tracking-wider">Level</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-indigo/5 text-brand-text">
              {/* Podium entries repeated in table for consistency */}
              {topThree.map((lead) => (
                <tr key={lead.name} className="hover:bg-brand-indigo/5 transition-colors font-medium">
                  <td className="px-6 py-4 text-brand-indigo font-bold">#{lead.rank}</td>
                  <td className="px-6 py-4 font-heading">{lead.name}</td>
                  <td className="px-6 py-4 text-brand-muted">{lead.uni.split(" ")[0]}</td>
                  <td className="px-6 py-4 text-brand-muted">{lead.level}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center rounded-full bg-brand-indigo/5 px-2.5 py-0.5 text-xs font-bold text-brand-indigo">
                      {lead.score}%
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Other Entries */}
              {otherLeaders.map((lead) => (
                <tr key={lead.name} className="hover:bg-brand-indigo/5 transition-colors">
                  <td className="px-6 py-4 text-brand-muted font-bold">#{lead.rank}</td>
                  <td className="px-6 py-4 font-heading">{lead.name}</td>
                  <td className="px-6 py-4 text-brand-muted">{lead.uni}</td>
                  <td className="px-6 py-4 text-brand-muted">{lead.level}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center rounded-full bg-brand-indigo/5 px-2.5 py-0.5 text-xs font-bold text-brand-indigo">
                      {lead.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  );
}
