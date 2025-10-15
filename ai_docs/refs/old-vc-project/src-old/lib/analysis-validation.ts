import type {
  DetailedFinancialMetrics,
  ComprehensivePortfolioAnalysis,
  ValidationResult,
} from "./types/analysis";

/**
 * Analysis Validation Service
 *
 * Validates enhanced analysis results for consistency, accuracy,
 * and completeness. Provides comprehensive validation checks
 * to ensure data quality.
 */
export class AnalysisValidationService {
  /**
   * Validate analysis data
   * Main validation function for enhanced analysis results
   */
  static async validateAnalysisData(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): Promise<ValidationResult[]> {
    const validationResults: ValidationResult[] = [];

    try {
      // Validate financial metrics
      validationResults.push(
        ...this.validateFinancialMetrics(financialMetrics)
      );

      // Validate portfolio analysis
      validationResults.push(
        ...this.validatePortfolioAnalysis(portfolioAnalysis)
      );

      // Validate cross-consistency
      validationResults.push(
        ...this.validateCrossConsistency(financialMetrics, portfolioAnalysis)
      );

      return validationResults;
    } catch (error) {
      console.error("Analysis validation failed:", error);
      return [
        {
          type: "consistency",
          field: "validation",
          message: "Validation process failed",
          severity: "error",
          suggestedFix: "Check system logs for detailed error information",
        },
      ];
    }
  }

  /**
   * Validate financial metrics
   */
  private static validateFinancialMetrics(
    financialMetrics: DetailedFinancialMetrics
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate IRR values
    if (
      financialMetrics.irr.gross < -100 ||
      financialMetrics.irr.gross > 1000
    ) {
      results.push({
        type: "range",
        field: "irr.gross",
        message: "IRR value seems unrealistic",
        severity: "warning",
        suggestedFix: "Verify IRR calculation and input data",
      });
    }

    if (financialMetrics.irr.net > financialMetrics.irr.gross) {
      results.push({
        type: "consistency",
        field: "irr",
        message: "Net IRR should not exceed gross IRR",
        severity: "error",
        suggestedFix: "Check fee calculations and IRR methodology",
      });
    }

    // Validate MOIC values
    if (financialMetrics.moic.gross < 0 || financialMetrics.moic.gross > 1000) {
      results.push({
        type: "range",
        field: "moic.gross",
        message: "MOIC value seems unrealistic",
        severity: "warning",
        suggestedFix: "Verify MOIC calculation and current valuations",
      });
    }

    if (financialMetrics.moic.net > financialMetrics.moic.gross) {
      results.push({
        type: "consistency",
        field: "moic",
        message: "Net MOIC should not exceed gross MOIC",
        severity: "error",
        suggestedFix: "Check fee calculations and MOIC methodology",
      });
    }

    // Validate TVPI calculation
    const tvpiSum = financialMetrics.tvpi.dpi + financialMetrics.tvpi.rvpi;
    const tvpiDifference = Math.abs(tvpiSum - financialMetrics.tvpi.total);

    if (tvpiDifference > 0.01) {
      results.push({
        type: "calculation",
        field: "tvpi",
        message: "TVPI components do not add up correctly",
        severity: "error",
        suggestedFix: "Recalculate TVPI: DPI + RVPI should equal total TVPI",
      });
    }

    // Validate TVPI values
    if (financialMetrics.tvpi.total < 0 || financialMetrics.tvpi.total > 1000) {
      results.push({
        type: "range",
        field: "tvpi.total",
        message: "TVPI value seems unrealistic",
        severity: "warning",
        suggestedFix: "Verify TVPI calculation and current valuations",
      });
    }

    if (financialMetrics.tvpi.dpi < 0 || financialMetrics.tvpi.rvpi < 0) {
      results.push({
        type: "range",
        field: "tvpi",
        message: "DPI and RVPI should not be negative",
        severity: "error",
        suggestedFix: "Check distribution and residual value calculations",
      });
    }

    return results;
  }

  /**
   * Validate portfolio analysis
   */
  private static validatePortfolioAnalysis(
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate company data
    for (let i = 0; i < portfolioAnalysis.companies.length; i++) {
      const company = portfolioAnalysis.companies[i];
      const companyResults = this.validateCompanyData(company, i);
      results.push(...companyResults);
    }

    // Validate sector analysis
    for (let i = 0; i < portfolioAnalysis.sectors.length; i++) {
      const sector = portfolioAnalysis.sectors[i];
      const sectorResults = this.validateSectorData(sector, i);
      results.push(...sectorResults);
    }

    // Validate stage analysis
    for (let i = 0; i < portfolioAnalysis.stages.length; i++) {
      const stage = portfolioAnalysis.stages[i];
      const stageResults = this.validateStageData(stage, i);
      results.push(...stageResults);
    }

    // Validate performance metrics
    const performanceResults = this.validatePerformanceMetrics(
      portfolioAnalysis.performance
    );
    results.push(...performanceResults);

    return results;
  }

  /**
   * Validate individual company data
   */
  private static validateCompanyData(
    company: any,
    index: number
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Check required fields
    if (!company.name) {
      results.push({
        type: "completeness",
        field: `companies[${index}].name`,
        message: "Company name is required",
        severity: "error",
        suggestedFix: "Provide company name",
      });
    }

    if (!company.stage) {
      results.push({
        type: "completeness",
        field: `companies[${index}].stage`,
        message: "Investment stage is required",
        severity: "warning",
        suggestedFix: "Specify investment stage",
      });
    }

    // Validate financial values
    if (company.investmentAmount <= 0) {
      results.push({
        type: "range",
        field: `companies[${index}].investmentAmount`,
        message: "Investment amount should be positive",
        severity: "warning",
        suggestedFix: "Verify investment amount",
      });
    }

    if (company.currentValue < 0) {
      results.push({
        type: "range",
        field: `companies[${index}].currentValue`,
        message: "Current value should not be negative",
        severity: "error",
        suggestedFix: "Check current valuation",
      });
    }

    if (company.multiple < 0) {
      results.push({
        type: "range",
        field: `companies[${index}].multiple`,
        message: "Multiple should not be negative",
        severity: "error",
        suggestedFix: "Recalculate multiple: currentValue / investmentAmount",
      });
    }

    // Validate IRR range
    if (company.irr < -100 || company.irr > 1000) {
      results.push({
        type: "range",
        field: `companies[${index}].irr`,
        message: "Company IRR seems unrealistic",
        severity: "warning",
        suggestedFix: "Verify IRR calculation",
      });
    }

    return results;
  }

  /**
   * Validate sector data
   */
  private static validateSectorData(
    sector: any,
    index: number
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Check required fields
    if (!sector.sector) {
      results.push({
        type: "completeness",
        field: `sectors[${index}].sector`,
        message: "Sector name is required",
        severity: "error",
        suggestedFix: "Provide sector name",
      });
    }

    // Validate counts
    if (sector.count < 0) {
      results.push({
        type: "range",
        field: `sectors[${index}].count`,
        message: "Company count should not be negative",
        severity: "error",
        suggestedFix: "Verify company count",
      });
    }

    // Validate financial values
    if (sector.totalInvested < 0) {
      results.push({
        type: "range",
        field: `sectors[${index}].totalInvested`,
        message: "Total invested should not be negative",
        severity: "error",
        suggestedFix: "Check total invested amount",
      });
    }

    if (sector.currentValue < 0) {
      results.push({
        type: "range",
        field: `sectors[${index}].currentValue`,
        message: "Current value should not be negative",
        severity: "error",
        suggestedFix: "Check current valuations",
      });
    }

    return results;
  }

  /**
   * Validate stage data
   */
  private static validateStageData(
    stage: any,
    index: number
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Check required fields
    if (!stage.stage) {
      results.push({
        type: "completeness",
        field: `stages[${index}].stage`,
        message: "Stage name is required",
        severity: "error",
        suggestedFix: "Provide stage name",
      });
    }

    // Validate success rate
    if (stage.successRate < 0 || stage.successRate > 1) {
      results.push({
        type: "range",
        field: `stages[${index}].successRate`,
        message: "Success rate should be between 0 and 1",
        severity: "error",
        suggestedFix: "Calculate success rate as decimal (0.0 to 1.0)",
      });
    }

    // Validate holding period
    if (stage.averageHoldingPeriod < 0) {
      results.push({
        type: "range",
        field: `stages[${index}].averageHoldingPeriod`,
        message: "Average holding period should not be negative",
        severity: "error",
        suggestedFix: "Check holding period calculation",
      });
    }

    return results;
  }

  /**
   * Validate performance metrics
   */
  private static validatePerformanceMetrics(
    performance: any
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate total values
    if (performance.totalInvested < 0) {
      results.push({
        type: "range",
        field: "performance.totalInvested",
        message: "Total invested should not be negative",
        severity: "error",
        suggestedFix: "Check total invested calculation",
      });
    }

    if (performance.currentValue < 0) {
      results.push({
        type: "range",
        field: "performance.currentValue",
        message: "Current value should not be negative",
        severity: "error",
        suggestedFix: "Check current value calculation",
      });
    }

    // Validate return metrics
    if (performance.irr < -100 || performance.irr > 1000) {
      results.push({
        type: "range",
        field: "performance.irr",
        message: "Portfolio IRR seems unrealistic",
        severity: "warning",
        suggestedFix: "Verify IRR calculation",
      });
    }

    if (performance.moic < 0 || performance.moic > 1000) {
      results.push({
        type: "range",
        field: "performance.moic",
        message: "Portfolio MOIC seems unrealistic",
        severity: "warning",
        suggestedFix: "Verify MOIC calculation",
      });
    }

    return results;
  }

  /**
   * Validate cross-consistency between financial metrics and portfolio analysis
   */
  private static validateCrossConsistency(
    financialMetrics: DetailedFinancialMetrics,
    portfolioAnalysis: ComprehensivePortfolioAnalysis
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Check if portfolio performance matches fund-level metrics
    if (
      portfolioAnalysis.performance.irr > 0 &&
      financialMetrics.irr.gross > 0
    ) {
      const irrDifference = Math.abs(
        portfolioAnalysis.performance.irr - financialMetrics.irr.gross
      );
      if (irrDifference > 5) {
        // 5% difference threshold
        results.push({
          type: "consistency",
          field: "irr",
          message: "Portfolio IRR differs significantly from fund IRR",
          severity: "warning",
          suggestedFix: "Verify IRR calculations for consistency",
        });
      }
    }

    if (
      portfolioAnalysis.performance.moic > 0 &&
      financialMetrics.moic.gross > 0
    ) {
      const moicDifference = Math.abs(
        portfolioAnalysis.performance.moic - financialMetrics.moic.gross
      );
      if (moicDifference > 0.5) {
        // 0.5x difference threshold
        results.push({
          type: "consistency",
          field: "moic",
          message: "Portfolio MOIC differs significantly from fund MOIC",
          severity: "warning",
          suggestedFix: "Verify MOIC calculations for consistency",
        });
      }
    }

    return results;
  }
}

/**
 * Validate analysis data
 * Main entry point for analysis validation
 */
export async function validateAnalysisData(
  financialMetrics: DetailedFinancialMetrics,
  portfolioAnalysis: ComprehensivePortfolioAnalysis
): Promise<ValidationResult[]> {
  return await AnalysisValidationService.validateAnalysisData(
    financialMetrics,
    portfolioAnalysis
  );
}
