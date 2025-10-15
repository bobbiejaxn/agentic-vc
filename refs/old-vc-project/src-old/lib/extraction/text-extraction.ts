/**
 * Text-based Document Extraction
 * Handles text extraction using existing Llama Parse integration
 * and provides structured text processing for VC portfolio analysis.
 */

import { llamaParse } from "../ai/llama-parse";
import type { TextExtractionResult, ExtractionError } from "./types/extraction";

/**
 * Process text content extraction using Llama Parse
 */
export async function processTextExtraction(
  fileBuffer: ArrayBuffer
): Promise<TextExtractionResult> {
  try {
    const result = await llamaParse.parse({
      file: new Blob([fileBuffer]),
      targetPages: "all",
      format: "json",
    });

    // Transform Llama Parse result to our TextExtractionResult format
    return {
      content: result.content || "",
      pages: result.pages || [],
      metadata: {
        totalPages: result.pages?.length || 0,
        language: "en", // Llama Parse doesn't provide language detection
        encoding: "utf-8",
      },
    };
  } catch (error) {
    throw new ExtractionError(
      `Text extraction failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      "TEXT_EXTRACTION_FAILED",
      { originalError: error }
    );
  }
}

/**
 * Extract raw text content from extraction results
 */
export function extractRawText(textResult: TextExtractionResult): string {
  return (
    textResult.content + " " + textResult.pages.map((p) => p.content).join(" ")
  );
}

/**
 * Extract text by page for detailed analysis
 */
export function extractTextByPage(
  textResult: TextExtractionResult
): Array<{ page: number; content: string; confidence: number }> {
  return textResult.pages.map((page) => ({
    page: page.pageNumber,
    content: page.content,
    confidence: page.confidence || 0.5,
  }));
}

/**
 * Validate text extraction quality
 */
export function validateTextExtraction(textResult: TextExtractionResult): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!textResult.content || textResult.content.trim().length === 0) {
    issues.push("No text content extracted");
  }

  if (textResult.pages.length === 0) {
    issues.push("No page data available");
  }

  if (textResult.content.length < 100) {
    issues.push("Very short text content - may indicate extraction issues");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
