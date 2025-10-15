import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface PortfolioAnalytics {
  totalDocuments: number;
  totalValue: number;
  avgIRR: number;
  avgMOIC: number;
  avgTVPI: number;
  avgDPI: number;
  avgRVPI: number;
  avgPIC: number;
  totalActiveInvestments: number;
  totalExitedInvestments: number;
  totalUnrealizedGains: number;
  totalRealizedGains: number;
  portfolioCompanies: any[];
  capitalCalls: any[];
  distributions: any[];
  riskMetrics: any;
  coInvestors: any[];
  processingMethods: string[];
  qualityScores: number[];

  // Personal LP data (CRITICAL ADDITION)
  personalTotalCommitment: number;
  personalTotalCalledCapital: number;
  personalTotalDistributions: number;
  personalTotalNAV: number;
  personalAvgIRR: number;
  personalAvgMOIC: number;
  personalAvgTVPI: number;
  personalAvgDPI: number;
  personalAvgRVPI: number;
}

export interface SectorAnalysis {
  sector: string;
  count: number;
  totalValue: number;
  avgIRR: number;
  avgMOIC: number;
  companies: any[];
}

export interface StageAnalysis {
  stage: string;
  count: number;
  totalValue: number;
  avgIRR: number;
  avgMOIC: number;
  companies: any[];
}

export class PortfolioAnalyticsService {
  /**
   * Get comprehensive portfolio analytics using JSONB queries
   */
  static async getPortfolioAnalytics(
    userId: string
  ): Promise<PortfolioAnalytics> {
    try {
      // Get all completed documents with enhanced extraction data
      const { data: documents, error } = await supabase
        .from("documents")
        .select("id, extracted_data")
        .eq("user_id", userId)
        .eq("status", "completed")
        .not("extracted_data", "is", null);

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      if (!documents || documents.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Process enhanced data using JSONB operations
      const analytics: PortfolioAnalytics = {
        totalDocuments: documents.length,
        totalValue: 0,
        avgIRR: 0,
        avgMOIC: 0,
        avgTVPI: 0,
        avgDPI: 0,
        avgRVPI: 0,
        avgPIC: 0,
        totalActiveInvestments: 0,
        totalExitedInvestments: 0,
        totalUnrealizedGains: 0,
        totalRealizedGains: 0,
        portfolioCompanies: [],
        capitalCalls: [],
        distributions: [],
        riskMetrics: {},
        coInvestors: [],
        processingMethods: [],
        qualityScores: [],

        // Personal LP data initialization
        personalTotalCommitment: 0,
        personalTotalCalledCapital: 0,
        personalTotalDistributions: 0,
        personalTotalNAV: 0,
        personalAvgIRR: 0,
        personalAvgMOIC: 0,
        personalAvgTVPI: 0,
        personalAvgDPI: 0,
        personalAvgRVPI: 0,
      };

      // Aggregate all enhanced metrics
      documents.forEach((doc) => {
        const data = doc.extracted_data;
        if (!data) return;

        // Basic metrics from fund level
        analytics.avgIRR += data.irr || 0;
        analytics.avgMOIC += data.moic || 0;
        analytics.avgTVPI += data.tvpi || 0;
        analytics.avgDPI += data.dpi || 0;
        analytics.avgRVPI += data.rvpi || 0;

        // Personal LP data aggregation (CRITICAL FIX)
        if (data.personalCommitment) {
          analytics.personalTotalCommitment += data.personalCommitment;
        }
        if (data.personalCalledCapital) {
          analytics.personalTotalCalledCapital += data.personalCalledCapital;
        }
        if (data.personalDistributions) {
          analytics.personalTotalDistributions += data.personalDistributions;
        }
        if (data.personalNAV) {
          analytics.personalTotalNAV += data.personalNAV;
        }
        if (data.personalIRR) {
          analytics.personalAvgIRR += data.personalIRR;
        }
        if (data.personalMOIC) {
          analytics.personalAvgMOIC += data.personalMOIC;
        }
        if (data.personalTVPI) {
          analytics.personalAvgTVPI += data.personalTVPI;
        }
        if (data.personalDPI) {
          analytics.personalAvgDPI += data.personalDPI;
        }
        if (data.personalRVPI) {
          analytics.personalAvgRVPI += data.personalRVPI;
        }

        // Arrays
        if (Array.isArray(data.portfolioCompanies)) {
          analytics.portfolioCompanies.push(...data.portfolioCompanies);
        }
        if (Array.isArray(data.capitalCalls)) {
          analytics.capitalCalls.push(...data.capitalCalls);
        }
        if (Array.isArray(data.distributions)) {
          analytics.distributions.push(...data.distributions);
        }
        if (Array.isArray(data.coInvestors)) {
          analytics.coInvestors.push(...data.coInvestors);
        }

        // Risk metrics aggregation
        if (data.riskMetrics && typeof data.riskMetrics === "object") {
          analytics.riskMetrics = {
            ...analytics.riskMetrics,
            ...data.riskMetrics,
          };
        }

        // Processing methods and quality scores
        if (data.processingMethod) {
          analytics.processingMethods.push(data.processingMethod);
        }
        if (data.qualityScore) {
          analytics.qualityScores.push(data.qualityScore);
        }
      });

      // Calculate averages
      const docCount = documents.length;
      analytics.avgIRR = analytics.avgIRR / docCount;
      analytics.avgMOIC = analytics.avgMOIC / docCount;
      analytics.avgTVPI = analytics.avgTVPI / docCount;
      analytics.avgDPI = analytics.avgDPI / docCount;
      analytics.avgRVPI = analytics.avgRVPI / docCount;

      // Calculate personal LP averages
      analytics.personalAvgIRR = analytics.personalAvgIRR / docCount;
      analytics.personalAvgMOIC = analytics.personalAvgMOIC / docCount;
      analytics.personalAvgTVPI = analytics.personalAvgTVPI / docCount;
      analytics.personalAvgDPI = analytics.personalAvgDPI / docCount;
      analytics.personalAvgRVPI = analytics.personalAvgRVPI / docCount;

      // Calculate derived metrics from portfolio companies
      if (analytics.portfolioCompanies.length > 0) {
        // Calculate total portfolio value using correct field names
        analytics.totalValue = analytics.portfolioCompanies.reduce(
          (sum, company) => {
            return sum + (company.fairValueEUR || company.valuation || 0);
          },
          0
        );

        // Calculate total invested amount using correct field names
        const totalInvested = analytics.portfolioCompanies.reduce(
          (sum, company) => {
            return (
              sum + (company.totalInvestedEUR || company.investmentAmount || 0)
            );
          },
          0
        );

        // Calculate active vs exited investments
        analytics.totalActiveInvestments = analytics.portfolioCompanies.filter(
          (company) => {
            const stage = company.stage?.toLowerCase() || "";
            return (
              !stage.includes("exit") &&
              !stage.includes("returned") &&
              !stage.includes("failed")
            );
          }
        ).length;

        analytics.totalExitedInvestments = analytics.portfolioCompanies.filter(
          (company) => {
            const stage = company.stage?.toLowerCase() || "";
            return (
              stage.includes("exit") ||
              stage.includes("returned") ||
              stage.includes("failed")
            );
          }
        ).length;

        // Calculate unrealized gains (current valuation - investment amount)
        analytics.totalUnrealizedGains = analytics.portfolioCompanies.reduce(
          (sum, company) => {
            const valuation = company.fairValueEUR || company.valuation || 0;
            const investment =
              company.totalInvestedEUR || company.investmentAmount || 0;
            return sum + Math.max(0, valuation - investment);
          },
          0
        );

        // Calculate realized gains (for exited investments)
        analytics.totalRealizedGains = analytics.portfolioCompanies
          .filter((company) => {
            const stage = company.stage?.toLowerCase() || "";
            return stage.includes("exit") || stage.includes("returned");
          })
          .reduce((sum, company) => {
            const valuation = company.fairValueEUR || company.valuation || 0;
            const investment =
              company.totalInvestedEUR || company.investmentAmount || 0;
            return sum + Math.max(0, valuation - investment);
          }, 0);
      }

      return analytics;
    } catch (error) {
      console.error("Portfolio analytics error:", error);
      return this.getEmptyAnalytics();
    }
  }

  /**
   * Get sector analysis using JSONB queries
   */
  static async getSectorAnalysis(userId: string): Promise<SectorAnalysis[]> {
    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select("id, extracted_data")
        .eq("user_id", userId)
        .eq("status", "completed")
        .not("extracted_data", "is", null);

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      if (!documents || documents.length === 0) {
        return [];
      }

      // Aggregate by sector
      const sectorMap = new Map<string, SectorAnalysis>();

      documents.forEach((doc) => {
        const data = doc.extracted_data;
        if (!data || !Array.isArray(data.portfolioCompanies)) return;

        data.portfolioCompanies.forEach((company: any) => {
          const sector = company.sector || "Unknown";

          if (!sectorMap.has(sector)) {
            sectorMap.set(sector, {
              sector,
              count: 0,
              totalValue: 0,
              avgIRR: 0,
              avgMOIC: 0,
              companies: [],
            });
          }

          const sectorData = sectorMap.get(sector)!;
          sectorData.count += 1;
          sectorData.totalValue += company.fairValueEUR || company.value || 0;
          sectorData.avgIRR += company.irr || 0;
          sectorData.avgMOIC += company.grossMultiple || company.moic || 0;
          sectorData.companies.push(company);
        });
      });

      // Calculate averages and return sorted by total value
      return Array.from(sectorMap.values())
        .map((sector) => ({
          ...sector,
          avgIRR: sector.avgIRR / sector.count,
          avgMOIC: sector.avgMOIC / sector.count,
        }))
        .sort((a, b) => b.totalValue - a.totalValue);
    } catch (error) {
      console.error("Sector analysis error:", error);
      return [];
    }
  }

  /**
   * Get stage analysis using JSONB queries
   */
  static async getStageAnalysis(userId: string): Promise<StageAnalysis[]> {
    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select("id, extracted_data")
        .eq("user_id", userId)
        .eq("status", "completed")
        .not("extracted_data", "is", null);

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      if (!documents || documents.length === 0) {
        return [];
      }

      // Aggregate by stage
      const stageMap = new Map<string, StageAnalysis>();

      documents.forEach((doc) => {
        const data = doc.extracted_data;
        if (!data || !Array.isArray(data.portfolioCompanies)) return;

        data.portfolioCompanies.forEach((company: any) => {
          const stage = company.stage || "Unknown";

          if (!stageMap.has(stage)) {
            stageMap.set(stage, {
              stage,
              count: 0,
              totalValue: 0,
              avgIRR: 0,
              avgMOIC: 0,
              companies: [],
            });
          }

          const stageData = stageMap.get(stage)!;
          stageData.count += 1;
          stageData.totalValue += company.fairValueEUR || company.value || 0;
          stageData.avgIRR += company.irr || 0;
          stageData.avgMOIC += company.grossMultiple || company.moic || 0;
          stageData.companies.push(company);
        });
      });

      // Calculate averages and return sorted by total value
      return Array.from(stageMap.values())
        .map((stage) => ({
          ...stage,
          avgIRR: stage.avgIRR / stage.count,
          avgMOIC: stage.avgMOIC / stage.count,
        }))
        .sort((a, b) => b.totalValue - a.totalValue);
    } catch (error) {
      console.error("Stage analysis error:", error);
      return [];
    }
  }

  /**
   * Get top performing investments using JSONB queries
   */
  static async getTopPerformingInvestments(
    userId: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select("id, extracted_data")
        .eq("user_id", userId)
        .eq("status", "completed")
        .not("extracted_data", "is", null);

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      if (!documents || documents.length === 0) {
        return [];
      }

      // Collect all portfolio companies
      const allCompanies: any[] = [];

      documents.forEach((doc) => {
        const data = doc.extracted_data;
        if (!data || !Array.isArray(data.portfolioCompanies)) return;

        data.portfolioCompanies.forEach((company: any) => {
          allCompanies.push({
            ...company,
            fundName: data.companyName,
            documentId: doc.id,
          });
        });
      });

      // Sort by MOIC (or IRR if MOIC not available) and return top performers
      return allCompanies
        .sort(
          (a, b) =>
            (b.grossMultiple || b.moic || b.irr || 0) -
            (a.grossMultiple || a.moic || a.irr || 0)
        )
        .slice(0, limit);
    } catch (error) {
      console.error("Top investments error:", error);
      return [];
    }
  }

  /**
   * Get document processing statistics
   */
  static async getDocumentProcessingStats(userId: string): Promise<any> {
    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select("status, extracted_data")
        .eq("user_id", userId);

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      if (!documents || documents.length === 0) {
        return {
          total: 0,
          completed: 0,
          processing: 0,
          error: 0,
          uploaded: 0,
          processingMethods: {},
          avgQualityScore: 0,
        };
      }

      const stats = {
        total: documents.length,
        completed: 0,
        processing: 0,
        error: 0,
        uploaded: 0,
        processingMethods: {} as Record<string, number>,
        avgQualityScore: 0,
        qualityScores: [] as number[],
      };

      documents.forEach((doc) => {
        // Count by status
        switch (doc.status) {
          case "completed":
            stats.completed++;
            break;
          case "processing":
            stats.processing++;
            break;
          case "error":
            stats.error++;
            break;
          case "uploaded":
            stats.uploaded++;
            break;
        }

        // Count processing methods
        if (doc.extracted_data?.processingMethod) {
          stats.processingMethods[doc.extracted_data.processingMethod] =
            (stats.processingMethods[doc.extracted_data.processingMethod] ||
              0) + 1;
        }

        // Collect quality scores
        if (doc.extracted_data?.qualityScore) {
          stats.qualityScores.push(doc.extracted_data.qualityScore);
        }
      });

      // Calculate average quality score
      if (stats.qualityScores.length > 0) {
        stats.avgQualityScore =
          stats.qualityScores.reduce((sum, score) => sum + score, 0) /
          stats.qualityScores.length;
      }

      return stats;
    } catch (error) {
      console.error("Document processing stats error:", error);
      return {
        total: 0,
        completed: 0,
        processing: 0,
        error: 0,
        uploaded: 0,
        processingMethods: {},
        avgQualityScore: 0,
      };
    }
  }

  /**
   * Get empty analytics for when no data is available
   */
  private static getEmptyAnalytics(): PortfolioAnalytics {
    return {
      totalDocuments: 0,
      totalValue: 0,
      avgIRR: 0,
      avgMOIC: 0,
      avgTVPI: 0,
      avgDPI: 0,
      avgRVPI: 0,
      avgPIC: 0,
      totalActiveInvestments: 0,
      totalExitedInvestments: 0,
      totalUnrealizedGains: 0,
      totalRealizedGains: 0,
      portfolioCompanies: [],
      capitalCalls: [],
      distributions: [],
      riskMetrics: {},
      coInvestors: [],
      processingMethods: [],
      qualityScores: [],

      // Personal LP data initialization
      personalTotalCommitment: 0,
      personalTotalCalledCapital: 0,
      personalTotalDistributions: 0,
      personalTotalNAV: 0,
      personalAvgIRR: 0,
      personalAvgMOIC: 0,
      personalAvgTVPI: 0,
      personalAvgDPI: 0,
      personalAvgRVPI: 0,
    };
  }
}
