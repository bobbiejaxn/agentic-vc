/**
 * Llama Cloud API Integration
 * Provides multimodal document processing capabilities including image recognition
 * and advanced visual data extraction for VC portfolio reports.
 */

export interface LlamaCloudConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
}

export interface ImageRecognitionResult {
  imageType: "chart" | "table" | "logo" | "text_block" | "unknown";
  confidence: number;
  extractedData: Record<string, unknown>;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  processingTime: number;
}

export interface MultimodalProcessingResult {
  documentId: string;
  textExtraction: Record<string, unknown>; // From existing Llama Parse
  imageExtractions: ImageRecognitionResult[];
  processingMetadata: {
    totalImages: number;
    processedImages: number;
    processingTime: number;
    confidence: number;
  };
  errors: string[];
}

export class LlamaCloudService {
  private config: LlamaCloudConfig;

  constructor(config?: Partial<LlamaCloudConfig>) {
    this.config = {
      apiKey: process.env.LLAMA_CLOUD_API_KEY || "",
      baseUrl:
        process.env.LLAMA_CLOUD_BASE_URL || "https://api.llama-cloud.com",
      timeout: 30000,
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error("Llama Cloud API key is required");
    }
  }

  /**
   * Extract images and visual data from document
   */
  async extractImages(fileBuffer: Buffer): Promise<ImageRecognitionResult[]> {
    try {
      const formData = new FormData();
      const blob = new Blob([fileBuffer], { type: "application/pdf" });
      formData.append("file", blob, "document.pdf");
      formData.append("extract_images", "true");

      const response = await fetch(`${this.config.baseUrl}/v1/extract`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: formData,
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        throw new Error(
          `Llama Cloud API error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Process and structure the image extraction results
      return this.processImageResults(result);
    } catch (error) {
      console.error("Llama Cloud image extraction failed:", error);
      throw new Error(
        `Image extraction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Process raw Llama Cloud response into structured image results
   */
  private processImageResults(rawResult: Record<string, unknown>): ImageRecognitionResult[] {
    const results: ImageRecognitionResult[] = [];

    if (!rawResult.images || !Array.isArray(rawResult.images)) {
      return results;
    }

    for (const image of rawResult.images) {
      try {
        const imageResult: ImageRecognitionResult = {
          imageType: this.classifyImageType(image),
          confidence: image.confidence || 0.5,
          extractedData: image.data || {},
          coordinates: image.coordinates || { x: 0, y: 0, width: 0, height: 0 },
          processingTime: image.processingTime || 0,
        };

        results.push(imageResult);
      } catch (error) {
        console.warn("Failed to process image result:", error);
      }
    }

    return results;
  }

  /**
   * Classify image type based on content and structure
   */
  private classifyImageType(
    image: Record<string, unknown>
  ): "chart" | "table" | "logo" | "text_block" | "unknown" {
    // Analyze image content to determine type
    if (image.type === "chart" || (image.data && image.data.chartType)) {
      return "chart";
    }

    if (image.type === "table" || (image.data && image.data.headers)) {
      return "table";
    }

    if (image.type === "logo" || (image.data && image.data.logo)) {
      return "logo";
    }

    if (image.content && image.content.length > 0) {
      return "text_block";
    }

    return "unknown";
  }

  /**
   * Extract chart data from image recognition results
   */
  extractChartData(imageResult: ImageRecognitionResult): Record<string, unknown> | null {
    if (imageResult.imageType !== "chart" || !imageResult.extractedData) {
      return null;
    }

    return {
      chartType: imageResult.extractedData.chartType || "unknown",
      title: imageResult.extractedData.title || "",
      data: imageResult.extractedData.data || [],
      labels: imageResult.extractedData.labels || [],
      confidence: imageResult.confidence,
    };
  }

  /**
   * Extract table data from image recognition results
   */
  extractTableData(imageResult: ImageRecognitionResult): Record<string, unknown> | null {
    if (imageResult.imageType !== "table" || !imageResult.extractedData) {
      return null;
    }

    return {
      headers: imageResult.extractedData.headers || [],
      rows: imageResult.extractedData.rows || [],
      confidence: imageResult.confidence,
      rowCount: imageResult.extractedData.rows?.length || 0,
      columnCount: imageResult.extractedData.headers?.length || 0,
    };
  }

  /**
   * Validate Llama Cloud service connectivity
   */
  async validateConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        signal: AbortSignal.timeout(5000),
      });

      return response.ok;
    } catch (error) {
      console.error("Llama Cloud connectivity check failed:", error);
      return false;
    }
  }

  /**
   * Get service configuration and limits
   */
  async getServiceLimits(): Promise<Record<string, unknown> | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/limits`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error("Failed to get service limits:", error);
      return null;
    }
  }
}

// Singleton instance for the application
export const llamaCloud = new LlamaCloudService();
