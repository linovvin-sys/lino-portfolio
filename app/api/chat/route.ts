import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { APICallError, streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchPortfolio } from '@/lib/rag';
import { profile } from '@/content/profile';
import { env, geminiApiKey } from '@/lib/env';

export const runtime = 'nodejs';

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'anonymous';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now >= entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= env.CHAT_RATE_LIMIT_PER_MINUTE) return true;

  entry.count++;
  return false;
}

/**
 * Turn a Gemini failure into a message a visitor (and the site owner) can act on.
 * Google's error text never contains the key itself, so it's safe to surface.
 */
function describeError(error: unknown): string {
  const status = APICallError.isInstance(error) ? error.statusCode : undefined;
  const message = error instanceof Error ? error.message : String(error);
  const text = message.toLowerCase();

  if (text.includes('api key not valid') || text.includes('api_key_invalid')) {
    return 'The Gemini API key was rejected. Check GEMINI_API_KEY in Vercel, then redeploy.';
  }
  if (status === 404 || text.includes('not found') || text.includes('is not supported')) {
    return `The Gemini model "${env.GEMINI_MODEL}" isn't available for this key. Set GEMINI_MODEL in Vercel (for example gemini-flash-latest), then redeploy.`;
  }
  if (status === 429 || text.includes('quota') || text.includes('resource_exhausted')) {
    return "Gemini's rate limit or free quota was reached. Try again in a minute.";
  }
  if (status === 403 || text.includes('permission')) {
    return "This key doesn't have access to the Gemini API. Make sure it was created in Google AI Studio.";
  }
  return `Gemini returned an error${status ? ` (${status})` : ''}: ${message.slice(0, 180)}`;
}

/** GET /api/chat: whether the chat is configured and which model it uses (never the key). */
export function GET() {
  return NextResponse.json({ configured: Boolean(geminiApiKey), model: env.GEMINI_MODEL });
}

export async function POST(req: NextRequest) {
  if (!geminiApiKey) {
    return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again in a minute.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { messages } = parsed.data;
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const sources = latestUserMessage ? searchPortfolio(latestUserMessage.content) : [];

  const contextBlock = sources.length
    ? sources.map((s, i) => `[${i + 1}] ${s.title} (${s.section}): ${s.excerpt}`).join('\n')
    : 'No directly relevant context was found in the portfolio content.';

  const systemPrompt = `You are the portfolio assistant for ${profile.name}, ${profile.title}. Answer questions about their work, experience, and projects using ONLY the context below. Be concise and specific. When you use a fact from the context, cite it inline like [1]. If the context doesn't cover the question, say so plainly instead of guessing.

Context:
${contextBlock}`;

  try {
    const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
    const result = streamText({
      model: google(env.GEMINI_MODEL),
      system: systemPrompt,
      messages,
      maxTokens: 500,
      // Shows up in Vercel → Logs, with the full error from Google
      onError: ({ error }) => console.error('[chat] Gemini request failed:', error),
    });

    const response = result.toDataStreamResponse({ getErrorMessage: describeError });
    // Header values must be ASCII: escape anything else (e.g. curly quotes) as \uXXXX, which JSON.parse restores
    const sourcesJson = JSON.stringify(sources.map((s) => ({ title: s.title, url: s.url }))).replace(
      /[^\x20-\x7e]/g,
      (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
    response.headers.set('X-Chat-Sources', sourcesJson);
    response.headers.set('X-Chat-Model', env.GEMINI_MODEL);
    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'An error occurred during chat.' }, { status: 500 });
  }
}
