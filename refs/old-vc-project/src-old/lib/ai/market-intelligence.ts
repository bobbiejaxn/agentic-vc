/**
 * VC Intelligence Market Intelligence Service
 *
 * Leverages external APIs (Exa.ai, Firecrawl, Perplexity, DeepSeek) to provide:
 * - Real-time market research and competitive intelligence
 * - Company analysis and market positioning
 * - Industry trends and news monitoring
 * - Alternative AI processing for specialized tasks
 */

import { z } from "zod";

// Exa.ai Search API Integration
interface ExaSearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate?: string;
}

interface ExaSearchResponse {
  results: ExaSearchResult[];
  requestId: string;
}

// Firecrawl Web Scraping Integration
interface FirecrawlScrapeResponse {
  success: boolean;
  data: {
    url: string;
    markdown: string;
    content: string;
    metadata: {
      title: string;
      description: string;
      sourceURL: string;
    };
  };
  error?: string;
}

// Perplexity AI Search Integration
interface PerplexityMessage {
  role: "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// DeepSeek AI Integration
interface DeepSeekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Types for our enhanced intelligence
export interface CompanyIntelligence {
  companyName: string;
  industry: string;
  fundingStage: string;
  lastFundingAmount?: number;
  lastFundingDate?: string;
  keyInvestors: string[];
  competitivePosition: string;
  marketTrends: string[];
  recentNews: Array<{
    title: string;
    url: string;
    publishedDate: string;
    summary: string;
  }>;
  confidence: number;
}

export interface MarketAnalysis {
  sector: string;
  trends: string[];
  growthRate: string;
  keyPlayers: string[];
  investmentActivity: string;
  regulatoryChanges: string[];
  confidence: number;
}

export interface CompetitorAnalysis {
  companyName: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  recentDevelopments: string[];
  fundingStatus: string;
  confidence: number;
}

/**
 * Market Intelligence Service using External APIs
 */
export class MarketIntelligenceService {
  private exaApiKey: string;
  private firecrawlApiKey: string;
  private perplexityApiKey: string;
  private deepseekApiKey: string;

  constructor() {
    this.exaApiKey = process.env.EXA_API_KEY || "";
    this.firecrawlApiKey = process.env.FIRECRAWL_API_KEY || "";
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || "";
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || "";

    // Validate required API keys
    if (!this.exaApiKey) {
      console.warn("EXA_API_KEY not found - some features may be limited");
    }
    if (!this.perplexityApiKey) {
      console.warn(
        "PERPLEXITY_API_KEY not found - some features may be limited"
      );
    }
  }

  /**
   * Enhanced Company Research using Exa.ai and Perplexity
   */
  async researchCompany(companyName: string): Promise<CompanyIntelligence> {
    try {
      let exaResults: ExaSearchResponse | null = null;
      let perplexityAnalysis: PerplexityResponse | null = null;
      let websiteData: FirecrawlScrapeResponse | null = null;

      // Use Exa.ai for comprehensive web search (if API key available)
      if (this.exaApiKey) {
        try {
          exaResults = await this.searchExaAI(
            `${companyName} funding investment venture capital news`
          );
        } catch (error) {
          console.warn(`Exa.ai search failed for ${companyName}:`, error);
        }
      }

      // Use Perplexity for AI-powered analysis (if API key available)
      if (this.perplexityApiKey) {
        try {
          perplexityAnalysis = await this.queryPerplexity(
            `Analyze ${companyName} as a startup/investment opportunity. Include:
            - Industry sector and subsector
            - Current funding stage and recent funding rounds
            - Key investors and investment amounts
            - Competitive positioning in the market
            - Recent news and developments
            - Market trends affecting this company

            Provide a comprehensive analysis with specific data points and confidence scores.`
          );
        } catch (error) {
          console.warn(`Perplexity analysis failed for ${companyName}:`, error);
        }
      }

      // Use Firecrawl to scrape company website if available
      if (this.firecrawlApiKey) {
        try {
          websiteData = await this.scrapeWithFirecrawl(
            `${companyName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")}.com`
          );
        } catch (error) {
          console.log(`Could not scrape website for ${companyName}:`, error);
        }
      }

      // If no APIs are available, return fallback data
      if (!exaResults && !perplexityAnalysis && !websiteData) {
        return this.getFallbackCompanyIntelligence(companyName);
      }

      // Process and combine results
      const intelligence = this.processCompanyIntelligence(
        companyName,
        exaResults,
        perplexityAnalysis,
        websiteData
      );

      return intelligence;
    } catch (error) {
      console.error("Company research failed:", error);
      // Return fallback data instead of throwing error
      return this.getFallbackCompanyIntelligence(companyName);
    }
  }

  /**
   * Market Analysis using Multiple APIs
   */
  async analyzeMarket(sector: string): Promise<MarketAnalysis> {
    try {
      // Use Exa.ai for market research
      const exaResults = await this.searchExaAI(
        `${sector} market trends investment activity 2024`
      );

      // Use Perplexity for market analysis
      const perplexityAnalysis = await this.queryPerplexity(
        `Provide a comprehensive market analysis for the ${sector} sector including:
        - Current market trends and growth projections
        - Key players and market leaders
        - Investment activity and funding patterns
        - Regulatory environment and changes
        - Emerging technologies and innovations
        - Market challenges and opportunities

        Focus on investment implications and VC opportunities.`
      );

      // Use DeepSeek for alternative analysis perspective
      const deepseekAnalysis = await this.queryDeepSeek(
        `Analyze the ${sector} market from an investment perspective:
        - Market size and growth rate
        - Competitive landscape
        - Investment opportunities
        - Risk factors
        - Future outlook

        Provide data-driven insights with specific metrics when possible.`
      );

      const analysis = this.processMarketAnalysis(
        sector,
        exaResults,
        perplexityAnalysis,
        deepseekAnalysis
      );
      return analysis;
    } catch (error) {
      console.error("Market analysis failed:", error);
      throw new Error(
        `Failed to analyze ${sector} market: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Competitor Analysis using All APIs
   */
  async analyzeCompetitors(companyName: string): Promise<CompetitorAnalysis[]> {
    try {
      // Get initial competitor search
      const competitors = await this.queryPerplexity(
        `List the top 5-7 competitors to ${companyName}. For each competitor, provide:
        - Company name
        - Market share or position
        - Key strengths and differentiators
        - Recent funding status
        - Notable recent news or developments

        Format as a structured list with specific data points.`
      );

      // Parse competitor names and research each
      const competitorNames = this.extractCompetitorNames(
        competitors.choices[0].message.content
      );
      const competitorAnalyses: CompetitorAnalysis[] = [];

      for (const competitor of competitorNames.slice(0, 5)) {
        try {
          const competitorData = await this.researchCompany(competitor);
          competitorAnalyses.push({
            companyName: competitor,
            marketShare: competitorData.competitivePosition || "Unknown",
            strengths: this.extractStrengths(competitorData),
            weaknesses: this.extractWeaknesses(competitorData),
            recentDevelopments: competitorData.recentNews
              .slice(0, 3)
              .map((n) => n.title),
            fundingStatus: this.determineFundingStatus(competitorData),
            confidence: competitorData.confidence,
          });
        } catch (error) {
          console.log(`Could not analyze competitor ${competitor}:`, error);
        }
      }

      return competitorAnalyses;
    } catch (error) {
      console.error("Competitor analysis failed:", error);
      throw new Error(
        `Failed to analyze competitors for ${companyName}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Enhanced News Monitoring
   */
  async getRecentNews(
    companies: string[],
    topics: string[] = []
  ): Promise<
    Array<{
      title: string;
      url: string;
      publishedDate: string;
      summary: string;
      company: string;
      relevance: number;
    }>
  > {
    try {
      const query = [...companies, ...topics].join(" OR ");
      const exaResults = await this.searchExaAI(
        `${query} news investment funding 2024`
      );

      const news = exaResults.results
        .filter((result) => this.isRecentNews(result.publishedDate))
        .map((result) => ({
          title: result.title,
          url: result.url,
          publishedDate: result.publishedDate || new Date().toISOString(),
          summary: result.content.substring(0, 200) + "...",
          company: this.identifyCompany(
            result.title + " " + result.content,
            companies
          ),
          relevance: this.calculateRelevance(result, companies, topics),
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 20);

      return news;
    } catch (error) {
      console.error("News monitoring failed:", error);
      return [];
    }
  }

  /**
   * Alternative AI Processing with DeepSeek
   */
  async processWithDeepSeek(prompt: string): Promise<string> {
    try {
      const response = await this.queryDeepSeek(prompt);
      return response.choices[0].message.content;
    } catch (error) {
      console.error("DeepSeek processing failed:", error);
      throw new Error(
        `DeepSeek processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Private helper methods

  private async searchExaAI(query: string): Promise<ExaSearchResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.exaApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          numResults: 10,
          includeText: true,
          useAutoprompt: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Exa.ai search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Exa.ai search timed out");
      }
      throw error;
    }
  }

  private async scrapeWithFirecrawl(
    url: string
  ): Promise<FirecrawlScrapeResponse> {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://${url}`,
        formats: ["markdown", "html"],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl scraping failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private async queryPerplexity(prompt: string): Promise<PerplexityResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.perplexityApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 2000,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Perplexity query failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Perplexity query timed out");
      }
      throw error;
    }
  }

  private async queryDeepSeek(prompt: string): Promise<DeepSeekResponse> {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.deepseekApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-coder",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek query failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private processCompanyIntelligence(
    companyName: string,
    exaResults: ExaSearchResponse | null,
    perplexityAnalysis: PerplexityResponse | null,
    websiteData: FirecrawlScrapeResponse | null
  ): CompanyIntelligence {
    // Process and combine data from all sources
    const combinedContent = [
      perplexityAnalysis?.choices[0]?.message?.content || "",
      ...(exaResults?.results?.map((r) => r.content) || []),
      websiteData?.data?.content || "",
    ].join("\n\n");

    return {
      companyName,
      industry: this.extractIndustry(combinedContent),
      fundingStage: this.extractFundingStage(combinedContent),
      lastFundingAmount: this.extractFundingAmount(combinedContent),
      lastFundingDate: this.extractFundingDate(combinedContent),
      keyInvestors: this.extractInvestors(combinedContent),
      competitivePosition: this.extractCompetitivePosition(combinedContent),
      marketTrends: this.extractMarketTrends(combinedContent),
      recentNews: (exaResults?.results || [])
        .filter((r) => r.publishedDate)
        .slice(0, 5)
        .map((r) => ({
          title: r.title,
          url: r.url,
          publishedDate: r.publishedDate!,
          summary: r.content.substring(0, 150) + "...",
        })),
      confidence: this.calculateConfidence(
        exaResults?.results?.length || 0,
        perplexityAnalysis?.usage?.total_tokens || 0
      ),
    };
  }

  private processMarketAnalysis(
    sector: string,
    exaResults: ExaSearchResponse,
    perplexityAnalysis: PerplexityResponse,
    deepseekAnalysis: DeepSeekResponse
  ): MarketAnalysis {
    const combinedContent = [
      perplexityAnalysis.choices[0].message.content,
      deepseekAnalysis.choices[0].message.content,
      ...exaResults.results.map((r) => r.content),
    ].join("\n\n");

    return {
      sector,
      trends: this.extractTrends(combinedContent),
      growthRate: this.extractGrowthRate(combinedContent),
      keyPlayers: this.extractKeyPlayers(combinedContent),
      investmentActivity: this.extractInvestmentActivity(combinedContent),
      regulatoryChanges: this.extractRegulatoryChanges(combinedContent),
      confidence: this.calculateConfidence(
        exaResults.results.length,
        perplexityAnalysis.usage.total_tokens +
          deepseekAnalysis.usage.total_tokens
      ),
    };
  }

  // Helper extraction methods
  private extractIndustry(content: string): string {
    const industryMatch =
      content.match(/(?:industry|sector):\s*([^\n]+)/i) ||
      content.match(/industry[:\s]+([A-Za-z\s&]+)/i);
    return industryMatch ? industryMatch[1].trim() : "Technology";
  }

  private extractFundingStage(content: string): string {
    const stageMatch =
      content.match(/(?:funding|series|stage):\s*([^\n]+)/i) ||
      content.match(/(series [a-z]|seed|pre-seed|ipo|growth)/i);
    return stageMatch ? stageMatch[1].trim() : "Unknown";
  }

  private extractFundingAmount(content: string): number | undefined {
    const amountMatch = content.match(
      /\$?(\d+(?:\.\d+)?)\s*(?:million|mm?|billion|bn?)/i
    );
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1]);
      const unit = amountMatch[2]?.toLowerCase();
      if (unit?.includes("billion")) return amount * 1000;
      if (unit?.includes("million")) return amount;
      return amount;
    }
    return undefined;
  }

  private extractFundingDate(content: string): string | undefined {
    const dateMatch = content.match(/(\d{4}-\d{2}-\d{2}|\w+ \d{4})/);
    return dateMatch ? dateMatch[1] : undefined;
  }

  private extractInvestors(content: string): string[] {
    const investorMatches = content.match(/investors?:?\s*([^\n]+)/i);
    if (!investorMatches) return [];

    const investors = investorMatches[1]
      .split(/[,;]/)
      .map((inv) => inv.trim())
      .filter((inv) => inv.length > 0);

    return investors.slice(0, 10); // Limit to top 10
  }

  private extractCompetitivePosition(content: string): string {
    const positionMatch = content.match(
      /(?:position|competitive|market share):\s*([^\n]+)/i
    );
    return positionMatch ? positionMatch[1].trim() : "Emerging player";
  }

  private extractMarketTrends(content: string): string[] {
    const trends: string[] = [];
    const trendMatches = content.match(/trends?:?\s*([^\n]+)/i);

    if (trendMatches) {
      trends.push(...trendMatches[1].split(/[,;]/).map((t) => t.trim()));
    }

    return trends.slice(0, 5);
  }

  private extractTrends(content: string): string[] {
    const trends: string[] = [];
    const trendPatterns = [
      /trends?:?\s*([^\n]+)/gi,
      /growth:?\s*([^\n]+)/gi,
      /opportunities:?\s*([^\n]+)/gi,
    ];

    trendPatterns.forEach((pattern) => {
      const matches = content.match(pattern);
      if (matches) {
        trends.push(
          ...matches.map((m) =>
            m.replace(/^(trends?|growth|opportunities?):\s*/i, "").trim()
          )
        );
      }
    });

    return [...new Set(trends)].slice(0, 10);
  }

  private extractGrowthRate(content: string): string {
    const rateMatch =
      content.match(/growth rate:?\s*([^\n]+)/i) ||
      content.match(/(\d+(?:\.\d+)?%?\s*(?:growth|cagr))/i);
    return rateMatch ? rateMatch[1].trim() : "Moderate";
  }

  private extractKeyPlayers(content: string): string[] {
    const players: string[] = [];
    const playerMatches = content.match(/key players?:?\s*([^\n]+)/i);

    if (playerMatches) {
      players.push(...playerMatches[1].split(/[,;]/).map((p) => p.trim()));
    }

    return players.slice(0, 10);
  }

  private extractInvestmentActivity(content: string): string {
    const activityMatch =
      content.match(/investment activity:?\s*([^\n]+)/i) ||
      content.match(/funding:?\s*([^\n]+)/i);
    return activityMatch ? activityMatch[1].trim() : "Active";
  }

  private extractRegulatoryChanges(content: string): string[] {
    const regulations: string[] = [];
    const regulationMatches = content.match(/regulatory?:?\s*([^\n]+)/i);

    if (regulationMatches) {
      regulations.push(
        ...regulationMatches[1].split(/[,;]/).map((r) => r.trim())
      );
    }

    return regulations.slice(0, 5);
  }

  private extractCompetitorNames(content: string): string[] {
    const companies: string[] = [];
    const companyMatches = content.match(/competitors?:?\s*([^\n]+)/i);

    if (companyMatches) {
      const competitorList = companyMatches[1];
      const companyPattern = /([A-Z][a-zA-Z\s&.-]+(?:Inc|Ltd|GmbH|AG|Corp))/g;
      let match;
      while ((match = companyPattern.exec(competitorList)) !== null) {
        companies.push(match[1].trim());
      }
    }

    return [...new Set(companies)];
  }

  private extractStrengths(intelligence: CompanyIntelligence): string[] {
    // Extract strengths from competitive position and market trends
    const strengths = intelligence.competitivePosition
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return strengths.slice(0, 5);
  }

  private extractWeaknesses(intelligence: CompanyIntelligence): string[] {
    // This would require more sophisticated analysis
    // For now, return empty array or inferred weaknesses
    return [];
  }

  private determineFundingStatus(intelligence: CompanyIntelligence): string {
    if (intelligence.lastFundingAmount && intelligence.lastFundingDate) {
      const monthsSince = this.getMonthsSince(intelligence.lastFundingDate);
      if (monthsSince < 6) return "Recently funded";
      if (monthsSince < 12) return "Well-funded";
      return "May need funding";
    }
    return "Unknown";
  }

  private isRecentNews(dateString?: string): boolean {
    if (!dateString) return false;

    try {
      const newsDate = new Date(dateString);
      const now = new Date();
      const monthsDiff =
        (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      return monthsDiff <= 6; // Consider news from last 6 months as recent
    } catch {
      return false;
    }
  }

  private identifyCompany(text: string, companies: string[]): string {
    for (const company of companies) {
      if (text.toLowerCase().includes(company.toLowerCase())) {
        return company;
      }
    }
    return "General";
  }

  private calculateRelevance(
    result: ExaSearchResult,
    companies: string[],
    topics: string[]
  ): number {
    let score = result.score;

    // Boost relevance for company matches
    for (const company of companies) {
      if (
        result.title.toLowerCase().includes(company.toLowerCase()) ||
        result.content.toLowerCase().includes(company.toLowerCase())
      ) {
        score += 0.3;
      }
    }

    // Boost relevance for topic matches
    for (const topic of topics) {
      if (
        result.title.toLowerCase().includes(topic.toLowerCase()) ||
        result.content.toLowerCase().includes(topic.toLowerCase())
      ) {
        score += 0.2;
      }
    }

    return Math.min(score, 1.0);
  }

  private getMonthsSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
  }

  private calculateConfidence(resultCount: number, tokenUsage: number): number {
    const baseConfidence = Math.min(resultCount * 0.1, 0.5); // Max 0.5 from result count
    const tokenConfidence = Math.min(tokenUsage * 0.0001, 0.3); // Max 0.3 from token usage
    return Math.min(baseConfidence + tokenConfidence + 0.2, 1.0); // Base 0.2 + max 0.8 = 1.0
  }

  private getFallbackCompanyIntelligence(
    companyName: string
  ): CompanyIntelligence {
    return {
      companyName,
      industry: "Technology",
      fundingStage: "Unknown",
      lastFundingAmount: undefined,
      lastFundingDate: undefined,
      keyInvestors: [],
      competitivePosition:
        "Data not available - API services may be unavailable",
      marketTrends: ["Market data unavailable"],
      recentNews: [],
      confidence: 0.1,
    };
  }
}
