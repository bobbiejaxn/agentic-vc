// Client-safe duplicate detection service that only makes API calls
// This avoids importing server-side database modules in client components

export interface DuplicateDetectionResult {
  duplicateDetected: boolean;
  options: string[];
  message: string;
  duplicateDocument?: {
    id: string;
    name: string;
    uploadedAt: Date;
    status: string;
    extractedData?: any;
  };
  criteria?: {
    fileName?: boolean;
    fileSize?: boolean;
    contentHash?: boolean;
    uploadDate?: boolean;
  };
}

export interface DuplicateHandlingOptions {
  action: "retrigger" | "cancel" | "retrigger_and_compare";
  documentId?: string;
  userId: string;
}

export class DuplicateDetectionClientService {
  /**
   * Detect duplicate documents by calling the API
   */
  static async detectDuplicates(
    fileName: string,
    fileSize: number,
    contentHash?: string,
    devUserId?: string
  ): Promise<DuplicateDetectionResult> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add dev user ID header if provided
      if (devUserId) {
        headers["x-dev-user-id"] = devUserId;
      }

      const response = await fetch("/api/documents/check-duplicates", {
        method: "POST",
        headers,
        body: JSON.stringify({
          fileName,
          fileSize,
          contentHash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to check for duplicates");
      }

      return result.data;
    } catch (error) {
      console.error("Error detecting duplicates:", error);
      return {
        duplicateDetected: false,
        options: [],
        message: "Error detecting duplicates. Proceeding with upload.",
      };
    }
  }

  /**
   * Handle duplicate resolution by calling the API
   */
  static async handleDuplicate(
    action: "retrigger" | "cancel" | "retrigger_and_compare",
    documentId: string | undefined,
    newDocumentData: {
      name: string;
      type: string;
      fileSize: number;
      mimeType: string;
      file: File;
    }
  ): Promise<{
    success: boolean;
    action: string;
    documentId?: string;
    message: string;
    comparisonData?: any;
  }> {
    try {
      const response = await fetch("/api/documents/handle-duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          documentId,
          newDocumentData: {
            name: newDocumentData.name,
            type: newDocumentData.type,
            fileSize: newDocumentData.fileSize,
            mimeType: newDocumentData.mimeType,
            // Don't send the actual file here - it will be handled separately
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to handle duplicate");
      }

      return result.data;
    } catch (error) {
      console.error("Error handling duplicate:", error);
      return {
        success: false,
        action: "error",
        message: "Error handling duplicate: " + (error as Error).message,
      };
    }
  }

  /**
   * Generate a simple content hash for file comparison (client-side)
   */
  static async generateContentHash(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (error) {
      console.error("Error generating content hash:", error);
      return "";
    }
  }

  /**
   * Check if two documents are similar (client-side comparison)
   */
  static areDocumentsSimilar(
    doc1: { name: string; fileSize?: string; extractedData?: any },
    doc2: { name: string; fileSize?: string; extractedData?: any }
  ): boolean {
    // Simple similarity check based on name and size
    const nameSimilarity =
      doc1.name.toLowerCase().includes(doc2.name.toLowerCase()) ||
      doc2.name.toLowerCase().includes(doc1.name.toLowerCase());

    const sizeSimilarity =
      doc1.fileSize &&
      doc2.fileSize &&
      Math.abs(parseInt(doc1.fileSize) - parseInt(doc2.fileSize)) < 1000; // Within 1KB

    return nameSimilarity && sizeSimilarity;
  }
}
