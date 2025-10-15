/**
 * Image-based Document Extraction
 * Handles image recognition and visual data extraction using Llama Cloud
 * for charts, tables, and embedded visual content in VC portfolio reports.
 */

import { llamaCloud } from "../llama-cloud";
import type {
  ImageExtractionResult,
  ExtractionOptions,
  ExtractionError,
} from "./types/extraction";

/**
 * Process image content extraction using Llama Cloud
 */
export async function processImageExtraction(
  fileBuffer: ArrayBuffer,
  options: ExtractionOptions
): Promise<ImageExtractionResult> {
  if (!options.enableImageRecognition) {
    return createEmptyImageResult();
  }

  try {
    const imageResults = await llamaCloud.extractImages(
      Buffer.from(fileBuffer)
    );

    // Process and categorize image results
    const charts: Record<string, unknown>[] = [];
    const tables: Record<string, unknown>[] = [];
    const textBlocks: Record<string, unknown>[] = [];

    for (const image of imageResults) {
      switch (image.imageType) {
        case "chart":
          charts.push(llamaCloud.extractChartData(image));
          break;
        case "table":
          tables.push(llamaCloud.extractTableData(image));
          break;
        case "text_block":
          textBlocks.push({
            id: `text_${image.coordinates.x}_${image.coordinates.y}`,
            content: image.extractedData?.text || "",
            confidence: image.confidence,
            coordinates: image.coordinates,
            formatting: image.extractedData?.formatting || {
              isBold: false,
              isItalic: false,
              alignment: "left",
            },
          });
          break;
      }
    }

    return {
      totalImages: imageResults.length,
      processedImages: imageResults.filter((img) => img.confidence > 0.5)
        .length,
      images: imageResults,
      charts: charts.filter((chart) => chart !== null),
      tables: tables.filter((table) => table !== null),
      textBlocks: textBlocks.filter((block) => block.content.trim().length > 0),
    };
  } catch (error) {
    throw new ExtractionError(
      `Image extraction failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      "IMAGE_EXTRACTION_FAILED",
      { originalError: error }
    );
  }
}

/**
 * Extract chart data from image recognition results
 */
export function extractCharts(
  imageResult: ImageExtractionResult
): Record<string, unknown>[] {
  return imageResult.charts.filter((chart) => chart !== null);
}

/**
 * Extract table data from image recognition results
 */
export function extractTables(
  imageResult: ImageExtractionResult
): Record<string, unknown>[] {
  return imageResult.tables.filter((table) => table !== null);
}

/**
 * Extract text blocks from image recognition results
 */
export function extractTextBlocks(
  imageResult: ImageExtractionResult
): Record<string, unknown>[] {
  return imageResult.textBlocks.filter(
    (block) => block.content.trim().length > 0
  );
}

/**
 * Validate image extraction quality
 */
export function validateImageExtraction(imageResult: ImageExtractionResult): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (imageResult.totalImages === 0) {
    issues.push("No images detected in document");
  }

  if (imageResult.totalImages > 0 && imageResult.processedImages === 0) {
    issues.push("All image processing attempts failed");
  }

  if (
    imageResult.charts.length === 0 &&
    imageResult.tables.length === 0 &&
    imageResult.textBlocks.length === 0
  ) {
    issues.push("No structured data extracted from images");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Create empty image result for fallback scenarios
 */
export function createEmptyImageResult(): ImageExtractionResult {
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
 * Filter images by confidence threshold
 */
export function filterHighConfidenceImages(
  imageResult: ImageExtractionResult,
  threshold: number = 0.7
): ImageExtractionResult {
  const highConfidenceImages = imageResult.images.filter(
    (img) => img.confidence >= threshold
  );

  return {
    ...imageResult,
    processedImages: highConfidenceImages.length,
    images: highConfidenceImages,
    charts: imageResult.charts.filter((chart) => chart.confidence >= threshold),
    tables: imageResult.tables.filter((table) => table.confidence >= threshold),
    textBlocks: imageResult.textBlocks.filter(
      (block) => block.confidence >= threshold
    ),
  };
}
