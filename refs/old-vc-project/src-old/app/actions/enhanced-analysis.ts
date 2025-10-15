"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../../lib/drizzle/connection";
import { analysis_results, documents } from "../../lib/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { processEnhancedAnalysis } from "../../lib/enhanced-analysis";
import type {
  EnhancedAnalysisResult,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisProgress,
  EnhancedAnalysisStatus,
} from "../../lib/types/analysis";

/**
 * Trigger Enhanced Analysis
 *
 * Server action to start enhanced analysis processing for a document.
 * This is the main entry point for users to request comprehensive analysis.
 */
export async function triggerEnhancedAnalysis(
  documentId: string,
  userId: string,
  options?: {
    includeFinancialMetrics?: boolean;
    includePortfolioAnalysis?: boolean;
    includeDataQuality?: boolean;
    timeoutSeconds?: number;
  }
): Promise<AnalysisResponse> {
  const startTime = Date.now();

  try {
    // Validate input parameters
    if (!documentId || !userId) {
      throw new Error("Document ID and User ID are required");
    }

    // Check if document exists and user has access
    const document = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .limit(1);

    if (document.length === 0) {
      throw new Error("Document not found or access denied");
    }

    // Check if enhanced analysis already exists
    const existingAnalysis = await db
      .select()
      .from(analysis_results)
      .where(
        and(
          eq(analysis_results.document_id, documentId),
          eq(analysis_results.analysis_type, "enhanced")
        )
      )
      .orderBy(desc(analysis_results.created_at))
      .limit(1);

    // If recent analysis exists (within last hour), return cached result
    if (existingAnalysis.length > 0) {
      const analysisAge = Date.now() - existingAnalysis[0].created_at.getTime();
      if (analysisAge < 3600000) {
        // 1 hour
        return {
          success: true,
          result: existingAnalysis[0].results as EnhancedAnalysisResult,
          processingTime: Date.now() - startTime,
        };
      }
    }

    // Process enhanced analysis
    const result = await processEnhancedAnalysis(documentId, userId);

    // Revalidate relevant paths
    revalidatePath("/dashboard/documents");
    revalidatePath(`/documents/${documentId}`);
    revalidatePath(`/portfolios/${documentId}/funds`);

    return {
      success: true,
      result,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error("Enhanced analysis failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Get Analysis Results
 *
 * Retrieve enhanced analysis results for a document.
 * Returns the most recent enhanced analysis if available.
 */
export async function getAnalysisResults(
  documentId: string,
  userId: string
): Promise<EnhancedAnalysisResult | null> {
  try {
    // Validate access
    const document = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .limit(1);

    if (document.length === 0) {
      throw new Error("Document not found or access denied");
    }

    // Get most recent enhanced analysis
    const analysis = await db
      .select()
      .from(analysis_results)
      .where(
        and(
          eq(analysis_results.document_id, documentId),
          eq(analysis_results.analysis_type, "enhanced")
        )
      )
      .orderBy(desc(analysis_results.created_at))
      .limit(1);

    if (analysis.length === 0) {
      return null;
    }

    return analysis[0].results as EnhancedAnalysisResult;
  } catch (error) {
    console.error("Failed to get analysis results:", error);
    return null;
  }
}

/**
 * Validate Analysis Data
 *
 * Validate and score analysis results for data quality.
 * This ensures the enhanced analysis meets quality standards.
 */
export async function validateAnalysisData(
  documentId: string,
  userId: string
): Promise<{
  isValid: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}> {
  try {
    // Get analysis results
    const analysis = await getAnalysisResults(documentId, userId);

    if (!analysis) {
      return {
        isValid: false,
        score: 0,
        issues: ["No enhanced analysis found"],
        recommendations: ["Run enhanced analysis first"],
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check data completeness
    const completeness = analysis.tier1Data.dataQuality.completeness;
    if (completeness < 0.5) {
      issues.push("Low data completeness");
      recommendations.push("Review document for missing information");
    }
    score += completeness * 0.3;

    // Check data accuracy
    const accuracy = analysis.tier1Data.dataQuality.accuracy;
    if (accuracy < 0.7) {
      issues.push("Data accuracy concerns");
      recommendations.push("Verify financial calculations");
    }
    score += accuracy * 0.3;

    // Check data consistency
    const consistency = analysis.tier1Data.dataQuality.consistency;
    if (consistency < 0.6) {
      issues.push("Data consistency issues");
      recommendations.push("Cross-validate financial metrics");
    }
    score += consistency * 0.2;

    // Check confidence score
    const confidence = analysis.confidence.overall;
    if (confidence < 0.8) {
      issues.push("Low confidence in analysis");
      recommendations.push("Consider manual review of results");
    }
    score += confidence * 0.2;

    return {
      isValid: issues.length === 0,
      score: Math.min(score, 1.0),
      issues,
      recommendations,
    };
  } catch (error) {
    console.error("Failed to validate analysis data:", error);
    return {
      isValid: false,
      score: 0,
      issues: ["Validation failed"],
      recommendations: ["Check system logs for errors"],
    };
  }
}

/**
 * Get Analysis Status
 *
 * Check the status of enhanced analysis for a document.
 * Returns whether enhanced analysis exists and its quality.
 */
export async function getAnalysisStatus(
  documentId: string,
  userId: string
): Promise<EnhancedAnalysisStatus> {
  try {
    // Check if document exists
    const document = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .limit(1);

    if (document.length === 0) {
      throw new Error("Document not found or access denied");
    }

    // Get most recent enhanced analysis
    const analysis = await db
      .select()
      .from(analysis_results)
      .where(
        and(
          eq(analysis_results.document_id, documentId),
          eq(analysis_results.analysis_type, "enhanced")
        )
      )
      .orderBy(desc(analysis_results.created_at))
      .limit(1);

    if (analysis.length === 0) {
      return {
        documentId,
        hasEnhancedAnalysis: false,
      };
    }

    const result = analysis[0].results as EnhancedAnalysisResult;

    return {
      documentId,
      hasEnhancedAnalysis: true,
      lastAnalysisDate: analysis[0].created_at.toISOString(),
      confidenceScore: result.confidence.overall,
      processingTime: result.processingTime,
      errorCount: result.errors.length,
    };
  } catch (error) {
    console.error("Failed to get analysis status:", error);
    return {
      documentId,
      hasEnhancedAnalysis: false,
    };
  }
}

/**
 * Delete Analysis Results
 *
 * Remove enhanced analysis results for a document.
 * Useful for re-running analysis or cleaning up old data.
 */
export async function deleteAnalysisResults(
  documentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate access
    const document = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .limit(1);

    if (document.length === 0) {
      throw new Error("Document not found or access denied");
    }

    // Delete enhanced analysis results
    await db
      .delete(analysis_results)
      .where(
        and(
          eq(analysis_results.document_id, documentId),
          eq(analysis_results.analysis_type, "enhanced")
        )
      );

    // Revalidate paths
    revalidatePath("/dashboard/documents");
    revalidatePath(`/documents/${documentId}`);
    revalidatePath(`/portfolios/${documentId}/funds`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete analysis results:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get Analysis Progress
 *
 * Get the current progress of enhanced analysis processing.
 * This is useful for showing progress indicators to users.
 */
export async function getAnalysisProgress(
  documentId: string,
  userId: string
): Promise<AnalysisProgress | null> {
  try {
    // Check if analysis is in progress
    const analysis = await db
      .select()
      .from(analysis_results)
      .where(
        and(
          eq(analysis_results.document_id, documentId),
          eq(analysis_results.analysis_type, "enhanced")
        )
      )
      .orderBy(desc(analysis_results.created_at))
      .limit(1);

    if (analysis.length === 0) {
      return {
        documentId,
        status: "pending",
        currentStep: "Waiting to start",
        progress: 0,
      };
    }

    const result = analysis[0].results as EnhancedAnalysisResult;

    if (result.errors.length > 0) {
      return {
        documentId,
        status: "failed",
        currentStep: "Analysis failed",
        progress: 100,
        errors: result.errors,
      };
    }

    return {
      documentId,
      status: "completed",
      currentStep: "Analysis complete",
      progress: 100,
    };
  } catch (error) {
    console.error("Failed to get analysis progress:", error);
    return {
      documentId,
      status: "failed",
      currentStep: "Error occurred",
      progress: 0,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
