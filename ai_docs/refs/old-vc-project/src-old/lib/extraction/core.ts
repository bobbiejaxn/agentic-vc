/**
 * Core Enhanced Extraction Service
 * Orchestrates multimodal document processing by coordinating text and image extraction
 * with cross-validation and quality assessment.
 */

import { processTextExtraction } from "./text-extraction";
import { processImageExtraction } from "./image-extraction";
import { crossValidateResults } from "./validation";
import { calculateQualityMetrics } from "./quality-metrics";
import { parseVCPortfolioData } from "./data-parsers";
import type {
  EnhancedExtractionResult,
  TextExtractionResult,
  ImageExtractionResult,
  ExtractionOptions,
  ExtractionError,
} from "./types/extraction";

export class EnhancedExtractionService {
  private defaultOptions: ExtractionOptions = {
    enableImageRecognition: true,
    enableCrossValidation: true,
    confidenceThreshold: 0.7,
    maxProcessingTime: 30000,
    fallbackToTextOnly: true,
    validateAgainstExistingData: false,
  };

  /**
   * Process document with enhanced multimodal extraction
   */
  async processDocumentWithMultimodal(
    file: File,
    options?: Partial<ExtractionOptions>
  ): Promise<EnhancedExtractionResult> {
    const startTime = Date.now();
    const processingOptions = { ...this.defaultOptions, ...options };

    try {
      // Step 1: Convert File to Buffer for processing
      const fileBuffer = await file.arrayBuffer();

      // Step 2: Text extraction (existing Llama Parse)
      const textResult = await processTextExtraction(fileBuffer);

      // Step 3: Image recognition (Llama Cloud)
      let imageResult: ImageExtractionResult;
      try {
        imageResult = await processImageExtraction(
          fileBuffer,
          processingOptions
        );
      } catch (error) {
        console.warn(
          "Image extraction failed, falling back to text-only:",
          error
        );
        imageResult = this.createEmptyImageResult();
      }

      // Step 4: Cross-validation between text and image sources
      const validationResults = processingOptions.enableCrossValidation
        ? await crossValidateResults(textResult, imageResult)
        : [];

      // Step 5: Parse and combine results into VC portfolio data
      const finalData = await parseVCPortfolioData(
        textResult,
        imageResult,
        validationResults
      );

      // Step 6: Calculate comprehensive quality metrics
      const qualityMetrics = await calculateQualityMetrics(
        textResult,
        imageResult,
        validationResults,
        finalData
      );

      const processingTime = Date.now() - startTime;

      return {
        documentId: `doc_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        textExtraction: textResult,
        imageExtraction: imageResult,
        validation: validationResults,
        finalData,
        qualityMetrics,
        processingTime,
        confidence: qualityMetrics.overallConfidence,
        errors: this.collectErrors(textResult, imageResult),
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          processingDate: new Date().toISOString(),
          extractionVersion: "1.0.0-multimodal",
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      // Fallback to text-only processing if enabled
      if (processingOptions.fallbackToTextOnly) {
        console.warn(
          "Enhanced extraction failed, falling back to text-only processing"
        );
        return await this.processTextOnly(file, processingTime);
      }

      throw new ExtractionError(
        `Enhanced extraction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "EXTRACTION_FAILED",
        { originalError: error, processingTime }
      );
    }
  }

  /**
   * Process document with text-only extraction (fallback)
   */
  private async processTextOnly(
    file: File,
    processingTime: number
  ): Promise<EnhancedExtractionResult> {
    const fileBuffer = await file.arrayBuffer();
    const textResult = await processTextExtraction(fileBuffer);

    return {
      documentId: `doc_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      textExtraction: textResult,
      imageExtraction: this.createEmptyImageResult(),
      validation: [],
      finalData: await parseVCPortfolioData(
        textResult,
        this.createEmptyImageResult(),
        []
      ),
      qualityMetrics: this.calculateFallbackQualityMetrics(),
      processingTime,
      confidence: 0.6, // Lower confidence for text-only
      errors: ["Enhanced extraction failed - using text-only fallback"],
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        processingDate: new Date().toISOString(),
        extractionVersion: "1.0.0-text-only-fallback",
      },
    };
  }

  /**
   * Create empty image result for fallback scenarios
   */
  private createEmptyImageResult(): ImageExtractionResult {
    return {
      totalImages: 0,
      processedImages: 0,
      images: [],
      charts: [],
      tables: [],
      textBlocks: [],
    };
  }

  /**
   * Calculate fallback quality metrics
   */
  private calculateFallbackQualityMetrics(): QualityMetrics {
    return {
      overallConfidence: 0.6,
      dataCompleteness: 0.7,
      extractionAccuracy: 0.6,
      validationScore: 0.5,
      processingReliability: 0.8,
      fieldConfidence: {},
      issues: [
        {
          type: "missing_data",
          field: "multimodal_processing",
          severity: "medium",
          description: "Enhanced extraction failed - using text-only fallback",
          suggestedAction:
            "Check Llama Cloud service availability and API credentials",
        },
      ],
    };
  }

  /**
   * Collect errors from text and image processing
   */
  private collectErrors(
    textResult: TextExtractionResult,
    imageResult: ImageExtractionResult
  ): string[] {
    const errors: string[] = [];

    if (!textResult.content || textResult.content.length === 0) {
      errors.push("No text content extracted from document");
    }

    if (imageResult.processedImages === 0 && imageResult.totalImages > 0) {
      errors.push("Image processing failed for all detected images");
    }

    return errors;
  }
}

// Export singleton instance
export const enhancedExtraction = new EnhancedExtractionService();
