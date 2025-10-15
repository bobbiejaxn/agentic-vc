/**
 * Benchmark Comparison Service
 * Provides benchmark data for performance comparison and analysis
 */

import {
  EnhancedInvestment,
  BenchmarkData,
} from "@/lib/types/enhanced-investments";

export class BenchmarkService {
  /**
   * Get comprehensive benchmark data for a portfolio
   */
  static getPortfolioBenchmarks(
    investments: EnhancedInvestment[]
  ): BenchmarkData {
    const sectorBenchmark = this.getSectorBenchmark(investments);
    const stageBenchmark = this.getStageBenchmark(investments);
    const marketBenchmark = this.getMarketBenchmark();
    const peerBenchmark = this.getPeerBenchmark(investments);

    return {
      sectorBenchmark,
      stageBenchmark,
      marketBenchmark,
      peerBenchmark,
    };
  }

  /**
   * Calculate sector benchmark performance
   */
  private static getSectorBenchmark(investments: EnhancedInvestment[]): number {
    const sectorWeights: Record<string, number> = {};

    // Calculate sector allocation
    const totalValue = investments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amountInvested),
      0
    );

    investments.forEach((investment) => {
      const sector = investment.sector || "Unknown";
      const value = investment.currentValue || investment.amountInvested;
      const weight = value / totalValue;

      if (!sectorWeights[sector]) {
        sectorWeights[sector] = 0;
      }

      sectorWeights[sector] += weight;
    });

    // Calculate weighted average of sector benchmarks
    let weightedBenchmark = 0;

    Object.entries(sectorWeights).forEach(([sector, weight]) => {
      const sectorReturn = this.getSectorBenchmarkReturn(sector);
      weightedBenchmark += sectorReturn * weight;
    });

    return Math.round(weightedBenchmark * 100) / 100;
  }

  /**
   * Calculate stage benchmark performance
   */
  private static getStageBenchmark(investments: EnhancedInvestment[]): number {
    const stageWeights: Record<string, number> = {};

    // Calculate stage allocation
    const totalValue = investments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amountInvested),
      0
    );

    investments.forEach((investment) => {
      const stage = investment.stage || "Unknown";
      const value = investment.currentValue || investment.amountInvested;
      const weight = value / totalValue;

      if (!stageWeights[stage]) {
        stageWeights[stage] = 0;
      }

      stageWeights[stage] += weight;
    });

    // Calculate weighted average of stage benchmarks
    let weightedBenchmark = 0;

    Object.entries(stageWeights).forEach(([stage, weight]) => {
      const stageReturn = this.getStageBenchmarkReturn(stage);
      weightedBenchmark += stageReturn * weight;
    });

    return Math.round(weightedBenchmark * 100) / 100;
  }

  /**
   * Get market benchmark (S&P 500, NASDAQ, etc.)
   */
  private static getMarketBenchmark(): number {
    // In production, this would fetch real market data
    // For now, return historical averages
    return 12.0; // 12% average market return
  }

  /**
   * Get peer benchmark (similar VC funds)
   */
  private static getPeerBenchmark(investments: EnhancedInvestment[]): number {
    // Simplified peer benchmark calculation
    // In production, this would compare against similar funds

    const avgIRR =
      investments.reduce((sum, inv) => sum + (inv.irr || 0), 0) /
      investments.length;

    // Peer benchmark is typically 80-90% of top quartile performers
    const peerBenchmark = avgIRR > 0 ? avgIRR * 0.85 : 15.0;

    return Math.round(peerBenchmark * 100) / 100;
  }

  /**
   * Get sector-specific benchmark return
   */
  private static getSectorBenchmarkReturn(sector: string): number {
    const benchmarkReturns: Record<string, number> = {
      Technology: 0.18, // 18%
      Healthcare: 0.15,
      Biotechnology: 0.22,
      "Clean Technology": 0.16,
      "Enterprise Software": 0.2,
      "Financial Services": 0.12,
      Consumer: 0.1,
      Industrial: 0.13,
      Energy: 0.11,
      "Real Estate": 0.09,
    };

    return benchmarkReturns[sector] || 0.15;
  }

  /**
   * Get stage-specific benchmark return
   */
  private static getStageBenchmarkReturn(stage: string): number {
    const benchmarkReturns: Record<string, number> = {
      "Pre-seed": 0.35, // 35%
      Seed: 0.32,
      "Series A": 0.28,
      "Series B": 0.24,
      "Series C": 0.2,
      "Series D+": 0.16,
      IPO: 0.14,
      Acquired: 0.25,
    };

    return benchmarkReturns[stage] || 0.25;
  }

  /**
   * Calculate portfolio outperformance vs benchmarks
   */
  static calculateOutperformance(
    investments: EnhancedInvestment[],
    benchmarks: BenchmarkData
  ): {
    vsSector: number;
    vsStage: number;
    vsMarket: number;
    vsPeers: number;
  } {
    const portfolioIRR =
      investments.reduce((sum, inv) => sum + (inv.irr || 0), 0) /
      investments.length;

    return {
      vsSector:
        Math.round((portfolioIRR - benchmarks.sectorBenchmark) * 100) / 100,
      vsStage:
        Math.round((portfolioIRR - benchmarks.stageBenchmark) * 100) / 100,
      vsMarket:
        Math.round((portfolioIRR - benchmarks.marketBenchmark) * 100) / 100,
      vsPeers:
        Math.round((portfolioIRR - benchmarks.peerBenchmark) * 100) / 100,
    };
  }

  /**
   * Get detailed benchmark comparison
   */
  static getDetailedBenchmarkComparison(investments: EnhancedInvestment[]): {
    portfolioPerformance: number;
    benchmarks: BenchmarkData;
    outperformance: {
      vsSector: number;
      vsStage: number;
      vsMarket: number;
      vsPeers: number;
    };
    ranking: {
      sectorRank: string;
      stageRank: string;
      marketRank: string;
      peerRank: string;
    };
  } {
    const portfolioIRR =
      investments.reduce((sum, inv) => sum + (inv.irr || 0), 0) /
      investments.length;
    const benchmarks = this.getPortfolioBenchmarks(investments);
    const outperformance = this.calculateOutperformance(
      investments,
      benchmarks
    );

    const ranking = {
      sectorRank: this.getPerformanceRanking(outperformance.vsSector),
      stageRank: this.getPerformanceRanking(outperformance.vsStage),
      marketRank: this.getPerformanceRanking(outperformance.vsMarket),
      peerRank: this.getPerformanceRanking(outperformance.vsPeers),
    };

    return {
      portfolioPerformance: Math.round(portfolioIRR * 100) / 100,
      benchmarks,
      outperformance,
      ranking,
    };
  }

  /**
   * Get performance ranking based on outperformance
   */
  private static getPerformanceRanking(outperformance: number): string {
    if (outperformance > 10) return "Top Quartile";
    if (outperformance > 5) return "Second Quartile";
    if (outperformance > 0) return "Third Quartile";
    if (outperformance > -5) return "Fourth Quartile";
    return "Bottom Quartile";
  }

  /**
   * Get historical benchmark data for trend analysis
   */
  static getHistoricalBenchmarks(): {
    year: number;
    sector: number;
    stage: number;
    market: number;
    peers: number;
  }[] {
    // In production, this would fetch historical data
    // For now, return sample historical data
    return [
      { year: 2020, sector: 0.12, stage: 0.18, market: 0.08, peers: 0.15 },
      { year: 2021, sector: 0.16, stage: 0.22, market: 0.12, peers: 0.19 },
      { year: 2022, sector: 0.08, stage: 0.14, market: -0.18, peers: 0.11 },
      { year: 2023, sector: 0.14, stage: 0.2, market: 0.26, peers: 0.17 },
      { year: 2024, sector: 0.16, stage: 0.24, market: 0.12, peers: 0.2 },
    ];
  }
}
