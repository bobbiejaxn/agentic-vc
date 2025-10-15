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
  TrendingUp,
  Building2,
  Brain,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import type { ConfidenceScore } from "@/lib/types/analysis";

interface ConfidenceDisplayProps {
  confidence: ConfidenceScore;
  className?: string;
}

/**
 * Confidence Display Component
 *
 * Displays detailed confidence scores for enhanced analysis results
 * with visual indicators and quality assessments.
 */
export function ConfidenceDisplay({
  confidence,
  className = "",
}: ConfidenceDisplayProps) {
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 0.6)
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High";
    if (score >= 0.6) return "Medium";
    return "Low";
  };

  const getConfidenceDescription = (score: number) => {
    if (score >= 0.8) return "High confidence in analysis quality";
    if (score >= 0.6) return "Moderate confidence with some limitations";
    return "Low confidence - review recommended";
  };

  const confidenceMetrics = [
    {
      label: "Overall",
      score: confidence.overall,
      icon: <Brain className="h-4 w-4" />,
      description: "Overall analysis confidence",
    },
    {
      label: "Financial",
      score: confidence.financial,
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Financial metrics confidence",
    },
    {
      label: "Portfolio",
      score: confidence.portfolio,
      icon: <Building2 className="h-4 w-4" />,
      description: "Portfolio analysis confidence",
    },
    {
      label: "Data Quality",
      score: confidence.dataQuality,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Data quality confidence",
    },
  ];

  // Add external data if available
  if (confidence.externalData !== undefined) {
    confidenceMetrics.push({
      label: "External Data",
      score: confidence.externalData,
      icon: <ExternalLink className="h-4 w-4" />,
      description: "External data enrichment confidence",
    });
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <CardTitle className="text-lg">Confidence Scores</CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${getConfidenceBadge(confidence.overall)} text-white`}
          >
            {getConfidenceLabel(confidence.overall)}
          </Badge>
        </div>
        <CardDescription>
          {getConfidenceDescription(confidence.overall)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getConfidenceIcon(confidence.overall)}
              <span className="font-medium">Overall Confidence</span>
            </div>
            <span
              className={`font-bold ${getConfidenceColor(confidence.overall)}`}
            >
              {formatPercentage(confidence.overall)}
            </span>
          </div>
          <Progress value={confidence.overall * 100} className="h-2" />
        </div>

        {/* Individual Metrics */}
        <div className="space-y-3">
          {confidenceMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span
                  className={`text-sm font-medium ${getConfidenceColor(
                    metric.score
                  )}`}
                >
                  {formatPercentage(metric.score)}
                </span>
              </div>
              <Progress value={metric.score * 100} className="h-1.5" />
              <p className="text-xs text-gray-500 ml-6">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Confidence Summary */}
        <div className="pt-3 border-t">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium">Confidence Assessment:</p>
              <p>
                {confidence.overall >= 0.8
                  ? "Analysis results are highly reliable and can be used for decision-making."
                  : confidence.overall >= 0.6
                  ? "Analysis results are generally reliable but may benefit from additional validation."
                  : "Analysis results should be reviewed carefully before making decisions."}
              </p>
            </div>
          </div>
        </div>

        {/* Quality Indicators */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {confidenceMetrics.filter((m) => m.score >= 0.8).length}
            </div>
            <div className="text-xs text-gray-500">High Quality</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {
                confidenceMetrics.filter((m) => m.score >= 0.6 && m.score < 0.8)
                  .length
              }
            </div>
            <div className="text-xs text-gray-500">Medium Quality</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
