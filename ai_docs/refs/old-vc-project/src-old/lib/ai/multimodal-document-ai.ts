// Multi-modal Google Cloud Document AI implementation
// Supports text extraction, table parsing, form parsing, and layout analysis

import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

// Initialize Google Cloud clients
const documentAI = new DocumentProcessorServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export interface MultiModalProcessingRequest {
  file: File;
  documentType: string;
  portfolioId?: string;
  userId: string;
}

export interface ExtractedTable {
  headers: string[];
  rows: string[][];
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedFormField {
  fieldName: string;
  fieldValue: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DocumentLayout {
  pages: Array<{
    pageNumber: number;
    blocks: Array<{
      type: "text" | "table" | "image" | "form";
      content: string;
      confidence: number;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
  }>;
}

export interface MultiModalExtractedData {
  // Basic text extraction
  rawText: string;
  confidence: number;
  pageCount: number;

  // Layout analysis
  layout?: DocumentLayout;

  // Table extraction
  tables: ExtractedTable[];

  // Form field extraction
  formFields: ExtractedFormField[];

  // Enhanced entity extraction
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;

  // Document-specific data
  companyName?: string;
  totalValue?: number;
  investmentAmount?: number;
  ownershipPercentage?: number;
  irr?: number;
  moic?: number;
  investmentDate?: string;
  sector?: string;
  stage?: string;
  status?: string;
  notes?: string;

  // Metadata
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export interface MultiModalProcessingResult {
  success: boolean;
  extractedData?: MultiModalExtractedData;
  processingTime?: number;
  error?: string;
}

export class MultiModalDocumentAI {
  private projectId: string;
  private location: string;
  private bucketName: string;

  // Different processor types for different capabilities
  private processors: {
    formParser?: string;
    tableParser?: string;
    layoutParser?: string;
    generalProcessor?: string;
  };

  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || "vc-fund-464919";
    this.location = process.env.DOCUMENT_AI_LOCATION || "us-central1";
    this.bucketName =
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "vc-fund-documents-464919";

    // Initialize processor IDs from environment
    this.processors = {
      formParser: process.env.DOCUMENT_AI_FORM_PROCESSOR_ID,
      tableParser: process.env.DOCUMENT_AI_TABLE_PROCESSOR_ID,
      layoutParser: process.env.DOCUMENT_AI_LAYOUT_PROCESSOR_ID,
      generalProcessor: process.env.DOCUMENT_AI_PROCESSOR_ID,
    };
  }

  /**
   * Process a document using multi-modal Document AI capabilities
   */
  async processDocument(
    request: MultiModalProcessingRequest
  ): Promise<MultiModalProcessingResult> {
    const startTime = Date.now();

    try {
      // Validate configuration
      if (!this.hasValidProcessors()) {
        throw new Error("No valid Document AI processors configured");
      }

      // Upload file to Cloud Storage
      const fileName = `${uuidv4()}-${request.file.name}`;
      const filePath = await this.uploadToStorage(request.file, fileName);

      // Process document with multiple processors
      const extractedData = await this.processWithMultipleProcessors(
        filePath,
        request.file.type
      );

      // Clean up temporary file
      await this.deleteFromStorage(fileName);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        extractedData,
        processingTime,
      };
    } catch (error) {
      console.error("Multi-modal Document AI processing error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Process document with multiple specialized processors
   */
  private async processWithMultipleProcessors(
    filePath: string,
    mimeType: string
  ): Promise<MultiModalExtractedData> {
    const fileContent = await this.getFileContent(filePath);

    // Initialize result structure
    const result: MultiModalExtractedData = {
      rawText: "",
      confidence: 0,
      pageCount: 0,
      tables: [],
      formFields: [],
      entities: [],
    };

    // Process with general processor for basic text and layout
    if (this.processors.generalProcessor) {
      const generalResult = await this.processWithProcessor(
        this.processors.generalProcessor,
        fileContent,
        mimeType
      );

      if (generalResult) {
        result.rawText = generalResult.text || "";
        result.confidence = generalResult.confidence || 0;
        result.pageCount = generalResult.pageCount || 0;
        result.layout = generalResult.layout;
        result.entities = generalResult.entities || [];
        result.metadata = generalResult.metadata;
      }
    }

    // Process with form parser for structured data
    if (this.processors.formParser) {
      const formResult = await this.processWithProcessor(
        this.processors.formParser,
        fileContent,
        mimeType
      );

      if (formResult && formResult.formFields) {
        result.formFields = formResult.formFields;
      }
    }

    // Process with table parser for tabular data
    if (this.processors.tableParser) {
      const tableResult = await this.processWithProcessor(
        this.processors.tableParser,
        fileContent,
        mimeType
      );

      if (tableResult && tableResult.tables) {
        result.tables = tableResult.tables;
      }
    }

    // Process with layout parser for document structure
    if (this.processors.layoutParser) {
      const layoutResult = await this.processWithProcessor(
        this.processors.layoutParser,
        fileContent,
        mimeType
      );

      if (layoutResult && layoutResult.layout) {
        result.layout = layoutResult.layout;
      }
    }

    // Extract document-specific entities
    this.extractDocumentSpecificData(result, request.documentType);

    return result;
  }

  /**
   * Process document with a specific processor
   */
  private async processWithProcessor(
    processorId: string,
    fileContent: Buffer,
    mimeType: string
  ): Promise<any> {
    const name = `projects/${this.projectId}/locations/${this.location}/processors/${processorId}`;

    const request = {
      name,
      rawDocument: {
        content: fileContent,
        mimeType: mimeType,
      },
      // Enable advanced processing options
      processOptions: {
        layoutAnalysis: true,
        tableExtraction: true,
        formExtraction: true,
        entityExtraction: true,
      },
    };

    try {
      const [result] = await documentAI.processDocument(request);
      return this.parseProcessorResult(result);
    } catch (error) {
      console.error(`Error processing with processor ${processorId}:`, error);
      return null;
    }
  }

  /**
   * Parse processor result into structured data
   */
  private parseProcessorResult(result: any): any {
    const { document } = result;

    if (!document) {
      return null;
    }

    const parsed = {
      text: document.text || "",
      confidence: 0.95,
      pageCount: document.pages?.length || 0,
      entities: [],
      tables: [],
      formFields: [],
      layout: null,
      metadata: null,
    };

    // Parse entities
    if (document.entities) {
      parsed.entities = document.entities.map((entity: any) => ({
        type: entity.type || "",
        value: entity.mentionText || entity.normalizedValue?.text || "",
        confidence: entity.confidence || 0,
        boundingBox: this.parseBoundingBox(entity.boundingPoly),
      }));
    }

    // Parse tables
    if (document.pages) {
      for (const page of document.pages) {
        if (page.tables) {
          for (const table of page.tables) {
            const extractedTable = this.extractTable(table);
            if (extractedTable) {
              parsed.tables.push(extractedTable);
            }
          }
        }
      }
    }

    // Parse form fields
    if (document.pages) {
      for (const page of document.pages) {
        if (page.formFields) {
          for (const field of page.formFields) {
            const extractedField = this.extractFormField(field);
            if (extractedField) {
              parsed.formFields.push(extractedField);
            }
          }
        }
      }
    }

    // Parse layout
    if (document.pages) {
      parsed.layout = this.parseDocumentLayout(document.pages);
    }

    // Parse metadata
    if (document.textStyles || document.pageNumber) {
      parsed.metadata = this.parseDocumentMetadata(document);
    }

    return parsed;
  }

  /**
   * Extract table data from Document AI table structure
   */
  private extractTable(table: any): ExtractedTable | null {
    try {
      const headers: string[] = [];
      const rows: string[][] = [];

      if (table.headerRows && table.headerRows.length > 0) {
        for (const cell of table.headerRows[0].cells) {
          headers.push(cell.layout?.textAnchor?.content || "");
        }
      }

      if (table.bodyRows) {
        for (const row of table.bodyRows) {
          const rowData: string[] = [];
          for (const cell of row.cells) {
            rowData.push(cell.layout?.textAnchor?.content || "");
          }
          rows.push(rowData);
        }
      }

      return {
        headers,
        rows,
        confidence: table.confidence || 0.8,
        boundingBox: this.parseBoundingBox(table.boundingPoly),
      };
    } catch (error) {
      console.error("Error extracting table:", error);
      return null;
    }
  }

  /**
   * Extract form field data from Document AI form field structure
   */
  private extractFormField(field: any): ExtractedFormField | null {
    try {
      const fieldName = field.fieldName?.textAnchor?.content || "";
      const fieldValue = field.fieldValue?.textAnchor?.content || "";

      if (!fieldName && !fieldValue) {
        return null;
      }

      return {
        fieldName,
        fieldValue,
        confidence: field.confidence || 0.8,
        boundingBox: this.parseBoundingBox(field.boundingPoly),
      };
    } catch (error) {
      console.error("Error extracting form field:", error);
      return null;
    }
  }

  /**
   * Parse document layout from Document AI pages
   */
  private parseDocumentLayout(pages: any[]): DocumentLayout {
    const layout: DocumentLayout = {
      pages: pages.map((page, index) => ({
        pageNumber: index + 1,
        blocks: this.parsePageBlocks(page),
      })),
    };

    return layout;
  }

  /**
   * Parse blocks from a page
   */
  private parsePageBlocks(page: any): Array<{
    type: "text" | "table" | "image" | "form";
    content: string;
    confidence: number;
    boundingBox?: any;
  }> {
    const blocks: any[] = [];

    // Add text blocks
    if (page.paragraphs) {
      for (const paragraph of page.paragraphs) {
        blocks.push({
          type: "text",
          content: paragraph.layout?.textAnchor?.content || "",
          confidence: paragraph.confidence || 0.8,
          boundingBox: this.parseBoundingBox(paragraph.boundingPoly),
        });
      }
    }

    // Add table blocks
    if (page.tables) {
      for (const table of page.tables) {
        blocks.push({
          type: "table",
          content: `Table with ${table.bodyRows?.length || 0} rows`,
          confidence: table.confidence || 0.8,
          boundingBox: this.parseBoundingBox(table.boundingPoly),
        });
      }
    }

    // Add form blocks
    if (page.formFields) {
      for (const field of page.formFields) {
        blocks.push({
          type: "form",
          content: `${field.fieldName?.textAnchor?.content || ""}: ${
            field.fieldValue?.textAnchor?.content || ""
          }`,
          confidence: field.confidence || 0.8,
          boundingBox: this.parseBoundingBox(field.boundingPoly),
        });
      }
    }

    return blocks;
  }

  /**
   * Parse bounding box from Document AI bounding poly
   */
  private parseBoundingBox(boundingPoly: any): any {
    if (
      !boundingPoly ||
      !boundingPoly.vertices ||
      boundingPoly.vertices.length < 2
    ) {
      return undefined;
    }

    const vertices = boundingPoly.vertices;
    const x = Math.min(...vertices.map((v: any) => v.x || 0));
    const y = Math.min(...vertices.map((v: any) => v.y || 0));
    const width = Math.max(...vertices.map((v: any) => v.x || 0)) - x;
    const height = Math.max(...vertices.map((v: any) => v.y || 0)) - y;

    return { x, y, width, height };
  }

  /**
   * Parse document metadata
   */
  private parseDocumentMetadata(document: any): any {
    return {
      title: document.textStyles?.[0]?.textStyle?.fontSize || undefined,
      // Add more metadata parsing as needed
    };
  }

  /**
   * Extract document-specific data based on document type
   */
  private extractDocumentSpecificData(
    data: MultiModalExtractedData,
    documentType: string
  ): void {
    // Extract from entities
    for (const entity of data.entities) {
      const fieldName = entity.type?.toLowerCase().replace(/\s+/g, "");
      const value = entity.value;

      if (value) {
        switch (fieldName) {
          case "companyname":
          case "company_name":
            data.companyName = value;
            break;
          case "totalvalue":
          case "total_value":
            data.totalValue = this.parseNumber(value);
            break;
          case "investmentamount":
          case "investment_amount":
            data.investmentAmount = this.parseNumber(value);
            break;
          case "ownershippercentage":
          case "ownership_percentage":
            data.ownershipPercentage = this.parseNumber(value);
            break;
          case "irr":
            data.irr = this.parseNumber(value);
            break;
          case "moic":
            data.moic = this.parseNumber(value);
            break;
          case "investmentdate":
          case "investment_date":
            data.investmentDate = this.parseDate(value);
            break;
          case "sector":
            data.sector = value;
            break;
          case "stage":
            data.stage = value;
            break;
          case "status":
            data.status = value;
            break;
          case "notes":
            data.notes = value;
            break;
        }
      }
    }

    // Extract from form fields
    for (const field of data.formFields) {
      const fieldName = field.fieldName.toLowerCase().replace(/\s+/g, "");
      const value = field.fieldValue;

      if (value) {
        switch (fieldName) {
          case "companyname":
          case "company":
            data.companyName = value;
            break;
          case "investmentamount":
          case "investment":
            data.investmentAmount = this.parseNumber(value);
            break;
          case "irr":
            data.irr = this.parseNumber(value);
            break;
          case "moic":
            data.moic = this.parseNumber(value);
            break;
          case "investmentdate":
          case "date":
            data.investmentDate = this.parseDate(value);
            break;
        }
      }
    }

    // Extract from tables (for cap tables, financial statements, etc.)
    if (
      documentType === "cap_table" ||
      documentType === "financial_statement"
    ) {
      this.extractDataFromTables(data);
    }
  }

  /**
   * Extract data from tables
   */
  private extractDataFromTables(data: MultiModalExtractedData): void {
    for (const table of data.tables) {
      // Look for cap table data
      if (
        table.headers.some(
          (h) =>
            h.toLowerCase().includes("ownership") ||
            h.toLowerCase().includes("percentage")
        )
      ) {
        for (const row of table.rows) {
          if (row.length >= 2) {
            const percentage = this.parseNumber(row[1]);
            if (percentage && percentage > 0 && percentage <= 100) {
              data.ownershipPercentage = percentage;
              break;
            }
          }
        }
      }

      // Look for financial data
      if (
        table.headers.some(
          (h) =>
            h.toLowerCase().includes("revenue") ||
            h.toLowerCase().includes("income")
        )
      ) {
        for (const row of table.rows) {
          if (row.length >= 2) {
            const value = this.parseNumber(row[1]);
            if (value && value > 0) {
              if (row[0].toLowerCase().includes("revenue")) {
                data.totalValue = value;
              } else if (row[0].toLowerCase().includes("income")) {
                data.investmentAmount = value;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Upload file to Google Cloud Storage
   */
  private async uploadToStorage(file: File, fileName: string): Promise<string> {
    const bucket = storage.bucket(this.bucketName);
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", () => resolve(`gs://${this.bucketName}/${fileName}`));

      file
        .arrayBuffer()
        .then((buffer) => {
          stream.end(Buffer.from(buffer));
        })
        .catch(reject);
    });
  }

  /**
   * Get file content from Cloud Storage
   */
  private async getFileContent(filePath: string): Promise<Buffer> {
    const fileName = filePath.split("/").pop();
    if (!fileName) {
      throw new Error("Invalid file path");
    }

    const bucket = storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    const [buffer] = await file.download();
    return buffer;
  }

  /**
   * Delete file from Cloud Storage
   */
  private async deleteFromStorage(fileName: string): Promise<void> {
    const bucket = storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    await file.delete();
  }

  /**
   * Parse number from string
   */
  private parseNumber(value: string): number | undefined {
    const cleaned = value.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Parse date from string
   */
  private parseDate(value: string): string | undefined {
    try {
      const date = new Date(value);
      return isNaN(date.getTime())
        ? undefined
        : date.toISOString().split("T")[0];
    } catch {
      return undefined;
    }
  }

  /**
   * Check if we have valid processors configured
   */
  private hasValidProcessors(): boolean {
    return Object.values(this.processors).some(
      (processorId) =>
        processorId &&
        processorId !== "" &&
        processorId !== "mock-processor-id-for-testing"
    );
  }

  /**
   * Test Document AI connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.hasValidProcessors()) {
        return false;
      }

      // Test with the first available processor
      const processorId = Object.values(this.processors).find(
        (id) => id && id !== "" && id !== "mock-processor-id-for-testing"
      );

      if (!processorId) {
        return false;
      }

      const name = `projects/${this.projectId}/locations/${this.location}/processors/${processorId}`;
      await documentAI.getProcessor({ name });
      return true;
    } catch (error) {
      console.error("Multi-modal Document AI connection test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const multiModalDocumentAI = new MultiModalDocumentAI();
