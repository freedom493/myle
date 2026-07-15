import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const FLASHCARD_SCHEMA = {
  type: "OBJECT" as const,
  properties: {
    name: { type: "STRING" as const },
    description: { type: "STRING" as const },
    source: { type: "STRING" as const },
    cards: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          term: { type: "STRING" as const },
          definition: { type: "STRING" as const },
        },
        required: ["term", "definition"],
      },
    },
  },
  required: ["name", "description", "cards"],
};

const QUIZ_SCHEMA = {
  type: "OBJECT" as const,
  properties: {
    name: { type: "STRING" as const },
    description: { type: "STRING" as const },
    source: { type: "STRING" as const },
    course: { type: "STRING" as const },
    level: { type: "STRING" as const },
    timeLimit: { type: "INTEGER" as const },
    questions: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          id: { type: "STRING" as const },
          question: { type: "STRING" as const },
          options: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
          correctIndex: { type: "INTEGER" as const },
          explanation: { type: "STRING" as const },
        },
        required: ["id", "question", "options", "correctIndex", "explanation"],
      },
    },
  },
  required: ["name", "description", "questions"],
};

const MIME_MAP: Record<string, string> = {
  'application/pdf': 'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain': 'text/plain',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check & reset credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !creditsData) {
      // Auto-create credits row if missing (edge case)
      await supabase.from('user_credits').insert({
        user_id: user.id,
        credits_balance: 15,
        free_credits_used: 0,
        cycle_start: new Date().toISOString(),
      });
      // Re-fetch
      const { data: newCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (!newCredits) {
        return NextResponse.json({ error: 'Failed to initialize credits' }, { status: 500 });
      }
      Object.assign(creditsData || {}, newCredits);
    }

    const credits = creditsData!;

    // Check if cycle needs reset (30 days)
    const cycleStart = new Date(credits.cycle_start);
    const now = new Date();
    const daysSinceCycle = (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCycle >= 30) {
      await supabase
        .from('user_credits')
        .update({
          credits_balance: credits.credits_balance + 15,
          free_credits_used: 0,
          cycle_start: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('user_id', user.id);
      credits.credits_balance += 15;
    }

    if (credits.credits_balance <= 0) {
      return NextResponse.json(
        { error: 'No generation credits remaining. Complete tasks or invite friends to earn more!' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'flashcard';
    const titleOverride = formData.get('title') as string | null;
    const course = formData.get('course') as string | null;
    const level = formData.get('level') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!['flashcard', 'quiz'].includes(type)) {
      return NextResponse.json({ error: 'Type must be "flashcard" or "quiz"' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const mimeType = MIME_MAP[file.type];
    if (!mimeType) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, PPTX, or TXT files.' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');

    const filePart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };

    // Build prompt
    const isFlashcard = type === 'flashcard';
    const prompt = isFlashcard
      ? 'Analyze this document thoroughly and extract the most important concepts, terms, definitions, and principles to create comprehensive study flashcards. Each flashcard should have a clear, concise term and a detailed, exam-ready definition. Generate at least 15 flashcards covering all major topics.'
      : 'Analyze this document thoroughly and create a comprehensive multiple-choice quiz to test understanding of the key concepts. Each question should have exactly 4 options with one correct answer and a detailed explanation. Generate at least 10 challenging questions covering all major topics. Set an appropriate time limit in minutes.';

    // Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [filePart, { text: prompt }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: isFlashcard ? FLASHCARD_SCHEMA : QUIZ_SCHEMA,
      },
    });

    const generatedText = response.text;
    if (!generatedText) {
      return NextResponse.json({ error: 'AI generation returned empty result' }, { status: 500 });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(generatedText);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Enrich JSON data
    const generationId = crypto.randomUUID();
    jsonData.id = generationId;
    if (titleOverride) jsonData.name = titleOverride;
    if (course && !isFlashcard) jsonData.course = course;
    if (level && !isFlashcard) jsonData.level = level;
    if (!jsonData.source) jsonData.source = file.name;

    // Add question IDs if missing
    if (!isFlashcard && jsonData.questions) {
      jsonData.questions = jsonData.questions.map((q: Record<string, unknown>, i: number) => ({
        ...q,
        id: q.id || `q${i + 1}`,
      }));
      if (!jsonData.timeLimit) jsonData.timeLimit = Math.max(10, jsonData.questions.length * 2);
    }

    // Save to Supabase
    const { error: insertError } = await supabase.from('generations').insert({
      id: generationId,
      user_id: user.id,
      type: isFlashcard ? 'flashcard' : 'quiz',
      title: jsonData.name || 'Untitled',
      description: jsonData.description || '',
      source_filename: file.name,
      json_data: jsonData,
      visibility: 'private',
    });

    if (insertError) {
      console.error('Failed to save generation:', insertError);
      return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 });
    }

    // Deduct credit
    await supabase
      .from('user_credits')
      .update({
        credits_balance: credits.credits_balance - 1,
        free_credits_used: credits.free_credits_used + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return NextResponse.json({
      id: generationId,
      type,
      data: jsonData,
      credits_remaining: credits.credits_balance - 1,
    });

  } catch (error) {
    console.error('Error in generate:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}