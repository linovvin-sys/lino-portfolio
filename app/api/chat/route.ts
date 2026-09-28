import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchPortfolio } from '@/lib/rag';
import { profile } from '@/content/profile';
import { env } from '@/lib/env';

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

export async function POST(req: NextRequest) {
  if (!env.ANTHROPIC_API_KEY) {
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
    const result = streamText({
      model: anthropic('claude-3-5-haiku-20241022'),
      system: systemPrompt,
      messages,
      maxTokens: 500,
    });

    const response = result.toDataStreamResponse();
    response.headers.set('X-Chat-Sources', JSON.stringify(sources.map((s) => ({ title: s.title, url: s.url }))));
    response.headers.set('X-Chat-Model', 'claude-3-5-haiku-20241022');
    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'An error occurred during chat.' }, { status: 500 });
  }
}
