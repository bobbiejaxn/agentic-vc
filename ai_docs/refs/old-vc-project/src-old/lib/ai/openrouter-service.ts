import { OpenAI } from "openai";

/**
 * OpenRouter Service - Reliable AI provider with multiple model access
 * Provides access to Google Gemini, OpenAI GPT-4, Claude, and other models
 */
export class OpenRouterService {
  private openai: OpenAI;
  private preferredModels: string[];

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is required");
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://vcintelligence.ai", // Optional, for analytics
        "X-Title": "VC Intelligence AI", // Optional, for analytics
      },
    });

    // Preferred models in order of reliability and performance
    // Updated with current OpenRouter model IDs as of September 2025
    this.preferredModels = [
      "google/gemini-2.5-flash-preview-09-2025", // Latest Gemini 2.5 Flash Preview
      "google/gemini-2.5-flash-lite", // Gemini 2.5 Flash-Lite (low latency, cost efficient)
      "google/gemini-2.5-pro", // Gemini 2.5 Pro (advanced reasoning)
      "google/gemini-2.0-flash", // Gemini 2.0 Flash (fully supported)
      "openai/gpt-4o", // OpenAI GPT-4 Omni
      "openai/gpt-4o-mini", // OpenAI GPT-4 Mini
      "anthropic/claude-3.5-sonnet", // Claude 3.5 Sonnet
      "anthropic/claude-3-haiku", // Claude 3 Haiku
    ];
  }

  /**
   * Process document with strategic extraction focus
   * Prioritizes Tier 1: Mission-Critical Data Points (80 fields)
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
    console.log("🤖 Processing document with OpenRouter service...");

    try {
      // Enhanced structured data analysis with strategic focus
      const enhancedStructuredData = await this.enhanceStructuredDataStrategic(
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
      console.error("❌ Error in OpenRouter service:", error);
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
      const result = await this.callOpenRouter(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
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
      const result = await this.callOpenRouter(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
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
      const result = await this.callOpenRouter(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
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
  "generatedBy": "OpenRouter AI Service"
}
`;

    try {
      const result = await this.callOpenRouter(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
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
        generatedBy: "OpenRouter AI Service",
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
        generatedBy: "OpenRouter AI Service",
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
      const result = await this.callOpenRouter(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
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
      const result = await this.callOpenRouter(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
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
   * Call OpenRouter with automatic model fallback
   */
  async callOpenRouter(prompt: string): Promise<string> {
    let lastError: Error | null = null;

    for (const model of this.preferredModels) {
      try {
        console.log(`🤖 Trying OpenRouter model: ${model}`);

        const completion = await this.openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content:
                "You are a financial document analysis expert. Extract structured data and return ONLY valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 8192,
        });

        const result = completion.choices[0]?.message?.content;
        if (result) {
          console.log(`✅ Successfully used OpenRouter model: ${model}`);
          return result;
        }
      } catch (error) {
        console.warn(`⚠️ Model ${model} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw new Error(
      `All OpenRouter models failed. Last error: ${lastError?.message}`
    );
  }

  /**
   * Enhance structured data with strategic extraction focus
   * Prioritizes Tier 1: Mission-Critical Data Points (80 fields)
   */
  private async enhanceStructuredDataStrategic(
    content: string,
    existingData: any
  ): Promise<any> {
    console.log(
      "🎯 Enhancing structured data with strategic extraction focus..."
    );

    const prompt = `
You are a financial document analysis expert specializing in VC fund reports. Your task is to extract BOTH fund-level and personal investor metrics.

DUAL-LEVEL EXTRACTION (Tier 1 - Mission Critical):

## FUND-LEVEL METRICS (Section 03 - Fund Performance Status) - HIGHEST PRIORITY
Extract these fund-wide metrics from performance tables:
- Fund Name: Name of the fund
- Fund Size: Total committed capital
- Vintage Year: Fund formation year
- Fund Currency: Base currency (EUR, USD, etc.)
- Gross IRR: Fund-level gross internal rate of return
- Net IRR: Fund-level net internal rate of return
- Gross MOIC: Fund-level gross multiple of invested capital
- TVPI: Total value to paid-in capital
- DPI: Distributions to paid-in capital
- RVPI: Residual value to paid-in capital
- Fund NAV: Total net asset value
- Cumulative Distributions: Total cash returned to all LPs
- Cumulative Called Capital: Total capital called from all LPs
- Unfunded Commitment: Remaining callable capital
- Management Fee Rate: Annual management fee percentage
- Carried Interest Rate: GP carry percentage
- Hurdle Rate: Preferred return threshold
- Investment Period End: When investment period expires
- Fund Age: Years since first closing
- Deployment Rate: Capital deployed vs committed
- Portfolio Company Count: Number of investments

## PERSONAL INVESTOR METRICS (Section 06 - Individual Capital Account) - HIGHEST PRIORITY
CRITICAL: Look for "Individual capital account" or "Investor Statement" sections with "INVESTOR" column
Extract these personal LP metrics from the INVESTOR column:
- Personal Commitment: Individual LP commitment amount (from INVESTOR column)
- Personal Called Capital: Individual capital called to date (from INVESTOR column - "Paid in Capital")
- Personal NAV: Individual share of net asset value (from INVESTOR column - "Capital account at Fair Value")
- Personal Distributions: Individual distributions received (from INVESTOR column)
- Personal Ownership %: LP percentage in fund (from INVESTOR column)
- Personal Unfunded: Remaining personal commitment (from INVESTOR column - "Unfunded Commitment available for Drawdown")
- Personal MOIC: Individual multiple of invested capital (calculate from personal data)
- Personal IRR: Individual IRR calculation (calculate from personal data)
- Investment Date: When commitment was made
- Initial Investment: First capital call amount
- Follow-on Investments: Subsequent capital calls
- Current Quarter Performance: Latest period returns
- YTD Performance: Year-to-date returns
- Since Inception Performance: Total returns since start
- Benchmark Comparison: Performance vs relevant index
- Risk Metrics: Volatility and risk measures
- Liquidity Timeline: Expected distribution schedule
- Exit Pipeline Value: Near-term exit potential
- Portfolio Concentration: Top positions as % of total
- Capital Call History: Individual call amounts and dates
- Distribution History: Individual distribution timeline

## PORTFOLIO COMPANY ESSENTIALS (35 fields)
For each portfolio company, extract:
- Company Name: Legal name
- Investment Stage: Seed, Series A, B, etc.
- Industry Sector: Primary industry classification
- Investment Date: Date of initial investment
- Original Cost: Initial investment amount
- Current Fair Value: Latest valuation
- Ownership Percentage: Fund's ownership stake
- Total Investment: Cumulative investment including follow-ons
- Unrealized Gain/Loss: Current paper gain/loss
- Multiple to Cost: Current valuation multiple
- Company Status: Active, exited, written off
- Geography: Company headquarters location
- Founding Year: Year company was founded
- Last Round Valuation: Most recent round valuation
- Last Round Date: Date of last funding
- Revenue: Latest annual revenue
- Revenue Growth: Year-over-year growth rate
- EBITDA: Earnings before interest, taxes, depreciation, amortization
- Cash Position: Current cash on balance sheet
- Burn Rate: Monthly cash consumption
- Runway: Months of cash remaining
- Employee Count: Current headcount
- Key Investors: Lead investors by round
- Board Representation: Fund board seats
- Valuation Method: How current value was determined
- Write-down Amount: Any impairments taken
- Exit Strategy: Planned exit route (IPO, M&A, etc.)
- Exit Timeline: Expected exit timeframe
- Strategic Interest: Known strategic acquirer interest
- Competitive Position: Market position assessment
- Key Risks: Primary risk factors
- Management Quality: Leadership team assessment
- Market Size: Total addressable market
- Business Model: Revenue model type
- Key Metrics: Company-specific KPIs

## CAPITAL ACTIVITY
- Capital Calls: Detailed call history with dates, amounts, purposes
- Distributions: Distribution timeline with amounts and sources
- Risk Metrics: Portfolio risk assessment
- Co-Investors: Co-investor names, types, commitments

CRITICAL: Focus on PERSONAL PORTFOLIO METRICS first - these are the most valuable for individual LPs.

Return ONLY valid JSON with the extracted data. If a field is not found, use null.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.preferredModels[0], // Use best available model
        messages: [
          {
            role: "system",
            content:
              "You are a financial document analysis expert. Extract structured data and return ONLY valid JSON.",
          },
          {
            role: "user",
            content: `${prompt}\n\nDocument Content:\n${content}\n\nExisting Data:\n${JSON.stringify(
              existingData,
              null,
              2
            )}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 8192,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const enhancedData = JSON.parse(jsonMatch[0]);
          console.log("✅ Strategic extraction completed");
          return enhancedData;
        }
      }
    } catch (error) {
      console.warn("⚠️ Strategic extraction failed:", error);
    }

    // Fallback to existing data if enhancement fails
    return existingData;
  }

  /**
   * Health check for OpenRouter service
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.callOpenRouter("Test");
      return true;
    } catch (error) {
      console.error("OpenRouter health check failed:", error);
      return false;
    }
  }
}
