import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Clock, Globe, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Flashcards",
  description:
    "Browse and study flashcard decks for Nigerian university courses — law, GST, and community-shared materials.",
  path: "/flashcards",
});

const localDecks = [
  {
    id: "nigerian-legal-system",
    title: "Nigerian legal system",
    description: "Core terms, institutions and case law for Nigerian law students.",
    cards: 3,
    difficulty: "Intermediate",
    category: "law",
  },
  {
    id: "legal-methods",
    title: "Legal methods",
    description: "Study common research methods, definitions, and exam-ready summaries.",
    cards: 22,
    difficulty: "Intermediate",
    category: "law",
  },
];

interface FlashcardsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FlashcardsPage({ searchParams }: FlashcardsPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams?.category || "all";

  const supabase = await createClient();
  const { data: publicDecks } = await supabase
    .from("generations")
    .select("id, title, description, json_data, created_at, category")
    .eq("visibility", "public")
    .eq("type", "flashcard")
    .order("created_at", { ascending: false })
    .limit(12);

  // Derive unique available categories from local decks and public decks
  const categoriesSet = new Set<string>();
  localDecks.forEach(deck => {
    if (deck.category) categoriesSet.add(deck.category.toLowerCase());
  });
  
  publicDecks?.forEach(deck => {
    if (deck.category) {
      categoriesSet.add(deck.category.toLowerCase());
    }
  });

  const availableCategories = ["all", ...Array.from(categoriesSet)];

  // Filter local decks based on active category
  const filteredLocalDecks = activeCategory === "all" 
    ? localDecks 
    : localDecks.filter(deck => deck.category?.toLowerCase() === activeCategory);

  // Filter public decks based on active category
  const filteredPublicDecks = publicDecks?.filter(deck => {
    if (activeCategory === "all") return true;
    const matchesCategory = deck.category?.toLowerCase() === activeCategory;
    const matchesTitle = deck.title.toLowerCase().includes(activeCategory);
    return matchesCategory || matchesTitle;
  }) || [];

  return (
    <div className="page-shell page-section space-y-10 sm:space-y-12 pb-24">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-indigo/5 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-indigo">
            <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
            Active Recall Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-indigo font-heading tracking-tight">
            Study Decks
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-brand-muted leading-relaxed">
            Master your courses with bite-sized, high-yield flashcards designed for rapid recall and exam prep.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-5 py-3.5 font-bold text-sm text-white hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/15 shrink-0"
        >
          <Zap className="h-4 w-4 text-brand-lime" />
          <span>Create Custom Deck</span>
        </Link>
      </header>

      {/* Category Navigation Bar */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {availableCategories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={`/flashcards${cat === 'all' ? '' : `?category=${encodeURIComponent(cat)}`}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-indigo text-white shadow-md shadow-brand-indigo/20'
                  : 'bg-white text-brand-muted border border-brand-indigo/10 hover:border-brand-indigo/30 hover:text-brand-indigo'
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

      {/* Featured Curated Decks */}
      {filteredLocalDecks.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-indigo font-heading flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-indigo" />
              Curated Study Decks
            </h2>
            <span className="text-xs font-semibold text-brand-muted bg-brand-indigo/5 px-2.5 py-1 rounded-lg">
              Essential
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredLocalDecks.map((deck) => (
              <Link 
                key={deck.id} 
                href={`/flashcards/${deck.id}`} 
                className="study-card group block relative overflow-hidden bg-white hover:border-brand-lime/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                
                <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/5 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-brand-lime transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-brand-lime/20 text-brand-indigo">
                    {deck.difficulty}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-brand-indigo mb-1.5 group-hover:text-brand-indigo/80 transition-colors">
                    {deck.title}
                  </h3>
                  <p className="text-sm text-brand-muted line-clamp-2 mb-6 leading-relaxed">
                    {deck.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-brand-indigo/5">
                    <div className="flex items-center gap-4 text-xs font-bold text-brand-muted">
                      <span className="inline-flex items-center gap-1.5 text-brand-indigo">
                        <Zap className="h-3.5 w-3.5 text-brand-lime" />
                        {deck.cards} cards
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        ~{Math.ceil(deck.cards * 0.5)} min
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo group-hover:translate-x-1 transition-transform">
                      Start <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Community Decks Section */}
      {filteredPublicDecks.length > 0 && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-indigo font-heading flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand-lime" />
              Community Shared Decks
            </h2>
            <span className="text-xs font-semibold text-brand-muted bg-brand-indigo/5 px-2.5 py-1 rounded-lg">
              Peer Generated
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPublicDecks.map((deck) => {
              const data = deck.json_data as { cards?: unknown[] };
              const cardsCount = data?.cards?.length || 0;

              return (
                <Link
                  key={deck.id}
                  href={`/flashcards/${deck.id}`}
                  className="study-card group block bg-white hover:border-brand-indigo/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/5 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-colors">
                        <BookOpen className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Community
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-brand-indigo text-base mb-1.5 line-clamp-1 group-hover:text-brand-indigo/80">
                      {deck.title}
                    </h3>
                    <p className="text-xs text-brand-muted line-clamp-2 mb-4 leading-relaxed">
                      {deck.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-brand-muted pt-3 border-t border-brand-indigo/5">
                    <span>{cardsCount} cards · ~{Math.ceil(cardsCount * 0.5)}m</span>
                    <ArrowRight className="h-3.5 w-3.5 text-brand-indigo group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {filteredLocalDecks.length === 0 && filteredPublicDecks.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-indigo/5 space-y-3">
          <p className="text-base font-bold text-brand-indigo">No decks found in this category.</p>
          <p className="text-xs text-brand-muted">Try selecting another category or create your own custom deck with AI.</p>
        </div>
      )}

      {/* AI Generator Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-indigo text-white p-8 sm:p-10 shadow-xl">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-lime/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-brand-indigo/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-lime backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              AI Powered Study Tool
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-brand-surface">
              Have lecture slides or notes to study?
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Transform any PDF, document, or image into an interactive flashcard deck instantly using MYLE's built-in AI parser.
            </p>
          </div>
          
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-lime px-6 py-4 font-bold text-sm text-brand-indigo hover:bg-brand-lime/90 transition-all shadow-lg shadow-brand-lime/20 shrink-0 group"
          >
            <span>Generate Flashcards</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
