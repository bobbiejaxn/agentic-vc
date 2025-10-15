// Validation Agent (LoopAgent)
// Validates extracted data and provides feedback loops for accuracy improvement

import { BaseAgent, AgentContext, AgentResult } from "./base-agent";
import { DataExtractionResult } from "./data-extraction-agent";

export interface ValidationInput {
  extractedData: DataExtractionResult;
  originalText: string;
  documentType: string;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: "required" | "format" | "range" | "custom";
  value?: any;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  validationErrors: ValidationError[];
  suggestions: ValidationSuggestion[];
  qualityScore: number;
  requiresReprocessing: boolean;
}

export interface ValidationError {
  field: string;
  type:
    | "missing"
    | "invalid_format"
    | "out_of_range"
    | "inconsistent"
    | "low_confidence";
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  suggestedFix?: string;
}

export interface ValidationSuggestion {
  field: string;
  suggestion: string;
  confidence: number;
  reasoning: string;
}

export class ValidationAgent extends BaseAgent {
  private maxIterations: number = 3;
  private currentIteration: number = 0;

  constructor(context: AgentContext) {
    super(context);
    this.initializeAgent();
  }

  private initializeAgent(): void {
    this.addSystemMessage(`
You are an expert data validation AI specializing in venture capital and private equity document validation.

Your role is to:
1. Validate extracted data for accuracy and completeness
2. Identify inconsistencies and quality issues
3. Provide feedback for data improvement
4. Determine if reprocessing is needed

Validation Criteria:
- Data completeness and accuracy
- Format consistency and validity
- Logical consistency across fields
- Confidence level assessment
- Business rule compliance

Quality Standards:
- High confidence (>0.8) for critical financial data
- Complete extraction of all relevant fields
- Consistent formatting and data types
- Logical relationships between related fields

Provide detailed feedback and suggestions for improvement.
`);
  }

  async execute(
    input: ValidationInput
  ): Promise<AgentResult<ValidationResult>> {
    try {
      this.currentIteration = 0;
      const validationResult = await this.performValidation(input);

      // Add to conversation history
      this.addUserMessage(`Validate ${input.documentType} extraction`);
      this.addAssistantMessage(
        `Validation complete: ${
          validationResult.isValid ? "PASSED" : "FAILED"
        } (Quality: ${validationResult.qualityScore})`
      );

      return this.createSuccessResult(
        validationResult,
        validationResult.confidence,
        {
          documentType: input.documentType,
          iteration: this.currentIteration,
          requiresReprocessing: validationResult.requiresReprocessing,
        }
      );
    } catch (error) {
      console.error("Validation error:", error);
      return this.createErrorResult(
        `Validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async performValidation(
    input: ValidationInput
  ): Promise<ValidationResult> {
    const prompt = this.createValidationPrompt(input);
    const result = await this.generateStructuredResponse<ValidationResult>(
      prompt,
      this.getValidationSchema()
    );

    // Validate the result structure
    if (!this.validateValidationResult(result)) {
      throw new Error("Invalid validation result structure");
    }

    return result;
  }

  private createValidationPrompt(input: ValidationInput): string {
    const documentTypeRules = this.getDocumentTypeValidationRules(
      input.documentType
    );

    return `
Validate the following extracted data from a ${input.documentType} document:

EXTRACTED DATA:
${JSON.stringify(input.extractedData, null, 2)}

ORIGINAL TEXT PREVIEW:
${input.originalText.substring(0, 1000)}...

${documentTypeRules}

VALIDATION REQUIREMENTS:
1. Check data completeness and accuracy
2. Validate format consistency and data types
3. Identify logical inconsistencies
4. Assess confidence levels
5. Check business rule compliance
6. Provide specific improvement suggestions

Focus on:
- Financial data accuracy and completeness
- Date format consistency
- Numeric value validity
- Entity name accuracy
- Table structure completeness
- Form field extraction quality

Return detailed validation results with specific errors and suggestions.
`;
  }

  private getDocumentTypeValidationRules(documentType: string): string {
    switch (documentType) {
      case "fund_report":
        return `
FUND REPORT VALIDATION RULES:
- IRR should be a percentage (0-100)
- MOIC should be a positive number (typically 1.0-10.0)
- Investment amounts should be positive numbers
- Investment dates should be valid dates
- Company name should be present and meaningful
- Performance metrics should be consistent
- Tables should have proper headers and data rows
`;

      case "cap_table":
        return `
CAP TABLE VALIDATION RULES:
- Ownership percentages should sum to 100% (approximately)
- Share counts should be positive integers
- Valuation should be positive number
- Share prices should be positive numbers
- Shareholder names should be present
- Share types should be valid (common, preferred, options)
`;

      case "financial_statement":
        return `
FINANCIAL STATEMENT VALIDATION RULES:
- Revenue should be positive number
- Assets = Liabilities + Equity (balance sheet equation)
- Net Income = Revenue - Expenses
- All financial figures should be consistent
- Reporting period should be valid
- Company name should be present
`;

      default:
        return `
GENERAL VALIDATION RULES:
- All extracted data should be meaningful
- Dates should be in valid format
- Numbers should be properly formatted
- Text fields should not be empty
- Confidence levels should be reasonable
- Tables should have proper structure
`;
    }
  }

  private getValidationSchema(): Record<string, any> {
    return {
      isValid: { type: "boolean" },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      validationErrors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: { type: "string" },
            type: {
              type: "string",
              enum: [
                "missing",
                "invalid_format",
                "out_of_range",
                "inconsistent",
                "low_confidence",
              ],
            },
            message: { type: "string" },
            severity: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
            },
            suggestedFix: { type: "string" },
          },
        },
      },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: { type: "string" },
            suggestion: { type: "string" },
            confidence: { type: "number" },
            reasoning: { type: "string" },
          },
        },
      },
      qualityScore: { type: "number", minimum: 0, maximum: 1 },
      requiresReprocessing: { type: "boolean" },
    };
  }

  private validateValidationResult(result: ValidationResult): boolean {
    return (
      typeof result.isValid === "boolean" &&
      typeof result.confidence === "number" &&
      result.confidence >= 0 &&
      result.confidence <= 1 &&
      Array.isArray(result.validationErrors) &&
      Array.isArray(result.suggestions) &&
      typeof result.qualityScore === "number" &&
      result.qualityScore >= 0 &&
      result.qualityScore <= 1 &&
      typeof result.requiresReprocessing === "boolean"
    );
  }

  /**
   * Perform iterative validation with feedback loop
   */
  public async validateWithFeedback(
    input: ValidationInput,
    onIteration?: (
      iteration: number,
      result: ValidationResult
    ) => Promise<DataExtractionResult | null>
  ): Promise<ValidationResult> {
    let currentData = input.extractedData;
    let validationResult: ValidationResult;

    for (
      this.currentIteration = 0;
      this.currentIteration < this.maxIterations;
      this.currentIteration++
    ) {
      // Perform validation
      validationResult = await this.performValidation({
        ...input,
        extractedData: currentData,
      });

      // If validation passes or no reprocessing needed, return result
      if (validationResult.isValid || !validationResult.requiresReprocessing) {
        break;
      }

      // If callback provided, attempt to improve data
      if (onIteration) {
        const improvedData = await onIteration(
          this.currentIteration,
          validationResult
        );
        if (improvedData) {
          currentData = improvedData;
        } else {
          // No improvement possible, break loop
          break;
        }
      } else {
        // No improvement mechanism, break loop
        break;
      }
    }

    return validationResult!;
  }

  /**
   * Get validation summary for reporting
   */
  public getValidationSummary(result: ValidationResult): string {
    const errorCount = result.validationErrors.length;
    const criticalErrors = result.validationErrors.filter(
      (e) => e.severity === "critical"
    ).length;
    const highErrors = result.validationErrors.filter(
      (e) => e.severity === "high"
    ).length;

    return `
Validation Summary:
- Status: ${result.isValid ? "PASSED" : "FAILED"}
- Quality Score: ${(result.qualityScore * 100).toFixed(1)}%
- Total Errors: ${errorCount}
- Critical Errors: ${criticalErrors}
- High Priority Errors: ${highErrors}
- Requires Reprocessing: ${result.requiresReprocessing ? "YES" : "NO"}
- Suggestions: ${result.suggestions.length}
`;
  }
}
