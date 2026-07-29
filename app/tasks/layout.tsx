import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Rewards",
  description:
    "Complete tasks, refer friends, and earn AI generation credits on MYLE.",
  path: "/tasks",
  noIndex: true,
});

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
