import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Create with AI",
  description:
    "Turn lecture notes and PDFs into flashcard decks and quizzes with MYLE's AI study builder.",
  path: "/create",
});

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
