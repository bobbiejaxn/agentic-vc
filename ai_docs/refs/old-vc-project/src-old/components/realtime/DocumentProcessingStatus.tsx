"use client";

import { useEffect, useState, useCallback } from "react";
import { useWebSocket, WebSocketMessage } from "@/hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DocumentProcessingStatus {
  id: string;
  name: string;
  status: "uploaded" | "processing" | "completed" | "error";
  progress: number;
  message: string;
  timestamp: Date;
  extractedData?: any;
  errorDetails?: string;
}

interface DocumentProcessingStatusProps {
  userId: string;
  documents?: DocumentProcessingStatus[];
  onStatusUpdate?: (
    documentId: string,
    status: DocumentProcessingStatus
  ) => void;
}

export default function DocumentProcessingStatus({
  userId,
  documents = [],
  onStatusUpdate,
}: DocumentProcessingStatusProps) {
  const [processingDocuments, setProcessingDocuments] =
    useState<DocumentProcessingStatus[]>(documents);
  const { isConnected, lastMessage, subscribeToDocuments } = useWebSocket();

  // Subscribe to document updates
  useEffect(() => {
    if (isConnected) {
      subscribeToDocuments(userId);
    }
  }, [isConnected, userId, subscribeToDocuments]);

  // Process document message function - moved outside useEffect to prevent re-creation
  const processDocumentMessage = useCallback(
    (message: WebSocketMessage): DocumentProcessingStatus | null => {
      if (message.type !== "document_processing") return null;

      const data = message.data;
      return {
        id: data.documentId,
        name: data.documentName || "Unknown Document",
        status: data.status,
        progress: data.progress || 0,
        message: data.message || getStatusMessage(data.status),
        timestamp: new Date(message.timestamp),
        extractedData: data.extractedData,
        errorDetails: data.errorDetails,
      };
    },
    []
  ); // No dependencies needed as it only processes the message

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === "document_processing") {
      const documentUpdate = processDocumentMessage(lastMessage);
      if (documentUpdate) {
        setProcessingDocuments((prev) => {
          const existingIndex = prev.findIndex(
            (doc) => doc.id === documentUpdate.id
          );
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = documentUpdate;
            return updated;
          } else {
            return [documentUpdate, ...prev];
          }
        });

        // Notify parent component
        if (onStatusUpdate) {
          onStatusUpdate(documentUpdate.id, documentUpdate);
        }
      }
    }
  }, [lastMessage, onStatusUpdate, processDocumentMessage]);

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case "uploaded":
        return "Document uploaded successfully";
      case "processing":
        return "AI is processing the document...";
      case "completed":
        return "Document processed successfully";
      case "error":
        return "Processing failed";
      default:
        return "Unknown status";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploaded":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "uploaded":
        return "secondary";
      case "processing":
        return "default";
      case "completed":
        return "default";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const activeDocuments = processingDocuments.filter(
    (doc) => doc.status === "uploaded" || doc.status === "processing"
  );

  const completedDocuments = processingDocuments
    .filter((doc) => doc.status === "completed" || doc.status === "error")
    .slice(0, 5); // Show only last 5 completed

  if (processingDocuments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Active Processing Documents */}
      {activeDocuments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              Processing Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {activeDocuments.map((document) => (
                <div key={document.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(document.status)}
                      <span className="font-medium text-sm">
                        {document.name}
                      </span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(document.status)}>
                      {document.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{document.message}</span>
                      <span>{formatTimestamp(document.timestamp)}</span>
                    </div>

                    {document.status === "processing" && (
                      <Progress value={document.progress} className="h-2" />
                    )}

                    {document.status === "error" && document.errorDetails && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {document.errorDetails}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Completed Documents */}
      {completedDocuments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {completedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(document.status)}
                    <div>
                      <span className="text-sm font-medium">
                        {document.name}
                      </span>
                      <p className="text-xs text-gray-600">
                        {document.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={getStatusBadgeVariant(document.status)}
                      className="text-xs"
                    >
                      {document.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(document.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
