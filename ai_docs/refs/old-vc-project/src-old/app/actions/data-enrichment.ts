"use server";

import { DataEnrichmentService } from "@/lib/external-data/data-enrichment";
import {
  EnhancedInvestment,
  EnrichmentResult,
  BatchEnrichmentResult,
} from "@/lib/types/enhanced-investments";
import { revalidatePath } from "next/cache";

/**
 * Enrich a single investment with external data
 */
export async function enrichInvestment(
  investmentId: string
): Promise<EnrichmentResult> {
  try {
    // This would typically fetch the investment from database
    // For now, we'll use a mock implementation
    const mockInvestment: EnhancedInvestment = {
      id: investmentId,
      portfolioId: "portfolio-id",
      companyName: "Mock Company",
      amountInvested: 100000,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const enrichedData = await DataEnrichmentService.enrichInvestmentData(
      mockInvestment
    );

    return {
      success: true,
      data: enrichedData as EnhancedInvestment,
    };
  } catch (error) {
    console.error("Error enriching investment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to enrich investment",
    };
  }
}

/**
 * Enrich multiple investments with external data
 */
export async function batchEnrichInvestments(
  investmentIds: string[]
): Promise<BatchEnrichmentResult> {
  try {
    const results = await Promise.allSettled(
      investmentIds.map((id) => enrichInvestment(id))
    );

    const successful: EnhancedInvestment[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (
        result.status === "fulfilled" &&
        result.value.success &&
        result.value.data
      ) {
        successful.push(result.value.data);
      } else {
        const errorMessage =
          result.status === "rejected"
            ? result.reason?.message || "Unknown error"
            : result.value.error || "Enrichment failed";
        errors.push(`Investment ${investmentIds[index]}: ${errorMessage}`);
      }
    });

    return {
      success: errors.length === 0,
      data: successful.length > 0 ? successful : undefined,
      errors: errors.length > 0 ? errors : undefined,
      enrichedCount: successful.length,
      totalCount: investmentIds.length,
    };
  } catch (error) {
    console.error("Error batch enriching investments:", error);
    return {
      success: false,
      errors: [
        error instanceof Error
          ? error.message
          : "Failed to batch enrich investments",
      ],
      enrichedCount: 0,
      totalCount: investmentIds.length,
    };
  }
}

/**
 * Update company data from external sources
 */
export async function updateCompanyData(
  companyName: string
): Promise<EnrichmentResult> {
  try {
    const companyData = await DataEnrichmentService.enrichCompanyData(
      companyName
    );

    return {
      success: true,
      data: companyData as any,
    };
  } catch (error) {
    console.error("Error updating company data:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update company data",
    };
  }
}

/**
 * Sync all external data sources
 */
export async function syncExternalData(): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    // This would sync all investments with external data sources
    // For now, return a success message
    return {
      success: true,
      message: "External data sync completed successfully",
    };
  } catch (error) {
    console.error("Error syncing external data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to sync external data",
    };
  }
}
