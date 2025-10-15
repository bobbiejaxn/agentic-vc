"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Warning,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { ValidationResult } from "@/lib/types/analysis";

interface ValidationPanelProps {
  validation: ValidationResult[];
  errors: string[];
  className?: string;
}

/**
 * Validation Panel Component
 *
 * Displays validation results and data quality issues
 * with detailed explanations and suggested fixes.
 */
export function ValidationPanel({
  validation,
  errors,
  className = "",
}: ValidationPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <Warning className="h-4 w-4 text-yellow-500" />;
      case "info":
        return (
          <Info className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
        );
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-gray-600 dark:bg-foreground";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      case "info":
        return "Info";
      default:
        return "Unknown";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "calculation":
        return "Calculation";
      case "range":
        return "Range";
      case "consistency":
        return "Consistency";
      case "completeness":
        return "Completeness";
      default:
        return "Unknown";
    }
  };

  const errorCount = validation.filter((v) => v.severity === "error").length;
  const warningCount = validation.filter(
    (v) => v.severity === "warning"
  ).length;
  const infoCount = validation.filter((v) => v.severity === "info").length;

  const hasIssues = errorCount > 0 || warningCount > 0 || errors.length > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasIssues ? (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <CardTitle className="text-lg">Data Validation</CardTitle>
          </div>
          <div className="flex space-x-2">
            {errorCount > 0 && (
              <Badge variant="destructive">{errorCount} Errors</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                {warningCount} Warnings
              </Badge>
            )}
            {infoCount > 0 && <Badge variant="outline">{infoCount} Info</Badge>}
          </div>
        </div>
        <CardDescription>
          {hasIssues
            ? "Data validation found issues that should be reviewed"
            : "All data validation checks passed successfully"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* System Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600 flex items-center space-x-2">
              <XCircle className="h-4 w-4" />
              <span>System Errors</span>
            </h4>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                >
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Results */}
        {validation.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Validation Results</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {validation.map((result, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex items-start space-x-2">
                    {getSeverityIcon(result.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {result.message}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`${getSeverityColor(
                            result.severity
                          )} text-white text-xs`}
                        >
                          {getSeverityLabel(result.severity)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Field: {result.field}
                      </div>
                      {result.suggestedFix && (
                        <div className="text-xs text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-card p-2 rounded">
                          <strong>Suggestion:</strong> {result.suggestedFix}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Issues */}
        {!hasIssues && (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-medium text-green-700 mb-1">
              All Validations Passed
            </h3>
            <p className="text-sm text-gray-600">
              No data quality issues were found in the analysis results.
            </p>
          </div>
        )}

        {/* Summary */}
        {hasIssues && (
          <div className="pt-3 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-red-600">
                  {errorCount}
                </div>
                <div className="text-xs text-gray-500">Errors</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {warningCount}
                </div>
                <div className="text-xs text-gray-500">Warnings</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-foreground">
                  {infoCount}
                </div>
                <div className="text-xs text-gray-500">Info</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {hasIssues && (
          <div className="pt-3 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Report Issues
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
