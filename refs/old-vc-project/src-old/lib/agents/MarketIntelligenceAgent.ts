import { BaseAgent } from "./BaseAgent";
import { MarketIntelligenceService } from "../ai/market-intelligence";

/**
 * Market Intelligence Agent - Provides market analysis and competitive intelligence
 * Inspired by Google ADK's specialized agent architecture
 */
export class MarketIntelligenceAgent extends BaseAgent {
  private marketIntelligenceService: MarketIntelligenceService;

  constructor() {
    super(
      "MarketIntelligenceAgent",
      "Specialized agent for market intelligence and competitive analysis"
    );

    this.marketIntelligenceService = new MarketIntelligenceService();
    this.initializeTools();
  }

  /**
   * Initialize tools for market intelligence
   */
  private initializeTools(): void {
    this.addTool({
      name: "research_company",
      description: "Research a company for market intelligence",
      execute: async (args: { companyName: string; sector?: string }) => {
        return await this.marketIntelligenceService.researchCompany(
          args.companyName
        );
      },
    });

    this.addTool({
      name: "analyze_sector",
      description: "Analyze a specific sector for market trends",
      execute: async (args: { sector: string; geography?: string }) => {
        return await this.analyzeSector(args.sector, args.geography);
      },
    });

    this.addTool({
      name: "get_competitive_landscape",
      description: "Get competitive landscape for a company",
      execute: async (args: { companyName: string; sector: string }) => {
        return await this.getCompetitiveLandscape(
          args.companyName,
          args.sector
        );
      },
    });

    this.addTool({
      name: "analyze_market_trends",
      description: "Analyze market trends for a specific sector",
      execute: async (args: { sector: string; timeframe?: string }) => {
        return await this.analyzeMarketTrends(args.sector, args.timeframe);
      },
    });
  }

  /**
   * Analyze market data for a fund or company
   */
  async analyzeMarketData(structuredData: any): Promise<any> {
    console.log("🔍 Analyzing market data...");

    try {
      const companyName = structuredData.companyName || structuredData.fundName;
      const sector = structuredData.industrySector || structuredData.sector;

      if (!companyName) {
        throw new Error("Company name not found in structured data");
      }

      // Research the company
      const companyResearch = await this.executeTool("research_company", {
        companyName,
        sector,
      });

      // Analyze the sector if available
      let sectorAnalysis = null;
      if (sector) {
        sectorAnalysis = await this.executeTool("analyze_sector", {
          sector,
          geography: structuredData.geography,
        });
      }

      // Get competitive landscape
      const competitiveLandscape = await this.executeTool(
        "get_competitive_landscape",
        {
          companyName,
          sector: sector || "Unknown",
        }
      );

      // Analyze market trends
      const marketTrends = await this.executeTool("analyze_market_trends", {
        sector: sector || "General",
        timeframe: "12 months",
      });

      return {
        companyResearch,
        sectorAnalysis,
        competitiveLandscape,
        marketTrends,
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error analyzing market data:", error);
      throw error;
    }
  }

  /**
   * Get market intelligence for a specific query
   */
  async getMarketIntelligence(query: {
    companyName?: string;
    sector?: string;
    geography?: string;
  }): Promise<any> {
    console.log("🔍 Getting market intelligence for:", query);

    try {
      let results: any = {};

      if (query.companyName) {
        results.companyResearch = await this.executeTool("research_company", {
          companyName: query.companyName,
          sector: query.sector,
        });
      }

      if (query.sector) {
        results.sectorAnalysis = await this.executeTool("analyze_sector", {
          sector: query.sector,
          geography: query.geography,
        });

        results.marketTrends = await this.executeTool("analyze_market_trends", {
          sector: query.sector,
          timeframe: "12 months",
        });
      }

      return {
        ...results,
        query,
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error getting market intelligence:", error);
      throw error;
    }
  }

  /**
   * Analyze portfolio market performance
   */
  async analyzePortfolioMarket(portfolioData: any): Promise<any> {
    console.log("📊 Analyzing portfolio market performance...");

    try {
      const sectors =
        portfolioData.companies?.map((c: any) => c.sector).filter(Boolean) ||
        [];
      const uniqueSectors = [...new Set(sectors)];

      const sectorAnalyses = await Promise.all(
        uniqueSectors.map((sector) =>
          this.executeTool("analyze_sector", { sector })
        )
      );

      const marketTrends = await Promise.all(
        uniqueSectors.map((sector) =>
          this.executeTool("analyze_market_trends", { sector })
        )
      );

      return {
        portfolioSectors: uniqueSectors,
        sectorAnalyses,
        marketTrends,
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error analyzing portfolio market:", error);
      throw error;
    }
  }

  /**
   * Analyze a specific sector
   */
  private async analyzeSector(
    sector: string,
    geography?: string
  ): Promise<any> {
    // This would integrate with your market intelligence service
    return {
      sector,
      geography,
      trends: "Market analysis for " + sector,
      opportunities: "Growth opportunities identified",
      risks: "Market risks assessed",
    };
  }

  /**
   * Get competitive landscape
   */
  private async getCompetitiveLandscape(
    companyName: string,
    sector: string
  ): Promise<any> {
    // This would integrate with your competitive analysis tools
    return {
      company: companyName,
      sector,
      competitors: "Competitive analysis for " + companyName,
      marketPosition: "Market position analysis",
    };
  }

  /**
   * Analyze market trends
   */
  private async analyzeMarketTrends(
    sector: string,
    timeframe: string
  ): Promise<any> {
    // This would integrate with your market trends analysis
    return {
      sector,
      timeframe,
      trends: "Market trends for " + sector,
      growth: "Growth projections",
      outlook: "Market outlook",
    };
  }
}
