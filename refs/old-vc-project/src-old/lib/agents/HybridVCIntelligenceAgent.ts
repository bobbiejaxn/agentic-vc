import { OpenRouterService } from "../ai/openrouter-service";
import { LlamaParseService } from "../ai/llama-parse";
import { DocumentService } from "../database/documents";
import { VectorSearchService } from "../ai/vector-search";

/**
 * Hybrid VC Intelligence Agent
 * Combines your existing LlamaParse → Supabase pipeline with Google ADK
 *
 * Flow:
 * 1. User uploads document
 * 2. LlamaParse extracts structured data → Supabase
 * 3. Google ADK processes enhanced analysis
 * 4. Results stored back to Supabase
 */
export class HybridVCIntelligenceAgent {
  private openRouterService: OpenRouterService;
  private llamaParseService: LlamaParseService;
  private documentService: DocumentService;
  private vectorSearchService: VectorSearchService;

  constructor() {
    try {
      this.openRouterService = new OpenRouterService();
    } catch (error) {
      console.error("Failed to initialize OpenRouter service:", error);
      // Create a fallback service that returns null results
      this.openRouterService = null as any;
    }
    this.llamaParseService = new LlamaParseService();
    this.documentService = new DocumentService();
    this.vectorSearchService = new VectorSearchService();
  }

  /**
   * Process document through hybrid pipeline
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
      "🚀 Starting hybrid VC Intelligence pipeline for document:",
      document.fileName
    );

    try {
      // Step 1: LlamaParse → Supabase (your existing pipeline)
      console.log("📄 Processing with LlamaParse...");
      const structuredData = await this.llamaParseService.extractStructuredData(
        document.content,
        document.type
      );

      // Step 2: Store in Supabase (your existing system)
      console.log("💾 Storing in Supabase...");
      const storedDocument = await DocumentService.createDocument("system", {
        name: document.fileName,
        type: document.type,
        portfolioId: "default-portfolio",
        filePath: `documents/system/${document.id}.txt`,
        fileSize: document.content.length.toString(),
        mimeType: "text/plain",
      });

      // Step 3: OpenRouter enhanced analysis
      console.log("🤖 Processing with OpenRouter service...");
      let adkResults = {
        structuredData: structuredData,
        marketIntelligence: null,
        portfolioAnalysis: null,
        recommendations: null,
      };

      if (this.openRouterService) {
        try {
          adkResults = await this.openRouterService.processDocument({
            ...document,
            structuredData: structuredData,
          });
        } catch (error) {
          console.warn("⚠️ OpenRouter service failed, using fallback:", error);
        }
      } else {
        console.warn("⚠️ OpenRouter service not available, using fallback");
      }

      // Step 4: Store enhanced results back to Supabase
      console.log("💾 Storing enhanced results...");
      await DocumentService.updateDocumentStatus(document.id, "completed", {
        ...structuredData,
        marketIntelligence: adkResults.marketIntelligence,
        portfolioAnalysis: adkResults.portfolioAnalysis,
        recommendations: adkResults.recommendations,
      });

      // Step 5: Generate and store vector embedding for similarity search
      console.log("🔍 Generating vector embedding...");
      await this.vectorSearchService.storeDocumentWithEmbedding(
        document.id,
        document.content,
        structuredData
      );

      console.log("✅ Hybrid pipeline completed successfully");

      return {
        structuredData,
        marketIntelligence: adkResults.marketIntelligence,
        portfolioAnalysis: adkResults.portfolioAnalysis,
        recommendations: adkResults.recommendations,
      };
    } catch (error) {
      console.error("❌ Error in hybrid pipeline:", error);

      // Fallback to just LlamaParse if Google ADK fails
      console.log("🔄 Falling back to LlamaParse only...");
      const structuredData = await this.llamaParseService.extractStructuredData(
        document.content,
        document.type
      );

      return {
        structuredData,
        marketIntelligence: null,
        portfolioAnalysis: null,
        recommendations: null,
      };
    }
  }

  /**
   * Get market intelligence through OpenRouter
   */
  async getMarketIntelligence(query: {
    companyName?: string;
    sector?: string;
    geography?: string;
  }): Promise<any> {
    console.log("🔍 Getting market intelligence through OpenRouter...");

    if (!this.openRouterService) {
      console.warn("⚠️ OpenRouter service not available, returning fallback");
      return {
        marketTrends: "OpenRouter service not available",
        competitiveLandscape: "Service unavailable",
        sectorAnalysis: "Service unavailable",
        riskFactors: [],
        marketOutlook: "Service unavailable",
        keyOpportunities: [],
        analysisDate: new Date().toISOString(),
      };
    }

    try {
      return await this.openRouterService.getMarketIntelligence(query);
    } catch (error) {
      console.error("❌ Error getting market intelligence:", error);
      throw error;
    }
  }

  /**
   * Analyze portfolio through OpenRouter
   */
  async analyzePortfolio(portfolioId: string): Promise<any> {
    console.log("📊 Analyzing portfolio through OpenRouter...");

    if (!this.openRouterService) {
      console.warn("⚠️ OpenRouter service not available, returning fallback");
      return {
        performanceMetrics: {
          totalReturn: 0,
          annualizedReturn: 0,
          volatility: 0,
          sharpeRatio: 0,
        },
        riskAssessment: {
          overallRisk: "unknown",
          concentrationRisk: "Service unavailable",
          liquidityRisk: "Service unavailable",
        },
        benchmarkComparison: "Service unavailable",
        optimizationOpportunities: [],
        recommendations: [],
        analysisDate: new Date().toISOString(),
      };
    }

    try {
      return await this.openRouterService.analyzePortfolio(portfolioId);
    } catch (error) {
      console.error("❌ Error analyzing portfolio:", error);
      throw error;
    }
  }

  /**
   * Search for similar documents using vector similarity
   */
  async searchSimilarDocuments(
    query: string,
    similarityThreshold: number = 0.7,
    maxResults: number = 10
  ): Promise<any[]> {
    console.log("🔍 Searching for similar documents...");
    try {
      return await this.vectorSearchService.searchSimilarDocuments(
        query,
        similarityThreshold,
        maxResults
      );
    } catch (error) {
      console.error("❌ Error searching similar documents:", error);
      throw error;
    }
  }

  /**
   * Get document recommendations based on content similarity
   */
  async getDocumentRecommendations(
    documentId: string,
    maxResults: number = 5
  ): Promise<any[]> {
    console.log("📋 Getting document recommendations...");
    try {
      return await this.vectorSearchService.getDocumentRecommendations(
        documentId,
        maxResults
      );
    } catch (error) {
      console.error("❌ Error getting document recommendations:", error);
      throw error;
    }
  }

  /**
   * Health check for both systems
   */
  async healthCheck(): Promise<{
    status: string;
    llamaParse: boolean;
    supabase: boolean;
    googleADK: boolean;
    vectorSearch: boolean;
  }> {
    try {
      // Test LlamaParse
      const llamaParseHealthy = await this.testLlamaParse();

      // Test Supabase
      const supabaseHealthy = await this.testSupabase();

      // Test OpenRouter
      const openRouterHealthy = this.openRouterService
        ? await this.openRouterService.healthCheck()
        : false;

      // Test Vector Search
      const vectorSearchHealthy = await this.vectorSearchService.healthCheck();

      const allHealthy =
        llamaParseHealthy &&
        supabaseHealthy &&
        openRouterHealthy &&
        vectorSearchHealthy;

      return {
        status: allHealthy ? "healthy" : "degraded",
        llamaParse: llamaParseHealthy,
        supabase: supabaseHealthy,
        openRouter: openRouterHealthy,
        vectorSearch: vectorSearchHealthy,
      };
    } catch (error) {
      console.error("❌ Health check failed:", error);
      return {
        status: "error",
        llamaParse: false,
        supabase: false,
        openRouter: false,
        vectorSearch: false,
      };
    }
  }

  /**
   * Test LlamaParse service
   */
  private async testLlamaParse(): Promise<boolean> {
    try {
      // Simple test with minimal content
      await this.llamaParseService.extractStructuredData(
        "Test content",
        "test"
      );
      return true;
    } catch (error) {
      console.error("LlamaParse test failed:", error);
      return false;
    }
  }

  /**
   * Test Supabase connection
   */
  private async testSupabase(): Promise<boolean> {
    try {
      // Test by getting documents (this will test the connection)
      await DocumentService.getUserDocuments(
        "550e8400-e29b-41d4-a716-446655440003"
      );
      return true;
    } catch (error) {
      console.error("Supabase test failed:", error);
      return false;
    }
  }
}
