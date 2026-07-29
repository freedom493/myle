/**
 * Homepage is a Client Component (`app/page.tsx`), so metadata lives here
 * and is re-exported from a thin server layout wrapper is not required —
 * the root layout already defines the default home title/description.
 *
 * This module documents intentional home SEO and can be imported if the
 * homepage is ever split into a server shell + client UI.
 */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const homeMetadata: Metadata = pageMetadata({
  title: "Study smarter on campus",
  description:
    "Guest-first study tools, quizzes, flashcards, and leaderboard for Nigerian university students.",
  path: "/",
  absoluteTitle: true,
});
