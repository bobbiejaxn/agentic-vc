import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface PortfolioSummary {
  totalPortfolios: number;
  totalValue: number;
  totalInvested: number;
  avgIrr: number;
  avgMoic: number;
  totalInvestments: number;
  totalUnrealizedGains: number;
}

export interface SectorPerformance {
  sector: string;
  totalInvested: number;
  totalValue: number;
  avgIrr: number;
  avgMoic: number;
  investmentCount: number;
  activeInvestments: number;
}

export interface StagePerformance {
  stage: string;
  totalInvested: number;
  totalValue: number;
  avgIrr: number;
  avgMoic: number;
  investmentCount: number;
  activeInvestments: number;
}

export interface TopInvestment {
  id: string;
  companyName: string;
  sector: string;
  stage: string;
  investedAmount: number;
  currentValue: number;
  irr: number;
  moic: number;
  ownershipPercentage: number;
  investmentDate: string;
  status: string;
}

export interface AnalyticsData {
  portfolioSummary: PortfolioSummary | null;
  sectorPerformance: SectorPerformance[];
  stagePerformance: StagePerformance[];
  topInvestments: TopInvestment[];
  loading: boolean;
  error: string | null;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    portfolioSummary: null,
    sectorPerformance: [],
    stagePerformance: [],
    topInvestments: [],
    loading: true,
    error: null,
  });

  const supabase = createClientComponentClient();

  const fetchAnalyticsData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Get user for authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Fetch all analytics data in parallel with actual user ID
      const [summaryRes, sectorRes, stageRes, topInvestmentsRes] =
        await Promise.all([
          fetch("/api/analytics?type=summary", {
            headers: {
              "x-dev-user-id": user.id,
            },
          }),
          fetch("/api/analytics?type=sector-performance", {
            headers: {
              "x-dev-user-id": user.id,
            },
          }),
          fetch("/api/analytics?type=stage-performance", {
            headers: {
              "x-dev-user-id": user.id,
            },
          }),
          fetch("/api/analytics?type=top-investments&limit=10", {
            headers: {
              "x-dev-user-id": user.id,
            },
          }),
        ]);

      const [summaryData, sectorData, stageData, topInvestmentsData] =
        await Promise.all([
          summaryRes.json(),
          sectorRes.json(),
          stageRes.json(),
          topInvestmentsRes.json(),
        ]);

      // Process and transform the data
      const processedData: AnalyticsData = {
        portfolioSummary: summaryData.success
          ? {
              totalPortfolios: summaryData.data.totalPortfolios || 1,
              totalValue: summaryData.data.totalValue || 0,
              totalInvested: summaryData.data.totalInvested || 0,
              avgIrr: summaryData.data.avgIRR || 0,
              avgMoic: summaryData.data.avgMOIC || 0,
              totalInvestments: summaryData.data.totalActiveInvestments || 0,
              totalUnrealizedGains: summaryData.data.totalUnrealizedGains || 0,
            }
          : null,
        sectorPerformance: sectorData.success ? sectorData.data : [],
        stagePerformance: stageData.success ? stageData.data : [],
        topInvestments: topInvestmentsData.success
          ? topInvestmentsData.data
          : [],
        loading: false,
        error: null,
      };

      setData(processedData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch analytics data",
      }));
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    ...data,
    refetch: fetchAnalyticsData,
  };
}
