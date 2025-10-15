import type {
  EnhancedCompanyData,
  SectorAnalysis,
  StageAnalysis,
  ExternalDataEnrichment,
} from "./types/analysis";

/**
 * External Data Enrichment Service
 *
 * Leverages external APIs (Exa.ai, Firecrawl) to enrich portfolio analysis
 * with real-time market data, company information, and sector insights.
 */
export class ExternalDataEnrichmentService {
  private exaApiKey: string;
  private firecrawlApiKey: string;

  constructor() {
    this.exaApiKey = process.env.EXA_API_KEY || "";
    this.firecrawlApiKey = process.env.FIRECRAWL_API_KEY || "";
  }

  /**
   * Enrich portfolio companies with external data
   */
  async enrichPortfolioCompanies(
    companies: EnhancedCompanyData[]
  ): Promise<EnhancedCompanyData[]> {
    const enrichedCompanies: EnhancedCompanyData[] = [];

    for (const company of companies) {
      try {
        // Get company data from Exa.ai
        const companyData = await this.getCompanyDataFromExa(company.name);

        // Get additional web data from Firecrawl
        const webData = await this.getCompanyWebData(company.name);

        // Merge external data with existing company data
        const enrichedCompany: EnhancedCompanyData = {
          ...company,
          performance: {
            ...company.performance,
            ...companyData.performance,
            ...webData.performance,
          },
          // Add external data fields
          externalData: {
            marketCap: companyData.marketCap,
            fundingRounds: companyData.fundingRounds,
            recentNews: webData.recentNews,
            competitors: companyData.competitors,
            sectorTrends: companyData.sectorTrends,
          },
        };

        enrichedCompanies.push(enrichedCompany);
      } catch (error) {
        console.error(`Failed to enrich company ${company.name}:`, error);
        // Keep original company data if enrichment fails
        enrichedCompanies.push(company);
      }
    }

    return enrichedCompanies;
  }

  /**
   * Enrich sector analysis with market data
   */
  async enrichSectorAnalysis(
    sectors: SectorAnalysis[]
  ): Promise<SectorAnalysis[]> {
    const enrichedSectors: SectorAnalysis[] = [];

    for (const sector of sectors) {
      try {
        // Get sector market data from Exa.ai
        const sectorData = await this.getSectorMarketData(sector.sector);

        // Get sector trends and news
        const sectorTrends = await this.getSectorTrends(sector.sector);

        const enrichedSector: SectorAnalysis = {
          ...sector,
          marketData: {
            marketSize: sectorData.marketSize,
            growthRate: sectorData.growthRate,
            keyTrends: sectorTrends.trends,
            recentNews: sectorTrends.news,
            marketLeaders: sectorData.marketLeaders,
          },
        };

        enrichedSectors.push(enrichedSector);
      } catch (error) {
        console.error(`Failed to enrich sector ${sector.sector}:`, error);
        enrichedSectors.push(sector);
      }
    }

    return enrichedSectors;
  }

  /**
   * Get company data from Exa.ai
   */
  private async getCompanyDataFromExa(companyName: string): Promise<any> {
    if (!this.exaApiKey) {
      throw new Error("Exa.ai API key not configured");
    }

    try {
      const response = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.exaApiKey,
        },
        body: JSON.stringify({
          query: `${companyName} company funding valuation market cap`,
          type: "neural",
          numResults: 10,
          useAutoprompt: true,
          includeDomains: [
            "crunchbase.com",
            "techcrunch.com",
            "bloomberg.com",
            "reuters.com",
          ],
          excludeDomains: ["linkedin.com", "facebook.com", "twitter.com"],
        }),
      });

      if (!response.ok) {
        throw new Error(`Exa.ai API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseCompanyDataFromExa(data);
    } catch (error) {
      console.error("Exa.ai API call failed:", error);
      throw error;
    }
  }

  /**
   * Get company web data from Firecrawl
   */
  private async getCompanyWebData(companyName: string): Promise<any> {
    if (!this.firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    try {
      // First, search for company website
      const searchResponse = await fetch(
        "https://api.firecrawl.dev/v1/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.firecrawlApiKey}`,
          },
          body: JSON.stringify({
            query: `${companyName} official website`,
            numResults: 3,
          }),
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`Firecrawl search error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        // Scrape the first result
        const scrapeResponse = await fetch(
          "https://api.firecrawl.dev/v1/scrape",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.firecrawlApiKey}`,
            },
            body: JSON.stringify({
              url: searchData.data[0].url,
              formats: ["markdown"],
              onlyMainContent: true,
            }),
          }
        );

        if (scrapeResponse.ok) {
          const scrapeData = await scrapeResponse.json();
          return this.parseCompanyWebData(scrapeData);
        }
      }

      return {};
    } catch (error) {
      console.error("Firecrawl API call failed:", error);
      throw error;
    }
  }

  /**
   * Get sector market data from Exa.ai
   */
  private async getSectorMarketData(sector: string): Promise<any> {
    if (!this.exaApiKey) {
      throw new Error("Exa.ai API key not configured");
    }

    try {
      const response = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.exaApiKey,
        },
        body: JSON.stringify({
          query: `${sector} sector market size growth rate 2024`,
          type: "neural",
          numResults: 8,
          useAutoprompt: true,
          includeDomains: [
            "mckinsey.com",
            "deloitte.com",
            "pwc.com",
            "kpmg.com",
            "gartner.com",
            "forrester.com",
          ],
          excludeDomains: ["linkedin.com", "facebook.com", "twitter.com"],
        }),
      });

      if (!response.ok) {
        throw new Error(`Exa.ai API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSectorMarketData(data);
    } catch (error) {
      console.error("Exa.ai sector data call failed:", error);
      throw error;
    }
  }

  /**
   * Get sector trends and news
   */
  private async getSectorTrends(sector: string): Promise<any> {
    if (!this.exaApiKey) {
      throw new Error("Exa.ai API key not configured");
    }

    try {
      const response = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.exaApiKey,
        },
        body: JSON.stringify({
          query: `${sector} sector trends news 2024 investment`,
          type: "neural",
          numResults: 6,
          useAutoprompt: true,
          includeDomains: [
            "techcrunch.com",
            "venturebeat.com",
            "forbes.com",
            "bloomberg.com",
            "reuters.com",
          ],
          excludeDomains: ["linkedin.com", "facebook.com", "twitter.com"],
        }),
      });

      if (!response.ok) {
        throw new Error(`Exa.ai API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSectorTrends(data);
    } catch (error) {
      console.error("Exa.ai trends call failed:", error);
      throw error;
    }
  }

  /**
   * Parse company data from Exa.ai response
   */
  private parseCompanyDataFromExa(data: any): any {
    const results = data.results || [];
    const companyData: any = {
      marketCap: null,
      fundingRounds: [],
      competitors: [],
      sectorTrends: [],
      performance: {},
    };

    for (const result of results) {
      const content = result.text || "";

      // Extract market cap information
      const marketCapMatch = content.match(
        /(?:market cap|valuation)[:\s]*\$?(\d+(?:\.\d+)?[BMK]?)/i
      );
      if (marketCapMatch && !companyData.marketCap) {
        companyData.marketCap = this.parseMarketCap(marketCapMatch[1]);
      }

      // Extract funding information
      const fundingMatch = content.match(
        /(?:raised|funding|investment)[:\s]*\$?(\d+(?:\.\d+)?[BMK]?)/i
      );
      if (fundingMatch) {
        companyData.fundingRounds.push({
          amount: this.parseAmount(fundingMatch[1]),
          date: this.extractDate(content),
          source: result.url,
        });
      }

      // Extract competitor mentions
      const competitorMatch = content.match(
        /(?:competitors?|rivals?)[:\s]*([^.]*)/i
      );
      if (competitorMatch) {
        const competitors = competitorMatch[1]
          .split(/[,;]/)
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        companyData.competitors.push(...competitors);
      }
    }

    return companyData;
  }

  /**
   * Parse company web data from Firecrawl
   */
  private parseCompanyWebData(data: any): any {
    const content = data.data?.markdown || "";
    const webData: any = {
      recentNews: [],
      performance: {},
    };

    // Extract recent news or updates
    const newsMatches = content.match(
      /###?\s*(?:news|updates|recent|latest)[^#]*/gi
    );
    if (newsMatches) {
      webData.recentNews = newsMatches.map((match) => ({
        title: this.extractTitle(match),
        content: match.substring(0, 200) + "...",
        date: this.extractDate(match),
      }));
    }

    // Extract performance metrics
    const revenueMatch = content.match(
      /(?:revenue|sales)[:\s]*\$?(\d+(?:\.\d+)?[BMK]?)/i
    );
    if (revenueMatch) {
      webData.performance.revenue = this.parseAmount(revenueMatch[1]);
    }

    const growthMatch = content.match(
      /(?:growth|growth rate)[:\s]*(\d+(?:\.\d+)?)%/i
    );
    if (growthMatch) {
      webData.performance.growthRate = parseFloat(growthMatch[1]);
    }

    return webData;
  }

  /**
   * Parse sector market data from Exa.ai response
   */
  private parseSectorMarketData(data: any): any {
    const results = data.results || [];
    const sectorData: any = {
      marketSize: null,
      growthRate: null,
      marketLeaders: [],
    };

    for (const result of results) {
      const content = result.text || "";

      // Extract market size
      const marketSizeMatch = content.match(
        /(?:market size|market value)[:\s]*\$?(\d+(?:\.\d+)?[BMK]?)/i
      );
      if (marketSizeMatch && !sectorData.marketSize) {
        sectorData.marketSize = this.parseAmount(marketSizeMatch[1]);
      }

      // Extract growth rate
      const growthMatch = content.match(
        /(?:growth rate|CAGR)[:\s]*(\d+(?:\.\d+)?)%/i
      );
      if (growthMatch && !sectorData.growthRate) {
        sectorData.growthRate = parseFloat(growthMatch[1]);
      }

      // Extract market leaders
      const leadersMatch = content.match(
        /(?:market leaders?|key players?)[:\s]*([^.]*)/i
      );
      if (leadersMatch) {
        const leaders = leadersMatch[1]
          .split(/[,;]/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        sectorData.marketLeaders.push(...leaders);
      }
    }

    return sectorData;
  }

  /**
   * Parse sector trends from Exa.ai response
   */
  private parseSectorTrends(data: any): any {
    const results = data.results || [];
    const trendsData: any = {
      trends: [],
      news: [],
    };

    for (const result of results) {
      const content = result.text || "";

      // Extract trends
      const trendMatch = content.match(
        /(?:trends?|key developments?)[:\s]*([^.]*)/i
      );
      if (trendMatch) {
        trendsData.trends.push({
          description: trendMatch[1].trim(),
          source: result.url,
          date: this.extractDate(content),
        });
      }

      // Extract news
      const newsMatch = content.match(
        /(?:news|recent developments?)[:\s]*([^.]*)/i
      );
      if (newsMatch) {
        trendsData.news.push({
          title: this.extractTitle(newsMatch[1]),
          content: newsMatch[1].trim(),
          source: result.url,
          date: this.extractDate(content),
        });
      }
    }

    return trendsData;
  }

  /**
   * Parse market cap value
   */
  private parseMarketCap(value: string): number {
    return this.parseAmount(value);
  }

  /**
   * Parse amount with B/M/K suffixes
   */
  private parseAmount(value: string): number {
    const num = parseFloat(value.replace(/[^\d.]/g, ""));
    const suffix = value.replace(/[\d.]/g, "").toUpperCase();

    switch (suffix) {
      case "B":
        return num * 1000000000;
      case "M":
        return num * 1000000;
      case "K":
        return num * 1000;
      default:
        return num;
    }
  }

  /**
   * Extract date from content
   */
  private extractDate(content: string): string | null {
    const dateMatch = content.match(
      /(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2}, \d{4})/
    );
    return dateMatch ? dateMatch[1] : null;
  }

  /**
   * Extract title from content
   */
  private extractTitle(content: string): string {
    const lines = content.split("\n").filter((line) => line.trim().length > 0);
    return lines[0]?.trim().substring(0, 100) || "No title";
  }
}

/**
 * Enrich analysis with external data
 * Main entry point for external data enrichment
 */
export async function enrichAnalysisWithExternalData(
  companies: EnhancedCompanyData[],
  sectors: SectorAnalysis[]
): Promise<{
  enrichedCompanies: EnhancedCompanyData[];
  enrichedSectors: SectorAnalysis[];
}> {
  const service = new ExternalDataEnrichmentService();

  const [enrichedCompanies, enrichedSectors] = await Promise.all([
    service.enrichPortfolioCompanies(companies),
    service.enrichSectorAnalysis(sectors),
  ]);

  return {
    enrichedCompanies,
    enrichedSectors,
  };
}
