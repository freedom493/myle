/** Paths that use marketing chrome only (footer, no bottom nav / mobile app header). */
export const MARKETING_EXACT = new Set([
  "/",
  "/privacy",
  "/terms",
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
 * Immersive study sessions — compact mobile header so the player has more room.
 * e.g. /flashcards/legal-methods, /quizzes/gst-101/results
 */
export function isImmersiveStudyPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (/^\/flashcards\/[^/]+/.test(pathname)) return true;
  if (/^\/quizzes\/[^/]+/.test(pathname)) return true;
  return false;
}

/** Marketing pages that keep the full footer and hide app chrome. */
export function showFooter(pathname: string | null): boolean {
  if (!pathname) return true;
  return MARKETING_EXACT.has(pathname);
}

/**
 * Bottom nav is shared on every page except homepage, terms, and privacy.
 */
export function showBottomNav(pathname: string | null): boolean {
  if (!pathname) return false;
  return !MARKETING_EXACT.has(pathname);
}

/** Mobile top bar — same visibility as bottom nav (app chrome). */
export function showMobileHeader(pathname: string | null): boolean {
  return showBottomNav(pathname);
}
