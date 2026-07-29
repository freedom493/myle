import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://myle247.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "MYLE";
export const SITE_TAGLINE = "Your Student OS";
export const DEFAULT_DESCRIPTION =
  "Guest-first study tools, quizzes, flashcards, and leaderboard for Nigerian university students.";

export const DEFAULT_OG_IMAGE = "/og-image.png";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  /** Short page title — root layout template appends " | MYLE" */
  title: string;
  description: string;
  path: string;
  /** Skip search indexing (private, offline, or session pages) */
  noIndex?: boolean;
  /** Override default OG image path or absolute URL */
  image?: string;
  /** Use title as-is without the root template */
  absoluteTitle?: boolean;
};

/**
 * Build consistent Metadata for a route: title, description, canonical,
 * Open Graph, Twitter, and robots.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
  image,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image?.startsWith("http")
    ? image
    : absoluteUrl(image || DEFAULT_OG_IMAGE);
  const displayTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: displayTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${title}`,
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
