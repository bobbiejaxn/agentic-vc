// Supabase Configuration Manager
// Handles Supabase configuration with fallbacks for development

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  accessToken?: string;
  isConfigured: boolean;
  source: "environment" | "fallback" | "mock";
}

export class SupabaseConfigManager {
  private static instance: SupabaseConfigManager;
  private config: SupabaseConfig | null = null;

  private constructor() {}

  public static getInstance(): SupabaseConfigManager {
    if (!SupabaseConfigManager.instance) {
      SupabaseConfigManager.instance = new SupabaseConfigManager();
    }
    return SupabaseConfigManager.instance;
  }

  /**
   * Gets Supabase configuration with fallbacks
   */
  public getConfig(): SupabaseConfig {
    if (this.config) {
      return this.config;
    }

    // Try to get from environment variables
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN;

    if (supabaseUrl && supabaseAnonKey) {
      this.config = {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        accessToken: supabaseAccessToken,
        isConfigured: true,
        source: "environment",
      };
    } else {
      // Use fallback configuration for development
      this.config = this.getFallbackConfig();
    }

    return this.config;
  }

  /**
   * Gets fallback configuration for development
   */
  private getFallbackConfig(): SupabaseConfig {
    // For development, we can use a mock or local Supabase instance
    const fallbackUrl = "https://your-project.supabase.co";
    const fallbackAnonKey = "your-anon-key-here";

    console.warn(
      "⚠️  Supabase configuration not found in environment variables"
    );
    console.warn("   Using fallback configuration for development");
    console.warn(
      "   Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file"
    );

    return {
      url: fallbackUrl,
      anonKey: fallbackAnonKey,
      isConfigured: false,
      source: "fallback",
    };
  }

  /**
   * Validates Supabase configuration
   */
  public validateConfig(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const config = this.getConfig();
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.isConfigured) {
      errors.push("Supabase is not properly configured");
    }

    if (config.source === "fallback") {
      warnings.push("Using fallback Supabase configuration");
    }

    if (!config.url.startsWith("https://")) {
      errors.push("Supabase URL must use HTTPS");
    }

    if (!config.url.includes("supabase.co")) {
      warnings.push("Supabase URL doesn't appear to be a valid Supabase URL");
    }

    if (config.anonKey.length < 20) {
      errors.push("Supabase anon key appears to be too short");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Gets configuration for Supabase client
   */
  public getClientConfig() {
    const config = this.getConfig();
    return {
      url: config.url,
      anonKey: config.anonKey,
    };
  }

  /**
   * Resets configuration (useful for testing)
   */
  public reset(): void {
    this.config = null;
  }
}

// Singleton instance
export const supabaseConfigManager = SupabaseConfigManager.getInstance();

// Convenience functions
export function getSupabaseConfig(): SupabaseConfig {
  return supabaseConfigManager.getConfig();
}

export function validateSupabaseConfig() {
  return supabaseConfigManager.validateConfig();
}

export function getSupabaseClientConfig() {
  return supabaseConfigManager.getClientConfig();
}
