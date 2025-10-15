"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataValidationAlert } from "./DataValidationAlert";
import { useDevAuth } from "@/hooks/useDevAuth";
import { Loader2, FileText, Calendar, Database } from "lucide-react";

interface DocumentDetailModalProps {
  documentId: string;
  onClose: () => void;
}

/**
 * Generic modal for displaying detailed document information
 * Works with any document type (fund reports, health records, etc.)
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
export function DocumentDetailModal({
  documentId,
  onClose,
}: DocumentDetailModalProps) {
  const [documentData, setDocumentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { devUser } = useDevAuth();

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare dev auth headers
        const devAuthHeaders: Record<string, string> = devUser
          ? {
              "x-dev-user-id": devUser.id,
            }
          : {};

        // Fetch document data directly
        const response = await fetch(`/api/documents/${documentId}`, {
          headers: devAuthHeaders,
        });
        const documentResult = await response.json();

        if (documentResult.success) {
          setDocumentData(documentResult.data);
        } else {
          setError("Document not found");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [documentId, devUser]);

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading document...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Error Loading Document
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{error}</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!documentData) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Document Not Found
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              The requested document could not be found.
            </p>
            <div className="mt-4 flex justify-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {documentData.name || "Document Details"}
          </DialogTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline" className="text-xs">
              {documentData.type || "Unknown Type"}
            </Badge>
            <Badge
              variant={
                documentData.status === "completed" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {documentData.status || "Unknown Status"}
            </Badge>
            <span>•</span>
            <span>{new Date(documentData.createdAt).toLocaleDateString()}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">File Size</div>
                  <div className="font-mono font-medium text-gray-900">
                    {documentData.fileSize
                      ? `${(
                          parseInt(documentData.fileSize) /
                          1024 /
                          1024
                        ).toFixed(2)} MB`
                      : "Unknown"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">MIME Type</div>
                  <div className="font-mono font-medium text-gray-900">
                    {documentData.mimeType || "Unknown"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Processing Method</div>
                  <div className="font-mono font-medium text-gray-900">
                    {documentData.extractedData?.processingMethod || "Unknown"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Confidence</div>
                  <div className="font-mono font-medium text-gray-900">
                    {documentData.extractedData?.confidence
                      ? `${(
                          documentData.extractedData.confidence * 100
                        ).toFixed(1)}%`
                      : "Unknown"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Data */}
          {documentData.extractedData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Extracted Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show validation results if available */}
                  {documentData.extractedData.validationResults && (
                    <div className="bg-yellow-50 border border-yellow-200  p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        Data Validation
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Validation results are available for this document.
                      </p>
                    </div>
                  )}

                  {/* Display extracted data based on document type */}
                  {documentData.type === "fund_report" && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Fund Metrics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {documentData.extractedData.fundSize && (
                          <div>
                            <div className="text-sm text-gray-500">
                              Fund Size
                            </div>
                            <div className="font-mono font-medium text-gray-900">
                              €
                              {documentData.extractedData.fundSize.toLocaleString()}
                            </div>
                          </div>
                        )}
                        {documentData.extractedData.fundNAV && (
                          <div>
                            <div className="text-sm text-gray-500">
                              Fund NAV
                            </div>
                            <div className="font-mono font-medium text-gray-900">
                              €
                              {documentData.extractedData.fundNAV.toLocaleString()}
                            </div>
                          </div>
                        )}
                        {documentData.extractedData.irr && (
                          <div>
                            <div className="text-sm text-gray-500">IRR</div>
                            <div className="font-mono font-medium text-gray-900">
                              {documentData.extractedData.irr.toFixed(2)}%
                            </div>
                          </div>
                        )}
                        {documentData.extractedData.moic && (
                          <div>
                            <div className="text-sm text-gray-500">MOIC</div>
                            <div className="font-mono font-medium text-gray-900">
                              {documentData.extractedData.moic.toFixed(2)}x
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Generic data display for other document types */}
                  {documentData.type !== "fund_report" && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Extracted Information
                      </h4>
                      <div className="bg-gray-50 p-4 ">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(documentData.extractedData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Raw text if available */}
                  {documentData.extractedData.rawText && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Raw Text</h4>
                      <div className="bg-gray-50 p-4  max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-700">
                          {documentData.extractedData.rawText.substring(0, 500)}
                          {documentData.extractedData.rawText.length > 500 &&
                            "..."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Processing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="font-mono font-medium text-gray-900">
                    {new Date(documentData.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Updated</div>
                  <div className="font-mono font-medium text-gray-900">
                    {new Date(documentData.updatedAt).toLocaleString()}
                  </div>
                </div>
                {documentData.extractedData?.processingTime && (
                  <div>
                    <div className="text-sm text-gray-500">Processing Time</div>
                    <div className="font-mono font-medium text-gray-900">
                      {documentData.extractedData.processingTime}ms
                    </div>
                  </div>
                )}
                {documentData.extractedData?.pageCount && (
                  <div>
                    <div className="text-sm text-gray-500">Pages</div>
                    <div className="font-mono font-medium text-gray-900">
                      {documentData.extractedData.pageCount}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
