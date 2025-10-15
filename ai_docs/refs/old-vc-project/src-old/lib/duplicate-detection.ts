import { DocumentService } from "@/lib/database/documents";

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

export class DuplicateDetectionService {
  /**
   * Detect duplicate documents based on various criteria
   */
  static async detectDuplicates(
    userId: string,
    fileName: string,
    fileSize: number,
    contentHash?: string
  ): Promise<DuplicateDetectionResult> {
    try {
      // Get user's existing documents
      const existingDocuments = await DocumentService.getUserDocuments(userId);

      // Check for duplicates based on different criteria
      const duplicates = existingDocuments.filter((doc) => {
        const criteria = {
          fileName: doc.name.toLowerCase() === fileName.toLowerCase(),
          fileSize: doc.fileSize && parseInt(doc.fileSize) === fileSize,
          // Add more sophisticated matching if needed
        };

        // Consider it a duplicate if filename matches (most common case)
        // or if filename and size match
        return criteria.fileName || (criteria.fileName && criteria.fileSize);
      });

      if (duplicates.length === 0) {
        return {
          duplicateDetected: false,
          options: [],
          message: "No duplicates detected. Proceeding with upload.",
        };
      }

      // Get the most recent duplicate
      const mostRecentDuplicate = duplicates.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )[0];

      return {
        duplicateDetected: true,
        options: ["Re-trigger", "Cancel", "Re-trigger and Compare"],
        message: `A duplicate has been detected for document "${fileName}". The most recent version was uploaded on ${new Date(
          mostRecentDuplicate.uploadedAt
        ).toLocaleDateString()}. Please choose an option.`,
        duplicateDocument: {
          id: mostRecentDuplicate.id,
          name: mostRecentDuplicate.name,
          uploadedAt: mostRecentDuplicate.uploadedAt,
          status: mostRecentDuplicate.status,
          extractedData: mostRecentDuplicate.extractedData,
        },
        criteria: {
          fileName: true,
          fileSize: mostRecentDuplicate.fileSize
            ? parseInt(mostRecentDuplicate.fileSize) === fileSize
            : false,
        },
      };
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
   * Handle duplicate resolution based on user choice
   */
  static async handleDuplicate(
    options: DuplicateHandlingOptions,
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
      switch (options.action) {
        case "cancel":
          return {
            success: true,
            action: "cancel",
            message: "Upload cancelled due to duplicate detection.",
          };

        case "retrigger":
          // Delete the existing document and create a new one
          if (options.documentId) {
            await DocumentService.deleteDocument(
              options.documentId,
              options.userId
            );
          }

          // Create new document
          const newDocument = await DocumentService.createDocument(
            options.userId,
            {
              name: newDocumentData.name,
              type: newDocumentData.type,
              fileSize: newDocumentData.fileSize.toString(),
              mimeType: newDocumentData.mimeType,
            }
          );

          return {
            success: true,
            action: "retrigger",
            documentId: newDocument.id,
            message:
              "Document re-triggered successfully. Previous version replaced.",
          };

        case "retrigger_and_compare":
          // Keep existing document and create new one for comparison
          const comparisonDocument = await DocumentService.createDocument(
            options.userId,
            {
              name: `${newDocumentData.name} (Comparison)`,
              type: newDocumentData.type,
              fileSize: newDocumentData.fileSize.toString(),
              mimeType: newDocumentData.mimeType,
            }
          );

          // Get the original document for comparison
          const originalDocument = options.documentId
            ? await DocumentService.getDocumentById(options.documentId)
            : null;

          return {
            success: true,
            action: "retrigger_and_compare",
            documentId: comparisonDocument.id,
            message:
              "New document created for comparison. You can now compare both versions.",
            comparisonData: {
              original: originalDocument,
              new: comparisonDocument,
            },
          };

        default:
          return {
            success: false,
            action: "unknown",
            message: "Unknown action specified.",
          };
      }
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
   * Generate a simple content hash for file comparison
   */
  static async generateContentHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Check if two documents are similar (for more sophisticated duplicate detection)
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
