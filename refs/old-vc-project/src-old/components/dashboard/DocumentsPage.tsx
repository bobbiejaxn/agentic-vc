"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AppLayout } from "./AppLayout";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentStats } from "@/hooks/useDocumentStats";
import { useDevAuth } from "@/hooks/useDevAuth";
import { EnhancedProcessingTimeline } from "./EnhancedProcessingTimeline";
import { DuplicateHandler } from "@/components/duplicate-handler/DuplicateHandler";
import type { DuplicateDetectionResult } from "@/lib/duplicate-detection-client";

/**
 * Document processing and reports page
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
export function DocumentsPage() {
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("fund_report");
  const [ownershipPercentage, setOwnershipPercentage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null
  );
  const [retriggeringDocumentId, setRetriggeringDocumentId] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Duplicate handling state
  const [duplicateResult, setDuplicateResult] =
    useState<DuplicateDetectionResult | null>(null);
  const [showDuplicateHandler, setShowDuplicateHandler] = useState(false);
  const [currentFileBeingProcessed, setCurrentFileBeingProcessed] =
    useState<File | null>(null);
  const [duplicateProcessing, setDuplicateProcessing] = useState(false);

  // Prevent SSR issues by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use analytics hook for real data - ALWAYS call hooks in the same order
  const analytics = useAnalytics();
  const { documents, loading, error, deleteDocument, retriggerDocument } =
    useDocuments();
  const {
    stats: documentStats,
    loading: statsLoading,
    error: statsError,
  } = useDocumentStats();
  const { user } = useDevAuth();

  // Show loading state during SSR
  if (!mounted) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </AppLayout>
    );
  }

  // Handle duplicate actions
  const handleDuplicateAction = async (
    action: "retrigger" | "cancel" | "retrigger_and_compare"
  ) => {
    if (!duplicateResult || !currentFileBeingProcessed) return;

    setDuplicateProcessing(true);

    try {
      if (action === "cancel") {
        setShowDuplicateHandler(false);
        setDuplicateResult(null);
        setCurrentFileBeingProcessed(null);
        setDuplicateProcessing(false);
        return;
      }

      if (action === "retrigger" || action === "retrigger_and_compare") {
        // Handle the duplicate action via API
        const handleResponse = await fetch("/api/documents/handle-duplicate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-dev-user-id": "7b9ffd5c-9719-414e-bc05-75a13736bf1c",
          },
          body: JSON.stringify({
            action,
            documentId: duplicateResult.duplicateDocument?.id,
            newDocumentData: {
              name: currentFileBeingProcessed.name,
              type: documentType,
              fileSize: currentFileBeingProcessed.size,
              mimeType: currentFileBeingProcessed.type,
            },
          }),
        });

        if (handleResponse.ok) {
          const handleResult = await handleResponse.json();

          if (handleResult.success) {
            if (action === "retrigger_and_compare") {
              // Show success message for comparison creation
              setErrorMessage(
                `New document created for comparison. Document ID: ${handleResult.data.documentId}`
              );
              setUploadStatus("success");

              // Close the modal and reset state
              setShowDuplicateHandler(false);
              setDuplicateResult(null);
              setCurrentFileBeingProcessed(null);
              setSelectedFiles([]);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            } else {
              // For retrigger, we need to process the file without duplicate checking
              setShowDuplicateHandler(false);
              setDuplicateResult(null);
              setCurrentFileBeingProcessed(null);

              // Process the file directly without duplicate checking
              await processFileDirectly(currentFileBeingProcessed);
              return;
            }
          } else {
            setErrorMessage(
              handleResult.data.message || "Failed to handle duplicate"
            );
            setUploadStatus("error");
          }
        } else {
          setErrorMessage("Failed to handle duplicate action");
          setUploadStatus("error");
        }
      }
    } catch (error) {
      console.error("Error handling duplicate action:", error);
      setErrorMessage("Error handling duplicate action");
      setUploadStatus("error");
    } finally {
      setDuplicateProcessing(false);
    }
  };

  const handleDuplicateClose = () => {
    setShowDuplicateHandler(false);
    setDuplicateResult(null);
    setCurrentFileBeingProcessed(null);
    setDuplicateProcessing(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Client-side file type validation
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setErrorMessage(
        `Invalid file types: ${invalidFiles
          .map((f) => f.name)
          .join(", ")}. Only PDF, Excel, and Word documents are allowed.`
      );
      setSelectedFiles([]);
      setUploadStatus("idle");
      return;
    }

    setSelectedFiles(files);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingDocumentId(documentId);
      await deleteDocument(documentId);
    } catch (error) {
      console.error("Error deleting document:", error);
      setErrorMessage("Failed to delete document. Please try again.");
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const handleRetriggerDocument = async (documentId: string) => {
    if (
      !confirm(
        "Are you sure you want to retrigger processing for this document? This will reprocess the document with the latest AI models."
      )
    ) {
      return;
    }

    try {
      setRetriggeringDocumentId(documentId);
      await retriggerDocument(documentId);
      setUploadStatus("success");
      setErrorMessage("");
    } catch (error) {
      console.error("Error retriggering document:", error);
      setErrorMessage("Failed to retrigger document. Please try again.");
      setUploadStatus("error");
    } finally {
      setRetriggeringDocumentId(null);
    }
  };

  const processFileDirectly = async (file: File) => {
    setUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      if (ownershipPercentage) {
        formData.append("ownershipPercentage", ownershipPercentage);
      }

      const response = await fetch("/api/documents/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      setUploadStatus("success");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select at least one file to upload");
      setUploadStatus("error");
      return;
    }

    setUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      // Process each file
      for (const file of selectedFiles) {
        // Check for duplicates first
        const duplicateCheck = await fetch("/api/documents/check-duplicates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-dev-user-id": "7b9ffd5c-9719-414e-bc05-75a13736bf1c",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
          }),
        });

        if (duplicateCheck.ok) {
          const duplicateResult = await duplicateCheck.json();

          if (duplicateResult.data.duplicateDetected) {
            // Show duplicate handler UI
            setDuplicateResult(duplicateResult.data);
            setCurrentFileBeingProcessed(file);
            setShowDuplicateHandler(true);
            setUploading(false);
            return; // Stop processing other files until user decides
          }
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);
        if (ownershipPercentage) {
          formData.append("ownershipPercentage", ownershipPercentage);
        }

        const response = await fetch("/api/documents/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();
        console.log("Upload successful:", result);
      }

      setUploadStatus("success");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            Document Processing
          </h1>
          <p className="text-gray-600">
            Upload and process fund reports, due diligence documents, and
            investment updates
          </p>
        </div>

        {/* Upload Section */}
        <Card
          className="scandinavian-card"
          role="region"
          aria-labelledby="upload-section-title"
        >
          <CardHeader>
            <CardTitle
              id="upload-section-title"
              className="text-lg font-medium text-gray-900 tracking-tight"
            >
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 scandinavian-gap">
            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="document-type"
                className="text-sm font-medium text-gray-700"
              >
                Document Type
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger
                  className="scandinavian-button"
                  aria-label="Select document type for processing"
                  suppressHydrationWarning
                >
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fund_report">Fund Report</SelectItem>
                  <SelectItem value="cap_table">Cap Table</SelectItem>
                  <SelectItem value="financial_statement">
                    Financial Statement
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ownership Percentage Input */}
            <div className="space-y-2">
              <Label
                htmlFor="ownership-percentage"
                className="text-sm font-medium text-gray-700"
              >
                Your Ownership Percentage (Optional)
              </Label>
              <Input
                id="ownership-percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 2.5"
                value={ownershipPercentage}
                onChange={(e) => setOwnershipPercentage(e.target.value)}
                className="scandinavian-input"
                aria-describedby="ownership-help"
                suppressHydrationWarning
              />
              <p id="ownership-help" className="text-xs text-gray-500">
                Enter your ownership percentage in the fund (0-100%) to
                calculate personal metrics
              </p>
            </div>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-200  p-8 text-center hover:border-gray-300 transition-colors"
              role="button"
              tabIndex={0}
              aria-label="File upload area. Click to select files or drag and drop files here."
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
            >
              <Upload
                className="mx-auto h-12 w-12 text-gray-400"
                aria-hidden="true"
              />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">
                    Choose files or drag and drop
                  </span>
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xlsx,.xls"
                    onChange={handleFileSelect}
                    aria-describedby="file-upload-help"
                  />
                </Label>
                <p id="file-upload-help" className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, XLS, XLSX up to 10MB each
                </p>
              </div>
            </div>

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4
                  id="selected-files-heading"
                  className="text-sm font-medium text-gray-700"
                >
                  Selected Files
                </h4>
                <div
                  className="space-y-1"
                  role="list"
                  aria-labelledby="selected-files-heading"
                >
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      role="listitem"
                      aria-label={`File: ${file.name}, Size: ${(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText
                          className="h-4 w-4 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-900">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Messages */}
            {uploadStatus === "success" && (
              <div
                className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md"
                role="alert"
                aria-live="polite"
              >
                <CheckCircle
                  className="h-4 w-4 text-green-600"
                  aria-hidden="true"
                />
                <span className="text-sm text-green-800">
                  Files uploaded successfully!
                </span>
              </div>
            )}

            {uploadStatus === "error" && (
              <div
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle
                  className="h-4 w-4 text-red-600"
                  aria-hidden="true"
                />
                <span className="text-sm text-red-800">{errorMessage}</span>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="w-full scandinavian-button"
              aria-label={
                uploading
                  ? "Processing documents, please wait"
                  : `Upload ${
                      selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""
                    }documents`
              }
            >
              {uploading
                ? "Processing..."
                : `Upload ${
                    selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""
                  }Documents`}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <div className="space-y-4">
          <h2
            id="recent-documents-heading"
            className="text-xl font-semibold text-gray-900"
          >
            Recent Documents
          </h2>

          {loading && (
            <div
              className="flex items-center justify-center py-8"
              role="status"
              aria-live="polite"
            >
              <Loader2
                className="h-6 w-6 animate-spin text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2 text-gray-600">Loading documents...</span>
            </div>
          )}

          {error && (
            <div
              className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle
                className="h-4 w-4 text-red-600"
                aria-hidden="true"
              />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {!loading && !error && documents.length === 0 && (
            <div className="text-center py-8" role="status" aria-live="polite">
              <FileText
                className="h-12 w-12 text-gray-400 mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-gray-600">No documents uploaded yet</p>
              <p className="text-sm text-gray-500">
                Upload your first document above to get started
              </p>
            </div>
          )}

          {!loading && !error && documents.length > 0 && (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              role="list"
              aria-labelledby="recent-documents-heading"
            >
              {documents.map((document) => (
                <Card
                  key={document.id}
                  role="listitem"
                  aria-label={`Document: ${
                    document.name || "Untitled Document"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {document.name || "Untitled Document"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span
                          className="text-sm financial-data font-medium text-gray-900"
                          aria-label={`Document status: ${
                            document.status || "Unknown"
                          }`}
                        >
                          {document.status || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uploaded</span>
                        <span
                          className="text-sm financial-data font-medium text-gray-900"
                          aria-label={`Uploaded on: ${
                            document.createdAt
                              ? new Date(
                                  document.createdAt
                                ).toLocaleDateString()
                              : "Unknown"
                          }`}
                        >
                          {document.createdAt
                            ? new Date(document.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Size</span>
                        <span
                          className="text-sm financial-data font-medium text-gray-900"
                          aria-label={`File size: ${
                            document.fileSize
                              ? `${(
                                  parseInt(document.fileSize) /
                                  1024 /
                                  1024
                                ).toFixed(2)} MB`
                              : "Unknown"
                          }`}
                        >
                          {document.fileSize
                            ? `${(
                                parseInt(document.fileSize) /
                                1024 /
                                1024
                              ).toFixed(2)} MB`
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`Download ${document.name || "document"}`}
                      >
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetriggerDocument(document.id)}
                        disabled={retriggeringDocumentId === document.id}
                        aria-label={`Retrigger processing for ${
                          document.name || "document"
                        }`}
                      >
                        {retriggeringDocumentId === document.id ? (
                          <Loader2
                            className="h-4 w-4 mr-2 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <RefreshCw
                            className="h-4 w-4 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        {retriggeringDocumentId === document.id
                          ? "Retriggering..."
                          : "Retrigger"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        disabled={deletingDocumentId === document.id}
                        aria-label={`Delete ${document.name || "document"}`}
                      >
                        {deletingDocumentId === document.id ? (
                          <Loader2
                            className="h-4 w-4 mr-2 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        )}
                        {deletingDocumentId === document.id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Document Processing Status */}
        <Card
          className="scandinavian-card"
          role="region"
          aria-labelledby="processing-status-title"
        >
          <CardHeader className="pb-3">
            <CardTitle
              id="processing-status-title"
              className="text-xs font-normal text-gray-500 uppercase tracking-wide"
            >
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {statsLoading ? (
              <div
                className="flex items-center justify-center py-8"
                role="status"
                aria-live="polite"
              >
                <Loader2
                  className="h-6 w-6 animate-spin text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-2 text-gray-600">
                  Loading statistics...
                </span>
              </div>
            ) : statsError ? (
              <div
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle
                  className="h-4 w-4 text-red-600"
                  aria-hidden="true"
                />
                <span className="text-sm text-red-800">{statsError}</span>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-4 gap-6"
                role="list"
                aria-labelledby="processing-status-title"
              >
                <div
                  className="text-center"
                  role="listitem"
                  aria-label={`Active jobs: ${documentStats?.processing || 0}`}
                >
                  <div className="text-sm text-gray-600 mb-1">Active Jobs</div>
                  <div
                    className="text-2xl financial-data font-light text-gray-900"
                    aria-label={`${
                      documentStats?.processing || 0
                    } active processing jobs`}
                  >
                    {documentStats?.processing || 0}
                  </div>
                </div>
                <div
                  className="text-center"
                  role="listitem"
                  aria-label={`Completed today: ${
                    documentStats?.completedToday || 0
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">
                    Completed Today
                  </div>
                  <div
                    className="text-2xl financial-data font-light text-gray-900"
                    aria-label={`${
                      documentStats?.completedToday || 0
                    } documents completed today`}
                  >
                    {documentStats?.completedToday || 0}
                  </div>
                </div>
                <div
                  className="text-center"
                  role="listitem"
                  aria-label={`Success rate: ${
                    documentStats?.successRate
                      ? `${documentStats.successRate.toFixed(1)}%`
                      : "0%"
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                  <div
                    className="text-2xl financial-data font-light text-gray-900"
                    aria-label={`${
                      documentStats?.successRate
                        ? `${documentStats.successRate.toFixed(1)}%`
                        : "0%"
                    } success rate`}
                  >
                    {documentStats?.successRate
                      ? `${documentStats.successRate.toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
                <div
                  className="text-center"
                  role="listitem"
                  aria-label={`Average processing time: ${
                    documentStats?.avgProcessingTime
                      ? `${documentStats.avgProcessingTime.toFixed(1)} minutes`
                      : "0 minutes"
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">Avg. Time</div>
                  <div
                    className="text-2xl financial-data font-light text-gray-900"
                    aria-label={`${
                      documentStats?.avgProcessingTime
                        ? `${documentStats.avgProcessingTime.toFixed(1)}`
                        : "0"
                    } minutes average processing time`}
                  >
                    {documentStats?.avgProcessingTime
                      ? `${documentStats.avgProcessingTime.toFixed(1)}m`
                      : "0m"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Processing Timeline */}
        <Card className="scandinavian-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
              Processing Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <EnhancedProcessingTimeline
              documentStats={documentStats || undefined}
              userId={user?.id || "default"}
            />
          </CardContent>
        </Card>

        {/* AI Insights - Now using real data from analytics */}
        <div className="space-y-4">
          <h2
            id="ai-insights-heading"
            className="text-xl font-semibold text-gray-900"
          >
            AI-Generated Insights
          </h2>
          <p className="text-gray-600 text-sm">
            AI-generated insights and analytics from your documents
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          role="list"
          aria-labelledby="ai-insights-heading"
        >
          <Card role="listitem" aria-label="Portfolio Performance Summary">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Portfolio Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total NAV</span>
                  <span
                    className="text-sm financial-data font-medium text-gray-900"
                    aria-label={`Total Net Asset Value: €${
                      analytics.portfolioSummary?.totalValue?.toLocaleString() ||
                      "0"
                    }`}
                  >
                    €
                    {analytics.portfolioSummary?.totalValue?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Called Capital</span>
                  <span
                    className="text-sm financial-data font-medium text-gray-900"
                    aria-label={`Total Called Capital: €${
                      analytics.portfolioSummary?.totalInvested?.toLocaleString() ||
                      "0"
                    }`}
                  >
                    €
                    {analytics.portfolioSummary?.totalInvested?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Distributions</span>
                  <span
                    className="text-sm financial-data font-medium text-gray-900"
                    aria-label={`Total Distributions: €${
                      analytics.portfolioSummary?.totalUnrealizedGains?.toLocaleString() ||
                      "0"
                    }`}
                  >
                    €
                    {analytics.portfolioSummary?.totalUnrealizedGains?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card role="listitem" aria-label="Performance Metrics">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average IRR</span>
                  <span
                    className="text-sm financial-data font-medium text-gray-900"
                    aria-label={`Average Internal Rate of Return: ${
                      analytics.portfolioSummary?.avgIrr?.toFixed(1) || "0"
                    }%`}
                  >
                    {analytics.portfolioSummary?.avgIrr?.toFixed(1) || "0"}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average MOIC</span>
                  <span
                    className="text-sm financial-data font-medium text-gray-900"
                    aria-label={`Average Multiple on Invested Capital: ${
                      analytics.portfolioSummary?.avgMoic?.toFixed(2) || "0"
                    }x`}
                  >
                    {analytics.portfolioSummary?.avgMoic?.toFixed(2) || "0"}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Unrealized Gains
                  </span>
                  <span
                    className="text-sm financial-data font-medium text-gray-900"
                    aria-label={`Total Unrealized Gains: €${
                      analytics.portfolioSummary?.totalUnrealizedGains?.toLocaleString() ||
                      "0"
                    }`}
                  >
                    €
                    {analytics.portfolioSummary?.totalUnrealizedGains?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Duplicate Handler Modal */}
      {showDuplicateHandler && duplicateResult && (
        <DuplicateHandler
          isOpen={showDuplicateHandler}
          onClose={handleDuplicateClose}
          duplicateResult={duplicateResult}
          onAction={handleDuplicateAction}
          isProcessing={duplicateProcessing}
        />
      )}
    </AppLayout>
  );
}
