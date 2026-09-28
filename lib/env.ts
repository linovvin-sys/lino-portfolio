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

  // AI (optional — chat feature degrades gracefully)
  ANTHROPIC_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),

  // Email (optional — contact form degrades gracefully)
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CONTACT_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),

  // Analytics (optional)
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.preprocess(emptyToUndefined, z.string().optional()),

  // Rate limiting
  CHAT_RATE_LIMIT_PER_MINUTE: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(10),
  ),
  CONTACT_RATE_LIMIT_PER_HOUR: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(5),
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
