/**
 * Financial Data Validation Service
 *
 * Validates extracted financial data for consistency and accuracy
 */

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  expectedValue?: number;
  actualValue?: number;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

export class DataValidator {
  /**
   * Validate fund-level metrics for consistency
   */
  validateFundMetrics(data: Record<string, unknown>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // TVPI = DPI + RVPI validation
    if (data.tvpi && data.dpi !== null && data.rvpi !== null) {
      const expectedTVPI = (data.dpi || 0) + (data.rvpi || 0);
      const tvpiDifference = Math.abs(data.tvpi - expectedTVPI);

      if (tvpiDifference > 0.01) {
        // Allow for small rounding differences
        errors.push({
          field: "tvpi",
          message: `TVPI (${data.tvpi}) does not equal DPI (${data.dpi}) + RVPI (${data.rvpi}) = ${expectedTVPI}`,
          severity: "high",
          expectedValue: expectedTVPI,
          actualValue: data.tvpi,
        });
      }
    }

    // NAV validation against portfolio companies
    if (data.fundNAV && data.portfolioCompanies) {
      const portfolioTotal = this.calculatePortfolioTotal(
        data.portfolioCompanies
      );
      const navDifference = Math.abs(data.fundNAV - portfolioTotal);

      if (navDifference > data.fundNAV * 0.1) {
        // 10% tolerance
        warnings.push({
          field: "fundNAV",
          message: `Fund NAV (${data.fundNAV}) differs significantly from portfolio total (${portfolioTotal})`,
          suggestion:
            "Verify portfolio company valuations are current and complete",
        });
      }
    }

    // Capital deployment validation
    if (data.totalCommitments && data.cumulativeCalledCapital) {
      const deploymentRate =
        data.cumulativeCalledCapital / data.totalCommitments;

      if (deploymentRate > 1.0) {
        errors.push({
          field: "cumulativeCalledCapital",
          message: `Called capital (${data.cumulativeCalledCapital}) exceeds total commitments (${data.totalCommitments})`,
          severity: "critical",
          expectedValue: data.totalCommitments,
          actualValue: data.cumulativeCalledCapital,
        });
      }

      if (deploymentRate > 0.95) {
        warnings.push({
          field: "deploymentRate",
          message: `Fund is ${(deploymentRate * 100).toFixed(1)}% deployed`,
          suggestion:
            "Consider fund lifecycle stage and remaining investment capacity",
        });
      }
    }

    // IRR reasonableness check
    if (data.irr) {
      if (data.irr > 100) {
        errors.push({
          field: "irr",
          message: `IRR of ${data.irr}% seems unreasonably high`,
          severity: "medium",
          actualValue: data.irr,
        });
      }

      if (data.irr < -50) {
        warnings.push({
          field: "irr",
          message: `IRR of ${data.irr}% indicates significant losses`,
          suggestion: "Verify IRR calculation and fund performance",
        });
      }
    }

    const confidence = this.calculateValidationConfidence(errors, warnings);

    return {
      isValid: errors.length === 0,
      confidence,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate portfolio company data
   */
  validatePortfolioCompanies(
    companies: Record<string, unknown>[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    companies.forEach((company, index) => {
      // MOIC validation
      if (company.moic && company.investment && company.valuation) {
        const expectedMOIC = company.valuation / company.investment;
        const moicDifference = Math.abs(company.moic - expectedMOIC);

        if (moicDifference > 0.1) {
          errors.push({
            field: `portfolioCompanies[${index}].moic`,
            message: `MOIC (${
              company.moic
            }) doesn't match valuation/investment ratio (${expectedMOIC.toFixed(
              2
            )})`,
            severity: "medium",
            expectedValue: expectedMOIC,
            actualValue: company.moic,
          });
        }
      }

      // IRR reasonableness
      if (company.irr && (company.irr > 1000 || company.irr < -100)) {
        warnings.push({
          field: `portfolioCompanies[${index}].irr`,
          message: `IRR of ${company.irr}% seems unusual`,
          suggestion: "Verify IRR calculation methodology",
        });
      }

      // Missing critical data
      if (!company.name || !company.stage || !company.sector) {
        warnings.push({
          field: `portfolioCompanies[${index}]`,
          message: "Missing critical company information",
          suggestion: "Complete company profile data",
        });
      }
    });

    const confidence = this.calculateValidationConfidence(errors, warnings);

    return {
      isValid: errors.length === 0,
      confidence,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Cross-validate fund and portfolio data
   */
  crossValidateFundAndPortfolio(
    fundData: Record<string, unknown>,
    portfolioData: Record<string, unknown>
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Portfolio total vs fund NAV
    if (fundData.fundNAV && portfolioData.companies) {
      const portfolioTotal = this.calculatePortfolioTotal(
        portfolioData.companies
      );
      const difference = Math.abs(fundData.fundNAV - portfolioTotal);
      const percentageDifference = (difference / fundData.fundNAV) * 100;

      if (percentageDifference > 15) {
        errors.push({
          field: "cross_validation",
          message: `Fund NAV (${
            fundData.fundNAV
          }) differs by ${percentageDifference.toFixed(
            1
          )}% from portfolio total (${portfolioTotal})`,
          severity: "high",
          expectedValue: fundData.fundNAV,
          actualValue: portfolioTotal,
        });
      }
    }

    // Portfolio company count validation
    if (fundData.portfolioCompanyCount && portfolioData.companies) {
      const actualCount = portfolioData.companies.length;
      const expectedCount = fundData.portfolioCompanyCount;

      if (actualCount !== expectedCount) {
        warnings.push({
          field: "portfolio_company_count",
          message: `Portfolio company count mismatch: expected ${expectedCount}, found ${actualCount}`,
          suggestion:
            "Verify all portfolio companies are included in the report",
        });
      }
    }

    const confidence = this.calculateValidationConfidence(errors, warnings);

    return {
      isValid: errors.length === 0,
      confidence,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Calculate total portfolio value
   */
  private calculatePortfolioTotal(
    companies: Record<string, unknown>[]
  ): number {
    return companies.reduce((total, company) => {
      return total + (company.valuation || 0);
    }, 0);
  }

  /**
   * Calculate validation confidence score
   */
  private calculateValidationConfidence(
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): number {
    const criticalErrors = errors.filter(
      (e) => e.severity === "critical"
    ).length;
    const highErrors = errors.filter((e) => e.severity === "high").length;
    const mediumErrors = errors.filter((e) => e.severity === "medium").length;
    const lowErrors = errors.filter((e) => e.severity === "low").length;

    // Weight errors by severity
    const errorScore =
      criticalErrors * 0.4 +
      highErrors * 0.3 +
      mediumErrors * 0.2 +
      lowErrors * 0.1;
    const warningScore = warnings.length * 0.05;

    const totalScore = errorScore + warningScore;
    return Math.max(0, 1 - totalScore);
  }
}
