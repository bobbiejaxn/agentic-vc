import { db } from "./drizzle/connection";
import { documents, analysis_results } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";
import { SemanticExtractor } from "./ai/semantic-extractor";
import { calculateEnhancedConfidenceScore } from "./enhanced-confidence-scoring";
import { validateAnalysisData } from "./analysis-validation";
import { enrichAnalysisWithExternalData } from "./external-data-enrichment";
import type {
  EnhancedAnalysisResult,
  DetailedFinancialMetrics,
  ComprehensivePortfolioAnalysis,
  DataQualityMetrics,
  ConfidenceScore,
} from "./types/analysis";

/**
 * Enhanced Analysis Service
 *
 * Provides comprehensive Tier 1 data extraction for VC portfolio documents.
 * This service extracts detailed financial metrics, portfolio analysis, and
 * data quality metrics that go beyond basic document processing.
 */
export class EnhancedAnalysisService {
  private documentId: string;
  private userId: string;

  constructor(documentId: string, userId: string) {
    this.documentId = documentId;
    this.userId = userId;
  }

  /**
   * Process enhanced analysis for a document
   * Builds upon existing Basic Analysis data to add confidence scoring,
   * external data enrichment, and validation without duplicating extraction
   */
  async processEnhancedAnalysis(): Promise<EnhancedAnalysisResult> {
    const startTime = Date.now();
    const errors: string[] = [];

    try {
      // 1. Validate document access
      await this.validateDocumentAccess();

      // 2. Get existing Basic Analysis data (no re-extraction needed)
      const existingData = await this.getExistingBasicAnalysisData();

      // 3. Parse existing financial metrics (use what's already extracted)
      const financialMetrics = this.parseExistingFinancialMetrics(existingData);

      // 4. Parse existing portfolio analysis (use what's already extracted)
      const portfolioAnalysis =
        this.parseExistingPortfolioAnalysis(existingData);

      // 5. Enrich with external data (Exa.ai, Firecrawl) - this is the value-add
      const enrichedPortfolioAnalysis = await this.enrichWithExternalData(
        portfolioAnalysis
      );

      // 6. Calculate data quality metrics based on existing data
      const dataQuality = await this.calculateDataQualityMetrics(
        financialMetrics,
        enrichedPortfolioAnalysis
      );

      // 7. Generate enhanced confidence score
      const confidence = await calculateEnhancedConfidenceScore(
        financialMetrics,
        enrichedPortfolioAnalysis,
        dataQuality
      );

      // 8. Validate analysis results
      const validationResults = await validateAnalysisData(
        financialMetrics,
        enrichedPortfolioAnalysis
      );

      const processingTime = Date.now() - startTime;

      const result: EnhancedAnalysisResult = {
        documentId: this.documentId,
        analysisType: "enhanced",
        tier1Data: {
          financialMetrics,
          portfolioAnalysis: enrichedPortfolioAnalysis,
          dataQuality,
        },
        confidence,
        processingTime,
        errors,
      };

      // 9. Store results in database
      await this.storeAnalysisResults(result);

      return result;
    } catch (error) {
      console.error("Enhanced analysis failed:", error);
      errors.push(
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      return {
        documentId: this.documentId,
        analysisType: "enhanced",
        tier1Data: {
          financialMetrics: this.getDefaultFinancialMetrics(),
          portfolioAnalysis: this.getDefaultPortfolioAnalysis(),
          dataQuality: this.getDefaultDataQuality(),
        },
        confidence: { overall: 0, financial: 0, portfolio: 0, dataQuality: 0 },
        processingTime: Date.now() - startTime,
        errors,
      };
    }
  }

  /**
   * Validate that user has access to the document
   */
  private async validateDocumentAccess(): Promise<void> {
    const document = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, this.documentId),
          eq(documents.userId, this.userId)
        )
      )
      .limit(1);

    if (document.length === 0) {
      throw new Error("Document not found or access denied");
    }
  }

  /**
   * Get existing Basic Analysis data from document
   * No re-extraction needed - use what's already processed
   */
  private async getExistingBasicAnalysisData(): Promise<any> {
    try {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, this.documentId))
        .limit(1);

      if (document.length === 0) {
        throw new Error("Document not found");
      }

      if (!document[0].extractedData) {
        throw new Error(
          "No basic analysis data found. Please run basic analysis first."
        );
      }

      return document[0].extractedData;
    } catch (error) {
      console.error("Failed to get existing basic analysis data:", error);
      throw error;
    }
  }

  /**
   * Parse existing financial metrics from Basic Analysis data
   * No LLM calls needed - use already extracted data
   */
  private parseExistingFinancialMetrics(
    existingData: any
  ): DetailedFinancialMetrics {
    try {
      return {
        irr: {
          gross: existingData.grossIrr || existingData.irr || 0,
          net: existingData.netIrr || existingData.irr || 0,
          calculation: "Based on existing analysis data",
        },
        moic: {
          gross: existingData.grossMoic || existingData.moic || 0,
          net: existingData.netMoic || existingData.moic || 0,
          breakdown: {
            realizedGains: existingData.realizedGains || 0,
            unrealizedGains: existingData.unrealizedGains || 0,
            totalInvested: existingData.cumulativeCalledCapital || 0,
            currentValue: existingData.fundNAV || 0,
            distributions: existingData.cumulativeDistributions || 0,
          },
        },
        tvpi: {
          total: existingData.tvpi || 0,
          dpi: existingData.dpi || 0,
          rvpi: existingData.rvpi || 0,
          validation: true,
        },
      };
    } catch (error) {
      console.error("Failed to parse existing financial metrics:", error);
      return this.getDefaultFinancialMetrics();
    }
  }

  /**
   * Parse existing portfolio analysis from Basic Analysis data
   * No LLM calls needed - use already extracted data
   */
  private parseExistingPortfolioAnalysis(
    existingData: any
  ): ComprehensivePortfolioAnalysis {
    try {
      return {
        companies: this.parseEnhancedCompanyData(
          existingData.portfolioCompanies || []
        ),
        sectors: this.parseSectorsFromPortfolio(
          existingData.portfolioCompanies || []
        ),
        stages: this.parseStagesFromPortfolio(
          existingData.portfolioCompanies || []
        ),
        performance: this.parsePerformanceMetrics(
          existingData.portfolioCompanies || []
        ),
      };
    } catch (error) {
      console.error("Failed to parse existing portfolio analysis:", error);
      return this.getDefaultPortfolioAnalysis();
    }
  }

  /**
   * Parse enhanced company data from existing portfolio companies
   */
  private parseEnhancedCompanyData(portfolioCompanies: any[]): any[] {
    return portfolioCompanies.map((company) => ({
      name: company.name || "Unknown",
      stage: company.stage || company.investmentStage || "Unknown",
      sector: company.sector || company.industrySector || "Unknown",
      investmentDate: company.investmentDate || company.date || "",
      investmentAmount: company.investmentAmount || company.originalCost || 0,
      currentValue: company.valuation || company.currentFairValue || 0,
      multiple: this.calculateMultiple(company),
      irr: company.irr || 0,
      status: company.status || "active",
      performance: {
        totalReturn: this.calculateTotalReturn(company),
        annualizedReturn: company.annualizedReturn || 0,
        riskScore: company.riskScore || 0,
        volatility: company.volatility || 0,
      },
    }));
  }

  /**
   * Calculate multiple for a company
   */
  private calculateMultiple(company: any): number {
    const invested = company.investmentAmount || company.originalCost || 0;
    const current = company.valuation || company.currentFairValue || 0;
    return invested > 0 ? current / invested : 0;
  }

  /**
   * Calculate total return for a company
   */
  private calculateTotalReturn(company: any): number {
    const invested = company.investmentAmount || company.originalCost || 0;
    const current = company.valuation || company.currentFairValue || 0;
    return invested > 0 ? ((current - invested) / invested) * 100 : 0;
  }

  /**
   * Parse sectors from existing portfolio companies data
   */
  private parseSectorsFromPortfolio(portfolioCompanies: any[]): any[] {
    const sectorCounts: { [key: string]: number } = {};

    portfolioCompanies.forEach((company) => {
      const sector = company.sector || company.industrySector || "Unknown";
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    const total = portfolioCompanies.length;
    return Object.entries(sectorCounts).map(([sector, count]) => ({
      name: sector,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  /**
   * Parse stages from existing portfolio companies data
   */
  private parseStagesFromPortfolio(portfolioCompanies: any[]): any[] {
    const stageCounts: { [key: string]: number } = {};

    portfolioCompanies.forEach((company) => {
      const stage = company.stage || company.investmentStage || "Unknown";
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    const total = portfolioCompanies.length;
    return Object.entries(stageCounts).map(([stage, count]) => ({
      name: stage,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  /**
   * Parse geographic distribution from existing portfolio companies data
   */
  private parseGeographicDistribution(portfolioCompanies: any[]): any[] {
    const geoCounts: { [key: string]: number } = {};

    portfolioCompanies.forEach((company) => {
      const geography = company.geography || company.location || "Unknown";
      geoCounts[geography] = (geoCounts[geography] || 0) + 1;
    });

    const total = portfolioCompanies.length;
    return Object.entries(geoCounts).map(([location, count]) => ({
      location,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  /**
   * Parse performance metrics from existing portfolio companies data
   */
  private parsePerformanceMetrics(portfolioCompanies: any[]): any {
    if (portfolioCompanies.length === 0) {
      return {
        totalInvested: 0,
        currentValue: 0,
        totalReturn: 0,
        irr: 0,
        moic: 0,
        tvpi: 0,
        dpi: 0,
        rvpi: 0,
        topPerformers: [],
        underperformers: [],
        sectorDiversification: {},
        stageDiversification: {},
      };
    }

    let totalInvested = 0;
    let totalCurrentValue = 0;
    const topPerformers: string[] = [];
    const underperformers: string[] = [];
    const sectorDiversification: Record<string, number> = {};
    const stageDiversification: Record<string, number> = {};

    portfolioCompanies.forEach((company) => {
      const invested = company.investmentAmount || company.originalCost || 0;
      const currentValue = company.valuation || company.currentFairValue || 0;

      if (invested > 0) {
        totalInvested += invested;
        totalCurrentValue += currentValue;

        const multiple = currentValue / invested;
        if (multiple > 2) {
          topPerformers.push(company.name || "Unknown");
        } else if (multiple < 1) {
          underperformers.push(company.name || "Unknown");
        }

        // Track sector diversification
        const sector = company.sector || company.industrySector || "Unknown";
        sectorDiversification[sector] =
          (sectorDiversification[sector] || 0) + invested;

        // Track stage diversification
        const stage = company.stage || company.investmentStage || "Unknown";
        stageDiversification[stage] =
          (stageDiversification[stage] || 0) + invested;
      }
    });

    const totalReturn =
      totalInvested > 0
        ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
        : 0;
    const moic = totalInvested > 0 ? totalCurrentValue / totalInvested : 0;

    return {
      totalInvested,
      currentValue: totalCurrentValue,
      totalReturn,
      irr: 0, // Would need time series data to calculate
      moic,
      tvpi: moic,
      dpi: 0, // Would need distribution data
      rvpi: moic,
      topPerformers,
      underperformers,
      sectorDiversification,
      stageDiversification,
    };
  }

  /**
   * Calculate total invested amount from portfolio companies
   */
  private calculateTotalInvested(portfolioCompanies: any[]): number {
    return portfolioCompanies.reduce((total, company) => {
      return total + (company.investmentAmount || company.originalCost || 0);
    }, 0);
  }

  /**
   * Calculate current value from portfolio companies
   */
  private calculateCurrentValue(portfolioCompanies: any[]): number {
    return portfolioCompanies.reduce((total, company) => {
      return total + (company.valuation || company.currentFairValue || 0);
    }, 0);
  }

  /**
   * Calculate average multiple from portfolio companies
   */
  private calculateAverageMultiple(portfolioCompanies: any[]): number {
    if (portfolioCompanies.length === 0) return 0;

    const totalInvested = this.calculateTotalInvested(portfolioCompanies);
    const currentValue = this.calculateCurrentValue(portfolioCompanies);

    return totalInvested > 0 ? currentValue / totalInvested : 0;
  }

  /**
   * Extract detailed financial metrics including IRR, MOIC, TVPI breakdowns
   * DEPRECATED: This method is now replaced by parseExistingFinancialMetrics
   * to avoid duplicate extraction
   */
  private async extractDetailedFinancialMetrics(): Promise<DetailedFinancialMetrics> {
    try {
      // Get document content for enhanced extraction
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, this.documentId))
        .limit(1);

      if (document.length === 0) {
        throw new Error("Document not found");
      }

      // Use enhanced semantic extraction for detailed financial metrics
      const extractionPrompt = `
        Extract comprehensive financial metrics from this VC portfolio document:
        
        Required metrics:
        1. IRR (Internal Rate of Return) - both gross and net
        2. MOIC (Multiple on Invested Capital) - with detailed breakdown
        3. TVPI (Total Value to Paid-In) - including DPI and RVPI components
        4. Investment performance calculations
        5. Risk-adjusted returns
        6. Cash flow analysis
        
        Provide detailed calculations and validation for each metric.
      `;

      const semanticExtractor = new SemanticExtractor();
      const extractionResult = await semanticExtractor.extractFromDocument(
        document[0].extractedData?.content || ""
      );

      if (!extractionResult.success) {
        throw new Error(`Extraction failed: ${extractionResult.reasoning}`);
      }

      const extractedData = extractionResult.data;

      return this.parseFinancialMetrics(extractedData);
    } catch (error) {
      console.error("Failed to extract detailed financial metrics:", error);
      return this.getDefaultFinancialMetrics();
    }
  }

  /**
   * Perform comprehensive portfolio analysis
   */
  private async performComprehensivePortfolioAnalysis(): Promise<ComprehensivePortfolioAnalysis> {
    try {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, this.documentId))
        .limit(1);

      if (document.length === 0) {
        throw new Error("Document not found");
      }

      const analysisPrompt = `
        Perform comprehensive portfolio analysis on this VC document:
        
        Required analysis:
        1. Portfolio company details (stages, sectors, performance)
        2. Sector analysis and diversification
        3. Investment stage analysis
        4. Performance metrics by company
        5. Risk assessment
        6. Portfolio composition analysis
        
        Provide detailed breakdowns and insights for each area.
      `;

      const semanticExtractor = new SemanticExtractor();
      const extractionResult = await semanticExtractor.extractFromDocument(
        document[0].extractedData?.content || ""
      );

      if (!extractionResult.success) {
        throw new Error(`Extraction failed: ${extractionResult.reasoning}`);
      }

      const extractedData = extractionResult.data;

      return this.parsePortfolioAnalysis(extractedData);
    } catch (error) {
      console.error(
        "Failed to perform comprehensive portfolio analysis:",
        error
      );
      return this.getDefaultPortfolioAnalysis();
    }
  }

  /**
   * Enrich portfolio analysis with external data
   */
  private async enrichWithExternalData(
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): Promise<ComprehensivePortfolioAnalysis> {
    try {
      // Enrich companies and sectors with external data
      const { enrichedCompanies, enrichedSectors } =
        await enrichAnalysisWithExternalData(
          portfolioAnalysis.companies,
          portfolioAnalysis.sectors
        );

      return {
        ...portfolioAnalysis,
        companies: enrichedCompanies,
        sectors: enrichedSectors,
      };
    } catch (error) {
      console.error("External data enrichment failed:", error);
      // Return original analysis if enrichment fails
      return portfolioAnalysis;
    }
  }

  /**
   * Calculate data quality metrics
   */
  private async calculateDataQualityMetrics(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): Promise<DataQualityMetrics> {
    try {
      // Calculate completeness score
      const completeness = this.calculateCompleteness(
        financialMetrics,
        portfolioAnalysis
      );

      // Calculate accuracy score (based on data consistency)
      const accuracy = this.calculateAccuracy(
        financialMetrics,
        portfolioAnalysis
      );

      // Calculate consistency score
      const consistency = this.calculateConsistency(
        financialMetrics,
        portfolioAnalysis
      );

      // Perform validation checks
      const validation = await this.performValidationChecks(
        financialMetrics,
        portfolioAnalysis
      );

      return {
        completeness,
        accuracy,
        consistency,
        validation,
      };
    } catch (error) {
      console.error("Failed to calculate data quality metrics:", error);
      return this.getDefaultDataQuality();
    }
  }

  /**
   * Parse financial metrics from extracted data
   */
  private parseFinancialMetrics(data: any): DetailedFinancialMetrics {
    return {
      irr: {
        gross: data.irr?.gross || 0,
        net: data.irr?.net || 0,
        calculation: data.irr?.calculation || "Not available",
      },
      moic: {
        gross: data.moic?.gross || 0,
        net: data.moic?.net || 0,
        breakdown: data.moic?.breakdown || {},
      },
      tvpi: {
        total: data.tvpi?.total || 0,
        dpi: data.tvpi?.dpi || 0,
        rvpi: data.tvpi?.rvpi || 0,
        validation: data.tvpi?.validation || false,
      },
    };
  }

  /**
   * Parse portfolio analysis from extracted data
   */
  private parsePortfolioAnalysis(data: any): ComprehensivePortfolioAnalysis {
    return {
      companies: data.companies || [],
      sectors: data.sectors || [],
      stages: data.stages || [],
      performance: data.performance || {},
    };
  }

  /**
   * Calculate completeness score
   */
  private calculateCompleteness(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): number {
    let score = 0;
    let totalChecks = 0;

    // Check financial metrics completeness
    if (financialMetrics.irr.gross > 0) score += 1;
    totalChecks += 1;

    if (financialMetrics.moic.gross > 0) score += 1;
    totalChecks += 1;

    if (financialMetrics.tvpi.total > 0) score += 1;
    totalChecks += 1;

    // Check portfolio analysis completeness
    if (portfolioAnalysis.companies.length > 0) score += 1;
    totalChecks += 1;

    if (portfolioAnalysis.sectors.length > 0) score += 1;
    totalChecks += 1;

    return totalChecks > 0 ? score / totalChecks : 0;
  }

  /**
   * Calculate accuracy score
   */
  private calculateAccuracy(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): number {
    // Simple accuracy calculation based on data consistency
    let score = 0.8; // Base score

    // Adjust based on data consistency
    if (financialMetrics.tvpi.validation) score += 0.1;
    if (portfolioAnalysis.companies.length > 0) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Calculate consistency score
   */
  private calculateConsistency(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): number {
    // Check for data consistency across metrics
    let score = 0.7; // Base score

    // Check if TVPI components add up correctly
    if (
      financialMetrics.tvpi.dpi + financialMetrics.tvpi.rvpi ===
      financialMetrics.tvpi.total
    ) {
      score += 0.2;
    }

    // Check if IRR and MOIC are consistent
    if (financialMetrics.irr.gross > 0 && financialMetrics.moic.gross > 0) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Perform validation checks
   */
  private async performValidationChecks(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): Promise<any[]> {
    const validationResults = [];

    // Validate TVPI calculation
    if (
      financialMetrics.tvpi.dpi + financialMetrics.tvpi.rvpi !==
      financialMetrics.tvpi.total
    ) {
      validationResults.push({
        type: "calculation",
        field: "tvpi",
        message: "TVPI components do not add up correctly",
        severity: "warning",
      });
    }

    // Validate IRR range
    if (
      financialMetrics.irr.gross < -100 ||
      financialMetrics.irr.gross > 1000
    ) {
      validationResults.push({
        type: "range",
        field: "irr",
        message: "IRR value seems unrealistic",
        severity: "warning",
      });
    }

    return validationResults;
  }

  /**
   * Store analysis results in database
   */
  private async storeAnalysisResults(
    result: EnhancedAnalysisResult
  ): Promise<void> {
    try {
      await db.insert(analysis_results).values({
        document_id: this.documentId,
        user_id: this.userId,
        analysis_type: "enhanced",
        status: "completed",
        irr: result.tier1Data.financialMetrics?.irr?.gross?.toString(),
        moic: result.tier1Data.financialMetrics?.moic?.gross?.toString(),
        tvpi: result.tier1Data.financialMetrics?.tvpi?.total?.toString(),
        total_companies: result.tier1Data.portfolioAnalysis?.companies?.length,
        confidence_scores: result.confidence,
        data_quality_score: result.tier1Data.dataQuality?.overall?.toString(),
        processing_time_ms: result.processingTime,
        detailed_financial_metrics: result.tier1Data.financialMetrics,
        comprehensive_portfolio_analysis: result.tier1Data.portfolioAnalysis,
        enriched_portfolio_analysis: result.tier1Data.portfolioAnalysis, // Use the same for now
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: new Date(),
      });
    } catch (error) {
      console.error("Failed to store analysis results:", error);
      throw error;
    }
  }

  /**
   * Get default financial metrics when extraction fails
   */
  private getDefaultFinancialMetrics(): DetailedFinancialMetrics {
    return {
      irr: { gross: 0, net: 0, calculation: "Not available" },
      moic: { gross: 0, net: 0, breakdown: {} },
      tvpi: { total: 0, dpi: 0, rvpi: 0, validation: false },
    };
  }

  /**
   * Get default portfolio analysis when extraction fails
   */
  private getDefaultPortfolioAnalysis(): ComprehensivePortfolioAnalysis {
    return {
      companies: [],
      sectors: [],
      stages: [],
      performance: {},
    };
  }

  /**
   * Get default data quality metrics when calculation fails
   */
  private getDefaultDataQuality(): DataQualityMetrics {
    return {
      completeness: 0,
      accuracy: 0,
      consistency: 0,
      validation: [],
    };
  }
}

/**
 * Process enhanced analysis for a document
 * Main entry point for enhanced analysis processing
 */
export async function processEnhancedAnalysis(
  documentId: string,
  userId: string
): Promise<EnhancedAnalysisResult> {
  const service = new EnhancedAnalysisService(documentId, userId);
  return await service.processEnhancedAnalysis();
}
