"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw, X, GitCompare } from "lucide-react";
import type { DuplicateDetectionResult } from "@/lib/duplicate-detection-client";

interface DuplicateHandlerProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateResult: DuplicateDetectionResult;
  onAction: (action: "retrigger" | "cancel" | "retrigger_and_compare") => void;
  isProcessing?: boolean;
}

export function DuplicateHandler({
  isOpen,
  onClose,
  duplicateResult,
  onAction,
  isProcessing = false,
}: DuplicateHandlerProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleAction = (
    action: "retrigger" | "cancel" | "retrigger_and_compare"
  ) => {
    setSelectedAction(action);
    onAction(action);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Re-trigger":
        return <RefreshCw className="h-4 w-4" />;
      case "Cancel":
        return <X className="h-4 w-4" />;
      case "Re-trigger and Compare":
        return <GitCompare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case "Re-trigger":
        return "Replace the existing document with the new upload";
      case "Cancel":
        return "Cancel the upload and keep the existing document";
      case "Re-trigger and Compare":
        return "Create a new document for side-by-side comparison";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Duplicate Document Detected
          </DialogTitle>
          <DialogDescription className="text-left">
            {duplicateResult.message}
          </DialogDescription>
        </DialogHeader>

        {duplicateResult.duplicateDocument && (
          <div className="space-y-3">
            <div className=" border p-3 bg-gray-50">
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                Existing Document:
              </h4>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {duplicateResult.duplicateDocument.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      duplicateResult.duplicateDocument.status === "completed"
                        ? "default"
                        : duplicateResult.duplicateDocument.status ===
                            "processing"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {duplicateResult.duplicateDocument.status}
                  </Badge>
                  <span className="text-gray-500">
                    {new Date(
                      duplicateResult.duplicateDocument.uploadedAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                {duplicateResult.criteria && (
                  <div className="flex gap-2 mt-2">
                    {duplicateResult.criteria.fileName && (
                      <Badge variant="outline" className="text-xs">
                        Same filename
                      </Badge>
                    )}
                    {duplicateResult.criteria.fileSize && (
                      <Badge variant="outline" className="text-xs">
                        Same size
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Choose an action:</h4>
          {duplicateResult.options.map((option) => (
            <div
              key={option}
              className={`p-3  border cursor-pointer transition-colors ${
                selectedAction === option
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedAction(option)}
            >
              <div className="flex items-center gap-3">
                {getActionIcon(option)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{option}</p>
                  <p className="text-xs text-gray-500">
                    {getActionDescription(option)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Close
          </Button>
          {selectedAction && (
            <Button
              onClick={() => {
                const actionMap: Record<
                  string,
                  "retrigger" | "cancel" | "retrigger_and_compare"
                > = {
                  "Re-trigger": "retrigger",
                  Cancel: "cancel",
                  "Re-trigger and Compare": "retrigger_and_compare",
                };
                handleAction(actionMap[selectedAction]);
              }}
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${selectedAction}`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
