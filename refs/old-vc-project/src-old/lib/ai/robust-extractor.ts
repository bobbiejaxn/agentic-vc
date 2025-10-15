/**
 * Robust Extraction Service
 *
 * Uses regex-first approach with LLM fallback validation
 * Never trusts regex alone - always validates with LLM when regex fails
 */

export interface ExtractionResult {
  value: unknown;
  confidence: number;
  method: "regex" | "llm" | "failed";
  validation: {
    isMissing: boolean;
    llmConfirmation: string;
    suggestedValue?: unknown;
  };
}

export interface FieldExtractionConfig {
  fieldName: string;
  regexPatterns: RegExp[];
  llmPrompt: string;
  expectedType: "number" | "string" | "array" | "object";
  validationRules?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
}

export class RobustExtractor {
  private llmService: unknown; // Will be injected

  constructor(llmService?: unknown) {
    this.llmService = llmService;
  }

  /**
   * Extract field with regex-first, LLM-fallback strategy
   */
  async extractField(
    text: string,
    config: FieldExtractionConfig
  ): Promise<ExtractionResult> {
    // Step 1: Try regex extraction
    const regexResult = this.tryRegexExtraction(text, config);

    if (regexResult.success) {
      // Step 2: Validate regex result with LLM
      const validation = await this.validateWithLLM(
        text,
        config,
        regexResult.value,
        "regex"
      );

      return {
        value: regexResult.value,
        confidence: regexResult.confidence,
        method: "regex",
        validation,
      };
    }

    // Step 3: Regex failed - use LLM extraction
    const llmResult = await this.extractWithLLM(text, config);

    if (llmResult.success) {
      return {
        value: llmResult.value,
        confidence: llmResult.confidence,
        method: "llm",
        validation: llmResult.validation,
      };
    }

    // Step 4: Both methods failed
    return {
      value: null,
      confidence: 0,
      method: "failed",
      validation: {
        isMissing: true,
        llmConfirmation: "Field not found in document",
        suggestedValue: null,
      },
    };
  }

  /**
   * Try regex extraction first
   */
  private tryRegexExtraction(
    text: string,
    config: FieldExtractionConfig
  ): { success: boolean; value: unknown; confidence: number } {
    for (const pattern of config.regexPatterns) {
      const match = text.match(pattern);
      if (match) {
        const extractedValue = this.parseExtractedValue(
          match,
          config.expectedType
        );
        if (this.validateExtractedValue(extractedValue, config)) {
          return {
            success: true,
            value: extractedValue,
            confidence: 0.8, // High confidence for regex matches
          };
        }
      }
    }

    return { success: false, value: null, confidence: 0 };
  }

  /**
   * Extract using LLM when regex fails
   */
  private async extractWithLLM(
    text: string,
    config: FieldExtractionConfig
  ): Promise<{
    success: boolean;
    value: unknown;
    confidence: number;
    validation: Record<string, unknown>;
  }> {
    if (!this.llmService) {
      return {
        success: false,
        value: null,
        confidence: 0,
        validation: {
          isMissing: true,
          llmConfirmation: "LLM service not available",
          suggestedValue: null,
        },
      };
    }

    try {
      const prompt = this.buildLLMPrompt(text, config);
      const response = await this.llmService.generateText(prompt);

      const parsedResponse = this.parseLLMResponse(response, config);

      if (parsedResponse.success) {
        return {
          success: true,
          value: parsedResponse.value,
          confidence: 0.7, // Medium confidence for LLM extraction
          validation: {
            isMissing: false,
            llmConfirmation: "LLM successfully extracted field",
            suggestedValue: parsedResponse.value,
          },
        };
      }
    } catch (_error) {
      console.error(`LLM extraction failed for ${config.fieldName}`);
    }

    return {
      success: false,
      value: null,
      confidence: 0,
      validation: {
        isMissing: true,
        llmConfirmation: "LLM extraction failed",
        suggestedValue: null,
      },
    };
  }

  /**
   * Validate regex result with LLM
   */
  private async validateWithLLM(
    text: string,
    config: FieldExtractionConfig,
    regexValue: unknown,
    _method: string
  ): Promise<Record<string, unknown>> {
    if (!this.llmService) {
      return {
        isMissing: false,
        llmConfirmation: "LLM validation not available",
        suggestedValue: regexValue,
      };
    }

    try {
      const validationPrompt = this.buildValidationPrompt(
        text,
        config,
        regexValue
      );
      const response = await this.llmService.generateText(validationPrompt);

      const validation = this.parseValidationResponse(response);

      return {
        isMissing: validation.isMissing,
        llmConfirmation: validation.confirmation,
        suggestedValue: validation.suggestedValue || regexValue,
      };
    } catch (error) {
      console.error(`LLM validation failed for ${config.fieldName}:`, error);
      return {
        isMissing: false,
        llmConfirmation: "LLM validation failed",
        suggestedValue: regexValue,
      };
    }
  }

  /**
   * Parse extracted value based on expected type
   */
  private parseExtractedValue(
    match: RegExpMatchArray,
    expectedType: string
  ): unknown {
    const rawValue = match[1] || match[0];

    switch (expectedType) {
      case "number":
        return parseFloat(rawValue.replace(/,/g, ""));
      case "string":
        return rawValue.trim();
      case "array":
        return rawValue.split(",").map((item) => item.trim());
      case "object":
        try {
          return JSON.parse(rawValue);
        } catch {
          return { value: rawValue };
        }
      default:
        return rawValue;
    }
  }

  /**
   * Validate extracted value against rules
   */
  private validateExtractedValue(
    value: unknown,
    config: FieldExtractionConfig
  ): boolean {
    if (value === null || value === undefined) return false;

    const rules = config.validationRules;
    if (!rules) return true;

    if (rules.required && (value === null || value === undefined)) return false;

    if (typeof value === "number") {
      if (rules.min !== undefined && value < rules.min) return false;
      if (rules.max !== undefined && value > rules.max) return false;
    }

    return true;
  }

  /**
   * Build LLM prompt for extraction
   */
  private buildLLMPrompt(text: string, config: FieldExtractionConfig): string {
    return `
Extract the ${config.fieldName} from this financial document.

Document text:
${text.substring(0, 2000)}...

Field: ${config.fieldName}
Expected type: ${config.expectedType}
${
  config.validationRules
    ? `Validation rules: ${JSON.stringify(config.validationRules)}`
    : ""
}

Please extract the ${
      config.fieldName
    } value. If the field is not present or unclear, respond with "NOT_FOUND".
If found, respond with just the value in the expected format.

Response format:
- If found: [value]
- If not found: NOT_FOUND
`;
  }

  /**
   * Build LLM prompt for validation
   */
  private buildValidationPrompt(
    text: string,
    config: FieldExtractionConfig,
    regexValue: unknown
  ): string {
    return `
Validate this extracted ${config.fieldName} value from a financial document.

Document text:
${text.substring(0, 2000)}...

Extracted value: ${regexValue}
Field: ${config.fieldName}
Expected type: ${config.expectedType}

Please confirm:
1. Is this value correct for the ${config.fieldName} field?
2. Is the field actually present in the document?
3. If incorrect, what should the correct value be?

Respond in JSON format:
{
  "isCorrect": true/false,
  "isPresent": true/false,
  "correctValue": "actual_value_or_null",
  "confidence": 0.0-1.0,
  "reasoning": "explanation"
}
`;
  }

  /**
   * Parse LLM response for extraction
   */
  private parseLLMResponse(
    response: string,
    config: FieldExtractionConfig
  ): {
    success: boolean;
    value: unknown;
  } {
    if (response.includes("NOT_FOUND") || response.trim() === "") {
      return { success: false, value: null };
    }

    try {
      const parsedValue = this.parseExtractedValue(
        [response],
        config.expectedType
      );
      return { success: true, value: parsedValue };
    } catch (error) {
      return { success: false, value: null };
    }
  }

  /**
   * Parse LLM validation response
   */
  private parseValidationResponse(response: string): Record<string, unknown> {
    try {
      const parsed = JSON.parse(response);
      return {
        isMissing: !parsed.isPresent,
        confirmation: parsed.reasoning,
        suggestedValue: parsed.correctValue,
      };
    } catch (_error) {
      return {
        isMissing: true,
        confirmation: "Failed to parse LLM validation response",
        suggestedValue: null,
      };
    }
  }
}
