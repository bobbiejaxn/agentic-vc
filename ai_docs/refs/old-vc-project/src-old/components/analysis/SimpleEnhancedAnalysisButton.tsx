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

interface SimpleEnhancedAnalysisButtonProps {
  documentId: string;
  userId: string;
  onAnalysisComplete?: (result: any) => void;
  onAnalysisError?: (error: Error) => void;
  className?: string;
}

export function SimpleEnhancedAnalysisButton({
  documentId,
  userId,
  onAnalysisComplete,
  onAnalysisError,
  className,
}: SimpleEnhancedAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>("Ready");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStatus("Starting analysis...");
    setProgress(0);
    setCurrentStep("Initializing enhanced analysis");

    try {
      // Simulate analysis steps
      const steps = [
        "Extracting financial metrics",
        "Analyzing portfolio composition",
        "Enriching with external data",
        "Calculating confidence scores",
        "Validating results",
        "Generating insights",
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setProgress((i + 1) * (100 / steps.length));
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setAnalysisStatus("Analysis completed successfully!");
      setIsAnalyzing(false);

      // Simulate successful result
      const mockResult = {
        id: `analysis_${Date.now()}`,
        documentId,
        userId,
        status: "completed",
        confidenceScore: 0.87,
        financialMetrics: {
          irr: 0.184,
          moic: 2.3,
          tvpi: 1.8,
        },
        portfolioAnalysis: {
          totalCompanies: 12,
          sectors: ["Biotechnology", "Healthtech"],
          stages: ["Series A", "Series B"],
        },
        externalData: {
          newsCount: 15,
          marketData: true,
          fundingRounds: 8,
        },
      };

      onAnalysisComplete?.(mockResult);
    } catch (error) {
      setAnalysisStatus("Analysis failed");
      setIsAnalyzing(false);
      onAnalysisError?.(error as Error);
    }
  };

  return (
    <Card className={`scandinavian-card ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-card ">
              <Brain className="h-5 w-5 text-gray-600 dark:text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-foreground">
                Enhanced Analysis
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-muted-foreground">
                Comprehensive portfolio analysis with external data enrichment
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-gray-100 dark:bg-card text-gray-700 dark:text-muted-foreground"
          >
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Analysis Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span
              className={`font-medium ${
                analysisStatus.includes("completed")
                  ? "text-gray-700 dark:text-foreground"
                  : analysisStatus.includes("failed")
                    ? "text-gray-600 dark:text-muted-foreground"
                    : "text-gray-600 dark:text-muted-foreground"
              }`}
            >
              {analysisStatus}
            </span>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-muted-foreground">
                  Progress:
                </span>
                <span className="text-gray-700 dark:text-foreground font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-card rounded-full h-2">
                <div
                  className="bg-gray-600 dark:bg-foreground h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{currentStep}</div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            <span>Financial Metrics</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground">
            <ExternalLink className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            <span>External Data</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className="w-full"
          variant="default"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Start Enhanced Analysis
            </>
          )}
        </Button>

        {/* Results Preview */}
        {analysisStatus.includes("completed") && (
          <div className="mt-4 p-3 bg-green-50  border border-green-200">
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Analysis Complete
            </div>
            <div className="text-xs text-green-600 mt-1">
              Enhanced analysis with external data enrichment completed
              successfully.
            </div>
          </div>
        )}

        {analysisStatus.includes("failed") && (
          <div className="mt-4 p-3 bg-red-50  border border-red-200">
            <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Analysis Failed
            </div>
            <div className="text-xs text-red-600 mt-1">
              There was an error during the analysis. Please try again.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
