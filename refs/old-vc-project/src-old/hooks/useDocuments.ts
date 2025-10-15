import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DocumentSummary } from "@/lib/types/documents";

export interface DocumentData {
  documents: DocumentSummary[];
  loading: boolean;
  error: string | null;
}

export function useDocuments() {
  const [data, setData] = useState<DocumentData>({
    documents: [],
    loading: true,
    error: null,
  });

  const supabase = createClientComponentClient();

  const fetchDocuments = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Get user for authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/documents", {
        headers: {
          "x-dev-user-id": user.id,
        },
      });
      const result = await response.json();

      if (result.success && result.data) {
        setData({
          documents: result.data,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(result.error || "Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch documents",
      }));
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Refresh documents after deletion
        await fetchDocuments();
        return true;
      } else {
        throw new Error(result.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };

  const retriggerDocument = async (documentId: string) => {
    try {
      const response = await fetch("/api/documents/retrigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh documents after retrigger
        await fetchDocuments();
        return result.data;
      } else {
        throw new Error(result.error || "Failed to retrigger document");
      }
    } catch (error) {
      console.error("Error retriggering document:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    ...data,
    refetch: fetchDocuments,
    deleteDocument,
    retriggerDocument,
  };
}
