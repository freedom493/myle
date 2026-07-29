import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

export type StudyContent = {
  id: string;
  name: string;
  description?: string;
  course?: string;
  level?: string;
  cards?: unknown[];
  questions?: unknown[];
  [key: string]: unknown;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function humanizeId(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function loadLocalJson(
  folder: "flashcards" | "quizzes",
  id: string,
): Promise<StudyContent | null> {
  try {
    const filePath = path.join(process.cwd(), "content", folder, `${id}.json`);
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent) as StudyContent;
  } catch {
    return null;
  }
}

async function loadGeneration(id: string): Promise<StudyContent | null> {
  if (!UUID_RE.test(id)) return null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("generations")
      .select("json_data, title, description")
      .eq("id", id)
      .single();

    if (!data || error) return null;

    const json = (data.json_data || {}) as StudyContent;
    return {
      ...json,
      id: json.id || id,
      name: json.name || data.title || humanizeId(id),
      description:
        json.description || data.description || undefined,
    };
  } catch {
    return null;
  }
}

/** Memoized deck loader for page + generateMetadata. */
export const getDeck = cache(async (deckId: string): Promise<StudyContent | null> => {
  const local = await loadLocalJson("flashcards", deckId);
  if (local) {
    return {
      ...local,
      id: local.id || deckId,
      name: local.name || humanizeId(deckId),
    };
  }
  return loadGeneration(deckId);
});

/** Memoized quiz loader for page + generateMetadata. */
export const getQuiz = cache(async (quizId: string): Promise<StudyContent | null> => {
  const local = await loadLocalJson("quizzes", quizId);
  if (local) {
    return {
      ...local,
      id: local.id || quizId,
      name: local.name || humanizeId(quizId),
    };
  }
  return loadGeneration(quizId);
});

export function humanizeSlug(id: string): string {
  return humanizeId(id);
}
