import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper to check if we need Google Cloud auth
// (Currently not used but kept for future reference)

export const env = createEnv({
  server: {
    // Convex
    CONVEX_DEPLOYMENT: z.string().min(1).optional(),
    NEXT_PUBLIC_CONVEX_URL: z.string().url().optional(),

    // AI Services
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    MISTRAL_API_KEY: z.string().min(1).optional(),
    GEMINI_API_KEY: z.string().min(1).optional(),
    GOOGLE_API_KEY: z.string().min(1).optional(),

    // Google Cloud
    GOOGLE_CLOUD_PROJECT: z.string().min(1).optional(),

    // ADK
    ADK_URL: z.string().url().optional(),

    // Auth
    AUTH_RESEND_KEY: z.string().min(1).optional(),
    AUTH_EMAIL: z.string().email().optional(),

    // Legacy (for compatibility - not used with Convex)
    DATABASE_URL: z.string().url().optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_ANON_KEY: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  },
  runtimeEnv: {
    // Server variables
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
    ADK_URL: process.env.ADK_URL,
    AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
    AUTH_EMAIL: process.env.AUTH_EMAIL,

    // Legacy (optional)
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64,

    // Client variables
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
