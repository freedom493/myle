import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Use gemini-2.0-flash for speed and efficiency
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}