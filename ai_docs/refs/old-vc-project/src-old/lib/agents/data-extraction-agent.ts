// Data Extraction Agent (LlmAgent)
// Extracts structured data from classified documents using LLM

import { BaseAgent, AgentContext, AgentResult } from "./base-agent";

export interface DataExtractionInput {
  documentType: "fund_report" | "cap_table" | "financial_statement" | "other";
  rawText: string;
  processingStrategy: "standard" | "enhanced" | "manual_review";
  extractedMetadata: Record<string, any>;
  recommendations: string[];
}

export interface DataExtractionResult {
  // Basic document info
  documentType: string;
  confidence: number;
  rawText: string;
  pageCount: number;

  // Fund Report specific fields
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

  // Cap Table specific fields
  totalShares?: number;
  valuation?: number;
  sharePrice?: number;

  // Financial Statement specific fields
  revenue?: number;
  expenses?: number;
  netIncome?: number;
  assets?: number;
  liabilities?: number;
  equity?: number;

  // Multi-modal data structures
  tables: Array<{
    headers: string[];
    rows: string[][];
    confidence: number;
    tableType?: string;
    description?: string;
  }>;

  formFields: Array<{
    fieldName: string;
    fieldValue: string;
    confidence: number;
    fieldType?: string;
  }>;

  entities: Array<{
    type: string;
    value: string;
    confidence: number;
    context?: string;
  }>;

  layout: {
    pages: Array<{
      pageNumber: number;
      blocks: Array<{
        type: "text" | "table" | "image" | "form";
        content: string;
        confidence: number;
        position?: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      }>;
    }>;
  };

  // Metadata
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  };
}

export class DataExtractionAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context);
    this.initializeAgent();
  }

  private initializeAgent(): void {
    this.addSystemMessage(`
You are an expert data extraction AI specializing in venture capital and private equity documents.

Your role is to:
1. Extract structured data from classified documents
2. Identify and extract tables, form fields, and entities
3. Provide high-confidence structured outputs
4. Handle multi-modal document content

Extraction Guidelines:
- Be precise with numeric values and dates
- Extract ALL tables, form fields, and entities you can find
- Provide meaningful descriptions for extracted data
- Maintain high confidence levels for accurate extractions
- Use null for missing values, not empty strings

Document Type Specializations:
- Fund Reports: Focus on IRR, MOIC, investment amounts, company details
- Cap Tables: Focus on ownership percentages, share counts, valuations
- Financial Statements: Focus on revenue, expenses, assets, liabilities
- Other: Extract all relevant business information

Always provide comprehensive, structured data extraction with high accuracy.
`);
  }

  async execute(
    input: DataExtractionInput
  ): Promise<AgentResult<DataExtractionResult>> {
    try {
      const prompt = this.createExtractionPrompt(input);
      const result =
        await this.generateStructuredResponse<DataExtractionResult>(
          prompt,
          this.getExtractionSchema()
        );

      // Validate the result
      if (!this.validateExtractionResult(result)) {
        return this.createErrorResult("Invalid extraction result structure");
      }

      // Add to conversation history
      this.addUserMessage(`Extract data from ${input.documentType} document`);
      this.addAssistantMessage(
        `Extracted ${result.tables.length} tables, ${result.formFields.length} form fields, ${result.entities.length} entities`
      );

      return this.createSuccessResult(result, result.confidence, {
        documentType: input.documentType,
        processingStrategy: input.processingStrategy,
      });
    } catch (error) {
      console.error("Data extraction error:", error);
      return this.createErrorResult(
        `Data extraction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private createExtractionPrompt(input: DataExtractionInput): string {
    const documentTypeInstructions = this.getDocumentTypeInstructions(
      input.documentType
    );

    return `
Extract comprehensive structured data from the following ${
      input.documentType
    } document:

Document Information:
- Type: ${input.documentType}
- Processing Strategy: ${input.processingStrategy}
- Extracted Metadata: ${JSON.stringify(input.extractedMetadata, null, 2)}
- Recommendations: ${input.recommendations.join(", ")}

Document Content:
${input.rawText}

${documentTypeInstructions}

Extraction Requirements:
1. Extract ALL relevant structured data based on document type
2. Identify and extract ALL tables with headers and rows
3. Extract ALL form fields and key-value pairs
4. Identify ALL entities (companies, people, dates, amounts, etc.)
5. Provide comprehensive layout analysis
6. Ensure high accuracy and confidence levels

Focus on:
- Financial metrics and performance data
- Company and investment details
- Ownership and equity information
- Dates and time periods
- Contact information and entities
- Document structure and formatting

Return ONLY the JSON object with the complete structured data extraction.
`;
  }

  private getDocumentTypeInstructions(documentType: string): string {
    switch (documentType) {
      case "fund_report":
        return `
FUND REPORT EXTRACTION FOCUS:
- Company name and investment details
- IRR (Internal Rate of Return) and MOIC (Multiple on Invested Capital)
- Investment amounts and ownership percentages
- Investment dates and portfolio performance
- Sector, stage, and investment status
- Performance tables and financial highlights
- Risk factors and investment thesis
`;

      case "cap_table":
        return `
CAP TABLE EXTRACTION FOCUS:
- Shareholder names and ownership percentages
- Share counts and share types (common, preferred, options)
- Valuation and share prices
- Investment rounds and dates
- Option pools and employee equity
- Ownership dilution and changes
- Investor information and contact details
`;

      case "financial_statement":
        return `
FINANCIAL STATEMENT EXTRACTION FOCUS:
- Revenue, expenses, and net income
- Assets, liabilities, and equity
- Cash flow and working capital
- Financial ratios and metrics
- Reporting periods and dates
- Company name and financial year
- Auditor information and notes
`;

      default:
        return `
GENERAL DOCUMENT EXTRACTION FOCUS:
- All business-relevant information
- Company names and entities
- Financial data and metrics
- Dates and time periods
- Contact information
- Document structure and formatting
`;
    }
  }

  private getExtractionSchema(): Record<string, any> {
    return {
      documentType: { type: "string" },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      rawText: { type: "string" },
      pageCount: { type: "number" },
      companyName: { type: "string" },
      totalValue: { type: "number" },
      investmentAmount: { type: "number" },
      ownershipPercentage: { type: "number" },
      irr: { type: "number" },
      moic: { type: "number" },
      investmentDate: { type: "string" },
      sector: { type: "string" },
      stage: { type: "string" },
      status: { type: "string" },
      notes: { type: "string" },
      totalShares: { type: "number" },
      valuation: { type: "number" },
      sharePrice: { type: "number" },
      revenue: { type: "number" },
      expenses: { type: "number" },
      netIncome: { type: "number" },
      assets: { type: "number" },
      liabilities: { type: "number" },
      equity: { type: "number" },
      tables: {
        type: "array",
        items: {
          type: "object",
          properties: {
            headers: { type: "array", items: { type: "string" } },
            rows: {
              type: "array",
              items: { type: "array", items: { type: "string" } },
            },
            confidence: { type: "number" },
            tableType: { type: "string" },
            description: { type: "string" },
          },
        },
      },
      formFields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            fieldName: { type: "string" },
            fieldValue: { type: "string" },
            confidence: { type: "number" },
            fieldType: { type: "string" },
          },
        },
      },
      entities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string" },
            value: { type: "string" },
            confidence: { type: "number" },
            context: { type: "string" },
          },
        },
      },
      layout: {
        type: "object",
        properties: {
          pages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                pageNumber: { type: "number" },
                blocks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: ["text", "table", "image", "form"],
                      },
                      content: { type: "string" },
                      confidence: { type: "number" },
                      position: {
                        type: "object",
                        properties: {
                          x: { type: "number" },
                          y: { type: "number" },
                          width: { type: "number" },
                          height: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      metadata: {
        type: "object",
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          subject: { type: "string" },
          creator: { type: "string" },
          producer: { type: "string" },
          creationDate: { type: "string" },
          modificationDate: { type: "string" },
        },
      },
    };
  }

  private validateExtractionResult(result: DataExtractionResult): boolean {
    return (
      typeof result.documentType === "string" &&
      typeof result.confidence === "number" &&
      result.confidence >= 0 &&
      result.confidence <= 1 &&
      typeof result.rawText === "string" &&
      typeof result.pageCount === "number" &&
      Array.isArray(result.tables) &&
      Array.isArray(result.formFields) &&
      Array.isArray(result.entities) &&
      typeof result.layout === "object" &&
      Array.isArray(result.layout.pages)
    );
  }
}
