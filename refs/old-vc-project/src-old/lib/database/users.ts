import { createClient } from "@supabase/supabase-js";

// Use Supabase client instead of Drizzle for now
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  role: "angel" | "lp" | "co_investor" | "fund_manager" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  /**
   * Ensure user exists in database, create if not
   */
  static async ensureUserExists(
    userId: string,
    userData: {
      email: string;
      fullName: string;
      role: "angel" | "lp" | "co_investor" | "fund_manager" | "admin";
    }
  ): Promise<UserSummary> {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (existingUser && !fetchError) {
      return {
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.full_name,
        role: existingUser.role,
        createdAt: new Date(existingUser.created_at),
        updatedAt: new Date(existingUser.updated_at),
      };
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: userData.email,
        full_name: userData.fullName,
        role: userData.role,
      })
      .select()
      .single();

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      role: newUser.role,
      createdAt: new Date(newUser.created_at),
      updatedAt: new Date(newUser.updated_at),
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserSummary | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // User not found
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Update user
   */
  static async updateUser(
    userId: string,
    updates: Partial<{
      email: string;
      fullName: string;
      role: "angel" | "lp" | "co_investor" | "fund_manager" | "admin";
    }>
  ): Promise<UserSummary> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.email) updateData.email = updates.email;
    if (updates.fullName) updateData.full_name = updates.fullName;
    if (updates.role) updateData.role = updates.role;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
