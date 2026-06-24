const KEYS = {
  STREAK: "myle_streak",
  LAST_STUDY: "myle_last_study",
  BEST_SCORES: "myle_best_scores",
  COMPLETED_DECKS: "myle_completed_decks",
};

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  const streak = localStorage.getItem(KEYS.STREAK);
  return streak ? parseInt(streak, 10) : 0;
}

export function updateStreak(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toDateString();
  const lastStudy = localStorage.getItem(KEYS.LAST_STUDY);
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let streak = getStreak();

  if (lastStudy === today) {
    return streak;
  }

  if (lastStudy === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(KEYS.STREAK, streak.toString());
  localStorage.setItem(KEYS.LAST_STUDY, today);
  return streak;
}

export function getBestScore(quizId: string): number | null {
  if (typeof window === "undefined") return null;
  const scores = JSON.parse(localStorage.getItem(KEYS.BEST_SCORES) || "{}");
  return scores[quizId] ?? null;
}

export function saveBestScore(quizId: string, percentage: number): void {
  if (typeof window === "undefined") return;
  const scores = JSON.parse(localStorage.getItem(KEYS.BEST_SCORES) || "{}");
  if (!scores[quizId] || percentage > scores[quizId]) {
    scores[quizId] = percentage;
    localStorage.setItem(KEYS.BEST_SCORES, JSON.stringify(scores));
  }
}

export function getCompletedDeck(): number {
  if (typeof window === 'undefined') return 0;
  const completed_deck = localStorage.getItem(KEYS.COMPLETED_DECKS)
  return completed_deck ? parseInt(completed_deck, 10) : 0
}

export function setCompletedDeck(count: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.COMPLETED_DECKS, String(count));
  try {
    window.dispatchEvent(
      new CustomEvent("myle:completed_decks", { detail: count }),
    );
  } catch (e) {
    // ignore in non-browser contexts
  }
}

export function updateCompletedDeck(): number {
  if (typeof window === "undefined") return 0;
  const current = getCompletedDeck();
  const next = current + 1;
  localStorage.setItem(KEYS.COMPLETED_DECKS, String(next));
  try {
    window.dispatchEvent(
      new CustomEvent("myle:completed_decks", { detail: next }),
    );
  } catch (e) {
    // ignore
  }
  return next;
}
