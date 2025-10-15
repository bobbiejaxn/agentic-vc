import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export interface StorageUploadResult {
  success: boolean;
  filePath?: string;
  publicUrl?: string;
  error?: string;
}

export interface StorageDownloadResult {
  success: boolean;
  file?: Blob;
  error?: string;
}

export class SupabaseStorageService {
  private getSupabaseClient() {
    // Use available Supabase credentials
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ACCESS_TOKEN ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if we have a real Supabase configuration
    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes("your-project") ||
      supabaseKey.includes("your-anon-key") ||
      supabaseKey.startsWith("sbp_") // Access token format, not service role key
    ) {
      console.warn(
        "Using mock Supabase storage - no valid service role key found"
      );
      console.log(
        "Available key type:",
        supabaseKey?.startsWith("sbp_") ? "Access Token" : "Unknown"
      );
      return null; // Will use mock implementation
    }

    console.log("Using real Supabase storage connection");
    console.log("Supabase URL:", supabaseUrl);
    console.log(
      "Supabase Key (first 20 chars):",
      supabaseKey.substring(0, 20) + "..."
    );

    try {
      return createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.error("Failed to create Supabase client:", error);
      return null;
    }
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    file: File,
    userId: string,
    folder: string = "documents"
  ): Promise<StorageUploadResult> {
    try {
      const supabase = this.getSupabaseClient();

      // If no real Supabase client, use mock implementation
      if (!supabase) {
        console.warn("Using mock Supabase storage for development");
        return this.mockUploadFile(file, userId, folder);
      }

      // Generate unique filename
      const fileExtension = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `${folder}/${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase Storage upload error:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      return {
        success: true,
        filePath: data.path,
        publicUrl: urlData.publicUrl,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Mock file upload for development/testing
   */
  private mockUploadFile(
    file: File,
    userId: string,
    folder: string = "documents"
  ): StorageUploadResult {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${folder}/${userId}/${fileName}`;

    console.log(`Mock upload: ${file.name} -> ${filePath}`);

    return {
      success: true,
      filePath: filePath,
      publicUrl: `https://mock-storage.supabase.co/storage/v1/object/public/documents/${filePath}`,
    };
  }

  /**
   * Download a file from Supabase Storage
   */
  async downloadFile(filePath: string): Promise<StorageDownloadResult> {
    try {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.storage
        .from("documents")
        .download(filePath);

      if (error) {
        console.error("Supabase Storage download error:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        file: data,
      };
    } catch (error) {
      console.error("File download error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      const { error } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (error) {
        console.error("Supabase Storage delete error:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("File delete error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get public URL for a file
   */
  async getPublicUrl(filePath: string): Promise<string> {
    const supabase = this.getSupabaseClient();
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error("Supabase Storage signed URL error:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        url: data.signedUrl,
      };
    } catch (error) {
      console.error("Signed URL error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
