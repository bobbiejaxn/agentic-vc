/**
 * Quality Metrics and Confidence Scoring
 * Calculates comprehensive quality metrics for extraction results
 * and provides confidence scoring for individual fields.
 */

import type {
  TextExtractionResult,
  ImageExtractionResult,
  ValidationResult,
  VCPortfolioExtraction,
  QualityMetrics,
} from "./types/extraction";

/**
 * Calculate comprehensive quality metrics for extraction results
 */
export async function calculateQualityMetrics(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult,
  validations: ValidationResult[],
  _finalData: VCPortfolioExtraction
): Promise<QualityMetrics> {
  const totalFields = countExpectedFields();
  const extractedFields = countExtractedFields(textResult, imageResult);
  const validatedFields = validations.filter(
    (v) => v.confidence === "high"
  ).length;

  const dataCompleteness = (extractedFields / totalFields) * 100;
  const validationScore =
    validations.length > 0 ? (validatedFields / validations.length) * 100 : 100;

  // Calculate field-specific confidence
  const fieldConfidence: { [key: string]: Record<string, unknown> } = {};
  validations.forEach((validation) => {
    fieldConfidence[validation.field] = {
      confidence: getConfidenceScore(validation.confidence),
      sources: [validation.textValue ? "text" : "image"].filter(Boolean),
      validation: validation.validationMethod,
    };
  });

  // Identify quality issues
  const issues = identifyQualityIssues(textResult, imageResult, validations);

  return {
    overallConfidence: Math.min(
      dataCompleteness * 0.4 + validationScore * 0.6,
      100
    ),
    dataCompleteness,
    extractionAccuracy: validationScore,
    validationScore,
    processingReliability: calculateProcessingReliability(
      textResult,
      imageResult
    ),
    fieldConfidence,
    issues,
  };
}

/**
 * Count expected fields in VC portfolio extraction
 */
function countExpectedFields(): number {
  return 15; // fund info + portfolio summary + investments + performance
}

/**
 * Count actually extracted fields
 */
function countExtractedFields(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult
): number {
  let count = 0;

  // Count text-extracted fields
  if (textResult.content?.length > 0) count++;
  if (textResult.pages?.length > 0) count++;

  // Count image-extracted fields
  count += imageResult.charts.length;
  count += imageResult.tables.length;
  count += imageResult.textBlocks.length;

  return Math.min(count, countExpectedFields());
}

/**
 * Convert confidence string to numeric score
 */
function getConfidenceScore(confidence: string): number {
  switch (confidence) {
    case "high":
      return 0.9;
    case "medium":
      return 0.7;
    case "low":
      return 0.5;
    default:
      return 0.5;
  }
}

/**
 * Calculate processing reliability score
 */
function calculateProcessingReliability(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult
): number {
  let reliability = 1.0;

  // Reduce reliability if text extraction failed
  if (!textResult.content || textResult.content.length === 0) {
    reliability *= 0.7;
  }

  // Reduce reliability if image processing had issues
  if (imageResult.totalImages > 0 && imageResult.processedImages === 0) {
    reliability *= 0.8;
  }

  // Boost reliability if both text and image processing succeeded
  if (textResult.content?.length > 0 && imageResult.processedImages > 0) {
    reliability *= 1.2;
  }

  return Math.min(reliability, 1.0);
}

/**
 * Identify data quality issues
 */
function identifyQualityIssues(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult,
  validations: ValidationResult[]
): Record<string, unknown>[] {
  const issues: Record<string, unknown>[] = [];

  // Check for missing critical data
  if (!textResult.content || textResult.content.length === 0) {
    issues.push({
      type: "missing_data",
      field: "text_content",
      severity: "critical",
      description: "No text content extracted from document",
      suggestedAction: "Check document format and Llama Parse configuration",
    });
  }

  // Check for image processing failures
  if (imageResult.totalImages > 0 && imageResult.processedImages === 0) {
    issues.push({
      type: "processing_failure",
      field: "image_processing",
      severity: "high",
      description: "All image processing attempts failed",
      suggestedAction:
        "Verify Llama Cloud service availability and API credentials",
    });
  }

  // Check for validation conflicts
  const conflicts = validations.filter((v) => v.conflicts.length > 0);
  if (conflicts.length > 0) {
    issues.push({
      type: "validation_conflict",
      field: "cross_validation",
      severity: "medium",
      description: `${conflicts.length} validation conflicts found`,
      suggestedAction:
        "Review conflicting data sources and manual verification",
    });
  }

  // Check for low confidence extractions
  const lowConfidence = validations.filter((v) => v.confidence === "low");
  if (lowConfidence.length > validations.length * 0.3) {
    issues.push({
      type: "low_confidence",
      field: "overall_extraction",
      severity: "medium",
      description: "High proportion of low-confidence extractions",
      suggestedAction:
        "Consider manual review or enhanced processing parameters",
    });
  }

  return issues;
}
