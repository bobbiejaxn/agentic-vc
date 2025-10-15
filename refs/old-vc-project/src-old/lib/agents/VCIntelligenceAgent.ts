import { BaseAgent } from "./BaseAgent";
import { DocumentProcessingAgent } from "./DocumentProcessingAgent";
import { MarketIntelligenceAgent } from "./MarketIntelligenceAgent";
import { PortfolioAnalysisAgent } from "./PortfolioAnalysisAgent";
import { InvestmentRecommendationAgent } from "./InvestmentRecommendationAgent";

/**
 * Main VC Intelligence Agent - Orchestrates all specialized agents
 * Inspired by Google ADK's multi-agent architecture
 */
export class VCIntelligenceAgent extends BaseAgent {
  private documentAgent: DocumentProcessingAgent;
  private marketAgent: MarketIntelligenceAgent;
  private portfolioAgent: PortfolioAnalysisAgent;
  private recommendationAgent: InvestmentRecommendationAgent;

  constructor() {
    super(
      "VCIntelligenceAgent",
      "Main orchestrator for VC Intelligence system"
    );

    // Initialize specialized agents
    this.documentAgent = new DocumentProcessingAgent();
    this.marketAgent = new MarketIntelligenceAgent();
    this.portfolioAgent = new PortfolioAnalysisAgent();
    this.recommendationAgent = new InvestmentRecommendationAgent();
  }

  /**
   * Process a new fund document through the complete VC Intelligence pipeline
   */
  async processFundDocument(document: {
    id: string;
    content: string;
    fileName: string;
    type: string;
  }): Promise<{
    structuredData: any;
    marketIntelligence: any;
    portfolioAnalysis: any;
    recommendations: any;
  }> {
    console.log(
      "🚀 Starting VC Intelligence pipeline for document:",
      document.fileName
    );

    try {
      // Step 1: Document Processing Agent
      console.log("📄 Processing document with DocumentProcessingAgent...");
      const structuredData = await this.documentAgent.processDocument(document);

      // Step 2: Market Intelligence Agent
      console.log("🔍 Analyzing market intelligence...");
      const marketIntelligence = await this.marketAgent.analyzeMarketData(
        structuredData
      );

      // Step 3: Portfolio Analysis Agent
      console.log("📊 Performing portfolio analysis...");
      const portfolioAnalysis = await this.portfolioAgent.analyzePortfolio(
        structuredData
      );

      // Step 4: Investment Recommendation Agent
      console.log("💡 Generating investment recommendations...");
      const recommendations =
        await this.recommendationAgent.generateRecommendations({
          structuredData,
          marketIntelligence,
          portfolioAnalysis,
        });

      console.log("✅ VC Intelligence pipeline completed successfully");

      return {
        structuredData,
        marketIntelligence,
        portfolioAnalysis,
        recommendations,
      };
    } catch (error) {
      console.error("❌ Error in VC Intelligence pipeline:", error);
      throw error;
    }
  }

  /**
   * Analyze existing portfolio data
   */
  async analyzePortfolio(portfolioId: string): Promise<any> {
    console.log("📊 Analyzing portfolio:", portfolioId);

    try {
      // Get portfolio data
      const portfolioData = await this.portfolioAgent.getPortfolioData(
        portfolioId
      );

      // Perform market analysis
      const marketAnalysis = await this.marketAgent.analyzePortfolioMarket(
        portfolioData
      );

      // Generate recommendations
      const recommendations =
        await this.recommendationAgent.generatePortfolioRecommendations({
          portfolioData,
          marketAnalysis,
        });

      return {
        portfolioData,
        marketAnalysis,
        recommendations,
      };
    } catch (error) {
      console.error("❌ Error analyzing portfolio:", error);
      throw error;
    }
  }

  /**
   * Get market intelligence for a specific company or sector
   */
  async getMarketIntelligence(query: {
    companyName?: string;
    sector?: string;
    geography?: string;
  }): Promise<any> {
    console.log("🔍 Getting market intelligence for:", query);

    try {
      return await this.marketAgent.getMarketIntelligence(query);
    } catch (error) {
      console.error("❌ Error getting market intelligence:", error);
      throw error;
    }
  }

  /**
   * Health check for all agents
   */
  async healthCheck(): Promise<{
    status: string;
    agents: Record<string, boolean>;
  }> {
    const agents = {
      documentAgent: await this.documentAgent.healthCheck(),
      marketAgent: await this.marketAgent.healthCheck(),
      portfolioAgent: await this.portfolioAgent.healthCheck(),
      recommendationAgent: await this.recommendationAgent.healthCheck(),
    };

    const allHealthy = Object.values(agents).every((status) => status);

    return {
      status: allHealthy ? "healthy" : "degraded",
      agents,
    };
  }
}
