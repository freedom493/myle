import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "My Library",
  description:
    "Browse your AI-generated flashcard decks and quizzes saved in your MYLE library.",
  path: "/library",
  noIndex: true,
});

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
