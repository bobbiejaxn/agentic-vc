import { BaseAgent } from "./BaseAgent";

/**
 * Investment Recommendation Agent - Provides investment recommendations and insights
 * Inspired by Google ADK's specialized agent architecture
 */
export class InvestmentRecommendationAgent extends BaseAgent {
  constructor() {
    super(
      "InvestmentRecommendationAgent",
      "Specialized agent for investment recommendations and strategic insights"
    );

    this.initializeTools();
  }

  /**
   * Initialize tools for investment recommendations
   */
  private initializeTools(): void {
    this.addTool({
      name: "generate_investment_recommendations",
      description: "Generate investment recommendations based on analysis",
      execute: async (args: { analysis: any }) => {
        return await this.generateRecommendations(args.analysis);
      },
    });

    this.addTool({
      name: "assess_investment_opportunity",
      description: "Assess an investment opportunity",
      execute: async (args: { opportunity: any }) => {
        return await this.assessInvestmentOpportunity(args.opportunity);
      },
    });

    this.addTool({
      name: "portfolio_optimization",
      description: "Suggest portfolio optimization strategies",
      execute: async (args: { portfolio: any }) => {
        return await this.suggestPortfolioOptimization(args.portfolio);
      },
    });

    this.addTool({
      name: "risk_assessment",
      description: "Assess investment risks",
      execute: async (args: { investment: any }) => {
        return await this.assessRisks(args.investment);
      },
    });
  }

  /**
   * Generate investment recommendations
   */
  async generateRecommendations(analysis: {
    structuredData: any;
    marketIntelligence: any;
    portfolioAnalysis: any;
  }): Promise<any> {
    console.log("💡 Generating investment recommendations...");

    try {
      const { structuredData, marketIntelligence, portfolioAnalysis } =
        analysis;

      // Generate recommendations based on all analysis
      const recommendations = await this.executeTool(
        "generate_investment_recommendations",
        {
          analysis: {
            fundMetrics: structuredData,
            marketData: marketIntelligence,
            portfolioData: portfolioAnalysis,
          },
        }
      );

      // Assess risks
      const riskAssessment = await this.executeTool("risk_assessment", {
        investment: structuredData,
      });

      // Portfolio optimization suggestions
      const optimizationSuggestions = await this.executeTool(
        "portfolio_optimization",
        {
          portfolio: portfolioAnalysis,
        }
      );

      return {
        recommendations,
        riskAssessment,
        optimizationSuggestions,
        confidence: this.calculateConfidence(analysis),
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error generating recommendations:", error);
      throw error;
    }
  }

  /**
   * Generate portfolio recommendations
   */
  async generatePortfolioRecommendations(analysis: {
    portfolioData: any;
    marketAnalysis: any;
  }): Promise<any> {
    console.log("💡 Generating portfolio recommendations...");

    try {
      const { portfolioData, marketAnalysis } = analysis;

      const recommendations = await this.executeTool(
        "generate_investment_recommendations",
        {
          analysis: {
            portfolio: portfolioData,
            market: marketAnalysis,
          },
        }
      );

      const optimizationSuggestions = await this.executeTool(
        "portfolio_optimization",
        {
          portfolio: portfolioData,
        }
      );

      return {
        recommendations,
        optimizationSuggestions,
        confidence: this.calculatePortfolioConfidence(analysis),
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error generating portfolio recommendations:", error);
      throw error;
    }
  }

  /**
   * Generate investment recommendations based on analysis
   */
  private async generateRecommendations(analysis: any): Promise<any> {
    const fundMetrics = analysis.fundMetrics || {};
    const marketData = analysis.marketData || {};
    const portfolioData = analysis.portfolioData || {};

    const irr = fundMetrics.irr || 0;
    const moic = fundMetrics.moic || 0;
    const fundSize = fundMetrics.fundSize || 0;

    const recommendations = [];

    // Performance-based recommendations
    if (irr > 20) {
      recommendations.push({
        type: "performance",
        priority: "high",
        title: "Strong Performance",
        description: `Fund shows strong IRR of ${irr}%, indicating excellent performance`,
        action: "Consider increasing allocation or similar investments",
      });
    } else if (irr < 10) {
      recommendations.push({
        type: "performance",
        priority: "medium",
        title: "Performance Review",
        description: `Fund IRR of ${irr}% is below market average`,
        action: "Review investment strategy and consider alternatives",
      });
    }

    // MOIC-based recommendations
    if (moic > 2.0) {
      recommendations.push({
        type: "returns",
        priority: "high",
        title: "Excellent Returns",
        description: `MOIC of ${moic}x indicates strong value creation`,
        action: "Consider similar investment opportunities",
      });
    }

    // Market-based recommendations
    if (marketData.sectorAnalysis) {
      recommendations.push({
        type: "market",
        priority: "medium",
        title: "Market Opportunity",
        description: "Market analysis shows growth potential in this sector",
        action: "Monitor market trends and adjust strategy accordingly",
      });
    }

    // Risk-based recommendations
    if (portfolioData.riskAnalysis?.riskScore > 7) {
      recommendations.push({
        type: "risk",
        priority: "high",
        title: "Risk Management",
        description: "Portfolio shows elevated risk levels",
        action: "Implement risk mitigation strategies",
      });
    }

    return {
      recommendations,
      summary: {
        totalRecommendations: recommendations.length,
        highPriority: recommendations.filter((r) => r.priority === "high")
          .length,
        mediumPriority: recommendations.filter((r) => r.priority === "medium")
          .length,
        categories: [...new Set(recommendations.map((r) => r.type))],
      },
    };
  }

  /**
   * Assess investment opportunity
   */
  private async assessInvestmentOpportunity(opportunity: any): Promise<any> {
    return {
      opportunity: opportunity,
      assessment: "Investment opportunity assessment",
      score: 7.5,
      recommendation: "Proceed with caution",
      risks: ["Market volatility", "Liquidity concerns"],
      opportunities: ["Growth potential", "Market expansion"],
    };
  }

  /**
   * Suggest portfolio optimization
   */
  private async suggestPortfolioOptimization(portfolio: any): Promise<any> {
    return {
      currentAllocation: "Current portfolio allocation",
      suggestedChanges: [
        "Increase technology exposure",
        "Reduce concentration risk",
        "Add international diversification",
      ],
      expectedImpact: "Improved risk-adjusted returns",
      implementation: "Gradual rebalancing over 6 months",
    };
  }

  /**
   * Assess investment risks
   */
  private async assessRisks(investment: any): Promise<any> {
    return {
      riskFactors: [
        "Market risk",
        "Liquidity risk",
        "Concentration risk",
        "Operational risk",
      ],
      riskScore: 6.5,
      mitigation: [
        "Diversify across sectors",
        "Maintain liquidity buffer",
        "Regular monitoring",
      ],
    };
  }

  /**
   * Calculate confidence score for recommendations
   */
  private calculateConfidence(analysis: any): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on data quality
    if (analysis.structuredData?.irr) confidence += 0.1;
    if (analysis.structuredData?.moic) confidence += 0.1;
    if (analysis.marketIntelligence?.companyResearch) confidence += 0.1;
    if (analysis.portfolioAnalysis?.metrics) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate confidence for portfolio recommendations
   */
  private calculatePortfolioConfidence(analysis: any): number {
    let confidence = 0.6; // Base confidence for portfolio analysis

    if (analysis.portfolioData?.companies?.length > 0) confidence += 0.1;
    if (analysis.marketAnalysis?.sectorAnalyses?.length > 0) confidence += 0.1;
    if (analysis.portfolioData?.performance) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }
}
