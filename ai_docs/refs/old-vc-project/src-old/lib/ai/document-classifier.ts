/**
 * Document Type Classification Service
 *
 * Classifies documents before extraction to ensure appropriate processing
 */

export enum DocumentType {
  FUND_QUARTERLY_REPORT = "fund_quarterly_report",
  LP_CAPITAL_ACCOUNT = "lp_capital_account",
  INDIVIDUAL_COMPANY_UPDATE = "individual_company_update",
  FINANCIAL_STATEMENT_ONLY = "financial_statement_only",
  UNKNOWN = "unknown",
}

export interface DocumentClassificationResult {
  documentType: DocumentType;
  confidence: number;
  reasoning: string;
  extractionStrategy: string[];
}

export class DocumentClassifier {
  /**
   * Classify document type based on content analysis
   */
  async classifyDocument(
    markdownText: string,
    fileName: string
  ): Promise<DocumentClassificationResult> {
    const indicators = this.analyzeDocumentIndicators(markdownText, fileName);

    // Determine document type based on indicators
    const classification = this.determineDocumentType(indicators);

    return {
      documentType: classification.type,
      confidence: classification.confidence,
      reasoning: classification.reasoning,
      extractionStrategy: this.getExtractionStrategy(classification.type),
    };
  }

  /**
   * Analyze document for type indicators
   */
  private analyzeDocumentIndicators(markdownText: string, fileName: string) {
    const text = markdownText.toLowerCase();
    const fileName_lower = fileName.toLowerCase();

    return {
      // Fund-level indicators
      hasFundOverview: this.hasPattern(text, [
        "fund overview",
        "commitments",
        "capital calls",
        "net asset value",
        "total committed",
        "irr",
        "moic",
        "tvpi",
        "dpi",
        "rvpi",
      ]),

      // LP-specific indicators
      hasLPAccount: this.hasPattern(text, [
        "individual capital account",
        "lp capital account",
        "partners capital",
        "personal commitment",
        "personal nav",
        "personal distributions",
      ]),

      // Company-specific indicators
      hasCompanyDetails: this.hasPattern(text, [
        "portfolio companies",
        "investment entity",
        "current stage",
        "sector",
        "valuation",
        "investment amount",
      ]),

      // Financial statement indicators
      hasFinancialStatements: this.hasPattern(text, [
        "balance sheet",
        "income statement",
        "cash flow",
        "assets",
        "liabilities",
        "equity",
      ]),

      // Quarterly report indicators
      isQuarterlyReport: this.hasPattern(text, [
        "q1",
        "q2",
        "q3",
        "q4",
        "quarterly",
        "quarter",
        "investor reporting",
        "management letter",
      ]),

      // File name indicators
      fileNameIndicators: {
        isLPStatement:
          fileName_lower.includes("lp") ||
          fileName_lower.includes("capital account"),
        isFundReport:
          fileName_lower.includes("fund") ||
          fileName_lower.includes("quarterly"),
        isCompanyUpdate:
          fileName_lower.includes("company") ||
          fileName_lower.includes("portfolio"),
      },
    };
  }

  /**
   * Determine document type based on indicators
   */
  private determineDocumentType(indicators: Record<string, unknown>) {
    // LP Capital Account Statement
    if (indicators.hasLPAccount && !indicators.hasFundOverview) {
      return {
        type: DocumentType.LP_CAPITAL_ACCOUNT,
        confidence: 0.9,
        reasoning:
          "Document contains LP-specific account information without fund-level metrics",
      };
    }

    // Fund Quarterly Report
    if (
      indicators.hasFundOverview &&
      indicators.isQuarterlyReport &&
      indicators.hasCompanyDetails
    ) {
      return {
        type: DocumentType.FUND_QUARTERLY_REPORT,
        confidence: 0.95,
        reasoning:
          "Document contains fund-level metrics, quarterly reporting, and portfolio company details",
      };
    }

    // Individual Company Update
    if (
      indicators.hasCompanyDetails &&
      !indicators.hasFundOverview &&
      !indicators.hasLPAccount
    ) {
      return {
        type: DocumentType.INDIVIDUAL_COMPANY_UPDATE,
        confidence: 0.85,
        reasoning:
          "Document focuses on individual company details without fund-level context",
      };
    }

    // Financial Statement Only
    if (
      indicators.hasFinancialStatements &&
      !indicators.hasFundOverview &&
      !indicators.hasLPAccount
    ) {
      return {
        type: DocumentType.FINANCIAL_STATEMENT_ONLY,
        confidence: 0.8,
        reasoning:
          "Document contains financial statements without fund or LP context",
      };
    }

    // Default to unknown
    return {
      type: DocumentType.UNKNOWN,
      confidence: 0.3,
      reasoning:
        "Document type could not be determined with sufficient confidence",
    };
  }

  /**
   * Get appropriate extraction strategy for document type
   */
  private getExtractionStrategy(documentType: DocumentType): string[] {
    switch (documentType) {
      case DocumentType.FUND_QUARTERLY_REPORT:
        return [
          "extract_fund_metrics",
          "extract_portfolio_companies",
          "extract_financial_statements",
          "skip_personal_lp_data",
        ];

      case DocumentType.LP_CAPITAL_ACCOUNT:
        return [
          "extract_personal_lp_data",
          "skip_fund_metrics",
          "skip_portfolio_companies",
        ];

      case DocumentType.INDIVIDUAL_COMPANY_UPDATE:
        return [
          "extract_company_details",
          "skip_fund_metrics",
          "skip_personal_lp_data",
        ];

      case DocumentType.FINANCIAL_STATEMENT_ONLY:
        return [
          "extract_financial_statements",
          "skip_fund_metrics",
          "skip_personal_lp_data",
          "skip_portfolio_companies",
        ];

      default:
        return ["extract_all_with_low_confidence", "flag_for_manual_review"];
    }
  }

  /**
   * Check if text contains any of the specified patterns
   */
  private hasPattern(text: string, patterns: string[]): boolean {
    return patterns.some((pattern) => text.includes(pattern));
  }
}
