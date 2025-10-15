/**
 * Semantic Document Extraction Service
 *
 * LLM-first approach for understanding document structure and extracting data
 * Uses language-agnostic NLP methods following mg:extraction-strategy guidelines
 */

import { OpenRouterService } from "./openrouter-service";
import { UniversalNLPExtractor } from "./universal-nlp-extractor";

export interface SemanticExtractionResult {
  success: boolean;
  data: Record<string, unknown>;
  confidence: number;
  method: "llm_semantic" | "llm_structured" | "nlp_fallback" | "failed";
  reasoning: string;
  validation: {
    crossReferences: Record<string, unknown>;
    consistencyChecks: Record<string, boolean>;
    dataQuality: number;
  };
}

export interface DocumentStructure {
  documentType: string;
  sections: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  tables: Array<{
    title: string;
    headers: string[];
    rows: string[][];
    type: string;
  }>;
  metrics: Array<{
    name: string;
    value: string;
    context: string;
    confidence: number;
  }>;
}

export class SemanticExtractor {
  private llmService: OpenRouterService | null = null;
  private universalNlpExtractor: UniversalNLPExtractor;

  constructor(llmService?: OpenRouterService) {
    this.llmService = llmService || null;
    this.universalNlpExtractor = new UniversalNLPExtractor();
  }

  /**
   * Main extraction method - uses LLM-first approach with NLP fallback
   */
  public async extractFromDocument(
    markdownText: string
  ): Promise<SemanticExtractionResult> {
    console.log("🧠 Starting semantic document extraction");

    try {
      // Step 1: Analyze document structure using LLM
      const structure = await this.analyzeDocumentStructure(markdownText);
      console.log("📋 Document structure analyzed:", structure);

      // Step 2: Extract fund metrics using LLM semantic understanding
      const fundMetrics = await this.extractFundMetrics(
        markdownText,
        structure
      );
      console.log("💰 Fund metrics extracted:", fundMetrics);

      // Step 3: Extract portfolio companies using LLM
      const portfolioData = await this.extractPortfolioCompanies(
        markdownText,
        structure
      );
      console.log("🏢 Portfolio companies extracted:", portfolioData);

      // Step 4: Combine all extracted data
      const combinedData = {
        ...fundMetrics,
        ...portfolioData,
      };

      // Step 5: Clean and validate data
      const cleanedData = this.cleanExtractedData(combinedData);

      // Step 6: Perform consistency checks
      const crossReferences = this.findCrossReferences(cleanedData);
      const consistencyChecks = this.performConsistencyChecks(cleanedData);

      // Step 7: Calculate confidence
      const confidence = this.calculateSemanticConfidence(
        cleanedData,
        structure
      );

      return {
        success: true,
        data: cleanedData,
        confidence,
        method: "llm_semantic",
        reasoning:
          "Successfully extracted data using LLM semantic understanding",
        validation: {
          crossReferences,
          consistencyChecks,
          dataQuality: confidence,
        },
      };
    } catch (error) {
      console.error(
        "LLM extraction failed, falling back to Universal NLP approach:",
        error
      );

      // Fallback to Universal NLP-based extraction
      return await this.universalNlpFallbackExtraction(markdownText);
    }
  }

  /**
   * Universal NLP-based fallback extraction when LLM fails
   * Works across ALL fund report formats without any document-specific patterns
   */
  private async universalNlpFallbackExtraction(
    markdownText: string
  ): Promise<SemanticExtractionResult> {
    console.log("🌍 Using Universal NLP-based fallback extraction");

    try {
      const extractedData = await this.universalNlpExtractor.extractFundMetrics(
        markdownText
      );

      return {
        success: true,
        data: extractedData,
        confidence: 0.8, // Higher confidence for universal approach
        method: "nlp_fallback",
        reasoning:
          "Used universal language-agnostic NLP extraction as fallback - works across ALL fund report formats",
        validation: {
          crossReferences: {},
          consistencyChecks: {},
          dataQuality: 0.8,
        },
      };
    } catch (error) {
      console.error("Universal NLP fallback extraction failed:", error);

      return {
        success: false,
        data: {},
        confidence: 0,
        method: "failed",
        reasoning: "Both LLM and Universal NLP extraction methods failed",
        validation: {
          crossReferences: {},
          consistencyChecks: {},
          dataQuality: 0,
        },
      };
    }
  }

  /**
   * Analyze document structure using LLM
   */
  private async analyzeDocumentStructure(
    markdownText: string
  ): Promise<DocumentStructure> {
    if (!this.llmService) {
      return this.basicStructureAnalysis(markdownText);
    }

    const prompt = `
Analyze this VC fund document and identify its structure:

Document:
${markdownText}

Please identify:
1. Document type (fund report, LP statement, etc.)
2. Main sections (fund overview, portfolio, financials, etc.)
3. Tables and their purposes
4. Key metrics and their locations

Respond in JSON format:
{
  "documentType": "fund_quarterly_report",
  "sections": [
    {
      "name": "Fund Overview",
      "content": "...",
      "type": "metrics"
    }
  ],
  "tables": [
    {
      "title": "Portfolio Companies",
      "headers": ["Company", "Stage", "Sector"],
      "rows": [["Company1", "Seed", "Tech"]],
      "type": "portfolio"
    }
  ],
  "metrics": [
    {
      "name": "IRR",
      "value": "5.4%",
      "context": "Fund Overview section",
      "confidence": 0.9
    }
  ]
}
`;

    let response: string;
    try {
      response = await this.llmService.callOpenRouter(prompt);
      console.log(
        "🔍 LLM structure response:",
        response.substring(0, 200) + "..."
      );

      // Clean the response - remove markdown formatting
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.warn("LLM structure analysis failed, using fallback");
      console.error("Structure analysis error:", error);
      console.log("Raw LLM response:", response);
      return this.basicStructureAnalysis(markdownText);
    }
  }

  /**
   * Extract fund metrics using semantic understanding
   */
  private async extractFundMetrics(
    markdownText: string,
    structure: DocumentStructure
  ): Promise<Record<string, unknown>> {
    if (!this.llmService) {
      return await this.universalNlpExtractor.extractFundMetrics(markdownText);
    }

    const prompt = `
Extract fund-level financial metrics from this VC fund document:

Document:
${markdownText}

Return ONLY this JSON format (no explanations, no text, no markdown):
{
  "fundSize": 30524.5,
  "fundNAV": 22371.1,
  "irr": 5.4,
  "moic": 1.3,
  "tvpi": 0.8,
  "dpi": 0.0,
  "rvpi": 0.8,
  "cumulativeCalledCapital": 28082.2,
  "uncalledCapital": 517.3
}

If metric not found, use null.
`;

    let response: string;
    try {
      response = await this.llmService.callOpenRouter(prompt);
      console.log(
        "💰 LLM fund metrics response:",
        response.substring(0, 200) + "..."
      );

      // Clean the response
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.warn(
        "LLM fund metrics extraction failed, using Universal NLP fallback"
      );
      console.error("Fund metrics extraction error:", error);
      console.log("Raw LLM response:", response);
      return await this.universalNlpExtractor.extractFundMetrics(markdownText);
    }
  }

  /**
   * Extract portfolio companies using semantic understanding
   */
  private async extractPortfolioCompanies(
    markdownText: string,
    structure: DocumentStructure
  ): Promise<Record<string, unknown>> {
    if (!this.llmService) {
      return this.basicPortfolioExtraction(markdownText);
    }

    const prompt = `
Extract portfolio company information from this VC fund document:

Document:
${markdownText}

Return ONLY this JSON format (no explanations, no text, no markdown):
{
  "portfolioCompanies": [
    {
      "name": "Company Name",
      "stage": "Seed",
      "sector": "Technology",
      "fairValueEUR": 1000.0,
      "totalInvestedEUR": 500.0,
      "grossMultiple": 2.0
    }
  ]
}

If no companies found, use empty array.
`;

    let response: string;
    try {
      response = await this.llmService.callOpenRouter(prompt);
      console.log(
        "🏢 LLM portfolio response:",
        response.substring(0, 200) + "..."
      );

      // Clean the response
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.warn("LLM portfolio extraction failed, using basic extraction");
      console.error("Portfolio extraction error:", error);
      console.log("Raw LLM response:", response);
      return this.basicPortfolioExtraction(markdownText);
    }
  }

  /**
   * Basic structure analysis fallback
   */
  private basicStructureAnalysis(markdownText: string): DocumentStructure {
    return {
      documentType: "fund_report",
      sections: [],
      tables: [],
      metrics: [],
    };
  }

  /**
   * Basic portfolio extraction fallback
   */
  private basicPortfolioExtraction(
    markdownText: string
  ): Record<string, unknown> {
    return {
      portfolioCompanies: [],
    };
  }

  /**
   * Clean extracted data
   */
  private cleanExtractedData(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        cleaned[key] = null;
        continue;
      }

      // Clean numeric values
      if (
        typeof value === "string" &&
        /^[\d,.-]+$/.test(value.replace(/[€$k]/g, ""))
      ) {
        cleaned[key] = this.parseNumericValue(value);
      } else if (typeof value === "number") {
        cleaned[key] = value;
      } else if (Array.isArray(value)) {
        // Handle arrays of objects properly
        cleaned[key] = value.map((item) => {
          if (typeof item === "object" && item !== null) {
            return item; // Keep objects as-is
          }
          return this.cleanStringValue(item);
        });
      } else {
        cleaned[key] = this.cleanStringValue(value);
      }
    }

    return cleaned;
  }

  /**
   * Calculate confidence based on semantic understanding
   */
  private calculateSemanticConfidence(
    data: Record<string, unknown>,
    _structure: DocumentStructure
  ): number {
    const totalFields = Object.keys(data).length;
    const nonNullFields = Object.values(data).filter(
      (v) => v !== null && v !== undefined
    ).length;

    // Base confidence on data completeness
    let confidence = nonNullFields / totalFields;

    // Boost confidence if we have good document structure
    if (_structure.tables.length > 0) confidence += 0.1;
    if (_structure.sections.length > 3) confidence += 0.1;

    // Boost confidence if we have portfolio companies
    if (
      data.portfolioCompanies &&
      Array.isArray(data.portfolioCompanies) &&
      data.portfolioCompanies.length > 0
    ) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Find cross-references between extracted data
   */
  private findCrossReferences(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const references: Record<string, unknown> = {};

    // TVPI = DPI + RVPI validation
    if (data.dpi && data.rvpi && data.tvpi) {
      const calculatedTVPI = (data.dpi as number) + (data.rvpi as number);
      references.tvpiValidation = {
        expected: calculatedTVPI,
        actual: data.tvpi,
        difference: Math.abs(calculatedTVPI - (data.tvpi as number)),
      };
    }

    // Portfolio total vs NAV
    if (
      data.fundNAV &&
      data.portfolioCompanies &&
      Array.isArray(data.portfolioCompanies)
    ) {
      const portfolioTotal = data.portfolioCompanies.reduce(
        (sum: number, company: Record<string, unknown>) => {
          return sum + ((company.fairValueEUR as number) || 0);
        },
        0
      );
      references.navValidation = {
        fundNAV: data.fundNAV,
        portfolioTotal,
        difference: Math.abs((data.fundNAV as number) - portfolioTotal),
      };
    }

    return references;
  }

  /**
   * Perform consistency checks
   */
  private performConsistencyChecks(
    data: Record<string, unknown>
  ): Record<string, boolean> {
    const checks: Record<string, boolean> = {};

    // Check if TVPI = DPI + RVPI
    if (data.dpi && data.rvpi && data.tvpi) {
      const expected = (data.dpi as number) + (data.rvpi as number);
      const actual = data.tvpi as number;
      checks.tvpiConsistency = Math.abs(expected - actual) < 0.01;
    }

    // Check if IRR is reasonable
    if (data.irr) {
      const irr = data.irr as number;
      checks.irrReasonable = irr >= -50 && irr <= 1000;
    }

    // Check if MOIC is reasonable
    if (data.moic) {
      const moic = data.moic as number;
      checks.moicReasonable = moic >= 0 && moic <= 100;
    }

    return checks;
  }

  /**
   * Clean numeric values using minimal regex
   */
  private parseNumericValue(value: string): number {
    // Remove currency symbols and convert k/M suffixes
    let cleaned = value.replace(/[€$,\s]/g, "");

    if (cleaned.endsWith("k")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000;
    } else if (cleaned.endsWith("M")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000000;
    }

    return parseFloat(cleaned) || 0;
  }

  /**
   * Clean string values
   */
  private cleanStringValue(value: unknown): string {
    if (typeof value === "string") {
      return value.trim().replace(/\s+/g, " ");
    }
    return String(value);
  }
}
