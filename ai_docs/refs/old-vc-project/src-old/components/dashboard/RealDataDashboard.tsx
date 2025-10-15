"use client";

import { useState, useEffect } from "react";
import { useDevAuth } from "@/hooks/useDevAuth";

interface DashboardData {
  portfolioPerformance: {
    thisQuarter: number;
    vsSP500: number;
    bestPerformer: {
      name: string;
      gain: number;
    };
  };
  portfolioValue: {
    current: number;
    yoyGrowth: number;
    timeline: Array<{
      month: string;
      value: number;
    }>;
  };
  sectorAllocation: Array<{
    sector: string;
    percentage: number;
    value: number;
    color: string;
  }>;
  upcomingCapitalCalls: Array<{
    fundName: string;
    dueDate: string;
    amount: number;
  }>;
}

export default function RealDataDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { devUser } = useDevAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [devUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Prepare dev auth headers
      const devAuthHeaders = devUser
        ? {
            "x-dev-user-id": devUser.id,
          }
        : {};

      const response = await fetch("/api/dashboard", {
        headers: devAuthHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-foreground"></div>
        <span className="ml-2">Loading real portfolio data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200  p-4">
        <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200  p-4">
        <h3 className="text-yellow-800 font-semibold">No Data Available</h3>
        <p className="text-yellow-600 mt-1">
          No portfolio data found. Upload some documents to see your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-50 border border-green-200  p-4">
        <h2 className="text-green-800 font-semibold">✅ Real Data Dashboard</h2>
        <p className="text-green-600 text-sm mt-1">
          This dashboard is now powered by real data from your portfolio!
        </p>
      </div>

      {/* Portfolio Performance */}
      <div className="bg-white border  p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-foreground">
              +{dashboardData.portfolioPerformance.thisQuarter}%
            </div>
            <div className="text-sm text-gray-600">This Quarter</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{dashboardData.portfolioPerformance.vsVCIndustry}%
            </div>
            <div className="text-sm text-gray-600">vs VC Industry</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              +{dashboardData.portfolioPerformance.bestPerformer.gain}%
            </div>
            <div className="text-sm text-gray-600">
              {dashboardData.portfolioPerformance.bestPerformer.name}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="bg-white border  p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-foreground">
              €{(dashboardData.portfolioValue.current / 1000000).toFixed(2)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-muted-foreground">
              +{dashboardData.portfolioValue.yoyGrowth}% YoY
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Real data from {dashboardData.portfolioValue.timeline.length} months
          </div>
        </div>
      </div>

      {/* Sector Allocation */}
      <div className="bg-white border  p-6">
        <h3 className="text-lg font-semibold mb-4">Sector Allocation</h3>
        <div className="space-y-2">
          {dashboardData.sectorAllocation.map((sector, index) => (
            <div
              key={sector.sector}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: sector.color }}
                ></div>
                <span className="font-medium">{sector.sector}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-foreground">
                  {sector.percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">
                  €{(sector.value / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Capital Calls */}
      <div className="bg-white border  p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Capital Calls</h3>
        {dashboardData.upcomingCapitalCalls.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.upcomingCapitalCalls.map((call, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium">{call.fundName}</div>
                  <div className="text-sm text-gray-600">
                    Due {new Date(call.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-semibold text-red-600">
                  €{call.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No upcoming capital calls found
          </div>
        )}
      </div>

      {/* Data Source Info */}
      <div className="bg-gray-50 dark:bg-card border border-gray-200 dark:border-border  p-4">
        <h4 className="text-gray-800 dark:text-foreground font-semibold">
          Data Sources
        </h4>
        <ul className="text-gray-600 dark:text-muted-foreground text-sm mt-2 space-y-1">
          <li>• Portfolio metrics from real investment data</li>
          <li>• Sector allocation from actual company sectors</li>
          <li>• Capital calls from extracted fund documents</li>
          <li>• Performance calculations from real IRR/MOIC data</li>
        </ul>
      </div>
    </div>
  );
}
