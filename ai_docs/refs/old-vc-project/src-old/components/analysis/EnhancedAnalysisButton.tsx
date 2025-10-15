"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Zap,
  TrendingUp,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  triggerEnhancedAnalysis,
  getAnalysisStatus,
} from "../../app/actions/enhanced-analysis";
import type {
  EnhancedAnalysisStatus,
  EnhancedAnalysisResult,
} from "../../lib/types/analysis";

interface EnhancedAnalysisButtonProps {
  documentId: string;
  userId: string;
  onAnalysisComplete?: (result: EnhancedAnalysisResult) => void;
  onAnalysisError?: (error: string) => void;
  className?: string;
}

/**
 * Enhanced Analysis Button Component
 *
 * Provides users with the ability to trigger comprehensive analysis
 * with real-time progress indicators and status updates.
 */
export function EnhancedAnalysisButton({
  documentId,
  userId,
  onAnalysisComplete,
  onAnalysisError,
  className = "",
}: EnhancedAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] =
    useState<EnhancedAnalysisStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const handleEnhancedAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep("Initializing analysis...");

    try {
      // Check if analysis already exists
      const status = await getAnalysisStatus(documentId, userId);
      setAnalysisStatus(status);

      if (
        status.hasEnhancedAnalysis &&
        status.confidenceScore &&
        status.confidenceScore > 0.8
      ) {
        setCurrentStep("Analysis already completed");
        setProgress(100);
        setIsAnalyzing(false);
        return;
      }

      // Start enhanced analysis
      setCurrentStep("Extracting financial metrics...");
      setProgress(20);

      const result = await triggerEnhancedAnalysis(documentId, userId, {
        includeFinancialMetrics: true,
        includePortfolioAnalysis: true,
        includeDataQuality: true,
        timeoutSeconds: 30,
      });

      if (result.success && result.result) {
        setCurrentStep("Analysis completed successfully");
        setProgress(100);
        setAnalysisStatus({
          documentId,
          hasEnhancedAnalysis: true,
          lastAnalysisDate: new Date().toISOString(),
          confidenceScore: result.result.confidence.overall,
          processingTime: result.processingTime,
          errorCount: result.result.errors.length,
        });

        onAnalysisComplete?.(result.result);
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Enhanced analysis failed:", error);
      setCurrentStep("Analysis failed");
      setProgress(0);
      onAnalysisError?.(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = () => {
    if (isAnalyzing) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (analysisStatus?.hasEnhancedAnalysis) {
      return analysisStatus.confidenceScore &&
        analysisStatus.confidenceScore > 0.8 ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-yellow-500" />
      );
    }
    return <Brain className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isAnalyzing) return "Analyzing...";
    if (analysisStatus?.hasEnhancedAnalysis) {
      return analysisStatus.confidenceScore &&
        analysisStatus.confidenceScore > 0.8
        ? "Analysis Complete"
        : "Analysis Available";
    }
    return "Run Enhanced Analysis";
  };

  const getStatusColor = () => {
    if (isAnalyzing) return "bg-gray-600 dark:bg-foreground";
    if (analysisStatus?.hasEnhancedAnalysis) {
      return analysisStatus.confidenceScore &&
        analysisStatus.confidenceScore > 0.8
        ? "bg-gray-700 dark:bg-foreground"
        : "bg-gray-500 dark:bg-muted";
    }
    return "bg-gray-600 dark:bg-foreground";
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">Enhanced Analysis</CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${getStatusColor()} text-white`}
          >
            {getStatusText()}
          </Badge>
        </div>
        <CardDescription>
          Comprehensive analysis with external data enrichment from market
          sources
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Analysis Features */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            <span>Financial Metrics</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            <span>Portfolio Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            <span>Market Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            <span>AI Insights</span>
          </div>
        </div>

        {/* Progress Indicator */}
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStep}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 dark:bg-foreground h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Analysis Status */}
        {analysisStatus?.hasEnhancedAnalysis && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Confidence Score:</span>
              <span className="font-medium">
                {analysisStatus.confidenceScore
                  ? `${Math.round(analysisStatus.confidenceScore * 100)}%`
                  : "N/A"}
              </span>
            </div>
            {analysisStatus.processingTime && (
              <div className="flex justify-between">
                <span>Processing Time:</span>
                <span className="font-medium">
                  {Math.round(analysisStatus.processingTime / 1000)}s
                </span>
              </div>
            )}
            {analysisStatus.errorCount && analysisStatus.errorCount > 0 && (
              <div className="flex justify-between text-yellow-600">
                <span>Warnings:</span>
                <span className="font-medium">{analysisStatus.errorCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleEnhancedAnalysis}
          disabled={isAnalyzing}
          className="w-full"
          variant={analysisStatus?.hasEnhancedAnalysis ? "outline" : "default"}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentStep}
            </>
          ) : analysisStatus?.hasEnhancedAnalysis ? (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Re-run Enhanced Analysis
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Enhanced Analysis
            </>
          )}
        </Button>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center">
          Enhanced analysis includes real-time market data, company
          intelligence, and comprehensive financial metrics extraction.
        </div>
      </CardContent>
    </Card>
  );
}
