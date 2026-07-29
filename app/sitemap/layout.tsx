import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sitemap",
  description:
    "Browse all public MYLE pages — study tools, authentication, legal policies, and more.",
  path: "/sitemap",
});

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
