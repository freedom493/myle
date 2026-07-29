import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Referral invite",
  description:
    "You've been invited to MYLE. Sign up with a referral link to unlock bonus AI generation credits.",
  path: "/referral",
});

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
