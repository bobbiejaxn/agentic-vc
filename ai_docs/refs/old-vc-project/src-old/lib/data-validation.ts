/**
 * Data Validation Service for Fund Metrics
 * Flags obviously incorrect zeros and validates data integrity
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "high" | "medium" | "low";
  actualValue: any;
  expectedValue?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

export class DataValidationService {
  /**
   * Validate fund metrics for obvious data issues
   */
  static validateFundMetrics(fundData: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Check for obviously incorrect zeros
    if (fundData.fundSize && fundData.fundSize > 0) {
      // If fund has size, personal metrics should not be zero unless ownership is 0
      if (
        fundData.personalCommitment === 0 &&
        fundData.ownershipPercentage !== 0
      ) {
        errors.push({
          field: "personalCommitment",
          message:
            "Personal commitment is zero but fund has size and ownership is not zero",
          severity: "high",
          actualValue: 0,
          expectedValue:
            fundData.fundSize * (fundData.ownershipPercentage / 100),
        });
      }

      if (fundData.personalCalled === 0 && fundData.ownershipPercentage !== 0) {
        errors.push({
          field: "personalCalled",
          message:
            "Personal called capital is zero but fund has called capital and ownership is not zero",
          severity: "high",
          actualValue: 0,
          expectedValue:
            fundData.fundCalled * (fundData.ownershipPercentage / 100),
        });
      }

      if (fundData.personalNav === 0 && fundData.ownershipPercentage !== 0) {
        errors.push({
          field: "personalNav",
          message:
            "Personal NAV is zero but fund has NAV and ownership is not zero",
          severity: "high",
          actualValue: 0,
          expectedValue:
            fundData.fundNav * (fundData.ownershipPercentage / 100),
        });
      }
    }

    // Check for missing ownership percentage when fund data exists
    if (fundData.fundSize > 0 && !fundData.ownershipPercentage) {
      warnings.push({
        field: "ownershipPercentage",
        message:
          "Ownership percentage is missing - using default 1% for calculations",
        suggestion:
          "Please provide actual ownership percentage for accurate personal metrics",
      });
      suggestions.push(
        "Add ownership percentage to fund document or provide manual override"
      );
    }

    // Check for data consistency
    if (fundData.personalCalled > fundData.personalCommitment) {
      errors.push({
        field: "personalCalled",
        message: "Personal called capital exceeds personal commitment",
        severity: "high",
        actualValue: fundData.personalCalled,
        expectedValue: `<= ${fundData.personalCommitment}`,
      });
    }

    // Check for unrealistic values
    if (fundData.ownershipPercentage && fundData.ownershipPercentage > 100) {
      errors.push({
        field: "ownershipPercentage",
        message: "Ownership percentage cannot exceed 100%",
        severity: "high",
        actualValue: fundData.ownershipPercentage,
        expectedValue: "<= 100",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Apply data fixes for common issues
   */
  static applyDataFixes(fundData: any): any {
    const fixedData = { ...fundData };

    // Fix missing ownership percentage with reasonable default
    if (!fixedData.ownershipPercentage && fixedData.fundSize > 0) {
      fixedData.ownershipPercentage = 1.0; // Default 1% ownership
      fixedData.dataFixApplied = "default_ownership_percentage";
    }

    // Recalculate personal metrics if ownership percentage was missing
    if (fixedData.dataFixApplied === "default_ownership_percentage") {
      fixedData.personalCommitment =
        fixedData.fundSize * (fixedData.ownershipPercentage / 100);
      fixedData.personalCalled =
        (fixedData.fundCalled || fixedData.cumulativeCalledCapital || 0) *
        (fixedData.ownershipPercentage / 100);
      fixedData.personalNav =
        (fixedData.fundNav || fixedData.fundNAV || 0) *
        (fixedData.ownershipPercentage / 100);
      fixedData.personalDistributions =
        (fixedData.fundDistributions ||
          fixedData.cumulativeDistributions ||
          0) *
        (fixedData.ownershipPercentage / 100);
    }

    return fixedData;
  }

  /**
   * Generate data quality report
   */
  static generateQualityReport(fundData: any): string {
    const validation = this.validateFundMetrics(fundData);

    let report = `# Data Quality Report\n\n`;

    if (validation.isValid) {
      report += `✅ **Data Quality: GOOD**\n`;
    } else {
      report += `❌ **Data Quality: ISSUES FOUND**\n`;
    }

    if (validation.errors.length > 0) {
      report += `\n## Critical Issues (${validation.errors.length})\n`;
      validation.errors.forEach((error) => {
        report += `- **${error.field}**: ${error.message}\n`;
      });
    }

    if (validation.warnings.length > 0) {
      report += `\n## Warnings (${validation.warnings.length})\n`;
      validation.warnings.forEach((warning) => {
        report += `- **${warning.field}**: ${warning.message}\n`;
      });
    }

    if (validation.suggestions.length > 0) {
      report += `\n## Recommendations\n`;
      validation.suggestions.forEach((suggestion) => {
        report += `- ${suggestion}\n`;
      });
    }

    return report;
  }
}
