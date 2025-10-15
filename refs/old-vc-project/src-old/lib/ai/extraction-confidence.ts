/**
 * Extraction Confidence Scoring Service
 *
 * Provides confidence scores and error handling for extraction results
 */

export interface ExtractionConfidence {
  overallConfidence: number;
  fieldConfidences: Record<string, number>;
  extractionQuality: "high" | "medium" | "low" | "failed";
  recommendations: string[];
  fallbackStrategies: string[];
}

export interface ExtractionError {
  field: string;
  error: string;
  severity: "critical" | "warning" | "info";
  fallbackValue?: any;
  suggestedAction: string;
}

export class ExtractionConfidenceService {
  /**
   * Calculate confidence score for extraction result
   */
  calculateConfidence(
    extractedData: Record<string, unknown>,
    documentType: string
  ): ExtractionConfidence {
    const fieldConfidences = this.calculateFieldConfidences(
      extractedData,
      documentType
    );
    const overallConfidence = this.calculateOverallConfidence(fieldConfidences);
    const extractionQuality =
      this.determineExtractionQuality(overallConfidence);

    return {
      overallConfidence,
      fieldConfidences,
      extractionQuality,
      recommendations: this.generateRecommendations(
        fieldConfidences,
        extractionQuality
      ),
      fallbackStrategies: this.generateFallbackStrategies(extractionQuality),
    };
  }

  /**
   * Calculate confidence for individual fields
   */
  private calculateFieldConfidences(
    data: Record<string, unknown>,
    documentType: string
  ): Record<string, number> {
    const confidences: Record<string, number> = {};

    // Fund-level metrics confidence
    confidences.fundSize = this.calculateNumericFieldConfidence(
      data.fundSize,
      "fund size"
    );
    confidences.fundNAV = this.calculateNumericFieldConfidence(
      data.fundNAV,
      "fund NAV"
    );
    confidences.irr = this.calculatePercentageFieldConfidence(data.irr, "IRR");
    confidences.moic = this.calculateRatioFieldConfidence(data.moic, "MOIC");
    confidences.tvpi = this.calculateRatioFieldConfidence(data.tvpi, "TVPI");

    // Portfolio company confidence
    if (data.portfolioCompanies && Array.isArray(data.portfolioCompanies)) {
      confidences.portfolioCompanies = this.calculateArrayFieldConfidence(
        data.portfolioCompanies,
        "portfolio companies",
        this.validatePortfolioCompany
      );
    }

    // Personal LP data confidence (only for LP documents)
    if (documentType === "lp_capital_account") {
      confidences.personalCommitment = this.calculateNumericFieldConfidence(
        data.personalCommitment,
        "personal commitment"
      );
      confidences.personalNAV = this.calculateNumericFieldConfidence(
        data.personalNAV,
        "personal NAV"
      );
    }

    return confidences;
  }

  /**
   * Calculate confidence for numeric fields
   */
  private calculateNumericFieldConfidence(
    value: unknown,
    _fieldName: string
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value !== "number") return 0.3;
    if (value < 0) return 0.5; // Negative values might be valid but need verification
    if (value === 0) return 0.7; // Zero might be valid
    if (value > 0) return 0.9; // Positive values are generally good
    return 0.5;
  }

  /**
   * Calculate confidence for percentage fields
   */
  private calculatePercentageFieldConfidence(
    value: unknown,
    _fieldName: string
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value !== "number") return 0.3;
    if (value < -100) return 0.2; // Very negative percentages are suspicious
    if (value > 1000) return 0.3; // Very high percentages need verification
    if (value >= -50 && value <= 100) return 0.9; // Reasonable range
    return 0.6;
  }

  /**
   * Calculate confidence for ratio fields (MOIC, TVPI, etc.)
   */
  private calculateRatioFieldConfidence(
    value: unknown,
    _fieldName: string
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value !== "number") return 0.3;
    if (value < 0) return 0.2; // Negative ratios are usually invalid
    if (value > 100) return 0.4; // Very high ratios need verification
    if (value >= 0 && value <= 10) return 0.9; // Reasonable range
    return 0.7;
  }

  /**
   * Calculate confidence for array fields
   */
  private calculateArrayFieldConfidence(
    array: unknown[],
    _fieldName: string,
    validator: (item: unknown) => boolean
  ): number {
    if (!Array.isArray(array)) return 0;
    if (array.length === 0) return 0.5; // Empty array might be valid

    const validItems = array.filter(validator).length;
    const validityRatio = validItems / array.length;

    return validityRatio;
  }

  /**
   * Validate portfolio company data
   */
  private validatePortfolioCompany(company: unknown): boolean {
    return !!(
      company.name &&
      typeof company.name === "string" &&
      company.name.length > 0
    );
  }

  /**
   * Calculate overall confidence from field confidences
   */
  private calculateOverallConfidence(
    fieldConfidences: Record<string, number>
  ): number {
    const values = Object.values(fieldConfidences);
    if (values.length === 0) return 0;

    // Weight by importance of fields
    const weights: Record<string, number> = {
      fundSize: 0.2,
      fundNAV: 0.2,
      irr: 0.15,
      moic: 0.15,
      tvpi: 0.1,
      portfolioCompanies: 0.2,
    };

    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(fieldConfidences).forEach(([field, confidence]) => {
      const weight = weights[field] || 0.1;
      weightedSum += confidence * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Determine extraction quality based on confidence
   */
  private determineExtractionQuality(
    confidence: number
  ): "high" | "medium" | "low" | "failed" {
    if (confidence >= 0.8) return "high";
    if (confidence >= 0.6) return "medium";
    if (confidence >= 0.3) return "low";
    return "failed";
  }

  /**
   * Generate recommendations based on confidence scores
   */
  private generateRecommendations(
    fieldConfidences: Record<string, number>,
    quality: string
  ): string[] {
    const recommendations: string[] = [];

    // Low confidence fields
    Object.entries(fieldConfidences).forEach(([field, confidence]) => {
      if (confidence < 0.5) {
        recommendations.push(
          `Verify ${field} extraction - low confidence (${(
            confidence * 100
          ).toFixed(0)}%)`
        );
      }
    });

    // Quality-based recommendations
    switch (quality) {
      case "high":
        recommendations.push(
          "Extraction quality is high - proceed with confidence"
        );
        break;
      case "medium":
        recommendations.push(
          "Extraction quality is medium - review critical fields"
        );
        break;
      case "low":
        recommendations.push(
          "Extraction quality is low - manual review recommended"
        );
        break;
      case "failed":
        recommendations.push("Extraction failed - manual processing required");
        break;
    }

    return recommendations;
  }

  /**
   * Generate fallback strategies
   */
  private generateFallbackStrategies(quality: string): string[] {
    switch (quality) {
      case "high":
        return ["No fallback needed - high confidence extraction"];
      case "medium":
        return [
          "Use alternative extraction methods for low-confidence fields",
          "Cross-reference with source document",
          "Apply data validation rules",
        ];
      case "low":
        return [
          "Manual data entry for critical fields",
          "Use template-based extraction",
          "Request document resubmission in better format",
        ];
      case "failed":
        return [
          "Complete manual processing required",
          "Contact document provider for clarification",
          "Use alternative document sources",
        ];
      default:
        return ["Unknown quality - manual review required"];
    }
  }

  /**
   * Handle extraction errors gracefully
   */
  handleExtractionError(error: Error, context: string): ExtractionError {
    return {
      field: context,
      error: error.message,
      severity: "critical",
      suggestedAction: "Manual review required",
    };
  }
}
