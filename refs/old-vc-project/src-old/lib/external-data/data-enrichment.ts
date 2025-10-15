/**
 * External Data Enrichment Service
 * Integrates with external APIs to enhance investment and company data
 */

interface CrunchbaseCompany {
  name: string;
  website: string;
  location: string;
  founded: number;
  employees: number;
  description: string;
  funding: {
    total: number;
    rounds: number;
    lastRound: {
      date: string;
      amount: number;
      round: string;
    };
  };
}

interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  marketCap: number;
}

interface MarketData {
  sector: string;
  marketSize: number;
  growthRate: number;
  trends: string[];
  competitors: string[];
}

export class DataEnrichmentService {
  private static readonly CRUNCHBASE_API_KEY = process.env.CRUNCHBASE_API_KEY;
  private static readonly ALPHA_VANTAGE_API_KEY =
    process.env.ALPHA_VANTAGE_API_KEY;
  private static readonly NEWS_API_KEY = process.env.NEWS_API_KEY;

  /**
   * Enrich company data from Crunchbase
   */
  static async enrichCompanyData(
    companyName: string
  ): Promise<Partial<CrunchbaseCompany>> {
    try {
      const response = await fetch(
        `/api/external/crunchbase?q=${encodeURIComponent(companyName)}`
      );

      if (!response.ok) {
        throw new Error(`Crunchbase API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data?.entities?.length) {
        return {};
      }

      const data = result.data;

      if (data.entities && data.entities.length > 0) {
        const company = data.entities[0];
        return {
          name: company.properties.name,
          website: company.properties.website,
          location: company.properties.location_identifiers?.[0]?.name,
          founded: company.properties.founded_on?.year,
          employees: company.properties.num_employees,
          description: company.properties.short_description,
          funding: {
            total: company.properties.total_funding_usd,
            rounds: company.properties.num_funding_rounds,
            lastRound: {
              date: company.properties.last_funding_on,
              amount: company.properties.last_funding_amount_usd,
              round: company.properties.last_funding_type,
            },
          },
        };
      }

      return {};
    } catch (error) {
      console.error("Error enriching company data from Crunchbase:", error);
      return {};
    }
  }

  /**
   * Get market data for a company
   */
  static async getMarketData(
    companyName: string,
    sector: string
  ): Promise<MarketData | null> {
    try {
      // This would integrate with market data APIs
      // For now, return mock data structure
      return {
        sector,
        marketSize: 1000000000, // $1B market size
        growthRate: 15.5, // 15.5% growth rate
        trends: [
          "AI and automation adoption",
          "Remote work solutions",
          "Sustainability focus",
        ],
        competitors: ["Competitor A", "Competitor B", "Competitor C"],
      };
    } catch (error) {
      console.error("Error getting market data:", error);
      return null;
    }
  }

  /**
   * Get stock price data (for public companies)
   */
  static async getStockPrice(
    symbol: string
  ): Promise<AlphaVantageQuote | null> {
    try {
      const response = await fetch(
        `/api/external/alpha-vantage?symbol=${encodeURIComponent(symbol)}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data?.["Global Quote"]) {
        return null;
      }

      const quote = result.data["Global Quote"];

      if (quote && quote["01. symbol"]) {
        return {
          symbol: quote["01. symbol"],
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changePercent: quote["10. change percent"],
          volume: parseInt(quote["06. volume"]),
          marketCap: 0, // Would need additional API call
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting stock price:", error);
      return null;
    }
  }

  /**
   * Get news and sentiment for a company
   */
  static async getCompanyNews(companyName: string): Promise<any[]> {
    try {
      const response = await fetch(
        `/api/external/news?q=${encodeURIComponent(companyName)}&pageSize=10`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data.articles || [] : [];
    } catch (error) {
      console.error("Error getting company news:", error);
      return [];
    }
  }

  /**
   * Calculate risk metrics for an investment
   */
  static calculateRiskMetrics(
    investment: any,
    marketData: any
  ): {
    beta: number;
    volatility: number;
    sharpeRatio: number;
  } {
    // Simplified risk calculation
    // In a real implementation, this would use historical data
    const beta = Math.random() * 2; // 0-2 range
    const volatility = Math.random() * 0.5; // 0-50% volatility
    const sharpeRatio = (investment.irr - 0.05) / volatility; // Assuming 5% risk-free rate

    return {
      beta: Math.round(beta * 100) / 100,
      volatility: Math.round(volatility * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    };
  }

  /**
   * Enrich investment data with external information
   */
  static async enrichInvestmentData(investment: any): Promise<any> {
    const enrichedData = { ...investment };

    try {
      // Enrich company data
      const companyData = await this.enrichCompanyData(investment.companyName);
      if (companyData.name) {
        enrichedData.companyWebsite = companyData.website;
        enrichedData.companyLocation = companyData.location;
        enrichedData.companyFounded = companyData.founded;
        enrichedData.companyDescription = companyData.description;
        enrichedData.companyEmployees = companyData.employees;

        if (companyData.funding) {
          enrichedData.lastFundingAmount = companyData.funding.lastRound.amount;
          enrichedData.lastFundingDate = companyData.funding.lastRound.date;
          enrichedData.lastFundingRound = companyData.funding.lastRound.round;
        }
      }

      // Get market data
      const marketData = await this.getMarketData(
        investment.companyName,
        investment.sector
      );
      if (marketData) {
        enrichedData.marketSize = marketData.marketSize;
        enrichedData.marketShare = Math.random() * 10; // Simulated market share
        enrichedData.competitivePosition =
          marketData.competitors.length > 0 ? "Strong" : "Unknown";
      }

      // Calculate risk metrics
      const riskMetrics = this.calculateRiskMetrics(investment, marketData);
      enrichedData.beta = riskMetrics.beta;
      enrichedData.volatility = riskMetrics.volatility;
      enrichedData.sharpeRatio = riskMetrics.sharpeRatio;

      // Get news and sentiment
      const news = await this.getCompanyNews(investment.companyName);
      enrichedData.recentNews = news.slice(0, 5); // Last 5 news items

      return enrichedData;
    } catch (error) {
      console.error("Error enriching investment data:", error);
      return investment; // Return original data if enrichment fails
    }
  }

  /**
   * Batch enrich multiple investments
   */
  static async batchEnrichInvestments(investments: any[]): Promise<any[]> {
    const enrichedInvestments = [];

    for (const investment of investments) {
      try {
        const enriched = await this.enrichInvestmentData(investment);
        enrichedInvestments.push(enriched);

        // Add delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error enriching investment ${investment.id}:`, error);
        enrichedInvestments.push(investment); // Keep original if enrichment fails
      }
    }

    return enrichedInvestments;
  }

  /**
   * Get sector performance benchmarks
   */
  static async getSectorBenchmarks(sector: string): Promise<any> {
    // This would integrate with financial data APIs
    // For now, return mock benchmark data
    return {
      sector,
      benchmarkReturn: 12.5, // 12.5% annual return
      benchmarkVolatility: 18.2, // 18.2% volatility
      marketCap: 50000000000, // $50B market cap
      peRatio: 25.3,
      growthRate: 8.7,
    };
  }

  /**
   * Calculate portfolio correlation
   */
  static calculatePortfolioCorrelation(investments: any[]): number {
    // Simplified correlation calculation
    // In a real implementation, this would use historical price data
    const sectors = investments.map((inv) => inv.sector).filter(Boolean);
    const uniqueSectors = new Set(sectors);

    // Higher correlation if more investments in same sector
    return uniqueSectors.size / sectors.length;
  }
}
