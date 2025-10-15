// Document Classification Agent (LlmAgent)
// Classifies uploaded documents and determines processing strategy

import { BaseAgent, AgentContext, AgentResult } from "./base-agent";

export interface DocumentClassificationInput {
  fileName: string;
  fileType: string;
  fileSize: number;
  rawText?: string;
  metadata?: Record<string, any>;
}

export interface DocumentClassificationResult {
  documentType: "fund_report" | "cap_table" | "financial_statement" | "other";
  confidence: number;
  processingStrategy: "standard" | "enhanced" | "manual_review";
  extractedMetadata: {
    companyName?: string;
    reportPeriod?: string;
    documentDate?: string;
    reportType?: string;
    [key: string]: any;
  };
  recommendations: string[];
}

export class DocumentClassificationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context);
    this.initializeAgent();
  }

  private initializeAgent(): void {
    this.addSystemMessage(`
You are an expert document classification AI specializing in venture capital and private equity documents.

Your role is to:
1. Analyze uploaded documents and classify them into specific types
2. Determine the appropriate processing strategy
3. Extract preliminary metadata
4. Provide recommendations for optimal processing

Document Types:
- fund_report: Quarterly/annual fund reports, performance updates, investor letters
- cap_table: Capitalization tables, ownership structures, equity breakdowns
- financial_statement: Income statements, balance sheets, cash flow statements
- other: Any document that doesn't fit the above categories

Processing Strategies:
- standard: Use standard extraction for well-formatted documents
- enhanced: Use enhanced multi-modal processing for complex documents
- manual_review: Flag for human review due to complexity or quality issues

Always provide high-confidence classifications with detailed reasoning.
`);
  }

  async execute(
    input: DocumentClassificationInput
  ): Promise<AgentResult<DocumentClassificationResult>> {
    try {
      const prompt = this.createClassificationPrompt(input);
      const result =
        await this.generateStructuredResponse<DocumentClassificationResult>(
          prompt,
          this.getClassificationSchema()
        );

      // Validate the result
      if (!this.validateClassificationResult(result)) {
        return this.createErrorResult(
          "Invalid classification result structure"
        );
      }

      // Add to conversation history
      this.addUserMessage(`Classify document: ${input.fileName}`);
      this.addAssistantMessage(
        `Classified as ${result.documentType} with ${result.confidence} confidence`
      );

      return this.createSuccessResult(result, result.confidence, {
        fileName: input.fileName,
        fileType: input.fileType,
        fileSize: input.fileSize,
      });
    } catch (error) {
      console.error("Document classification error:", error);
      return this.createErrorResult(
        `Document classification failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private createClassificationPrompt(
    input: DocumentClassificationInput
  ): string {
    return `
Analyze the following document and provide a comprehensive classification:

Document Information:
- File Name: ${input.fileName}
- File Type: ${input.fileType}
- File Size: ${input.fileSize} bytes
- Raw Text Preview: ${
      input.rawText
        ? input.rawText.substring(0, 2000) + "..."
        : "No text available"
    }

Classification Requirements:
1. Determine the document type based on content and structure
2. Assess the document quality and complexity
3. Extract any preliminary metadata you can identify
4. Recommend the best processing strategy
5. Provide specific recommendations for optimal data extraction

Focus on identifying:
- Company names and entities
- Financial data and metrics
- Document structure and formatting
- Data quality and completeness
- Potential processing challenges

Consider the document's purpose in venture capital/private equity context and classify accordingly.
`;
  }

  private getClassificationSchema(): Record<string, any> {
    return {
      documentType: {
        type: "string",
        enum: ["fund_report", "cap_table", "financial_statement", "other"],
        description: "The primary type of document",
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence level in the classification (0-1)",
      },
      processingStrategy: {
        type: "string",
        enum: ["standard", "enhanced", "manual_review"],
        description: "Recommended processing approach",
      },
      extractedMetadata: {
        type: "object",
        properties: {
          companyName: { type: "string" },
          reportPeriod: { type: "string" },
          documentDate: { type: "string" },
          reportType: { type: "string" },
        },
        description: "Preliminary metadata extracted from the document",
      },
      recommendations: {
        type: "array",
        items: { type: "string" },
        description: "Specific recommendations for processing this document",
      },
    };
  }

  private validateClassificationResult(
    result: DocumentClassificationResult
  ): boolean {
    return (
      typeof result.documentType === "string" &&
      ["fund_report", "cap_table", "financial_statement", "other"].includes(
        result.documentType
      ) &&
      typeof result.confidence === "number" &&
      result.confidence >= 0 &&
      result.confidence <= 1 &&
      typeof result.processingStrategy === "string" &&
      ["standard", "enhanced", "manual_review"].includes(
        result.processingStrategy
      ) &&
      typeof result.extractedMetadata === "object" &&
      Array.isArray(result.recommendations)
    );
  }
}
