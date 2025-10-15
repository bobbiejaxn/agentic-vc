/**
 * Deal Flow Tracking Service
 * Tracks and analyzes deal flow sources, conversion rates, and quality metrics
 */

import { EnhancedInvestment } from "@/lib/types/enhanced-investments";

export interface DealFlowMetrics {
  totalDeals: number;
  conversionRate: number;
  averageDealSize: number;
  dealQuality: number;
  sourceDistribution: Record<string, number>;
  stageDistribution: Record<string, number>;
  sectorDistribution: Record<string, number>;
}

export interface DealFlowSource {
  source: string;
  count: number;
  totalValue: number;
  averageSize: number;
  conversionRate: number;
  quality: number;
}

export class DealFlowService {
  /**
   * Analyze deal flow metrics for a portfolio
   */
  static analyzeDealFlow(investments: EnhancedInvestment[]): DealFlowMetrics {
    const totalDeals = investments.length;
    const totalValue = investments.reduce(
      (sum, inv) => sum + inv.amountInvested,
      0
    );
    const averageDealSize = totalValue / totalDeals;

    const sourceDistribution = this.calculateSourceDistribution(investments);
    const stageDistribution = this.calculateStageDistribution(investments);
    const sectorDistribution = this.calculateSectorDistribution(investments);

    const conversionRate = this.calculateConversionRate(investments);
    const dealQuality = this.calculateDealQuality(investments);

    return {
      totalDeals,
      conversionRate,
      averageDealSize,
      dealQuality,
      sourceDistribution,
      stageDistribution,
      sectorDistribution,
    };
  }

  /**
   * Calculate deal source distribution
   */
  private static calculateSourceDistribution(
    investments: EnhancedInvestment[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    investments.forEach((investment) => {
      const source = investment.dealSource || "Unknown";
      distribution[source] = (distribution[source] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Calculate stage distribution
   */
  private static calculateStageDistribution(
    investments: EnhancedInvestment[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    investments.forEach((investment) => {
      const stage = investment.stage || "Unknown";
      distribution[stage] = (distribution[stage] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Calculate sector distribution
   */
  private static calculateSectorDistribution(
    investments: EnhancedInvestment[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    investments.forEach((investment) => {
      const sector = investment.sector || "Unknown";
      distribution[sector] = (distribution[sector] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Calculate conversion rate (invested / total opportunities)
   */
  private static calculateConversionRate(
    investments: EnhancedInvestment[]
  ): number {
    // Simplified conversion rate calculation
    // In production, this would track actual funnel metrics

    const totalOpportunities = investments.length * 1.5; // Assume 1.5x opportunities per investment
    return Math.round((investments.length / totalOpportunities) * 100);
  }

  /**
   * Calculate deal quality score
   */
  private static calculateDealQuality(
    investments: EnhancedInvestment[]
  ): number {
    let totalQuality = 0;

    investments.forEach((investment) => {
      let quality = 0.5; // Base quality

      // Quality based on network strength
      if (investment.networkStrength) {
        quality += investment.networkStrength * 0.3;
      }

      // Quality based on deal source
      if (investment.dealSource) {
        const sourceQuality = this.getDealSourceQuality(investment.dealSource);
        quality += sourceQuality * 0.2;
      }

      // Quality based on performance metrics
      if (investment.irr && investment.irr > 20) {
        quality += 0.2;
      } else if (investment.irr && investment.irr > 10) {
        quality += 0.1;
      }

      totalQuality += Math.min(quality, 1.0);
    });

    return totalQuality / investments.length;
  }

  /**
   * Get deal source quality multiplier
   */
  private static getDealSourceQuality(dealSource: string): number {
    const qualityMap: Record<string, number> = {
      "Personal Network": 0.8,
      "Warm Introduction": 0.7,
      Advisor: 0.9,
      Conference: 0.5,
      AngelList: 0.4,
      Platform: 0.3,
      "Cold Outreach": 0.1,
      Other: 0.3,
    };

    return qualityMap[dealSource] || 0.3;
  }

  /**
   * Get detailed deal flow sources analysis
   */
  static getDealFlowSources(
    investments: EnhancedInvestment[]
  ): DealFlowSource[] {
    const sourceGroups: Record<
      string,
      {
        count: number;
        totalValue: number;
        investments: EnhancedInvestment[];
      }
    > = {};

    // Group investments by deal source
    investments.forEach((investment) => {
      const source = investment.dealSource || "Unknown";

      if (!sourceGroups[source]) {
        sourceGroups[source] = {
          count: 0,
          totalValue: 0,
          investments: [],
        };
      }

      sourceGroups[source].count++;
      sourceGroups[source].totalValue += investment.amountInvested;
      sourceGroups[source].investments.push(investment);
    });

    // Convert to detailed analysis
    return Object.entries(sourceGroups).map(([source, data]) => ({
      source,
      count: data.count,
      totalValue: data.totalValue,
      averageSize: data.totalValue / data.count,
      conversionRate: this.calculateSourceConversionRate(
        source,
        data.investments
      ),
      quality: this.calculateSourceQuality(source, data.investments),
    }));
  }

  /**
   * Calculate conversion rate for a specific source
   */
  private static calculateSourceConversionRate(
    source: string,
    investments: EnhancedInvestment[]
  ): number {
    // Simplified calculation
    // In production, this would track actual funnel data
    const opportunitiesMultiplier =
      this.getSourceOpportunitiesMultiplier(source);
    const totalOpportunities = investments.length * opportunitiesMultiplier;
    return Math.round((investments.length / totalOpportunities) * 100);
  }

  /**
   * Get opportunities multiplier for a source
   */
  private static getSourceOpportunitiesMultiplier(source: string): number {
    const multipliers: Record<string, number> = {
      "Personal Network": 1.2,
      "Warm Introduction": 1.3,
      Advisor: 1.1,
      Conference: 2.0,
      AngelList: 3.0,
      Platform: 4.0,
      "Cold Outreach": 10.0,
      Other: 2.0,
    };

    return multipliers[source] || 2.0;
  }

  /**
   * Calculate quality for a specific source
   */
  private static calculateSourceQuality(
    source: string,
    investments: EnhancedInvestment[]
  ): number {
    let totalQuality = 0;

    investments.forEach((investment) => {
      let quality = this.getDealSourceQuality(source);

      // Additional quality factors
      if (investment.networkStrength && investment.networkStrength > 0.7) {
        quality += 0.2;
      }

      if (investment.irr && investment.irr > 25) {
        quality += 0.3;
      }

      totalQuality += Math.min(quality, 1.0);
    });

    return totalQuality / investments.length;
  }

  /**
   * Track deal flow trends over time
   */
  static getDealFlowTrends(investments: EnhancedInvestment[]): {
    monthlyVolume: Array<{ month: string; deals: number; value: number }>;
    quarterlyTrends: Array<{ quarter: string; deals: number; avgSize: number }>;
    yearlyGrowth: number;
  } {
    // Group investments by time periods
    const monthlyData: Record<string, { deals: number; value: number }> = {};
    const quarterlyData: Record<string, { deals: number; value: number }> = {};

    investments.forEach((investment) => {
      if (!investment.investmentDate) return;

      const date = investment.investmentDate;
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const quarterKey = `${date.getFullYear()}-Q${
        Math.floor(date.getMonth() / 3) + 1
      }`;

      // Monthly data
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { deals: 0, value: 0 };
      }
      monthlyData[monthKey].deals++;
      monthlyData[monthKey].value += investment.amountInvested;

      // Quarterly data
      if (!quarterlyData[quarterKey]) {
        quarterlyData[quarterKey] = { deals: 0, value: 0 };
      }
      quarterlyData[quarterKey].deals++;
      quarterlyData[quarterKey].value += investment.amountInvested;
    });

    // Convert to arrays and sort
    const monthlyVolume = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const quarterlyTrends = Object.entries(quarterlyData)
      .map(([quarter, data]) => ({
        quarter,
        deals: data.deals,
        avgSize: data.value / data.deals,
      }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter));

    // Calculate yearly growth
    const yearlyGrowth = this.calculateYearlyGrowth(monthlyVolume);

    return {
      monthlyVolume,
      quarterlyTrends,
      yearlyGrowth,
    };
  }

  /**
   * Calculate yearly growth rate
   */
  private static calculateYearlyGrowth(
    monthlyVolume: Array<{ month: string; deals: number; value: number }>
  ): number {
    if (monthlyVolume.length < 12) return 0;

    // Get current year data vs previous year
    const currentYear = new Date().getFullYear();
    const currentYearData = monthlyVolume.filter((m) =>
      m.month.startsWith(currentYear.toString())
    );
    const previousYearData = monthlyVolume.filter((m) =>
      m.month.startsWith((currentYear - 1).toString())
    );

    if (currentYearData.length === 0 || previousYearData.length === 0) return 0;

    const currentYearValue = currentYearData.reduce(
      (sum, m) => sum + m.value,
      0
    );
    const previousYearValue = previousYearData.reduce(
      (sum, m) => sum + m.value,
      0
    );

    if (previousYearValue === 0) return 0;

    return ((currentYearValue - previousYearValue) / previousYearValue) * 100;
  }

  /**
   * Get deal quality insights
   */
  static getDealQualityInsights(investments: EnhancedInvestment[]): {
    topPerformingDeals: EnhancedInvestment[];
    underperformingDeals: EnhancedInvestment[];
    qualityDistribution: Record<string, number>;
    improvementSuggestions: string[];
  } {
    // Sort investments by performance
    const sortedInvestments = [...investments].sort((a, b) => {
      const aReturn = a.irr || 0;
      const bReturn = b.irr || 0;
      return bReturn - aReturn;
    });

    const topPerformingDeals = sortedInvestments.slice(
      0,
      Math.ceil(investments.length * 0.2)
    );
    const underperformingDeals = sortedInvestments.slice(
      -Math.ceil(investments.length * 0.2)
    );

    // Quality distribution
    const qualityDistribution = this.calculateQualityDistribution(investments);

    // Generate improvement suggestions
    const improvementSuggestions = this.generateImprovementSuggestions(
      investments,
      topPerformingDeals
    );

    return {
      topPerformingDeals,
      underperformingDeals,
      qualityDistribution,
      improvementSuggestions,
    };
  }

  /**
   * Calculate quality distribution
   */
  private static calculateQualityDistribution(
    investments: EnhancedInvestment[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      "High Quality": 0,
      "Medium Quality": 0,
      "Low Quality": 0,
    };

    investments.forEach((investment) => {
      const quality = this.calculateDealQuality([investment]);

      if (quality > 0.7) {
        distribution["High Quality"]++;
      } else if (quality > 0.4) {
        distribution["Medium Quality"]++;
      } else {
        distribution["Low Quality"]++;
      }
    });

    return distribution;
  }

  /**
   * Generate improvement suggestions
   */
  private static generateImprovementSuggestions(
    investments: EnhancedInvestment[],
    topPerformers: EnhancedInvestment[]
  ): string[] {
    const suggestions: string[] = [];

    // Analyze patterns in top performers
    const topSources = topPerformers
      .map((inv) => inv.dealSource)
      .filter(Boolean);
    const mostSuccessfulSource = this.getMostFrequent(topSources);

    if (mostSuccessfulSource) {
      suggestions.push(
        `Focus more on ${mostSuccessfulSource} deals - they show the highest success rate`
      );
    }

    // Network strength analysis
    const avgNetworkStrength =
      investments.reduce((sum, inv) => sum + (inv.networkStrength || 0), 0) /
      investments.length;
    if (avgNetworkStrength < 0.6) {
      suggestions.push(
        "Strengthen your professional network to improve deal quality"
      );
    }

    // Stage analysis
    const earlyStageInvestments = investments.filter(
      (inv) => inv.stage === "Seed" || inv.stage === "Pre-seed"
    );
    if (earlyStageInvestments.length > investments.length * 0.5) {
      suggestions.push(
        "Consider diversifying into later-stage deals for portfolio balance"
      );
    }

    return suggestions;
  }

  /**
   * Get most frequent item in array
   */
  private static getMostFrequent(items: string[]): string | null {
    const frequency: Record<string, number> = {};

    items.forEach((item) => {
      frequency[item] = (frequency[item] || 0) + 1;
    });

    let mostFrequent: string | null = null;
    let maxCount = 0;

    Object.entries(frequency).forEach(([item, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = item;
      }
    });

    return mostFrequent;
  }
}
