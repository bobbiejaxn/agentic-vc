"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  TrendingUp,
  ExternalLink,
  Database,
} from "lucide-react";
import type { AnalysisProgress as AnalysisProgressType } from "@/lib/types/analysis";

interface AnalysisProgressProps {
  progress: AnalysisProgressType;
  className?: string;
}

/**
 * Analysis Progress Component
 *
 * Displays real-time progress of enhanced analysis processing
 * with detailed step-by-step status updates.
 */
export function AnalysisProgress({
  progress,
  className = "",
}: AnalysisProgressProps) {
  const getStatusIcon = () => {
    switch (progress.status) {
      case "pending":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "processing":
        return (
          <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-muted-foreground" />
        );
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case "pending":
        return "bg-gray-500";
      case "processing":
        return "bg-gray-600 dark:bg-foreground";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case "pending":
        return "Waiting to start";
      case "processing":
        return "Processing analysis";
      case "completed":
        return "Analysis complete";
      case "failed":
        return "Analysis failed";
      default:
        return "Unknown status";
    }
  };

  const getStepIcon = (step: string) => {
    if (step.includes("financial") || step.includes("metrics")) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    if (step.includes("portfolio") || step.includes("companies")) {
      return (
        <Database className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
      );
    }
    if (step.includes("external") || step.includes("market")) {
      return <ExternalLink className="h-4 w-4 text-purple-500" />;
    }
    if (step.includes("validation") || step.includes("confidence")) {
      return <Brain className="h-4 w-4 text-orange-500" />;
    }
    return <Loader2 className="h-4 w-4 text-gray-500" />;
  };

  const getEstimatedTimeRemaining = () => {
    if (!progress.estimatedTimeRemaining) return null;

    const minutes = Math.floor(progress.estimatedTimeRemaining / 60);
    const seconds = progress.estimatedTimeRemaining % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    }
    return `${seconds}s remaining`;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">Analysis Progress</CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${getStatusColor()} text-white`}
          >
            {getStatusText()}
          </Badge>
        </div>
        <CardDescription>
          Real-time progress of enhanced analysis processing
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {getStepIcon(progress.currentStep)}
            <span className="text-sm font-medium">Current Step:</span>
          </div>
          <p className="text-sm text-gray-600 ml-6">{progress.currentStep}</p>
        </div>

        {/* Estimated Time */}
        {progress.estimatedTimeRemaining &&
          progress.status === "processing" && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{getEstimatedTimeRemaining()}</span>
            </div>
          )}

        {/* Errors */}
        {progress.errors && progress.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Issues Found:</span>
            </div>
            <div className="ml-6 space-y-1">
              {progress.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">
                  • {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Processing Steps */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Analysis Steps:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={`flex items-center space-x-2 p-2 rounded ${
                progress.progress >= 20
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              <span>Financial Metrics</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded ${
                progress.progress >= 40
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <Database className="h-3 w-3" />
              <span>Portfolio Analysis</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded ${
                progress.progress >= 60
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <ExternalLink className="h-3 w-3" />
              <span>External Data</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded ${
                progress.progress >= 80
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <Brain className="h-3 w-3" />
              <span>Validation</span>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        {progress.status === "completed" && (
          <div className="p-3 bg-green-50 ">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis Complete!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Enhanced analysis has been successfully processed and is ready for
              review.
            </p>
          </div>
        )}

        {progress.status === "failed" && (
          <div className="p-3 bg-red-50 ">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis Failed</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              There was an error processing the enhanced analysis. Please try
              again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
