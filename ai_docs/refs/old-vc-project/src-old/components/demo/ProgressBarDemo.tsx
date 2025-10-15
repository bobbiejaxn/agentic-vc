"use client";

import React, { useState, useEffect } from "react";
import {
  EnhancedProgressTimeline,
  defaultProcessingSteps,
  ProcessingStep,
} from "@/components/ui/enhanced-progress-timeline";

export function ProgressBarDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>(defaultProcessingSteps);

  const startDemo = () => {
    setIsProcessing(true);
    setCurrentStep(0);

    // Reset all steps
    setSteps(
      defaultProcessingSteps.map((step) => ({
        ...step,
        status: "pending" as const,
        progress: 0,
      }))
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Complete current step
      setSteps((prev) =>
        prev.map((step, index) =>
          index === currentStep
            ? { ...step, status: "completed" as const, progress: 100 }
            : step
        )
      );

      // Move to next step
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);

      // Activate next step
      setSteps((prev) =>
        prev.map((step, index) =>
          index === nextStepIndex
            ? { ...step, status: "active" as const, progress: 0 }
            : step
        )
      );
    } else {
      // Complete final step
      setSteps((prev) =>
        prev.map((step, index) =>
          index === currentStep
            ? { ...step, status: "completed" as const, progress: 100 }
            : step
        )
      );
      setIsProcessing(false);
    }
  };

  const simulateProgress = () => {
    if (isProcessing && currentStep < steps.length) {
      setSteps((prev) =>
        prev.map((step, index) => {
          if (index === currentStep && step.status === "active") {
            const newProgress = Math.min(
              step.progress + Math.random() * 20,
              100
            );
            return { ...step, progress: newProgress };
          }
          return step;
        })
      );
    }
  };

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(simulateProgress, 500);
      return () => clearInterval(interval);
    }
  }, [isProcessing, currentStep]);

  const totalProgress =
    steps.reduce((acc, step) => {
      if (step.status === "completed") return acc + 100;
      if (step.status === "active") return acc + step.progress;
      return acc;
    }, 0) / steps.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Progress Timeline Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Experience the new engaging and informative progress bar with
          animations, real-time updates, and detailed status information.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={startDemo}
            disabled={isProcessing}
            className="px-6 py-2 bg-gray-600 dark:bg-foreground text-white dark:text-background  hover:bg-gray-700 dark:hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Demo
          </button>
          <button
            onClick={nextStep}
            disabled={!isProcessing}
            className="px-6 py-2 bg-green-600 text-white  hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        </div>
      </div>

      <div className="bg-white  shadow-lg p-6">
        <EnhancedProgressTimeline
          steps={steps}
          currentStep={currentStep}
          totalProgress={totalProgress}
          isProcessing={isProcessing}
          showDetails={true}
          animated={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 ">
          <h3 className="font-semibold text-blue-900 mb-2">✨ Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Smooth animations</li>
            <li>• Real-time progress</li>
            <li>• Detailed status messages</li>
            <li>• Time estimates</li>
            <li>• Interactive hover effects</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 ">
          <h3 className="font-semibold text-green-900 mb-2">🎯 Benefits</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• More engaging UX</li>
            <li>• Better user feedback</li>
            <li>• Professional appearance</li>
            <li>• Reduced perceived wait time</li>
            <li>• Clear progress indication</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 ">
          <h3 className="font-semibold text-purple-900 mb-2">🔧 Technical</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Framer Motion animations</li>
            <li>• WebSocket integration</li>
            <li>• TypeScript support</li>
            <li>• Responsive design</li>
            <li>• Accessibility friendly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
