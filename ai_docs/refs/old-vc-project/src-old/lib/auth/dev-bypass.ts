// Development authentication bypass utilities
// This file should only be used in development environments

export interface DevUser {
  id: string;
  email: string;
  fullName: string;
  role: "angel" | "lp" | "admin";
  isDevUser: true;
}

export const DEV_USERS: Record<string, DevUser> = {
  admin: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "admin@dev.local",
    fullName: "Development Admin",
    role: "admin",
    isDevUser: true,
  },
  angel: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "angel@dev.local",
    fullName: "Development Angel",
    role: "angel",
    isDevUser: true,
  },
  lp: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "lp@dev.local",
    fullName: "Development LP",
    role: "lp",
    isDevUser: true,
  },
  test: {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "test@dev.local",
    fullName: "Test User",
    role: "angel",
    isDevUser: true,
  },
  extracted: {
    id: "7b9ffd5c-9719-414e-bc05-75a13736bf1c",
    email: "extracted@dev.local",
    fullName: "Extracted Data User",
    role: "lp",
    isDevUser: true,
  },
};

export class DevAuthBypass {
  private static isDevelopment(): boolean {
    return (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_DEV_MODE === "true"
    );
  }

  /**
   * Get a development user by key
   */
  static getDevUser(key: keyof typeof DEV_USERS): DevUser | null {
    if (!this.isDevelopment()) {
      return null;
    }
    return DEV_USERS[key] || null;
  }

  /**
   * Get all available development users
   */
  static getAllDevUsers(): DevUser[] {
    if (!this.isDevelopment()) {
      return [];
    }
    return Object.values(DEV_USERS);
  }

  /**
   * Check if a user ID is a development user
   */
  static isDevUser(userId: string): boolean {
    if (!this.isDevelopment()) {
      return false;
    }
    return Object.values(DEV_USERS).some((user) => user.id === userId);
  }

  /**
   * Get development user by ID
   */
  static getDevUserById(userId: string): DevUser | null {
    if (!this.isDevelopment()) {
      return null;
    }
    return Object.values(DEV_USERS).find((user) => user.id === userId) || null;
  }

  /**
   * Create a mock Supabase user object for development
   */
  static createMockSupabaseUser(devUser: DevUser) {
    return {
      id: devUser.id,
      email: devUser.email,
      user_metadata: {
        full_name: devUser.fullName,
        role: devUser.role,
      },
      app_metadata: {
        provider: "dev-bypass",
        providers: ["dev-bypass"],
      },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Get the default development user for testing
   */
  static getDefaultDevUser(): DevUser {
    return DEV_USERS.test;
  }
}

/**
 * Get development user from request headers (for API routes)
 */
export function getDevUser(request: {
  headers: { get: (name: string) => string | null };
}): DevUser | null {
  const devUserId = request.headers.get("x-dev-user-id");
  if (!devUserId) {
    return null;
  }

  return DevAuthBypass.getDevUserById(devUserId);
}

// Re-export for better module resolution
export { DevAuthBypass };
