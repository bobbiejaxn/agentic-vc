"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  AlertTriangle,
  Edit3,
  CheckCircle,
  XCircle,
  Info,
  Save,
  X,
  Pencil,
} from "lucide-react";

interface ValidationError {
  field: string;
  message: string;
  severity: "high" | "medium" | "low";
  actualValue: any;
  expectedValue?: any;
}

interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

interface DataValidationAlertProps {
  validation: {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
  };
  fundId: string;
  portfolioId: string;
  userId: string;
  onDataFix?: (field: string, value: number) => void;
}

export function DataValidationAlert({
  validation,
  fundId,
  portfolioId,
  userId,
  onDataFix,
}: DataValidationAlertProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Always show the component, but conditionally show validation alerts

  const handleEdit = (field: string, value: number) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Object.entries(editValues).forEach(([field, value]) => {
      onDataFix?.(field, value);
    });
    setIsEditing(false);
    setEditValues({});
  };

  // Inline editing functions
  const startInlineEdit = (field: string, currentValue: number) => {
    setEditingField(field);
    setInlineValue(currentValue.toString());
    setIsInlineEditing(true);
  };

  const cancelInlineEdit = () => {
    setEditingField(null);
    setInlineValue("");
    setIsInlineEditing(false);
  };

  const saveInlineEdit = async () => {
    if (!editingField || !inlineValue) return;

    setIsSaving(true);
    try {
      const numericValue = parseFloat(inlineValue);
      if (!isNaN(numericValue)) {
        // Call the API to update the database
        const response = await fetch(
          `/api/portfolios/${portfolioId}/funds/${fundId}/metrics`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-dev-user-id": userId,
            },
            body: JSON.stringify({
              field: editingField,
              value: numericValue,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update ${editingField}`);
        }

        const result = await response.json();

        if (result.success) {
          // Call the parent callback to update the UI
          onDataFix?.(editingField, numericValue);

          // Show success feedback
          console.log(
            `Successfully updated ${editingField} to ${numericValue}`
          );
        } else {
          throw new Error(result.error || "Update failed");
        }
      }
    } catch (error) {
      console.error("Error saving inline edit:", error);
      // You could add a toast notification here
      alert(
        `Failed to update ${editingField}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
      cancelInlineEdit();
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      ownershipPercentage: "Ownership %",
      personalCommitment: "Personal Commitment",
      personalCalled: "Capital Called",
      personalNav: "Personal NAV",
      personalDistributions: "Personal Distributions",
    };
    return labels[field] || field;
  };

  const getFieldValue = (field: string) => {
    // This would come from the actual fund data
    // For now, return default values
    const defaults: Record<string, number> = {
      ownershipPercentage: 1.0,
      personalCommitment: 1377.55,
      personalCalled: 1117.49,
      personalNav: 1018.91,
      personalDistributions: 0,
    };
    return defaults[field] || 0;
  };

  // Inline editing component
  const InlineEditField = ({
    field,
    label,
    value,
  }: {
    field: string;
    label: string;
    value: number;
  }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.01"
            value={inlineValue}
            onChange={(e) => setInlineValue(e.target.value)}
            className="w-24 h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveInlineEdit();
              if (e.key === "Escape") cancelInlineEdit();
            }}
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={saveInlineEdit}
              disabled={isSaving}
              className="h-6 w-6 p-0"
            >
              {isSaving ? (
                <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full" />
              ) : (
                <Save className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelInlineEdit}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className="text-sm font-medium">{label}:</span>
        <Badge variant="outline" className="font-mono">
          {field === "ownershipPercentage"
            ? `${value}%`
            : `€${value.toLocaleString()}`}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => startInlineEdit(field, value)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Quick Edit Section - Always Visible */}
      <div className="bg-blue-50 border border-blue-200  p-4">
        <div className="flex items-center gap-2 mb-3">
          <Edit3 className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-medium text-blue-900">
            Quick Edit Personal Metrics
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InlineEditField
            field="ownershipPercentage"
            label="Ownership %"
            value={getFieldValue("ownershipPercentage")}
          />
          <InlineEditField
            field="personalCommitment"
            label="Your Commitment"
            value={getFieldValue("personalCommitment")}
          />
          <InlineEditField
            field="personalCalled"
            label="Capital Called"
            value={getFieldValue("personalCalled")}
          />
          <InlineEditField
            field="personalNav"
            label="Your NAV"
            value={getFieldValue("personalNav")}
          />
        </div>
        <div className="mt-3 text-xs text-blue-700">
          💡 Hover over any metric to edit inline, or use the full editor below
          for bulk changes.
        </div>
      </div>

      {/* Critical Errors */}
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Critical Data Issues Detected</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              {validation.errors.map((error, index) => (
                <div key={index} className="text-sm">
                  <strong>{getFieldLabel(error.field)}:</strong> {error.message}
                  {error.expectedValue && (
                    <span className="text-muted-foreground">
                      {" "}
                      (Expected: {error.expectedValue})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Data Quality Warnings</AlertTitle>
          <AlertDescription>
            <div className="space-y-4">
              {validation.warnings.map((warning, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <strong>{getFieldLabel(warning.field)}:</strong>{" "}
                      {warning.message}
                      {warning.field === "ownershipPercentage" && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Info className="h-3 w-3" />
                          <span className="max-w-xs">
                            Using default 1% ownership for calculations. Please
                            provide actual percentage for accuracy.
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-1">
                      💡 {warning.suggestion}
                    </div>
                  </div>

                  {/* Inline editing for ownership percentage */}
                  {warning.field === "ownershipPercentage" && (
                    <div className="bg-muted/50 p-3  border">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Quick Edit - Click to update your ownership
                          percentage:
                        </div>
                        <InlineEditField
                          field="ownershipPercentage"
                          label="Ownership"
                          value={getFieldValue("ownershipPercentage")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Manual Override Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Advanced Editor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Data Override</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Override missing or incorrect values for fund {fundId}
            </p>

            {/* Ownership Percentage */}
            <div className="space-y-2">
              <Label htmlFor="ownershipPercentage">
                Ownership Percentage (%)
              </Label>
              <Input
                id="ownershipPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter ownership percentage"
                value={editValues.ownershipPercentage || ""}
                onChange={(e) =>
                  handleEdit(
                    "ownershipPercentage",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            {/* Personal Commitment */}
            <div className="space-y-2">
              <Label htmlFor="personalCommitment">
                Personal Commitment (€)
              </Label>
              <Input
                id="personalCommitment"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter personal commitment"
                value={editValues.personalCommitment || ""}
                onChange={(e) =>
                  handleEdit(
                    "personalCommitment",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            {/* Personal Called Capital */}
            <div className="space-y-2">
              <Label htmlFor="personalCalled">Capital Called (€)</Label>
              <Input
                id="personalCalled"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter capital called"
                value={editValues.personalCalled || ""}
                onChange={(e) =>
                  handleEdit("personalCalled", parseFloat(e.target.value) || 0)
                }
              />
            </div>

            {/* Personal NAV */}
            <div className="space-y-2">
              <Label htmlFor="personalNav">Personal NAV (€)</Label>
              <Input
                id="personalNav"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter personal NAV"
                value={editValues.personalNav || ""}
                onChange={(e) =>
                  handleEdit("personalNav", parseFloat(e.target.value) || 0)
                }
              />
            </div>

            {/* Personal Distributions */}
            <div className="space-y-2">
              <Label htmlFor="personalDistributions">Distributions (€)</Label>
              <Input
                id="personalDistributions"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter distributions"
                value={editValues.personalDistributions || ""}
                onChange={(e) =>
                  handleEdit(
                    "personalDistributions",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suggestions */}
      {validation.suggestions.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validation.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">
                  {suggestion}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
