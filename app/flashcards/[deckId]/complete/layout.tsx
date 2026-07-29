import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getDeck, humanizeSlug } from "@/lib/study-content";

interface CompleteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ deckId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ deckId: string }>;
}): Promise<Metadata> {
  const { deckId } = await params;
  const deck = await getDeck(deckId);
  const name = deck?.name || humanizeSlug(deckId);

  return pageMetadata({
    title: `Completed · ${name}`,
    description: `You finished the “${name}” flashcard deck on MYLE. Mark it complete and keep your streak going.`,
    path: `/flashcards/${deckId}/complete`,
    noIndex: true,
  });
}

export default function CompleteLayout({ children }: CompleteLayoutProps) {
  return children;
}
