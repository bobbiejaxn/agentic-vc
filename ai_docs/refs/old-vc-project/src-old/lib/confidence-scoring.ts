import type {
  DetailedFinancialMetrics,
  ComprehensivePortfolioAnalysis,
  DataQualityMetrics,
  ConfidenceScore,
} from "@/lib/types/analysis";

/**
 * Confidence Scoring Service
 *
 * Calculates confidence scores for enhanced analysis results.
 * Provides comprehensive scoring based on data quality, completeness,
 * and consistency metrics.
 */
export class ConfidenceScoringService {
  /**
   * Calculate overall confidence score
   */
  static async calculateConfidenceScore(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis,
    dataQuality: DataQualityMetrics
  ): Promise<ConfidenceScore> {
    try {
      // Calculate individual confidence scores
      const financialConfidence =
        this.calculateFinancialConfidence(financialMetrics);
      const portfolioConfidence =
        this.calculatePortfolioConfidence(portfolioAnalysis);
      const dataQualityConfidence =
        this.calculateDataQualityConfidence(dataQuality);

      // Calculate overall confidence as weighted average
      const overallConfidence =
        financialConfidence * 0.4 +
        portfolioConfidence * 0.3 +
        dataQualityConfidence * 0.3;

      return {
        overall: Math.min(overallConfidence, 1.0),
        financial: financialConfidence,
        portfolio: portfolioConfidence,
        dataQuality: dataQualityConfidence,
      };
    } catch (error) {
      console.error("Failed to calculate confidence score:", error);
      return {
        overall: 0,
        financial: 0,
        portfolio: 0,
        dataQuality: 0,
      };
    }
  }

  /**
   * Calculate confidence in financial metrics
   */
  private static calculateFinancialConfidence(
    financialMetrics: DetailedFinancialMetrics
  ): number {
    let score = 0;
    let factors = 0;

    // IRR confidence
    if (financialMetrics.irr.gross > 0) {
      score += this.scoreIRR(financialMetrics.irr);
      factors += 1;
    }

    // MOIC confidence
    if (financialMetrics.moic.gross > 0) {
      score += this.scoreMOIC(financialMetrics.moic);
      factors += 1;
    }

    // TVPI confidence
    if (financialMetrics.tvpi.total > 0) {
      score += this.scoreTVPI(financialMetrics.tvpi);
      factors += 1;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate confidence in portfolio analysis
   */
  private static calculatePortfolioConfidence(
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): number {
    let score = 0;
    let factors = 0;

    // Company data confidence
    if (portfolioAnalysis.companies.length > 0) {
      score += this.scoreCompanyData(portfolioAnalysis.companies);
      factors += 1;
    }

    // Sector analysis confidence
    if (portfolioAnalysis.sectors.length > 0) {
      score += this.scoreSectorAnalysis(portfolioAnalysis.sectors);
      factors += 1;
    }

    // Stage analysis confidence
    if (portfolioAnalysis.stages.length > 0) {
      score += this.scoreStageAnalysis(portfolioAnalysis.stages);
      factors += 1;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate confidence in data quality
   */
  private static calculateDataQualityConfidence(
    dataQuality: DataQualityMetrics
  ): number {
    // Weighted average of quality metrics
    return (
      dataQuality.completeness * 0.4 +
      dataQuality.accuracy * 0.4 +
      dataQuality.consistency * 0.2
    );
  }

  /**
   * Score IRR data quality
   */
  private static scoreIRR(irr: {
    gross: number;
    net: number;
    calculation: string;
  }): number {
    let score = 0.5; // Base score

    // Check if both gross and net IRR are available
    if (irr.gross > 0 && irr.net > 0) {
      score += 0.2;
    }

    // Check if calculation method is provided
    if (irr.calculation && irr.calculation !== "Not available") {
      score += 0.2;
    }

    // Check for realistic IRR values
    if (irr.gross >= -50 && irr.gross <= 500) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Score MOIC data quality
   */
  private static scoreMOIC(moic: {
    gross: number;
    net: number;
    breakdown: any;
  }): number {
    let score = 0.5; // Base score

    // Check if both gross and net MOIC are available
    if (moic.gross > 0 && moic.net > 0) {
      score += 0.2;
    }

    // Check if breakdown data is available
    if (moic.breakdown && Object.keys(moic.breakdown).length > 0) {
      score += 0.2;
    }

    // Check for realistic MOIC values
    if (moic.gross >= 0 && moic.gross <= 100) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Score TVPI data quality
   */
  private static scoreTVPI(tvpi: {
    total: number;
    dpi: number;
    rvpi: number;
    validation: boolean;
  }): number {
    let score = 0.5; // Base score

    // Check if all components are available
    if (tvpi.total > 0 && tvpi.dpi >= 0 && tvpi.rvpi >= 0) {
      score += 0.2;
    }

    // Check if TVPI calculation is validated
    if (tvpi.validation) {
      score += 0.2;
    }

    // Check if components add up correctly
    if (Math.abs(tvpi.dpi + tvpi.rvpi - tvpi.total) < 0.01) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Score company data quality
   */
  private static scoreCompanyData(companies: any[]): number {
    if (companies.length === 0) return 0;

    let totalScore = 0;
    let validCompanies = 0;

    for (const company of companies) {
      let companyScore = 0.3; // Base score

      // Check for required fields
      if (company.name) companyScore += 0.1;
      if (company.stage) companyScore += 0.1;
      if (company.sector) companyScore += 0.1;
      if (company.investmentAmount > 0) companyScore += 0.1;
      if (company.currentValue > 0) companyScore += 0.1;
      if (company.multiple > 0) companyScore += 0.1;
      if (company.irr !== undefined) companyScore += 0.1;

      totalScore += Math.min(companyScore, 1.0);
      validCompanies++;
    }

    return validCompanies > 0 ? totalScore / validCompanies : 0;
  }

  /**
   * Score sector analysis quality
   */
  private static scoreSectorAnalysis(sectors: any[]): number {
    if (sectors.length === 0) return 0;

    let totalScore = 0;
    let validSectors = 0;

    for (const sector of sectors) {
      let sectorScore = 0.4; // Base score

      // Check for required metrics
      if (sector.count > 0) sectorScore += 0.1;
      if (sector.totalInvested > 0) sectorScore += 0.1;
      if (sector.currentValue > 0) sectorScore += 0.1;
      if (sector.averageReturn !== undefined) sectorScore += 0.1;
      if (sector.topPerformers && sector.topPerformers.length > 0)
        sectorScore += 0.1;
      if (sector.underperformers && sector.underperformers.length > 0)
        sectorScore += 0.1;

      totalScore += Math.min(sectorScore, 1.0);
      validSectors++;
    }

    return validSectors > 0 ? totalScore / validSectors : 0;
  }

  /**
   * Score stage analysis quality
   */
  private static scoreStageAnalysis(stages: any[]): number {
    if (stages.length === 0) return 0;

    let totalScore = 0;
    let validStages = 0;

    for (const stage of stages) {
      let stageScore = 0.4; // Base score

      // Check for required metrics
      if (stage.count > 0) stageScore += 0.1;
      if (stage.totalInvested > 0) stageScore += 0.1;
      if (stage.currentValue > 0) stageScore += 0.1;
      if (stage.averageReturn !== undefined) stageScore += 0.1;
      if (stage.successRate >= 0 && stage.successRate <= 1) stageScore += 0.1;
      if (stage.averageHoldingPeriod > 0) stageScore += 0.1;

      totalScore += Math.min(stageScore, 1.0);
      validStages++;
    }

    return validStages > 0 ? totalScore / validStages : 0;
  }
}

/**
 * Calculate confidence score for enhanced analysis
 * Main entry point for confidence scoring
 */
export async function calculateConfidenceScore(
  financialMetrics: DetailedFinancialMetrics,
  portfolioAnalysis: ComprehensivePortfolioAnalysis,
  dataQuality: DataQualityMetrics
): Promise<ConfidenceScore> {
  return await ConfidenceScoringService.calculateConfidenceScore(
    financialMetrics,
    portfolioAnalysis,
    dataQuality
  );
}
