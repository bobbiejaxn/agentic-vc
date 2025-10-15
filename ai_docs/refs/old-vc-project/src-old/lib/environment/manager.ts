// Environment Manager - Centralized environment variable management
// Prevents catastrophic failures by validating all required environment variables

import { z } from "zod";

// Environment schema with validation
const EnvironmentSchema = z.object({
  // AI Services
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"),
  ANTHROPIC_API_KEY: z.string().min(1, "Anthropic API key is required"),
  MISTRAL_API_KEY: z.string().min(1, "Mistral API key is required"),
  GEMINI_API_KEY: z.string().min(1, "Gemini API key is required"),
  GOOGLE_API_KEY: z.string().min(1, "Google API key is required"),
  DEEPSEEK_API_KEY: z.string().min(1, "DeepSeek API key is required"),
  COHERE_API_KEY: z.string().min(1, "Cohere API key is required"),

  // Document Processing
  LLAMA_API_KEY: z.string().min(1, "Llama API key is required"),
  LLAMA_CLOUD_API_KEY: z.string().min(1, "Llama Cloud API key is required"),
  LLAMAPARSE_API_KEY: z.string().min(1, "LlamaParse API key is required"),

  // Google Cloud
  GOOGLE_CLOUD_PROJECT: z.string().min(1, "Google Cloud project is required"),

  // Supabase
  SUPABASE_URL: z.string().url("Valid Supabase URL is required"),
  SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_ACCESS_TOKEN: z.string().min(1, "Supabase access token is required"),

  // Search & Data
  FIRECRAWL_API_KEY: z.string().min(1, "Firecrawl API key is required"),
  APIFY_API_TOKEN: z.string().min(1, "Apify API token is required"),
  SERPAPI_KEY: z.string().min(1, "SerpAPI key is required"),
  PERPLEXITY_API_KEY: z.string().min(1, "Perplexity API key is required"),
  EXA_API_KEY: z.string().min(1, "Exa API key is required"),
  VOYAGE_API_KEY: z.string().min(1, "Voyage API key is required"),
  BRAVE_SEARCH_API_KEY: z.string().min(1, "Brave Search API key is required"),

  // Observability
  LOGFIRE_API_KEY: z.string().min(1, "Logfire API key is required"),
  LANGSMITH_API_KEY: z.string().min(1, "LangSmith API key is required"),

  // Other Services
  OPENROUTER_API_KEY: z.string().min(1, "OpenRouter API key is required"),
  UPSTASH_API_KEY: z.string().min(1, "Upstash API key is required"),
  CONTEXT7_API_KEY: z.string().min(1, "Context7 API key is required"),
  GITHUB_TOKEN: z.string().min(1, "GitHub token is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe secret key is required"),
  AUTH_RESEND_KEY: z.string().min(1, "Auth Resend key is required"),
  AUTH_EMAIL: z.string().email("Valid auth email is required"),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

// Environment validation result
export interface EnvironmentValidationResult {
  success: boolean;
  environment?: Environment;
  errors?: Array<{
    key: string;
    message: string;
    severity: "critical" | "warning";
  }>;
  warnings?: string[];
}

// Environment manager class
export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private environment: Environment | null = null;
  private validationResult: EnvironmentValidationResult | null = null;

  private constructor() {}

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  /**
   * Validates and loads environment variables
   * This should be called at application startup
   */
  public validateEnvironment(): EnvironmentValidationResult {
    if (this.validationResult) {
      return this.validationResult;
    }

    const errors: Array<{
      key: string;
      message: string;
      severity: "critical" | "warning";
    }> = [];
    const warnings: string[] = [];

    try {
      // Load environment variables
      const envData = this.loadEnvironmentVariables();

      // Validate against schema
      const result = EnvironmentSchema.safeParse(envData);

      if (result.success) {
        this.environment = result.data;
        this.validationResult = {
          success: true,
          environment: result.data,
          warnings: warnings.length > 0 ? warnings : undefined,
        };
      } else {
        // Transform Zod errors to our format
        result.error.errors.forEach((error) => {
          errors.push({
            key: error.path.join("."),
            message: error.message,
            severity: "critical",
          });
        });

        this.validationResult = {
          success: false,
          errors,
          warnings: warnings.length > 0 ? warnings : undefined,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errors.push({
        key: "environment",
        message: `Environment validation failed: ${errorMessage}`,
        severity: "critical",
      });

      this.validationResult = {
        success: false,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    }

    return this.validationResult;
  }

  /**
   * Gets a validated environment variable
   * Throws an error if environment is not validated or variable is missing
   */
  public getEnvVar<K extends keyof Environment>(key: K): Environment[K] {
    if (!this.environment) {
      throw new Error(
        "Environment not validated. Call validateEnvironment() first."
      );
    }

    const value = this.environment[key];
    if (value === undefined || value === null) {
      throw new Error(
        `Environment variable ${key} is not set or is null/undefined`
      );
    }

    return value;
  }

  /**
   * Gets a validated environment variable with fallback
   */
  public getEnvVarWithFallback<K extends keyof Environment>(
    key: K,
    fallback: Environment[K]
  ): Environment[K] {
    try {
      return this.getEnvVar(key);
    } catch {
      return fallback;
    }
  }

  /**
   * Checks if environment is valid
   */
  public isEnvironmentValid(): boolean {
    return this.validationResult?.success === true;
  }

  /**
   * Gets validation result
   */
  public getValidationResult(): EnvironmentValidationResult | null {
    return this.validationResult;
  }

  /**
   * Loads environment variables from process.env
   */
  private loadEnvironmentVariables(): Record<string, string> {
    const envData: Record<string, string> = {};

    // List of required environment variables
    const requiredVars = [
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "MISTRAL_API_KEY",
      "GEMINI_API_KEY",
      "GOOGLE_API_KEY",
      "DEEPSEEK_API_KEY",
      "COHERE_API_KEY",
      "LLAMA_API_KEY",
      "LLAMA_CLOUD_API_KEY",
      "LLAMAPARSE_API_KEY",
      "GOOGLE_CLOUD_PROJECT",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_ACCESS_TOKEN",
      "FIRECRAWL_API_KEY",
      "APIFY_API_TOKEN",
      "SERPAPI_KEY",
      "PERPLEXITY_API_KEY",
      "EXA_API_KEY",
      "VOYAGE_API_KEY",
      "BRAVE_SEARCH_API_KEY",
      "LOGFIRE_API_KEY",
      "LANGSMITH_API_KEY",
      "OPENROUTER_API_KEY",
      "UPSTASH_API_KEY",
      "CONTEXT7_API_KEY",
      "GITHUB_TOKEN",
      "STRIPE_SECRET_KEY",
      "AUTH_RESEND_KEY",
      "AUTH_EMAIL",
    ];

    // Load from process.env
    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (value !== undefined) {
        envData[varName] = value;
      }
    }

    return envData;
  }

  /**
   * Health check for environment variables
   */
  public async healthCheck(): Promise<{
    success: boolean;
    details: Array<{
      service: string;
      status: "healthy" | "unhealthy" | "unknown";
      message: string;
    }>;
  }> {
    if (!this.isEnvironmentValid()) {
      return {
        success: false,
        details: [
          {
            service: "environment",
            status: "unhealthy",
            message: "Environment validation failed",
          },
        ],
      };
    }

    const details: Array<{
      service: string;
      status: "healthy" | "unhealthy" | "unknown";
      message: string;
    }> = [];

    // Test API key formats (basic validation)
    const apiKeyTests = [
      { name: "OpenAI", key: "OPENAI_API_KEY", pattern: /^sk-/ },
      { name: "Anthropic", key: "ANTHROPIC_API_KEY", pattern: /^sk-ant-/ },
      { name: "Mistral", key: "MISTRAL_API_KEY", pattern: /^[a-zA-Z0-9]{32}$/ },
      { name: "Gemini", key: "GEMINI_API_KEY", pattern: /^AIza/ },
      { name: "Google", key: "GOOGLE_API_KEY", pattern: /^AIza/ },
      { name: "Llama", key: "LLAMA_CLOUD_API_KEY", pattern: /^llx-/ },
      {
        name: "Supabase URL",
        key: "SUPABASE_URL",
        pattern: /^https:\/\/.*\.supabase\.co/,
      },
    ];

    for (const test of apiKeyTests) {
      try {
        const value = this.getEnvVar(test.key as keyof Environment);
        if (test.pattern.test(value)) {
          details.push({
            service: test.name,
            status: "healthy",
            message: "API key format is valid",
          });
        } else {
          details.push({
            service: test.name,
            status: "unhealthy",
            message: "API key format is invalid",
          });
        }
      } catch {
        details.push({
          service: test.name,
          status: "unhealthy",
          message: "API key is missing",
        });
      }
    }

    const healthyCount = details.filter((d) => d.status === "healthy").length;
    const totalCount = details.length;

    return {
      success: healthyCount === totalCount,
      details,
    };
  }
}

// Singleton instance
export const environmentManager = EnvironmentManager.getInstance();

// Convenience functions
export function getEnvVar<K extends keyof Environment>(key: K): Environment[K] {
  return environmentManager.getEnvVar(key);
}

export function getEnvVarWithFallback<K extends keyof Environment>(
  key: K,
  fallback: Environment[K]
): Environment[K] {
  return environmentManager.getEnvVarWithFallback(key, fallback);
}

export function validateEnvironment(): EnvironmentValidationResult {
  return environmentManager.validateEnvironment();
}

export function isEnvironmentValid(): boolean {
  return environmentManager.isEnvironmentValid();
}
