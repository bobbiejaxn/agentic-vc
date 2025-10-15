"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  Search,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Brain,
  Target,
} from "lucide-react";

export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "pending" | "active" | "completed" | "error";
  progress: number;
  estimatedTime?: number; // in seconds
  actualTime?: number; // in seconds
  details?: string;
}

interface EnhancedProgressTimelineProps {
  steps: ProcessingStep[];
  currentStep?: number;
  totalProgress?: number;
  isProcessing?: boolean;
  className?: string;
  showDetails?: boolean;
  animated?: boolean;
}

export function EnhancedProgressTimeline({
  steps,
  currentStep = 0,
  totalProgress = 0,
  isProcessing = false,
  className,
  showDetails = true,
  animated = true,
}: EnhancedProgressTimelineProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const getStepColor = (step: ProcessingStep, stepIndex: number) => {
    if (step.status === "error") return "text-red-500 bg-red-50 border-red-200";
    if (step.status === "completed")
      return "text-green-600 bg-green-50 border-green-200";
    if (step.status === "active")
      return "text-gray-900 dark:text-foreground bg-gray-50 dark:bg-card border-gray-200 dark:border-border";
    if (stepIndex <= currentStep)
      return "text-gray-600 bg-gray-50 border-gray-200";
    return "text-gray-400 bg-gray-25 border-gray-100";
  };

  const getStepIcon = (step: ProcessingStep, index: number) => {
    const IconComponent = step.icon;

    if (step.status === "error") {
      return <AlertCircle className="h-5 w-5" />;
    }
    if (step.status === "completed") {
      return <CheckCircle className="h-5 w-5" />;
    }
    if (step.status === "active" && animated) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IconComponent className="h-5 w-5" />
        </motion.div>
      );
    }
    return <IconComponent className="h-5 w-5" />;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Overall Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Pipeline
          </h3>
          <div className="flex items-center gap-2">
            {isProcessing && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1 text-sm text-gray-900 dark:text-foreground"
              >
                <Zap className="h-4 w-4" />
                <span>Processing</span>
              </motion.div>
            )}
            <span className="text-sm text-gray-500">
              {Math.round(totalProgress)}% Complete
            </span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-600 dark:from-foreground to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-600 dark:from-foreground to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Steps */}
        <div className="relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 mb-6 last:mb-0"
            >
              {/* Step Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  getStepColor(step, index),
                  step.status === "active" &&
                    "ring-4 ring-gray-200 dark:ring-border ring-opacity-50"
                )}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {getStepIcon(step, index)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {step.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    {step.status === "active" && step.progress > 0 && (
                      <span className="text-xs text-gray-900 dark:text-foreground font-medium">
                        {step.progress}%
                      </span>
                    )}
                    {step.estimatedTime && step.status === "pending" && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>~{formatTime(step.estimatedTime)}</span>
                      </div>
                    )}
                    {step.actualTime && step.status === "completed" && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>{formatTime(step.actualTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-2">{step.description}</p>

                {/* Step Progress Bar */}
                {step.status === "active" && step.progress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gray-600 dark:bg-foreground rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {/* Step Details */}
                {showDetails && step.details && (
                  <AnimatePresence>
                    {(hoveredStep === index || step.status === "active") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600"
                      >
                        {step.details}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Processing Indicators */}
                {step.status === "active" && (
                  <div className="mt-2 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-gray-600 dark:bg-foreground rounded-full"
                    />
                    <span className="text-xs text-gray-900 dark:text-foreground">
                      Processing...
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Processing Stats */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-50 dark:from-card to-green-50  border border-gray-200 dark:border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              <span className="text-sm font-medium text-gray-900">
                AI Processing Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  ETA:{" "}
                  {formatTime(
                    steps
                      .slice(currentStep)
                      .reduce((acc, step) => acc + (step.estimatedTime || 0), 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Default processing steps for document processing
export const defaultProcessingSteps: ProcessingStep[] = [
  {
    id: "upload",
    name: "Upload",
    description: "Receiving and validating document",
    icon: Upload,
    status: "pending",
    progress: 0,
    estimatedTime: 5,
    details: "Validating file format, size, and security checks",
  },
  {
    id: "parse",
    name: "Parse",
    description: "Extracting text and structure",
    icon: FileText,
    status: "pending",
    progress: 0,
    estimatedTime: 15,
    details: "OCR processing, text extraction, and document structure analysis",
  },
  {
    id: "extract",
    name: "Extract",
    description: "AI-powered data extraction",
    icon: Search,
    status: "pending",
    progress: 0,
    estimatedTime: 30,
    details:
      "Using advanced AI models to extract structured data, entities, and insights",
  },
  {
    id: "analyze",
    name: "Analyze",
    description: "Market intelligence analysis",
    icon: Brain,
    status: "pending",
    progress: 0,
    estimatedTime: 20,
    details:
      "Performing market research, competitive analysis, and trend identification",
  },
  {
    id: "store",
    name: "Store",
    description: "Saving processed data",
    icon: Database,
    status: "pending",
    progress: 0,
    estimatedTime: 5,
    details: "Storing extracted data, insights, and metadata in the database",
  },
];
