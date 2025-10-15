"use client";

import React, { useEffect, useState } from "react";
import {
  EnhancedProgressTimeline,
  defaultProcessingSteps,
} from "@/components/ui/enhanced-progress-timeline";
import { useProcessingTimeline } from "@/hooks/useProcessingTimeline";
import { useWebSocket } from "@/hooks/useWebSocket";

interface DocumentStats {
  total: number;
  processing: number;
  completed: number;
  error: number;
}

interface EnhancedProcessingTimelineProps {
  documentStats?: DocumentStats;
  userId: string;
}

export function EnhancedProcessingTimeline({
  documentStats,
  userId,
}: EnhancedProcessingTimelineProps) {
  const { timelineState, initializeTimeline, resetTimeline, isConnected } =
    useProcessingTimeline(userId);
  const { lastMessage } = useWebSocket();
  const [hasActiveProcessing, setHasActiveProcessing] = useState(false);

  // Initialize timeline when processing starts
  useEffect(() => {
    if (documentStats?.processing > 0 && !hasActiveProcessing) {
      setHasActiveProcessing(true);
      initializeTimeline(defaultProcessingSteps);
    } else if (documentStats?.processing === 0 && hasActiveProcessing) {
      setHasActiveProcessing(false);
      // Keep timeline visible for a moment to show completion
      setTimeout(() => {
        resetTimeline();
      }, 3000);
    }
  }, [
    documentStats?.processing,
    hasActiveProcessing,
    initializeTimeline,
    resetTimeline,
  ]);

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    if (lastMessage && lastMessage.type === "document_processing") {
      const data = lastMessage.data;

      // Update timeline based on processing status
      if (data.status === "uploaded") {
        initializeTimeline(defaultProcessingSteps);
      }
    }
  }, [lastMessage, initializeTimeline]);

  // If no processing is happening, show a static state
  if (!timelineState.isProcessing && timelineState.steps.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Process
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents to see the AI processing pipeline in action
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            <span>{isConnected ? "Connected" : "Development Mode"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EnhancedProgressTimeline
        steps={timelineState.steps}
        currentStep={timelineState.currentStep}
        totalProgress={timelineState.totalProgress}
        isProcessing={timelineState.isProcessing}
        showDetails={true}
        animated={true}
      />

      {/* Processing Stats */}
      {documentStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-foreground">
              {documentStats.processing}
            </div>
            <div className="text-xs text-gray-600">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {documentStats.completed}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {documentStats.total}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {documentStats.error}
            </div>
            <div className="text-xs text-gray-600">Errors</div>
          </div>
        </div>
      )}
    </div>
  );
}
