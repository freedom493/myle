import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import FlashcardsComponent from "@/components/layout/FlashcardsComponent";
import { Metadata } from "next";

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export async function generateMetadata({ params }: DeckPageProps): Promise<Metadata> {
  const { deckId } = await params;

  return {
    title: deckId
  }
}

export default async function DeckPage({ params }: DeckPageProps) {
  const resolvedParams = await params;
  const { deckId } = resolvedParams;

  let deckData: Record<string, unknown> | null = null;
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "flashcards",
      `${deckId}.json`,
    );
    const fileContent = await fs.readFile(filePath, "utf8");
    deckData = JSON.parse(fileContent);
  } catch {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(deckId)) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("generations")
          .select("json_data")
          .eq("id", deckId)
          .single();

        if (data && !error) {
          deckData = data.json_data as Record<string, unknown>;
        }
      } catch (dbErr) {
        console.error("Failed to load from DB:", dbErr);
      }
    }
  }

  if (!deckData) {
    return notFound();
  }

  const cards = (deckData.cards as unknown[]) || [];
  const cardCount = cards.length;
  const deckName =
    (deckData.name as string) ||
    deckId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="page-shell page-section max-w-3xl !mx-auto space-y-5 sm:space-y-6">
      {/* Compact session bar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-indigo/10 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-brand-indigo hover:bg-brand-indigo/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Decks
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted tabular-nums">
          {cardCount} cards
        </span>
      </div>

      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-indigo/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-indigo">
          <BookOpen className="h-3 w-3" />
          Studying
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-indigo font-heading leading-tight">
          {deckName}
        </h1>
        {typeof deckData.description === "string" && deckData.description && (
          <p className="text-sm text-brand-muted leading-relaxed line-clamp-2">
            {deckData.description}
          </p>
        )}
      </header>

      <FlashcardsComponent deckData={deckData} />
    </div>
  );
}
