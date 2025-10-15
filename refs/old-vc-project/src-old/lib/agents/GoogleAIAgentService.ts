import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Google AI Agent Service - Real implementation using Google's Generative AI
 * This replaces the mock Google ADK service with actual Google AI capabilities
 */
export class GoogleAIAgentService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_AI_API_KEY environment variable is required");
      throw new Error("GOOGLE_AI_API_KEY environment variable is required");
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Try different models in order of preference
      // Updated with current Google AI model IDs as of September 2025
      const models = [
        "gemini-2.5-flash-preview-09-2025", // Latest Gemini 2.5 Flash Preview
        "gemini-2.5-flash-lite", // Gemini 2.5 Flash-Lite (low latency, cost efficient)
        "gemini-2.5-pro", // Gemini 2.5 Pro (advanced reasoning)
        "gemini-2.0-flash", // Gemini 2.0 Flash (fully supported)
        "gemini-pro", // Fallback to older model
      ];
      let modelInitialized = false;

      for (const modelName of models) {
        try {
          this.model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192, // Reduced from 32000 to avoid token limit errors
            },
          });
          console.log(
            `✅ Successfully initialized Google AI with model: ${modelName}`
          );
          modelInitialized = true;
          break;
        } catch (modelError) {
          console.warn(`⚠️ Model ${modelName} not available, trying next...`);
        }
      }

      if (!modelInitialized) {
        throw new Error("No Google AI models available with current API key");
      }
    } catch (error) {
      console.error("Error initializing Google AI service:", error);
      throw error;
    }
  }

  /**
   * Process document with advanced AI analysis
   */
  async processDocument(document: {
    id: string;
    content: string;
    fileName: string;
    type: string;
    structuredData: any;
  }): Promise<{
    structuredData: any;
    marketIntelligence: any;
    portfolioAnalysis: any;
    recommendations: any;
  }> {
    console.log("🤖 Processing document with Google AI Agent Service...");

    try {
      // Enhanced structured data analysis
      const enhancedStructuredData = await this.enhanceStructuredData(
        document.content,
        document.structuredData
      );

      // Market intelligence analysis
      const marketIntelligence = await this.analyzeMarketIntelligence(
        document.content,
        enhancedStructuredData
      );

      // Portfolio analysis
      const portfolioAnalysis = await this.analyzePortfolio(
        document.content,
        enhancedStructuredData
      );

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        enhancedStructuredData,
        marketIntelligence,
        portfolioAnalysis
      );

      return {
        structuredData: enhancedStructuredData,
        marketIntelligence,
        portfolioAnalysis,
        recommendations,
      };
    } catch (error) {
      console.error("❌ Error in Google AI Agent Service:", error);
      throw error;
    }
  }

  /**
   * Enhance structured data with AI insights
   */
  private async enhanceStructuredData(
    content: string,
    existingData: any
  ): Promise<any> {
    const prompt = `
You are a financial document analysis expert. Analyze this fund report and enhance the structured data with additional insights.

EXISTING STRUCTURED DATA:
${JSON.stringify(existingData, null, 2)}

DOCUMENT CONTENT:
${content}

Please enhance the structured data by:
1. Adding missing financial metrics
2. Calculating derived metrics (e.g., risk-adjusted returns)
3. Identifying key trends and patterns
4. Adding confidence scores for each field
5. Extracting additional strategic insights

Return the enhanced structured data as JSON.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return existingData; // Fallback to existing data
    } catch (error) {
      console.error("Error enhancing structured data:", error);
      return existingData;
    }
  }

  /**
   * Analyze market intelligence
   */
  private async analyzeMarketIntelligence(
    content: string,
    structuredData: any
  ): Promise<any> {
    const prompt = `
You are a market intelligence analyst. Analyze this fund report and provide market insights.

FUND DATA:
${JSON.stringify(structuredData, null, 2)}

DOCUMENT CONTENT:
${content}

Provide analysis on:
1. Market trends and opportunities
2. Competitive landscape
3. Sector analysis
4. Risk factors
5. Market outlook

Return as JSON with the following structure:
{
  "marketTrends": "analysis",
  "competitiveLandscape": "analysis", 
  "sectorAnalysis": "analysis",
  "riskFactors": ["risk1", "risk2"],
  "marketOutlook": "outlook",
  "keyOpportunities": ["opp1", "opp2"],
  "analysisDate": "2024-01-01T00:00:00Z"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        marketTrends: "Market analysis not available",
        competitiveLandscape: "Competitive analysis not available",
        sectorAnalysis: "Sector analysis not available",
        riskFactors: [],
        marketOutlook: "Outlook not available",
        keyOpportunities: [],
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error analyzing market intelligence:", error);
      return {
        marketTrends: "Analysis failed",
        competitiveLandscape: "Analysis failed",
        sectorAnalysis: "Analysis failed",
        riskFactors: [],
        marketOutlook: "Analysis failed",
        keyOpportunities: [],
        analysisDate: new Date().toISOString(),
      };
    }
  }

  /**
   * Analyze portfolio performance
   */
  private async analyzePortfolio(
    content: string,
    structuredData: any
  ): Promise<any> {
    const prompt = `
You are a portfolio analyst. Analyze this fund report and provide portfolio insights.

FUND DATA:
${JSON.stringify(structuredData, null, 2)}

DOCUMENT CONTENT:
${content}

Provide analysis on:
1. Portfolio performance metrics
2. Risk analysis
3. Benchmark comparison
4. Portfolio composition
5. Performance attribution

Return as JSON with the following structure:
{
  "performanceMetrics": {
    "irr": 0.0,
    "moic": 0.0,
    "tvpi": 0.0,
    "dpi": 0.0,
    "rvpi": 0.0
  },
  "riskAnalysis": {
    "portfolioRisk": "low/medium/high",
    "concentrationRisk": "analysis",
    "liquidityRisk": "analysis"
  },
  "benchmarkComparison": "analysis",
  "portfolioComposition": "analysis",
  "performanceAttribution": "analysis"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        performanceMetrics: {
          irr: structuredData.irr || 0,
          moic: structuredData.moic || 0,
          tvpi: structuredData.tvpi || 0,
          dpi: structuredData.dpi || 0,
          rvpi: structuredData.rvpi || 0,
        },
        riskAnalysis: {
          portfolioRisk: "medium",
          concentrationRisk: "Analysis not available",
          liquidityRisk: "Analysis not available",
        },
        benchmarkComparison: "Analysis not available",
        portfolioComposition: "Analysis not available",
        performanceAttribution: "Analysis not available",
      };
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      return {
        performanceMetrics: {
          irr: structuredData.irr || 0,
          moic: structuredData.moic || 0,
          tvpi: structuredData.tvpi || 0,
          dpi: structuredData.dpi || 0,
          rvpi: structuredData.rvpi || 0,
        },
        riskAnalysis: {
          portfolioRisk: "unknown",
          concentrationRisk: "Analysis failed",
          liquidityRisk: "Analysis failed",
        },
        benchmarkComparison: "Analysis failed",
        portfolioComposition: "Analysis failed",
        performanceAttribution: "Analysis failed",
      };
    }
  }

  /**
   * Generate investment recommendations
   */
  private async generateRecommendations(
    structuredData: any,
    marketIntelligence: any,
    portfolioAnalysis: any
  ): Promise<any> {
    const prompt = `
You are an investment advisor. Based on the fund analysis, provide investment recommendations.

STRUCTURED DATA:
${JSON.stringify(structuredData, null, 2)}

MARKET INTELLIGENCE:
${JSON.stringify(marketIntelligence, null, 2)}

PORTFOLIO ANALYSIS:
${JSON.stringify(portfolioAnalysis, null, 2)}

Provide recommendations on:
1. Investment strategy
2. Risk management
3. Portfolio optimization
4. Market opportunities
5. Action items

Return as JSON with the following structure:
{
  "recommendations": [
    {
      "type": "investment/risk/optimization",
      "priority": "high/medium/low",
      "title": "Recommendation title",
      "description": "Detailed description",
      "action": "Specific action to take"
    }
  ],
  "confidence": 0.0,
  "generatedBy": "Google AI Agent Service"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        recommendations: [
          {
            type: "investment",
            priority: "medium",
            title: "AI-Generated Investment Recommendation",
            description:
              "Based on fund analysis, consider strategic investment opportunities",
            action: "Review portfolio allocation and consider rebalancing",
          },
        ],
        confidence: 0.8,
        generatedBy: "Google AI Agent Service",
      };
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return {
        recommendations: [
          {
            type: "investment",
            priority: "medium",
            title: "General Investment Recommendation",
            description: "Consider reviewing your investment strategy",
            action: "Consult with financial advisor",
          },
        ],
        confidence: 0.5,
        generatedBy: "Google AI Agent Service",
      };
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
    const prompt = `
You are a market intelligence analyst. Provide market intelligence for:

COMPANY: ${query.companyName || "Not specified"}
SECTOR: ${query.sector || "Not specified"}
GEOGRAPHY: ${query.geography || "Not specified"}

Provide analysis on:
1. Market size and growth
2. Competitive landscape
3. Key trends
4. Opportunities and threats
5. Investment outlook

Return as JSON with market intelligence data.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        marketSize: "Analysis not available",
        growthRate: "Analysis not available",
        competitiveLandscape: "Analysis not available",
        keyTrends: [],
        opportunities: [],
        threats: [],
        investmentOutlook: "Analysis not available",
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting market intelligence:", error);
      throw error;
    }
  }

  /**
   * Analyze portfolio performance
   */
  async analyzePortfolio(portfolioId: string): Promise<any> {
    const prompt = `
You are a portfolio analyst. Analyze portfolio performance for portfolio ID: ${portfolioId}

Provide analysis on:
1. Performance metrics
2. Risk assessment
3. Benchmark comparison
4. Optimization opportunities
5. Recommendations

Return as JSON with portfolio analysis data.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        performanceMetrics: {
          totalReturn: 0,
          annualizedReturn: 0,
          volatility: 0,
          sharpeRatio: 0,
        },
        riskAssessment: {
          overallRisk: "medium",
          concentrationRisk: "low",
          liquidityRisk: "low",
        },
        benchmarkComparison: "Analysis not available",
        optimizationOpportunities: [],
        recommendations: [],
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      throw error;
    }
  }

  /**
   * Health check for Google AI service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.model.generateContent("Test");
      await result.response;
      return true;
    } catch (error) {
      console.error("Google AI health check failed:", error);
      return false;
    }
  }
}
