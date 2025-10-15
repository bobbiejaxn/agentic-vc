/**
 * Network Analysis Service
 * Maps and analyzes investor networks, relationships, and deal flow
 */

import {
  EnhancedInvestment,
  NetworkAnalysis,
} from "@/lib/types/enhanced-investments";

export class NetworkAnalysisService {
  /**
   * Analyze network for a portfolio
   */
  static analyzePortfolioNetwork(
    investments: EnhancedInvestment[]
  ): NetworkAnalysis {
    const coInvestors = this.extractCoInvestors(investments);
    const networkStrength = this.calculateNetworkStrength(investments);
    const dealFlow = this.analyzeDealFlow(investments);
    const relationships = this.identifyKeyRelationships(investments);

    return {
      coInvestors,
      networkStrength,
      dealFlow,
      relationships,
    };
  }

  /**
   * Extract co-investors from investments
   */
  private static extractCoInvestors(
    investments: EnhancedInvestment[]
  ): string[] {
    const coInvestorSet = new Set<string>();

    investments.forEach((investment) => {
      if (investment.coInvestors && Array.isArray(investment.coInvestors)) {
        investment.coInvestors.forEach((coInvestor) => {
          coInvestorSet.add(coInvestor);
        });
      }

      // Also extract from lead investors
      if (investment.leadInvestor) {
        coInvestorSet.add(investment.leadInvestor);
      }
    });

    return Array.from(coInvestorSet).sort();
  }

  /**
   * Calculate network strength score
   */
  private static calculateNetworkStrength(
    investments: EnhancedInvestment[]
  ): number {
    let totalStrength = 0;
    let count = 0;

    investments.forEach((investment) => {
      let investmentStrength = 0.5; // Base strength

      // Boost for known co-investors
      if (investment.coInvestors && investment.coInvestors.length > 0) {
        investmentStrength += Math.min(
          investment.coInvestors.length * 0.1,
          0.3
        );
      }

      // Boost for strong deal sources
      if (investment.dealSource) {
        const sourceMultiplier = this.getDealSourceStrength(
          investment.dealSource
        );
        investmentStrength += sourceMultiplier;
      }

      // Boost for referral sources
      if (investment.referralSource) {
        const referralMultiplier = this.getReferralSourceStrength(
          investment.referralSource
        );
        investmentStrength += referralMultiplier;
      }

      totalStrength += Math.min(investmentStrength, 1.0);
      count++;
    });

    return count > 0 ? totalStrength / count : 0;
  }

  /**
   * Get deal source strength multiplier
   */
  private static getDealSourceStrength(dealSource?: string): number {
    const strengths: Record<string, number> = {
      "Personal Network": 0.2,
      "Warm Introduction": 0.15,
      Advisor: 0.25,
      Conference: 0.1,
      AngelList: 0.05,
      Platform: 0.08,
      "Cold Outreach": -0.05,
      Other: 0.0,
    };

    return strengths[dealSource || "Other"] || 0.0;
  }

  /**
   * Get referral source strength multiplier
   */
  private static getReferralSourceStrength(referralSource?: string): number {
    const strengths: Record<string, number> = {
      "Existing Portfolio Company": 0.2,
      "Trusted Advisor": 0.15,
      "Industry Expert": 0.12,
      "Academic Connection": 0.1,
      "Conference Speaker": 0.08,
      "Online Community": 0.05,
      "Cold Referral": -0.02,
      Other: 0.0,
    };

    return strengths[referralSource || "Other"] || 0.0;
  }

  /**
   * Analyze deal flow patterns
   */
  private static analyzeDealFlow(investments: EnhancedInvestment[]): string[] {
    const dealSources = new Set<string>();

    investments.forEach((investment) => {
      if (investment.dealSource) {
        dealSources.add(investment.dealSource);
      }
    });

    return Array.from(dealSources).sort();
  }

  /**
   * Identify key relationships
   */
  private static identifyKeyRelationships(
    investments: EnhancedInvestment[]
  ): string[] {
    const relationships = new Set<string>();
    const relationshipMap: Record<string, number> = {};

    investments.forEach((investment) => {
      // Count occurrences of co-investors
      if (investment.coInvestors && Array.isArray(investment.coInvestors)) {
        investment.coInvestors.forEach((coInvestor) => {
          relationshipMap[coInvestor] = (relationshipMap[coInvestor] || 0) + 1;
        });
      }

      // Count lead investors
      if (investment.leadInvestor) {
        relationshipMap[investment.leadInvestor] =
          (relationshipMap[investment.leadInvestor] || 0) + 1;
      }

      // Count referral sources
      if (investment.referralSource) {
        relationshipMap[investment.referralSource] =
          (relationshipMap[investment.referralSource] || 0) + 1;
      }
    });

    // Sort by frequency and return top relationships
    const sortedRelationships = Object.entries(relationshipMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([relationship]) => relationship);

    return sortedRelationships;
  }

  /**
   * Generate network visualization data
   */
  static generateNetworkVisualization(investments: EnhancedInvestment[]): {
    nodes: Array<{
      id: string;
      label: string;
      type: "portfolio" | "company" | "investor" | "sector";
      size: number;
      color: string;
    }>;
    links: Array<{
      source: string;
      target: string;
      type: "investment" | "co_investment" | "referral";
      strength: number;
    }>;
  } {
    const nodes = new Set<string>();
    const links: Array<{
      source: string;
      target: string;
      type: "investment" | "co_investment" | "referral";
      strength: number;
    }> = [];

    // Add portfolio node
    nodes.add("portfolio");

    investments.forEach((investment, index) => {
      const companyId = `company_${index}`;

      // Add company node
      nodes.add(companyId);

      // Add investment link
      links.push({
        source: "portfolio",
        target: companyId,
        type: "investment",
        strength: investment.amountInvested / 1000000, // Normalize by $1M
      });

      // Add co-investor links
      if (investment.coInvestors && Array.isArray(investment.coInvestors)) {
        investment.coInvestors.forEach((coInvestor) => {
          const investorId = `investor_${coInvestor
            .replace(/\s+/g, "_")
            .toLowerCase()}`;
          nodes.add(investorId);

          links.push({
            source: companyId,
            target: investorId,
            type: "co_investment",
            strength: 0.8,
          });
        });
      }

      // Add referral source links
      if (investment.referralSource) {
        const referralId = `referral_${investment.referralSource
          .replace(/\s+/g, "_")
          .toLowerCase()}`;
        nodes.add(referralId);

        links.push({
          source: companyId,
          target: referralId,
          type: "referral",
          strength: 0.6,
        });
      }

      // Add sector links
      if (investment.sector) {
        const sectorId = `sector_${investment.sector
          .replace(/\s+/g, "_")
          .toLowerCase()}`;
        nodes.add(sectorId);

        links.push({
          source: companyId,
          target: sectorId,
          type: "investment",
          strength: 0.4,
        });
      }
    });

    // Convert nodes set to array with metadata
    const nodeArray = Array.from(nodes).map((node) => {
      if (node === "portfolio") {
        return {
          id: node,
          label: "My Portfolio",
          type: "portfolio" as const,
          size: 20,
          color: "#3B82F6",
        };
      } else if (node.startsWith("company_")) {
        const index = parseInt(node.split("_")[1]);
        const investment = investments[index];
        return {
          id: node,
          label: investment.companyName,
          type: "company" as const,
          size: Math.max(8, Math.min(15, investment.amountInvested / 500000)), // Size based on investment amount
          color: "#10B981",
        };
      } else if (node.startsWith("investor_")) {
        return {
          id: node,
          label: node.replace("investor_", "").replace(/_/g, " "),
          type: "investor" as const,
          size: 10,
          color: "#F59E0B",
        };
      } else if (node.startsWith("referral_")) {
        return {
          id: node,
          label: node.replace("referral_", "").replace(/_/g, " "),
          type: "investor" as const,
          size: 8,
          color: "#8B5CF6",
        };
      } else if (node.startsWith("sector_")) {
        return {
          id: node,
          label: node.replace("sector_", "").replace(/_/g, " "),
          type: "sector" as const,
          size: 12,
          color: "#EF4444",
        };
      } else {
        return {
          id: node,
          label: node,
          type: "investor" as const,
          size: 8,
          color: "#6B7280",
        };
      }
    });

    return {
      nodes: nodeArray,
      links,
    };
  }

  /**
   * Calculate network centrality metrics
   */
  static calculateNetworkCentrality(investments: EnhancedInvestment[]): {
    degreeCentrality: number;
    betweennessCentrality: number;
    closenessCentrality: number;
    eigenvectorCentrality: number;
  } {
    // Simplified centrality calculations
    // In production, this would use proper graph algorithms

    const coInvestors = this.extractCoInvestors(investments);
    const relationships = this.identifyKeyRelationships(investments);

    // Degree centrality: number of connections
    const degreeCentrality =
      Math.min(coInvestors.length + relationships.length, 10) / 10;

    // Betweenness centrality: how often the node is on shortest paths
    const betweennessCentrality = Math.min(relationships.length * 0.1, 1.0);

    // Closeness centrality: how close to all other nodes
    const closenessCentrality = Math.min(
      (coInvestors.length + relationships.length) * 0.05,
      1.0
    );

    // Eigenvector centrality: influence based on connections to influential nodes
    const eigenvectorCentrality = Math.min(relationships.length * 0.15, 1.0);

    return {
      degreeCentrality: Math.round(degreeCentrality * 100) / 100,
      betweennessCentrality: Math.round(betweennessCentrality * 100) / 100,
      closenessCentrality: Math.round(closenessCentrality * 100) / 100,
      eigenvectorCentrality: Math.round(eigenvectorCentrality * 100) / 100,
    };
  }
}
