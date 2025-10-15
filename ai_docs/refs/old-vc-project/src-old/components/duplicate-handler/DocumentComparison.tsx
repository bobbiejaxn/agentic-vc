"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface DocumentComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  originalDocument: any;
  newDocument: any;
  onAcceptNew: () => void;
  onKeepOriginal: () => void;
  isProcessing?: boolean;
}

export function DocumentComparison({
  isOpen,
  onClose,
  originalDocument,
  newDocument,
  onAcceptNew,
  onKeepOriginal,
  isProcessing = false,
}: DocumentComparisonProps) {
  const [selectedDocument, setSelectedDocument] = useState<
    "original" | "new" | null
  >(null);

  const formatDate = (date: Date | string) => {
    return (
      new Date(date).toLocaleDateString() +
      " " +
      new Date(date).toLocaleTimeString()
    );
  };

  const formatFileSize = (size: string | number) => {
    const bytes = typeof size === "string" ? parseInt(size) : size;
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderExtractedData = (data: any) => {
    if (!data)
      return (
        <p className="text-gray-500 text-sm">No extracted data available</p>
      );

    return (
      <div className="space-y-2 text-sm">
        {data.totalValue && (
          <div className="flex justify-between">
            <span className="text-gray-600">Total Value:</span>
            <span className="font-medium">
              ${data.totalValue.toLocaleString()}
            </span>
          </div>
        )}
        {data.irr && (
          <div className="flex justify-between">
            <span className="text-gray-600">IRR:</span>
            <span className="font-medium">{data.irr.toFixed(2)}%</span>
          </div>
        )}
        {data.moic && (
          <div className="flex justify-between">
            <span className="text-gray-600">MOIC:</span>
            <span className="font-medium">{data.moic.toFixed(2)}x</span>
          </div>
        )}
        {data.investmentDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Investment Date:</span>
            <span className="font-medium">{data.investmentDate}</span>
          </div>
        )}
        {data.companyName && (
          <div className="flex justify-between">
            <span className="text-gray-600">Company:</span>
            <span className="font-medium">{data.companyName}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Comparison</DialogTitle>
          <DialogDescription>
            Compare the original and new documents to decide which version to
            keep.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Document */}
          <Card
            className={`cursor-pointer transition-all ${
              selectedDocument === "original" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedDocument("original")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-600">Original Document</span>
                {selectedDocument === "original" && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  File Information
                </h4>
                <p className="text-sm text-gray-600 break-words">
                  {originalDocument.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      originalDocument.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {originalDocument.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(originalDocument.uploadedAt)}
                  </span>
                </div>
                {originalDocument.fileSize && (
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {formatFileSize(originalDocument.fileSize)}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  Extracted Data
                </h4>
                {renderExtractedData(originalDocument.extractedData)}
              </div>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400" />
          </div>

          {/* New Document */}
          <Card
            className={`cursor-pointer transition-all ${
              selectedDocument === "new" ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() => setSelectedDocument("new")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-600">New Document</span>
                {selectedDocument === "new" && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  File Information
                </h4>
                <p className="text-sm text-gray-600 break-words">
                  {newDocument.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      newDocument.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {newDocument.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(newDocument.uploadedAt)}
                  </span>
                </div>
                {newDocument.fileSize && (
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {formatFileSize(newDocument.fileSize)}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  Extracted Data
                </h4>
                {renderExtractedData(newDocument.extractedData)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={onKeepOriginal}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Keep Original
          </Button>
          <Button
            onClick={onAcceptNew}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Accept New Version
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
