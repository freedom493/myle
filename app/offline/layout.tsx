import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "You're offline",
  description:
    "MYLE works offline for previously visited study tools. Reconnect when you can, or continue from cached pages.",
  path: "/offline",
  noIndex: true,
});

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
