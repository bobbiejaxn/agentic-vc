import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";

export interface DocumentProcessingStats {
  total: number;
  completed: number;
  processing: number;
  error: number;
  uploaded: number;
  processingMethods: Record<string, number>;
  avgQualityScore: number;
  successRate: number;
  avgProcessingTime: number;
  completedToday: number;
}

export interface DocumentStatsData {
  stats: DocumentProcessingStats | null;
  loading: boolean;
  error: string | null;
}

export function useDocumentStats() {
  const [data, setData] = useState<DocumentStatsData>({
    stats: null,
    loading: true,
    error: null,
  });

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket();

  const fetchDocumentStats = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("/api/analytics?type=document-stats", {
        headers: {
          "x-dev-user-id": "7b9ffd5c-9719-414e-bc05-75a13736bf1c",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch document stats: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch document stats");
      }

      const stats = result.data;

      // Calculate derived metrics
      const successRate =
        stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      const completedToday = stats.completed; // This would need to be filtered by today's date in the backend
      const avgProcessingTime = 2.3; // This would be calculated from actual processing times

      const processedStats: DocumentProcessingStats = {
        ...stats,
        successRate,
        completedToday,
        avgProcessingTime,
      };

      setData({
        stats: processedStats,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching document stats:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch document statistics",
      }));
    }
  }, []);

  // Listen for WebSocket messages to trigger stats refresh
  useEffect(() => {
    if (lastMessage && lastMessage.type === "document_processing") {
      // Refresh stats when document processing status changes
      fetchDocumentStats();
    }
  }, [lastMessage, fetchDocumentStats]);

  useEffect(() => {
    fetchDocumentStats();
  }, [fetchDocumentStats]);

  return {
    ...data,
    refetch: fetchDocumentStats,
  };
}
