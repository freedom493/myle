/** Paths that use marketing chrome (footer, no bottom nav). */
export const MARKETING_EXACT = new Set([
  "/",
  "/privacy",
  "/terms",
  "/sitemap",
  "/offline",
]);

/** Study-tool prefixes: app chrome, no marketing footer. */
export const APP_PREFIXES = [
  "/dashboard",
  "/flashcards",
  "/quizzes",
  "/profile",
  "/create",
  "/library",
  "/tasks",
  "/leaderboard",
  "/referral",
  "/tests",
] as const;

export function isMarketingPath(pathname: string | null): boolean {
  if (!pathname) return true;
  if (MARKETING_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/auth")) return true;
  return false;
}

/** App/study pages — hide marketing footer. */
export function isAppPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Immersive study sessions — hide mobile bottom nav so the player has full focus.
 * e.g. /flashcards/legal-methods, /quizzes/gst-101/results
 */
export function isImmersiveStudyPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (/^\/flashcards\/[^/]+/.test(pathname)) return true;
  if (/^\/quizzes\/[^/]+/.test(pathname)) return true;
  return false;
}

export function showFooter(pathname: string | null): boolean {
  return isMarketingPath(pathname) || !isAppPath(pathname);
}

export function showBottomNav(pathname: string | null): boolean {
  return isAppPath(pathname) && !isImmersiveStudyPath(pathname);
}
