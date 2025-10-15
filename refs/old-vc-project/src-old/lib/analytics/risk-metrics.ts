/**
 * Risk Metrics Calculation Service
 * Calculates comprehensive risk metrics for investment portfolios
 */

import {
  EnhancedInvestment,
  RiskMetrics,
} from "@/lib/types/enhanced-investments";

export class RiskMetricsService {
  /**
   * Calculate risk metrics for a single investment
   */
  static calculateInvestmentRiskMetrics(
    investment: EnhancedInvestment,
    marketData: any
  ): RiskMetrics {
    // Simplified risk calculation - in production, this would use historical data
    const baseBeta = this.calculateBeta(investment, marketData);
    const volatility = this.calculateVolatility(investment);
    const sharpeRatio = this.calculateSharpeRatio(investment, volatility);

    return {
      beta: baseBeta,
      volatility,
      sharpeRatio,
      maxDrawdown: this.calculateMaxDrawdown(investment),
      var: this.calculateValueAtRisk(investment, volatility),
    };
  }

  /**
   * Calculate beta for an investment
   */
  private static calculateBeta(
    investment: EnhancedInvestment,
    marketData: any
  ): number {
    // Simplified beta calculation
    // In production, this would use historical price correlation with market indices

    const sectorBeta = this.getSectorBeta(investment.sector || "Unknown");
    const stageBeta = this.getStageBeta(investment.stage || "Unknown");

    // Weighted average of sector and stage betas
    const baseBeta = sectorBeta * 0.7 + stageBeta * 0.3;

    // Adjust based on company-specific factors
    const companyAdjustment = this.calculateCompanyBetaAdjustment(investment);

    return Math.max(0.1, Math.min(3.0, baseBeta + companyAdjustment));
  }

  /**
   * Get sector-specific beta
   */
  private static getSectorBeta(sector: string): number {
    const sectorBetas: Record<string, number> = {
      Technology: 1.2,
      Healthcare: 0.9,
      "Financial Services": 1.1,
      "Clean Technology": 1.3,
      "Enterprise Software": 1.4,
      Biotechnology: 1.5,
      Consumer: 0.8,
      Industrial: 0.9,
      Energy: 1.0,
      "Real Estate": 0.7,
    };

    return sectorBetas[sector] || 1.0;
  }

  /**
   * Get stage-specific beta
   */
  private static getStageBeta(stage: string): number {
    const stageBetas: Record<string, number> = {
      "Pre-seed": 1.8,
      Seed: 1.6,
      "Series A": 1.4,
      "Series B": 1.2,
      "Series C": 1.0,
      "Series D+": 0.9,
      IPO: 0.8,
      Acquired: 0.6,
    };

    return stageBetas[stage] || 1.2;
  }

  /**
   * Calculate company-specific beta adjustments
   */
  private static calculateCompanyBetaAdjustment(
    investment: EnhancedInvestment
  ): number {
    let adjustment = 0;

    // Revenue growth impact
    if (investment.companyGrowth && investment.companyGrowth > 50) {
      adjustment += 0.2; // High growth companies are riskier
    } else if (investment.companyGrowth && investment.companyGrowth < 10) {
      adjustment -= 0.1; // Low growth companies are less risky
    }

    // Market position impact
    if (investment.competitivePosition === "Strong") {
      adjustment -= 0.1;
    } else if (investment.competitivePosition === "Weak") {
      adjustment += 0.2;
    }

    // Network strength impact
    if (investment.networkStrength && investment.networkStrength > 0.7) {
      adjustment -= 0.1; // Strong networks reduce risk
    }

    return adjustment;
  }

  /**
   * Calculate volatility for an investment
   */
  private static calculateVolatility(investment: EnhancedInvestment): number {
    // Simplified volatility calculation
    // In production, this would use historical price data

    const baseVolatility = 25; // Base 25% annual volatility for VC investments

    // Adjust based on stage
    const stageAdjustment = this.getStageVolatilityAdjustment(
      investment.stage || "Unknown"
    );

    // Adjust based on sector
    const sectorAdjustment = this.getSectorVolatilityAdjustment(
      investment.sector || "Unknown"
    );

    // Adjust based on company size (revenue)
    const sizeAdjustment = this.getSizeVolatilityAdjustment(
      investment.companyRevenue
    );

    return Math.max(
      5,
      Math.min(
        80,
        baseVolatility + stageAdjustment + sectorAdjustment + sizeAdjustment
      )
    );
  }

  /**
   * Get stage-specific volatility adjustment
   */
  private static getStageVolatilityAdjustment(stage: string): number {
    const adjustments: Record<string, number> = {
      "Pre-seed": 20,
      Seed: 15,
      "Series A": 10,
      "Series B": 5,
      "Series C": 0,
      "Series D+": -5,
      IPO: -10,
      Acquired: -15,
    };

    return adjustments[stage] || 10;
  }

  /**
   * Get sector-specific volatility adjustment
   */
  private static getSectorVolatilityAdjustment(sector: string): number {
    const adjustments: Record<string, number> = {
      Technology: 5,
      Healthcare: -5,
      Biotechnology: 15,
      "Clean Technology": 10,
      "Enterprise Software": 5,
      "Financial Services": -10,
      Consumer: -5,
      Industrial: 0,
      Energy: 5,
      "Real Estate": -10,
    };

    return adjustments[sector] || 0;
  }

  /**
   * Get size-based volatility adjustment
   */
  private static getSizeVolatilityAdjustment(revenue?: number): number {
    if (!revenue) return 5; // Unknown size

    if (revenue > 100000000) return -10; // Large companies
    if (revenue > 10000000) return -5; // Medium companies
    if (revenue > 1000000) return 0; // Small companies
    return 5; // Very small companies
  }

  /**
   * Calculate Sharpe ratio
   */
  private static calculateSharpeRatio(
    investment: EnhancedInvestment,
    volatility: number
  ): number {
    // Simplified Sharpe ratio calculation
    // Sharpe Ratio = (Expected Return - Risk-Free Rate) / Volatility

    const expectedReturn = investment.irr || 25; // 25% expected return for VC
    const riskFreeRate = 5; // 5% risk-free rate

    if (volatility === 0) return 0;

    return (expectedReturn - riskFreeRate) / volatility;
  }

  /**
   * Calculate maximum drawdown
   */
  private static calculateMaxDrawdown(investment: EnhancedInvestment): number {
    // Simplified max drawdown calculation
    // In production, this would use historical value data

    const stageRisk = this.getStageRiskFactor(investment.stage || "Unknown");
    const sectorRisk = this.getSectorRiskFactor(investment.sector || "Unknown");

    // Max drawdown typically ranges from 20-80% for VC investments
    const baseDrawdown = 40;
    const adjustment = (stageRisk + sectorRisk) / 2;

    return Math.max(10, Math.min(90, baseDrawdown + adjustment));
  }

  /**
   * Get stage-specific risk factor
   */
  private static getStageRiskFactor(stage: string): number {
    const riskFactors: Record<string, number> = {
      "Pre-seed": 30,
      Seed: 25,
      "Series A": 20,
      "Series B": 15,
      "Series C": 10,
      "Series D+": 5,
      IPO: 0,
      Acquired: -5,
    };

    return riskFactors[stage] || 15;
  }

  /**
   * Get sector-specific risk factor
   */
  private static getSectorRiskFactor(sector: string): number {
    const riskFactors: Record<string, number> = {
      Technology: 10,
      Healthcare: 5,
      Biotechnology: 25,
      "Clean Technology": 15,
      "Enterprise Software": 10,
      "Financial Services": 0,
      Consumer: 5,
      Industrial: 10,
      Energy: 15,
      "Real Estate": 0,
    };

    return riskFactors[sector] || 10;
  }

  /**
   * Calculate Value at Risk (VaR)
   */
  private static calculateValueAtRisk(
    investment: EnhancedInvestment,
    volatility: number
  ): number {
    // Simplified VaR calculation
    // VaR = Investment Value * Z-Score * Volatility * sqrt(Time Horizon)

    const investmentValue =
      investment.currentValue || investment.amountInvested;
    const confidenceLevel = 0.95; // 95% confidence
    const timeHorizon = 1; // 1 year
    const zScore = 1.645; // Z-score for 95% confidence

    const valueAtRisk =
      investmentValue * zScore * (volatility / 100) * Math.sqrt(timeHorizon);

    return Math.round(valueAtRisk);
  }

  /**
   * Calculate portfolio risk metrics
   */
  static calculatePortfolioRiskMetrics(
    investments: EnhancedInvestment[]
  ): RiskMetrics {
    if (investments.length === 0) {
      return {
        beta: 0,
        volatility: 0,
        sharpeRatio: 0,
      };
    }

    // Weighted average calculations
    const totalValue = investments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amountInvested),
      0
    );

    const weightedBeta = investments.reduce((sum, inv) => {
      const weight = (inv.currentValue || inv.amountInvested) / totalValue;
      const beta = this.calculateBeta(inv, null);
      return sum + beta * weight;
    }, 0);

    const weightedVolatility = investments.reduce((sum, inv) => {
      const weight = (inv.currentValue || inv.amountInvested) / totalValue;
      const volatility = this.calculateVolatility(inv);
      return sum + volatility * weight;
    }, 0);

    const avgIRR =
      investments.reduce((sum, inv) => sum + (inv.irr || 0), 0) /
      investments.length;

    const portfolioSharpeRatio =
      avgIRR > 0 ? (avgIRR - 5) / (weightedVolatility / 100) : 0;

    return {
      beta: Math.round(weightedBeta * 100) / 100,
      volatility: Math.round(weightedVolatility * 100) / 100,
      sharpeRatio: Math.round(portfolioSharpeRatio * 100) / 100,
    };
  }
}
