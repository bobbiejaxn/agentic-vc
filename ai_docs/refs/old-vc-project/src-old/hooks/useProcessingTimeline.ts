"use client";

import { useState, useEffect, useCallback } from "react";
import { ProcessingStep } from "@/components/ui/enhanced-progress-timeline";
import { useWebSocket } from "@/hooks/useWebSocket";

export interface ProcessingTimelineState {
  steps: ProcessingStep[];
  currentStep: number;
  totalProgress: number;
  isProcessing: boolean;
  startTime?: Date;
  estimatedCompletion?: Date;
}

export function useProcessingTimeline(userId: string) {
  const [timelineState, setTimelineState] = useState<ProcessingTimelineState>({
    steps: [],
    currentStep: 0,
    totalProgress: 0,
    isProcessing: false,
  });

  const { isConnected, lastMessage, subscribeToDocuments } = useWebSocket();

  // Subscribe to document updates
  useEffect(() => {
    if (isConnected) {
      subscribeToDocuments(userId);
    }
  }, [isConnected, userId, subscribeToDocuments]);

  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === "document_processing") {
      const data = lastMessage.data;
      updateProcessingStep(data);
    }
  }, [lastMessage]);

  const updateProcessingStep = useCallback((data: Record<string, unknown>) => {
    setTimelineState((prev) => {
      const newSteps = [...prev.steps];
      const stepIndex = getStepIndex(data.status);

      if (stepIndex >= 0 && stepIndex < newSteps.length) {
        // Update current step
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          status: "active",
          progress: data.progress || 0,
          details: data.message || newSteps[stepIndex].details,
        };

        // Mark previous steps as completed
        for (let i = 0; i < stepIndex; i++) {
          newSteps[i] = {
            ...newSteps[i],
            status: "completed",
            progress: 100,
          };
        }

        // Reset future steps
        for (let i = stepIndex + 1; i < newSteps.length; i++) {
          newSteps[i] = {
            ...newSteps[i],
            status: "pending",
            progress: 0,
          };
        }
      }

      const totalProgress = calculateTotalProgress(newSteps);
      const isProcessing =
        data.status !== "completed" && data.status !== "error";

      return {
        ...prev,
        steps: newSteps,
        currentStep: stepIndex,
        totalProgress,
        isProcessing,
        startTime:
          isProcessing && !prev.startTime ? new Date() : prev.startTime,
        estimatedCompletion: isProcessing
          ? calculateEstimatedCompletion(newSteps, stepIndex)
          : undefined,
      };
    });
  }, []);

  const getStepIndex = (status: unknown): number => {
    const statusMap: Record<string, number> = {
      uploaded: 0,
      parsing: 1,
      extracting: 2,
      analyzing: 3,
      storing: 4,
      completed: 5,
      error: -1,
    };
    return statusMap[String(status)] ?? 0;
  };

  const calculateTotalProgress = (steps: ProcessingStep[]): number => {
    if (steps.length === 0) return 0;

    const completedSteps = steps.filter(
      (step) => step.status === "completed"
    ).length;
    const currentStep = steps.find((step) => step.status === "active");
    const currentProgress = currentStep ? currentStep.progress : 0;

    return Math.round(
      ((completedSteps + currentProgress / 100) / steps.length) * 100
    );
  };

  const calculateEstimatedCompletion = (
    steps: ProcessingStep[],
    currentStep: number
  ): Date => {
    const remainingSteps = steps.slice(currentStep);
    const totalEstimatedTime = remainingSteps.reduce(
      (acc, step) => acc + (step.estimatedTime || 0),
      0
    );
    const currentStepProgress = steps[currentStep]?.progress || 0;
    const currentStepRemaining =
      ((100 - currentStepProgress) / 100) *
      (steps[currentStep]?.estimatedTime || 0);

    const totalRemainingSeconds =
      totalEstimatedTime -
      (steps[currentStep]?.estimatedTime || 0) +
      currentStepRemaining;

    return new Date(Date.now() + totalRemainingSeconds * 1000);
  };

  const resetTimeline = useCallback(() => {
    setTimelineState({
      steps: [],
      currentStep: 0,
      totalProgress: 0,
      isProcessing: false,
    });
  }, []);

  const initializeTimeline = useCallback((steps: ProcessingStep[]) => {
    setTimelineState({
      steps,
      currentStep: 0,
      totalProgress: 0,
      isProcessing: true,
      startTime: new Date(),
    });
  }, []);

  return {
    timelineState,
    updateProcessingStep,
    resetTimeline,
    initializeTimeline,
    isConnected,
  };
}
