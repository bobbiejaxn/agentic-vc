/**
 * Performance Attribution Service
 * Analyzes performance drivers and attribution across portfolio investments
 */

import {
  EnhancedInvestment,
  PerformanceAttribution,
} from "@/lib/types/enhanced-investments";

export class PerformanceAttributionService {
  /**
   * Calculate performance attribution for a portfolio
   */
  static calculatePortfolioAttribution(
    investments: EnhancedInvestment[]
  ): PerformanceAttribution {
    if (investments.length === 0) {
      return {
        sectorContribution: 0,
        stageContribution: 0,
        managerContribution: 0,
        marketContribution: 0,
        totalReturn: 0,
      };
    }

    const totalValue = investments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amountInvested),
      0
    );

    const sectorContribution = this.calculateSectorAttribution(
      investments,
      totalValue
    );
    const stageContribution = this.calculateStageAttribution(
      investments,
      totalValue
    );
    const managerContribution = this.calculateManagerAttribution(investments);
    const marketContribution = this.calculateMarketAttribution(investments);

    // Total return is sum of all contributions
    const totalReturn =
      sectorContribution +
      stageContribution +
      managerContribution +
      marketContribution;

    return {
      sectorContribution: Math.round(sectorContribution * 100) / 100,
      stageContribution: Math.round(stageContribution * 100) / 100,
      managerContribution: Math.round(managerContribution * 100) / 100,
      marketContribution: Math.round(marketContribution * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
    };
  }

  /**
   * Calculate sector-based performance attribution
   */
  private static calculateSectorAttribution(
    investments: EnhancedInvestment[],
    totalValue: number
  ): number {
    const sectorReturns: Record<string, number> = {};

    // Group investments by sector and calculate weighted returns
    investments.forEach((investment) => {
      const sector = investment.sector || "Unknown";
      const value = investment.currentValue || investment.amountInvested;
      const weight = value / totalValue;
      const returnRate = this.calculateInvestmentReturn(investment);

      if (!sectorReturns[sector]) {
        sectorReturns[sector] = 0;
      }

      sectorReturns[sector] += returnRate * weight;
    });

    // Calculate benchmark vs actual performance
    let totalSectorContribution = 0;

    Object.entries(sectorReturns).forEach(([sector, weightedReturn]) => {
      const benchmarkReturn = this.getSectorBenchmarkReturn(sector);
      const outperformance = weightedReturn - benchmarkReturn;
      totalSectorContribution += outperformance;
    });

    return totalSectorContribution;
  }

  /**
   * Calculate stage-based performance attribution
   */
  private static calculateStageAttribution(
    investments: EnhancedInvestment[],
    totalValue: number
  ): number {
    const stageReturns: Record<string, number> = {};

    // Group investments by stage and calculate weighted returns
    investments.forEach((investment) => {
      const stage = investment.stage || "Unknown";
      const value = investment.currentValue || investment.amountInvested;
      const weight = value / totalValue;
      const returnRate = this.calculateInvestmentReturn(investment);

      if (!stageReturns[stage]) {
        stageReturns[stage] = 0;
      }

      stageReturns[stage] += returnRate * weight;
    });

    // Calculate benchmark vs actual performance
    let totalStageContribution = 0;

    Object.entries(stageReturns).forEach(([stage, weightedReturn]) => {
      const benchmarkReturn = this.getStageBenchmarkReturn(stage);
      const outperformance = weightedReturn - benchmarkReturn;
      totalStageContribution += outperformance;
    });

    return totalStageContribution;
  }

  /**
   * Calculate manager/skill-based performance attribution
   */
  private static calculateManagerAttribution(
    investments: EnhancedInvestment[]
  ): number {
    // This represents the "alpha" - skill-based outperformance
    // Simplified calculation based on network strength and deal quality

    let totalManagerContribution = 0;

    investments.forEach((investment) => {
      const baseReturn = this.calculateInvestmentReturn(investment);

      // Manager contribution based on network strength
      const networkMultiplier = investment.networkStrength
        ? (investment.networkStrength - 0.5) * 0.5
        : 0; // ±25% based on network

      // Manager contribution based on deal source quality
      const dealSourceMultiplier = this.getDealSourceMultiplier(
        investment.dealSource
      );

      const managerContribution =
        baseReturn * (networkMultiplier + dealSourceMultiplier);

      totalManagerContribution += managerContribution;
    });

    return totalManagerContribution;
  }

  /**
   * Calculate market-based performance attribution
   */
  private static calculateMarketAttribution(
    investments: EnhancedInvestment[]
  ): number {
    // Market contribution represents beta exposure
    // Simplified calculation using average beta and market return

    const avgBeta =
      investments.reduce((sum, inv) => {
        // Simplified beta calculation
        const sectorBeta = this.getSectorBeta(inv.sector || "Unknown");
        return sum + sectorBeta;
      }, 0) / investments.length;

    const marketReturn = 12; // 12% average market return
    const riskFreeRate = 5; // 5% risk-free rate

    return avgBeta * (marketReturn - riskFreeRate);
  }

  /**
   * Calculate return rate for a single investment
   */
  private static calculateInvestmentReturn(
    investment: EnhancedInvestment
  ): number {
    if (investment.irr) {
      return investment.irr / 100; // Convert percentage to decimal
    }

    // Fallback calculation using MOIC and time
    if (investment.moic && investment.investmentDate) {
      const years =
        (Date.now() - investment.investmentDate.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000);
      if (years > 0) {
        return Math.pow(investment.moic, 1 / years) - 1;
      }
    }

    // Default return assumption
    return 0.25; // 25% annual return
  }

  /**
   * Get sector benchmark return
   */
  private static getSectorBenchmarkReturn(sector: string): number {
    const benchmarkReturns: Record<string, number> = {
      Technology: 0.15, // 15%
      Healthcare: 0.12,
      Biotechnology: 0.18,
      "Clean Technology": 0.14,
      "Enterprise Software": 0.16,
      "Financial Services": 0.1,
      Consumer: 0.08,
      Industrial: 0.11,
      Energy: 0.09,
      "Real Estate": 0.07,
    };

    return benchmarkReturns[sector] || 0.12;
  }

  /**
   * Get stage benchmark return
   */
  private static getStageBenchmarkReturn(stage: string): number {
    const benchmarkReturns: Record<string, number> = {
      "Pre-seed": 0.3, // 30%
      Seed: 0.28,
      "Series A": 0.25,
      "Series B": 0.22,
      "Series C": 0.18,
      "Series D+": 0.15,
      IPO: 0.12,
      Acquired: 0.2,
    };

    return benchmarkReturns[stage] || 0.2;
  }

  /**
   * Get deal source multiplier
   */
  private static getDealSourceMultiplier(dealSource?: string): number {
    const multipliers: Record<string, number> = {
      "Personal Network": 0.1,
      "Warm Introduction": 0.08,
      "Cold Outreach": -0.05,
      Platform: 0.02,
      AngelList: 0.03,
      Conference: 0.05,
      Advisor: 0.12,
      Other: 0.0,
    };

    return multipliers[dealSource || "Other"] || 0.0;
  }

  /**
   * Get sector beta
   */
  private static getSectorBeta(sector: string): number {
    const betas: Record<string, number> = {
      Technology: 1.2,
      Healthcare: 0.9,
      Biotechnology: 1.4,
      "Clean Technology": 1.3,
      "Enterprise Software": 1.3,
      "Financial Services": 1.1,
      Consumer: 0.8,
      Industrial: 0.9,
      Energy: 1.0,
      "Real Estate": 0.7,
    };

    return betas[sector] || 1.0;
  }

  /**
   * Calculate sector attribution with detailed breakdown
   */
  static calculateDetailedSectorAttribution(
    investments: EnhancedInvestment[]
  ): Record<
    string,
    {
      contribution: number;
      benchmark: number;
      outperformance: number;
      allocation: number;
    }
  > {
    const totalValue = investments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amountInvested),
      0
    );

    const sectorData: Record<
      string,
      {
        totalValue: number;
        totalReturn: number;
        count: number;
      }
    > = {};

    // Group by sector
    investments.forEach((investment) => {
      const sector = investment.sector || "Unknown";
      const value = investment.currentValue || investment.amountInvested;
      const returnRate = this.calculateInvestmentReturn(investment);

      if (!sectorData[sector]) {
        sectorData[sector] = { totalValue: 0, totalReturn: 0, count: 0 };
      }

      sectorData[sector].totalValue += value;
      sectorData[sector].totalReturn += returnRate * value;
      sectorData[sector].count += 1;
    });

    const result: Record<
      string,
      {
        contribution: number;
        benchmark: number;
        outperformance: number;
        allocation: number;
      }
    > = {};

    Object.entries(sectorData).forEach(([sector, data]) => {
      const allocation = data.totalValue / totalValue;
      const weightedReturn = data.totalReturn / data.totalValue;
      const benchmark = this.getSectorBenchmarkReturn(sector);
      const outperformance = weightedReturn - benchmark;
      const contribution = outperformance * allocation;

      result[sector] = {
        contribution,
        benchmark,
        outperformance,
        allocation,
      };
    });

    return result;
  }
}
