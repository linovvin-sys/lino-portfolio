/**
 * Environment variable validation using Zod.
 * Fails fast at build/startup if required vars are malformed.
 *
 * Every field is preprocessed so an unset/blank env var (which Vercel and
 * other platforms sometimes surface as "" rather than omitting the key
 * entirely) is treated as "not provided" and falls through to .optional()/
 * .default() instead of failing validation (e.g. "" is not a valid URL).
 */

import { z } from "zod";

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("http://localhost:3000"),
  ),

  // AI (optional — the "Ask AI" chat only appears when a key is set)
  GEMINI_API_KEY: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  // Also accepted: the name Google's own SDKs use
  GOOGLE_GENERATIVE_AI_API_KEY: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  // "gemini-flash-latest" always points at Google's current Flash model, so it
  // keeps working when older model versions are retired
  GEMINI_MODEL: z.preprocess(emptyToUndefined, z.string().trim().min(1).default("gemini-flash-latest")),

  // Analytics (optional)
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.preprocess(emptyToUndefined, z.string().optional()),

  // Rate limiting
  CHAT_RATE_LIMIT_PER_MINUTE: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(10),
  ),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();

/** The Gemini key under either accepted name, if configured. */
export const geminiApiKey = env.GEMINI_API_KEY ?? env.GOOGLE_GENERATIVE_AI_API_KEY;
